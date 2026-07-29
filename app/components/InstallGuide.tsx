"use client";

import { useState } from "react";
import type { InstallStep } from "@/lib/installGuide";
import { getCachedInstallGuide, cacheInstallGuide } from "@/lib/installGuideCache";

type State =
  | { status: "loading" }
  | { status: "success"; steps: InstallStep[] }
  | { status: "error" };

export default function InstallGuide({
  query,
  partName,
}: {
  query: string;
  partName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<State>({ status: "loading" });
  const [pageIndex, setPageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  async function open() {
    setIsOpen(true);
    setPageIndex(0);

    const cached = getCachedInstallGuide(query);
    if (cached) {
      setState({ status: "success", steps: cached });
      return;
    }

    setState({ status: "loading" });
    try {
      const response = await fetch("/api/install-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error("Install guide request failed");

      const { steps } = (await response.json()) as { steps: InstallStep[] };
      cacheInstallGuide(query, steps);
      setState({ status: "success", steps });
    } catch {
      setState({ status: "error" });
    }
  }

  function next() {
    if (state.status !== "success") return;
    setPageIndex((i) => Math.min(i + 1, state.steps.length - 1));
  }

  function prev() {
    setPageIndex((i) => Math.max(i - 1, 0));
  }

  function onTouchStart(event: React.TouchEvent) {
    setTouchStartX(event.touches[0].clientX);
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (delta < -40) next();
    if (delta > 40) prev();
    setTouchStartX(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
      >
        How to Install ↗
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="truncate pr-4 font-mono text-xs font-bold uppercase tracking-wide text-muted">
              {partName}
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="shrink-0 font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
            >
              Close ✕
            </button>
          </div>

          <div
            className="flex flex-1 select-none flex-col items-center justify-center overflow-y-auto px-6 py-8"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {state.status === "loading" && (
              <p className="text-center text-muted">Writing the instructions...</p>
            )}

            {state.status === "error" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-muted">
                  Couldn&apos;t generate an install guide right now.
                </p>
                <button
                  type="button"
                  onClick={open}
                  className="font-mono text-xs font-bold uppercase tracking-wide text-accent"
                >
                  Retry
                </button>
              </div>
            )}

            {state.status === "success" && (
              <div className="flex w-full max-w-md flex-col items-center gap-5">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
                    state.steps[pageIndex].phase === "removal"
                      ? "border-muted/40 text-muted"
                      : "border-accent/40 text-accent"
                  }`}
                >
                  {state.steps[pageIndex].phase === "removal"
                    ? "Removing old part"
                    : "Installing new part"}
                </span>

                <div className="flex flex-col items-center gap-2">
                  <p className="min-h-[3.5rem] text-center text-xl font-medium leading-snug">
                    {state.steps[pageIndex].instruction}
                  </p>
                  <p className="text-center text-sm text-muted">
                    {state.steps[pageIndex].detail}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={pageIndex === 0}
                    aria-label="Previous step"
                    className="font-mono text-2xl text-muted transition hover:text-accent disabled:opacity-20"
                  >
                    ‹
                  </button>
                  <p className="font-mono text-xs text-muted">
                    Step {pageIndex + 1} / {state.steps.length}
                  </p>
                  <button
                    type="button"
                    onClick={next}
                    disabled={pageIndex === state.steps.length - 1}
                    aria-label="Next step"
                    className="font-mono text-2xl text-muted transition hover:text-accent disabled:opacity-20"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="px-6 pb-6 text-center font-mono text-[10px] text-muted">
            AI-generated general guidance — always check your car&apos;s service manual.
          </p>
        </div>
      )}
    </>
  );
}
