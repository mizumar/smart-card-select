import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCards } from "@/lib/cards"; // ※カード一覧取得関数がある場合
import { getAllFeatures } from "@/lib/features"; // ※カード一覧取得関数がある場合

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

  // 3. 特集詳細ページ (/features/[id])
  const features = getAllFeatures(); // ※ご利用の特集データ取得関数に合わせて変更してください
  const featureUrls: MetadataRoute.Sitemap = features.map((feature) => {
    // 日付フォーマットの揺れ（YYYY.MM.DD や YYYY/MM/DD）に対応
    const formattedDate = feature.date
      ? feature.date.replace(/[\./]/g, "-")
      : null;
    const dateObj = formattedDate ? new Date(formattedDate) : new Date();

    return {
      url: `${baseUrl}/features/${feature.id}`,
      lastModified: isNaN(dateObj.getTime()) ? new Date() : dateObj,
      changeFrequency: "monthly",
      priority: 0.8, // 特集ページのため優先度を記事(0.7)より少し高めに設定（調整可）
    };
  });

  return [...staticRoutes, ...articleUrls, ...cardUrls, ...featureUrls];
}
