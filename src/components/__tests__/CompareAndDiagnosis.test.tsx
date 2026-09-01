import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { MatchGauge } from "@/components/MatchGauge";
import { DiagnosisModal } from "@/components/DiagnosisModal";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";
import { CreditCard } from "@/data/cards";

// CreditCard インターフェースを満たす完全なモックデータ
const mockCards: CreditCard[] = [
  {
    // 1. 基本識別情報
    id: "card-1",
    name: "テストカードA",
    popularityRank: 1,
    tagIds: [],
    tags: ["年会費無料", "高還元"],
    badge: "人気No.1",
    brandColor: "from-blue-500 to-indigo-600",
    brands: ["visa", "mastercard"],

    // 2. ASP・アフィリエイト管理情報
    affiliateUrl: "https://example.com/a",
    imageUrl: "/images/card-a.png",
    trackingImageUrl: "https://example.com/a/0.gif",
    aspName: "A8.net",
    isPromoting: true,

    // 3. カードスペック情報
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "5.0%",
    maxReturnRateValue: 5.0,
    pointName: "Aポイント",
    features: ["特長A1", "特長A2"],
    details: {
      insurance: "最高2,000万円",
      electronicMoney: ["iD", "Suica"],
      pros: ["メリットA1", "メリットA2"],
      cons: ["デメリットA1"],
    },
    calloutNotices: ["※1 注記テストA"],
  },
  {
    // 1. 基本識別情報
    id: "card-2",
    name: "テストカードB",
    popularityRank: 2,
    tagIds: [],
    tags: ["ポイント重視"],
    badge: "還元率重視",
    brandColor: "from-amber-500 to-orange-600",
    brands: ["jcb"],

    // 2. ASP・アフィリエイト管理情報
    affiliateUrl: "https://example.com/b",
    imageUrl: "/images/card-b.png",
    trackingImageUrl: "https://example.com/b/0.gif",
    aspName: "ValueCommerce",
    isPromoting: true,

    // 3. カードスペック情報
    annualFee: "1,100円",
    annualFeeValue: 1100,
    baseReturnRate: "0.5%",
    baseReturnRateValue: 0.5,
    maxReturnRate: "3.0%",
    maxReturnRateValue: 3.0,
    pointName: "Bポイント",
    features: ["特長B1"],
    details: {
      insurance: "なし",
      electronicMoney: ["QUICPay"],
      pros: ["メリットB1"],
      cons: ["デメリットB1"],
    },
    calloutNotices: ["※1 注記テストB"],
  },
  {
    // 1. 基本識別情報
    id: "card-3",
    name: "テストカードC",
    popularityRank: 3,
    tagIds: [],
    tags: ["コンビニでお得"],
    brandColor: "from-emerald-500 to-teal-600",
    brands: ["amex"],

    // 2. ASP・アフィリエイト管理情報
    affiliateUrl: "https://example.com/c",
    imageUrl: "/images/card-c.png",
    isPromoting: true,

    // 3. カードスペック情報
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1.2%",
    baseReturnRateValue: 1.2,
    maxReturnRate: "2.0%",
    maxReturnRateValue: 2.0,
    pointName: "Cポイント",
    features: [],
    details: {
      insurance: "なし",
      electronicMoney: [],
      pros: [],
      cons: [],
    },
  },
];

// Zustand ストアを各テスト前に初期化
beforeEach(() => {
  useCompareStore.setState({
    selectedIds: [],
    isOpen: false,
  });
});

