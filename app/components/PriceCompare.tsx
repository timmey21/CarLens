"use client";

import { useState } from "react";
import Link from "next/link";
import type { PriceResult } from "@/lib/priceSearch";
import { getCachedPriceResults, cachePriceResults } from "@/lib/priceCache";
import { AuthGateError, throwIfGated } from "@/lib/authGate";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: PriceResult[] }
  | { status: "gated" }
  | { status: "error" };

export default function PriceCompare({ query }: { query: string }) {
  const [state, setState] = useState<State>(() => {
    const cached = getCachedPriceResults(query);
    return cached ? { status: "success", results: cached } : { status: "idle" };
  });

  async function runSearch() {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/price-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      throwIfGated(response);
      if (!response.ok) throw new Error("Price search request failed");

      const { results } = (await response.json()) as { results: PriceResult[] };
      cachePriceResults(query, results);
      setState({ status: "success", results });
    } catch (error) {
      setState({ status: error instanceof AuthGateError ? "gated" : "error" });
    }
  }

  if (state.status === "idle") {
    return (
      <button
        type="button"
        onClick={runSearch}
        className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
      >
        Compare Prices (AI) ↗
      </button>
    );
  }

  if (state.status === "loading") {
    return (
      <p className="font-mono text-xs text-muted">Searching the web...</p>
    );
  }

  if (state.status === "gated") {
    return (
      <p className="font-mono text-xs text-muted">
        <Link href="/signup" className="font-bold uppercase tracking-wide text-accent">
          Sign up
        </Link>{" "}
        to unlock AI price search.
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex items-center gap-2">
        <p className="font-mono text-xs text-muted">Couldn&apos;t find live prices right now.</p>
        <button
          type="button"
          onClick={runSearch}
          className="font-mono text-xs font-bold uppercase tracking-wide text-accent"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {state.results.map((result) => (
        <li key={result.url} className="flex items-center gap-2 text-xs">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold uppercase tracking-wide text-muted transition hover:text-accent"
          >
            {result.retailer} ↗
          </a>
          <span className="font-mono font-bold text-accent">{result.price}</span>
        </li>
      ))}
    </ul>
  );
}
