import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page/endpoint must stay reachable, everything else under
  // /admin and /api/admin requires a valid signed session cookie.
  const isPublic =
    pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);

  if (!valid) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
