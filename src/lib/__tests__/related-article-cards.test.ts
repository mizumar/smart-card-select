import type { Article } from "@/data/articles";
import type { CreditCard } from "@/data/cards";
import { getRelatedCardsFromArticle } from "../related-cards";

function createArticle(relatedCards?: string[]): Article {
  return {
    id: "article-1",
    title: "テスト記事",
    date: "2026-11-20",
    category: "クレジットカード",
    excerpt: "テスト記事です",
    readTime: "5分",
    content: "テスト本文",
    relatedCards,
  };
}

function createCard(id: string): CreditCard {
  return {
    id,
    name: `テストカード${id}`,
    popularityRank: 1,
    tagIds: [],
    tags: [],
    brandColor: "#000000",
    affiliateUrl: "#",
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1%",
    baseReturnRateValue: 1,
    maxReturnRate: "1%",
    maxReturnRateValue: 1,
    features: [],
    details: {
      insurance: "",
      electronicMoney: [],
      pros: [],
      cons: [],
    },
  } as CreditCard;
}

describe("getRelatedCardsFromArticle", () => {
  const cards = [
    createCard("card-1"),
    createCard("card-2"),
    createCard("card-3"),
  ];

  test("指定したカードを取得できる", () => {
    const article = createArticle(["card-2"]);

    const result = getRelatedCardsFromArticle(article, cards);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("card-2");
  });

  test("指定した順番でカードが返る", () => {
    const article = createArticle(["card-3", "card-1"]);

    const result = getRelatedCardsFromArticle(article, cards);

    expect(result.map((card) => card.id)).toEqual(["card-3", "card-1"]);
  });

  test("存在しないカードIDは除外される", () => {
    const article = createArticle(["card-2", "not-exist", "card-1"]);

    const result = getRelatedCardsFromArticle(article, cards);

    expect(result.map((card) => card.id)).toEqual(["card-2", "card-1"]);
  });

  test("relatedCardsが未指定の場合は空配列を返す", () => {
    const article = createArticle();

    const result = getRelatedCardsFromArticle(article, cards);

    expect(result).toEqual([]);
  });
});
