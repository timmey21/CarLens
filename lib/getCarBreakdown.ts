import { cars, type CarProfile } from "./cars";

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Single lookup seam for the UI. Currently matches against the hand-written
 * demo dataset; a later phase can swap this to call an LLM behind the same
 * signature (e.g. when an API key env var is present) without touching callers.
 */
export function getCarBreakdown(query: string): CarProfile | null {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  return (
    cars.find((car) => {
      const candidates = [
        car.aliases,
        [`${car.make} ${car.model}`, `${car.year} ${car.make} ${car.model}`],
      ]
        .flat()
        .map(normalize);

      return candidates.some(
        (candidate) =>
          candidate === normalizedQuery ||
          candidate.includes(normalizedQuery) ||
          normalizedQuery.includes(candidate)
      );
    }) ?? null
  );
}

export function demoCarNames(): string[] {
  return cars.map((car) => `${car.year} ${car.make} ${car.model}`);
}
