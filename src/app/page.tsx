"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { cards } from "@/data/cards";
import { CardItem } from "@/components/CardItem";
import { NavBanner } from "@/components/NavBanner";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { DiagnosisModal } from "@/components/DiagnosisModal";
import { Sparkles, ArrowUpDown, BookOpen, Heart } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

const FILTER_TAGS = [
  "すべて",
  "年会費無料",
  "イオン系",
  "楽天経済圏",
  "初心者",
  "コンビニ高還元",
];

type SortOption = "popular" | "rate" | "fee" | "base";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("すべて");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);

  // ツールチップ関連
  const { selectedIds } = useCompareStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // お気に入り関連
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // 1. フィルター処理（タグ絞り込み ＋ お気に入り絞り込み）
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // タグフィルターの判定
      const matchesTag =
        selectedFilter === "すべて" || card.tags.includes(selectedFilter);

      // お気に入りフィルターの判定
      const matchesFavorite = showOnlyFavorites
        ? favoriteIds.includes(card.id)
        : true;

      return matchesTag && matchesFavorite;
    });
  }, [selectedFilter, showOnlyFavorites, favoriteIds]);

  // 2. ソート処理（絞り込まれた結果をソートする）
  const displayedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      if (sortOption === "rate") {
        return (b.maxReturnRateValue || 0) - (a.maxReturnRateValue || 0);
      }
      if (sortOption === "fee") {
        return (a.annualFeeValue || 0) - (b.annualFeeValue || 0);
      }
      if (sortOption === "base") {
        return (b.baseReturnRateValue || 0) - (a.baseReturnRateValue || 0);
      }
      return (a.popularityRank || 99) - (b.popularityRank || 99);
    });
  }, [filteredCards, sortOption]);

  // ツールチップ消去関数
  const dismissTooltip = () => {
    setShowTooltip(false);
    sessionStorage.setItem("compare_tooltip_dismissed", "true");
  };

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("compare_tooltip_dismissed");
    if (isDismissed || selectedIds.length > 0) return;

    setShowTooltip(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        dismissTooltip();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedIds]);

  return (
    <main className="flex-1 min-h-screen bg-gray-50 pb-28">
      <div className="max-w-md mx-auto p-4">
        {/* バナー表示 */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <NavBanner
            onClick={() => setIsDiagnosisOpen(true)}
            subTitle="10秒でわかる"
            title="カード診断"
            icon={<Sparkles className="w-4 h-4" />}
            theme="orange"
          />
          <NavBanner
            href="/articles"
            subTitle="記事掲載"
            title="クレカコラム"
            icon={
              <BookOpen className="w-4 h-4 text-indigo-200" strokeWidth={2} />
            }
            theme="indigo"
          />
        </div>

        {/* ─── 上部「お気に入り / すべて」切替エリア ─── */}
        <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-xl mb-3">
          <div className="flex items-center space-x-1.5 w-full">
            <button
              type="button"
              onClick={() => setShowOnlyFavorites(false)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                !showOnlyFavorites
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              すべて表示 ({cards.length})
            </button>

            <button
              type="button"
              onClick={() => setShowOnlyFavorites(true)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                showOnlyFavorites
                  ? "bg-red-500 text-white shadow-xs"
                  : "bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  showOnlyFavorites ? "fill-white" : "text-red-500"
                }`}
              />
              <span>お気に入り ({favoriteIds.length})</span>
            </button>
          </div>
        </div>

        {/* フィルターチップ（カテゴリタグ） */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-1 no-scrollbar">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === tag
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ソート（並び替え）バー ＆ 件数表示 */}
        <div className="flex items-center justify-between my-3 px-1 text-xs text-gray-500">
          <span className="font-medium text-[11px]">
            {displayedCards.length}件を表示中
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-gray-700 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="popular">人気順</option>
              <option value="rate">最大還元率が高い順</option>
              <option value="base">基本還元率が高い順</option>
              <option value="fee">年会費が安い順</option>
            </select>
          </div>
        </div>

        {/* ─── カード一覧描画エリア ─── */}
        {displayedCards.length === 0 ? (
          /* お気に入り0件または該当カードなし */
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-4">
            <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">
              {showOnlyFavorites
                ? "お気に入りに追加されたカードはありません"
                : "該当するカードが見つかりませんでした"}
            </p>
            {showOnlyFavorites && (
              <p className="text-[10px] text-slate-400 mt-1">
                カード内にあるハートボタンを押すとここに追加されます
              </p>
            )}
          </div>
        ) : (
          /* カード一覧 */
          <div className="space-y-2.5">
            {displayedCards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                showTooltip={index === 0 && showTooltip}
                onCompareClick={dismissTooltip}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2枚比較ボトムシート */}
      <CompareBottomSheet cards={cards} />
      {/* 簡易診断モーダル */}
      <DiagnosisModal
        cards={cards}
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
      />
    </main>
  );
}
