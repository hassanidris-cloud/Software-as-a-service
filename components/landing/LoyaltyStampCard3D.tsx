"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

const SLOT_POSITIONS: Array<[number, number, number]> = [
  [-1.2, 0.55, 0.11],
  [0, 0.55, 0.11],
  [1.2, 0.55, 0.11],
  [-1.2, -0.55, 0.11],
  [0, -0.55, 0.11],
  [1.2, -0.55, 0.11]
];

const TOTAL_STAMPS = SLOT_POSITIONS.length;

type StampSceneProps = {
  stamps: number;
  pendingSlot: number | null;
  animationId: number;
  onCoinSettled: (slotIndex: number) => void;
};

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function StampScene({ stamps, pendingSlot, animationId, onCoinSettled }: StampSceneProps) {
  const coinRef = useRef<Mesh | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const progressRef = useRef(0);
  const hasSettledRef = useRef(false);

  useEffect(() => {
    if (pendingSlot === null) {
      return;
    }

    setActiveSlot(pendingSlot);
    progressRef.current = 0;
    hasSettledRef.current = false;
  }, [pendingSlot, animationId]);

  useFrame((_, delta) => {
    const coin = coinRef.current;
    if (!coin || activeSlot === null) {
      return;
    }

    progressRef.current = Math.min(1, progressRef.current + delta * 1.8);
    const t = easeOutCubic(progressRef.current);
    const [targetX, targetY, targetZ] = SLOT_POSITIONS[activeSlot];
    const startX = 0;
    const startY = 1.9;
    const startZ = 1.15;

    const x = startX + (targetX - startX) * t;
    const y = startY + (targetY - startY) * t + Math.sin(t * Math.PI) * 0.24;
    const z = startZ + (targetZ - startZ) * t;

    coin.position.set(x, y, z);
    coin.rotation.x += delta * 6;
    coin.rotation.y += delta * 8;

    if (progressRef.current >= 1 && !hasSettledRef.current) {
      hasSettledRef.current = true;
      onCoinSettled(activeSlot);
      setActiveSlot(null);
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 4]} intensity={1.5} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#8b5cf6" />

      <group>
        <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[4.35, 2.75, 0.25]} />
          <meshStandardMaterial color="#0b1220" metalness={0.15} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0, 0.1]} receiveShadow>
          <boxGeometry args={[4.1, 2.5, 0.05]} />
          <meshStandardMaterial color="#10182a" metalness={0.1} roughness={0.5} />
        </mesh>

        {SLOT_POSITIONS.map(([x, y, z], index) => {
          const isFilled = index < stamps;
          return (
            <group key={`${x}-${y}-${z}`}>
              <mesh position={[x, y, z]}>
                <circleGeometry args={[0.28, 36]} />
                <meshStandardMaterial color={isFilled ? "#facc15" : "#1f2937"} metalness={0.7} roughness={0.4} />
              </mesh>
              <mesh position={[x, y, z + 0.002]}>
                <ringGeometry args={[0.19, 0.285, 36]} />
                <meshStandardMaterial color={isFilled ? "#fef08a" : "#334155"} metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 1.12, 0.12]}>
          <boxGeometry args={[2.5, 0.35, 0.04]} />
          <meshStandardMaterial color="#182339" metalness={0.25} roughness={0.45} />
        </mesh>
      </group>

      {activeSlot !== null && (
        <mesh ref={coinRef} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 40]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.2} />
        </mesh>
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.9}
        rotateSpeed={0.9}
      />
    </>
  );
}

export function LoyaltyStampCard3D() {
  const [stamps, setStamps] = useState(2);
  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const [animationId, setAnimationId] = useState(0);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 72,
      startVelocity: 40,
      ticks: 130,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#8b5cf6", "#facc15", "#c4b5fd"]
    });
  }, []);

  const handleEarnStamp = useCallback(() => {
    if (stamps >= TOTAL_STAMPS || pendingSlot !== null) {
      return;
    }

    setPendingSlot(stamps);
    setAnimationId((current) => current + 1);
    triggerConfetti();
  }, [pendingSlot, stamps, triggerConfetti]);

  const handleCoinSettled = useCallback((slotIndex: number) => {
    setStamps((current) => {
      if (current > slotIndex) {
        return current;
      }
      return Math.min(TOTAL_STAMPS, slotIndex + 1);
    });
    setPendingSlot(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-200/80">3D Loyalty Card</p>
          <p className="text-sm text-slate-300">Rotate and preview the live stamp experience.</p>
        </div>
        <span className="rounded-full border border-indigo-200/25 bg-indigo-300/10 px-3 py-1 text-xs font-medium text-indigo-100">
          {stamps}/{TOTAL_STAMPS} stamps
        </span>
      </div>

      <div className="h-[320px] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#060914]">
        <Canvas camera={{ position: [0, 0.1, 6], fov: 45 }}>
          <StampScene
            stamps={stamps}
            pendingSlot={pendingSlot}
            animationId={animationId}
            onCoinSettled={handleCoinSettled}
          />
        </Canvas>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">Tap to simulate a completed purchase stamp.</p>
        <button
          type="button"
          onClick={handleEarnStamp}
          disabled={stamps >= TOTAL_STAMPS || pendingSlot !== null}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {stamps >= TOTAL_STAMPS ? "Card Complete" : "Earn Stamp"}
        </button>
      </div>
    </motion.div>
  );
}
