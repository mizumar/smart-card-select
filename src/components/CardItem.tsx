"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  ShieldCheck,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { CompareTooltip } from "./CompareTooltip";
import { CalloutNotice } from "@/components/CalloutNotice";
import Link from "next/link";
import NoteText from "@/components/NoteText";

interface CardItemProps {
  card: CreditCard;
  showTooltip?: boolean;
  onCompareClick?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  showTooltip = false,
  onCompareClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedIds, toggleCard } = useCompareStore();

  const isCompared = selectedIds.includes(card.id);
  const isMaxReached = selectedIds.length >= 2 && !isCompared;

  // CardItem.tsx のメインコンテナ周辺の調整例
  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all p-4 mb-3.5 relative overflow-hidden">
      {/* バッジ */}
      {card.badge && (
        <div className="inline-flex items-center gap-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2.5 shadow-sm shadow-orange-500/20">
          <Award className="w-3 h-3" />
          <span>{card.badge}</span>
        </div>
      )}

      {/* タグ ＆ 比較ボタン */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 bg-slate-100/80 text-slate-600 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 比較ボタン等のエリアの相対位置（relative）内に配置 */}
        <div className="relative">
          {/* ツールチップ呼び出し */}
          <CompareTooltip isVisible={showTooltip} />
          <button
            onClick={() => {
              toggleCard(card.id);
              if (onCompareClick) onCompareClick(); // ← 比較ボタン押下時に明示的に呼び出して消去
            }}
            disabled={isMaxReached}
            className={`flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border transition-all shrink-0 ${
              isCompared
                ? "bg-blue-50 border-blue-500 text-blue-600 font-bold"
                : isMaxReached
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            }`}
          >
            {isCompared ? (
              <Check className="w-3 h-3" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            {isCompared ? "比較中" : isMaxReached ? "上限(2枚)" : "比較"}
          </button>
        </div>
      </div>

      {/* 券面 ＆ タイトル ＆ スペック */}
      <div className="flex gap-3.5 items-center mb-3">
        {/* カード券面表示エリア（画像またはモック） */}
        {card.imageUrl ? (
          // 1. 実画像（ASPバナー素材）：枠組み・比率固定を全撤去し、横幅144px（w-36）でドカンと表示
          <div className="w-36 sm:w-40 shrink-0 flex items-center justify-center">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-auto object-contain drop-shadow-sm"
              loading="lazy"
            />
            {/* IMP計測用1x1透明ビーコン */}
            {card.trackingImageUrl && (
              <img
                src={card.trackingImageUrl}
                width={1}
                height={1}
                alt=""
                className="absolute opacity-0 pointer-events-none w-px h-px"
                aria-hidden="true"
              />
            )}
          </div>
        ) : (
          // 2. 実画像がない場合：従来のモックデザイン
          <div
            className={`w-24 h-15 rounded-xl bg-linear-to-br ${card.brandColor} p-2 flex flex-col justify-between shadow-md shadow-slate-200 shrink-0 border border-white/20`}
          >
            <div className="w-3.5 h-2.5 bg-amber-300/90 rounded-sm shadow-2xs" />
            <span className="text-[9px] font-bold text-white tracking-wider truncate drop-shadow-sm">
              {card.name}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 truncate mb-1.5 tracking-tight">
            {card.name}
          </h3>

          {/* 「詳細を見る」リンク */}
          <Link
            href={`/cards/${card.id}`}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors group mb-1.5"
          >
            <span>カードの詳細を見る</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="grid grid-cols-2 gap-1 bg-slate-50/80 p-2 rounded-xl text-center border border-slate-100">
            <div>
              <p className="text-[9px] text-slate-400 font-medium">年会費</p>
              <p className="text-xs font-bold text-slate-700 truncate">
                <NoteText text={card.annualFee} />
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-medium">
                最大還元率
              </p>
              <p className="text-xs font-extrabold text-red-500 ">
                <NoteText text={card.maxReturnRate} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 特徴リスト */}
      <ul className="text-xs text-slate-700 space-y-1.5 mb-3.5 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50 whitespace-pre-wrap">
        {card.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-1.5 leading-tight">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="font-medium text-[11px] text-slate-700">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* 発行ボタン（グラデーションとシャドウを少し上品に） */}
      {card.isPromoting === false ? (
        <button
          disabled
          className="w-full bg-slate-200 text-slate-500 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all mb-2"
        >
          <span>現在受付停止中</span>
        </button>
      ) : (
        <a
          href={card.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all mb-2"
        >
          <span>発行公式サイトを見る</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-[11px] font-medium text-gray-400 flex items-center justify-center gap-1 py-1 hover:text-gray-600 transition-colors"
      >
        <span>{isOpen ? "詳細スペックを閉じる" : "詳細スペックを見る"}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 pt-3 border-t border-gray-100 text-[11px] space-y-2 text-gray-600 bg-gray-50/50 -mx-4 -mb-4 p-4 rounded-b-3xl">
          <div className="flex items-start gap-1 whitespace-pre-wrap">
            <span className="font-bold text-gray-700 shrink-0">
              基本還元率:
            </span>
            <span>{card.baseReturnRate}</span>
          </div>
          <div className="flex items-start gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span className="font-bold text-gray-700 shrink-0">付帯保険:</span>
            <span>{card.details.insurance}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700 block mb-0.5">
              電子マネー対応:
            </span>
            <div className="flex flex-wrap gap-1">
              {card.details.electronicMoney.map((em) => (
                <span
                  key={em}
                  className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-500"
                >
                  {em}
                </span>
              ))}
            </div>
          </div>
          <CalloutNotice
            title="※ ご注意・注釈事項"
            items={card.calloutNotices}
          />
        </div>
      )}
    </div>
  );
};
