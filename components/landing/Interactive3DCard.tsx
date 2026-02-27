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
import type { LucideIcon } from "lucide-react";
import { BookOpen, Coffee, Shirt, Sparkles, UtensilsCrossed } from "lucide-react";

const SLOT_COUNT = 10;
const FLYING_TOKEN_SIZE = 40;

type ProductType = "coffee" | "fashion" | "beauty" | "books" | "food";

type ProductTheme = {
  label: string;
  icon: LucideIcon;
  unit: string;
  reward: string;
  tokenGradient: string;
  tokenEdge: string;
  iconColor: string;
};

type FlightState = {
  id: number;
  targetSlot: number;
  productType: ProductType;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

type CardLightingStyle = CSSProperties & {
  "--mouse-x": string;
  "--mouse-y": string;
};

const PRODUCT_THEMES: Record<ProductType, ProductTheme> = {
  coffee: {
    label: "Coffee",
    icon: Coffee,
    unit: "drink",
    reward: "free signature coffee",
    tokenGradient: "radial-gradient(circle at 30% 30%, #fbbf24, #b45309)",
    tokenEdge: "#7c2d12",
    iconColor: "#fff8eb"
  },
  fashion: {
    label: "Fashion",
    icon: Shirt,
    unit: "item",
    reward: "15% style reward",
    tokenGradient: "radial-gradient(circle at 28% 28%, #22d3ee, #2563eb)",
    tokenEdge: "#1e3a8a",
    iconColor: "#e0f2fe"
  },
  beauty: {
    label: "Beauty",
    icon: Sparkles,
    unit: "visit",
    reward: "free glow treatment",
    tokenGradient: "radial-gradient(circle at 28% 28%, #f472b6, #d946ef)",
    tokenEdge: "#831843",
    iconColor: "#fdf4ff"
  },
  books: {
    label: "Books",
    icon: BookOpen,
    unit: "purchase",
    reward: "free bestseller voucher",
    tokenGradient: "radial-gradient(circle at 30% 30%, #34d399, #0f766e)",
    tokenEdge: "#115e59",
    iconColor: "#ecfeff"
  },
  food: {
    label: "Restaurant",
    icon: UtensilsCrossed,
    unit: "meal",
    reward: "free chef special",
    tokenGradient: "radial-gradient(circle at 30% 30%, #fb7185, #f97316)",
    tokenEdge: "#9a3412",
    iconColor: "#fff7ed"
  }
};

const PRODUCT_TYPES = Object.keys(PRODUCT_THEMES) as ProductType[];

const cardLightingDefaults: CardLightingStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "50%"
};

function tokenStyle(theme: ProductTheme): CSSProperties {
  return {
    background: theme.tokenGradient,
    boxShadow: `0 6px 0 ${theme.tokenEdge}, 0 12px 22px rgba(0,0,0,0.48)`
  };
}

