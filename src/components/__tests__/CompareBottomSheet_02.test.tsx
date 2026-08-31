import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareBottomSheet } from "../CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";
import { CreditCard } from "@/data/cards";

// Jest による Store のモック化
jest.mock("@/store/useCompareStore");

// テスト用ダミーカードデータ
const mockCards = [
  {
    id: "card-a",
    name: "カードA",
    badge: "年会費無料のおすすめカード",
    brandColor: "from-blue-500 to-indigo-500",
    baseReturnRateValue: 1.0,
    annualFeeValue: 0,
    maxReturnRate: "最大 5.0% ※1",
    annualFee: "永年無料",
    pointName: "Aポイント",
    affiliateUrl: "https://example.com/a",
    calloutNotices: {
      "※1": "対象店舗でのご利用時に限ります。",
      "※2": "画面に出てこない不要な注釈",
    },
    details: {
      pros: ["還元率が高い"],
      cons: ["国際ブランドが少ない"],
    },
  },
  {
    id: "card-b",
    name: "カードB",
    badge: "ゴールド",
    brandColor: "from-amber-500 to-yellow-500",
    baseReturnRateValue: 0.5,
    annualFeeValue: 2200,
    maxReturnRate: "最大 2.0%",
    annualFee: "2,200円（税込）",
    pointName: "Bポイント",
    affiliateUrl: "https://example.com/b",
    calloutNotices: ["※1 特定の加盟店のみ対象"],
    details: {
      pros: ["空港ラウンジが無料"],
      cons: ["年会費がかかる"],
    },
  },
] as CreditCard[];

describe("CompareBottomSheet Component", () => {
  const mockToggleCard = jest.fn();
  const mockClearAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCompareStore as unknown as jest.Mock).mockReturnValue({
      selectedIds: ["card-a", "card-b"],
      toggleCard: mockToggleCard,
      clearAll: mockClearAll,
    });
  });

  it("選択カードが0枚の場合は何もレンダリングされないこと", () => {
    (useCompareStore as unknown as jest.Mock).mockReturnValue({
      selectedIds: [],
      toggleCard: mockToggleCard,
      clearAll: mockClearAll,
    });

    const { container } = render(<CompareBottomSheet cards={mockCards} />);
    expect(container.firstChild).toBeNull();
  });

  it("選択された2枚のカード情報と「比較を見る」ボタンがボトムバーに表示されること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    expect(screen.getByText("カードA")).toBeInTheDocument();
    expect(screen.getByText("カードB")).toBeInTheDocument();
    expect(screen.getByText("2 / 2 枚選択中")).toBeInTheDocument();
    expect(screen.getByText("比較を見る")).toBeInTheDocument();
  });

  it("「比較を見る」をクリックするとモーダルが開き、スペックおよび計算結果が正しく表示されること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    // モーダルを開く
    fireEvent.click(screen.getByText("比較を見る"));

    // ヘッダー確認
    expect(screen.getByText("カード仕様の比較")).toBeInTheDocument();

    // 年間お得額の計算結果確認 (120万 × 1.0% - 0 = 12,000円)
    expect(screen.getByText("約12,000")).toBeInTheDocument();
    expect(screen.getByText("基本 1% × 120万 - 年会費")).toBeInTheDocument();

    // カードBの計算結果確認 (120万 × 0.5% - 2,200 = 3,800円)
    expect(screen.getByText("約3,800")).toBeInTheDocument();
  });

  it("画面上に存在する※記号に対応する calloutNotices のみが抽出・表示されること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    fireEvent.click(screen.getByText("比較を見る"));

    // カードAに記載されている `※1` の説明文のみ表示されること
    expect(
      screen.getByText("※1 対象店舗でのご利用時に限ります。"),
    ).toBeInTheDocument();

    // 画面上で使用されていない `※2` の注釈テキストが表示されていないこと
    expect(
      screen.queryByText("※2 画面に出てこない不要な注釈"),
    ).not.toBeInTheDocument();
  });

  it("閉じるボタンをクリックするとモーダルが閉じること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    // モーダルを開く
    fireEvent.click(screen.getByText("比較を見る"));
    expect(screen.getByText("カード仕様の比較")).toBeInTheDocument();

    // aria-label でモーダルの閉じるボタンをピンポイント取得してクリック
    const closeButton = screen.getByRole("button", {
      name: "モーダルを閉じる",
    });
    fireEvent.click(closeButton);

    expect(screen.queryByText("カード仕様の比較")).not.toBeInTheDocument();
  });
});

