// models/TypingRecord.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export type TypingLanguage = "english" | "hindi";

export interface ITypingRecord extends Document {
  userId: string;
  userName?: string;
  language: TypingLanguage;
  title: string;
  wpm: number;
  accuracy: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const TypingRecordSchema = new Schema<ITypingRecord>(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String },
    language: { type: String, enum: ["english", "hindi"], required: true, index: true },
    title: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.TypingRecord || model<ITypingRecord>("TypingRecord", TypingRecordSchema);