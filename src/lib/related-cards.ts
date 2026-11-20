import type { Article } from "@/data/articles";
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
      if (b.commonTagCount !== a.commonTagCount) {
        return b.commonTagCount - a.commonTagCount;
      }

      return a.index - b.index;
    })
    .slice(0, limit)
    .map(({ card }) => card);
}

export function getRelatedCardsFromArticle(
  article: Article,
  cards: CreditCard[],
): CreditCard[] {
  return (
    article.relatedCards
      ?.map((id) => cards.find((card) => card.id === id))
      .filter((card): card is CreditCard => card !== undefined) ?? []
  );
}
