"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, ContactShadows, Html } from "@react-three/drei";

const HOTSPOTS: { category: string; position: [number, number, number] }[] = [
  { category: "Engine", position: [0, 0.65, 1.55] },
  { category: "Brakes & Suspension", position: [1.05, 0.45, 1.3] },
  { category: "Exterior", position: [1.05, 0.6, -1.5] },
  { category: "Interior & Wheels", position: [0, 1.08, -0.2] },
];

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

function CarBody() {
  return (
    <group>
      <RoundedBox args={[1.8, 0.55, 3.6]} radius={0.12} smoothness={4} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#161616" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      <RoundedBox args={[1.3, 0.48, 1.7]} radius={0.15} smoothness={4} position={[0, 0.85, -0.15]} castShadow>
        <meshStandardMaterial color="#1c1c1c" metalness={0.4} roughness={0.2} />
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

      {[0.72, -0.72].map((x) => (
        <mesh key={`headlight-${x}`} position={[x, 0.48, 1.79]}>
          <boxGeometry args={[0.18, 0.1, 0.04]} />
          <meshStandardMaterial color="#fff6e0" emissive="#fff6e0" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {[0.72, -0.72].map((x) => (
        <mesh key={`taillight-${x}`} position={[x, 0.52, -1.79]}>
          <boxGeometry args={[0.18, 0.1, 0.04]} />
          <meshStandardMaterial color="#ff3d1a" emissive="#ff3d1a" emissiveIntensity={0.8} />
        </mesh>
      ))}
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
        className={`h-7 w-7 rounded-full border-2 transition ${
          active
            ? "border-white bg-accent scale-110"
            : "border-accent bg-accent/70 hover:scale-110 hover:bg-accent"
        }`}
      >
        <span className="sr-only">{category}</span>
      </button>
    </Html>
  );
}

export default function CarModel({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-md border border-border bg-surface sm:h-96">
      <Canvas shadows camera={{ position: [4, 2.4, 5], fov: 38 }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#8fb2ff" />
        <directionalLight position={[0, 2, -5]} intensity={0.4} color="#ff3d1a" />

        <CarBody />
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
          minDistance={3.5}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
