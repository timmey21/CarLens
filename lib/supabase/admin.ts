import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security entirely. Only ever
 * import this from the Stripe webhook route, which is the one place a
 * subscription row is allowed to be written (driven by a verified Stripe
 * event, never by a client's say-so). The `server-only` import above turns
 * an accidental client-side import of this file into a build failure
 * instead of a leaked service-role key.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
