import sitemap from "@/app/sitemap";

// 依存ライブラリのモック化
jest.mock("@/lib/articles", () => ({
  getAllArticles: jest.fn(() => [
    { id: "test-article-1", date: "2026.01.01" },
    { id: "test-article-2", date: "2026/05/10" }, // スラッシュ区切り
    { id: "test-article-invalid", date: "invalid-date" }, // 不正な日付
  ]),
}));

jest.mock("@/lib/cards", () => ({
  getAllCards: jest.fn(() => [{ id: "test-card-1" }]),
}));

describe("sitemap test", () => {
  it("固定ページ、記事ページ、カードページのURLが正しく出力に含まれていること", async () => {
    const result = await sitemap();
    const urls = result.map((item) => item.url);

    // 固定ページ
    expect(urls).toContain("https://smart-card-select.vercel.app");
    expect(urls).toContain("https://smart-card-select.vercel.app/articles");

    // 動的ページ
    expect(urls).toContain(
      "https://smart-card-select.vercel.app/articles/test-article-1",
    );
    expect(urls).toContain(
      "https://smart-card-select.vercel.app/cards/test-card-1",
    );
  });

  it("日付フォーマットが不正・揺れている場合でも Date が Invalid にならず生成されること", async () => {
    const result = await sitemap();
    const invalidDateArticle = result.find(
      (item) =>
        item.url ===
        "https://smart-card-select.vercel.app/articles/test-article-invalid",
    );

    expect(invalidDateArticle).toBeDefined();

    const lastModified = invalidDateArticle?.lastModified;

    // lastModified が Date の場合と string の場合の両方に対応
    const dateObj =
      lastModified instanceof Date
        ? lastModified
        : new Date(lastModified ?? "");

    // 有効な日付であることを検証（Invalid Date でないこと）
    expect(isNaN(dateObj.getTime())).toBe(false);
  });
});
