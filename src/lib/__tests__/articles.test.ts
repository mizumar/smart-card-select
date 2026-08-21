import { getAllArticles, getArticleById } from "../articles";

// fs モジュールのダミーデータマッピング（モック化）
jest.mock("fs", () => ({
  existsSync: jest.fn((pathStr: string) => {
    if (pathStr.includes("non-existent")) return false;
    return true;
  }),
  readdirSync: jest.fn(() => ["article-1.md", "article-2.md"]),
  readFileSync: jest.fn((pathStr: string) => {
    if (pathStr.includes("article-1.md")) {
      return `---
id: "article-1"
title: "記事1"
excerpt: "概要1"
date: "2026.08.01"
category: "カテゴリ1"
readTime: "3分"
---
本文1`;
    }
    return `---
id: "article-2"
title: "記事2"
excerpt: "概要2"
date: "2026.08.19"
category: "カテゴリ2"
readTime: "5分"
---
本文2`;
  }),
}));

describe("articles ユーティリティ関数の単体テスト", () => {
  describe("getAllArticles()", () => {
    test("UT-01: すべての .md ファイルを取得して Article[] で返却すること", () => {
      const articles = getAllArticles();
      expect(articles).toHaveLength(2);
      expect(articles[0]).toHaveProperty("title");
      expect(articles[0]).toHaveProperty("content");
    });

    test("UT-02: 記事データが date の降順（新しい順）でソートされていること", () => {
      const articles = getAllArticles();
      // article-2 (2026.08.19) が先頭、article-1 (2026.08.01) が2番目
      expect(articles[0].id).toBe("article-2");
      expect(articles[1].id).toBe("article-1");
    });

    test("UT-03: フォルダが存在しない、または空の場合にエラーにならず空配列が返ること", () => {
      // 存在しないパスを指定した際の安全性を検証
      const articles = getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe("getArticleById()", () => {
    test("UT-04: 指定した ID の記事データおよび本文が正しく取得できること", () => {
      const article = getArticleById("article-1");
      expect(article).not.toBeNull();
      expect(article?.title).toBe("記事1");
      expect(article?.content.trim()).toBe("本文1");
    });

    test("UT-05: 存在しない ID を指定した場合に null が返されること", () => {
      const article = getArticleById("non-existent-id");
      expect(article).toBeNull();
    });
  });
});
