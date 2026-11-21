"use client";

import type { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { ExternalLink, ChevronRight, Minus } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";

interface CompareCardProps {
  cardA: CreditCard;
  cardB: CreditCard;
}

export function CompareCard({ cardA, cardB }: CompareCardProps) {
  const { removeAndClose } = useCompareStore();

  return (
    <>
      {[cardA, cardB].map((card) => (
        <div
          key={card.id}
          className="relative flex flex-col items-center bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/60"
        >
          {/* バッジ ＆ 比較解除（マイナス）ボタンの行 */}
          <div className="h-5 flex items-center justify-between mb-2 w-full px-1">
            {/* 左側：バッジ */}
            <div className="min-w-0 flex-1">
              {card.badge ? (
                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md whitespace-nowrap truncate inline-block max-w-full">
                  {card.badge}
                </span>
              ) : (
                <span className="text-[10px] text-transparent select-none">
                  -
                </span>
              )}
            </div>
            {/* 右側：比較解除（マイナス）ボタン */}
            <button
              type="button"
              onClick={() => removeAndClose(String(card.id))}
              title="比較から外す"
              aria-label={`${card.name}を比較から外す`}
              className="p-1 -mr-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md transition-colors shrink-0"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
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
          <div className="h-2 w-full" aria-hidden />
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
    </>
  );
}
