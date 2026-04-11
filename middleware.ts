// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  student: ["/student"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });
  const role = (token as any)?.role as string | undefined;

  // Is this a protected role route?
  const isRoleRoute = Object.values(roleRoutes).some((paths) =>
    paths.some((path) => pathname.startsWith(path))
  );

  // Not logged in trying to access role route -> send to login
  if (!token && isRoleRoute) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Logged in but wrong role -> unauthorized
  if (role) {
    for (const [r, paths] of Object.entries(roleRoutes)) {
      if (paths.some((path) => pathname.startsWith(path))) {
        if (role !== r) {
          const url = new URL("/unauthorized", request.url);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", ]
};