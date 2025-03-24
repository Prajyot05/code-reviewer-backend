import { Request, Response } from "express";

const dummyJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "React and TypeScript required.",
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Node.js and MongoDB required.",
  },
  {
    id: "3",
    title: "Fullstack Developer",
    description: "React, Node.js, and Express required.",
  },
  {
    id: "4",
    title: "Mobile Developer",
    description: "iOS (Swift) and Android (Kotlin) required.",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    description: "AWS, Docker, and Kubernetes required.",
  },
  {
    id: "6",
    title: "Data Scientist",
    description: "Python, R, and Machine Learning required.",
  },
  {
    id: "7",
    title: "Product Manager",
    description: "Agile methodology and product roadmapping required.",
  },
  {
    id: "8",
    title: "UI/UX Designer",
    description: "Figma, Sketch, and Adobe XD required.",
  },
  {
    id: "9",
    title: "Quality Assurance Engineer",
    description: "Automation testing tools and Selenium required.",
  },
  {
    id: "10",
    title: "System Administrator",
    description: "Linux, Bash, and Cloud Services required.",
  },
  {
    id: "11",
    title: "Data Engineer",
    description: "ETL, SQL, and Big Data required.",
  },
  {
    id: "12",
    title: "Software Architect",
    description: "System design, scalability, and cloud architecture required.",
  },
  {
    id: "13",
    title: "Network Engineer",
    description: "Cisco, Networking protocols, and Routing required.",
  },
  {
    id: "14",
    title: "Security Engineer",
    description: "Penetration testing and cybersecurity required.",
  },
  {
    id: "15",
    title: "Cloud Engineer",
    description: "AWS, Azure, and Google Cloud Platform required.",
  },
  {
    id: "16",
    title: "Game Developer",
    description: "Unity, C#, and game design required.",
  },
  {
    id: "17",
    title: "Blockchain Developer",
    description: "Ethereum, Solidity, and Smart Contracts required.",
  },
  {
    id: "18",
    title: "Machine Learning Engineer",
    description: "TensorFlow, PyTorch, and Neural Networks required.",
  },
  {
    id: "19",
    title: "Technical Support Specialist",
    description: "Troubleshooting and customer support required.",
  },
  {
    id: "20",
    title: "Business Analyst",
    description: "Data analysis and reporting required.",
  },
];

const dummyQuestions = [
  {
    id: "1",
    name: "Reverse a string",
    question: "Write a function to reverse a string.",
  },
  {
    id: "2",
    name: "Sum of two numbers",
    question: "Write a function to find the sum of two numbers.",
  },
  {
    id: "3",
    name: "Find the maximum number",
    question: "Write a function to find the maximum number in an array.",
  },
  {
    id: "4",
    name: "Palindrome check",
    question: "Write a function to check if a string is a palindrome.",
  },
  {
    id: "5",
    name: "FizzBuzz",
    question:
      "Write a function to print 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, and 'FizzBuzz' for multiples of both.",
  },
  {
    id: "6",
    name: "Factorial",
    question: "Write a function to find the factorial of a number.",
  },
  {
    id: "7",
    name: "Count vowels",
    question: "Write a function to count the number of vowels in a string.",
  },
  {
    id: "8",
    name: "Sum of digits",
    question: "Write a function to find the sum of digits of a number.",
  },
  {
    id: "9",
    name: "Prime number check",
    question: "Write a function to check if a number is prime.",
  },
  {
    id: "10",
    name: "Reverse an array",
    question: "Write a function to reverse an array.",
  },
  {
    id: "11",
    name: "Find duplicate elements",
    question: "Write a function to find duplicate elements in an array.",
  },
  {
    id: "12",
    name: "Remove duplicates",
    question: "Write a function to remove duplicate elements from an array.",
  },
  {
    id: "13",
    name: "Merge two sorted arrays",
    question:
      "Write a function to merge two sorted arrays into one sorted array.",
  },
  {
    id: "14",
    name: "Find the missing number",
    question:
      "Write a function to find the missing number in a given array of consecutive integers.",
  },
  {
    id: "15",
    name: "Nth Fibonacci number",
    question: "Write a function to find the Nth Fibonacci number.",
  },
  {
    id: "16",
    name: "Find the second largest number",
    question: "Write a function to find the second largest number in an array.",
  },
  {
    id: "17",
    name: "Count occurrences of a character",
    question:
      "Write a function to count the occurrences of a character in a string.",
  },
  {
    id: "18",
    name: "Anagram check",
    question: "Write a function to check if two strings are anagrams.",
  },
  {
    id: "19",
    name: "Bubble sort",
    question: "Write a function to implement bubble sort on an array.",
  },
  {
    id: "20",
    name: "Binary search",
    question: "Write a function to implement binary search on a sorted array.",
  },
];

export const getJobs = (req: Request, res: Response) => {
  res.json({
    success: true,
    jobs: dummyJobs,
  });
};

export const getQuestion = (req: Request, res: Response) => {
  const { id } = req.params;
  const question = dummyQuestions.find((j) => j.id === id);
  res.json({
    success: true,
    question,
  });
};
