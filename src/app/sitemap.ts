import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 本番環境のドメインURLに書き換えてください
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://smart-card-select.vercel.app";

  // 記事一覧を取得
  const articles = getAllArticles();

  // 動的な記事ページのURLリストを作成
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: new Date(article.date.replace(/\./g, "-")),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 固定ページのURLリスト
  const routes = ["", "/articles"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  return [...routes, ...articleUrls];
}
