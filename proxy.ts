import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES  = ["/login"];
// Routes only superadmin can visit
const ADMIN_ROUTES   = ["/admin"];
// Routes guests cannot visit
const MEMBER_ROUTES  = ["/crm", "/reports", "/monitoring"];

function getRoleFromCookie(req: NextRequest): string | null {
  // The role is embedded in the oil_user cookie (JSON) set at login
  const raw = req.cookies.get("oil_user")?.value;
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)).role ?? null; }
  catch { return null; }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) return NextResponse.next();

  const token = request.cookies.get("oilintel_token")?.value;
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const role = getRoleFromCookie(request) ?? "guest";

  // Admin-only routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && role !== "superadmin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Guest cannot access member-only routes
  if (MEMBER_ROUTES.some((r) => pathname.startsWith(r)) && role === "guest") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
