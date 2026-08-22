"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import {
  X,
  ArrowRight,
  Layers,
  ExternalLink,
  Trophy,
  CheckCircle2,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { cards } from "@/data/cards"; // ★ 直接インポート

interface CompareBottomSheetProps {}

export const CompareBottomSheet: React.FC<CompareBottomSheetProps> = () => {
  const { selectedIds, clearAll, toggleCard } = useCompareStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCards = cards.filter((c) => selectedIds.includes(c.id));

  if (selectedCards.length === 0) return null;

  // 2枚ある場合のカード参照
  const cardA = selectedCards[0];
  const cardB = selectedCards[1];

  // 還元率などの数値を比較して「勝ち（おすすめ）」判定をする簡単なロジック
  // ※カードデータに recommend などのフラグがあればそれを優先
  const getBetterCardId = () => {
    if (!cardA || !cardB) return null;
    // maxReturnRate などの文字列/数値比較（数値化して比較）
    const parseRate = (rateStr: string) => parseFloat(rateStr) || 0;
    const rateA = parseRate(cardA.maxReturnRate);
    const rateB = parseRate(cardB.maxReturnRate);
    if (rateA > rateB) return cardA.id;
    if (rateB > rateA) return cardB.id;
    return cardA.id; // 同等の場合は1枚目
  };

  const betterCardId = getBetterCardId();

  return (
    <div>
      {/* ① 画面下に常駐する固定バー＋上部バッジの親コンテナ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 flex flex-col items-start gap-1.5 pointer-events-none">
        {/* 選択中カードのバッジ（固定バーの上の左側に縦に並ぶ） */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {selectedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between gap-3 px-3 py-1.5 bg-slate-900/75 text-white backdrop-blur-md rounded-xl shadow-lg border border-slate-700/60 "
            >
              <div className="flex items-center gap-2 min-w-0">
                <CreditCardIcon className="items-center w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold truncate max-w-[140px]">
                  {card.name}
                </span>
              </div>

              {/* 個別解除ボタン */}
              <button
                type="button"
                onClick={() => toggleCard(card.id)}
                className="p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
                aria-label={`${card.name}の選択を解除`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* メインの比較ボトムバー */}
        <div className="w-full bg-gray-900/75 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-gray-700/50 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold">
              {selectedCards.length}枚 選択中{" "}
              {selectedCards.length === 1 && "(あと1枚)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedCards.length === 2 && (
              <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all shadow-md"
              >
                <span>比較する</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              aria-label="すべてクリア"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ② 比較モーダル（ボトムシート） */}
      {isOpen && cardA && cardB && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 md:p-4">
          <div className="bg-[#F9F9FF] w-full max-w-md rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto p-4 md:p-5 animate-in slide-in-from-bottom duration-200 border border-slate-100 flex flex-col">
            {/* モーダルヘッダー */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                {/* <span className="material-symbols-outlined text-blue-900 text-xl">
                  compare_arrows
                </span> */}
                <h2 className="font-bold text-slate-800 text-sm md:text-base">
                  カード2枚の仕様比較
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* カード2枚の上部デザイン ＆ 単独申込ボタン */}
              <div className="grid grid-cols-2 gap-3 items-stretch">
                {[cardA, cardB].map((card) => {
                  const isBest = card.id === betterCardId;
                  return (
                    <div
                      key={card.id}
                      className="flex flex-col items-center relative"
                    >
                      {/* おすすめバッジ */}
                      {isBest && (
                        <div className="absolute -top-2.5 z-10 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 border border-white">
                          <Trophy className="w-3 h-3 text-yellow-200" />
                          <span>おすすめ！</span>
                        </div>
                      )}
                      {/* カード券面表示エリア（画像またはモック） */}
                      {card.imageUrl ? (
                        // 実画像：モックと同じ aspect で“高さ”を固定（ここだけ変更）
                        <div className="w-full aspect-[1.58/1] flex items-center justify-center shrink-0">
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-contain drop-shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-full aspect-[1.58/1] rounded-xl bg-linear-to-br ${card.brandColor} p-2 flex flex-col justify-between shadow-md shadow-slate-200 shrink-0 border border-white/20relative overflow-hidden`}
                        >
                          <div className="w-6 h-4 bg-yellow-300/80 rounded-sm mt-1" />
                          <div>
                            <p className="text-[10px] font-bold text-white truncate">
                              {card.name}
                            </p>
                            <p className="text-[9px] font-mono text-white tracking-widest">
                              **** 1234
                            </p>
                          </div>
                        </div>
                      )}
                      {/* 両方に入れる“最低限の空白” */}
                      <div className="h-2 w-full" aria-hidden />{" "}
                      {/* ここが“短い側にだけ増える空白” */}
                      <div className="flex-1 w-full" />
                      <a
                        href={card.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={`w-full py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all active:scale-95 flex items-end justify-center gap-1 shadow-xs ${
                          isBest
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <span>公式サイトへ</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* 比較表（HTML風の綺麗なグリッド構造） */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden text-xs">
                {/* 行：年会費 */}
                <div className="grid grid-cols-2 border-b border-slate-100 relative">
                  <div className="col-span-2 bg-slate-50 py-1 px-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      年会費
                    </span>
                  </div>
                  <div className="p-2.5 text-center font-bold text-slate-700 border-l border-transparent">
                    {cardA.annualFee}
                  </div>
                  <div className="p-2.5 text-center font-bold text-slate-700 border-l border-slate-100">
                    {cardB.annualFee}
                  </div>
                </div>

                {/* 行：最大還元率 */}
                <div className="grid grid-cols-2 border-b border-slate-100 relative">
                  <div className="col-span-2 bg-slate-50 py-1 px-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      最大還元率
                    </span>
                  </div>
                  <div className="p-2.5 text-center font-bold text-red-500 flex items-center justify-center gap-1 border-l border-transparent whitespace-pre-wrap">
                    <span>{cardA.maxReturnRate}</span>
                    {cardA.id === betterCardId && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="p-2.5 text-center font-bold text-red-500 flex items-center justify-center gap-1 border-l border-slate-100 whitespace-pre-wrap">
                    <span>{cardB.maxReturnRate}</span>
                    {cardB.id === betterCardId && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </div>

                {/* 行：基本還元率 */}
                <div className="grid grid-cols-2 border-b border-slate-100 relative">
                  <div className="col-span-2 bg-slate-50 py-1 px-3 text-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      基本還元率
                    </span>
                  </div>
                  <div className="p-2.5 text-center text-slate-700 border-l border-transparent whitespace-pre-wrap">
                    {cardA.baseReturnRate}
                  </div>
                  <div className="p-2.5 text-center text-slate-700 border-l border-slate-100 whitespace-pre-wrap">
                    {cardB.baseReturnRate}
                  </div>
                </div>
              </div>

              {/* 2枚同時に開くボタン */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    window.open(
                      cardA.affiliateUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    window.location.href = cardB.affiliateUrl; // これで確実にBへ行ける（同時ではない）
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>両方の公式サイトを同時に開く</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
