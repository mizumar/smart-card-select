"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { Sparkles, X, RotateCcw, ArrowRight, ArrowUpRight } from "lucide-react";
import questions from "@/data/diagnosisQuestions.json";
import { calculateDiagnosedCards } from "@/utils/diagnosis";
import { useCompareStore } from "@/store/useCompareStore"; // 比較ストアの呼び出し
import { MatchGauge } from "./MatchGauge"; // スピードメーター風UIコンポーネント

interface DiagnosisModalProps {
  cards: CreditCard[];
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  cards,
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultCards, setResultCards] = useState<CreditCard[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // ★ 計算中アニメーション用ステート
  const { setSelectedIds } = useCompareStore();

  if (!isOpen) return null;

  // 現在の質問オブジェクト
  const currentQuestion = questions[currentStep];

  // 選択肢をタップした時の処理
  const handleSelectOption = (questionId: string, optionId: string) => {
    // 回答を保存
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);

    // 次の質問があるかチェック
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // ★ 最終質問まで終わったら診断を実行！
      handleComplete(nextAnswers);
    }
  };

  // 診断完了処理（1秒のサクッとした計算中演出）
  const handleComplete = (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);

    const rankedCards = calculateDiagnosedCards(finalAnswers, cards);
    const top2 = rankedCards.slice(0, 2);

    // 0.5秒の計算演出後に結果表示へ
    setTimeout(() => {
      setResultCards(top2);
      setIsAnalyzing(false);
      setIsCompleted(true);
    }, 500);
  };

  // ★ 「この2枚の年間お得額をシミュレーション」ボタン押下時
  const handleStartCompare = () => {
    if (resultCards && resultCards.length >= 2) {
      // IDを明示的に String 化して渡す
      const top2Ids = resultCards.slice(0, 2).map((card) => String(card.id));

      // Zustand ストアにセット
      setSelectedIds(top2Ids);

      // 診断モーダルを閉じる
      onClose();
    }
  };

  // リセット
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultCards([]);
    setIsCompleted(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- 1. 計算中（ローディング）画面 --- */}
        {isAnalyzing ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-800">
              あなたに最適なカードを計算中...
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              条件からお得額・適合度を算出しています
            </p>
          </div>
        ) : !isCompleted ? (
          /* --- 2. 質問画面 --- */
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>
                10秒かんたん診断 ({currentStep + 1}/{questions.length})
              </span>
            </div>

            <h2 className="text-base font-bold text-gray-800 mb-4">
              {currentQuestion.title}
            </h2>

            <div className="space-y-2.5 mb-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                  className="w-full text-left p-3.5 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 active:scale-[0.98] transition-all flex justify-between items-center text-xs font-semibold text-gray-700"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* --- 3. 結果画面 --- */
          <div>
            {/* バー風UI（MatchGauge） */}
            <div className="text-center mb-3">
              <MatchGauge score={94} />

              <h2 className="text-sm font-bold text-slate-900 mt-1">
                ベストな2枚が見つかりました！
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                選択された条件に最もマッチ
              </p>
            </div>

            {/* 結果カードリスト */}
            <div className="space-y-2 mb-4">
              {resultCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 m-2 min-w-0">
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full font-bold">
                      {idx === 0 ? "第1候補" : "第2候補"}
                    </span>
                    <h3 className="font-bold text-xs text-slate-800 truncate">
                      {card.name}
                    </h3>
                  </div>
                  <a
                    href={card.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 shrink-0"
                  >
                    公式 <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            {/* メインCTA：2枚比較機能へのバトンタッチ */}
            <button
              onClick={handleStartCompare}
              className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mb-2"
            >
              <span>この2枚の年間お得額をシミュレーション</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* やり直しボタン */}
            <button
              onClick={handleReset}
              className="w-full text-[11px] text-slate-400 flex items-center justify-center gap-1 py-1 hover:text-slate-600"
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
