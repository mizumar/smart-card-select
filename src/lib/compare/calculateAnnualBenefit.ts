import type { CreditCard } from "@/data/cards";

/**
 * 動的な年間実質お得額の計算関数（monthlySpend に依存）
 * @param card
 * @param spend
 * @returns
 */
export function calculateAnnualBenefit(card: CreditCard, spend: number) {
  const annualSpend = spend * 12; // 月額 × 12ヶ月
  const baseRate = card.baseReturnRateValue ?? 0;
  const annualFee = card.annualFeeValue ?? 0;

  const grossReturn = (annualSpend * baseRate) / 100;
  const netBenefit = grossReturn - annualFee;

  return {
    baseRate,
    annualFee,
    netBenefit,
    // マイナス時は絶対値にしてハイフン表示などの制御もしやすくする
    formattedBenefit: Math.floor(netBenefit).toLocaleString(),
    isProfit: netBenefit >= 0, // ★ 黒字か赤字かの判定
  };
}
