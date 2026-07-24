"use client";

import { useState } from "react";
import { getCarBreakdown, demoCarNames } from "@/lib/getCarBreakdown";
import type { CarProfile } from "@/lib/cars";
import SearchForm from "./components/SearchForm";
import CarBreakdown from "./components/CarBreakdown";

export default function Home() {
  const [result, setResult] = useState<CarProfile | null | undefined>(
    undefined
  );

  const demoNames = demoCarNames();

  function handleSearch(query: string) {
    setResult(getCarBreakdown(query) ?? null);
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-12 px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="mb-3 font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Parts · Pricing · Fault History
        </p>
        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          Car<span className="text-accent">Lens</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-muted">
          Type in a sports car and get its full parts breakdown, pricing,
          sourcing, and common faults.
        </p>
      </div>

      <SearchForm onSearch={handleSearch} demoNames={demoNames} />

      {result === null && (
        <p className="max-w-xl text-center text-muted">
          No demo data for that one yet — this is a demo build. Try one of
          the cars above.
        </p>
      )}

      {result && <CarBreakdown car={result} />}
    </main>
  );
}
