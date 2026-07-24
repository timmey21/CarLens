"use client";

import { useState } from "react";
import type { CarProfile } from "@/lib/cars";
import CarModel from "./CarModel";
import PartsList from "./PartsList";
import CarBreakdown from "./CarBreakdown";

export default function CarExplorer({ car }: { car: CarProfile }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const selected = car.parts.find((c) => c.category === selectedCategory);

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <p className="mb-2 text-center font-mono text-xs text-muted">
          Drag to rotate · pinch to zoom · tap a dot for details
        </p>
        <CarModel
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="min-h-[3rem]">
        {selected ? (
          <PartsList category={selected} />
        ) : (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            Tap a highlighted dot on the car to see parts for that area.
          </p>
        )}
      </div>

      <CarBreakdown car={car} />
    </div>
  );
}
