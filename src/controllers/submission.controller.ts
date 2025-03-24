import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Submission } from "../models/submission.model";

export const addSubmission = async (req: Request, res: Response) => {
  const { prompt, language, questionName, question } = req.body;

  try {
    const newSubmission = new Submission({
      prompt,
      language,
      questionName,
      question,
      user: req.user.userId,
    });

    const savedSubmission = await newSubmission.save();

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.submissions.push(savedSubmission._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Submission created successfully!",
      submission: savedSubmission,
    });
  } catch (error) {
    console.error("Error adding submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    // Calculate the number of documents to skip based on the current page
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ user: req.user.userId })
      .sort({ createdAt: -1 }) // Sort in descending order by createdAt
      .skip(skip)
      .limit(limit)
      .select("questionName question createdAt")
      .exec();

    const user = await User.findById(req.user.userId);

    const totalSubmissions = user?.submissions.length || 0;

    const totalPages = Math.ceil(totalSubmissions / limit);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        totalSubmissions,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubmissionDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.log("Error Fetching Submission Details: ", error);
    res.status(200).json({
      success: false,
      message: `Error Fetching Submission Details: ${error}`,
    });
    return;
  }
};
