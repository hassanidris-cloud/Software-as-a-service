"use client";

import { motion } from "framer-motion";
import { Cpu, Lock, QrCode, Rocket, Sparkles, Store } from "lucide-react";

const bentoItems = [
  {
    title: "Business storefront profiles",
    description: "Launch a premium profile page with your products, story, and operating hours.",
    icon: Store,
    className: "md:col-span-2"
  },
  {
    title: "QR-first stamp flow",
    description: "Scan customer cards in seconds and update loyalty points instantly.",
    icon: QrCode,
    className: "md:col-span-1"
  },
  {
    title: "RLS-powered privacy",
    description: "Each business sees only its own data. Customer cards remain isolated by default.",
    icon: Lock,
    className: "md:col-span-1"
  },
  {
    title: "Motion-rich UX",
    description: "Linear-inspired interactions with smooth transitions and tactile feedback.",
    icon: Sparkles,
    className: "md:col-span-1"
  },
  {
    title: "Realtime-ready architecture",
    description: "Built on Next.js + Supabase with room to scale into notifications and analytics.",
    icon: Cpu,
    className: "md:col-span-2"
  }
];

export function BentoGrid() {
  return (
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
              A modern loyalty stack for independent businesses
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/25 bg-indigo-300/10 px-4 py-2 text-xs font-medium text-indigo-100">
            <Rocket size={14} />
            Fast MVP launch path
          </span>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {bentoItems.map(({ title, description, icon: Icon, className }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
              className={`glass-panel rounded-2xl p-5 ${className}`}
            >
              <Icon className="mb-4 text-indigo-200" size={19} />
              <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
