import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/supabase/getUserSafe";

export default async function AuthNav() {
  let user = null;
  try {
    const supabase = await createClient();
    user = await getUserSafe(supabase);
  } catch {
    // Supabase isn't configured yet — degrade to the logged-out nav
    // rather than crashing every page.
  }

  return (
    <nav className="flex items-center justify-end gap-4 border-b border-border px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide">
      {user ? (
        <Link href="/account" className="text-muted transition hover:text-accent">
          Account
        </Link>
      ) : (
        <>
          <Link href="/login" className="text-muted transition hover:text-accent">
            Log In
          </Link>
          <Link href="/signup" className="text-accent transition hover:brightness-110">
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}