function generateRewardCode(type: ProductType) {
  const prefix = PRODUCT_THEMES[type].label.slice(0, 3).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LS-${prefix}-${random}`;
}

export function Interactive3DCard() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [productType, setProductType] = useState<ProductType>("coffee");
  const [slots, setSlots] = useState<Array<ProductType | null>>(() => Array.from({ length: SLOT_COUNT }, () => null));
  const [flight, setFlight] = useState<FlightState | null>(null);
  const [clinkSlot, setClinkSlot] = useState<number | null>(null);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 230, damping: 22, mass: 0.75 });
  const springY = useSpring(tiltY, { stiffness: 230, damping: 22, mass: 0.75 });

  const filledSlots = useMemo(() => slots.filter((slot) => slot !== null).length, [slots]);
  const nextSlot = useMemo(() => slots.findIndex((slot) => slot === null), [slots]);
  const remainingToReward = SLOT_COUNT - filledSlots;

  const availableTokens = useMemo(() => {
    const hiddenInFlight = flight ? 1 : 0;
    const remaining = Math.max(0, SLOT_COUNT - filledSlots - hiddenInFlight);
    return Array.from({ length: remaining }, (_, index) => filledSlots + index);
  }, [filledSlots, flight]);

  const activeTheme = PRODUCT_THEMES[productType];

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

  function handleFlightComplete(targetSlot: number, type: ProductType) {
    setFlight(null);
    setClinkSlot(targetSlot);
    vibrate([16, 24, 16]);

    window.setTimeout(() => {
      setClinkSlot(null);
    }, 220);

    setSlots((previous) => {
      if (previous[targetSlot] !== null) {
        return previous;
      }

      const next = [...previous];
      next[targetSlot] = type;
      return next;
    });

    if (targetSlot === SLOT_COUNT - 1) {
      confetti({
        particleCount: 120,
        spread: 75,
        startVelocity: 42,
        origin: { y: 0.56 },
        colors: ["#22d3ee", "#06b6d4", "#d946ef", "#a3e635"]
      });
      vibrate([26, 30, 26, 30, 26]);
      setRewardCode(generateRewardCode(type));
      setStatusMessage("Reward code ready. Claim it to reset the card.");
    }
  }

  function handleStampClick(tokenId: number, event: MouseEvent<HTMLButtonElement>) {
    if (flight || nextSlot === -1 || rewardCode) {
      return;
    }

    const rootElement = rootRef.current;
    const targetSlotNode = slotRefs.current[nextSlot];

    if (!rootElement || !targetSlotNode) {
      return;
    }

    const sourceRect = event.currentTarget.getBoundingClientRect();
    const targetRect = targetSlotNode.getBoundingClientRect();
    const rootRect = rootElement.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2 - rootRect.left - FLYING_TOKEN_SIZE / 2;
    const startY = sourceRect.top + sourceRect.height / 2 - rootRect.top - FLYING_TOKEN_SIZE / 2;
    const endX = targetRect.left + targetRect.width / 2 - rootRect.left - FLYING_TOKEN_SIZE / 2;
    const endY = targetRect.top + targetRect.height / 2 - rootRect.top - FLYING_TOKEN_SIZE / 2;

    setFlight({
      id: tokenId,
      targetSlot: nextSlot,
      productType,
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    });

    vibrate(14);
  }

  async function claimCodeAndReset() {
    if (!rewardCode) {
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(rewardCode);
      }
    } catch {
      // Ignore clipboard errors and continue reset.
    }

    vibrate([18, 24, 18]);
    setSlots(Array.from({ length: SLOT_COUNT }, () => null));
    setRewardCode(null);
    setStatusMessage("Code claimed. Card reset for the next reward cycle.");
  }

  function renderFlightToken() {
    if (!flight) {
      return null;
    }

    const flightTheme = PRODUCT_THEMES[flight.productType];
    const FlightIcon = flightTheme.icon;

    return (
      <motion.div
        key={`flight-${flight.id}-${flight.targetSlot}`}
        initial={{ x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0 }}
        animate={{
          x: flight.end.x - flight.start.x,
          y: flight.end.y - flight.start.y,
          scale: [1, 1.08, 0.95],
          rotateY: [0, 180, 360],
          rotateZ: [0, 24, 0]
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => handleFlightComplete(flight.targetSlot, flight.productType)}
        className="pointer-events-none absolute z-30 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 product-token"
        style={{
          left: flight.start.x,
          top: flight.start.y,
          ...tokenStyle(flightTheme)
        }}
      >
        <FlightIcon size={18} color={flightTheme.iconColor} />
      </motion.div>
    );
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/85">Interactive Loyalty Card</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Tap floating product icons to stamp the card</h3>
        </div>
        <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100">
          {filledSlots}/{SLOT_COUNT}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PRODUCT_TYPES.map((type) => {
          const theme = PRODUCT_THEMES[type];
          const Icon = theme.icon;
          const selected = type === productType;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setProductType(type)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                selected
                  ? "border-cyan-300/45 bg-cyan-400/15 text-cyan-100"
                  : "border-slate-600/70 bg-slate-900/55 text-slate-300 hover:border-slate-400"
              }`}
            >
              <Icon size={12} />
              {theme.label}
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex min-h-10 flex-wrap items-center gap-2">
        {rewardCode ? (
          <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-lime-200/35 bg-lime-300/10 px-3 py-2">
            <p className="text-xs font-semibold tracking-wide text-lime-100">Reward Code: {rewardCode}</p>
            <button
              type="button"
              onClick={() => void claimCodeAndReset()}
              className="rounded-lg border border-lime-200/40 bg-lime-300/20 px-3 py-1.5 text-xs font-semibold text-lime-50 transition hover:bg-lime-300/30"
            >
              I got the code, reset card
            </button>
          </div>
        ) : availableTokens.length > 0 ? (
          availableTokens.map((tokenId, index) => {
            const Icon = activeTheme.icon;
            return (
              <motion.button
                key={`float-token-${tokenId}`}
                type="button"
                onClick={(event) => handleStampClick(tokenId, event)}
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
                className="product-token relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/35"
                style={tokenStyle(activeTheme)}
                aria-label={`Add ${activeTheme.label} stamp ${tokenId + 1}`}
              >
                <Icon size={18} color={activeTheme.iconColor} />
              </motion.button>
            );
          })
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
              "radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.32), rgba(255,255,255,0) 60%)"
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.24),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(217,70,239,0.24),transparent_46%)]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/85">Customer Reward Path</p>
          <p className="mt-2 text-sm font-bold text-white">
            {rewardCode
              ? `Your ${activeTheme.reward} code is ready. Claim it, then start the next cycle.`
              : remainingToReward > 0
              ? `Buy ${remainingToReward} more ${activeTheme.unit}${
                  remainingToReward > 1 ? "s" : ""
                } to unlock ${activeTheme.reward}`
              : `${activeTheme.reward} unlocked. Redeem now.`}
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2.5">
            {slots.map((slotType, index) => {
              const isFilled = slotType !== null;
              const isClink = index === clinkSlot;
              const theme = slotType ? PRODUCT_THEMES[slotType] : null;
              const SlotIcon = theme?.icon;

              return (
                <div
                  key={`slot-${index}`}
                  ref={(node) => {
                    slotRefs.current[index] = node;
                  }}
                  className={`relative h-14 rounded-xl border ${
                    isFilled ? "border-white/35 bg-black/35" : "border-white/15 bg-white/[0.03]"
                  }`}
                >
                  {isFilled && theme && SlotIcon && (
                    <motion.div
                      initial={false}
                      animate={isClink ? { y: [-2, 2, 0], scale: [1, 1.12, 1] } : { y: [0, -3, 0], scale: 1 }}
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
                      className="product-token absolute inset-1 inline-flex items-center justify-center rounded-lg border border-white/35"
                      style={tokenStyle(theme)}
                    >
                      <SlotIcon size={16} color={theme.iconColor} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.article>

      {statusMessage && <p className="mt-3 text-xs text-cyan-100/80">{statusMessage}</p>}

      <AnimatePresence>{renderFlightToken()}</AnimatePresence>
    </motion.section>
  );
}
