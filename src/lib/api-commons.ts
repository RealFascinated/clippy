import { NextRequest, NextResponse } from "next/server";
import { UserType } from "./db/schemas/auth-schema";
import { getApiUser } from "./helpers/user";

export const authError = NextResponse.json(
  { message: "Invalid Credentials" },
  { status: 401 }
);

export const notFound = NextResponse.json(
  { message: "Not Found" },
  { status: 404 }
);

export const fileExceedsUploadLimit = NextResponse.json(
  { message: "File exceeds your upload limit" },
  { status: 413 }
);

/**
 * Handles an api request with a user.
 *
 * @param request the request
 * @param handler the handler
 * @returns the response
 */
export async function handleApiRequestWithUser(
  handler: (user: UserType) => Promise<NextResponse>
) {
  try {
    const user = await getApiUser();
    return await handler(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Handles an api request.
 *
 * @param request the request
 * @param handler the handler
 * @returns the response
 */
export async function handleApiRequest(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
