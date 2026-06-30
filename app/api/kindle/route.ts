import { NextRequest, NextResponse } from "next/server";
import { checkKindleUnlimited } from "./kindle";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  console.log("🔥 API ROUTE HIT:", title);

  const kindleUnlimited = await checkKindleUnlimited(title || "");

  return NextResponse.json({ kindleUnlimited });
}