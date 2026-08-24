import { calculateDiagnosedCards } from "../diagnosis";
import { CreditCard } from "@/data/cards";

// 診断質問データ（diagnosisQuestions.json）のID構造と一致させたモックカード
// mockCards の末尾に as CreditCard[] を追加
const mockCards = [
  {
    id: "card-high-base",
    name: "高還元カード",
    tags: ["高還元"],
    tagIds: ["type-high-base", "fee-free"],
    maxReturnRate: "1.2%",
    annualFee: "無料",
    affiliateUrl: "https://example.com",
  },
  {
    id: "card-special-store",
    name: "特定店特化カード",
    tags: ["特化"],
    tagIds: ["type-special-store", "fee-free"],
    maxReturnRate: "5.0%",
    annualFee: "無料",
    affiliateUrl: "https://example.com",
  },
  {
    id: "card-no-match",
    name: "該当なしカード",
    tags: ["旅行"],
    tagIds: ["use-travel"],
    maxReturnRate: "0.5%",
    annualFee: "10,000円",
    affiliateUrl: "https://example.com",
  },
] as CreditCard[]; // ★ ここでキャスト

describe("calculateDiagnosedCards", () => {
  test("TC-01: 回答に応じて正しくスコアが加算され、最高得点のカードが先頭にソートされること", () => {
    // priority: "base-return" ➔ type-high-base: 30pt, use-daily: 10pt
    // annual-fee: "free"       ➔ fee-free: 30pt
    const answers = {
      priority: "base-return",
      "annual-fee": "free",
    };

    const result = calculateDiagnosedCards(answers, mockCards);

    // card-high-base: type-high-base(30) + fee-free(30) = 60pt (1位)
    // card-special-store: fee-free(30) = 30pt (2位)
    // card-no-match: 0pt (3位)
    expect(result[0].id).toBe("card-high-base");
    expect(result[1].id).toBe("card-special-store");
    expect(result[2].id).toBe("card-no-match");
  });

  test("TC-02: 該当タグを持たないカードもエラーにならず末尾に配置されること", () => {
    const answers = { priority: "special-return" }; // type-special-store に加点
    const result = calculateDiagnosedCards(answers, mockCards);

    expect(result[0].id).toBe("card-special-store");
    expect(result[result.length - 1].id).toBe("card-no-match");
  });

  test("TC-03: 未回答の質問（undefined）が存在しても正常に計算されること", () => {
    const answers = { "annual-fee": "free" }; // 1問のみ回答
    const result = calculateDiagnosedCards(answers, mockCards);

    expect(result).toHaveLength(3);
    // fee-free を持つ上位2枚が先頭側に来る
    const topIds = result.slice(0, 2).map((c) => c.id);
    expect(topIds).toContain("card-high-base");
    expect(topIds).toContain("card-special-store");
  });

  test("TC-04: tagIds が未定義（undefined）のカードが存在してもクラッシュしないこと", () => {
    const cardsWithUndefinedTagIds: CreditCard[] = [
      ...mockCards,
      {
        id: "card-broken",
        name: "タグなしカード",
        tags: [],
        tagIds: undefined as unknown as any,
        maxReturnRate: "0.5%",
        annualFee: "無料",
        affiliateUrl: "https://example.com",
      },
    ] as CreditCard[]; // ★ ここでキャスト

    const answers = { priority: "base-return" };
    const result = calculateDiagnosedCards(answers, cardsWithUndefinedTagIds);

    expect(result).toHaveLength(4);
    expect(result[result.length - 1].id).toBe("card-broken");
  });

  test("TC-05: 空データ（全未回答 / 空カードリスト）時に安全に動作すること", () => {
    // 全未回答 ➔ エラーなく元の件数が返る
    const resultNoAnswers = calculateDiagnosedCards({}, mockCards);
    expect(resultNoAnswers).toHaveLength(3);

    // 空のカード配列 ➔ 空配列が返る
    const resultNoCards = calculateDiagnosedCards(
      { priority: "base-return" },
      [],
    );
    expect(resultNoCards).toEqual([]);
  });
});
