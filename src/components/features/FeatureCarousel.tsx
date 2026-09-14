import { FeatureArticle } from "@/lib/feature-articles";
import { FeatureCard } from "./FeatureCard";

interface FeatureCarouselProps {
  features: FeatureArticle[];
}

export function FeatureCarousel({ features }: FeatureCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1 px-4 -mx-4 sm:mx-0 sm:px-0">
      {features.map((feature, index) => (
        <FeatureCard key={feature.id || index} feature={feature} />
      ))}
    </div>
  );
}
