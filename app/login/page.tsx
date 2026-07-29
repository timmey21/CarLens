"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        setStatus("error");
        return;
      }

      window.location.href = "/account";
    } catch {
      setErrorMessage("Accounts aren't set up yet.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-black tracking-tight">
          Log In
        </h1>
        <p className="mb-8 text-center text-sm text-muted">
          Sign in to manage your subscription.
        </p>

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
            {status === "loading" ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
