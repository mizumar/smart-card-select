# スマートクレカ比較（smart-card-select）

ライフスタイルに合わせてクレジットカードを**診断・比較**できるモバイルファーストの Web アプリです。  
タグフィルター、ソート、10秒診断、最大2枚の並列比較、アフィリエイトリンク遷移を提供します。

**本番 URL:** https://smart-card-select.vercel.app/

---

## 主な機能

| 機能           | 説明                                                   |
| -------------- | ------------------------------------------------------ |
| カード一覧     | `src/data/cards.ts` のマスターデータを一覧表示         |
| タグフィルター | 「年会費無料」「コンビニ高還元」などで絞り込み         |
| ソート         | 人気順 / 最大還元率が高い順 / 年会費が安い順           |
| 10秒診断       | 2問の質問からタグマッチ度でおすすめカードを最大2枚提示 |
| 2枚比較        | 最大2枚を選択し、仕様を並列比較（Zustand で状態管理）  |
| コラム         | クレカ選びの基礎知識記事（`/articles`）                |
| PR表記         | フッターおよび `/privacy` にアフィリエイト開示         |

---

## 技術スタック

- **Framework:** Next.js 16（App Router）
- **UI:** React 19, Tailwind CSS v4, shadcn/ui（base-nova）
- **状態管理:** Zustand（比較選択のみ）
- **アイコン:** lucide-react
- **フォント:** Noto Sans JP（Google Fonts / next/font）
- **言語:** TypeScript

---

## セットアップ

### 必要環境

- Node.js 20 以上推奨
- npm（または yarn / pnpm / bun）

### インストール & 起動

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev
```

### その他コマンド

```bash
npm run build   # 本番ビルド
npm run start   # 本番サーバー起動
npm run lint    # ESLint
```

---

## ディレクトリ構成（概要）

```
src/
├── app/              # ページ・レイアウト（App Router）
│   ├── page.tsx      # トップ（カード一覧・診断・比較）
│   ├── layout.tsx    # ルートレイアウト・metadata・noindex
│   ├── articles/     # コラム一覧・詳細
│   └── privacy/      # プライバシーポリシー
├── components/       # UI コンポーネント
│   ├── CardItem.tsx
│   ├── CompareBottomSheet.tsx
│   ├── DiagnosisModal.tsx
│   └── ui/
├── data/             # 静的マスターデータ
│   ├── cards.ts      # クレジットカード定義
│   └── articles.ts   # コラム記事定義
├── store/            # Zustand ストア
│   └── useCompareStore.ts
└── lib/
    └── utils.ts      # cn() 等ユーティリティ

public/
└── app-logo.png      # ヘッダーロゴ
```

詳細な仕様・型定義・データフローは [`docs/aaa.md`](./docs/aaa.md) を参照してください。

---

## データの編集方法

### カードを追加・更新する

`src/data/cards.ts` の `CreditCard` 型に従い、`cards` 配列を編集します。

```typescript
{
  id: "unique-id",
  name: "カード名",
  brandColor: "from-blue-600 to-indigo-800",  // Tailwind グラデーション
  annualFee: "永年無料",
  annualFeeValue: 0,           // ソート用（0 = 無料）
  maxReturnRate: "7.0%",
  maxReturnRateValue: 7.0,     // ソート用
  popularityRank: 1,             // 人気順（小さいほど上位）
  affiliateUrl: "https://...",   // アフィリエイトリンク
  tags: ["年会費無料", "初心者"],
  // ...
}
```

### コラムを追加する

`src/data/articles.ts` の `ARTICLES` 配列に記事を追加します。  
URL は `/articles/[id]` 形式で自動生成されます。

---

## ルーティング

| パス             | 説明                           |
| ---------------- | ------------------------------ |
| `/`              | カード比較メイン画面           |
| `/articles`      | コラム一覧                     |
| `/articles/[id]` | コラム詳細                     |
| `/privacy`       | プライバシーポリシー・免責事項 |

---

## SEO・インデックス設定

`src/app/layout.tsx` で **noindex / nofollow** を設定しています（検索エンジン非公開想定）。

```typescript
robots: {
  index: false,
  follow: false,
}
```

---

## デプロイ

Vercel へのデプロイを想定しています。

```bash
npm run build
```

ビルド成功後、Vercel にプッシュするか `vercel` CLI でデプロイしてください。

---

## ライセンス

Private（`package.json` の `"private": true`）
