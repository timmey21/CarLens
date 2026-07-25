import Fuse from "fuse.js";
import { getMakes, getModels } from "@meterapp/vehicle-db";

export type VehicleEntry = {
  make: string;
  model: string;
  label: string;
};

const ACRONYM_OVERRIDES: Record<string, string> = {
  bmw: "BMW",
  gmc: "GMC",
  mg: "MG",
};

function toTitleCase(raw: string): string {
  return raw
    .toLowerCase()
    .split(/([\s-])/)
    .map((token) =>
      ACRONYM_OVERRIDES[token] ??
      (token.length > 0 && /[a-z]/.test(token)
        ? token[0].toUpperCase() + token.slice(1)
        : token)
    )
    .join("");
}

let cache: VehicleEntry[] | null = null;

export function getAllVehicles(): VehicleEntry[] {
  if (cache) return cache;

  const seen = new Set<string>();
  const entries: VehicleEntry[] = [];

  for (const make of getMakes()) {
    const models = getModels({ makeId: make.makeId });
    for (const m of models) {
      const key = `${make.makeId}::${m.modelName}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const makeName = toTitleCase(make.makeName);
      const modelName = toTitleCase(m.modelName);
      entries.push({
        make: makeName,
        model: modelName,
        label: `${makeName} ${modelName}`,
      });
    }
  }

  cache = entries;
  return entries;
}

let fuseInstance: Fuse<VehicleEntry> | null = null;

function getFuse(): Fuse<VehicleEntry> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(getAllVehicles(), {
      keys: ["label"],
      threshold: 0.25,
      ignoreLocation: true,
    });
  }
  return fuseInstance;
}

export function searchVehicles(query: string, limit = 8): VehicleEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return getFuse()
    .search(trimmed, { limit })
    .map((result) => result.item);
}

export function isRecognizedVehicle(query: string): VehicleEntry | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const direct = getAllVehicles().find(
    (v) =>
      v.label.toLowerCase() === normalized ||
      v.label.toLowerCase().includes(normalized) ||
      normalized.includes(v.label.toLowerCase())
  );
  if (direct) return direct;

  const [best] = getFuse().search(normalized, { limit: 1 });
  return best ? best.item : null;
}
