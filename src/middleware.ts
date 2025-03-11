import apiRequest from "@/lib/request";
import { Session } from "better-auth";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const sessionCookie = getSessionCookie(req);

  // Not logged in and on dashboard page
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname === "/") {
    if (sessionCookie) {
      // They are logged in
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      // Not logged in
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Check if the session is valid
  if (!pathname.startsWith("/dashboard") || !sessionCookie) return;
  const session: Session | undefined = await apiRequest.get(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );
  if (!session) {
    const cookieName = req.cookies
      .getAll()
      .find(cookie => cookie.name.includes("session_token"));
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    if (cookieName) response.cookies.delete(cookieName.name);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
