import Link from "next/link";
import type { Article } from "@/data/articles";
import { getAllArticles } from "@/lib/articles";
import { getRelatedArticles } from "@/lib/related-articles";

type Props = {
  article: Article;
};

export function RelatedArticles({ article }: Props) {
  const articles = getAllArticles();
  const relatedArticles = getRelatedArticles(article, articles);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="あわせて読みたいコラム"
      className="space-y-4 border-t border-slate-200 pt-6"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900">
          あわせて読みたいコラム
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          この記事に関連する情報をチェック
        </p>
      </div>

      <div className="space-y-2">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="text-sm font-medium leading-relaxed text-slate-800">
              {article.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
