"use client";

import type { CreditCard } from "@/data/cards";
import { Check } from "lucide-react";

interface CardFeaturesProps {
  cardA: CreditCard;
  cardB: CreditCard;
}
/**
 *
 * @param {CreditCard} cardA
 * @param {CreditCard} cardB
 * @returns
 */
export function CardFeatures({ cardA, cardB }: CardFeaturesProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mb-2">
        特徴・注意点
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[cardA, cardB].map((card) => {
          const pros = card.details?.pros?.slice(0, 2) || [];
          const cons = card.details?.cons?.slice(0, 1) || [];

          return (
            <div key={card.id} className="space-y-1.5 text-[11px]">
              {pros.map((pro, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1 text-slate-700 leading-tight"
                >
                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
              {cons.map((con, i) => (
                <p
                  key={i}
                  className="text-[10px] text-slate-400 leading-tight pt-0.5"
                >
                  ※ {con}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
