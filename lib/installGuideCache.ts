import type { InstallStep } from "./installGuide";
import type { PhaseImages } from "./guideImages";

export type CachedInstallGuide = {
  steps: InstallStep[];
  images: PhaseImages;
};

const CACHE_PREFIX = "carlens:install-guide-cache:v2:";

function cacheKey(query: string): string {
  return CACHE_PREFIX + query.trim().toLowerCase();
}

export function getCachedInstallGuide(query: string): CachedInstallGuide | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(query));
    return raw ? (JSON.parse(raw) as CachedInstallGuide) : null;
  } catch {
    return null;
  }
}

export function cacheInstallGuide(query: string, guide: CachedInstallGuide): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(query), JSON.stringify(guide));
  } catch {
    // Storage full or unavailable (base64 images make this more likely) —
    // not worth failing the request over.
  }
}
