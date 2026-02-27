"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChartNoAxesColumn, ShieldCheck } from "lucide-react";
import { CustomerLoyaltyCard3D } from "@/components/landing/CustomerLoyaltyCard3D";

export function Hero() {
  return (
    <section className="px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100"
          >
            <BadgeCheck size={14} />
            Built for modern local commerce
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="space-y-5"
          >
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build premium customer retention with <span className="text-cyan-300">LoyaltySphere</span>.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              A SaaS 2.0 platform for product directories, 3D digital loyalty cards, and merchant-grade stamp
              validation in one polished dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              Launch Business Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600/70 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/80"
            >
              Explore Bento Features
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <article className="glass-panel rounded-2xl p-4">
              <ShieldCheck className="mb-2 text-cyan-200" size={18} />
              <h3 className="text-sm font-medium text-white">Security by default</h3>
              <p className="mt-1 text-sm text-slate-300">RLS isolates business data and customer loyalty records.</p>
            </article>
            <article className="glass-panel rounded-2xl p-4">
              <ChartNoAxesColumn className="mb-2 text-fuchsia-200" size={18} />
              <h3 className="text-sm font-medium text-white">Depth-driven design</h3>
              <p className="mt-1 text-sm text-slate-300">Linear-style interfaces with motion-rich, premium polish.</p>
            </article>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            className="glow-orb absolute -left-6 top-6 h-24 w-24 rounded-full bg-cyan-500/30 blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
            className="glow-orb absolute -right-5 bottom-10 h-28 w-28 rounded-full bg-fuchsia-500/30 blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -5 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
            className="depth-outline absolute inset-x-10 top-10 -z-10 h-[76%] rounded-3xl bg-cyan-900/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="depth-outline absolute inset-x-8 bottom-7 -z-10 h-[76%] rounded-3xl bg-fuchsia-900/20 backdrop-blur-sm"
          />

          <CustomerLoyaltyCard3D />
        </div>
      </div>
    </section>
  );
}
