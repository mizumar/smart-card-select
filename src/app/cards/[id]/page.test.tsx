import { render, screen } from "@testing-library/react";
import CardDetailPage, { generateMetadata } from "./page";
import { cards as cardsData } from "@/data/cards";
import fs from "fs";
import path from "path";

// -------------------------------------------------------------
// モック設定
// -------------------------------------------------------------
// react-markdown のモック化（Markdown をそのまま div で囲んで出力）
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="react-markdown">{children}</div>;
  };
});

// lucide-react アイコンのモック化
jest.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
  ExternalLink: () => <svg data-testid="external-link-icon" />,
  Check: () => <svg data-testid="check-icon" />,
  Minus: () => <svg data-testid="minus-icon" />,
}));

// Next.js の navigation (notFound) モック
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// fs (ファイルシステム) モック
jest.mock("fs");
const mockFs = fs as jest.Mocked<typeof fs>;

// カードデータのモック
const mockCard = {
  id: "test-card",
  name: "テストクレジットカード",
  brandColor: "from-blue-500 to-indigo-500",
  annualFee: "永年無料",
  baseReturnRate: "0.5%",
  maxReturnRate: "7.0%",
  pointName: "テストポイント",
  imageUrl: "[https://example.com/card.png](https://example.com/card.png)",
  trackingImageUrl:
    "[https://example.com/imp.gif](https://example.com/imp.gif)",
  affiliateUrl:
    "[https://example.com/affiliate](https://example.com/affiliate)",
  badge: "人気No.1",
  features: ["特徴1：ポイント7倍", "特徴2：年会費無料"],
  details: {
    insurance: "最高2,000万円",
    electronicMoney: ["Visaのタッチ決済", "iD"],
    pros: ["メリット1：高還元率", "メリット2：安全"],
    cons: ["注意点1：事前エントリーが必要"],
  },
};

// cardsData のモック差し替え
jest.mock("@/data/cards", () => ({
  cards: [
    {
      id: "test-card",
      name: "テストクレジットカード",
      annualFee: "永年無料",
      maxReturnRate: "7.0%",
      imageUrl: "[https://example.com/card.png](https://example.com/card.png)",
      trackingImageUrl:
        "[https://example.com/imp.gif](https://example.com/imp.gif)",
      affiliateUrl:
        "[https://example.com/affiliate](https://example.com/affiliate)",
      badge: "人気No.1",
      features: ["特徴1：ポイント7倍", "特徴2：年会費無料"],
      details: {
        pros: ["メリット1：高還元率"],
        cons: ["注意点1：事前エントリーが必要"],
      },
    },
    {
      id: "no-image-card",
      name: "画像なしカード",
      annualFee: "1,100円",
      maxReturnRate: "1.0%",
      brandColor: "from-red-500 to-pink-500",
      affiliateUrl:
        "[https://example.com/affiliate-no-img](https://example.com/affiliate-no-img)",
    },
  ],
}));

