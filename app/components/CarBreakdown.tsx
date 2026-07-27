import type { CarProfile } from "@/lib/cars";
import PartsList from "./PartsList";

export default function CarBreakdown({
  car,
  source = "demo",
}: {
  car: CarProfile;
  source?: "demo" | "ai";
}) {
  return (
    <div className="w-full max-w-2xl space-y-10">
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            {car.year}
          </p>
          {source === "ai" && (
            <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent">
              AI-generated estimate
            </span>
          )}
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          {car.make} {car.model}
        </h2>
      </div>

      <div className="space-y-8">
        {car.parts.map((category) => (
          <PartsList key={category.category} category={category} />
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
