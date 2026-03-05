import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authGuard } from "~/lib/middleware/auth-guard";
import { adminGuard } from "~/lib/middleware/admin-guard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-only routes
  if (pathname.startsWith("/dashboard/blog")) {
    const authResult = authGuard(request);
    if (authResult) return authResult; // not logged in → redirect to sign-in

    const adminResult = await adminGuard(request);
    if (adminResult) return adminResult; // not admin → redirect to dashboard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/blog/:path*"],
};
