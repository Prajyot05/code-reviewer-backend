import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
