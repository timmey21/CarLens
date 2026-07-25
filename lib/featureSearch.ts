import Fuse from "fuse.js";
import { cars, type CarProfile, type PartCategory } from "./cars";

type FeatureRecord = {
  car: CarProfile;
  category: string;
  itemName: string;
  searchText: string;
};

const records: FeatureRecord[] = cars.flatMap((car) =>
  car.parts.flatMap((category: PartCategory) =>
    category.items.map((item) => ({
      car,
      category: category.category,
      itemName: item.name,
      searchText: `${item.name} ${item.sourcing} ${category.category}`,
    }))
  )
);

const fuse = new Fuse(records, {
  keys: ["searchText"],
  threshold: 0.35,
  ignoreLocation: true,
});

export type FeatureMatch = {
  car: CarProfile;
  category: string;
  itemName: string;
};

export function searchByFeature(query: string, limit = 10): FeatureMatch[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return fuse
    .search(trimmed, { limit })
    .map(({ item }) => ({
      car: item.car,
      category: item.category,
      itemName: item.itemName,
    }));
}
