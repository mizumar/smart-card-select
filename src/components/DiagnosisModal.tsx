"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { Sparkles, X, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";

interface DiagnosisModalProps {
  cards: CreditCard[];
  isOpen: boolean;
  onClose: () => void;
}

// 質問データの定義
const QUESTIONS = [
  {
    id: "useCase",
    title: "1. 主にどこで買い物や利用をしますか？",
    options: [
      { label: "コンビニ・飲食店", tag: "コンビニ高還元" },
      { label: "Amazon・スタバ", tag: "Amazon・スタバ" },
      { label: "PayPay・Yahoo!", tag: "PayPayユーザー" },
      { label: "どこでも（ポイント還元重視）", tag: "ポイント還元" },
    ],
  },
  {
    id: "priority",
    title: "2. クレジットカードに一番求めるものは？",
    options: [
      { label: "年会費がずっと無料", tag: "年会費無料" },
      { label: "初めてでも安心・人気", tag: "初心者" },
      { label: "お店やカラオケでの優待割引", tag: "優待特典" },
      { label: "海外旅行保険の充実", tag: "海外旅行保険" },
    ],
  },
];

export const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  cards,
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  // 選択肢をタップした時の処理
  const handleSelectOption = (tag: string) => {
    const updatedTags = [...selectedTags, tag];
    setSelectedTags(updatedTags);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  // リセット処理
  const handleReset = () => {
    setCurrentStep(0);
    setSelectedTags([]);
    setIsFinished(false);
  };

  // 診断結果の計算（選択されたタグとのマッチ度が高いカードを上位抽出）
  const getRecommendedCards = () => {
    return cards
      .map((card) => {
        const matchCount = card.tags.filter((tag) =>
          selectedTags.includes(tag),
        ).length;
        return { card, matchCount };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 2)
      .map((item) => item.card);
  };

  const recommendedCards = getRecommendedCards();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          /* --- 質問画面 --- */
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4" />
              <span>
                10秒かんたん診断 ({currentStep + 1}/{QUESTIONS.length})
              </span>
            </div>

            <h2 className="text-base font-bold text-gray-800 mb-4">
              {QUESTIONS[currentStep].title}
            </h2>

            <div className="space-y-2.5 mb-4">
              {QUESTIONS[currentStep].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleSelectOption(opt.tag)}
                  className="w-full text-left p-3.5 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 active:scale-[0.98] transition-all flex justify-between items-center text-xs font-semibold text-gray-700"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* --- 結果画面 --- */
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex p-2 bg-emerald-50 rounded-full text-emerald-600 mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                あなたにおすすめのカードはこれ！
              </h2>
              <p className="text-[11px] text-gray-500">
                回答に合わせたベストな選択肢です
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {recommendedCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      イチオシ
                    </span>
                    <h3 className="font-bold text-xs text-gray-800 mt-1">
                      {card.name}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      還元率: {card.maxReturnRate} / {card.annualFee}
                    </p>
                  </div>
                  <a
                    href={card.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white font-bold text-[11px] px-3 py-2 rounded-xl shrink-0 hover:bg-blue-700 transition-colors"
                  >
                    公式へ
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full text-xs text-gray-400 flex items-center justify-center gap-1 py-1 hover:text-gray-600"
            >
              <RotateCcw className="w-3 h-3" />
              <span>もう一度やり直す</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
