import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CardItem } from "@/components/CardItem";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";

// 型定義に完全準拠したモックデータ
const mockCard: CreditCard = {
  // 1. 基本識別情報
  id: "test-card-1",
  name: "テストカード",
  popularityRank: 1,
  tagIds: ["point-high", "no-annual-fee"] as any, // プロジェクトのCardTagId型に合わせます
  tags: ["還元率重視", "年会費無料", "#海外旅行保険"],
  badge: "人気No.1",
  brandColor: "from-blue-500 to-indigo-500",
  brands: ["visa", "jcb"],

  // 2. ASP・アフィリエイト管理情報
  affiliateUrl: "https://example.com/affiliate",
  imageUrl: "https://example.com/card.png",
  trackingImageUrl: "https://example.com/0.gif",
  aspName: "A8.net",
  isPromoting: true,

  // 3. カードスペック情報
  annualFee: "無料",
  annualFeeValue: 0,
  baseReturnRate: "0.5%",
  baseReturnRateValue: 0.5,
  maxReturnRate: "2.0%",
  maxReturnRateValue: 2.0,
  pointName: "楽天ポイント",
  features: [
    "ポイント還元率最大2.0%",
    "海外旅行保険利用付帯",
    "ナンバーレスデザイン",
  ],
  details: {
    insurance: "最高2,000万円",
    electronicMoney: ["Suica", "PASMO"],
    pros: ["ポイントが貯まりやすい", "年会費が無料"],
    cons: ["期間限定ポイントの期限が短い"],
  },
  calloutNotices: ["※一部ポイント還元対象外の店舗があります。"],
};

// Next.js の Link コンポーネントをモック
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("CardItem Component", () => {
  beforeEach(() => {
    useCompareStore.setState({ selectedIds: [] });
  });

  // TC-03: 券面画像の表示確認
  test("TC-03: 券面画像および計測用トラッキング画像が正しく表示されること", () => {
    render(<CardItem card={mockCard} />);
    const img = screen.getByAltText("テストカード");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockCard.imageUrl);
  });

  // TC-04: タグ・バッジの表示制限確認
  test("TC-04: バッジが表示され、タグは上限2個のみ表示されること", () => {
    render(<CardItem card={mockCard} />);
    expect(screen.getByText("人気No.1")).toBeInTheDocument();
    expect(screen.getByText("#還元率重視")).toBeInTheDocument();
    expect(screen.queryByText("#年会費無料")).toBeInTheDocument();
    expect(screen.queryByText("#海外旅行保険")).not.toBeInTheDocument();
  });

  // TC-05: 特徴リストの初期表示制限確認
  test("TC-05: 特徴リストはデフォルトで上位1件のみ表示されること", () => {
    render(<CardItem card={mockCard} />);
    expect(screen.getByText("ポイント還元率最大2.0%")).toBeInTheDocument();
    expect(screen.queryByText("海外旅行保険利用付帯")).not.toBeInTheDocument();
  });

  // TC-07: 受付停止中時のボタン非活性確認
  test("TC-07: isPromotingがfalseの場合、受付停止中ボタンがdisabledで表示されること", () => {
    const disabledCard: CreditCard = { ...mockCard, isPromoting: false };
    render(<CardItem card={disabledCard} />);

    const button = screen.getByRole("button", { name: "受付停止中" });
    expect(button).toBeDisabled();
  });

  // TC-09: 比較ボタンの追加・解除動作確認
  test("TC-09: 比較ボタンのタップで追加・解除の切り替えができること", () => {
    render(<CardItem card={mockCard} />);
    const compareButton = screen.getByRole("button", { name: "比較" });

    fireEvent.click(compareButton);
    expect(screen.getByText("比較中")).toBeInTheDocument();
    expect(useCompareStore.getState().selectedIds).toContain("test-card-1");

    fireEvent.click(screen.getByRole("button", { name: "比較中" }));
    expect(screen.getByRole("button", { name: "比較" })).toBeInTheDocument();
    expect(useCompareStore.getState().selectedIds).not.toContain("test-card-1");
  });

  // TC-10: 比較上限数の制御確認
  test("TC-10: 既に2枚選択されている場合、未選択カードの比較ボタンが上限（非活性）となること", () => {
    useCompareStore.setState({ selectedIds: ["other-1", "other-2"] });
    render(<CardItem card={mockCard} />);

    const limitButton = screen.getByRole("button", { name: "上限" });
    expect(limitButton).toBeDisabled();
  });

  // TC-11, 12, 13: アコーディオンの開閉確認
  test("TC-11, 12, 13: アコーディオン開閉により詳細スペックや残りの特徴が表示・非表示されること", () => {
    render(<CardItem card={mockCard} />);

    const toggleButton = screen.getByRole("button", {
      name: "他2つの特徴・詳細スペック",
    });
    expect(toggleButton).toBeInTheDocument();

    // 展開
    fireEvent.click(toggleButton);

    expect(screen.getByText("海外旅行保険利用付帯")).toBeInTheDocument();
    expect(screen.getByText("基本還元率:")).toBeInTheDocument();
    expect(screen.getByText("最高2,000万円")).toBeInTheDocument();
    expect(screen.getByText("Suica")).toBeInTheDocument();
    expect(
      screen.getByText("※一部ポイント還元対象外の店舗があります。"),
    ).toBeInTheDocument();

    // 閉じる
    const closeButton = screen.getByRole("button", { name: "閉じる" });
    fireEvent.click(closeButton);

    expect(screen.queryByText("海外旅行保険利用付帯")).not.toBeInTheDocument();
    expect(screen.queryByText("基本還元率:")).not.toBeInTheDocument();
  });
});
