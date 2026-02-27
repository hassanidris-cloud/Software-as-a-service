"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, QrCode, Rocket, Sparkles, Store, X } from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  className: string;
  highlight: string;
  bullets: string[];
  metricLabel: string;
  metricValue: string;
};

const bentoItems: FeatureItem[] = [
  {
    title: "Product Showcase",
    description: "Digital storefront directories for independent shops and growing local brands.",
    icon: Store,
    className: "md:col-span-1",
    highlight: "Convert profile visitors into repeat buyers with immersive product storytelling.",
    bullets: [
      "Glass storefront cards with photo-forward layouts",
      "Category highlights designed for mobile scanning",
      "One-tap actions for directions, contact, and offers"
    ],
    metricLabel: "Avg. profile engagement",
    metricValue: "+42%"
  },
  {
    title: "3D Loyalty Cards",
    description: "Interactive cards that tilt, glow, and celebrate each verified stamp.",
    icon: Sparkles,
    className: "md:col-span-1",
    highlight: "Create a premium rewards moment every time a stamp is earned.",
    bullets: [
      "Neon glass card surfaces with layered depth",
      "Haptic + confetti interactions for delight",
      "High contrast readability for all customers"
    ],
    metricLabel: "Repeat purchase lift",
    metricValue: "+28%"
  },
  {
    title: "Merchant Scanner",
    description: "Use the camera to validate customer QR codes and register stamps instantly.",
    icon: QrCode,
    className: "md:col-span-1",
    highlight: "Fast scan workflows that keep queues moving and loyalty updates accurate.",
    bullets: [
      "Low-latency camera capture and QR parsing",
      "Real-time stamp registration in Supabase",
      "Live status feedback for staff confidence"
    ],
    metricLabel: "Scan completion speed",
    metricValue: "<2s"
  }
];

export function BentoGrid() {
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);

  useEffect(() => {
    if (!activeFeature) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveFeature(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeFeature]);

  return (
    <>
      <section id="features" className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-9 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">Bento Overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                LoyaltySphere powers modern, motion-first loyalty experiences
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/25 bg-indigo-300/10 px-4 py-2 text-xs font-medium text-indigo-100">
              <Rocket size={14} />
              Tap a card to open a 3D popup
            </span>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {bentoItems.map((feature, index) => {
              const { title, description, icon: Icon, className } = feature;
              return (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                  className={`glass-panel relative overflow-hidden rounded-2xl p-5 ${className}`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/8 to-transparent" />
                  <Icon className="mb-4 text-indigo-200" size={19} />
                  <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-300">{description}</p>
                  <button
                    type="button"
                    onClick={() => setActiveFeature(feature)}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-300/30 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-100 transition hover:bg-indigo-400/20"
                  >
                    Open 3D popup
                    <ArrowUpRight size={14} />
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.button
              aria-label="Close popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFeature(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 42, rotateX: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: 36, rotateX: 12, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 210, damping: 24 }}
              className="relative w-full max-w-3xl [perspective:1500px]"
            >
              <div className="absolute inset-0 -z-10 rounded-3xl bg-indigo-500/20 blur-3xl" />
              <div className="absolute -left-5 top-5 -z-10 h-[82%] w-full rounded-3xl border border-indigo-200/20 bg-indigo-900/20" />
              <div className="absolute -right-5 bottom-5 -z-10 h-[82%] w-full rounded-3xl border border-violet-200/20 bg-violet-900/20" />

              <article className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-gradient-to-b from-white/10 to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveFeature(null)}
                  className="absolute right-4 top-4 rounded-lg border border-slate-600/80 bg-slate-900/60 p-2 text-slate-200 transition hover:bg-slate-800"
                >
                  <X size={16} />
                </button>

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="rounded-xl border border-indigo-300/30 bg-indigo-400/10 p-2 text-indigo-100">
                      <activeFeature.icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">Interactive Popup</p>
                      <h3 className="text-2xl font-semibold text-white sm:text-3xl">{activeFeature.title}</h3>
                    </div>
                  </div>

                  <p className="mb-6 text-slate-200">{activeFeature.highlight}</p>

                  <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
                    <ul className="space-y-2.5">
                      {activeFeature.bullets.map((bullet) => (
                        <li key={bullet} className="rounded-lg border border-slate-700/70 bg-slate-900/55 px-3 py-2 text-sm text-slate-200">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-2xl border border-indigo-300/25 bg-indigo-400/10 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-indigo-200/80">{activeFeature.metricLabel}</p>
                      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{activeFeature.metricValue}</p>
                      <p className="mt-2 text-sm text-slate-300">Measured from early partner store rollouts.</p>
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
