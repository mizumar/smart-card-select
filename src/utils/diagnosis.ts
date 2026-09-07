import questionsData from "@/data/diagnosisQuestions.json";
import { CreditCard, CardTagId } from "@/data/cards";

// ----------------------------------------------------
// 1. 型定義
// ----------------------------------------------------
interface Option {
  id: string;
  label: string;
  targetTags?: Partial<Record<CardTagId, number>>;
}

interface Question {
  id: string;
  title: string;
  options: Option[];
}

const questions = questionsData as Question[];

// 内訳（1つの回答条件で獲得できた配点情報）
export interface ScoreBreakdown {
  questionTitle: string; // 質問タイトル
  label: string; // 選んだ選択肢のラベル
  earnedScore: number; // 実際に獲得した点数
}
// ----------------------------------------------------
// 2. メイン関数：全カードのスコアを計算してソートする
// ----------------------------------------------------
export function calculateDiagnosedCards(
  answers: Record<string, string>,
  allCards: CreditCard[],
): CreditCard[] {
  // ユーザーの回答選択肢から「今回の回答で獲得可能な合計最大スコア」を計算
  let maxPossibleScore = 0;
  for (const question of questions) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) continue;

    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId,
    );
    if (selectedOption?.targetTags) {
      // 選択肢内に設定された配点の和を加算
      const optionMax = Object.values(selectedOption.targetTags).reduce(
        (sum, val) => sum + (val || 0),
        0,
      );
      maxPossibleScore += optionMax;
    }
  }

  // 全カードのスコアと内訳を算出
  const scoredCards = allCards.map((card) => {
    const cardTagSet = new Set(card.tagIds || []);
    const breakdowns: ScoreBreakdown[] = [];
    let totalScore = 0;

    for (const question of questions) {
      const selectedOptionId = answers[question.id];
      if (!selectedOptionId) continue;

      const selectedOption = question.options.find(
        (opt) => opt.id === selectedOptionId,
      );
      if (!selectedOption?.targetTags) continue;

      // 該当する質問・選択肢での獲得点数を計算
      let qScore = 0;
      for (const [tagId, scoreForTag] of Object.entries(
        selectedOption.targetTags,
      )) {
        if (scoreForTag && cardTagSet.has(tagId as CardTagId)) {
          qScore += scoreForTag;
        }
      }

      // 点数が1点以上入った場合、内訳として記録
      if (qScore > 0) {
        totalScore += qScore;
        breakdowns.push({
          questionTitle: question.title,
          label: selectedOption.label,
          earnedScore: qScore,
        });
      }
    }

    // マッチ度（%）を算出（最大点に対する割合。下限70%〜上限98%で調整）
    const matchRate =
      maxPossibleScore > 0
        ? Math.min(
            Math.max(Math.round((totalScore / maxPossibleScore) * 100), 70),
            98,
          )
        : 80;

    return {
      ...card,
      _totalScore: totalScore,
      _matchRate: matchRate,
      _breakdowns: breakdowns,
    };
  });

  return scoredCards.sort(
    (a, b) => (b as any)._totalScore - (a as any)._totalScore,
  );
}
