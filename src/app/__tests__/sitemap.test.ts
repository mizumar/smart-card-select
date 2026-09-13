import sitemap from "../sitemap";
import { getAllArticles } from "@/lib/articles";
import { getAllCards } from "@/lib/cards";
import { getAllFeatures } from "@/lib/features";

// 各データ取得関数をモック化
jest.mock("@/lib/articles");
jest.mock("@/lib/cards");
jest.mock("@/lib/features");

describe("sitemap", () => {
  const mockedGetAllArticles = getAllArticles as jest.Mock;
  const mockedGetAllCards = getAllCards as jest.Mock;
  const mockedGetAllFeatures = getAllFeatures as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("正常系テスト（合格ケース）", () => {
    test("全ルート（固定・記事・カード・特集）が正しく統合されて返却されること", async () => {
      // モックデータの定義
      mockedGetAllArticles.mockReturnValue([
        { id: "article-1", date: "2026.03.01" },
      ]);
      mockedGetAllCards.mockReturnValue([{ id: "smbc-nl" }]);
      mockedGetAllFeatures.mockReturnValue([
        { id: "fee-free", date: "2026/02/15" },
      ]);

      const result = await sitemap();

      // 全体件数の検証 (固定3件 + 記事1件 + カード1件 + 特集1件 = 全6件)
      expect(result).toHaveLength(6);
    });

    test("固定ルート（トップ・記事一覧・カード一覧）が正しいパラメータで含まれていること", async () => {
      mockedGetAllArticles.mockReturnValue([]);
      mockedGetAllCards.mockReturnValue([]);
      mockedGetAllFeatures.mockReturnValue([]);

      const result = await sitemap();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: "https://smart-card-select.vercel.app",
            changeFrequency: "weekly",
            priority: 1.0,
          }),
          expect.objectContaining({
            url: "https://smart-card-select.vercel.app/articles",
            changeFrequency: "weekly",
            priority: 0.8,
          }),
          expect.objectContaining({
            url: "https://smart-card-select.vercel.app/cards",
            changeFrequency: "weekly",
            priority: 0.8,
          }),
        ]),
      );
    });

    test("動的ルート（記事・カード・特集）の URL とメタデータが正しく生成されること", async () => {
      mockedGetAllArticles.mockReturnValue([
        { id: "test-article", date: "2026.01.10" },
      ]);
      mockedGetAllCards.mockReturnValue([{ id: "test-card" }]);
      mockedGetAllFeatures.mockReturnValue([
        { id: "test-feature", date: "2026-01-20" },
      ]);

      const result = await sitemap();

      // 記事詳細 URL の確認
      expect(result).toContainEqual(
        expect.objectContaining({
          url: "https://smart-card-select.vercel.app/articles/test-article",
          changeFrequency: "monthly",
          priority: 0.7,
        }),
      );

      // カード詳細 URL の確認
      expect(result).toContainEqual(
        expect.objectContaining({
          url: "https://smart-card-select.vercel.app/cards/test-card",
          changeFrequency: "monthly",
          priority: 0.8,
        }),
      );

      // 特集詳細 URL の確認
      expect(result).toContainEqual(
        expect.objectContaining({
          url: "https://smart-card-select.vercel.app/features/test-feature",
          changeFrequency: "monthly",
          priority: 0.8,
        }),
      );
    });
  });

  describe("境界値・フォーマット変換テスト", () => {
    test("日付の区切り文字（ドットやスラッシュ）が正しく Date オブジェクトに変換されること", async () => {
      mockedGetAllArticles.mockReturnValue([
        { id: "dot-date", date: "2026.03.01" },
      ]);
      mockedGetAllFeatures.mockReturnValue([
        { id: "slash-date", date: "2026/02/15" },
      ]);
      mockedGetAllCards.mockReturnValue([]);

      const result = await sitemap();

      const articleItem = result.find(
        (item) =>
          item.url === "https://smart-card-select.vercel.app/articles/dot-date",
      );
      const featureItem = result.find(
        (item) =>
          item.url ===
          "https://smart-card-select.vercel.app/features/slash-date",
      );

      expect(articleItem?.lastModified).toEqual(new Date("2026-03-01"));
      expect(featureItem?.lastModified).toEqual(new Date("2026-02-15"));
    });

    test("日付が存在しない、または不正な形式の場合はデフォルトで現在の Date オブジェクトが設定されること", async () => {
      mockedGetAllArticles.mockReturnValue([]);
      mockedGetAllCards.mockReturnValue([]);
      mockedGetAllFeatures.mockReturnValue([
        { id: "no-date-feature", date: null },
      ]);

      const result = await sitemap();
      const featureUrl = result.find(
        (item) =>
          item.url ===
          "https://smart-card-select.vercel.app/features/no-date-feature",
      );

      expect(featureUrl).toBeDefined();
      expect(featureUrl?.lastModified).toBeInstanceOf(Date);
      expect(isNaN((featureUrl?.lastModified as Date).getTime())).toBe(false);
    });
  });
});
