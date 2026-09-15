import { render, screen, fireEvent } from "@testing-library/react";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";
import { mockCardA, mockCardB, mockCards } from "@/mocks/cards";

// Storeのモック化
jest.mock("@/store/useCompareStore");

describe("CompareBottomSheet - Unit Tests", () => {
  const mockRemoveAndClose = jest.fn();

  // Helper: 指定したカードID群を selectedIds として返すストアモック関数のセットアップ
  const setupStoreMock = (selectedCardIds: string[]) => {
    (useCompareStore as unknown as jest.Mock).mockReturnValue({
      selectedIds: selectedCardIds, // ★ これを追加して undefined エラーを回避
      removeAndClose: mockRemoveAndClose,
      setIsOpen: jest.fn(),
      isOpen: true, // ★ これを追加してボトムシートを開いた状態にする
      toggleCard: jest.fn(),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------------------
  // 1. 比較解除（マイナス）ボタンの動作確認
  // ----------------------------------------------------
  test("[1.1] 各カードの上部右側にマイナスボタンが表示されていること", () => {
    setupStoreMock([mockCardA.id, mockCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, mockCardB]} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /比較から外す/,
    });
    expect(removeButtons).toHaveLength(2);
  });

  test("[1.2][1.3] 片方のマイナスボタンを押すと removeAndClose が正しいIDで呼ばれること", () => {
    setupStoreMock([mockCardA.id, mockCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, mockCardB]} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /比較から外す/,
    });
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveAndClose).toHaveBeenCalledTimes(1);
    expect(mockRemoveAndClose).toHaveBeenCalledWith(mockCardA.id);
  });

  // ----------------------------------------------------
  // 2. スペック情報の共通表示・レイアウト確認
  // ----------------------------------------------------
  test("[2.1] 年間お得額（一致時）：統合表示されること", () => {
    const sameRateCardB = {
      ...mockCardB,
      baseReturnRate: "1.0%",
      baseReturnRateValue: 1.0,
    };
    setupStoreMock([mockCardA.id, sameRateCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, sameRateCardB]} />);

    expect(screen.getByText("2枚とも同じお得額です")).toBeInTheDocument();
  });

  test("[2.2] 年間お得額（差分あり）：2列表示されること", () => {
    setupStoreMock([mockCardA.id, mockCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, mockCardB]} />);

    expect(screen.queryByText("2枚とも同じお得額です")).not.toBeInTheDocument();
  });

  test("[2.3] 貯まるポイント（一致時）：1つの横長コンテナに統合表示されること", () => {
    const goldCard = mockCards[3]; // pointName: "Vポイント"
    setupStoreMock([mockCardB.id, goldCard.id]);

    render(<CompareBottomSheet cards={[mockCardB, goldCard]} />);

    const pointElements = screen.getAllByText("Vポイント");
    expect(pointElements).toHaveLength(1);
  });

  test("[2.4] 貯まるポイント（不一致時）：左右2列で表示されること", () => {
    setupStoreMock([mockCardA.id, mockCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, mockCardB]} />);

    expect(screen.getByText("楽天ポイント")).toBeInTheDocument();
    expect(screen.getByText("Vポイント")).toBeInTheDocument();
  });

  test("[2.5] 年会費（双方 永年無料）：統合された緑色プレートが表示されること", () => {
    setupStoreMock([mockCardA.id, mockCardB.id]);

    render(<CompareBottomSheet cards={[mockCardA, mockCardB]} />);

    expect(screen.getByText("年会費：永年無料")).toBeInTheDocument();
  });

  test("[2.6] 年会費（条件付き無料・有料など）：統合されず個別に表示されること", () => {
    const goldCard = mockCards[3];
    setupStoreMock([mockCardA.id, goldCard.id]);

    render(<CompareBottomSheet cards={[mockCardA, goldCard]} />);

    expect(screen.queryByText("年会費：永年無料")).not.toBeInTheDocument();
    expect(screen.getByText("11,000円（税込）")).toBeInTheDocument();
  });
});
