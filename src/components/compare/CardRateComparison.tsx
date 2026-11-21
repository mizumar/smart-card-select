"use client";

import type { CreditCard } from "@/data/cards";
import NoteText from "@/components/NoteText";

interface CardRateComparisonProps {
  cardA: CreditCard;
  cardB: CreditCard;
}

export function CardRateComparison({ cardA, cardB }: CardRateComparisonProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mb-1.5">
        最大還元率 / 年会費
      </p>

      {/* 最大還元率 */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 text-center mb-1.5">
        <div className="font-bold text-slate-900">
          <NoteText text={cardA.maxReturnRate} />
        </div>
        <div className="font-bold text-slate-900">
          <NoteText text={cardB.maxReturnRate} />
        </div>
      </div>

      {/* 年会費：両方「0円かつ永年無料」の時 */}
      {cardA.annualFeeValue === 0 &&
      cardA.annualFee?.includes("永年無料") &&
      cardB.annualFeeValue === 0 &&
      cardB.annualFee?.includes("永年無料") ? (
        /* バッジなし・シンプルな緑系横長プレート */
        <div className="py-1.5 px-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-center">
          <span className="text-xs font-bold text-emerald-700">
            年会費：永年無料
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
          <div className="text-[11px] text-slate-400">
            <NoteText text={cardA.annualFee} />
          </div>
          <div className="text-[11px] text-slate-400">
            <NoteText text={cardB.annualFee} />
          </div>
        </div>
      )}
    </div>
  );
}
