// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // TODO: upload file to your storage and get public URL
    // const url = await uploadToCloudinary(file);

    const url =
      "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg"; // temporary

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/admin/upload error", error);
    return NextResponse.json(
      { message: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}