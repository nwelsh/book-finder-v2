import { NextResponse } from "next/server";
import { checkKindleUnlimited } from "@/app/api/kindle/kindle";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const result = await checkKindleUnlimited(title);

  return NextResponse.json({ kindleUnlimited: result });
}