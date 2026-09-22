import { render, screen } from "@testing-library/react";
import { CardItem } from "./CardItem";
import { CreditCard } from "@/data/cards"; // パスはプロジェクトの型定義の場所に調整してください

// 1. 通常掲載中（isPromoting: true）のテストデータ
const activeCard: CreditCard = {
  // 1. 基本識別情報
  id: "active-card",
  name: "通常カード",
  popularityRank: 1,

  // システム判定用タグID
  tagIds: ["fee-free", "type-high-base", "use-daily"],

  // 表示用タグ
  tags: ["年会費無料"],
  badge: "おすすめ",

  brandColor: "#000000",
  brands: ["visa"],

  // 2. ASP・アフィリエイト管理情報
  affiliateUrl: "https://px.a8.net/svt/ejp?active",
  imageUrl: "https://www24.a8.net/svt/bgt?active",
  trackingImageUrl: "https://www13.a8.net/0.gif?active",
  aspName: "A8.net",
  isPromoting: true,

  // 3. カードスペック情報
  annualFee: "無料",
  annualFeeValue: 0,

  baseReturnRate: "1.0%",
  baseReturnRateValue: 1.0,

  maxReturnRate: "5.0%",
  maxReturnRateValue: 5.0,

  pointName: "テストポイント",

  features: ["ポイント還元"],

  details: {
    insurance: "あり",
    electronicMoney: ["Suica"],
    pros: ["還元率が高い"],
    cons: ["特になし"],
  },

  calloutNotices: ["現在掲載中"],
};

// 2. ★ 受付停止中（isPromoting: false）のテストデータ
const disabledCard: CreditCard = {
  ...activeCard,
  id: "disabled-card",
  name: "停止中カード",
  isPromoting: false, // ★ 掲載停止
};

describe("CardItem コンポーネントのアフィリエイト機能テスト", () => {
  // --- テスト 1: 通常掲載時 ---
  test("isPromoting: true の場合、公式サイトボタンが表示され rel='noopener noreferrer sponsored' が設定されること", () => {
    render(<CardItem card={activeCard} />);

    const link = screen.getByRole("link", { name: /公式サイト/i });

    expect(link).toHaveAttribute("href", activeCard.affiliateUrl);
    expect(link).toHaveAttribute("rel", "noopener noreferrer sponsored");
  });

  // --- テスト 2: 1x1 ビーコン画像のテスト ---
  test("trackingImageUrl が存在する場合、1x1ピクセルの計測用画像がレンダリングされること", () => {
    // container（レンダリングされたDOM全体）を受け取る
    const { container } = render(<CardItem card={activeCard} />);

    // src 属性が trackingImageUrl と一致する img 要素をDOMから直接取得
    const trackingImg = container.querySelector(
      `img[src="${activeCard.trackingImageUrl}"]`,
    );

    expect(trackingImg).toBeInTheDocument();
  });

  // --- テスト 3: ★ 受付停止時 ---
  test("isPromoting: false の場合、アフィリエイトリンクが存在せず『現在受付停止中』の非活性ボタンが表示されること", () => {
    render(<CardItem card={disabledCard} />);

    // アフィリエイトリンクだけを確認
    expect(
      screen.queryByRole("link", {
        name: /停止中カードに申し込む/i,
      }),
    ).not.toBeInTheDocument();

    const disabledButton = screen.getByRole("button", {
      name: /受付停止中/i,
    });

    expect(disabledButton).toBeDisabled();
  });
});
