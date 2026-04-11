// models/Course.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICourse extends Document {
  banner: string;                 // URL or path
  link?: string;                  // optional
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    banner: { type: String, required: true },
    link: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    duration: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
  },
  { timestamps: true }
);

export const Course =
  (models.Course as mongoose.Model<ICourse>) || model<ICourse>("Course", CourseSchema);