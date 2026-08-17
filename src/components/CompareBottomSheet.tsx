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
} from "lucide-react";

interface CompareBottomSheetProps {
  cards: CreditCard[];
}

export const CompareBottomSheet: React.FC<CompareBottomSheetProps> = ({
  cards,
}) => {
  const { selectedIds, clearAll } = useCompareStore();
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
    <>
      {/* ① 画面下に常駐する固定バー */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-gray-900/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl z-40 flex items-center justify-between border border-gray-700/50">
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
          >
            <X className="w-4 h-4" />
          </button>
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
              <div className="grid grid-cols-2 gap-3">
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

                      {/* 簡易カード券面風デザイン */}
                      <div className="w-full aspect-[1.58/1] rounded-xl bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 text-white p-3 shadow-sm flex flex-col justify-between mb-2 relative overflow-hidden">
                        <div className="w-6 h-4 bg-yellow-300/80 rounded-xs mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-300 truncate">
                            {card.name}
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 tracking-widest">
                            **** 1234
                          </p>
                        </div>
                      </div>

                      <a
                        href={card.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xs ${
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
                  <div className="p-2.5 text-center font-bold text-red-500 flex items-center justify-center gap-1 border-l border-transparent">
                    <span>{cardA.maxReturnRate}</span>
                    {cardA.id === betterCardId && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="p-2.5 text-center font-bold text-red-500 flex items-center justify-center gap-1 border-l border-slate-100">
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
                  <div className="p-2.5 text-center text-slate-700 border-l border-transparent">
                    {cardA.baseReturnRate}
                  </div>
                  <div className="p-2.5 text-center text-slate-700 border-l border-slate-100">
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
    </>
  );
};
