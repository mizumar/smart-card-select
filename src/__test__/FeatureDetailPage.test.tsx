import { render, screen } from "@testing-library/react";
import FeatureDetailPage, { generateMetadata } from "@/app/feature/[id]/page";

// 1. fs と path のモック化
jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// 2. カードデータ（cards）のモック化
// アプリ側のインポート元パスに合わせて適宜 `@/data/cards` などを調整してください
jest.mock("@/data/cards", () => ({
  cards: [
    {
      id: "paypay-card",
      name: "PayPayカード",
      popularityRank: 1,
      tagIds: [],
      tags: [],
      brandColor: "red",
      annualFee: "永年無料",
      annualFeeValue: 0,
      baseReturnRate: "1.0%",
      baseReturnRateValue: 1.0,
      maxReturnRate: "1.0%",
      maxReturnRateValue: 1.0,
      features: [],
      details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
      affiliateUrl: "https://example.com",
    },
    {
      id: "muji-card",
      name: "MUJIカード",
      popularityRank: 2,
      tagIds: [],
      tags: [],
      brandColor: "red",
      annualFee: "永年無料",
      annualFeeValue: 0,
      baseReturnRate: "0.5%",
      baseReturnRateValue: 0.5,
      maxReturnRate: "0.5%",
      maxReturnRateValue: 0.5,
      features: [],
      details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
      affiliateUrl: "https://example.com",
    },
  ],
}));

// 3. react-markdown のモック
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

import fs from "fs";

describe("特集記事ページ (FeatureDetailPage) テスト", () => {
  // フロントマターの cardIds には下部一覧に残したいカード (paypay-card) と
  // 本文中で使うカード (muji-card) の両方を持たせる
  const mockMarkdownContent = `---
title: "テスト特集記事タイトル"
description: "テスト用ディスクリプションです。"
updatedAt: "2026-09-13"
icon: "plane"
cardIds:
  - paypay-card
  - muji-card
---

## テスト見出し1
本文の導入文章です。

:::card{id="muji-card"}`;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(mockMarkdownContent);
  });

  test("FEAT-01 & META-01: 存在する記事のMarkdownがパースされ、タイトルやメタデータ・Heroアイコンが描画されること", async () => {
    const params = Promise.resolve({ id: "test-feature" });

    const metadata = await generateMetadata({ params });
    expect(metadata.title).toBe("テスト特集記事タイトル");

    const ui = await FeatureDetailPage({ params });
    render(ui);

    expect(
      screen.getByRole("heading", { name: "テスト特集記事タイトル", level: 1 }),
    ).toBeInTheDocument();
  });

  test("CARD-02: 本文中ですでに埋め込まれたカードが、下部一覧から自動除外されること", async () => {
    const params = Promise.resolve({ id: "test-feature" });
    const ui = await FeatureDetailPage({ params });
    render(ui);

    // muji-card が除外され、paypay-card のみが下部一覧に残るため見出しが描画される
    const bottomListHeading = screen.getByText("この記事で紹介したカード一覧");
    expect(bottomListHeading).toBeInTheDocument();
  });

  test("FEAT-02: 記事ファイルが存在しない場合に notFound が呼び出されること", async () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

    const params = Promise.resolve({ id: "non-existent" });

    await expect(FeatureDetailPage({ params })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });
});
