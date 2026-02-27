import { BentoGrid } from "@/components/landing/BentoGrid";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <main className="mesh-surface">
      <Hero />
      <BentoGrid />
    </main>
  );
}
