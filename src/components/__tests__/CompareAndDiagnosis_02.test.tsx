import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { useCompareStore } from "@/store/useCompareStore";
import { CreditCard } from "@/data/cards";

// モックデータ：無料カード（還元率1.0%） vs 有料カード（年会費1,100円、還元率2.0%）
const mockCards: CreditCard[] = [
  {
    id: "card-free",
    name: "無料カード",
    popularityRank: 1,
    tagIds: [],
    tags: ["年会費無料"],
    brandColor: "from-blue-500 to-indigo-600",
    affiliateUrl: "https://example.com/free",
    annualFee: "無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "1.0%",
    maxReturnRateValue: 1.0,
    features: [],
    details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
  },
  {
    id: "card-paid",
    name: "有料カード",
    popularityRank: 2,
    tagIds: [],
    tags: ["高還元"],
    brandColor: "from-amber-500 to-orange-600",
    affiliateUrl: "https://example.com/paid",
    annualFee: "1,100円",
    annualFeeValue: 1100, // 年会費 1,100円
    baseReturnRate: "2.0%",
    baseReturnRateValue: 2.0, // 還元率 2.0%
    maxReturnRate: "2.0%",
    maxReturnRateValue: 2.0,
    features: [],
    details: { insurance: "", electronicMoney: [], pros: [], cons: [] },
  },
];

// Zustand ストアを各テスト前に初期化
beforeEach(() => {
  useCompareStore.setState({
    selectedIds: ["card-free", "card-paid"],
    isOpen: true,
  });
});

// ----------------------------------------------------------------------
// 3. CompareBottomSheet（比較バー・比較モーダル）動作テスト
// ----------------------------------------------------------------------
describe("3. CompareBottomSheet (スライダー & 動的損益計算) テスト", () => {
  test("1. 初期値が10万円にセットされ、計算結果が正しく表示されること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    // 初期値 10万円/月 の表示確認
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("万円/月")).toBeInTheDocument();

    // 無料カード: 10万 * 12ヶ月 * 1.0% - 0円 = 12,000円
    expect(screen.getByText("約12,000")).toBeInTheDocument();

    // 有料カード: 10万 * 12ヶ月 * 2.0% - 1,100円 = 22,900円
    expect(screen.getByText("約22,900")).toBeInTheDocument();

    // 計算式の注記表示確認
    expect(
      screen.getByText("基本 1% × 年間120万 - 年会費"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("基本 2% × 年間120万 - 年会費"),
    ).toBeInTheDocument();
  });

  test("2. スライダー操作時に利用額と年間実質お得額がリアルタイムに更新されること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    const slider = screen.getByRole("slider");

    // 月間利用額を 20万円（200,000円）に変更
    fireEvent.change(slider, { target: { value: "200000" } });

    // テキスト更新の確認
    expect(screen.getByText("20")).toBeInTheDocument();

    // 無料カード: 20万 * 12 * 1.0% = 24,000円
    expect(screen.getByText("約24,000")).toBeInTheDocument();

    // 有料カード: 20万 * 12 * 2.0% - 1,100 = 46,900円
    expect(screen.getByText("約46,900")).toBeInTheDocument();

    // 注記テキストが「年間240万」に更新されているか
    expect(
      screen.getAllByText("基本 1% × 年間240万 - 年会費").length,
    ).toBeGreaterThan(0);
  });

  test("3. 利用額 0 円設定時に有料カードが赤字（マイナス表記 & 赤色スタイル）になること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    const slider = screen.getByRole("slider");

    // 月間利用額を 0 円に変更
    fireEvent.change(slider, { target: { value: "0" } });

    // 1. スライダー数値の表示が "0" であることを確認（「万円/月」の直前の要素を指定）
    expect(screen.getByText("万円/月").previousSibling).toHaveTextContent("0");

    // 2. 有料カード: 0 - 1,100円 = -1,100円
    const negativeBenefitElement = screen.getByText("-1,100");
    expect(negativeBenefitElement).toBeInTheDocument();

    // 赤字（text-red-500）のクラスが適用されているか確認
    expect(negativeBenefitElement).toHaveClass("text-red-500");
  });

  test("4. 損益分岐点（利用額変動による勝敗の逆転）が正常に機能すること", () => {
    render(<CompareBottomSheet cards={mockCards} />);

    const slider = screen.getByRole("slider");

    // 【低利用額】月間利用額を 0.4万円（4,000円）に設定
    // 無料カード: 4000 * 12 * 1% = 480円 (勝者)
    // 有料カード: 4000 * 12 * 2% - 1100 = -140円
    fireEvent.change(slider, { target: { value: "4000" } });

    const freeCardBenefit = screen.getByText("約480");
    const paidCardBenefit = screen.getByText("-140");

    // 無料カード側が緑強調（text-emerald-600）になっているか
    expect(freeCardBenefit).toHaveClass("text-emerald-600");
    expect(paidCardBenefit).toHaveClass("text-red-500");

    // 【高利用額】月間利用額を 30万円（300,000円）に引き上げ
    // 無料カード: 36,000円
    // 有料カード: 70,900円 (逆転して勝者)
    fireEvent.change(slider, { target: { value: "300000" } });

    const freeCardBenefitUpdated = screen.getByText("約36,000");
    const paidCardBenefitUpdated = screen.getByText("約70,900");

    // 有料カード側が勝者（text-emerald-600）に入れ替わっているか
    expect(paidCardBenefitUpdated).toHaveClass("text-emerald-600");
    expect(freeCardBenefitUpdated).toHaveClass("text-slate-700");
  });

  describe("5. CompareBottomSheet 境界値テスト (Jest)", () => {
    test("1. 利用額 0 円設定時に NaN や計算エラーが発生せず、正常な数値が表示されること", () => {
      render(<CompareBottomSheet cards={mockCards} />);

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "0" } });

      // NaN や undefined が画面上に描画されていないこと
      expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();

      // 0円時の表示確認（有料カードは -1,100 円）
      expect(screen.getByText("-1,100")).toBeInTheDocument();
    });

    test("2. 最大値（100万円/月）設定時に桁あふれせず正しく計算・フォーマット表示されること", () => {
      render(<CompareBottomSheet cards={mockCards} />);

      const slider = screen.getByRole("slider");
      // 50万円（500,000円）に変更
      fireEvent.change(slider, { target: { value: "1000000" } });

      // スライダーラベルが 100 万円になっているか
      expect(screen.getByText("100")).toBeInTheDocument();

      // 無料カード: 100万 * 12 * 1% = 120,000円/年
      expect(screen.getByText("約120,000")).toBeInTheDocument();

      // 有料カード: 100万 * 12 * 2% - 1,100 = 238,900円/年
      expect(screen.getByText("約238,900")).toBeInTheDocument();

      // 注記テキストが「年間600万」になっているか
      expect(
        screen.getAllByText("基本 1% × 年間1200万 - 年会費").length,
      ).toBeGreaterThan(0);
    });
  });
});
