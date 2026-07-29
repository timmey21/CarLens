import { NextResponse } from "next/server";
import { requireUser } from "@/lib/subscription";
import { createStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { buildPortalSessionParams } from "@/lib/stripeCheckout";

export async function POST() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json(
      { error: "Billing portal is not configured" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", gate.user.id)
    .maybeSingle();

  if (!row?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account yet — subscribe first" },
      { status: 400 }
    );
  }

  try {
    const stripe = createStripeClient();
    const session = await stripe.billingPortal.sessions.create(
      buildPortalSessionParams({ customerId: row.stripe_customer_id, siteUrl })
    );
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create portal session:", error);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 502 }
    );
  }
}
