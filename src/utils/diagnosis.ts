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

// ----------------------------------------------------
// 2. 補助関数：1つの質問に対して、カードが獲得できる点数を計算する
// ----------------------------------------------------
function calculateQuestionScore(
  question: Question,
  selectedOptionId: string | undefined,
  cardTagSet: Set<CardTagId>,
): number {
  // ① 回答がない、または該当する選択肢がなければ 0 点
  if (!selectedOptionId) return 0;

  const selectedOption = question.options.find(
    (opt) => opt.id === selectedOptionId,
  );
  if (!selectedOption?.targetTags) return 0;

  // ② 配点データ（targetTags）をループし、カードがそのタグを持っていれば点数を足す
  let score = 0;
  const targetTags = selectedOption.targetTags;

  for (const [tagId, scoreForTag] of Object.entries(targetTags)) {
    if (scoreForTag && cardTagSet.has(tagId as CardTagId)) {
      score += scoreForTag;
    }
  }

  return score;
}

// ----------------------------------------------------
// 3. メイン関数：全カードのスコアを計算してソートする
// ----------------------------------------------------
export function calculateDiagnosedCards(
  answers: Record<string, string>,
  allCards: CreditCard[],
): CreditCard[] {
  // 各カードの合計スコアを計算する
  const scoredCards = allCards.map((card) => {
    // タグ検索を高速・シンプルにするために Set 化しておく
    const cardTagSet = new Set(card.tagIds || []);

    // 質問ごとの点数を reduce で合計する
    const totalScore = questions.reduce((sum, question) => {
      const qScore = calculateQuestionScore(
        question,
        answers[question.id],
        cardTagSet,
      );
      return sum + qScore;
    }, 0);

    return { card, score: totalScore };
  });

  // スコアが高い順に並び替えてカードだけを返す
  return scoredCards.sort((a, b) => b.score - a.score).map((item) => item.card);
}
