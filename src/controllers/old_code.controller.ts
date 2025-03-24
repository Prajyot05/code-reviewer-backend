// This is the old one, in which I tried to use Judge0
import axios from "axios";
import { Request, Response } from "express";

export const getSubmission = async (req: Request, res: Response) => {
  const { id: submissionId } = req.params;
  const options = {
    method: "GET",
    url: `https://${process.env.JUDGE0_API_HOST}/submissions/${submissionId}`,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": process.env.JUDGE0_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw error;
  }
};

export const createSubmission = async () => {
  const options = {
    method: "POST",
    url: `https://${process.env.JUDGE0_API_HOST}/submissions`,
    params: {
      base64_encoded: "true",
      wait: "false", // Set to 'true' if you want to wait for a result immediately
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": process.env.JUDGE0_API_HOST,
      "Content-Type": "application/json",
    },
    data: {
      language_id: 52, // Update with your desired language ID
      source_code:
        "I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=", // Example encoded source code
      stdin: "SnVkZ2Uw",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating submission:", error);
    throw error;
  }
};
