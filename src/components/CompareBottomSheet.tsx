"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { X, ArrowRight, Layers } from "lucide-react";

interface CompareBottomSheetProps {
  cards: CreditCard[];
}

export const CompareBottomSheet: React.FC<CompareBottomSheetProps> = ({ cards }) => {
  const { selectedIds, toggleCard, clearAll } = useCompareStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCards = cards.filter((c) => selectedIds.includes(c.id));

  if (selectedCards.length === 0) return null;

  return (
    <>
      {/* 画面下に常駐する固定バー */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-gray-900/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl z-40 flex items-center justify-between border border-gray-700/50">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-bold">
            {selectedCards.length}枚 選択中 {selectedCards.length === 1 && "(あと1枚)"}
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

      {/* 比較モーダル（ボトムシート） */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 animate-in slide-in-from-bottom duration-200">
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="font-bold text-gray-800 text-base">カード2枚の仕様比較</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 比較テーブル */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {selectedCards.map((card) => (
                <div key={card.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-gray-900 mb-2">{card.name}</p>
                    <div className="space-y-2 text-gray-600">
                      <div>
                        <span className="text-[10px] text-gray-400 block">年会費</span>
                        <span className="font-semibold text-gray-800">{card.annualFee}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">最大還元率</span>
                        <span className="font-bold text-red-500">{card.maxReturnRate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">基本還元率</span>
                        <span>{card.baseReturnRate}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={card.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-blue-600 text-white font-bold text-center py-2 rounded-lg block text-[11px]"
                  >
                    公式サイトへ
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};