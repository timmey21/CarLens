import type Stripe from "stripe";

/**
 * Pure — builds the Checkout Session params. `subscription_data.metadata`
 * is what makes every later subscription event mappable back to the
 * Supabase user regardless of arrival order, since
 * `customer.subscription.updated`/`deleted` events don't carry
 * `client_reference_id` (that only lives on `checkout.session.completed`).
 */
export function buildCheckoutSessionParams({
  userId,
  email,
  priceId,
  siteUrl,
  customerId,
}: {
  userId: string;
  email: string;
  priceId: string;
  siteUrl: string;
  customerId?: string | null;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    ...(customerId
      ? { customer: customerId }
      : { customer_email: email || undefined }),
    subscription_data: {
      metadata: { supabase_user_id: userId },
    },
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/account?checkout=cancelled`,
  };
}

/**
 * Pure — builds the Billing Portal session params.
 */
export function buildPortalSessionParams({
  customerId,
  siteUrl,
}: {
  customerId: string;
  siteUrl: string;
}): Stripe.BillingPortal.SessionCreateParams {
  return {
    customer: customerId,
    return_url: `${siteUrl}/account`,
  };
}
