// app/api/auth/me/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const user: any = session.user;

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    },
    { status: 200 }
  );
}