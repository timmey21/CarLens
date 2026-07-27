import type { CarProfile } from "./cars";

const CACHE_PREFIX = "carlens:ai-cache:v1:";

function cacheKey(label: string): string {
  return CACHE_PREFIX + label.trim().toLowerCase();
}

export function getCachedAiCar(label: string): CarProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(label));
    return raw ? (JSON.parse(raw) as CarProfile) : null;
  } catch {
    return null;
  }
}

function cacheAiCar(label: string, car: CarProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(label), JSON.stringify(car));
  } catch {
    // Storage full or unavailable — not worth failing the request over.
  }
}

export async function fetchAiCarBreakdown(
  query: string,
  label: string
): Promise<CarProfile> {
  const cached = getCachedAiCar(label);
  if (cached) return cached;

  const response = await fetch("/api/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, label }),
  });

  if (!response.ok) {
    throw new Error("AI lookup request failed");
  }

  const { car } = (await response.json()) as { car: CarProfile };
  cacheAiCar(label, car);
  return car;
}
