import { Schema, Document, models, model } from "mongoose";

export type TypingLanguage = "english" | "hindi";

export interface ITypingParagraph extends Document {
  language: TypingLanguage;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const TypingParagraphSchema = new Schema<ITypingParagraph>(
  {
    language: {
      type: String,
      enum: ["english", "hindi"],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const TypingParagraph =
  models.TypingParagraph ||
  model<ITypingParagraph>("TypingParagraph", TypingParagraphSchema);

export default TypingParagraph;