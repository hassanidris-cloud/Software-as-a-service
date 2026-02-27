import { BentoGrid } from "@/components/landing/BentoGrid";
import { Hero } from "@/components/landing/Hero";
import { TimedPromoPopup } from "@/components/landing/TimedPromoPopup";

export default function HomePage() {
  return (
    <main className="mesh-surface">
      <Hero />
      <BentoGrid />
      <TimedPromoPopup />
    </main>
  );
}
