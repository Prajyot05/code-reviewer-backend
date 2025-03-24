import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getAllSubmissions,
  getSubmissionDetails,
} from "../controllers/submission.controller";

const router = Router();

router.get("/", verifyToken, getAllSubmissions);
router.get("/:id", verifyToken, getSubmissionDetails);

export default router;
