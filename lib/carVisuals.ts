import type { CarProfile } from "./cars";

export type CarVisual = {
  paintColor: string;
  headlightShape: "rect" | "round";
  taillight: "bar" | "quadRound";
  frontFeature: "none" | "kidneyGrille";
  sideFeature: "none" | "intake";
  exhaust: "dualRear" | "centerTriple";
};

const DEFAULT_VISUAL: CarVisual = {
  paintColor: "#161616",
  headlightShape: "rect",
  taillight: "bar",
  frontFeature: "none",
  sideFeature: "none",
  exhaust: "dualRear",
};

/**
 * Per-car silhouette cues for the stylized 3D model — not accurate scale
 * models, just a couple of recognizable signature details per car (paint,
 * light shapes, one hallmark feature) layered onto the shared low-poly base.
 * Keyed separately from CarProfile so the data layer stays clean for a
 * future AI-generated-data swap (see lib/getCarBreakdown.ts).
 */
const VISUALS: Record<string, CarVisual> = {
  "Porsche 911 GT3": {
    paintColor: "#9a9d9f",
    headlightShape: "round",
    taillight: "bar",
    frontFeature: "none",
    sideFeature: "none",
    exhaust: "dualRear",
  },
  "Nissan GT-R": {
    paintColor: "#16305c",
    headlightShape: "rect",
    taillight: "quadRound",
    frontFeature: "none",
    sideFeature: "none",
    exhaust: "dualRear",
  },
  "BMW M3": {
    paintColor: "#1c4fa3",
    headlightShape: "rect",
    taillight: "bar",
    frontFeature: "kidneyGrille",
    sideFeature: "none",
    exhaust: "dualRear",
  },
  "Ferrari 458 Italia": {
    paintColor: "#a30000",
    headlightShape: "round",
    taillight: "quadRound",
    frontFeature: "none",
    sideFeature: "intake",
    exhaust: "centerTriple",
  },
};

export function getCarVisual(car: CarProfile): CarVisual {
  return VISUALS[`${car.make} ${car.model}`] ?? DEFAULT_VISUAL;
}
