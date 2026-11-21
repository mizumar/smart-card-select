"use client";

import React from "react";
import type { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { X } from "lucide-react";
import { CompareCard } from "@/components/compare/CompareCard";
import { AnnualBenefit } from "@/components/compare/AnnualBenefit";
import { MonthlySpend } from "@/components/compare/MonthlySpend";
import { PointComparison } from "@/components/compare/PointComparison";
import { CardRateComparison } from "@/components/compare/CardRateComparison";
import { CardFeatures } from "@/components/compare/CardFeatures";
import { CalloutNotices } from "@/components/compare/CalloutNotices";

interface Benefit {
  baseRate: number;
  annualFee: number;
  netBenefit: number;
  formattedBenefit: string;
  isProfit: boolean;
}

interface BreakEvenInfo {
  zeroSpendA: number | null;
  zeroSpendB: number | null;
  crossSpend: number | null;
}

interface CompareModalProps {
  cardA: CreditCard;
  cardB: CreditCard;
  benefitA: Benefit;
  benefitB: Benefit;
  monthlySpend: number;
  setMonthlySpend: React.Dispatch<React.SetStateAction<number>>;
  breakEvenInfo: BreakEvenInfo | null;
  activeNoticesA: string[];
  activeNoticesB: string[];
  hasNotices: boolean;
}

export function CompareModal({
  cardA,
  cardB,
  benefitA,
  benefitB,
  monthlySpend,
  setMonthlySpend,
  breakEvenInfo,
  activeNoticesA,
  activeNoticesB,
  hasNotices,
}: CompareModalProps) {
  const { setIsOpen } = useCompareStore();
  return (
    <div>
      {/* ② 比較モーダル */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-end justify-center p-0 md:p-4">
        <div className="bg-slate-100 w-full max-w-md rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto p-4 animate-in slide-in-from-bottom duration-200 border border-slate-200/80 flex flex-col shadow-2xl">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-2 pb-0 top-0 bg-slate-100/90 backdrop-blur-md z-20">
            <h2 className="font-bold text-slate-900 text-sm tracking-tight">
              カード仕様の比較
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="モーダルを閉じる"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* カードメインエリア（コラム対比） */}
            <div className="grid grid-cols-2 gap-2.5">
              <CompareCard cardA={cardA} cardB={cardB} />
            </div>

            {/* スペック比較 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-xs space-y-4 text-xs">
              {/* 年間お得額表示エリア */}
              <AnnualBenefit
                benefitA={benefitA}
                benefitB={benefitB}
                monthlySpend={monthlySpend}
              />

              {/* ★★★ 3. 月間利用額コントロール（スライダー & 分岐点ボタン） ★★★ */}
              <MonthlySpend
                monthlySpend={monthlySpend}
                setMonthlySpend={setMonthlySpend}
                breakEvenInfo={breakEvenInfo}
              />

              <div className="h-px bg-slate-100" />

              {/* ② 貯まるポイント */}
              <PointComparison cardA={cardA} cardB={cardB} />

              <div className="h-px bg-slate-100" />

              {/* ③ 最大還元率 / 年会費 */}
              <CardRateComparison cardA={cardA} cardB={cardB} />

              <div className="h-px bg-slate-100" />

              {/* 特徴・注意点 */}
              <CardFeatures cardA={cardA} cardB={cardB} />

              {/* 抽出された calloutNotices の表示エリア */}
              {hasNotices && (
                <CalloutNotices
                  activeNoticesA={activeNoticesA}
                  activeNoticesB={activeNoticesB}
                />
              )}
            </div>

            {/* 同時開きボタン */}
            <button
              onClick={() => {
                window.open(
                  cardA.affiliateUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
                window.location.href = cardB.affiliateUrl;
              }}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors text-center"
            >
              両方の公式サイトを別タブで開く
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
