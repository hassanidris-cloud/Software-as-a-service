"use client";

import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

type PromoVariant = {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
};

type PromoFrequencyState = {
  dayKey: string;
  impressionsToday: number;
  impressionsTotal: number;
  lastShownAt: number;
  dismissedUntil: number;
};

const PROMOS: PromoVariant[] = [
  {
    badge: "Launch Offer",
    title: "Unlock 20% off your first month",
    description: "Activate LoyaltySphere this week and ship your branded 3D rewards experience faster.",
    ctaLabel: "Claim Discount"
  },
  {
    badge: "Growth Boost",
    title: "Get a free reward campaign setup",
    description: "We will configure your first loyalty campaign and scanner flow for higher repeat traffic.",
    ctaLabel: "Unlock Reward Setup"
  },
  {
    badge: "Limited Access",
    title: "Early adopter bonus: premium analytics",
    description: "Enable advanced retention insights and benchmark your stamp conversion in real-time.",
    ctaLabel: "Activate Bonus"
  }
];

const STORAGE_KEY = "loyaltysphere:promo-frequency:v1";
const SESSION_KEY = "loyaltysphere:promo-session-impressions:v1";

const INITIAL_DELAY_MS = 10000;
const RETRY_DELAY_MS = 7000;
const IMPRESSION_COOLDOWN_MS = 45 * 60 * 1000;
const DISMISS_COOLDOWN_MS = 3 * 60 * 60 * 1000;
const ACTION_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_IMPRESSIONS_PER_DAY = 2;
const MAX_IMPRESSIONS_PER_SESSION = 1;

