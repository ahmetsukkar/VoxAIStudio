import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authGuard } from "~/lib/middleware/auth-guard";
import { adminGuard } from "~/lib/middleware/admin-guard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only routes
  if (
    pathname.startsWith("/dashboard/blog") ||
    pathname.startsWith("/dashboard/send-email")
  ) {
    const authResult = authGuard(request);
    if (authResult) return authResult;

    const adminResult = await adminGuard(request);
    if (adminResult) return adminResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/blog/:path*", "/dashboard/send-email/:path*"],
};
