import "server-only";
import Stripe from "stripe";

export function createStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured on the server");
  }
  return new Stripe(apiKey);
}
