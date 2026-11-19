import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import type { CreditCard } from "@/data/cards";
import { getAllArticles } from "@/lib/articles";

type Props = {
  card: CreditCard;
};

type RelatedContentItem = {
  type: "article" | "feature";
  id: string;
  title: string;
};

function getFeatureTitle(id: string) {
  const filePath = path.join(process.cwd(), "src/content/features", `${id}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return typeof data.title === "string" ? data.title : null;
  } catch {
    return null;
  }
}

export function RelatedContents({ card }: Props) {
  const articles = getAllArticles();

  const relatedContents: RelatedContentItem[] =
    card.relatedContents
      ?.map((content) => {
        if (content.type === "article") {
          const article = articles.find((article) => article.id === content.id);

          if (!article) return null;

          return {
            type: "article" as const,
            id: article.id,
            title: article.title,
          };
        }

        if (content.type === "feature") {
          const title = getFeatureTitle(content.id);

          if (!title) return null;

          return {
            type: "feature" as const,
            id: content.id,
            title,
          };
        }

        return null;
      })
      .filter((item): item is RelatedContentItem => item !== null) ?? [];

  // 関連指定がない、または指定された記事が存在しない場合
  // 最新記事5件をフォールバックとして表示
  const items =
    relatedContents.length > 0
      ? relatedContents
      : articles.slice(0, 5).map((article) => ({
          type: "article" as const,
          id: article.id,
          title: article.title,
        }));

  if (items.length === 0) {
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
          このカードに関連する情報をチェック
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const href =
            item.type === "article"
              ? `/articles/${item.id}`
              : `/feature/${item.id}`;

          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={href}
              className="block rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="mb-1 text-[10px] font-semibold text-slate-400">
                {item.type === "article" ? "コラム" : "特集"}
              </div>

              <div className="text-sm font-medium leading-relaxed text-slate-800">
                {item.title}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
