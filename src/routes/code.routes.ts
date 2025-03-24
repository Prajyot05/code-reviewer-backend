import { Router } from "express";
import { compileCode, createSubmission } from "../controllers/code.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/submit", verifyToken, createSubmission);
router.post("/compile", compileCode);

export default router;
