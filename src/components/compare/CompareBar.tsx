"use client";

import {
  X,
  ArrowRight,
  Layers,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import type { CreditCard } from "@/data/cards";

interface CompareBarProps {
  selectedCards: CreditCard[];
  onOpen: () => void;
  onClear: () => void;
  onRemove: (cardId: string) => void;
}

export function CompareBar({
  selectedCards,
  onOpen,
  onClear,
  onRemove,
}: CompareBarProps) {
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
                onClick={() => onRemove(String(card.id))}
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
                onClick={onOpen} // ★ ストアの setIsOpen(true) を呼ぶ
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>比較を見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
