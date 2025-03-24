import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import codeRoutes from "./routes/code.routes";
import submissionRoutes from "./routes/submission.routes";
import { connectToDB } from "./utils/db";

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

connectToDB();

// Endpoints for jobs and code submission
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
