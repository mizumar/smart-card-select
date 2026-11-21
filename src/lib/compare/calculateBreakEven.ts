import { CreditCard } from "@/data/cards";

/**  単体での実質0円ライン（年会費回収）*/
export function getZeroSpend(fee: number, rate: number) {
  if (fee <= 0 || rate <= 0) return null;
  return Math.round(fee / (rate / 100) / 12);
}
/** 損益分岐点・実質0円ラインの統合算出 */
export function calculateBreakEven(cardA: CreditCard, cardB: CreditCard) {
  if (!cardA || !cardB) return null;

  const feeA = Number(cardA.annualFeeValue) || 0;
  const feeB = Number(cardB.annualFeeValue) || 0;
  const rateA = Number(cardA.baseReturnRateValue) || 0;
  const rateB = Number(cardB.baseReturnRateValue) || 0;

  // 【1】無料 vs 無料 は完全に除外
  if (feeA === 0 && feeB === 0) return null;

  const zeroSpendA = getZeroSpend(feeA, rateA);
  const zeroSpendB = getZeroSpend(feeB, rateB);

  // 【2】2枚の損益分岐点（高年会費側が、高還元率で逆転できる場合のみ計算）
  let crossSpend: number | null = null;

  // 年会費が高い方のカードと安い方のカードを判定
  const expensive =
    feeA >= feeB ? { fee: feeA, rate: rateA } : { fee: feeB, rate: rateB };
  const cheaper =
    feeA >= feeB ? { fee: feeB, rate: rateB } : { fee: feeA, rate: rateA };

  const feeDiff = expensive.fee - cheaper.fee;
  const rateDiff = expensive.rate - cheaper.rate;

  // 有料カード側の還元率が安い側より「厳密に高い（rateDiff > 0）」時だけ逆転が存在する
  if (feeDiff > 0 && rateDiff > 0) {
    crossSpend = Math.round(feeDiff / (rateDiff / 100) / 12);
  }

  return { zeroSpendA, zeroSpendB, crossSpend };
}
