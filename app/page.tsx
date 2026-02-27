import { BentoGrid } from "@/components/landing/BentoGrid";
import { DepthBackground3D } from "@/components/landing/DepthBackground3D";
import { Hero } from "@/components/landing/Hero";
import { TimedPromoPopup } from "@/components/landing/TimedPromoPopup";

export default function HomePage() {
  return (
    <main className="mesh-surface relative">
      <DepthBackground3D />

      <div className="relative z-10">
        <Hero />
        <BentoGrid />
      </div>

      <TimedPromoPopup />
    </main>
  );
}
