import { Schema, Document, model, models } from "mongoose";

export interface IInterview extends Document {
  email: string;
  jobTitle: string;
  question: string;
  code?: string;
  language: string;
  feedback?: string;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    email: { type: String, required: true },
    jobTitle: { type: String, required: true },
    question: { type: String, required: true },
    code: { type: String, default: "" },
    language: { type: String, required: true },
    feedback: { type: String, default: "" },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Interview =
  models.Interview || model<IInterview>("Interview", InterviewSchema);
export default Interview;
