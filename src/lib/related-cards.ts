import type { CreditCard } from "@/data/cards";

export function getRelatedCards(
  currentCard: CreditCard,
  cards: CreditCard[],
  limit = 4,
): CreditCard[] {
  return cards
    .filter((card) => card.id !== currentCard.id)
    .map((card, index) => {
      const commonTagCount = card.tagIds.filter((tagId) =>
        currentCard.tagIds.includes(tagId),
      ).length;

      return {
        card,
        commonTagCount,
        index,
      };
    })
    .sort((a, b) => {
      // 共通タグ数が多い順
      if (b.commonTagCount !== a.commonTagCount) {
        return b.commonTagCount - a.commonTagCount;
      }

      // 同数なら元のカードデータ順
      return a.index - b.index;
    })
    .slice(0, limit)
    .map(({ card }) => card);
}