function dayKeyFrom(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate()
  ).padStart(2, "0")}`;
}

function getFallbackState(now: number): PromoFrequencyState {
  return {
    dayKey: dayKeyFrom(new Date(now)),
    impressionsToday: 0,
    impressionsTotal: 0,
    lastShownAt: 0,
    dismissedUntil: 0
  };
}

function readFrequencyState(now: number): PromoFrequencyState {
  const fallback = getFallbackState(now);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PromoFrequencyState>;
    return {
      dayKey: typeof parsed.dayKey === "string" ? parsed.dayKey : fallback.dayKey,
      impressionsToday:
        typeof parsed.impressionsToday === "number" && Number.isFinite(parsed.impressionsToday)
          ? parsed.impressionsToday
          : 0,
      impressionsTotal:
        typeof parsed.impressionsTotal === "number" && Number.isFinite(parsed.impressionsTotal)
          ? parsed.impressionsTotal
          : 0,
      lastShownAt:
        typeof parsed.lastShownAt === "number" && Number.isFinite(parsed.lastShownAt) ? parsed.lastShownAt : 0,
      dismissedUntil:
        typeof parsed.dismissedUntil === "number" && Number.isFinite(parsed.dismissedUntil)
          ? parsed.dismissedUntil
          : 0
    };
  } catch {
    return fallback;
  }
}

function writeFrequencyState(value: PromoFrequencyState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function readSessionImpressions() {
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function writeSessionImpressions(value: number) {
  window.sessionStorage.setItem(SESSION_KEY, String(value));
}

function shouldShowPromo(state: PromoFrequencyState, now: number, sessionImpressions: number) {
  if (sessionImpressions >= MAX_IMPRESSIONS_PER_SESSION) {
    return false;
  }

  if (now < state.dismissedUntil) {
    return false;
  }

  if (now - state.lastShownAt < IMPRESSION_COOLDOWN_MS) {
    return false;
  }

  const currentDayKey = dayKeyFrom(new Date(now));
  const impressionsToday = state.dayKey === currentDayKey ? state.impressionsToday : 0;
  return impressionsToday < MAX_IMPRESSIONS_PER_DAY;
}

export function TimedPromoPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activePromo, setActivePromo] = useState<PromoVariant | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 20, mass: 0.7 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 20, mass: 0.7 });
  const transform = useMotionTemplate`perspective(1300px) rotateX(${springX}deg) rotateY(${springY}deg)`;

  function scheduleAttempt(delayMs: number, callback: () => void) {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(callback, delayMs);
  }

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const attemptShow = () => {
      if (document.body.style.overflow === "hidden") {
        scheduleAttempt(RETRY_DELAY_MS, attemptShow);
        return;
      }

      const now = Date.now();
      const state = readFrequencyState(now);
      const sessionImpressions = readSessionImpressions();

      if (!shouldShowPromo(state, now, sessionImpressions)) {
        return;
      }

      const currentDayKey = dayKeyFrom(new Date(now));
      const impressionsToday = state.dayKey === currentDayKey ? state.impressionsToday : 0;
      const nextState: PromoFrequencyState = {
        dayKey: currentDayKey,
        impressionsToday: impressionsToday + 1,
        impressionsTotal: state.impressionsTotal + 1,
        lastShownAt: now,
        dismissedUntil: state.dismissedUntil
      };

      writeFrequencyState(nextState);
      writeSessionImpressions(sessionImpressions + 1);
      setActivePromo(PROMOS[state.impressionsTotal % PROMOS.length]);
      setIsOpen(true);
    };

    scheduleAttempt(INITIAL_DELAY_MS, attemptShow);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function closeWithCooldown(cooldownMs: number) {
    const now = Date.now();
    const state = readFrequencyState(now);
    const nextState: PromoFrequencyState = {
      ...state,
      dismissedUntil: Math.max(state.dismissedUntil, now + cooldownMs)
    };

    writeFrequencyState(nextState);
    setIsOpen(false);
    setActivePromo(null);
  }

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    rotateY.set(((x - midX) / midX) * 8);
    rotateX.set(-((y - midY) / midY) * 7);
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
    rotateY.set(((x - midX) / midX) * 7);
    rotateX.set(-((y - midY) / midY) * 6);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function handleClaimOffer() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([18, 24, 18]);
    }

    confetti({
      particleCount: 75,
      spread: 65,
      startVelocity: 34,
      origin: { x: 0.88, y: 0.9 },
      colors: ["#22d3ee", "#06b6d4", "#d946ef", "#a3e635"]
    });

    closeWithCooldown(ACTION_COOLDOWN_MS);
    router.push("/auth?next=/dashboard");
  }

  return (
    <AnimatePresence>
      {isOpen && activePromo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm sm:bottom-6 sm:right-6"
        >
          <motion.div
            style={{ transform, transformStyle: "preserve-3d" }}
            onMouseMove={handlePointerMove}
            onMouseLeave={resetTilt}
            onTouchMove={handleTouchMove}
            onTouchEnd={resetTilt}
            className="glass-panel relative overflow-hidden rounded-2xl border border-cyan-300/35 p-4"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.35),_transparent_45%),radial-gradient(circle_at_80%_90%,_rgba(217,70,239,0.25),_transparent_45%)]" />
            <div className="pointer-events-none absolute -inset-px rounded-2xl border border-cyan-200/20 shadow-[0_0_30px_rgba(6,182,212,0.35)]" />

            <button
              type="button"
              onClick={() => closeWithCooldown(DISMISS_COOLDOWN_MS)}
              className="absolute right-3 top-3 rounded-md border border-slate-600/80 bg-slate-900/70 p-1.5 text-slate-200 transition hover:bg-slate-800"
              aria-label="Close promotional popup"
            >
              <X size={14} />
            </button>

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100">
                  <Sparkles size={12} />
                  {activePromo.badge}
                </span>
              </div>

              <h3 className="pr-8 text-lg font-semibold tracking-tight text-white">{activePromo.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{activePromo.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClaimOffer}
                  className="inline-flex items-center gap-2 rounded-lg bg-fuchsia-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-400"
                >
                  <Gift size={15} />
                  {activePromo.ctaLabel}
                </button>
                <button
                  type="button"
                  onClick={() => closeWithCooldown(DISMISS_COOLDOWN_MS)}
                  className="rounded-lg border border-slate-600/70 bg-slate-900/55 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Not now
                </button>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                Frequency cap: max {MAX_IMPRESSIONS_PER_SESSION} popup/session and {MAX_IMPRESSIONS_PER_DAY}
                per day.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