describe("CardDetailPage (/cards/[id])", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------
  // T-01: ファーストビュー & トラッキングピクセル
  // -------------------------------------------------------------
  describe("T-01: ファーストビュー & トラッキングピクセル", () => {
    it("1-1: 券面画像が設定されている場合、画像が表示されること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      const img = screen.getByAltText("テストクレジットカード");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        "[https://example.com/card.png](https://example.com/card.png)",
      );
    });

    it("1-2: 券面画像がない場合、指定のグラデーション背景とカード名が表示されること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "no-image-card" }),
      });
      render(page);

      expect(screen.queryByAltText("画像なしカード")).not.toBeInTheDocument();

      // h1とフォールバックの2つが存在するので getAllByText に変更
      const cardNameElements = screen.getAllByText("画像なしカード");
      expect(cardNameElements.length).toBeGreaterThanOrEqual(2);
    });

    it("1-3: trackingImageUrl がある場合、1x1ピクセル画像がDOMに含まれること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      const { container } = render(page);

      const trackingImg = container.querySelector(
        'img[src="[https://example.com/imp.gif](https://example.com/imp.gif)"]',
      );
      expect(trackingImg).toBeInTheDocument();
      expect(trackingImg).toHaveClass(
        "w-px h-px opacity-0 pointer-events-none",
      );
    });

    it("1-4: trackingImageUrl がない場合、ピクセルタグが描画されないこと", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "no-image-card" }),
      });
      const { container } = render(page);

      const trackingImg = container.querySelector('img[width="1"]');
      expect(trackingImg).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // T-02: 主な特徴（features）コンポーネント
  // -------------------------------------------------------------
  describe("T-02: 主な特徴（features）", () => {
    it("2-1: features 配列が存在する場合、エリアとリストが表示されること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      expect(screen.getByText("主な特徴・注目メリット")).toBeInTheDocument();
      expect(screen.getByText("特徴1：ポイント7倍")).toBeInTheDocument();
      expect(screen.getByText("特徴2：年会費無料")).toBeInTheDocument();
    });

    it("2-2: features が存在しない場合、エリア自体が非表示になること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "no-image-card" }),
      });
      render(page);

      expect(
        screen.queryByText("主な特徴・注目メリット"),
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // T-03: プロ・コン（メリット・デメリット）
  // -------------------------------------------------------------
  describe("T-03: プロ・コン", () => {
    it("3-1 & 3-2: pros と cons が正しく描画されること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      expect(screen.getByText("MERIT")).toBeInTheDocument();
      expect(screen.getByText("メリット1：高還元率")).toBeInTheDocument();

      expect(screen.getByText("CHECK")).toBeInTheDocument();
      expect(
        screen.getByText("注意点1：事前エントリーが必要"),
      ).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // T-04: Markdown 記事 & Frontmatter (gray-matter)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // T-04: Markdown 記事 & Frontmatter (gray-matter)
  // -------------------------------------------------------------
  describe("T-04: Markdown 記事 (gray-matter)", () => {
    it("4-1 & 4-2: .md ファイルが存在する場合、本文と最終更新日が表示されること", async () => {
      const mockMarkdown = `---
title: "カスタムSEOタイトル"
updatedAt: "2026-03-01"
---

## 専門レビューの本文です
これはMarkdownのコンテンツです。
`;

      // fs の挙動を確実にモック化
      mockFs.existsSync.mockImplementation((filePath) => {
        if (typeof filePath === "string" && filePath.endsWith("test-card.md")) {
          return true;
        }
        return false;
      });

      mockFs.readFileSync.mockImplementation((filePath) => {
        if (typeof filePath === "string" && filePath.endsWith("test-card.md")) {
          return mockMarkdown;
        }
        return "";
      });

      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      expect(screen.getByText("最終更新日: 2026-03-01")).toBeInTheDocument();
      expect(screen.getByText("徹底レビュー")).toBeInTheDocument();
      expect(
        screen.getByText(/これはMarkdownのコンテンツです/),
      ).toBeInTheDocument();
    });

    it("4-3: .md ファイルが存在しない場合でもエラーにならず描画されること", async () => {
      mockFs.existsSync.mockReturnValue(false);

      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      expect(
        screen.queryByText("専門解説・徹底レビュー"),
      ).not.toBeInTheDocument();
    });
  });
  // -------------------------------------------------------------
  // T-05: SEO メタデータ & 構造化データ (generateMetadata & JSON-LD)
  // -------------------------------------------------------------
  describe("T-05: SEO メタデータ生成", () => {
    it("5-1: Frontmatter の title が generateMetadata に反映されること", async () => {
      const mockMarkdown = `---
title: "Frontmatterで指定したタイトル"
description: "Frontmatterで指定した説明文"
---
`;
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(mockMarkdown);

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-card" }),
      });

      expect(metadata.title).toBe("Frontmatterで指定したタイトル");
      expect(metadata.description).toBe("Frontmatterで指定した説明文");
    });

    it("5-2: Frontmatter がない場合、フォールバックタイトルが適用されること", async () => {
      mockFs.existsSync.mockReturnValue(false);

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-card" }),
      });

      expect(metadata.title).toBe(
        "テストクレジットカードの評判・メリットは？還元率や特徴を徹底解説",
      );
    });

    it("5-5: JSON-LD (Product スキーマ) が正しく出力されること", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      const { container } = render(page);

      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(jsonLdScript).toBeInTheDocument();

      const jsonContent = JSON.parse(jsonLdScript?.textContent || "{}");
      expect(jsonContent["@type"]).toBe("Product");
      expect(jsonContent.name).toBe("テストクレジットカード");
      expect(jsonContent.image).toBe(
        "[https://example.com/card.png](https://example.com/card.png)",
      );
    });
  });

  // -------------------------------------------------------------
  // T-06: アフィリエイトリンク・ボタン動作
  // -------------------------------------------------------------
  describe("T-06: アフィリエイトリンク", () => {
    it("6-1 & 6-3: メインボタンおよび追従バーのリンク属性が正しいこと", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const page = await CardDetailPage({
        params: Promise.resolve({ id: "test-card" }),
      });
      render(page);

      const links = screen.getAllByRole("link", { name: /公式サイト/i });
      expect(links.length).toBeGreaterThanOrEqual(2); // メインボタン + 追従バー

      links.forEach((link) => {
        expect(link).toHaveAttribute(
          "href",
          "[https://example.com/affiliate](https://example.com/affiliate)",
        );
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });
});
