import { calculateDiagnosedCards, ScoreBreakdown } from "@/utils/diagnosis";
import { CreditCard } from "@/data/cards";

// モック用のカードデータ
const mockCards: CreditCard[] = [
  {
    id: "card-a",
    name: "カードA",
    popularityRank: 1,
    tagIds: ["type-high-base", "use-daily", "fee-free"], // 条件に多く合致
    tags: [],
    brandColor: "from-blue-500 to-indigo-600",
    affiliateUrl: "https://example.com/card-a",
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "1.0%",
    maxReturnRateValue: 1.0,
    features: [],
    details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
  },
  {
    id: "card-b",
    name: "カードB",
    popularityRank: 2,
    tagIds: ["use-ec"], // 一部のみ合致
    tags: [],
    brandColor: "from-red-500 to-pink-600",
    affiliateUrl: "https://example.com/card-b",
    annualFee: "1,100円",
    annualFeeValue: 1100,
    baseReturnRate: "0.5%",
    baseReturnRateValue: 0.5,
    maxReturnRate: "0.5%",
    maxReturnRateValue: 0.5,
    features: [],
    details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
  },
];

// テスト用ユーザー回答 (priority: base-return, annual-fee: free, scene: daily)
const mockAnswers = {
  priority: "base-return", // targetTags: { "type-high-base": 30, "use-daily": 10 } (計40)
  "annual-fee": "free", // targetTags: { "fee-free": 30 } (計30)
  scene: "daily", // targetTags: { "use-daily": 25 } (計25)
};

describe("calculateDiagnosedCards ロジック検証", () => {
  test("獲得スコアに応じた _matchRate および _totalScore が正しく付与されること", () => {
    const results = calculateDiagnosedCards(mockAnswers, mockCards);
    const topCard = results[0] as any;

    expect(topCard.id).toBe("card-a");
    expect(topCard._totalScore).toBeGreaterThan(0);
    // マッチ度が70〜98%の補正範囲内に収まっていること
    expect(topCard._matchRate).toBeGreaterThanOrEqual(70);
    expect(topCard._matchRate).toBeLessThanOrEqual(98);
  });

  test("加点が発生した項目のみが _breakdowns に収集されること", () => {
    const results = calculateDiagnosedCards(mockAnswers, mockCards);
    const topCard = results[0] as any;
    const breakdowns: ScoreBreakdown[] = topCard._breakdowns;

    expect(breakdowns.length).toBeGreaterThan(0);

    // 加点項目が含まれるか確認
    const hasBaseReturn = breakdowns.some(
      (b) =>
        b.label === "普段の買い物での還元率（どこでもお得）" &&
        b.earnedScore === 40,
    );
    expect(hasBaseReturn).toBe(true);
  });
});
