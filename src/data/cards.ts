import basicData from "./cards-basic.json";
import affiliateData from "./cards-affiliate.json";
import specData from "./cards-spec.json";

export interface CreditCard {
  // 1. 基本識別情報
  id: string;
  name: string;
  popularityRank: number;
  tags: string[];
  badge?: string;
  brandColor: string;

  // 2. ASP・アフィリエイト管理情報
  affiliateUrl: string; // 遷移先アフィリエイトURL
  imageUrl?: string; // バナー画像URL
  trackingImageUrl?: string; // 1x1ピクセルインプレッション計測用URL (例: 0.gif)
  aspName?: string; // ASP名 (例: "A8.net")
  isPromoting?: boolean; // 掲載状態フラグ (true: 掲載中 / false: 停止中)

  // 3. カードスペック情報
  annualFee: string;
  annualFeeValue: number;
  baseReturnRate: string;
  maxReturnRate: string;
  maxReturnRateValue: number;
  features: string[];
  details: {
    insurance: string;
    electronicMoney: string[];
    pros: string[];
    cons: string[];
  };
}

export const cards: CreditCard[] = basicData.map((basic) => {
  const affiliate = affiliateData.find((a) => a.id === basic.id);
  const spec = specData.find((s) => s.id === basic.id);

  return {
    ...basic,
    ...affiliate,
    ...spec,
  } as CreditCard;
});
