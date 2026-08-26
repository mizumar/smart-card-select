# データ構造・型定義

## クレジットカードデータの分割管理

データは役割別に3つのJSONファイルに分割し、`src/data/creditCards.ts` で `id` をキーに結合する[cite: 5]。

- `cards-basic.json`: 基本データ（id, name, tags 等）[cite: 5]
- `cards-affiliate.json`: アフィリエイト用（affiliateUrl, imageUrl 等）[cite: 5]
- `cards-spec.json`: 詳細スペック（annualFee, features 等）[cite: 5]

## 型定義

```typescript
export type CardTagId =
  | "fee-free"
  | "fee-premium"
  | "type-high-base"
  | "type-special-store"
  | "type-benefits"
  | "use-daily"
  | "use-ec"
  | "use-travel";

export interface CreditCard {
  // 1. 基本識別情報
  id: string;
  name: string;
  popularityRank: number;
  tagIds: CardTagId[]; // 診断判定用システムタグID
  tags: string[];
  badge?: string;
  brandColor: string;
  brands?: ("visa" | "mastercard" | "jcb" | "amex")[];

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
  pointName?: string; // 例: "Vポイント"
  features: string[];
  details: {
    insurance: string;
    electronicMoney: string[];
    pros: string[];
    cons: string[];
  };
  calloutNotices?: string[];
}
```
