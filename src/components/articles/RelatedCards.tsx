import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";
import { cards } from "@/data/cards";
import { getRelatedCardsFromArticle } from "@/lib/related-cards";

type Props = {
  article: Article;
};

export function RelatedCards({ article }: Props) {
  const relatedCards = getRelatedCardsFromArticle(article, cards);

  if (relatedCards.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="関連するカード"
      className="space-y-4 border-t border-slate-200 pt-6"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900">関連するカード</h2>
        <p className="mt-1 text-xs text-slate-500">
          この記事で紹介しているカード
        </p>
      </div>

      <div className="space-y-2">
        {relatedCards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">{card.name}</p>

              <p className="mt-1 text-[10px] text-slate-400">
                年会費 {card.annualFee} / 最大還元率 {card.maxReturnRate}
              </p>
            </div>

            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
