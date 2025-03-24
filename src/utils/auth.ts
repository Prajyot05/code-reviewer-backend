// backend/services/userService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// Generate JWT token
export const generateAuthToken = async (user: {
  email: string;
  password: string;
}) => {
  const { email, password } = user;

  // Check if the user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("Invalid credentials");
  }

  // Validate the password
  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: existingUser._id },
    process.env.JWT_SECRET!,
    { expiresIn: "3d" }
  );

  return token;
};
