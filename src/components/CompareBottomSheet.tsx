"use client";

import React from "react";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import {
  X,
  ArrowRight,
  Layers,
  ExternalLink,
  CreditCard as CreditCardIcon,
  ChevronRight,
  Check,
  ArrowLeft,
  Zap,
} from "lucide-react";
import Link from "next/link";
import NoteText from "@/components/NoteText";
import { FavoriteButton } from "@/components/FavoriteButton";

interface CompareBottomSheetProps {
  cards: CreditCard[];
}

export const CompareBottomSheet: React.FC<CompareBottomSheetProps> = ({
  cards,
}) => {
  // ★ isOpen, setIsOpen をストアから取得
  const { selectedIds, isOpen, setIsOpen, clearAll, toggleCard } =
    useCompareStore();

  // ★ selectedIds と cards.id を型を揃えて照合
  const selectedCards = cards.filter((c) => selectedIds.includes(String(c.id)));

  // ★ 1. 月間利用額の状態を追加（初期値: 10万円 = 100,000）
  const [monthlySpend, setMonthlySpend] = React.useState<number>(100000);

  const cardA = selectedCards[0];
  const cardB = selectedCards[1];

  // 損益分岐点・実質0円ラインの統合算出
  const breakEvenInfo = React.useMemo(() => {
    if (!cardA || !cardB) return null;

    const feeA = Number(cardA.annualFeeValue) || 0;
    const feeB = Number(cardB.annualFeeValue) || 0;
    const rateA = Number(cardA.baseReturnRateValue) || 0;
    const rateB = Number(cardB.baseReturnRateValue) || 0;

    // 【1】無料 vs 無料 は完全に除外
    if (feeA === 0 && feeB === 0) return null;

    // 単体での実質0円ライン（年会費回収）
    const getZeroSpend = (fee: number, rate: number) => {
      if (fee <= 0 || rate <= 0) return null;
      return Math.round(fee / (rate / 100) / 12);
    };

    const zeroSpendA = getZeroSpend(feeA, rateA);
    const zeroSpendB = getZeroSpend(feeB, rateB);

    // 【2】2枚の損益分岐点（高年会費側が、高還元率で逆転できる場合のみ計算）
    let crossSpend: number | null = null;

    // 年会費が高い方のカードと安い方のカードを判定
    const expensive =
      feeA >= feeB ? { fee: feeA, rate: rateA } : { fee: feeB, rate: rateB };
    const cheaper =
      feeA >= feeB ? { fee: feeB, rate: rateB } : { fee: feeA, rate: rateA };

    const feeDiff = expensive.fee - cheaper.fee;
    const rateDiff = expensive.rate - cheaper.rate;

    // 有料カード側の還元率が安い側より「厳密に高い（rateDiff > 0）」時だけ逆転が存在する
    if (feeDiff > 0 && rateDiff > 0) {
      crossSpend = Math.round(feeDiff / (rateDiff / 100) / 12);
    }

    return { zeroSpendA, zeroSpendB, crossSpend };
  }, [cardA, cardB]);

  // 1枚も選択されていなければ何も表示しない（バーもモーダルも非表示）
  if (selectedCards.length === 0) return null;

  // ★ 2. 動的な年間実質お得額の計算関数（monthlySpend に依存）
  const calculateAnnualBenefit = (card: CreditCard, spend: number) => {
    const annualSpend = spend * 12; // 月額 × 12ヶ月
    const baseRate = card.baseReturnRateValue ?? 0;
    const annualFee = card.annualFeeValue ?? 0;

    const grossReturn = (annualSpend * baseRate) / 100;
    const netBenefit = grossReturn - annualFee;

    return {
      baseRate,
      annualFee,
      netBenefit,
      // マイナス時は絶対値にしてハイフン表示などの制御もしやすくする
      formattedBenefit: Math.floor(netBenefit).toLocaleString(),
      isProfit: netBenefit >= 0, // ★ 黒字か赤字かの判定
    };
  };

  const benefitA = cardA ? calculateAnnualBenefit(cardA, monthlySpend) : null;
  const benefitB = cardB ? calculateAnnualBenefit(cardB, monthlySpend) : null;

  // 画面上に登場する※マークに対応する calloutNotices だけを抽出する関数
  const getActiveCalloutNotices = (card: CreditCard) => {
    if (!card) return [];

    // 1. 画面上に表示されているテキスト要素を結合
    const targetTexts = [
      card.maxReturnRate,
      card.annualFee,
      card.baseReturnRate,
      card.badge,
      ...(card.details?.pros || []),
      ...(card.details?.cons || []),
    ]
      .filter(Boolean)
      .join(" ");

    // 2. テキスト内から 「※1」「※2」「*1」 等の記号パターンを抽出
    const matchedKeys = Array.from(
      new Set(targetTexts.match(/(※\d+|[※*＊]\d*)/g) || []),
    );

    const noticesObj = card.calloutNotices;
    if (!noticesObj) return [];

    // 3. オブジェクト構造の場合 ({ "※1": "説明...", ... })
    if (typeof noticesObj === "object" && !Array.isArray(noticesObj)) {
      const activeEntries = Object.entries(noticesObj).filter(([key]) =>
        matchedKeys.some((mKey) => key.includes(mKey) || mKey.includes(key)),
      );

      // 記号が見つからなかった場合のフォールバック（全件出力）
      if (activeEntries.length === 0 && matchedKeys.length === 0) {
        return Object.entries(noticesObj).map(([k, v]) => `${k} ${v}`);
      }

      return activeEntries.map(([key, value]) => `${key} ${value}`);
    }

    // 4. 配列構造の場合 (["※1 説明...", ...])
    if (Array.isArray(noticesObj)) {
      if (matchedKeys.length === 0) return noticesObj;

      return noticesObj.filter((notice) =>
        matchedKeys.some((mKey) => notice.includes(mKey)),
      );
    }

    return [];
  };

  const activeNoticesA = cardA ? getActiveCalloutNotices(cardA) : [];
  const activeNoticesB = cardB ? getActiveCalloutNotices(cardB) : [];
  const hasNotices = activeNoticesA.length > 0 || activeNoticesB.length > 0;

  return (
    <div>
      {/* ① フローティング比較バー */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 flex flex-col items-start gap-2 pointer-events-none">
        {/* 選択中バッジ */}
        <div className="flex flex-col gap-1 pointer-events-auto">
          {selectedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between gap-3 px-3 py-1.5 bg-slate-900/90 text-white backdrop-blur-xl rounded-xl shadow-md border border-white/10"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CreditCardIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-medium truncate max-w-130px">
                  {card.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleCard(String(card.id))}
                className="p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* ボトムバー */}
        <div className="w-full bg-slate-900 text-white p-2.5 pl-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold tracking-tight">
              {selectedCards.length} / 2 枚選択中
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {selectedCards.length === 2 && (
              <button
                type="button"
                onClick={() => setIsOpen(true)} // ★ ストアの setIsOpen(true) を呼ぶ
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>比較を見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ② 比較モーダル */}
      {isOpen && cardA && cardB && benefitA && benefitB && (
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
                {[cardA, cardB].map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col items-center bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/60"
                  >
                    {/* バッジ（1行固定・はみ出し防止） */}
                    <div className="h-5 flex items-center justify-center mb-2 w-full px-1">
                      {card.badge ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md whitespace-nowrap truncate max-w-full">
                          {card.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-transparent select-none">
                          -
                        </span>
                      )}
                    </div>
                    {/* カード画像 */}
                    <div className="w-full aspect-[1.58/1] bg-slate-50 rounded-lg p-1 flex items-center justify-center border border-slate-100 mb-2">
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div
                          className={`w-full h-full rounded-md bg-linear-to-br ${card.brandColor} p-2 flex flex-col justify-end shadow-xs`}
                        >
                          <p className="text-[9px] font-bold text-white truncate">
                            {card.name}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* 両方に入れる“最低限の空白” */}
                    <div className="h-2 w-full" aria-hidden />{" "}
                    {/* ここが“短い側にだけ増える空白” */}
                    <div className="flex-1 w-full" />
                    <h3 className="font-bold text-xs text-slate-900 truncate w-full text-center mb-1">
                      {card.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      {/* ハート（お気に入り）ボタン */}
                      <FavoriteButton cardId={card.id} />
                      <Link
                        href={`/cards/${card.id}`}
                        className="inline-flex items-center text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        <span>詳細</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    {/* 公式ボタン */}
                    <a
                      href={card.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>公式サイトへ</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                ))}
              </div>

              {/* スペック比較 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-xs space-y-4 text-xs">
                {/* 年間お得額表示エリア */}
                <div>
                  <div className="text-center mb-2">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      年間実質お得額（シミュレーション）
                    </p>
                    <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                      ※基本還元率での試算。特定店舗や特典によりさらに上振れる場合があります
                    </p>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
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
                            {/* ★ 黒字・赤字・勝者に応じたカラー制御 */}
                            <span
                              className={`text-xl font-black tracking-tight ${
                                !benefit.isProfit
                                  ? "text-red-500" // 赤字（マイナス）
                                  : isWinner
                                    ? "text-emerald-600" // 勝者かつ黒字
                                    : "text-slate-700" // 黒字
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

                {/* 貯まるポイント */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mb-1.5">
                    貯まるポイント
                  </p>
                  <div className="grid grid-cols-2 divide-x divide-slate-100 text-center font-bold text-slate-800">
                    <div>{cardA.pointName || "-"}</div>
                    <div>{cardB.pointName || "-"}</div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 最大還元率 / 年会費 */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mb-1.5">
                    最大還元率 / 年会費
                  </p>
                  <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
                    {[cardA, cardB].map((card) => (
                      <div key={card.id} className="space-y-0.5">
                        <div className="font-bold text-slate-900">
                          <NoteText text={card.maxReturnRate} />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <NoteText text={card.annualFee} />
                        </div>
                      </div>
                    ))}
                  </div>
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
      )}
    </div>
  );
};
