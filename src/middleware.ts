import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env";
import { applyRateLimitHeaders, RateLimiter } from "./lib/rate-limiter";
const rateLimiters = [
  new RateLimiter({
    maxRequests: 15,
    windowSizeInSeconds: 60,
    identifier: "upload-api",
    path: "/api/upload",
  }),
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle API rate limiting
  if (pathname.startsWith("/api/")) {
    // Find the first matching rate limiter
    const rateLimiter = rateLimiters.find((limiter) =>
      limiter.matches(pathname)
    );

    if (rateLimiter) {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const result = await rateLimiter.isAllowed(ip);

      if (!result.isAllowed) {
        return applyRateLimitHeaders(
          new Response(JSON.stringify({ message: "Too Many Requests" }), {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }),
          result,
          rateLimiter.getOptions()
        );
      }

      // Let the request continue but add our rate limit headers
      const response = NextResponse.next();
      return applyRateLimitHeaders(response, result, rateLimiter.getOptions());
    }
  }

  // Handle authentication redirects
  const sessionCookie = getSessionCookie(request);

  if (pathname === "/" && env.NEXT_PUBLIC_DISABLE_LANDING) {
    return NextResponse.redirect(
      new URL(sessionCookie ? "/dashboard" : "/auth/login", request.url)
    );
  }

  // Not logged in and on dashboard page
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Continue the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include API routes in the matcher
    "/api/:path*",
    // Keep existing matchers
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
