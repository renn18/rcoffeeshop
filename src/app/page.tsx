import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedProducts />
    </div>
  );
}