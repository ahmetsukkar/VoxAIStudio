import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authGuard } from "~/lib/middleware/auth-guard";
import { adminGuard } from "~/lib/middleware/admin-guard";
import { locales, defaultLocale } from "~/i18n/config";

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

  // Read locale from cookie
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    cookieLocale && locales.includes(cookieLocale as typeof locales[number])
      ? cookieLocale
      : defaultLocale;

  // Set locale header so next-intl can read it server-side
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: [
    "/dashboard/blog/:path*",
    "/dashboard/send-email/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};