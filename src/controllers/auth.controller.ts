import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user.model";
import { generateAuthToken } from "../utils/auth";
import bcrypt from "bcryptjs";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    res.status(200).json({
      success: true,
      message: `User ${email} Created Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const token = await generateAuthToken({ email, password });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ msg: "Invalid credentials" });
  }
};
