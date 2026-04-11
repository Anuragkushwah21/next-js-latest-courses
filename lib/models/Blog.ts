// lib/models/Blog.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IBlog extends Document {
  poster: string;
  link?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    poster: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite in Next.js dev
export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);