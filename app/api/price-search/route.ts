import { NextResponse } from "next/server";
import { searchPartPrices } from "@/lib/priceSearch";
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
    const results = await searchPartPrices(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Price search failed:", error);
    return NextResponse.json(
      { error: "Failed to search for prices" },
      { status: 502 }
    );
  }
}
