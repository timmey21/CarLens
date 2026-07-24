import Fuse from "fuse.js";
import { cars, type CarProfile } from "./cars";

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
