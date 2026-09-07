import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DiagnosisModal } from "@/components/DiagnosisModal";
import { CreditCard } from "@/data/cards";

// モック用のカードデータ
const mockCards: CreditCard[] = [
  {
    id: "card-a",
    name: "テストカードA",
    popularityRank: 1,
    tagIds: ["type-high-base", "fee-free", "use-daily"],
    tags: [],
    brandColor: "from-blue-500 to-indigo-600",
    affiliateUrl: "https://example.com/official-a",
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "1.0%",
    maxReturnRateValue: 1.0,
    features: [],
    details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
  },
];

describe("DiagnosisModal コンポーネントテスト", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("診断完了後に公式リンクと配点内訳バッジが正しく表示されること", () => {
    render(
      <DiagnosisModal cards={mockCards} isOpen={true} onClose={() => {}} />,
    );

    // 1. 質問に順番に回答する
    const option1 = screen.getByText(/普段の買い物での還元率/i);
    fireEvent.click(option1);

    const option2 = screen.getByText(/絶対無料がいい/i);
    fireEvent.click(option2);

    const option3 = screen.getByText(/日常の買い物/i);
    fireEvent.click(option3);

    // 2. 0.5秒の setTimeout 演出をフェイクタイマーで一瞬で進める
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // 3. 公式リンク（aタグ）の検証
    const officialLink = screen.getByRole("link", { name: /公式/i });
    expect(officialLink).toHaveAttribute(
      "href",
      "https://example.com/official-a",
    );
    expect(officialLink).toHaveAttribute("target", "_blank");

    // 4. 配点内訳（ラベルテキスト）の表示検証
    expect(screen.getByText(/どこでもお得/i)).toBeInTheDocument();
  });
});
