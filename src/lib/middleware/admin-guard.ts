import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function adminGuard(request: NextRequest) {
  const res = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  const session = await res.json() as { user?: { role?: string } };

  if (session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return null; // null = pass through
}
