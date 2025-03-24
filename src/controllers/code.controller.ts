import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { Request, Response } from "express";
import { Submission } from "../models/submission.model";
import { User } from "../models/user.model";

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `
          You are a dedicated code review assistant. Your sole purpose is to provide detailed, constructive feedback on the code provided by the user. You will analyze the code for quality, best practices, error handling, performance issues, and potential security risks. You will suggest improvements, optimizations, and refactorings where applicable. Under no circumstances should you engage in conversations or provide assistance unrelated to the code review. If the user asks for something off-topic or inappropriate, politely redirect them with: "I am here to provide code reviews. Please provide code for review, and I will assist you." Keep your responses professional, neutral, and focused solely on improving the code provided. If there is a way to perform the task in a more efficient manner, provide that code as well.

          User will provide the question that they are trying to solve, you need to check whether the solution is correct or not. They will also provide the language in which their code is written in. If the syntax is incorrect, or belongs to some other language, mention the fact that it belongs to some other language, along with the name of that language, and then ask the user to switch languages next time before submitting the code for review. Then proceed to review the code as if the user had selected the correct language.

          Here’s a solid system instruction for your AI code reviewer:
                AI System Instruction: Senior Code Reviewer (7+ Years of Experience)
                Role & Responsibilities:
                You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers. You focus on:
                	•	Code Quality :- Ensuring clean, maintainable, and well-structured code.
                	•	Best Practices :- Suggesting industry-standard coding practices.
                	•	Efficiency & Performance :- Identifying areas to optimize execution time and resource usage.
                	•	Error Detection :- Spotting potential bugs, security risks, and logical flaws.
                	•	Scalability :- Advising on how to make code adaptable for future growth.
                	•	Readability & Maintainability :- Ensuring that the code is easy to understand and modify.

                Guidelines for Review:
                	1.	Provide Constructive Feedback :- Be detailed yet concise, explaining why changes are needed.
                	2.	Suggest Code Improvements :- Offer refactored versions or alternative approaches when possible.
                	3.	Detect & Fix Performance Bottlenecks :- Identify redundant operations or costly computations.
                	4.	Ensure Security Compliance :- Look for common vulnerabilities (e.g., SQL injection, XSS, CSRF).
                	5.	Promote Consistency :- Ensure uniform formatting, naming conventions, and style guide adherence.
                	6.	Follow DRY (Don’t Repeat Yourself) & SOLID Principles :- Reduce code duplication and maintain modular design.
                	7.	Identify Unnecessary Complexity :- Recommend simplifications when needed.
                	8.	Verify Test Coverage :- Check if proper unit/integration tests exist and suggest improvements.
                	9.	Ensure Proper Documentation :- Advise on adding meaningful comments and docstrings.
                	10.	Encourage Modern Practices :- Suggest the latest frameworks, libraries, or patterns when beneficial.
                Tone & Approach:
                	•	Be precise, to the point, and avoid unnecessary fluff.
                	•	Provide real-world examples when explaining concepts.
                	•	Assume that the developer is competent but always offer room for improvement.
                	•	Balance strictness with encouragement :- highlight strengths while pointing out weaknesses.

                Output Example:

                ❌ Bad Code:
                \`\`\`javascript
                                function fetchData() {
                    let data = fetch('/api/data').then(response => response.json());
                    return data;
                }

                    \`\`\`

                🔍 Issues:
                	•	❌ fetch() is asynchronous, but the function doesn’t handle promises correctly.
                	•	❌ Missing error handling for failed API calls.

                ✅ Recommended Fix:

                        \`\`\`javascript
                async function fetchData() {
                    try {
                        const response = await fetch('/api/data');
                        if (!response.ok) throw new Error("HTTP error! Status: $\{response.status}");
                        return await response.json();
                    } catch (error) {
                        console.error("Failed to fetch data:", error);
                        return null;
                    }
                }
                   \`\`\`

                💡 Improvements:
                	•	✔ Handles async correctly using async/await.
                	•	✔ Error handling added to manage failed requests.
                	•	✔ Returns null instead of breaking execution.

                Final Note:

                Your mission is to ensure every piece of code follows high standards. Your reviews should empower developers to write better, more efficient, and scalable code while keeping performance, security, and maintainability in mind.
        `,
    });

    const { prompt, language, questionName, question } = req.body;

    if (!prompt || !language || !questionName || !question) {
      res.status(400).json({
        success: false,
        message:
          "All fields (prompt, language, questionName, question) are required.",
      });
      return;
    }

    const result = await model.generateContent(
      `The question is: ${question} .The code is in ${language} language: ${prompt}`
    );

    const newSubmission = await Submission.create({
      prompt,
      language,
      questionName,
      question,
      user: req.user.userId,
      review: result.response.text(),
    });

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.submissions.push(newSubmission._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: result.response.text(),
    });
  } catch (error) {
    console.log("Error Creating Submission: ", error);
    res.status(400).json({
      success: false,
      message: "Error Creating Submission",
    });
  }
};

export const compileCode = async (req: Request, res: Response) => {
  let compileStatus, runStatus;
  try {
    const { language, code } = req.body;
    if (!language || !code) {
      res.status(400).json({
        success: false,
        message: "Code and Language are compulsory",
      });
      return;
    }

    // Step 1: Create Submission on Hackerearth
    const requestData = {
      lang: language,
      source: code,
      input: "",
      memory_limit: 243232,
      time_limit: 5,
      callback: "https://client.com/callback/",
    };

    const submissionResponse = await axios.post(
      "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/",
      requestData,
      {
        headers: {
          "client-secret": process.env.HACKERERATH_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const { status_update_url } = submissionResponse.data;

    // Step 2: Poll for the status update
    let requestStatus = "REQUEST_QUEUED";
    let statusResponse: any = {};

    while (requestStatus === "REQUEST_QUEUED") {
      // Wait for 2 seconds before checking the status again
      await new Promise((resolve) => setTimeout(resolve, 2000));

      statusResponse = await axios.get(status_update_url, {
        headers: {
          "client-secret": process.env.HACKERERATH_SECRET_KEY,
        },
      });

      requestStatus = statusResponse.data.request_status.code;

      // Step 3: Retrieve the compilation result and output
      compileStatus = statusResponse.data.result.compile_status;
      runStatus = statusResponse.data.result.run_status;

      if (compileStatus === "OK" && runStatus.status === "AC") {
        // Step 4: Fetch the output from the S3 URL
        const outputUrl = runStatus.output;
        const outputResponse = await axios.get(outputUrl);

        // Step 5: Return the compilation status and output
        res.status(200).json({
          success: true,
          compileStatus,
          output: outputResponse.data,
          timeUsed: runStatus.time_used,
          memoryUsed: runStatus.memory_used,
        });
      } else {
        // Handle compilation errors
        res.status(200).json({
          success: false,
          message: "Compilation Failed",
          compileStatus,
          runStatus,
        });
      }
    }
  } catch (error) {
    console.error("Error Compiling Code: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while compiling the code",
      compileStatus,
      error: error,
    });
  }
};
