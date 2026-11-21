"use client";

import React from "react";
import type { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { X, Check } from "lucide-react";
import NoteText from "@/components/NoteText";
import { CompareCard } from "@/components/compare/CompareCard";
import { AnnualBenefit } from "@/components/compare/AnnualBenefit";
import { MonthlySpend } from "@/components/compare/MonthlySpend";
import { PointComparison } from "@/components/compare/PointComparison";

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

              <div className="h-px bg-slate-100" />

              {/* 特徴・注意点 */}
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

              {/* 抽出された calloutNotices の表示エリア */}
              {hasNotices && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                      注記事項
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-[9px] text-slate-400 leading-relaxed font-sans">
                      <div className="space-y-1">
                        {activeNoticesA.map((notice, idx) => (
                          <p key={idx} className="wrap-break-word">
                            {notice}
                          </p>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {activeNoticesB.map((notice, idx) => (
                          <p key={idx} className="wrap-break-word">
                            {notice}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
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
