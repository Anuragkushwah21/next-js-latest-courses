// lib/auth-helpers.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || (token as any).role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden: Admin only" };
  }
  return { ok: true as const, token };
}