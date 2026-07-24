import type { CarProfile } from "@/lib/cars";

export default function CarBreakdown({ car }: { car: CarProfile }) {
  return (
    <div className="w-full max-w-2xl space-y-10">
      <div className="border-b border-border pb-4">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          {car.year}
        </p>
        <h2 className="text-3xl font-black tracking-tight">
          {car.make} {car.model}
        </h2>
      </div>

      <div className="space-y-8">
        {car.parts.map((category) => (
          <div key={category.category}>
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
        ))}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-muted uppercase">
          <span className="h-2 w-2 bg-accent" />
          Common Faults
        </h3>
        <ul className="space-y-3 rounded-md border border-accent/20 bg-accent/[0.04] px-4 py-4">
          {car.commonFaults.map((fault) => (
            <li key={fault} className="flex gap-3 text-sm">
              <span className="mt-1 font-mono text-accent">!</span>
              <span>{fault}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
