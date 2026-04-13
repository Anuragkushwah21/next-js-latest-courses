// app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";

type Params = { params: { id: string } };

// PUT /api/admin/blogs/:id  -> update blog
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const { poster, link, title, description } = body;

    const blog = await Blog.findByIdAndUpdate(
      params.id,
      { poster, link, title, description },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ data: blog }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/admin/blogs/:id error", error);
    return NextResponse.json(
      { message: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/:id  -> delete blog
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

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
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