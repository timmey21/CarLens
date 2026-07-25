"use client";

import { useState } from "react";
import { search, demoCarNames, type SearchResult } from "@/lib/getCarBreakdown";
import SearchForm from "./components/SearchForm";
import FeatureFilter from "./components/FeatureFilter";
import CarExplorer from "./components/CarExplorer";

export default function Home() {
  const [result, setResult] = useState<SearchResult | undefined>(undefined);

  const demoNames = demoCarNames();

  function handleSearch(query: string) {
    setResult(search(query));
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
      <FeatureFilter onSelectCar={handleSearch} />

      {result?.status === "unknown" && (
        <p className="max-w-xl text-center text-muted">
          We don&apos;t recognize that one. Try one of the cars above.
        </p>
      )}

      {result?.status === "recognized" && (
        <p className="max-w-xl text-center text-muted">
          We recognize the <span className="text-foreground">{result.label}</span> —
          full parts data isn&apos;t available for it yet. Try one of the demo
          cars above for the complete breakdown.
        </p>
      )}

      {result?.status === "match" && <CarExplorer car={result.car} />}
    </main>
  );
}
