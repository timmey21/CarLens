import type { SupabaseClient, User } from "@supabase/supabase-js";

const TIMEOUT_MS = 3000;

/**
 * Wraps `getUser()` with a timeout, treating "Supabase didn't respond in
 * time" the same as "not logged in" rather than hanging the caller
 * forever. Used only for the two soft, display-affecting reads (the
 * session-refresh proxy and the nav's logged-in check) — the actual
 * paywall gate in `lib/subscription.ts` does NOT use this, since
 * correctness matters more than responsiveness there.
 */
export async function getUserSafe(
  supabase: SupabaseClient
): Promise<User | null> {
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timed out")), TIMEOUT_MS)
      ),
    ]);
    return result.data.user;
  } catch {
    return null;
  }
}
