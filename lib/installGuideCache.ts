import type { InstallStep } from "./installGuide";

const CACHE_PREFIX = "carlens:install-guide-cache:v1:";

function cacheKey(query: string): string {
  return CACHE_PREFIX + query.trim().toLowerCase();
}

export function getCachedInstallGuide(query: string): InstallStep[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(query));
    return raw ? (JSON.parse(raw) as InstallStep[]) : null;
  } catch {
    return null;
  }
}

export function cacheInstallGuide(query: string, steps: InstallStep[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(query), JSON.stringify(steps));
  } catch {
    // Storage full or unavailable — not worth failing the request over.
  }
}
