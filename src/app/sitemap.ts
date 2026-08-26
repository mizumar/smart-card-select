import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCards } from "@/lib/cards"; // ※カード一覧取得関数がある場合

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://smart-card-select.vercel.app";

  // 1. 固定ページ
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/articles",
    "/cards", // ※カード一覧ページ等があれば追加
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. 記事詳細ページ (/articles/[id])
  const articles = getAllArticles();
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => {
    // 日付フォーマットの揺れ（YYYY.MM.DD や YYYY/MM/DD）に対応
    const formattedDate = article.date
      ? article.date.replace(/[\./]/g, "-")
      : null;
    const dateObj = formattedDate ? new Date(formattedDate) : new Date();

    return {
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: isNaN(dateObj.getTime()) ? new Date() : dateObj,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // 3. カード詳細ページ (/cards/[id]) ※必要に応じて有効化
  const cards = getAllCards ? getAllCards() : [];
  const cardUrls: MetadataRoute.Sitemap = cards.map((card) => ({
    url: `${baseUrl}/cards/${card.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleUrls, ...cardUrls];
}
