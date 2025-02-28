import { getSessionCookie } from "better-auth";
import { NextRequest, NextResponse } from "next/server";
import { isProduction } from "./lib/utils/utils";
import Logger from "./lib/logger";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  // Log requests in production
  if (isProduction()) {
    Logger.info(
      `${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`
    );
  }

  // Not logged in and on dashboard page
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/") {
    if (sessionCookie) {
      // They are logged in
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Not logged in
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
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
