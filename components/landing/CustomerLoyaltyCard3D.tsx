"use client";

import { useMemo, useState, type MouseEvent, type TouchEvent } from "react";
import confetti from "canvas-confetti";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";

const MAX_STAMPS = 8;

export function CustomerLoyaltyCard3D() {
  const [stampsEarned, setStampsEarned] = useState(3);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 24, mass: 0.85 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 24, mass: 0.85 });
  const transform = useMotionTemplate`perspective(1300px) rotateX(${springX}deg) rotateY(${springY}deg)`;

  const stampSlots = useMemo(() => Array.from({ length: MAX_STAMPS }), []);

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    rotateY.set(((x - midX) / midX) * 9);
    rotateX.set(-((y - midY) / midY) * 8);
  }

  function handleTouchMove(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    rotateY.set(((x - midX) / midX) * 8.5);
    rotateX.set(-((y - midY) / midY) * 7.5);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function triggerStampCelebration() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([22, 28, 22]);
    }

    confetti({
      particleCount: 90,
      spread: 68,
      startVelocity: 38,
      gravity: 0.95,
      origin: { y: 0.62 },
      colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#f5d0fe"]
    });
  }

  function addStamp() {
    if (stampsEarned >= MAX_STAMPS) {
      return;
    }

    setStampsEarned((value) => Math.min(MAX_STAMPS, value + 1));
    triggerStampCelebration();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-5"
    >
      <motion.article
        style={{ transform, transformStyle: "preserve-3d" }}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
        className="group relative overflow-hidden rounded-[1.75rem] border border-indigo-300/35 bg-[#070b16]/85 p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(168,85,247,0.35),transparent_42%)]" />
        <div className="pointer-events-none absolute -inset-px rounded-[1.75rem] border border-indigo-200/20 shadow-[0_0_30px_rgba(99,102,241,0.35)]" />

        <div style={{ transform: "translateZ(36px)" }} className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/85">LoyaltySphere Card</p>
            <p className="mt-2 text-lg font-semibold text-white">Customer Rewards Wallet</p>
          </div>
          <span className="rounded-full border border-indigo-200/30 bg-indigo-200/10 px-3 py-1 text-xs text-indigo-100">
            {stampsEarned}/{MAX_STAMPS} stamps
          </span>
        </div>

        <div style={{ transform: "translateZ(50px)" }} className="relative mt-5 grid grid-cols-4 gap-3">
          {stampSlots.map((_, index) => {
            const active = index < stampsEarned;
            return (
              <div
                key={`stamp-${index}`}
                className={`h-12 rounded-xl border ${
                  active
                    ? "border-violet-300/70 bg-violet-400/25 shadow-[0_0_22px_rgba(168,85,247,0.45)]"
                    : "border-slate-600/60 bg-slate-900/65"
                }`}
              />
            );
          })}
        </div>

        <div style={{ transform: "translateZ(28px)" }} className="relative mt-5 flex items-center justify-between">
          <p className="text-sm text-slate-300">Neon depth + glassmorphism + haptic feedback.</p>
          <Sparkles size={17} className="text-violet-200" />
        </div>
      </motion.article>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">Simulate a merchant-validated stamp event.</p>
        <button
          type="button"
          onClick={addStamp}
          disabled={stampsEarned >= MAX_STAMPS}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {stampsEarned >= MAX_STAMPS ? "Reward Unlocked" : "Add Stamp"}
        </button>
      </div>
    </motion.section>
  );
}
