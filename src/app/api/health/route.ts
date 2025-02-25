import { ApiErrorResponse, ApiSuccessResponse } from "@/type/api/responses";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  return NextResponse.json(
    { message: "OK" },
    {
      status: 200,
    }
  );
}
