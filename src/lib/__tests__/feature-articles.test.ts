import {
  getAllFeatureArticles,
  featureArticlesData,
} from "../feature-articles";

describe("getAllFeatureArticles", () => {
  it("特集記事一覧を正しく取得できること", () => {
    const articles = getAllFeatureArticles();
    expect(articles).toEqual(featureArticlesData);
    expect(articles.length).toBeGreaterThan(0);
  });

  it("すべての記事要素に必須のプロパティ（id, title, description, href）が含まれていること", () => {
    const articles = getAllFeatureArticles();
    articles.forEach((article) => {
      expect(article.id).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.description).toBeTruthy();
      expect(article.href).toBeTruthy();
    });
  });

  it("idに重複が存在しないこと", () => {
    const articles = getAllFeatureArticles();
    const ids = articles.map((article) => article.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
