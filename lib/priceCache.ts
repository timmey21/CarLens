import type { PriceResult } from "./priceSearch";

const CACHE_PREFIX = "carlens:price-cache:v1:";

function cacheKey(query: string): string {
  return CACHE_PREFIX + query.trim().toLowerCase();
}

export function getCachedPriceResults(query: string): PriceResult[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(query));
    return raw ? (JSON.parse(raw) as PriceResult[]) : null;
  } catch {
    return null;
  }
}

export function cachePriceResults(query: string, results: PriceResult[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(query), JSON.stringify(results));
  } catch {
    // Storage full or unavailable — not worth failing the request over.
  }
}
