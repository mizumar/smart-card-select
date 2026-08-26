import { render, screen } from "@testing-library/react";
import ArticlePage, { generateMetadata } from "../page";
import { getArticleById } from "@/lib/articles";

// react-markdown のみをモック化（remark-gfm の行は削除）
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="react-markdown">{children}</div>;
  };
});

// モックの設定
jest.mock("@/lib/articles", () => ({
  getArticleById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// モックの設定
jest.mock("@/lib/articles", () => ({
  getArticleById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const mockGetArticleById = getArticleById as jest.MockedFunction<
  typeof getArticleById
>;

describe("ArticleDetailPage (/articles/[id])", () => {
  const mockArticle = {
    id: "test-article",
    title: "テストコラムのタイトル",
    excerpt: "テストコラムの概要文です。",
    date: "2026-08-27",
    content: "これはテスト本文です。",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------
  // 1. generateMetadata (SEO / OGP / Twitter) のテスト
  // -------------------------------------------------------------
  describe("generateMetadata", () => {
    it("記事が存在する場合、適切な OGP や Canonical URL を含む Metadata を返すこと", async () => {
      mockGetArticleById.mockReturnValue(mockArticle as any);

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-article" }),
      });

      expect(metadata.title).toBe(
        "テストコラムのタイトル | スマートクレカ比較",
      );
      expect(metadata.description).toBe("テストコラムの概要文です。");
      expect(metadata.alternates?.canonical).toBe(
        "https://smart-card-select.vercel.app/articles/test-article",
      );

      // OpenGraph
      expect(metadata.openGraph?.title).toBe(
        "テストコラムのタイトル | スマートクレカ比較",
      );

      // openGraph が存在し、かつ publishedTime を持っているか安全に検証
      const og = metadata.openGraph as
        | { publishedTime?: string; type?: string }
        | undefined;
      expect(og?.publishedTime).toBe("2026-08-27");
      expect(og?.type).toBe("article");

      // Twitter Card
      expect((metadata.twitter as any)?.card).toBe("summary_large_image");
    });

    it("記事が存在しない場合、空のオブジェクトを返すこと", async () => {
      mockGetArticleById.mockReturnValue(null);

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "non-existent-id" }),
      });

      expect(metadata).toEqual({});
    });
  });

  // -------------------------------------------------------------
  // 2. Page Component (レンダリング & JSON-LD) のテスト
  // -------------------------------------------------------------
  describe("Page Component", () => {
    it("記事が存在する場合、コンポーネントおよび JSON-LD 構造化データが正しく描画されること", async () => {
      mockGetArticleById.mockReturnValue(mockArticle as any);

      const page = await ArticlePage({
        params: Promise.resolve({ id: "test-article" }),
      });

      const { container } = render(page);

      // 記事タイトルの描画確認
      expect(screen.getByText("テストコラムのタイトル")).toBeInTheDocument();

      // JSON-LD (BlogPosting) スクリプトタグの存在と内容の検証
      const scriptTag = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(scriptTag).not.toBeNull();

      if (scriptTag) {
        const jsonLd = JSON.parse(scriptTag.textContent || "{}");
        expect(jsonLd["@context"]).toBe("https://schema.org");
        expect(jsonLd["@type"]).toBe("BlogPosting");
        expect(jsonLd.headline).toBe("テストコラムのタイトル");
        expect(jsonLd.description).toBe("テストコラムの概要文です。");
        expect(jsonLd.datePublished).toBe("2026-08-27");
        expect(jsonLd.url).toBe(
          "https://smart-card-select.vercel.app/articles/test-article",
        );
      }
    });

    it("記事が存在しない場合、notFound() が呼び出されること", async () => {
      mockGetArticleById.mockReturnValue(null);

      await expect(
        ArticlePage({
          params: Promise.resolve({ id: "non-existent-id" }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");
    });
  });
});