// ----------------------------------------------------------------------
// 1. MatchGauge（適合度表示）UIテスト
// ----------------------------------------------------------------------
describe("1. MatchGauge UIテスト", () => {
  test("指定された score が正しい数値で表示されること", () => {
    render(<MatchGauge score={94} />);
    expect(screen.getByText("94")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("あなたとの適合度")).toBeInTheDocument();
  });

  test("範囲外の値（120 や -10）が0〜100にクランプされて表示されること", () => {
    const { rerender } = render(<MatchGauge score={120} />);
    expect(screen.getByText("100")).toBeInTheDocument();

    rerender(<MatchGauge score={-10} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------------
// 2. DiagnosisModal（診断モーダル）動作テスト
// ----------------------------------------------------------------------
describe("2. DiagnosisModal 動作テスト", () => {
  // 質問を最後まで進める共通ヘルパー関数
  const answerAllQuestions = () => {
    // 質問一覧が表示されている間、最初の選択肢ボタンを繰り返しクリックする
    while (
      screen.queryByText(/10秒かんたん診断/) ||
      screen.queryByText(/あなたに最適なカードを計算中/)
    ) {
      // 閉じるボタンなどを避け、選択肢のコンテナ内のボタンを取得
      const optionButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.querySelector("span")); // テキスト要素を含むボタン

      if (optionButtons.length === 0) break;

      fireEvent.click(optionButtons[0]);
    }
  };

  test("質問を選択して進み、結果画面で MatchGauge と上位2枚が表示されること", async () => {
    const handleClose = jest.fn();
    render(
      <DiagnosisModal cards={mockCards} isOpen={true} onClose={handleClose} />,
    );

    // 質問を回答して最後まで進める
    answerAllQuestions();

    // 結果表示（setTimeout 500ms）を待つ
    await waitFor(
      () => {
        expect(
          screen.getByText("ベストな2枚が見つかりました！"),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // MatchGaugeと結果カードが表示されているか
    expect(screen.getByText("94")).toBeInTheDocument();
    expect(screen.getByText("第1候補")).toBeInTheDocument();
    expect(screen.getByText("第2候補")).toBeInTheDocument();
  });

  test("「この2枚の年間お得額をシミュレーション」ボタンでストアにセットされ比較モーダルが開くこと", async () => {
    const handleClose = jest.fn();
    render(
      <DiagnosisModal cards={mockCards} isOpen={true} onClose={handleClose} />,
    );

    // 質問を回答して最後まで進める
    answerAllQuestions();

    // 結果表示まで待つ
    const simButton = await screen.findByText(
      "この2枚の年間お得額をシミュレーション",
      {},
      { timeout: 2000 },
    );
    expect(simButton).toBeInTheDocument();

    // シミュレーションボタンをクリック
    fireEvent.click(simButton);

    // 診断モーダルが閉じられ、ストアに2枚がセットされ isOpen: true になること
    expect(handleClose).toHaveBeenCalledTimes(1);
    const storeState = useCompareStore.getState();
    expect(storeState.selectedIds).toHaveLength(2);
    expect(storeState.isOpen).toBe(true);
  });
});

// ----------------------------------------------------------------------
// 3. CompareBottomSheet（比較バー・比較モーダル）動作テスト
// ----------------------------------------------------------------------
describe("3. CompareBottomSheet 動作テスト", () => {
  test("selectedIds が 0 枚の時は何も表示されないこと", () => {
    const { container } = render(<CompareBottomSheet cards={mockCards} />);
    expect(container.firstChild).toBeNull();
  });

  test("1枚選択時はバーが表示され、「比較を見る」ボタンは非表示であること", () => {
    useCompareStore.setState({ selectedIds: ["card-1"], isOpen: false });

    render(<CompareBottomSheet cards={mockCards} />);

    expect(screen.getByText("1 / 2 枚選択中")).toBeInTheDocument();
    expect(screen.getByText("テストカードA")).toBeInTheDocument();
    expect(screen.queryByText("比較を見る")).not.toBeInTheDocument();
  });

  test("2枚選択時は「比較を見る」ボタンが表示され、クリックで比較モーダルが開くこと", () => {
    useCompareStore.setState({
      selectedIds: ["card-1", "card-2"],
      isOpen: false,
    });

    render(<CompareBottomSheet cards={mockCards} />);

    expect(screen.getByText("2 / 2 枚選択中")).toBeInTheDocument();

    const compareBtn = screen.getByText("比較を見る");
    expect(compareBtn).toBeInTheDocument();

    fireEvent.click(compareBtn);

    // モーダルが開く（isOpen: true になる）
    expect(useCompareStore.getState().isOpen).toBe(true);
    expect(screen.getByText("カード仕様の比較")).toBeInTheDocument();
  });

  test("比較モーダル内に2枚のカードスペックが描画されること", () => {
    useCompareStore.setState({
      selectedIds: ["card-1", "card-2"],
      isOpen: true,
    });

    render(<CompareBottomSheet cards={mockCards} />);

    // カード名が表示されているか
    expect(screen.getAllByText("テストカードA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("テストカードB").length).toBeGreaterThan(0);

    // スペック項目の表示確認
    expect(screen.getByText("Aポイント")).toBeInTheDocument();
    expect(screen.getByText("Bポイント")).toBeInTheDocument();
    expect(screen.getByText("カード仕様の比較")).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------------
// 4. 状態管理（useCompareStore）ロジック単体テスト
// ----------------------------------------------------------------------
describe("4. useCompareStore ロジックテスト", () => {
  test("toggleCard で2枚選択中の場合、3枚目は追加されないこと", () => {
    const store = useCompareStore.getState();

    store.toggleCard("card-1");
    store.toggleCard("card-2");
    expect(useCompareStore.getState().selectedIds).toEqual([
      "card-1",
      "card-2",
    ]);

    // 3枚目を追加しようとする
    store.toggleCard("card-3");
    expect(useCompareStore.getState().selectedIds).toEqual([
      "card-1",
      "card-2",
    ]);
  });

  test("setSelectedIds 実行時、最大2件がセットされ isOpen: true になること", () => {
    const store = useCompareStore.getState();

    store.setSelectedIds(["card-1", "card-2", "card-3"]);

    const updatedState = useCompareStore.getState();
    expect(updatedState.selectedIds).toEqual(["card-1", "card-2"]);
    expect(updatedState.isOpen).toBe(true);
  });

  test("clearAll で全クリアされ isOpen: false になること", () => {
    useCompareStore.setState({
      selectedIds: ["card-1", "card-2"],
      isOpen: true,
    });

    useCompareStore.getState().clearAll();

    const updatedState = useCompareStore.getState();
    expect(updatedState.selectedIds).toEqual([]);
    expect(updatedState.isOpen).toBe(false);
  });
});
