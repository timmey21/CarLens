import type { CarProfile, PartCategory } from "@/lib/cars";
import { buildNewPartLink, buildUsedPartLink } from "@/lib/buyLinks";

export default function PartsList({
  car,
  category,
}: {
  car: CarProfile;
  category: PartCategory;
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-muted uppercase">
        <span className="h-2 w-2 bg-accent" />
        {category.category}
      </h3>
      <ul className="divide-y divide-border rounded-md border border-border bg-surface">
        {category.items.map((item) => (
          <li key={item.name} className="px-4 py-3 transition hover:bg-white/[0.02]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted">{item.sourcing}</p>
              </div>
              <p className="font-mono text-sm font-bold text-accent sm:text-right">
                {item.estPriceRange}
              </p>
            </div>
            <div className="mt-2 flex gap-3">
              <a
                href={buildNewPartLink(car, item)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
              >
                Buy New ↗
              </a>
              <a
                href={buildUsedPartLink(car, item)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
              >
                Find Used ↗
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
