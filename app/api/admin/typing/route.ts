// app/api/admin/typing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TypingRecord, {
  TypingLanguage,
} from "@/lib/models/TypingRecord";

// POST: save one typing test result
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      userId,
      userName,
      language,
      title,
      wpm,
      accuracy,
      duration,
    } = body;

    if (
      !userId ||
      !language ||
      !title ||
      wpm == null ||
      accuracy == null ||
      duration == null
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["english", "hindi"].includes(language)) {
      return NextResponse.json(
        { message: "Language must be english or hindi" },
        { status: 400 }
      );
    }

    const record = await TypingRecord.create({
      userId,
      userName,
      language: language as TypingLanguage,
      title,
      wpm,
      accuracy,
      duration,
    });

    return NextResponse.json(
      { message: "Typing data saved successfully", data: record },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/typing-records error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// GET: optionally, user history fetch ke liye
// /api/typing-records?userId=...&language=hindi|english
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const language = searchParams.get("language");

    const query: any = {};
    if (userId) query.userId = userId;
    if (language) {
      if (!["english", "hindi"].includes(language)) {
        return NextResponse.json(
          { message: "Language must be english or hindi" },
          { status: 400 }
        );
      }
      query.language = language;
    }

    const data = await TypingRecord.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/typing-records error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}