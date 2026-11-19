import type { Article } from "@/data/articles";
import { getRelatedArticles } from "../related-articles";

function createArticle(id: string, relatedArticles?: string[]): Article {
  return {
    id,
    title: `テスト記事 ${id}`,
    date: "2026-11-20",
    category: "クレジットカード",
    excerpt: "テスト記事です",
    readTime: "5分",
    content: "テスト本文",
    relatedArticles,
  };
}

describe("getRelatedArticles", () => {
  const articles = [
    createArticle("article-1"),
    createArticle("article-2"),
    createArticle("article-3"),
    createArticle("article-4"),
    createArticle("article-5"),
    createArticle("article-6"),
  ];

  test("指定した関連記事を取得できる", () => {
    const currentArticle = createArticle("current", ["article-2", "article-4"]);

    const result = getRelatedArticles(currentArticle, articles);

    expect(result.map((article) => article.id)).toEqual([
      "article-2",
      "article-4",
    ]);
  });

  test("指定した順番で関連記事が返る", () => {
    const currentArticle = createArticle("current", [
      "article-5",
      "article-2",
      "article-3",
    ]);

    const result = getRelatedArticles(currentArticle, articles);

    expect(result.map((article) => article.id)).toEqual([
      "article-5",
      "article-2",
      "article-3",
    ]);
  });

  test("存在しない記事IDは除外される", () => {
    const currentArticle = createArticle("current", [
      "article-2",
      "not-exist",
      "article-4",
    ]);

    const result = getRelatedArticles(currentArticle, articles);

    expect(result.map((article) => article.id)).toEqual([
      "article-2",
      "article-4",
    ]);
  });

  test("関連記事未指定の場合は自分自身を除外して最新記事を返す", () => {
    const currentArticle = createArticle("article-3");

    const result = getRelatedArticles(currentArticle, articles);

    expect(result.map((article) => article.id)).toEqual([
      "article-1",
      "article-2",
      "article-4",
      "article-5",
      "article-6",
    ]);
  });

  test("フォールバックは最大5件", () => {
    const currentArticle = createArticle("current");

    const result = getRelatedArticles(currentArticle, articles);

    expect(result).toHaveLength(5);
  });

  test("指定した関連記事が存在しない場合はフォールバックする", () => {
    const currentArticle = createArticle("current", ["not-exist"]);

    const result = getRelatedArticles(currentArticle, articles);

    expect(result.map((article) => article.id)).toEqual([
      "article-1",
      "article-2",
      "article-3",
      "article-4",
      "article-5",
    ]);
  });
});
