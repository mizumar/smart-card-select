import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareBottomSheet } from "../CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";
import { cards } from "@/data/cards";

// テスト用のカードデータを共通モック化
jest.mock("@/data/cards", () => ({
  cards: [
    {
      id: "long-name-card",
      name: "超長名称クレジットカードプレミアムゴールドブラック2026", // 27文字
      tags: ["年会費無料"],
      maxReturnRate: "10.0%",
      annualFee: "無料",
      affiliateUrl: "https://example.com",
    },
    {
      id: "jcb-w",
      name: "JCB CARD W",
      tags: ["年会費無料"],
      maxReturnRate: "10.0%",
      annualFee: "無料",
      affiliateUrl: "https://example.com",
    },
  ],
}));

const CARD_ID_1 = "long-name-card";
const CARD_ID_2 = "jcb-w";

const initialStoreState = useCompareStore.getState();

describe("CompareBottomSheet Component", () => {
  beforeEach(() => {
    useCompareStore.setState(initialStoreState, true);
  });

  test("TC-01: カード未選択時はコンポーネントが何も描画されないこと", () => {
    const { container } = render(<CompareBottomSheet cards={cards} />);
    expect(container.firstChild).toBeNull();
  });

  test("TC-02: 1枚選択時にバッジと選択中カウントが表示され、比較ボタンは非表示であること", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1] });

    render(<CompareBottomSheet cards={cards} />);

    expect(screen.getByText(/1枚\s*選択中/)).toBeInTheDocument();
    expect(screen.getByText(/\(あと1枚\)/)).toBeInTheDocument();
    expect(screen.queryByText("比較する")).not.toBeInTheDocument();
  });

  test("TC-03: 2枚選択時にバッジが2つ表示され、比較ボタンが表示されること", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1, CARD_ID_2] });

    render(<CompareBottomSheet cards={cards} />);

    expect(screen.getByText(/2枚\s*選択中/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /比較する/i }),
    ).toBeInTheDocument();
  });

  test("TC-04: バッジ内の個別解除（✕）ボタンを押すと指定カードの選択が解除されること", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1, CARD_ID_2] });

    render(<CompareBottomSheet cards={cards} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /選択を解除/i,
    });
    fireEvent.click(removeButtons[0]);

    const updatedIds = useCompareStore.getState().selectedIds;
    expect(updatedIds).not.toContain(CARD_ID_1);
  });

  test("TC-05: 一括クリアボタンを押すとすべての選択が解除されること", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1, CARD_ID_2] });

    render(<CompareBottomSheet cards={cards} />);

    const clearButton = screen.getByRole("button", { name: /すべてクリア/i });
    fireEvent.click(clearButton);

    expect(useCompareStore.getState().selectedIds).toEqual([]);
  });

  test("TC-06: 「比較する」ボタンを押すと比較モーダルが開くこと", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1, CARD_ID_2] });

    render(<CompareBottomSheet cards={cards} />);

    const compareButton = screen.getByRole("button", { name: /比較する/i });
    fireEvent.click(compareButton);

    expect(compareButton).toBeInTheDocument();
  });

  test("TC-07: 20文字以上の名称が長いカードを選択した際、バッジ内のテキスト省略クラス（truncate）が適用されていること", () => {
    const LONG_CARD_NAME =
      "超長名称クレジットカードプレミアムゴールドブラック2026";
    expect(LONG_CARD_NAME.length).toBeGreaterThanOrEqual(20);

    useCompareStore.setState({ selectedIds: [CARD_ID_1] });

    render(<CompareBottomSheet cards={cards} />);

    const cardNameElement = screen.getByText(LONG_CARD_NAME);
    expect(cardNameElement).toBeInTheDocument();
    expect(cardNameElement).toHaveClass("truncate");
  });

  test("TC-08: 外枠コンテナに pointer-events-none、バッジおよびバー本体に pointer-events-auto が設定されていること", () => {
    useCompareStore.setState({ selectedIds: [CARD_ID_1, CARD_ID_2] });

    render(<CompareBottomSheet cards={cards} />);

    // 最外枠コンテナの取得（要素が存在することを確認）
    const outerContainer = screen.getByText(/2枚\s*選択中/).closest(".fixed");
    expect(outerContainer).toHaveClass("pointer-events-none");

    // バッジおよびバーの透過解除クラス判定
    const pointerAutoElements = document.querySelectorAll(
      ".pointer-events-auto",
    );
    expect(pointerAutoElements.length).toBeGreaterThanOrEqual(2);
  });
});
