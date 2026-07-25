"use client";

import { useMemo, useState } from "react";
import { getSuggestions } from "@/lib/getCarBreakdown";

export default function SearchForm({
  onSearch,
  demoNames,
}: {
  onSearch: (query: string) => void;
  demoNames: string[];
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => getSuggestions(value), [value]);
  const showDropdown = isFocused && value.trim().length > 0 && suggestions.length > 0;

  function search(query: string) {
    setValue(query);
    setIsFocused(false);
    onSearch(query);
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(value);
        }}
        className="relative flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 120)}
            placeholder="2019 PORSCHE 911 GT3"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm uppercase tracking-wide text-foreground placeholder:text-muted/60 outline-none transition focus:border-accent"
          />
          {showDropdown && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-lg">
              {suggestions.map((suggestion) => (
                <li key={suggestion.label}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => search(suggestion.label)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left font-mono text-sm text-foreground transition hover:bg-white/5"
                  >
                    <span>{suggestion.label}</span>
                    {suggestion.hasFullData && (
                      <span className="ml-2 shrink-0 text-[10px] font-bold uppercase tracking-wide text-accent">
                        Full data
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110"
        >
          Search
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {demoNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => search(name)}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
