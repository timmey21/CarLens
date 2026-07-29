import type { CarProfile, PartItem } from "./cars";

function partQuery(car: CarProfile, item: PartItem): string {
  return `${car.year} ${car.make} ${car.model} ${item.name}`.trim();
}

export function buildNewPartLink(car: CarProfile, item: PartItem): string {
  const query = partQuery(car, item);
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
}

export function buildUsedPartLink(car: CarProfile, item: PartItem): string {
  const query = `${partQuery(car, item)} used`;
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
}
