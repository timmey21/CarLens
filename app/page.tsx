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
    <main className="flex flex-1 flex-col items-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">CarLens</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          Type in a sports car and get its parts breakdown, pricing,
          sourcing, and common faults.
        </p>
      </div>

      <SearchForm onSearch={handleSearch} demoNames={demoNames} />

      {result === null && (
        <p className="max-w-xl text-center text-black/60 dark:text-white/60">
          No demo data for that one yet. This is a demo build — try one of:{" "}
          {demoNames.join(", ")}.
        </p>
      )}

      {result && <CarBreakdown car={result} />}
    </main>
  );
}
