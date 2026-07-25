"use client";

import { useMemo, useState } from "react";
import { searchByFeature } from "@/lib/featureSearch";

export default function FeatureFilter({
  onSelectCar,
}: {
  onSelectCar: (query: string) => void;
}) {
  const [value, setValue] = useState("");
  const matches = useMemo(() => searchByFeature(value), [value]);

  return (
    <div className="w-full max-w-xl">
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-muted uppercase">
        Or filter by feature
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. carbon ceramic brakes"
        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition focus:border-accent"
      />
      {value.trim() &&
        (matches.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {matches.map((match, i) => (
              <li key={`${match.car.model}-${match.itemName}-${i}`}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectCar(
                      `${match.car.year} ${match.car.make} ${match.car.model}`
                    )
                  }
                  className="flex w-full flex-col items-start gap-0.5 rounded-md border border-border bg-surface px-4 py-2 text-left transition hover:border-accent"
                >
                  <span className="font-medium">{match.itemName}</span>
                  <span className="font-mono text-xs text-muted">
                    {match.car.year} {match.car.make} {match.car.model} ·{" "}
                    {match.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">
            No parts match that in the demo data.
          </p>
        ))}
    </div>
  );
}
