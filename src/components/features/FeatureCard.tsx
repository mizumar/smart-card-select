import Link from "next/link";
import { FeatureArticle } from "@/lib/feature-articles";

interface FeatureCardProps {
  feature: FeatureArticle;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Link
      href={feature.href}
      className="group flex flex-col justify-between w-[200px] sm:w-[220px] shrink-0 p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow hover:border-slate-300 transition-all snap-align-start"
    >
      <div>
        <span className="inline-block text-[9px] font-bold tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase mb-1">
          Feature
        </span>
        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-tight">
          {feature.description}
        </p>
      </div>

      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center text-[11px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
        詳しく見る
        <svg
          className="w-3 h-3 ml-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
