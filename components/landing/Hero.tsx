import Link from "next/link";
import { ArrowRight, BadgeCheck, QrCode, Store } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_60%)]" />

      <div className="mx-auto flex min-h-[85vh] w-full max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 text-sm font-medium text-indigo-200">
              <BadgeCheck size={16} />
              Built for local shops and growing brands
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn first-time buyers into loyal regulars with{" "}
                <span className="text-indigo-400">LoyaltyHub</span>.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Create a professional business profile, showcase your best products, and reward repeat
                customers using a fast QR-powered loyalty card system.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Open Business Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Explore Features
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <Store className="mb-3 text-indigo-400" size={20} />
              <p className="mb-1 text-sm font-medium text-slate-100">Business Profile</p>
              <p className="text-sm text-slate-400">
                Highlight location, story, opening hours, and your top product categories.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <QrCode className="mb-3 text-indigo-400" size={20} />
              <p className="mb-1 text-sm font-medium text-slate-100">QR Loyalty Cards</p>
              <p className="text-sm text-slate-400">
                Scan and reward customers in seconds to encourage frequent repeat visits.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:col-span-2">
              <p className="text-sm text-slate-400">
                <span className="font-medium text-slate-200">MVP-ready foundation:</span> App Router +
                Tailwind UI components + Supabase data model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
