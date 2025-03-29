import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IResetLink extends Document {
  email: string;
  link: string;
  expiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResetLinkSchema = new Schema<IResetLink>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const ResetLink =
  models.ResetLink || model<IResetLink>("ResetLink", ResetLinkSchema);
export default ResetLink;
