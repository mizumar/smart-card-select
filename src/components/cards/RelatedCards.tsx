import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CreditCard } from "@/data/cards";
import { cards } from "@/data/cards";
import { getRelatedCards } from "@/lib/related-cards";

interface Props {
  currentCard: CreditCard;
}

export function RelatedCards({ currentCard }: Props) {
  const relatedCards = getRelatedCards(currentCard, cards);

  return (
    <section
      aria-label="関連するカード"
      className="space-y-4 pt-4 border-t border-slate-100"
    >
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-wide">
          関連するカード
        </h2>
        <p className="mt-1 text-[10px] text-slate-400">
          このカードと特徴が近いカード
        </p>
      </div>

      <div className="space-y-2">
        {relatedCards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">{card.name}</p>

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
