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
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/30 bg-indigo-300/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-indigo-100"
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
              Build premium customer retention with <span className="text-indigo-300">LoyaltySphere</span>.
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
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
              <ShieldCheck className="mb-2 text-indigo-200" size={18} />
              <h3 className="text-sm font-medium text-white">Security by default</h3>
              <p className="mt-1 text-sm text-slate-300">RLS isolates business data and customer loyalty records.</p>
            </article>
            <article className="glass-panel rounded-2xl p-4">
              <ChartNoAxesColumn className="mb-2 text-indigo-200" size={18} />
              <h3 className="text-sm font-medium text-white">Depth-driven design</h3>
              <p className="mt-1 text-sm text-slate-300">Linear-style interfaces with motion-rich, premium polish.</p>
            </article>
          </motion.div>
        </div>

        <CustomerLoyaltyCard3D />
      </div>
    </section>
  );
}
