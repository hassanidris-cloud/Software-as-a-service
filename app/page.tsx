import { Gift, Smartphone, Sparkles } from "lucide-react";
import { Hero } from "@/components/landing/Hero";

const featureCards = [
  {
    title: "Beautiful business pages",
    description: "Showcase your story, products, and contact details in one polished profile.",
    icon: Sparkles
  },
  {
    title: "Fast QR check-ins",
    description: "Staff can scan customer cards instantly and add points without friction.",
    icon: Smartphone
  },
  {
    title: "Stronger retention",
    description: "Reward repeat purchases and keep customers coming back to your store.",
    icon: Gift
  }
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section id="features" className="border-t border-slate-900 bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-300">Why LoyaltyHub</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything a business owner needs to launch quickly
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-indigo-400/40"
              >
                <Icon className="mb-3 text-indigo-400" size={20} />
                <h3 className="mb-2 text-base font-medium text-white">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
