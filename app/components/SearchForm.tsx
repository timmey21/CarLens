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

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(value);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 2019 Porsche 911 GT3"
          className="flex-1 rounded-lg border border-black/10 bg-white px-4 py-3 text-base text-black shadow-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-3 text-base font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Search
        </button>
      </form>
      <p className="mt-3 text-sm text-black/50 dark:text-white/50">
        Try: {demoNames.join(" · ")}
      </p>
    </div>
  );
}
