import { NextResponse } from "next/server";
import { requireUser } from "@/lib/subscription";
import { createStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { buildCheckoutSessionParams } from "@/lib/stripeCheckout";

export async function POST() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!priceId || !siteUrl) {
    return NextResponse.json(
      { error: "Checkout is not configured" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: existingRow } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", gate.user.id)
    .maybeSingle();

  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.create(
      buildCheckoutSessionParams({
        userId: gate.user.id,
        email: gate.user.email ?? "",
        priceId,
        siteUrl,
        customerId: existingRow?.stripe_customer_id,
      })
    );

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 502 }
    );
  }
}
