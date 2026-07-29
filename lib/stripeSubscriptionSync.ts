import type Stripe from "stripe";

export type SubscriptionUpsert = {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string | null;
};

/**
 * Pure — maps a freshly-retrieved Stripe Subscription into the row we
 * upsert into Supabase. Callers should always pass a subscription just
 * fetched via `stripe.subscriptions.retrieve()`, not the object embedded
 * in a webhook payload — Stripe doesn't guarantee cross-event ordering,
 * so trusting the embedded object risks a stale retry overwriting a
 * newer status. Fetching fresh makes both duplicate and out-of-order
 * webhook delivery harmless.
 *
 * Returns null if the subscription has no `supabase_user_id` metadata
 * (i.e. it wasn't created through our checkout flow) — nothing to do.
 *
 * Note: `current_period_end` lives on the subscription's first item in
 * the installed Stripe SDK version, not top-level on the subscription
 * itself (confirmed against the SDK's shipped types).
 */
export function buildSubscriptionUpsert(
  subscription: Stripe.Subscription
): SubscriptionUpsert | null {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return null;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const periodEndSeconds = subscription.items.data[0]?.current_period_end;

  return {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: periodEndSeconds
      ? new Date(periodEndSeconds * 1000).toISOString()
      : null,
  };
}

/**
 * Pure — extracts the subscription ID to look up from a webhook event,
 * or null if this event type doesn't reference one.
 */
export function extractSubscriptionId(event: Stripe.Event): string | null {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (typeof session.subscription === "string") return session.subscription;
    return session.subscription?.id ?? null;
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    return (event.data.object as Stripe.Subscription).id;
  }

  return null;
}
