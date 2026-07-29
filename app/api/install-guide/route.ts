import { NextResponse } from "next/server";
import { generateInstallGuide } from "@/lib/installGuide";
import { requireActiveSubscription } from "@/lib/subscription";

export async function POST(request: Request) {
  const gate = await requireActiveSubscription();
  if (!gate.ok) return gate.response;

  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const steps = await generateInstallGuide(query);
    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Install guide generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate install guide" },
      { status: 502 }
    );
  }
}
