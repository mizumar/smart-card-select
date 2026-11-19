import type { Article } from "@/data/articles";
import type { CreditCard } from "@/data/cards";

export function getRelatedCards(
  article: Article,
  cards: CreditCard[],
): CreditCard[] {
  return (
    article.relatedCards
      ?.map((id) => cards.find((card) => card.id === id))
      .filter((card): card is CreditCard => card !== undefined) ?? []
  );
}
