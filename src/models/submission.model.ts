import { Schema, model, Types } from "mongoose";

export interface ISubmission {
  prompt: string;
  language: string;
  questionName: string;
  question: string;
  review: string;
  user: Types.ObjectId;
}

const submissionSchema = new Schema<ISubmission>(
  {
    prompt: { type: String, required: true },
    language: { type: String, required: true },
    questionName: { type: String, required: true },
    question: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Submission = model<ISubmission>("Submission", submissionSchema);
