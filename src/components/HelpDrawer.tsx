"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Scale,
  Heart,
} from "lucide-react";

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  // 開いているアコーディオンのIDを管理（初期状態で「診断」を開く）
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    "diagnosis",
  );

  if (!isOpen) return null;

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. バックドロップ */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-100"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. ドロワー本体 */}
      <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-15">
        <div className="w-screen max-w-290px sm:max-w-xs bg-slate-50 shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-250 ease-out border-l border-border/40">
          {/* ヘッダーエリア */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-800">
                使い方ガイド
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              aria-label="ヘルプを閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* コンテンツエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* サイト概要バナー */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-3.5 text-white shadow-md">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-300 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>スマートクレカ比較とは？</span>
              </div>
              <p className="text-xs font-bold leading-relaxed text-slate-100">
                条件や診断から、あなたに最適なカードを選べる比較サービスです。
              </p>
            </div>

            {/* アコーディオン機能一覧 */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                主な機能の使い方
              </span>

              {/* 1. 10秒カード診断 */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("diagnosis")}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        10秒カード診断
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        自分に合うカードをすぐ見つけたいとき
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      openAccordion === "diagnosis" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "diagnosis" && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 text-[11px] text-slate-600 space-y-2 animate-in fade-in-0 duration-150">
                    <ol className="list-decimal list-inside space-y-1 text-slate-500 font-medium">
                      <li>トップページの「10秒診断」を選択</li>
                      <li>重視する条件などを答える</li>
                      <li>あなたにマッチしたカードが提案されます</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* 2. お気に入り・2枚比較 & お得額シミュレーター */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("compare")}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        お気に入り・2枚比較・お得額計算
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        カードの保存・2枚比較・還元額シミュレーション
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      openAccordion === "compare" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "compare" && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 text-[11px] text-slate-600 space-y-2.5 animate-in fade-in-0 duration-150">
                    {/* お気に入り機能 */}
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                        お気に入りキープ
                      </p>
                      <p className="text-[11px] text-slate-500 leading-normal pl-3 border-l-2 border-rose-200">
                        カードの「♡お気に入り」を押して、気になるカードを保存できます。
                      </p>
                    </div>

                    {/* 2枚比較機能 */}
                    <div className="space-y-1 pt-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5 text-blue-500" />
                        2枚ダイレクト比較
                      </p>
                      <p className="text-[11px] text-slate-500 leading-normal pl-3 border-l-2 border-blue-200">
                        気になる2枚の「比較」を押すと、スペックや特典を横並びで比べられます。
                      </p>
                    </div>

                    {/* シミュレーション機能（スライダーUI対応） */}
                    <div className="space-y-1 pt-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        年間実質お得額シミュレーター
                      </p>
                      <p className="text-[11px] text-slate-500 leading-normal pl-3 border-l-2 border-amber-200">
                        月間利用額のスライダー（0〜100万円）を動かすだけで、ポイント還元から年会費を引いた「年間のお得額」を自動計算します。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 特集・コラム記事 */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion("articles")}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        特集・コラム記事
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        損しないクレカ知識を学びたいとき
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      openAccordion === "articles" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "articles" && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 text-[11px] text-slate-600 space-y-2 animate-in fade-in-0 duration-150">
                    <p className="text-slate-500 leading-normal">
                      カードの裏技的なお得な使い方や還元率の比較など、役立つコラム記事を随時更新しています。
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 導線ボタン */}
            <div className="pt-1">
              <Link
                href="/articles"
                onClick={onClose}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <span>コラム記事一覧を見る</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* フッターエリア */}
          <div className="p-3 bg-white border-t border-border/40 text-[10px] text-center text-slate-400">
            スマートクレカ比較 ヘルプガイド
          </div>
        </div>
      </div>
    </div>
  );
}
