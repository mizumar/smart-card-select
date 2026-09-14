import { FeatureArticle } from "@/lib/feature-articles";
import { FeatureCarousel } from "./FeatureCarousel";

interface FeatureSectionProps {
  features: FeatureArticle[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="my-4">
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-[10px] font-bold text-blue-600 tracking-wide uppercase">
          Pick Up
        </span>
        <h2 className="text-sm font-bold text-slate-900">特集</h2>
      </div>
      <FeatureCarousel features={features} />
    </section>
  );
}
