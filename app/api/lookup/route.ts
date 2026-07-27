import { NextResponse } from "next/server";
import { generateCarProfile } from "@/lib/openaiLookup";

export async function POST(request: Request) {
  let body: { query?: string; label?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const label = body.label?.trim();
  const query = body.query?.trim() ?? "";

  if (!label) {
    return NextResponse.json({ error: "Missing label" }, { status: 400 });
  }

  try {
    const car = await generateCarProfile(query, label);
    return NextResponse.json({ car });
  } catch (error) {
    console.error("AI lookup failed:", error);
    return NextResponse.json(
      { error: "Failed to generate car breakdown" },
      { status: 502 }
    );
  }
}
