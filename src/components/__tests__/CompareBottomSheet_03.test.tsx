import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";

// Store のモック化
jest.mock("@/store/useCompareStore");

const mockUseCompareStore = useCompareStore as jest.MockedFunction<
  typeof useCompareStore
>;

// モックカードデータの定義
const freeCardA = {
  id: "card-free-a",
  name: "無料カードA",
  annualFeeValue: 0,
  baseReturnRateValue: 1.0,
};

const freeCardB = {
  id: "card-free-b",
  name: "無料カードB",
  annualFeeValue: 0,
  baseReturnRateValue: 0.5,
};

const paidCardHigh = {
  id: "card-paid-high",
  name: "有料ゴールドカード",
  annualFeeValue: 11000,
  baseReturnRateValue: 1.5,
};

const paidCardSameRate = {
  id: "card-paid-same",
  name: "有料ノーマルカード",
  annualFeeValue: 11000,
  baseReturnRateValue: 1.0,
};

const paidCardLow = {
  id: "card-paid-low",
  name: "有料ライトカード",
  annualFeeValue: 2200,
  baseReturnRateValue: 1.0,
};

describe("CompareBottomSheet - 損益分岐点・実質0円チップの動作テスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------------------------------
  // 1. ロジック算出 & UI表示制御 (UT & CT)
  // ----------------------------------------------------------------
  describe("表示制御と計算ロジック", () => {
    test("UT-01 / CT-01: 無料 vs 無料のケースではチップエリア自体が表示されないこと", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-free-a", "card-free-b"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(<CompareBottomSheet cards={[freeCardA, freeCardB] as any} />);

      // 「自動セット」ラベルやチップ群が表示されていないことを検証
      expect(screen.queryByText("自動セット")).not.toBeInTheDocument();
      expect(screen.queryByText("損益分岐点")).not.toBeInTheDocument();
      expect(screen.queryByText("実質0円")).not.toBeInTheDocument();
    });

    test("UT-02 / CT-02: 有料(高還元) vs 無料のケースで正しく計算されチップが表示されること", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-paid-high", "card-free-b"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(<CompareBottomSheet cards={[paidCardHigh, freeCardB] as any} />);

      expect(screen.getByText("自動セット")).toBeInTheDocument();
      // 損益分岐点 (11,000 ÷ (1.5% - 0.5%) ÷ 12 = 91,667円) と左側の実質0円が出現
      expect(screen.getByText("損益分岐点")).toBeInTheDocument();
      expect(screen.getByText("実質0円")).toBeInTheDocument();
    });

    test("UT-03: 有料 vs 無料（同還元率）のケースでは損益分岐点が出ず実質0円のみ表示されること", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-paid-same", "card-free-a"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(
        <CompareBottomSheet cards={[paidCardSameRate, freeCardA] as any} />,
      );

      // 同還元率では逆転不能なため「損益分岐点」は非表示
      expect(screen.queryByText("損益分岐点")).not.toBeInTheDocument();
      // 有料カード単体の「実質0円」ボタンのみ存在すること
      expect(screen.getByText("実質0円")).toBeInTheDocument();
    });

    test("UT-04: 有料 vs 有料のケースで両方の実質0円チップと損益分岐点が表示されること", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-paid-high", "card-paid-low"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(<CompareBottomSheet cards={[paidCardHigh, paidCardLow] as any} />);

      expect(screen.getByText("損益分岐点")).toBeInTheDocument();
      // 左右両方の実質0円ボタンが存在するため、2つ取得できること
      const zeroButtons = screen.getAllByText("実質0円");
      expect(zeroButtons).toHaveLength(2);
    });

    test("UT-05: プロパティが未定義・文字列等でもクラッシュせず防御されること", () => {
      const malformedCard = {
        id: "card-bad",
        name: "データ不備カード",
        annualFeeValue: undefined,
        baseReturnRateValue: "1.0%",
      };

      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-bad", "card-paid-low"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      expect(() => {
        render(
          <CompareBottomSheet cards={[malformedCard, paidCardLow] as any} />,
        );
      }).not.toThrow();
    });
  });

  // ----------------------------------------------------------------
  // 2. ユーザー操作・インタラクション (IT)
  // ----------------------------------------------------------------
  describe("ユーザーインタラクション", () => {
    test("IT-01 / IT-03: 「損益分岐点」チップタップ時に利用額がセットされスタイルがハイライトされること", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-paid-high", "card-free-b"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(<CompareBottomSheet cards={[paidCardHigh, freeCardB] as any} />);

      const breakEvenButton = screen.getByText("損益分岐点").closest("button")!;

      // タップ前のデフォルト表示の確認（初期値10万円）
      expect(screen.getByText("10")).toBeInTheDocument();

      // チップをタップ
      fireEvent.click(breakEvenButton);

      // 月額利用額が 91,667円 ≒ 9.17万円 に更新されたことを検証
      expect(screen.getByText("9.17")).toBeInTheDocument();

      // ボタンがアクティブ状態（bg-emerald-600 クラス付与）になっていることを確認
      expect(breakEvenButton.className).toContain("bg-emerald-600");
    });

    test("IT-02: 「実質0円」チップタップ時に単体の回収ライン金額に更新されること", () => {
      mockUseCompareStore.mockReturnValue({
        selectedIds: ["card-paid-high", "card-free-a"],
        isOpen: true,
        setIsOpen: jest.fn(),
        clearAll: jest.fn(),
        toggleCard: jest.fn(),
      } as any);

      render(<CompareBottomSheet cards={[paidCardHigh, freeCardA] as any} />);

      const zeroSpendButton = screen.getByText("実質0円").closest("button")!;

      // チップをタップ (11,000 ÷ 1.5% ÷ 12 = 61,111円 ≒ 6.11万円)
      fireEvent.click(zeroSpendButton);

      expect(screen.getByText("6.11")).toBeInTheDocument();
      expect(zeroSpendButton.className).toContain("bg-slate-800");
    });
  });
});
