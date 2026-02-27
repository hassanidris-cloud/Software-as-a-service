"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent
} from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";

const SLOT_COUNT = 10;
const FLYING_COIN_SIZE = 40;

type FlightState = {
  id: number;
  targetSlot: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

type CardLightingStyle = CSSProperties & {
  "--mouse-x": string;
  "--mouse-y": string;
};

const cardLightingDefaults: CardLightingStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "50%"
};

export function Interactive3DCard() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [filledSlots, setFilledSlots] = useState(0);
  const [flight, setFlight] = useState<FlightState | null>(null);
  const [clinkSlot, setClinkSlot] = useState<number | null>(null);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 230, damping: 22, mass: 0.75 });
  const springY = useSpring(tiltY, { stiffness: 230, damping: 22, mass: 0.75 });

  const remainingToReward = SLOT_COUNT - filledSlots;
  const availableCoins = useMemo(() => {
    const unfilled = SLOT_COUNT - filledSlots;
    const hiddenInFlight = flight ? 1 : 0;
    const count = Math.max(0, unfilled - hiddenInFlight);
    return Array.from({ length: count }, (_, index) => filledSlots + index);
  }, [filledSlots, flight]);

  function vibrate(pattern: number | number[]) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }

  function updateTiltAndLighting(clientX: number, clientY: number) {
    const cardElement = cardRef.current;
    if (!cardElement) {
      return;
    }

    const rect = cardElement.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Follow-pointer light reflection for a physical glass feel.
    cardElement.style.setProperty("--mouse-x", `${mouseX}px`);
    cardElement.style.setProperty("--mouse-y", `${mouseY}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    tiltY.set(((mouseX - centerX) / centerX) * 10);
    tiltX.set(-((mouseY - centerY) / centerY) * 9);
  }

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    updateTiltAndLighting(event.clientX, event.clientY);
  }

  function handleTouchMove(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    updateTiltAndLighting(touch.clientX, touch.clientY);
  }

  function resetCardPose() {
    tiltX.set(0);
    tiltY.set(0);

    const cardElement = cardRef.current;
    if (!cardElement) {
      return;
    }

    const rect = cardElement.getBoundingClientRect();
    cardElement.style.setProperty("--mouse-x", `${rect.width / 2}px`);
    cardElement.style.setProperty("--mouse-y", `${rect.height / 2}px`);
  }

  function handleFlightComplete(targetSlot: number) {
    setFlight(null);
    setClinkSlot(targetSlot);
    vibrate([16, 24, 16]);

    window.setTimeout(() => {
      setClinkSlot(null);
    }, 220);

    setFilledSlots((previous) => {
      const next = Math.min(SLOT_COUNT, previous + 1);
      if (next === SLOT_COUNT && previous < SLOT_COUNT) {
        confetti({
          particleCount: 120,
          spread: 75,
          startVelocity: 42,
          origin: { y: 0.56 },
          colors: ["#22d3ee", "#06b6d4", "#d946ef", "#fde047"]
        });
        vibrate([26, 30, 26, 30, 26]);
      }
      return next;
    });
  }

  function handleStampClick(coinId: number, event: MouseEvent<HTMLButtonElement>) {
    if (flight || filledSlots >= SLOT_COUNT) {
      return;
    }

    const rootElement = rootRef.current;
    const targetSlotNode = slotRefs.current[filledSlots];

    if (!rootElement || !targetSlotNode) {
      return;
    }

    const sourceRect = event.currentTarget.getBoundingClientRect();
    const targetRect = targetSlotNode.getBoundingClientRect();
    const rootRect = rootElement.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2 - rootRect.left - FLYING_COIN_SIZE / 2;
    const startY = sourceRect.top + sourceRect.height / 2 - rootRect.top - FLYING_COIN_SIZE / 2;
    const endX = targetRect.left + targetRect.width / 2 - rootRect.left - FLYING_COIN_SIZE / 2;
    const endY = targetRect.top + targetRect.height / 2 - rootRect.top - FLYING_COIN_SIZE / 2;

    setFlight({
      id: coinId,
      targetSlot: filledSlots,
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    });

    vibrate(14);
  }

  return (
    <motion.section
      ref={rootRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="glass-panel relative rounded-3xl p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/85">Interactive Loyalty Card</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Tap a floating coin to stamp the card</h3>
        </div>
        <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100">
          {filledSlots}/{SLOT_COUNT}
        </span>
      </div>

      <div className="mb-3 flex min-h-10 flex-wrap items-center gap-2">
        {availableCoins.length > 0 ? (
          availableCoins.map((coinId, index) => (
            <motion.button
              key={`float-coin-${coinId}`}
              type="button"
              onClick={(event) => handleStampClick(coinId, event)}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                y: {
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.06
                }
              }}
              className="gold-coin h-10 w-10 rounded-full border border-amber-100/45"
              aria-label={`Add stamp ${coinId + 1}`}
            />
          ))
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full border border-lime-200/35 bg-lime-300/10 px-3 py-1 text-xs font-medium text-lime-200">
            <Sparkles size={14} />
            Reward unlocked
          </p>
        )}
      </div>

      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetCardPose}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetCardPose}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          ...cardLightingDefaults
        }}
        className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/5 p-4 backdrop-blur-xl"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[1.5rem]"
          style={{
            background:
              "radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3), rgba(255,255,255,0) 60%)"
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.24),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(217,70,239,0.24),transparent_46%)]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/85">Customer Reward Path</p>
          <p className="mt-2 text-sm font-bold text-white">
            {remainingToReward > 0
              ? `Buy ${remainingToReward} more to get a free coffee`
              : "Free coffee unlocked. Redeem now."}
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2.5">
            {Array.from({ length: SLOT_COUNT }).map((_, index) => {
              const isFilled = index < filledSlots;
              const isClink = index === clinkSlot;

              return (
                <div
                  key={`slot-${index}`}
                  ref={(node) => {
                    slotRefs.current[index] = node;
                  }}
                  className={`relative h-14 rounded-xl border ${
                    isFilled ? "border-amber-200/60 bg-black/35" : "border-white/15 bg-white/[0.03]"
                  }`}
                >
                  {isFilled && (
                    <motion.div
                      initial={false}
                      animate={
                        isClink
                          ? { y: [-2, 2, 0], scale: [1, 1.12, 1] }
                          : { y: [0, -3, 0], scale: 1 }
                      }
                      transition={
                        isClink
                          ? { duration: 0.22, ease: "easeOut" }
                          : {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.05
                            }
                      }
                      className="gold-coin absolute inset-1 rounded-full border border-amber-100/45"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {flight && (
          <motion.div
            key={`flight-${flight.id}-${flight.targetSlot}`}
            initial={{ x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0 }}
            animate={{
              x: flight.end.x - flight.start.x,
              y: flight.end.y - flight.start.y,
              scale: [1, 1.1, 0.95],
              rotateY: [0, 180, 360],
              rotateZ: [0, 36, 0]
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => handleFlightComplete(flight.targetSlot)}
            className="pointer-events-none absolute z-30 h-10 w-10 rounded-full border border-amber-100/45 gold-coin"
            style={{ left: flight.start.x, top: flight.start.y }}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
