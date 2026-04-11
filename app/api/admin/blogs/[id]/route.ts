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
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const blog = await Blog.findByIdAndDelete(params.id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/admin/blogs/:id error", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}