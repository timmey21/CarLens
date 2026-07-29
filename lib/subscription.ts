import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type SubscriptionRow = { status: string };

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

/**
 * Pure — no network, no cookies. Decides access purely from the two facts
 * that matter: is there a user, and what does their subscription row say.
 */
export function evaluateAccess(
  user: User | null,
  row: SubscriptionRow | null
): { ok: true } | { ok: false; httpStatus: 401 | 403 } {
  if (!user) {
    return { ok: false, httpStatus: 401 };
  }
  if (!row || !ACTIVE_STATUSES.has(row.status)) {
    return { ok: false, httpStatus: 403 };
  }
  return { ok: true };
}

function errorResponse(httpStatus: 401 | 403 | 500, message?: string): NextResponse {
  const fallback =
    httpStatus === 401
      ? "Sign in required"
      : httpStatus === 403
        ? "An active subscription is required"
        : "Accounts are not configured yet";
  return NextResponse.json({ error: message ?? fallback }, { status: httpStatus });
}

/**
 * Logged-in check only — used by the checkout/portal routes, which need a
 * user but not an active subscription (you need to be logged in to start
 * paying, obviously not already subscribed).
 *
 * Wrapped in try/catch: if Supabase env vars aren't set yet (or any other
 * unexpected failure), this must return a clean JSON error rather than
 * throw — an uncaught throw here crashes the whole route handler with
 * Next.js's generic "Internal Server Error" page instead of a usable
 * response.
 */
export async function requireUser(): Promise<
  { ok: true; user: User } | { ok: false; response: NextResponse }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, response: errorResponse(401) };
    }
    return { ok: true, user };
  } catch (error) {
    console.error("requireUser failed:", error);
    return { ok: false, response: errorResponse(500) };
  }
}

/**
 * Full gate for the AI-calling routes: logged in AND an active/trialing
 * subscription row.
 */
export async function requireActiveSubscription(): Promise<
  { ok: true; user: User } | { ok: false; response: NextResponse }
> {
  const userCheck = await requireUser();
  if (!userCheck.ok) return userCheck;

  try {
    const supabase = await createClient();
    // .maybeSingle(), not .single() — every brand-new signup has zero rows,
    // which is a valid "not subscribed yet" state, not an error.
    const { data: row } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userCheck.user.id)
      .maybeSingle();

    const access = evaluateAccess(userCheck.user, row);
    if (!access.ok) {
      return { ok: false, response: errorResponse(access.httpStatus) };
    }
    return { ok: true, user: userCheck.user };
  } catch (error) {
    console.error("requireActiveSubscription failed:", error);
    return { ok: false, response: errorResponse(500) };
  }
}