describe("2.2 比較モーダルの表示とコンテンツ描画", () => {
  beforeEach(() => {
    render(<CompareBottomSheet cards={mockCards} />);
    // モーダルを開いた状態にする
    fireEvent.click(screen.getByText("比較を見る"));
  });

  it("「比較を見る」ボタン押下時にモーダルが開くこと", () => {
    expect(screen.getByText("カード仕様の比較")).toBeInTheDocument();
  });

  it("2枚のカード画像・カード名・バッジ・詳細リンク・公式サイトボタンが正しく並列表示されること", () => {
    // カード名の表示
    // 修正後（複数存在するテキストをすべて取得して検証）
    expect(screen.getAllByText("カードA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("カードB").length).toBeGreaterThan(0);

    // バッジの表示
    expect(screen.getByText("年会費無料のおすすめカード")).toBeInTheDocument();
    expect(screen.getByText("ゴールド")).toBeInTheDocument();

    // 詳細リンク（2枚分）
    const detailLinks = screen.getAllByText("詳細");
    expect(detailLinks).toHaveLength(2);
    expect(detailLinks[0].closest("a")).toHaveAttribute(
      "href",
      "/cards/card-a",
    );
    expect(detailLinks[1].closest("a")).toHaveAttribute(
      "href",
      "/cards/card-b",
    );

    // 公式サイトボタン（2枚分）
    const officialButtons = screen.getAllByText("公式サイトへ");
    expect(officialButtons).toHaveLength(2);
  });

  it("バッジに whitespace-nowrap および truncate が適用され、長い文字列でも1行に収まること", () => {
    const badgeElement = screen.getByText("年会費無料のおすすめカード");
    expect(badgeElement).toHaveClass("whitespace-nowrap");
    expect(badgeElement).toHaveClass("truncate");
  });

  it("年間お得額が高い方の数値に判定クラス（text-emerald-600）が付与されること", () => {
    // カードAのお得額（勝者: 12,000円）
    const winnerAmount = screen.getByText("約12,000");
    expect(winnerAmount).toHaveClass("text-emerald-600");

    // カードBのお得額（敗者: 3,800円）
    const loserAmount = screen.getByText("約3,800");
    expect(loserAmount).toHaveClass("text-slate-700");
    expect(loserAmount).not.toHaveClass("text-emerald-600");
  });

  it("「試算根拠（基本還元率）」の注記テキストおよび計算式チップが表示されていること", () => {
    expect(
      screen.getByText(
        "※基本還元率での試算。特定店舗や特典によりさらに上振れる場合があります",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("基本 1% × 120万 - 年会費")).toBeInTheDocument();
    expect(screen.getByText("基本 0.5% × 120万 - 年会費")).toBeInTheDocument();
  });

  it("最下部に抽出された calloutNotices のテキストが左右のコラムに正しく表示されること", () => {
    expect(screen.getByText("注記事項")).toBeInTheDocument();
    expect(
      screen.getByText("※1 対象店舗でのご利用時に限ります。"),
    ).toBeInTheDocument();
  });
});

describe("2.3 外部リンク動作", () => {
  beforeEach(() => {
    render(<CompareBottomSheet cards={mockCards} />);
    fireEvent.click(screen.getByText("比較を見る"));
  });

  it("「公式サイトへ」ボタン押下時、別タブでアフィリエイトURLが開くこと", () => {
    const officialButtons = screen.getAllByText("公式サイトへ");
    const linkA = officialButtons[0].closest("a");
    const linkB = officialButtons[1].closest("a");

    expect(linkA).toHaveAttribute("href", "https://example.com/a");
    expect(linkA).toHaveAttribute("target", "_blank");
    expect(linkA).toHaveAttribute("rel", "noopener noreferrer sponsored");

    expect(linkB).toHaveAttribute("href", "https://example.com/b");
    expect(linkB).toHaveAttribute("target", "_blank");
    expect(linkB).toHaveAttribute("rel", "noopener noreferrer sponsored");
  });
});
