"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "check-email" | "error";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    if (data.session) {
      window.location.href = "/account";
      return;
    }

    setStatus("check-email");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-black tracking-tight">
          Sign Up
        </h1>
        <p className="mb-8 text-center text-sm text-muted">
          Unlocks AI parts breakdowns, price comparison, and install guides.
        </p>

        {status === "check-email" ? (
          <p className="text-center text-muted">
            Check your email for a confirmation link to finish signing up.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            />
            {status === "error" && (
              <p className="text-sm text-accent">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
            >
              {status === "loading" ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
