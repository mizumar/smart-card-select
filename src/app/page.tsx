"use client";

import Link from "next/link";
import { useState } from "react";
import { cards } from "@/data/cards";
import { CardItem } from "@/components/CardItem";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { DiagnosisModal } from "@/components/DiagnosisModal";
import { Sparkles, ArrowUpDown } from "lucide-react";

const FILTER_TAGS = [
  "すべて",
  "年会費無料",
  "コンビニ高還元",
  "初心者",
  "Amazon・スタバ",
  "PayPayユーザー",
];

type SortOption = "popular" | "rate" | "fee";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("すべて");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);

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
    // 人気順 (昇順: a - b ※ 1位, 2位, 3位の順)
    return (a.popularityRank || 99) - (b.popularityRank || 99);
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      {/* 改善版ヘッダー（アイコン画像化） */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-slate-100/80 px-4 py-2.5 transition-all">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* ロゴ・アプリ名 */}
          <div className="flex items-center gap-2.5">
            {/* ★ 絵文字から独自のPNG画像に差し替え */}
            <img
              src="/app-logo.png" // public/app-logo.png を参照
              alt="スマートクレカ比較 ロゴ"
              className="w-7 h-7 rounded-lg object-contain shrink-0 shadow-sm shadow-blue-500/10"
            />
            <div className="text-left">
              <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
                スマートクレカ比較
              </h1>
              <p className="text-[9px] font-semibold text-slate-400 mt-0.5 leading-none">
                10秒で自分に最適な1枚が見つかる
              </p>
            </div>
          </div>

          {/* 右側のワンポイント */}
          <div className="bg-slate-100/80 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200/50">
            2026年最新
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* 10秒診断バナーボタン */}
        <div className="mb-4">
          <button
            onClick={() => setIsDiagnosisOpen(true)}
            className="w-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white font-bold p-3.5 rounded-2xl shadow-md flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-xl">
                <Sparkles className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-amber-100">
                  どれを選ぶか迷ったら
                </p>
                <p className="text-sm font-extrabold leading-tight">
                  10秒でぴったりカードを診断！
                </p>
              </div>
            </div>
            <span className="text-xs bg-white text-orange-600 px-3 py-1.5 rounded-xl font-bold shadow-sm">
              試す
            </span>
          </button>
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
              <option value="fee">年会費が安い順</option>
            </select>
          </div>
        </div>

        {/* カード一覧 */}
        {sortedCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}

        {sortedCards.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-10">
            該当するカードが見つかりませんでした。
          </p>
        )}
      </div>

      {/* フッター（PR表記・免責事項） */}
      <footer className="mt-12 pb-12 px-4 text-center text-slate-400 text-[10px] leading-relaxed max-w-md mx-auto border-t border-slate-200/60 pt-6">
        {/* ★ 審査用コラムへの導線 */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span>📖 クレカ知識・お役立ちコラム（全5記事）</span>
          </Link>
        </div>
        <p className="font-bold text-slate-500 mb-2">【PR/広告開示】</p>
        <p className="mb-3">
          本サイトはアフィリエイトプログラムによる収益を得ています。掲載されている提携先のオファーによる報酬を受ける場合がありますが、比較・診断結果に影響を与えることはありません。
        </p>
        <p className="text-slate-400">
          ※掲載情報の正確性には万全を期しておりますが、キャンペーン内容や還元率等は時期により変動します。最新の正確な情報は各クレジットカード公式サイトにてご確認ください。
        </p>
        <p className="mt-4 text-[9px] text-slate-300">
          &copy; 2026 スマートクレカ比較 All Rights Reserved.
        </p>
      </footer>

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
