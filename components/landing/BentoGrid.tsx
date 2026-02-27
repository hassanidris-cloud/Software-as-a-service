"use client";

import { motion } from "framer-motion";
import { QrCode, Rocket, Sparkles, Store } from "lucide-react";

const bentoItems = [
  {
    title: "Product Showcase",
    description: "Digital storefront directories for independent shops and growing local brands.",
    icon: Store,
    className: "md:col-span-1"
  },
  {
    title: "3D Loyalty Cards",
    description: "Interactive cards that tilt, glow, and celebrate each verified stamp.",
    icon: Sparkles,
    className: "md:col-span-1"
  },
  {
    title: "Merchant Scanner",
    description: "Use the camera to validate customer QR codes and register stamps instantly.",
    icon: QrCode,
    className: "md:col-span-1"
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
              LoyaltySphere powers modern, motion-first loyalty experiences
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
              whileHover={{ y: -6, scale: 1.01 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
              className={`glass-panel relative overflow-hidden rounded-2xl p-5 ${className}`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/8 to-transparent" />
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
