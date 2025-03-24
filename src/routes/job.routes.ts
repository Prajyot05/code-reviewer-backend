import { Router } from "express";
import { getJobs, getQuestion } from "../controllers/job.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getJobs);
router.get("/:id", verifyToken, getQuestion);

export default router;
