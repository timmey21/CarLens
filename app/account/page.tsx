import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/supabase/getUserSafe";
import { createStripeClient } from "@/lib/stripe";
import SubscriptionActions from "../components/SubscriptionActions";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  const supabase = await createClient();
  const user = await getUserSafe(supabase);

  if (!user) {
    redirect("/login");
  }

  const { data: row } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isActive = row?.status === "active" || row?.status === "trialing";

  let priceLabel = "";
  const priceId = process.env.STRIPE_PRICE_ID;
  if (priceId) {
    try {
      const stripe = createStripeClient();
      const price = await stripe.prices.retrieve(priceId);
      if (price.unit_amount) {
        const amount = (price.unit_amount / 100).toFixed(2);
        const interval = price.recurring?.interval ?? "month";
        priceLabel = `$${amount} / ${interval}`;
      }
    } catch (error) {
      console.error("Failed to fetch Stripe price:", error);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center gap-8 bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-black tracking-tight">
          Account
        </h1>
        <p className="mb-8 text-center text-sm text-muted">{user.email}</p>

        {checkout === "success" && !isActive && (
          <p className="mb-6 rounded-md border border-accent/40 bg-accent/[0.06] px-4 py-3 text-center text-sm text-accent">
            Activating your subscription — this can take a few seconds.
            Refresh if it doesn&apos;t update.
          </p>
        )}

        <div className="mb-8 rounded-md border border-border bg-surface px-4 py-4 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-muted">
            Subscription
          </p>
          <p className="mt-1 text-lg font-bold">
            {isActive ? "Active" : "Not subscribed"}
          </p>
          {priceLabel && !isActive && (
            <p className="mt-1 text-sm text-muted">{priceLabel}</p>
          )}
        </div>

        <SubscriptionActions isActive={isActive} />
      </div>
    </main>
  );
}
