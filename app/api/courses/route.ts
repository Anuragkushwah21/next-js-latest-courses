// app/api/courses/route.ts  (ya jahan bhi tumhara POST hai)
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/lib/models/Course";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


// GET /api/admin/courses  -> all courses
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: courses }, { status: 200 });
  } catch (error) {
    console.error("GET /api/courses error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

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

    const formData = await req.formData();

    const id = (formData.get("id") as string) || "";
    const title = (formData.get("title") as string) || "";
    const link = (formData.get("link") as string) || "";
    const description = (formData.get("description") as string) || "";
    const priceStr = (formData.get("price") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    const level = (formData.get("level") as
      | "beginner"
      | "intermediate"
      | "advanced"
      | null) || null;

    const bannerFile = formData.get("bannerFile") as File | null;

    if (!title) {
      return NextResponse.json(
        { message: "title is required" },
        { status: 400 }
      );
    }

    // ====== FILE SAVE LOGIC (PUBLIC/UPLOADS) ======
    let bannerPath: string | undefined;

    if (bannerFile) {
      const bytes = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const safeName = bannerFile.name.replace(/\s+/g, "-");
      const filePath = path.join(uploadsDir, safeName);

      await writeFile(filePath, buffer);

      // URL path jo frontend me use hoga
      bannerPath = `/uploads/${encodeURIComponent(safeName)}`;
    }
    // ==============================================

    const price =
      priceStr && !Number.isNaN(Number(priceStr))
        ? Number(priceStr)
        : undefined;

    if (id) {
      const update: any = {
        title,
        link: link || undefined,
        description: description || undefined,
        price,
        duration: duration || undefined,
        level: level || undefined,
      };

      if (bannerPath) {
        update.banner = bannerPath;
      }

      const updated = await Course.findByIdAndUpdate(id, update, {
        new: true,
      });

      if (!updated) {
        return NextResponse.json(
          { message: "Course not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Course updated", data: updated },
        { status: 200 }
      );
    }

    if (!bannerFile || !bannerPath) {
      return NextResponse.json(
        { message: "banner file is required" },
        { status: 400 }
      );
    }

    const course = await Course.create({
      banner: bannerPath,
      link: link || undefined,
      title,
      description: description || undefined,
      price,
      duration: duration || undefined,
      level: level || undefined,
    });

    return NextResponse.json(
      { message: "Course created", data: course },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/courses error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}