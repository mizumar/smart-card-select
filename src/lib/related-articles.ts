import type { Article } from "@/data/articles";

export function getRelatedArticles(
  currentArticle: Article,
  articles: Article[],
  limit = 5,
): Article[] {
  const specifiedArticles =
    currentArticle.relatedArticles
      ?.map((id) => articles.find((article) => article.id === id))
      .filter((article): article is Article => article !== undefined) ?? [];

  if (specifiedArticles.length > 0) {
    return specifiedArticles;
  }

  return articles
    .filter((article) => article.id !== currentArticle.id)
    .slice(0, limit);
}
