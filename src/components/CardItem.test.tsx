import { render, screen } from "@testing-library/react";
import { CardItem } from "./CardItem";
import { CreditCard } from "@/data/cards"; // パスはプロジェクトの型定義の場所に調整してください

// 1. 通常掲載中（isPromoting: true）のテストデータ
const activeCard: CreditCard = {
  id: "active-card",
  name: "通常カード",
  brandColor: "#000000",
  affiliateUrl: "https://px.a8.net/svt/ejp?active",
  imageUrl: "https://www24.a8.net/svt/bgt?active",
  trackingImageUrl: "https://www13.a8.net/0.gif?active",
  aspName: "A8.net",
  isPromoting: true, // ★ 掲載中
  annualFee: "無料",
  annualFeeValue: 0,
  baseReturnRate: "1.0%",
  maxReturnRate: "5.0%",
  maxReturnRateValue: 5.0,
  popularityRank: 1,
  features: ["ポイント還元"],
  tags: ["年会費無料"],
  details: {
    insurance: "あり",
    electronicMoney: ["Suica"],
    pros: ["還元率が高い"],
    cons: ["特になし"],
  },
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

    const link = screen.getByRole("link", { name: /発行公式サイトを見る/i });

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

    // 1. リンク（<a>タグ）が画面上に存在しないことを確認
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    // 2. 「現在受付停止中」と書かれたボタンが存在し、非活性（disabled）であることを確認
    const disabledButton = screen.getByRole("button", {
      name: /現在受付停止中/i,
    });
    expect(disabledButton).toBeInTheDocument();
    expect(disabledButton).toBeDisabled();
  });
});
