import { NextResponse } from "next/server";

/**
 * Returns a generic auth error.
 *
 * @returns the auth error
 */
export function authError() {
  return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
}
