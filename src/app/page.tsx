"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cards } from "@/data/cards";
import { CardItem } from "@/components/CardItem";
import { NavBanner } from "@/components/NavBanner";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { DiagnosisModal } from "@/components/DiagnosisModal";
import { Sparkles, ArrowUpDown, BookOpen } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";

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

  // 1. フィルター処理
  const filteredCards = cards.filter((card) => {
    if (selectedFilter === "すべて") return true;
    return card.tags.includes(selectedFilter);
  });

  // 2. ソート処理（確定版）
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortOption === "rate") {
      // 最大還元率が高い順 (降順: b - a)
      return (b.maxReturnRateValue || 0) - (a.maxReturnRateValue || 0);
    }
    if (sortOption === "fee") {
      // 年会費が安い順 (昇順: a - b)
      return (a.annualFeeValue || 0) - (b.annualFeeValue || 0);
    }
    if (sortOption === "base") {
      // 基本還元率が高い順 (降順: b - a)
      return (b.baseReturnRateValue || 0) - (a.baseReturnRateValue || 0);
    }
    // 人気順 (昇順: a - b ※ 1位, 2位, 3位の順)
    return (a.popularityRank || 99) - (b.popularityRank || 99);
  });

  // ツールチップを消去してストレージに保存する関数
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
        <div className="max-w-md mx-auto px-4 mb-4">
          <div className="grid grid-cols-2 gap-2.5">
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
        </div>

        {/* フィルターチップ */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === tag
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ★ 施策2: ソート（並び替え）バー */}
        <div className="flex items-center justify-between my-3 px-1 text-xs text-gray-500">
          <span className="font-medium text-[11px]">
            {sortedCards.length}件を表示中
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

        {/* カード一覧の描画部分 */}
        <div className="space-y-4">
          {sortedCards.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              // 1番目のカードだけにツールチップを表示制御を渡す
              showTooltip={index === 0 && showTooltip}
              onCompareClick={dismissTooltip}
            />
          ))}
        </div>

        {sortedCards.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-10">
            該当するカードが見つかりませんでした。
          </p>
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
