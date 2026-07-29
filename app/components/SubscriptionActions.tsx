"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "error";

export default function SubscriptionActions({ isActive }: { isActive: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  async function startCheckout() {
    setStatus("loading");
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Checkout request failed");
      const { url } = (await response.json()) as { url: string };
      window.location.href = url;
    } catch {
      setStatus("error");
    }
  }

  async function openPortal() {
    setStatus("loading");
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Portal request failed");
      const { url } = (await response.json()) as { url: string };
      window.location.href = url;
    } catch {
      setStatus("error");
    }
  }

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Nothing to sign out of if Supabase isn't configured.
    }
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col gap-3">
      {isActive ? (
        <button
          type="button"
          onClick={openPortal}
          disabled={status === "loading"}
          className="rounded-md bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "loading" ? "Opening..." : "Manage Billing"}
        </button>
      ) : (
        <button
          type="button"
          onClick={startCheckout}
          disabled={status === "loading"}
          className="rounded-md bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "loading" ? "Starting checkout..." : "Subscribe"}
        </button>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-accent">
          Something went wrong. Try again.
        </p>
      )}
      <button
        type="button"
        onClick={signOut}
        className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
      >
        Log Out
      </button>
    </div>
  );
}
