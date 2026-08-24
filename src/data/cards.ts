import basicData from "./cards-basic.json";
import affiliateData from "./cards-affiliate.json";
import specData from "./cards-spec.json";

// システム判定用の統一タグID
export type CardTagId =
  // 【費用】
  | "fee-free" // 年会費無料（永年・条件付き）
  | "fee-premium" // 年会費有料（特典重視）
  // 【特徴・メリット】
  | "type-high-base" // 基本還元率高め（1.0%以上）
  | "type-special-store" // 特定店舗特化（特定の場所で高還元）
  | "type-benefits" // 付帯サービス充実（保険・ラウンジ等）
  // 【利用シーン】
  | "use-daily" // 日常使い（スーパー・コンビニ等）
  | "use-ec" // EC・ネットショッピング
  | "use-travel"; // 交通・旅行・マイル

export interface CreditCard {
  // 1. 基本識別情報
  id: string;
  name: string;
  popularityRank: number;
  tagIds: CardTagId[]; // 診断判定用システムタグID
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
  baseReturnRateValue: number;
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
