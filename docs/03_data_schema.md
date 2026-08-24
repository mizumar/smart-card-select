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
  id: string; // 一意識別子[cite: 5]
  name: string; // カード名[cite: 5]
  brandColor: string; // Tailwind グラデーションクラス[cite: 5]
  affiliateUrl: string; // アフィリエイトリンク[cite: 5]
  imageUrl?: string; // ASP提供バナー画像[cite: 5]
  tags: string[]; // UI表示用ラベル[cite: 5]
  tagIds?: CardTagId[]; // 診断判定用システムタグID
  annualFeeValue: number; // ソート用数値[cite: 5]
  maxReturnRateValue: number; // ソート用数値[cite: 5]
  baseReturnRateValue: number; // ソート用数値[cite: 5]
  popularityRank: number; // 人気順ソート用[cite: 5]
  // ...その他（features, details 等）
}
```
