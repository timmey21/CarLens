import Fuse from "fuse.js";
import { cars, type CarProfile } from "./cars";
import { isRecognizedVehicle, searchVehicles } from "./vehicleDatabase";

type SearchRecord = { carIndex: number; text: string };

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

const records: SearchRecord[] = cars.flatMap((car, carIndex) => {
  const candidates = [
    ...car.aliases,
    `${car.make} ${car.model}`,
    `${car.year} ${car.make} ${car.model}`,
  ];
  return candidates.map((text) => ({ carIndex, text: normalize(text) }));
});

const fuse = new Fuse(records, {
  keys: ["text"],
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
});

/**
 * Single lookup seam for the UI. Currently matches against the hand-written
 * demo dataset; a later phase can swap this to call an LLM behind the same
 * signature (e.g. when an API key env var is present) without touching callers.
 *
 * Tries an exact/substring match first (fast, unambiguous for aliases like
 * "gt3"), then falls back to fuzzy matching via Fuse.js to tolerate typos
 * from voice-to-text input (e.g. "ferarri 458").
 */
export function getCarBreakdown(query: string): CarProfile | null {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  const directHit = records.find(
    (r) =>
      r.text === normalizedQuery ||
      r.text.includes(normalizedQuery) ||
      normalizedQuery.includes(r.text)
  );
  if (directHit) return cars[directHit.carIndex];

  const [best] = fuse.search(normalizedQuery);
  if (best && (best.score ?? 1) <= 0.4) {
    return cars[best.item.carIndex];
  }

  return null;
}

export function demoCarNames(): string[] {
  return cars.map((car) => `${car.year} ${car.make} ${car.model}`);
}

export type SearchResult =
  | { status: "match"; car: CarProfile }
  | { status: "recognized"; label: string }
  | { status: "unknown" };

/**
 * Tri-state search: a demo car with full data, a real vehicle we recognize
 * from the NHTSA database but have no detailed data for, or nothing at all.
 */
export function search(query: string): SearchResult {
  const car = getCarBreakdown(query);
  if (car) return { status: "match", car };

  const recognized = isRecognizedVehicle(query);
  if (recognized) return { status: "recognized", label: recognized.label };

  return { status: "unknown" };
}

export type Suggestion = { label: string; hasFullData: boolean };

/**
 * Live suggestions for the search box: demo cars (which have full data)
 * ranked first, then other recognized real vehicles from the NHTSA database.
 */
export function getSuggestions(query: string, limit = 8): Suggestion[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const demoSuggestions: Suggestion[] = cars
    .filter(
      (car) =>
        normalize(`${car.make} ${car.model}`).includes(normalizedQuery) ||
        car.aliases.some((alias) => normalize(alias).includes(normalizedQuery))
    )
    .map((car) => ({
      label: `${car.year} ${car.make} ${car.model}`,
      hasFullData: true,
    }));

  const dbSuggestions: Suggestion[] = searchVehicles(query, limit)
    .map((vehicle) => ({ label: vehicle.label, hasFullData: false }))
    .filter(
      (suggestion) =>
        !demoSuggestions.some((demo) =>
          normalize(demo.label).includes(normalize(suggestion.label))
        )
    );

  return [...demoSuggestions, ...dbSuggestions].slice(0, limit);
}
