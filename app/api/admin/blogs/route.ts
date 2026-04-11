// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";

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

    // For now, convert file to a fake URL.
    // In real app, upload `posterFile` to Cloudinary/S3 and get URL.
    let posterUrl: string | undefined;

    if (posterFile) {
      // example: derive fake URL from name
      posterUrl = `https://example.com/uploads/${encodeURIComponent(
        posterFile.name
      )}`;
      // real upload: read file -> buffer -> provider SDK
    }

    if (id) {
      // update
      const update: any = {
        title,
        description,
      };
      if (link) update.link = link;
      else update.link = undefined;

      if (posterUrl) update.poster = posterUrl; // only overwrite if new file

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
    if (!posterFile) {
      return NextResponse.json(
        { message: "poster file is required" },
        { status: 400 }
      );
    }
    if (!posterUrl) {
      return NextResponse.json(
        { message: "Failed to process poster" },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      poster: posterUrl,
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