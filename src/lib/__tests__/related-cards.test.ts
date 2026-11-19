import { getRelatedCards } from "@/lib/related-cards";
import type { CreditCard } from "@/data/cards";

const createCard = (id: string, tagIds: CreditCard["tagIds"]): CreditCard => ({
  id,
  name: `テストカード${id}`,
  popularityRank: 1,
  tagIds,
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
});

describe("getRelatedCards", () => {
  it("現在のカード自身を除外する", () => {
    const currentCard = createCard("current", ["fee-free"]);

    const cards = [
      currentCard,
      createCard("card-a", ["fee-free"]),
      createCard("card-b", ["use-ec"]),
    ];

    const result = getRelatedCards(currentCard, cards);

    expect(result.map((card) => card.id)).not.toContain("current");
  });

  it("共通タグ数が多いカードを優先する", () => {
    const currentCard = createCard("current", [
      "fee-free",
      "use-ec",
      "use-daily",
    ]);

    const cards = [
      createCard("card-a", ["fee-free"]),
      createCard("card-b", ["fee-free", "use-ec"]),
      createCard("card-c", ["fee-free", "use-ec", "use-daily"]),
    ];

    const result = getRelatedCards(currentCard, cards);

    expect(result.map((card) => card.id)).toEqual([
      "card-c",
      "card-b",
      "card-a",
    ]);
  });

  it("共通タグ数が同じ場合は元のカードデータ順を維持する", () => {
    const currentCard = createCard("current", ["fee-free", "use-ec"]);

    const cards = [
      currentCard,
      createCard("card-a", ["fee-free"]),
      createCard("card-b", ["use-ec"]),
      createCard("card-c", ["fee-free", "use-travel"]),
    ];

    const result = getRelatedCards(currentCard, cards);

    expect(result.map((card) => card.id)).toEqual([
      "card-a",
      "card-b",
      "card-c",
    ]);
  });

  it("デフォルトでは最大4件まで返す", () => {
    const currentCard = createCard("current", ["fee-free"]);

    const cards = [
      currentCard,
      createCard("card-a", ["fee-free"]),
      createCard("card-b", ["fee-free"]),
      createCard("card-c", ["fee-free"]),
      createCard("card-d", ["fee-free"]),
      createCard("card-e", ["fee-free"]),
      createCard("card-f", ["fee-free"]),
    ];

    const result = getRelatedCards(currentCard, cards);

    expect(result).toHaveLength(4);
  });

  it("limitを指定した場合は指定件数まで返す", () => {
    const currentCard = createCard("current", ["fee-free"]);

    const cards = [
      currentCard,
      createCard("card-a", ["fee-free"]),
      createCard("card-b", ["fee-free"]),
      createCard("card-c", ["fee-free"]),
      createCard("card-d", ["fee-free"]),
    ];

    const result = getRelatedCards(currentCard, cards, 2);

    expect(result).toHaveLength(2);
    expect(result.map((card) => card.id)).toEqual(["card-a", "card-b"]);
  });

  it("関連するタグがない場合でもカードを返す", () => {
    const currentCard = createCard("current", ["fee-free"]);

    const cards = [
      currentCard,
      createCard("card-a", ["use-ec"]),
      createCard("card-b", ["use-travel"]),
    ];

    const result = getRelatedCards(currentCard, cards);

    expect(result.map((card) => card.id)).toEqual(["card-a", "card-b"]);
  });
});
