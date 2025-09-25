import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { HeroSectionOne } from "@/components/Hero2";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSectionOne />
      <FeaturedProducts />
    </div>
  );
}