import { env } from "./env";
import Logger from "./logger";
import { NextResponse } from "next/server";

export interface RateLimiterOptions {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSizeInSeconds: number;

  /**
   * Unique identifier for this rate limiter (e.g., 'upload-api')
   */
  identifier: string;

  /**
   * Path pattern to match against (e.g., '/api/upload')
   * Can be a string for exact match or regex for pattern matching
   */
  path: string | RegExp;
}

interface RateLimiterResponse {
  /**
   * Whether the request is allowed
   */
  isAllowed: boolean;

  /**
   * Number of remaining requests in the current window
   */
  remainingRequests: number;

  /**
   * Time in seconds until the window resets
   */
  resetInSeconds: number;
}

class InMemoryStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  async increment(
    key: string,
    windowSizeInSeconds: number
  ): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now >= entry.resetAt) {
      // Window expired or first request
      const newEntry = { count: 1, resetAt: now + windowSizeInSeconds * 1000 };
      this.store.set(key, newEntry);
      return newEntry;
    }

    // Increment within existing window
    entry.count += 1;
    return entry;
  }

  async get(key: string): Promise<{ count: number; resetAt: number } | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Clean up expired entries
    if (Date.now() >= entry.resetAt) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }
}

export class RateLimiter {
  private store: InMemoryStore;

  constructor(private options: RateLimiterOptions) {
    this.store = new InMemoryStore();
    Logger.info(
      `Initialized rate limiter for ${options.identifier} with ${options.maxRequests} requests per ${options.windowSizeInSeconds} seconds for path ${options.path}`
    );
  }

  /**
   * Get the rate limiter options
   */
  getOptions(): RateLimiterOptions {
    return { ...this.options };
  }

  /**
   * Check if this rate limiter should handle the given path
   */
  matches(path: string): boolean {
    if (this.options.path instanceof RegExp) {
      return this.options.path.test(path);
    }
    return path.startsWith(this.options.path);
  }

  /**
   * Check if a request should be allowed for the given key
   * @param key Unique key for the request (e.g., IP address, user ID)
   */
  async isAllowed(key: string): Promise<RateLimiterResponse> {
    const finalKey = `${this.options.identifier}:${key}`;

    try {
      const result = await this.store.increment(
        finalKey,
        this.options.windowSizeInSeconds
      );
      const now = Date.now();

      const isAllowed = result.count <= this.options.maxRequests;
      const remainingRequests = Math.max(
        0,
        this.options.maxRequests - result.count
      );
      const resetInSeconds = Math.ceil((result.resetAt - now) / 1000);

      return {
        isAllowed,
        remainingRequests,
        resetInSeconds,
      };
    } catch (error) {
      // If rate limiting fails, allow the request but log the error
      Logger.error("Rate limiter error:", error);
      return {
        isAllowed: true,
        remainingRequests: this.options.maxRequests,
        resetInSeconds: this.options.windowSizeInSeconds,
      };
    }
  }
}

/**
 * Apply rate limit headers to a response
 *
 * @param response the response to apply the headers to
 * @param result the result of the rate limiter check
 * @param options the rate limiter options
 * @returns the response with the rate limit headers applied
 */
export function applyRateLimitHeaders(
  response: NextResponse | Response,
  result: {
    remainingRequests: number;
    resetInSeconds: number;
    isAllowed: boolean;
  },
  options: RateLimiterOptions
) {
  const headers = new Headers(response.headers);
  headers.set("X-RateLimit-Limit", options.maxRequests.toString());
  headers.set("X-RateLimit-Remaining", result.remainingRequests.toString());
  headers.set("X-RateLimit-Reset", result.resetInSeconds.toString());

  if (!result.isAllowed) {
    headers.set("Retry-After", result.resetInSeconds.toString());
  }

  // If it's a NextResponse, create a new one with the headers
  if (response instanceof NextResponse) {
    const newResponse = NextResponse.next();
    if (result.isAllowed) {
      headers.forEach((v, k) => newResponse.headers.set(k, v));
    }
    return newResponse;
  }

  // For regular Response objects (like our error response)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
