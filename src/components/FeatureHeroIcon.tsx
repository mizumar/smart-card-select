import {
  Plane,
  MapPin,
  Gift,
  Sparkles,
  Tag,
  CreditCard,
  Award,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  plane: Plane,
  mapPin: MapPin,
  gift: Gift,
  sparkles: Sparkles,
  tag: Tag,
  creditCard: CreditCard,
  award: Award,
  zap: Zap,
};

interface Props {
  iconName?: string;
}

export function FeatureHeroIcon({ iconName }: Props) {
  const IconComponent = (iconName && iconMap[iconName]) || CreditCard;

  return (
    <div className="py-2.5 flex justify-center items-center">
      <div className="relative w-36 h-24" data-testid="hero-icon">
        {/* 3枚目のカード（一番奥・大きく傾け＆薄い色） */}
        <div className="absolute inset-0 bg-slate-400 rounded-2xl shadow-sm rotate-9 translate-x-2 -translate-y-1 border border-slate-200/60" />

        {/* 2枚目のカード（中間・反対側に傾ける） */}
        <div className="absolute inset-0 bg-slate-600/80 rounded-2xl shadow-sm -rotate-8 -translate-x-2 translate-y-1 border border-slate-200" />

        {/* 1枚目のカード（最前面・メイン） */}
        <div className="absolute inset-0 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-700">
          <IconComponent className="w-10 h-10 text-white drop-shadow-md" />
        </div>
      </div>
    </div>
  );
}
