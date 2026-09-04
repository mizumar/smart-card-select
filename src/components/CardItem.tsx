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

  // 上位1件のみ表示（展開で全件）
  const visibleFeatures = isOpen ? card.features : card.features.slice(0, 1);
  const hiddenFeaturesCount = card.features.length - 1;
  const visibleTags = card.tags.slice(0, 2);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all p-3 mb-2.5 relative overflow-hidden">
      {/* 1. ヘッダー：バッジ / タグ / 比較ボタン（極力薄くコンパクトに） */}
      <div className="flex items-center justify-between mb-2 gap-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden truncate">
          {card.badge && (
            <span className="inline-flex items-center gap-0.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
              <Award className="w-2.5 h-2.5" />
              <span>{card.badge}</span>
            </span>
          )}
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-100/80 text-slate-500 rounded-md truncate"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 比較ボタン */}
        <div className="relative shrink-0">
          <CompareTooltip isVisible={showTooltip} />
          <button
            onClick={() => {
              toggleCard(card.id);
              if (onCompareClick) onCompareClick(); // ← 比較ボタン押下時に明示的に呼び出して消去
            }}
            disabled={isMaxReached}
            className={`flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
              isCompared
                ? "bg-blue-50 border-blue-500 text-blue-600 font-bold"
                : isMaxReached
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 font-medium"
            }`}
          >
            {isCompared ? (
              <Check className="w-2.5 h-2.5" />
            ) : (
              <Plus className="w-2.5 h-2.5" />
            )}
            {isCompared ? "比較中" : isMaxReached ? "上限" : "比較"}
          </button>
        </div>
      </div>

      {/* 2. メインレイアウト：左（画像 ＋ スペック） / 右（タイトル ＋ CTAボタン） */}
      <div className="flex gap-3 items-start mb-2">
        {/* 左側：画像サイズは極力維持（w-28〜w-32） */}
        <div className="w-28 sm:w-32 shrink-0 flex flex-col items-center">
          {card.imageUrl ? (
            <div className="w-full flex items-center justify-center py-0.5">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-auto object-contain drop-shadow-xs"
                loading="lazy"
              />
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
            <div
              className={`w-24 h-14 rounded-lg bg-linear-to-br ${card.brandColor} p-1.5 flex flex-col justify-between shadow-xs border border-white/20`}
            >
              <div className="w-3 h-2 bg-amber-300/90 rounded-xs" />
              <span className="text-[8px] font-bold text-white truncate">
                {card.name}
              </span>
            </div>
          )}
        </div>

        {/* 右側：タイトル ＋ スペック数値 ＋ 右横にキュッと配置したCTA */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate tracking-tight mb-0.5">
              {card.name}
            </h3>

            {/* 年会費・還元率のミニ表示 */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
              <span>
                年会費:{" "}
                <strong className="text-slate-800">
                  <NoteText text={card.annualFee} />
                </strong>
              </span>
              <span className="text-slate-300">|</span>
              <span>
                還元率:{" "}
                <strong className="text-red-500 font-extrabold">
                  <NoteText text={card.maxReturnRate} />
                </strong>
              </span>
            </div>
          </div>

          {/* 右側にキュッと収まるコンパクトなCTAボタン（＆詳細リンク） */}
          <div className="flex items-center gap-2">
            {card.isPromoting === false ? (
              <button
                disabled
                className="flex-1 bg-slate-100 text-slate-400 font-bold text-[10.5px] py-2 px-2.5 rounded-lg text-center"
              >
                受付停止中
              </button>
            ) : (
              <a
                href={card.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10.5px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 shadow-xs active:scale-[0.98] transition-all"
              >
                <span>公式サイト</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            )}

            <Link
              href={`/cards/${card.id}`}
              className="shrink-0 text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 px-2 py-2 rounded-lg flex items-center gap-0.5 transition-colors"
            >
              <span>詳細</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 洗練されたコンパクトな機能・特徴表示（ダサい黄色枠を撤去） */}
      <div className="bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100/80 mb-1.5">
        <ul className="text-[10.5px] text-slate-600 space-y-1">
          {visibleFeatures.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-1.5 leading-tight truncate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. 開閉トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-[9.5px] font-medium text-slate-400 hover:text-slate-600 flex items-center justify-center gap-0.5 pt-0.5 transition-colors"
      >
        <span>
          {isOpen
            ? "閉じる"
            : hiddenFeaturesCount > 0
              ? `他${hiddenFeaturesCount}つの特徴・詳細スペック`
              : "詳細スペック"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-2.5 h-2.5" />
        ) : (
          <ChevronDown className="w-2.5 h-2.5" />
        )}
      </button>

      {/* 5. 開閉エリア */}
      {isOpen && (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] space-y-1.5 text-slate-600 bg-slate-50/50 -mx-3 -mb-3 p-3 rounded-b-2xl">
          <div className="flex items-start gap-1">
            <span className="font-bold text-slate-700 shrink-0">
              基本還元率:
            </span>
            <span>{card.baseReturnRate}</span>
          </div>
          <div className="flex items-start gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span className="font-bold text-slate-700 shrink-0">付帯保険:</span>
            <span>{card.details.insurance}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-0.5">
              電子マネー対応:
            </span>
            <div className="flex flex-wrap gap-1">
              {card.details.electronicMoney.map((em) => (
                <span
                  key={em}
                  className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] text-slate-500"
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
