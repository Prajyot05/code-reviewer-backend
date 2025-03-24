import { Router } from "express";
import {
  getJobs,
  getQuestion,
  getRandomQuestion,
} from "../controllers/job.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getJobs);
router.get("/random", verifyToken, getRandomQuestion);
router.get("/:id", verifyToken, getQuestion);

export default router;
