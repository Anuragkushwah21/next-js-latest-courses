// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/blogs error", error);
    return NextResponse.json(
      { message: "Failed to load blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const id = formData.get("id") as string | null;
    const title = (formData.get("title") as string | null) || "";
    const description =
      (formData.get("description") as string | null) || "";
    const link = (formData.get("link") as string | null) || "";
    const posterFile = formData.get("posterFile") as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { message: "title and description are required" },
        { status: 400 }
      );
    }

    // ==== FILE SAVE TO public/uploads (like courses) ====
    let posterPath: string | undefined;

    if (posterFile) {
      const bytes = await posterFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const safeName = posterFile.name.replace(/\s+/g, "-");
      const filePath = path.join(uploadsDir, safeName);

      await writeFile(filePath, buffer);

      posterPath = `/uploads/${encodeURIComponent(safeName)}`;
    }
    // ====================================================

    if (id) {
      // update
      const update: any = {
        title,
        description,
      };
      if (link) update.link = link;
      else update.link = undefined;

      if (posterPath) update.poster = posterPath; // sirf naya file ho to overwrite

      const blog = await Blog.findByIdAndUpdate(id, update, {
        new: true,
      });

      if (!blog) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: blog }, { status: 200 });
    }

    // create requires poster file
    if (!posterFile || !posterPath) {
      return NextResponse.json(
        { message: "poster file is required" },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      poster: posterPath,          // e.g. "/uploads/my-blog-poster.jpg"
      link: link || undefined,
      title,
      description,
    });

    return NextResponse.json({ data: blog }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/blogs error", error);
    return NextResponse.json(
      { message: error.message || "Failed to save blog" },
      { status: 500 }
    );
  }
}