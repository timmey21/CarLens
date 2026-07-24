import type { CarProfile } from "@/lib/cars";

export default function CarBreakdown({ car }: { car: CarProfile }) {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">
          {car.year} {car.make} {car.model}
        </h2>
      </div>

      <div className="space-y-6">
        {car.parts.map((category) => (
          <div key={category.category}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              {category.category}
            </h3>
            <ul className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-black/50 dark:text-white/50">
                      {item.sourcing}
                    </p>
                  </div>
                  <p className="text-sm font-medium sm:text-right">
                    {item.estPriceRange}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Common Faults
        </h3>
        <ul className="list-disc space-y-1 rounded-lg border border-black/10 px-8 py-4 text-sm dark:border-white/10">
          {car.commonFaults.map((fault) => (
            <li key={fault}>{fault}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
