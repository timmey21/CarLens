"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, ContactShadows, Html } from "@react-three/drei";
import type { CarProfile } from "@/lib/cars";
import { getCarVisual, type CarVisual } from "@/lib/carVisuals";
import WebGLErrorBoundary from "./WebGLErrorBoundary";

const HOTSPOTS: { category: string; position: [number, number, number] }[] = [
  { category: "Engine", position: [0, 0.72, 1.6] },
  { category: "Brakes & Suspension", position: [0.95, 0.58, 1.25] },
  { category: "Exterior", position: [0.95, 0.55, -1.5] },
  { category: "Interior & Wheels", position: [0, 1.09, -0.2] },
];

function noopSubscribe() {
  return () => {};
}

function getWebGLSnapshot(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, getWebGLSnapshot, () => true);
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.32, 24]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.14, 24]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <meshStandardMaterial color="#ff3d1a" emissive="#ff3d1a" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Headlights({ shape }: { shape: CarVisual["headlightShape"] }) {
  return (
    <>
      {[0.72, -0.72].map((x) =>
        shape === "round" ? (
          <mesh key={x} position={[x, 0.48, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
            <meshStandardMaterial color="#fff6e0" emissive="#fff6e0" emissiveIntensity={0.8} />
          </mesh>
        ) : (
          <mesh key={x} position={[x, 0.48, 1.79]}>
            <boxGeometry args={[0.18, 0.1, 0.04]} />
            <meshStandardMaterial color="#fff6e0" emissive="#fff6e0" emissiveIntensity={0.8} />
          </mesh>
        )
      )}
    </>
  );
}

function Taillights({ layout }: { layout: CarVisual["taillight"] }) {
  if (layout === "quadRound") {
    return (
      <>
        {[0.72, -0.72].map((x) =>
          [0.06, -0.06].map((dy) =>
            [0.06, -0.06].map((dx) => (
              <mesh
                key={`${x}-${dy}-${dx}`}
                position={[x + dx, 0.5 + dy, -1.79]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
                <meshStandardMaterial color="#ff3d1a" emissive="#ff3d1a" emissiveIntensity={0.8} />
              </mesh>
            ))
          )
        )}
      </>
    );
  }
  return (
    <>
      {[0.72, -0.72].map((x) => (
        <mesh key={x} position={[x, 0.52, -1.79]}>
          <boxGeometry args={[0.18, 0.1, 0.04]} />
          <meshStandardMaterial color="#ff3d1a" emissive="#ff3d1a" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </>
  );
}

function FrontFeature({ feature }: { feature: CarVisual["frontFeature"] }) {
  if (feature !== "kidneyGrille") return null;
  return (
    <>
      {[0.13, -0.13].map((x) => (
        <RoundedBox
          key={x}
          args={[0.13, 0.22, 0.06]}
          radius={0.03}
          position={[x, 0.4, 1.86]}
        >
          <meshStandardMaterial color="#050505" roughness={0.8} />
        </RoundedBox>
      ))}
    </>
  );
}

function SideFeature({ feature }: { feature: CarVisual["sideFeature"] }) {
  if (feature !== "intake") return null;
  return (
    <>
      {[0.92, -0.92].map((x) => (
        <RoundedBox
          key={x}
          args={[0.05, 0.16, 0.4]}
          radius={0.02}
          position={[x, 0.4, -0.35]}
        >
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </RoundedBox>
      ))}
    </>
  );
}

function Exhaust({ layout }: { layout: CarVisual["exhaust"] }) {
  const tips =
    layout === "centerTriple" ? [-0.15, 0, 0.15] : [0.5, -0.5];
  return (
    <>
      {tips.map((x) => (
        <mesh key={x} position={[x, 0.2, -1.87]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#8a8a8a" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

function CarBody({ visual }: { visual: CarVisual }) {
  return (
    <group>
      <RoundedBox args={[1.8, 0.55, 3.6]} radius={0.12} smoothness={4} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color={visual.paintColor} metalness={0.6} roughness={0.35} />
      </RoundedBox>

      <RoundedBox args={[1.3, 0.48, 1.7]} radius={0.15} smoothness={4} position={[0, 0.85, -0.15]} castShadow>
        <meshStandardMaterial color="#101010" metalness={0.4} roughness={0.2} />
      </RoundedBox>

      <RoundedBox args={[1.9, 0.12, 0.35]} radius={0.03} position={[0, 0.18, 1.9]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[1.7, 0.08, 0.4]} radius={0.02} position={[0, 1.02, -1.9]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0.65, 0.9, -1.85]}>
        <boxGeometry args={[0.06, 0.18, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[-0.65, 0.9, -1.85]}>
        <boxGeometry args={[0.06, 0.18, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      <Headlights shape={visual.headlightShape} />
      <Taillights layout={visual.taillight} />
      <FrontFeature feature={visual.frontFeature} />
      <SideFeature feature={visual.sideFeature} />
      <Exhaust layout={visual.exhaust} />
    </group>
  );
}

function HotspotMarker({
  position,
  category,
  active,
  onSelect,
}: {
  position: [number, number, number];
  category: string;
  active: boolean;
  onSelect: (category: string) => void;
}) {
  return (
    <Html position={position} center distanceFactor={8}>
      <button
        type="button"
        onClick={() => onSelect(category)}
        aria-label={category}
        className="flex h-7 w-7 items-center justify-center"
      >
        <span
          className={`block h-3 w-3 rounded-full border-2 transition ${
            active
              ? "scale-125 border-white bg-accent"
              : "border-accent bg-accent/70 hover:scale-125 hover:bg-accent"
          }`}
        />
        <span className="sr-only">{category}</span>
      </button>
    </Html>
  );
}

function ModelFallback() {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-md border border-border bg-surface px-6 text-center text-sm text-muted sm:h-96">
      3D view isn&apos;t available in this browser. See the full parts
      breakdown below.
    </div>
  );
}

export default function CarModel({
  car,
  selectedCategory,
  onSelectCategory,
}: {
  car: CarProfile;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}) {
  const webglSupported = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const visual = getCarVisual(car);

  if (!webglSupported) {
    return <ModelFallback />;
  }

  return (
    <WebGLErrorBoundary fallback={<ModelFallback />}>
      <div
        className="h-72 w-full overflow-hidden rounded-md border border-border bg-surface sm:h-96"
        style={{ touchAction: "none" }}
      >
        <Canvas shadows camera={{ position: [4, 2.4, 5], fov: 38 }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#8fb2ff" />
          <directionalLight position={[0, 2, -5]} intensity={0.4} color="#ff3d1a" />

          <CarBody visual={visual} />
          {[
            [0.95, 0.45, 1.25],
            [-0.95, 0.45, 1.25],
            [0.95, 0.45, -1.25],
            [-0.95, 0.45, -1.25],
          ].map((pos, i) => (
            <Wheel key={i} position={pos as [number, number, number]} />
          ))}

          {HOTSPOTS.map((h) => (
            <HotspotMarker
              key={h.category}
              position={h.position}
              category={h.category}
              active={selectedCategory === h.category}
              onSelect={onSelectCategory}
            />
          ))}

          <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={8} blur={2} far={2} />
          <OrbitControls
            enablePan={false}
            enableDamping={!reducedMotion}
            minDistance={3.5}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0.5, 0]}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
