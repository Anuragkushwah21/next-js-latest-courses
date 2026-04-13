import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TypingParagraph, { TypingLanguage } from "@/lib/models/TypingParagraph";
import { requireAdmin } from "@/lib/auth-helpers";

type Params = {
  params: { id: string };
};

// DELETE /api/typing/:id
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id } = await params;

    const blog = await TypingParagraph.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Typing Paragraph not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: blog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/typing/:id  -> edit/update
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const adminCheck = await requireAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json(
        { message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    await connectDB();

    const { id } = params;
    const body = await req.json();
    const { language, title, text } = body;

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

    const updated = await TypingParagraph.findByIdAndUpdate(
      id,
      {
        language: language as TypingLanguage,
        title,
        text,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Paragraph not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Paragraph updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/admin/typing/[id] error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}