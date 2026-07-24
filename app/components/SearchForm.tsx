"use client";

import { useState } from "react";

export default function SearchForm({
  onSearch,
  demoNames,
}: {
  onSearch: (query: string) => void;
  demoNames: string[];
}) {
  const [value, setValue] = useState("");

  function search(query: string) {
    setValue(query);
    onSearch(query);
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(value);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="2019 PORSCHE 911 GT3"
          className="flex-1 rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm uppercase tracking-wide text-foreground placeholder:text-muted/60 outline-none transition focus:border-accent"
        />
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
