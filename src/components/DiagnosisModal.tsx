"use client";

import React, { useState } from "react";
import { CreditCard } from "@/data/cards";
import { Sparkles, X, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import questions from "@/data/diagnosisQuestions.json";
import { calculateDiagnosedCards } from "@/utils/diagnosis";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultCards, setResultCards] = useState<CreditCard[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

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

  // 3. 診断計算の実行と画面切替
  const handleComplete = (finalAnswers: Record<string, string>) => {
    // スコアリング計算を実行
    const rankedCards = calculateDiagnosedCards(finalAnswers, cards);

    // 上位2枚を結果として保持
    setResultCards(rankedCards.slice(0, 2));

    // 結果表示モードへ切り替え
    setIsCompleted(true);
  };

  // リセット処理（モーダルをリセット）
  const handleResetAndClose = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultCards([]);
    setIsCompleted(false);
  };

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

        {!isCompleted ? (
          /* --- 質問画面 --- */
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4" />
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
              {resultCards.map((card) => (
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
                      最大還元率: {card.maxReturnRate} / 年会費:
                      {card.annualFee}
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
              onClick={handleResetAndClose}
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
