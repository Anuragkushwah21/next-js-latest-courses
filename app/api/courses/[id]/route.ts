// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/lib/models/Course";
import { requireAdmin } from "@/lib/auth-helpers";

type RouteParams = { params: { id: string } };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: course }, { status: 200 });
  } catch (error) {
    console.error("GET /api/courses/[id] error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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

    const { banner, link, title, description, price, duration, level } = body;

    const updated = await Course.findByIdAndUpdate(
      id,
      {
        ...(banner !== undefined && { banner }),
        ...(link !== undefined && { link }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(level !== undefined && { level }),
      },
      { new: true }
    );

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
  } catch (error) {
    console.error("PUT /api/courses/[id] error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}