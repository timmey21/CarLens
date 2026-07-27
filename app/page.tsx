"use client";

import { useState } from "react";
import { search, demoCarNames } from "@/lib/getCarBreakdown";
import type { CarProfile } from "@/lib/cars";
import { fetchAiCarBreakdown, getCachedAiCar } from "@/lib/aiLookup";
import SearchForm from "./components/SearchForm";
import FeatureFilter from "./components/FeatureFilter";
import CarExplorer from "./components/CarExplorer";

type ViewState =
  | { status: "idle" }
  | { status: "unknown" }
  | { status: "match"; car: CarProfile }
  | { status: "loading"; label: string }
  | { status: "ai-match"; car: CarProfile }
  | { status: "ai-error"; label: string };

export default function Home() {
  const [view, setView] = useState<ViewState>({ status: "idle" });

  const demoNames = demoCarNames();

  async function handleSearch(query: string) {
    const result = search(query);

    if (result.status === "match") {
      setView({ status: "match", car: result.car });
      return;
    }
    if (result.status === "unknown") {
      setView({ status: "unknown" });
      return;
    }

    const cached = getCachedAiCar(result.label);
    if (cached) {
      setView({ status: "ai-match", car: cached });
      return;
    }

    setView({ status: "loading", label: result.label });
    try {
      const car = await fetchAiCarBreakdown(query, result.label);
      setView({ status: "ai-match", car });
    } catch {
      setView({ status: "ai-error", label: result.label });
    }
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

      {view.status === "unknown" && (
        <p className="max-w-xl text-center text-muted">
          We don&apos;t recognize that one. Try one of the cars above.
        </p>
      )}

      {view.status === "loading" && (
        <p className="max-w-xl text-center text-muted">
          Generating a parts breakdown for{" "}
          <span className="text-foreground">{view.label}</span>...
        </p>
      )}

      {view.status === "ai-error" && (
        <p className="max-w-xl text-center text-muted">
          Couldn&apos;t generate a breakdown for{" "}
          <span className="text-foreground">{view.label}</span> right now.
          Try again, or try one of the demo cars above.
        </p>
      )}

      {view.status === "match" && (
        <CarExplorer car={view.car} source="demo" />
      )}
      {view.status === "ai-match" && (
        <CarExplorer car={view.car} source="ai" />
      )}
    </main>
  );
}
