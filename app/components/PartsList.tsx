import type { PartCategory } from "@/lib/cars";

export default function PartsList({ category }: { category: PartCategory }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-muted uppercase">
        <span className="h-2 w-2 bg-accent" />
        {category.category}
      </h3>
      <ul className="divide-y divide-border rounded-md border border-border bg-surface">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="flex flex-col gap-1 px-4 py-3 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted">{item.sourcing}</p>
            </div>
            <p className="font-mono text-sm font-bold text-accent sm:text-right">
              {item.estPriceRange}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
