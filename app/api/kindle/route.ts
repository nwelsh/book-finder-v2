import { NextRequest, NextResponse } from "next/server";
import { checkKindleUnlimited } from "./kindle";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "Missing title" },
      { status: 400 }
    );
  }

  const kindleUnlimited = await checkKindleUnlimited(title);

  return NextResponse.json({
    kindleUnlimited,
  });
}