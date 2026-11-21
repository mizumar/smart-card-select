"use client";

import React from "react";
import type { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { X, ArrowRight, Check, ArrowLeft, Zap } from "lucide-react";
import NoteText from "@/components/NoteText";
import { CompareCard } from "@/components/compare/CompareCard";

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
  const { setIsOpen, removeAndClose } = useCompareStore();
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
              <div>
                {/* ① 年間お得額表示エリア */}
                <div>
                  <div className="text-center mb-2">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      年間実質お得額（シミュレーション）
                    </p>
                    <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                      ※基本還元率での試算。特定店舗や特典によりさらに上振れる場合があります
                    </p>
                  </div>

                  {/* 同額（無料×無料など還元率が同じ）の場合は1つに統合 */}
                  {benefitA.netBenefit === benefitB.netBenefit ? (
                    <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 mb-0.5">
                        2枚とも同じお得額です
                      </p>
                      <div>
                        <span
                          className={`text-2xl font-black tracking-tight ${
                            !benefitA.isProfit
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {benefitA.netBenefit > 0 && "約"}
                          {benefitA.formattedBenefit}
                        </span>
                        <span className="text-xs font-bold text-slate-400 ml-0.5">
                          {benefitA.netBenefit > 0 ? "円相当/年" : "円/年"}
                        </span>
                      </div>
                      <div className="mt-1 text-[9px] text-slate-400 font-mono">
                        基本 {benefitA.baseRate}% × 年間
                        {(monthlySpend * 12) / 10000}万 - 年会費
                      </div>
                    </div>
                  ) : (
                    /* 差額がある場合：チップなしでシンプルに2列並べる */
                    <div className="grid grid-cols-2 divide-x divide-slate-100 text-center items-center">
                      {[
                        { benefit: benefitA, other: benefitB },
                        { benefit: benefitB, other: benefitA },
                      ].map(({ benefit, other }, idx) => {
                        const isWinner = benefit.netBenefit > other.netBenefit;
                        return (
                          <div
                            key={idx}
                            className="px-1.5 flex flex-col items-center"
                          >
                            <div>
                              <span
                                className={`text-xl font-black tracking-tight ${
                                  !benefit.isProfit
                                    ? "text-red-500"
                                    : isWinner
                                      ? "text-emerald-600"
                                      : "text-slate-700"
                                }`}
                              >
                                {benefit.netBenefit > 0 && "約"}
                                {benefit.formattedBenefit}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                                {benefit.netBenefit > 0 ? "円相当/年" : "円/年"}
                              </span>
                            </div>
                            <div className="mt-1.5 text-[9px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100/80 whitespace-nowrap">
                              基本 {benefit.baseRate}% × 年間
                              {(monthlySpend * 12) / 10000}万 - 年会費
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ★★★ 3. 月間利用額コントロール（スライダー & 分岐点ボタン） ★★★ */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                {/* メイン金額表示 */}
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">
                    想定の月間カード利用額
                  </span>
                  <span className="text-base font-black text-slate-900 tracking-tight">
                    {monthlySpend >= 10000 ? (
                      <>
                        {(monthlySpend / 10000).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        <span className="text-xs font-medium text-slate-500 ml-0.5">
                          万円/月
                        </span>
                      </>
                    ) : (
                      <>
                        {monthlySpend.toLocaleString()}
                        <span className="text-xs font-medium text-slate-500 ml-0.5">
                          円/月
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {/* レンジスライダー */}
                <div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none block"
                  />
                  <div className="relative mx-1 mt-1.5 h-3 text-[9px] text-slate-400 font-medium">
                    <span className="absolute left-0">0円</span>
                    <span className="absolute left-1/4 -translate-x-1/2">
                      25万円
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2">
                      50万円
                    </span>
                    <span className="absolute left-3/4 -translate-x-1/2">
                      75万円
                    </span>
                    <span className="absolute right-0">100万円</span>
                  </div>
                </div>

                {/* ▼▼▼ 全パターン対応・洗練された分岐点チップ群 ▼▼▼ */}
                {breakEvenInfo && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-medium text-slate-400 mr-0.5 shrink-0 select-none">
                      自動セット
                    </span>

                    {/* 損益分岐点（有料vs有料、有料vs無料のどちらでも計算可能であれば表示） */}
                    {breakEvenInfo.crossSpend && (
                      <button
                        type="button"
                        onClick={() =>
                          setMonthlySpend(breakEvenInfo.crossSpend!)
                        }
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                          monthlySpend === breakEvenInfo.crossSpend
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80"
                        }`}
                      >
                        <Zap className="w-2.5 h-2.5 shrink-0" />
                        <span>損益分岐点</span>
                      </button>
                    )}

                    {/* 左カード：単体での実質0円ライン */}
                    {breakEvenInfo.zeroSpendA && (
                      <button
                        type="button"
                        onClick={() =>
                          setMonthlySpend(breakEvenInfo.zeroSpendA!)
                        }
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                          monthlySpend === breakEvenInfo.zeroSpendA
                            ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
                        <span>実質0円</span>
                      </button>
                    )}

                    {/* 右カード：単体での実質0円ライン */}
                    {breakEvenInfo.zeroSpendB && (
                      <button
                        type="button"
                        onClick={() =>
                          setMonthlySpend(breakEvenInfo.zeroSpendB!)
                        }
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                          monthlySpend === breakEvenInfo.zeroSpendB
                            ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span>実質0円</span>
                        <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* ② 貯まるポイント */}
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
