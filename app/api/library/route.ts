import { NextRequest, NextResponse } from "next/server";
import { checkChicagoLibrary } from "@/app/lib/libby";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  const author = req.nextUrl.searchParams.get("author");

  if (!title) {
    return NextResponse.json(
      { error: "Missing title" },
      { status: 400 },
    );
  }

  const result = await checkChicagoLibrary(title, author ?? undefined);

  return NextResponse.json(result);
}