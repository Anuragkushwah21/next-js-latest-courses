import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TypingParagraph, {
  TypingLanguage,
} from "@/lib/models/TypingParagraph";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/typing?language=english|hindi
// returns { data: TypingParagraph[] }
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const language = searchParams.get("language");

    const query: any = {};

    if (language) {
      if (!["english", "hindi"].includes(language)) {
        return NextResponse.json(
          { message: "Language must be english or hindi" },
          { status: 400 }
        );
      }
      query.language = language;
    }

    const data = await TypingParagraph.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/typing error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/typing  (create OR update)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json(
        { message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    await connectDB();

    const body = await req.json();
    const { id, language, title, text } = body;

    // required fields
    if (!language || !title || !text) {
      return NextResponse.json(
        { message: "language, title and text are required" },
        { status: 400 }
      );
    }

    if (!["english", "hindi"].includes(language)) {
      return NextResponse.json(
        { message: "Language must be english or hindi" },
        { status: 400 }
      );
    }

    let paragraph;

    if (id) {
      // update
      paragraph = await TypingParagraph.findByIdAndUpdate(
        id,
        {
          language: language as TypingLanguage,
          title,
          text,
        },
        { new: true }
      );

      if (!paragraph) {
        return NextResponse.json(
          { message: "Paragraph not found" },
          { status: 404 }
        );
      }
    } else {
      // create
      paragraph = await TypingParagraph.create({
        language: language as TypingLanguage,
        title,
        text,
      });
    }

    return NextResponse.json(
      {
        message: id
          ? "Typing paragraph updated successfully"
          : "Typing paragraph created successfully",
        data: paragraph,
      },
      { status: id ? 200 : 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/typing error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}