"use client";
import type { CreditCard } from "@/data/cards";

interface PointComparisonProps {
  cardA: CreditCard;
  cardB: CreditCard;
}

export function PointComparison({ cardA, cardB }: PointComparisonProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mb-1.5">
        貯まるポイント
      </p>
      {cardA.pointName === cardB.pointName ? (
        /* バッジなし・シンプルな横長プレート */
        <div className="py-2 px-3 bg-slate-100/80 rounded-xl border border-slate-200/60 text-center">
          <span className="text-xs font-bold text-slate-800 break-keep text-wrap:balance">
            {cardA.pointName || "-"}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-slate-100 text-center font-bold text-slate-800 text-xs px-1">
          <div className="px-1 break-keep text-wrap:balance">
            {cardA.pointName || "-"}
          </div>
          <div className="px-1 break-keep text-wrap:balance">
            {cardB.pointName || "-"}
          </div>
        </div>
      )}
    </div>
  );
}
