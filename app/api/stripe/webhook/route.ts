import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSubscriptionUpsert, extractSubscriptionId } from "@/lib/stripeSubscriptionSync";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Raw body, not parsed JSON — required for signature verification.
  const rawBody = await request.text();
  const stripe = createStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const subscriptionId = extractSubscriptionId(event);

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const upsert = buildSubscriptionUpsert(subscription);

      if (upsert) {
        const admin = createAdminClient();
        const { error } = await admin
          .from("subscriptions")
          .upsert(upsert, { onConflict: "user_id" });
        if (error) throw error;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    // Non-2xx tells Stripe to retry — safe, since the upsert is idempotent.
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
