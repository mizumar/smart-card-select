以下が NotebookLM 用の仕様書・構成ドキュメントです。

# スマートクレカ比較（smart-card-select）仕様書・構成ファイル

> **プロジェクト概要**  
> クレジットカードの比較・診断・2枚比較を行う Next.js 16 ベースの Web アプリ。  
> モバイルファースト（最大幅 `max-w-md`）の UI で、タグフィルター・ソート・10秒診断・最大2枚比較・アフィリエイトリンク遷移を提供する。

---

## 1. ディレクトリ・ファイル構成

```

smart-card-select/
├── public/ # 静的アセット
│ ├── app-logo.png # ヘッダーロゴ（/app-logo.png として参照）
│ ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg # テンプレート由来SVG
│
├── src/
│ ├── app/ # Next.js App Router（ページ・レイアウト）
│ │ ├── layout.tsx # ルートレイアウト（フォント・metadata・noindex設定）
│ │ ├── page.tsx # トップページ（カード一覧・フィルター・診断・比較の中枢）
│ │ ├── globals.css # Tailwind CSS v4 + shadcn テーマ変数
│ │ ├── favicon.ico # ファビコン
│ │ ├── apple-icon.png.png # Apple Touch Icon
│ │ ├── privacy/
│ │ │ └── page.tsx # プライバシーポリシー・免責事項・PR表記ページ
│ │ └── articles/
│ │ ├── page.tsx # コラム一覧ページ
│ │ └── [id]/
│ │ └── page.tsx # コラム詳細ページ（動的ルート）
│ │
│ ├── components/ # React コンポーネント
│ │ ├── CardItem.tsx # カード1枚の表示・比較トグル・詳細展開・CTA
│ │ ├── CompareBottomSheet.tsx # 比較選択時の固定バー＋比較モーダル
│ │ ├── DiagnosisModal.tsx # 10秒診断モーダル（質問→おすすめカード表示）
│ │ └── ui/
│ │ └── button.tsx # shadcn/ui ベースの Button コンポーネント（現状メイン画面では未使用）
│ │
│ ├── data/ # 静的データ定義
│ │ ├── cards.ts # クレジットカードマスターデータ + CreditCard 型
│ │ └── articles.ts # コラム記事マスターデータ + Article 型
│ │
│ ├── store/ # グローバル状態管理（Zustand）
│ │ └── useCompareStore.ts # 比較対象カードID（最大2枚）の管理
│ │
│ └── lib/
│ └── utils.ts # cn() ユーティリティ（clsx + tailwind-merge）
│
├── components.json # shadcn/ui 設定（style: base-nova, CSS変数有効）
├── next.config.ts # Next.js 設定（現状デフォルト）
├── postcss.config.mjs # PostCSS（@tailwindcss/postcss プラグイン）
├── tsconfig.json # TypeScript 設定（@/_ → ./src/_ パスエイリアス）
├── package.json # 依存関係定義
├── eslint.config.mjs # ESLint 設定
├── AGENTS.md / CLAUDE.md # Next.js 16 向けエージェント向けルール
└── README.md # 開発サーバー起動手順

```

### 主要ディレクトリの役割

| パス             | 役割                                                     |
| ---------------- | -------------------------------------------------------- |
| `src/app`        | ルーティング・ページ・グローバルレイアウト・SEO metadata |
| `src/components` | UI コンポーネント（カード表示・診断・比較）              |
| `src/data`       | カード・記事の静的マスターデータと型定義                 |
| `src/store`      | Zustand による比較選択状態のグローバル管理               |
| `src/lib`        | 共通ユーティリティ                                       |
| `public`         | 画像・SVG 等の静的ファイル                               |

### ルーティング一覧

| URL              | ファイル                         | 種別             | 説明                 |
| ---------------- | -------------------------------- | ---------------- | -------------------- |
| `/`              | `src/app/page.tsx`               | Client Component | カード比較メイン画面 |
| `/articles`      | `src/app/articles/page.tsx`      | Server Component | コラム一覧           |
| `/articles/[id]` | `src/app/articles/[id]/page.tsx` | Server Component | コラム詳細           |
| `/privacy`       | `src/app/privacy/page.tsx`       | Server Component | プライバシーポリシー |

---

## 2. データ構造・型定義 (Types & Interfaces)

### 2.1 CreditCard（`src/data/cards.ts`）

クレジットカード1枚分のマスターデータ型。

```typescript
export interface CreditCard {
  id: string; // 一意識別子（例: "smbc-nl", "jcb-w"）
  name: string; // カード名（表示用）
  brandColor: string; // Tailwind グラデーションクラス（例: "from-emerald-600 to-teal-800"）
  badge?: string; // 任意。バッジテキスト（例: "👑 コンビニ高還元 No.1"）
  annualFee: string; // 年会費表示文字列（例: "永年無料"）
  annualFeeValue: number; // ソート用数値（0=無料、大きいほど高額）
  baseReturnRate: string; // 基本還元率表示（例: "0.5%"）
  maxReturnRate: string; // 最大還元率表示（例: "7.0%"）
  maxReturnRateValue: number; // ソート用数値（例: 7.0）
  popularityRank: number; // 人気順ソート用（小さいほど人気、未設定時は99扱い）
  features: string[]; // 特徴リスト（3項目程度）
  affiliateUrl: string; // アフィリエイト/公式申込リンクURL
  tags: string[]; // フィルター・診断マッチング用タグ
  details: {
    insurance: string; // 付帯保険の説明
    electronicMoney: string[]; // 対応電子マネー一覧
    pros: string[]; // メリット（データ保持、UI未表示）
    cons: string[]; // デメリット（データ保持、UI未表示）
  };
}
```

**登録カード一覧（5件）**

| id        | name                 | 主な tags                          |
| --------- | -------------------- | ---------------------------------- |
| `smbc-nl` | 三井住友カード（NL） | 年会費無料, コンビニ高還元, 初心者 |
| `jcb-w`   | JCB CARD W           | 年会費無料, 初心者, Amazon・スタバ |
| `rakuten` | 楽天カード           | 年会費無料, 初心者, ポイント還元   |
| `paypay`  | PayPayカード         | 年会費無料, PayPayユーザー         |
| `epos`    | エポスカード         | 年会費無料, 優待特典, 海外旅行保険 |

**フィルター用タグ定数（`page.tsx` の `FILTER_TAGS`）**

```typescript
const FILTER_TAGS = [
  "すべて",
  "年会費無料",
  "コンビニ高還元",
  "初心者",
  "Amazon・スタバ",
  "PayPayユーザー",
];
```

※ `FILTER_TAGS` に存在するが一部カードにのみ付与されるタグ（例: `ポイント還元`, `優待特典`, `海外旅行保険`）は、診断モーダル専用タグとして使用される。

---

### 2.2 Article（`src/data/articles.ts`）

コラム記事の型定義。

```typescript
export interface Article {
  id: string; // URL スラッグ（例: "how-to-choose"）
  title: string; // 記事タイトル
  date: string; // 公開日表示（例: "2026.08.01"）
  category: string; // カテゴリ（例: "基礎知識"）
  summary: string; // 一覧用要約
  content: string[]; // 本文段落の配列
}
```

記事は5件（`how-to-choose`, `point-return-rate`, `annual-fee-free`, `touch-payment-guide`, `first-card-recommend`）。

---

### 2.3 CompareState（`src/store/useCompareStore.ts`）

Zustand ストアの型。

```typescript
interface CompareState {
  selectedIds: string[]; // 比較選択中のカード id 配列（最大2件）
  toggleCard: (id: string) => void; // 選択/解除トグル
  clearAll: () => void; // 全選択解除
}
```

---

### 2.4 コンポーネント Props 型

```typescript
// CardItem.tsx
interface CardItemProps {
  card: CreditCard;
}

// CompareBottomSheet.tsx
interface CompareBottomSheetProps {
  cards: CreditCard[]; // 全カード配列（selectedIds から実体を解決するため）
}

// DiagnosisModal.tsx
interface DiagnosisModalProps {
  cards: CreditCard[];
  isOpen: boolean;
  onClose: () => void;
}

// page.tsx（ローカル型）
type SortOption = "popular" | "rate" | "fee";
```

---

### 2.5 診断質問データ（`DiagnosisModal.tsx` 内定数）

```typescript
const QUESTIONS = [
  {
    id: "useCase",
    title: "1. 主にどこで買い物や利用をしますか？",
    options: [
      { label: "コンビニ・飲食店", tag: "コンビニ高還元" },
      { label: "Amazon・スタバ", tag: "Amazon・スタバ" },
      { label: "PayPay・Yahoo!", tag: "PayPayユーザー" },
      { label: "どこでも（ポイント還元重視）", tag: "ポイント還元" },
    ],
  },
  {
    id: "priority",
    title: "2. クレジットカードに一番求めるものは？",
    options: [
      { label: "年会費がずっと無料", tag: "年会費無料" },
      { label: "初めてでも安心・人気", tag: "初心者" },
      { label: "お店やカラオケでの優待割引", tag: "優待特典" },
      { label: "海外旅行保険の充実", tag: "海外旅行保険" },
    ],
  },
];
```

---

## 3. 主要な状態管理 (State Management)

### 3.1 グローバル状態（Zustand: `useCompareStore`）

| 状態 / アクション | 型         | 保持目的                                                |
| ----------------- | ---------- | ------------------------------------------------------- |
| `selectedIds`     | `string[]` | 比較対象として選択されたカード id（最大2件）            |
| `toggleCard(id)`  | 関数       | id の選択追加 / 選択解除。2件選択済み時は新規追加を無視 |
| `clearAll()`      | 関数       | 比較選択を全解除                                        |

**利用コンポーネント:** `CardItem.tsx`, `CompareBottomSheet.tsx`

---

### 3.2 ローカル状態（`src/app/page.tsx`）

| 状態名            | 型           | 初期値      | 保持目的                               |
| ----------------- | ------------ | ----------- | -------------------------------------- |
| `selectedFilter`  | `string`     | `"すべて"`  | フィルターチップで選択中のタグ         |
| `sortOption`      | `SortOption` | `"popular"` | ソート基準（人気順 / 還元率 / 年会費） |
| `isDiagnosisOpen` | `boolean`    | `false`     | 10秒診断モーダルの開閉                 |

---

### 3.3 ローカル状態（`CardItem.tsx`）

| 状態名   | 型        | 初期値  | 保持目的                                                      |
| -------- | --------- | ------- | ------------------------------------------------------------- |
| `isOpen` | `boolean` | `false` | 詳細スペック（基本還元率・保険・電子マネー）の展開/折りたたみ |

**派生値（計算）:**

| 変数名         | 算出ロジック                             | 用途                             |
| -------------- | ---------------------------------------- | -------------------------------- |
| `isCompared`   | `selectedIds.includes(card.id)`          | 比較ボタンの「比較中」表示       |
| `isMaxReached` | `selectedIds.length >= 2 && !isCompared` | 3枚目選択不可時のボタン disabled |

---

### 3.4 ローカル状態（`DiagnosisModal.tsx`）

| 状態名         | 型         | 初期値  | 保持目的                       |
| -------------- | ---------- | ------- | ------------------------------ |
| `currentStep`  | `number`   | `0`     | 現在の質問インデックス（0〜1） |
| `selectedTags` | `string[]` | `[]`    | 各質問で選んだ tag の累積      |
| `isFinished`   | `boolean`  | `false` | 診断完了（結果画面表示）フラグ |

---

### 3.5 ローカル状態（`CompareBottomSheet.tsx`）

| 状態名   | 型        | 初期値  | 保持目的                               |
| -------- | --------- | ------- | -------------------------------------- |
| `isOpen` | `boolean` | `false` | 比較詳細モーダル（ボトムシート）の開閉 |

**派生値:**

| 変数名          | 算出ロジック                                    | 用途                 |
| --------------- | ----------------------------------------------- | -------------------- |
| `selectedCards` | `cards.filter(c => selectedIds.includes(c.id))` | 選択カード実体の取得 |

---

## 4. 処理・データの流れ (Data Flow & Logic)

### ① 初期ロード・カード一覧の描画フロー

```
1. ブラウザが `/` にアクセス
   ↓
2. Next.js App Router が `src/app/layout.tsx` を適用
   - Noto Sans JP フォント読み込み（next/font/google）
   - metadata 設定（title, description, robots: noindex/nofollow）
   - globals.css 適用
   ↓
3. `src/app/page.tsx`（"use client"）がマウント
   ↓
4. `@/data/cards` から `cards` 配列を静的 import
   ↓
5. 初期 state 設定
   - selectedFilter = "すべて"
   - sortOption = "popular"
   - isDiagnosisOpen = false
   ↓
6. フィルター処理
   filteredCards = cards.filter(card =>
     selectedFilter === "すべて" || card.tags.includes(selectedFilter)
   )
   ↓
7. ソート処理（filteredCards のコピーを sort）
   - "rate"  → maxReturnRateValue 降順
   - "fee"   → annualFeeValue 昇順
   - "popular"（デフォルト）→ popularityRank 昇順
   ↓
8. sortedCards.map(card => <CardItem key={card.id} card={card} />)
   ↓
9. 各 CardItem が card プロパティを受け取り、券面・スペック・CTA を描画
   ↓
10. 並行して以下をマウント
    - <CompareBottomSheet cards={cards} />  … selectedIds が空なら null（非表示）
    - <DiagnosisModal isOpen={false} ... />  … isOpen=false なら null
```

---

### ② フィルター / 診断ロジックによるカード絞り込みフロー

#### A. フィルターチップ（一覧画面）

```
1. ユーザーがフィルターチップ（FILTER_TAGS）をクリック
   ↓
2. setSelectedFilter(tag) が実行
   ↓
3. React 再レンダリング
   ↓
4. filteredCards 再計算
   - "すべて" → 全 cards を通過
   - それ以外 → card.tags.includes(selectedFilter) で絞り込み
   ↓
5. sortedCards 再計算（現在の sortOption を維持）
   ↓
6. 一覧更新。0件の場合は「該当するカードが見つかりませんでした。」表示
```

**例:** `selectedFilter = "コンビニ高還元"` → 三井住友カード（NL）のみ表示

#### B. ソート（並び替え）

```
1. <select> で sortOption 変更（"popular" | "rate" | "fee"）
   ↓
2. setSortOption(value)
   ↓
3. filteredCards を sortOption に応じてソート → sortedCards 更新
```

#### C. 10秒診断モーダル（DiagnosisModal）

```
1. 「10秒でぴったりカードを診断！」ボタンクリック
   → setIsDiagnosisOpen(true)
   ↓
2. DiagnosisModal が表示（isOpen=true）
   内部 state: currentStep=0, selectedTags=[], isFinished=false
   ↓
3. 質問1（useCase）の選択肢クリック
   → handleSelectOption(tag)
   → selectedTags に tag を追加
   → currentStep < QUESTIONS.length-1 なら currentStep++
   ↓
4. 質問2（priority）の選択肢クリック
   → selectedTags に2つ目の tag を追加
   → currentStep が最終なので setIsFinished(true)
   ↓
5. 結果計算 getRecommendedCards()
   cards.map(card => {
     matchCount = card.tags.filter(tag => selectedTags.includes(tag)).length
   })
   .sort((a,b) => b.matchCount - a.matchCount)  // マッチ数降順
   .slice(0, 2)                                   // 上位2件
   ↓
6. 結果画面に recommendedCards を表示（最大2枚）
   各カードに「公式へ」CTA（affiliateUrl リンク）
   ↓
7. 「もう一度やり直す」→ handleReset() で state 初期化
   「×」または onClose → モーダル閉じ（page.tsx の isDiagnosisOpen=false）
```

**診断ロジックの要点:**

- タグ一致数（`matchCount`）が多いカードを優先
- 同点の場合は `cards` 配列の元順序が維持される（安定ソートではないが JS sort の特性上、同 matchCount なら順序不定）
- 診断結果は一覧のフィルター状態には影響しない（独立したモーダル内処理）

---

### ③ 比較機能（最大2枚選択・モーダル表示）の ON/OFF ロジックと上限制御フロー

```
【選択フェーズ】

1. CardItem の「比較」ボタンクリック
   → toggleCard(card.id) 呼び出し（Zustand）
   ↓
2. toggleCard 内部ロジック（useCompareStore.ts）
   a) id が既に selectedIds に含まれる
      → 解除: selectedIds から id を filter で除外
   b) id が未選択 かつ selectedIds.length >= 2
      → 何もしない（return state）※ 3枚目は追加不可
   c) id が未選択 かつ selectedIds.length < 2
      → 追加: [...selectedIds, id]
   ↓
3. CardItem 再レンダリング
   - isCompared=true  → ボタン表示「比較中」（青ハイライト）
   - isMaxReached=true → 未選択カードのボタン disabled、「上限(2枚)」表示
   ↓
4. CompareBottomSheet
   - selectedCards.length === 0 → return null（非表示）
   - selectedCards.length >= 1 → 画面下部固定バー表示
     「N枚 選択中 (あと1枚)」※ 1枚時のみ "(あと1枚)" 表示
   ↓
5. selectedCards.length === 2 のとき
   → 固定バーに「比較する」ボタン表示

【比較モーダル表示フェーズ】

6. 「比較する」ボタンクリック
   → CompareBottomSheet 内 setIsOpen(true)
   ↓
7. ボトムシート形式の比較モーダル表示
   - 2列グリッドで selectedCards を並列表示
   - 各カード: 年会費 / 最大還元率 / 基本還元率 / 「公式サイトへ」CTA
   ↓
8. モーダル「×」クリック → setIsOpen(false)（選択状態は維持）
   固定バー「×」クリック → clearAll()（全選択解除、固定バー消滅）

【解除パス】
- 比較中カードの「比較中」ボタン再クリック → toggleCard で解除
- 固定バーの clearAll → 全解除
```

**上限制御の二重防御:**

1. **Store 層:** `toggleCard` で `length >= 2` 時の追加を拒否
2. **UI 層:** `CardItem` で `isMaxReached` によりボタン `disabled`

---

### ④ CTAボタンからのアフィリエイトリンク（`affiliateUrl`）遷移フロー

アフィリエイトリンクは **3箇所** に配置されている。

#### A. CardItem（メイン一覧）

```
1. ユーザーが「発行公式サイトを見る」ボタン（<a> タグ）をクリック
   ↓
2. href={card.affiliateUrl} へ遷移
   target="_blank"        → 新規タブで開く
   rel="noopener noreferrer" → セキュリティ対策
   ↓
3. 外部サイト（例: https://example.com/smbc）へ遷移
```

#### B. DiagnosisModal（診断結果）

```
1. 診断完了後、結果カードの「公式へ」ボタンクリック
   ↓
2. href={card.affiliateUrl}（同上、新規タブ）
```

#### C. CompareBottomSheet（比較モーダル）

```
1. 2枚比較モーダル内の「公式サイトへ」リンククリック
   ↓
2. href={card.affiliateUrl}（同上、新規タブ）
```

**affiliateUrl のデータ例（cards.ts）:**

| カード               | affiliateUrl                  |
| -------------------- | ----------------------------- |
| 三井住友カード（NL） | `https://example.com/smbc`    |
| JCB CARD W           | `https://example.com/jcb`     |
| 楽天カード           | `https://example.com/rakuten` |
| PayPayカード         | `https://example.com/paypay`  |
| エポスカード         | `https://example.com/epos`    |

※ 現状はプレースホルダー URL。本番では各アフィリエイトプログラムのトラッキング URL に差し替える想定。

**PR表記との関係:**

- フッターに「【PR/広告開示】」文言
- `/privacy` ページにアフィリエイトプログラム参加の詳細記載
- 比較・診断結果は広告主の影響を受けない旨を明記

---

## 5. スタイル・デザイン・インデックス仕様

### 5.1 フォント

| 項目           | 設定                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| メインフォント | **Noto Sans JP**（Google Fonts、`next/font/google`）                                                            |
| ウェイト       | 400, 500, 700, 800                                                                                              |
| CSS 変数       | `--font-noto-sans-jp`                                                                                           |
| 適用箇所       | `layout.tsx` で `html` に variable 付与、`globals.css` で `body { font-family: var(--font-noto-sans-jp), ... }` |
| フォールバック | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`                    |
| 文字滑らかさ   | `antialiased`（layout body）、`-webkit-font-smoothing: antialiased`（globals.css）                              |

---

### 5.2 Tailwind CSS 設定

| 項目           | 内容                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- |
| バージョン     | Tailwind CSS **v4**                                                                      |
| 設定方式       | `tailwind.config.js` なし。`globals.css` 内 `@import "tailwindcss"` + `@theme inline`    |
| PostCSS        | `@tailwindcss/postcss` プラグイン（`postcss.config.mjs`）                                |
| 追加 CSS       | `tw-animate-css`（アニメーション）、`shadcn/tailwind.css`                                |
| shadcn/ui      | `components.json` — style: **base-nova**, baseColor: **neutral**, cssVariables: **true** |
| カラーシステム | OKLCH ベースの CSS 変数（`:root` / `.dark`）                                             |
| ダークモード   | `.dark` クラス用変数定義あり（現状 UI では未トグル）                                     |
| パスエイリアス | `@/*` → `./src/*`（tsconfig.json）                                                       |

**主要デザイントークン（`:root`）:**

- `--radius: 0.625rem`（角丸基準）
- `--background`, `--foreground`, `--primary`, `--border` 等 shadcn 標準変数

---

### 5.3 レイアウト・UI デザイン方針

| 項目         | 仕様                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| レイアウト幅 | モバイルファースト、`max-w-md`（約448px）中央寄せ                            |
| 背景色       | `bg-gray-50` / `bg-slate-50/80`                                              |
| ヘッダー     | `sticky top-0 z-20`、半透明白 + `backdrop-blur-md`                           |
| カード UI    | 白背景、`rounded-[24px]`、ソフトシャドウ                                     |
| 券面表現     | Tailwind グラデーション（`brandColor`）+ 疑似チップ                          |
| CTA ボタン   | ダーク（`bg-slate-900`）/ ブルー（比較・診断結果）                           |
| 診断バナー   | オレンジ〜レッドグラデーション（`from-amber-500 via-orange-500 to-red-500`） |
| アイコン     | `lucide-react`                                                               |
| z-index      | ヘッダー z-20、比較固定バー z-40、モーダル z-50                              |

---

### 5.4 SEO・インデックス（noindex）仕様

**ルートレイアウト（`src/app/layout.tsx`）:**

```typescript
export const metadata: Metadata = {
  title: "スマートクレカ比較 | 10秒で自分に最適な1枚が見つかる",
  description:
    "ライフスタイルに合わせて最適なクレジットカードを瞬時に診断・比較。",
  robots: {
    index: false, // 検索エンジンにインデックスさせない（noindex）
    follow: false, // リンクをたどらせない（nofollow）
  },
};
```

| ページ             | metadata robots                      | 備考                 |
| ------------------ | ------------------------------------ | -------------------- |
| `/`（layout 継承） | `index: false, follow: false`        | 全ページに適用       |
| `/articles`        | layout 継承                          | 個別 robots 設定なし |
| `/articles/[id]`   | layout 継承 + 動的 title/description | 個別 robots 設定なし |
| `/privacy`         | layout 継承 + 個別 title/description | 個別 robots 設定なし |

→ **サイト全体が noindex / nofollow**（検索エンジン非公開想定）

---

### 5.5 ヘッダー仕様（トップページ）

| 要素       | 内容                                |
| ---------- | ----------------------------------- |
| ロゴ       | `/app-logo.png`（7×7、角丸）        |
| アプリ名   | 「スマートクレカ比較」              |
| サブコピー | 「10秒で自分に最適な1枚が見つかる」 |
| バッジ     | 「2026年最新」（右側）              |
| 挙動       | sticky 固定、スクロール時も表示     |

---

### 5.6 フッター PR 表記・免責

**トップページフッター（`page.tsx`）:**

- 導線リンク: 「📖 コラム一覧」（`/articles`）、「🔒 プライバシーポリシー」（`/privacy`）
- **【PR/広告開示】** 見出し
- 本文: 「本サイトはアフィリエイトプログラムによる収益を得ています。掲載されている提携先のオファーによる報酬を受ける場合がありますが、比較・診断結果に影響を与えることはありません。」
- コピーライト: `© 2026 スマートクレカ比較 All Rights Reserved.`

**プライバシーページ（`/privacy`）追加記載:**

1. 広告配信（PR表記）— もしもアフィリエイト、A8.net、バリューコマース等への参加
2. 免責事項 — 還元率等の変動、外部リンク先の責任否認
3. アクセス解析・Cookie — 匿名データ収集の可能性
4. 運営者情報 — サイトURL: `https://smart-card-select.vercel.app/`
5. 制定日: 2026年8月11日

---

## 6. 技術スタック・依存関係

| カテゴリ        | ライブラリ                                     | バージョン | 用途                   |
| --------------- | ---------------------------------------------- | ---------- | ---------------------- |
| フレームワーク  | next                                           | 16.2.11    | App Router, SSR/RSC    |
| UI              | react / react-dom                              | 19.2.4     | コンポーネント         |
| 状態管理        | zustand                                        | ^5.0.14    | 比較選択 store         |
| スタイリング    | tailwindcss                                    | ^4         | ユーティリティ CSS     |
| UI キット       | shadcn                                         | ^4.14.1    | Button 等（base-nova） |
| UI プリミティブ | @base-ui/react                                 | ^1.6.0     | Button ベース          |
| アイコン        | lucide-react                                   | ^1.26.0    | SVG アイコン           |
| ユーティリティ  | clsx, tailwind-merge, class-variance-authority | —          | cn(), バリアント管理   |
| 言語            | typescript                                     | ^5         | 型安全                 |

---

## 7. npm スクリプト

```json
{
  "dev": "next dev", // 開発サーバー（http://localhost:3000）
  "build": "next build", // 本番ビルド
  "start": "next start", // 本番サーバー起動
  "lint": "eslint" // リント
}
```

---

## 8. コンポーネント依存関係図

```
layout.tsx (Server)
└── page.tsx (Client) ─────────────────────────────────────┐
    ├── import cards from @/data/cards                      │
    ├── CardItem × N                                        │
    │   └── useCompareStore (toggleCard, selectedIds)       │
    ├── CompareBottomSheet                                  │
    │   └── useCompareStore (selectedIds, toggleCard, clearAll)
    ├── DiagnosisModal                                      │
    │   └── 内部 state (currentStep, selectedTags, isFinished)
    ├── フィルター state (selectedFilter)                   │
    └── ソート state (sortOption)                           │
                                                            │
articles/page.tsx (Server) ← ARTICLES from @/data/articles  │
articles/[id]/page.tsx (Server) ← ARTICLES                  │
privacy/page.tsx (Server)                                   │
```

---

## 9. 補足・制約事項

1. **比較上限:** 常に最大2枚。Store と UI の両方で制御。
2. **診断と一覧フィルターは独立:** 診断結果はモーダル内のみ。一覧の `selectedFilter` は変更しない。
3. **pros / cons:** `CreditCard.details` に保持されるが、現行 UI では未表示。
4. **Button コンポーネント:** shadcn/ui として存在するが、メイン画面ではネイティブ `<button>` / `<a>` を直接使用。
5. **affiliateUrl:** 現状すべて `https://example.com/*` のプレースホルダー。
6. **デプロイ先:** Vercel（privacy ページに URL 記載: `https://smart-card-select.vercel.app/`）。
7. **Client / Server 境界:** メイン機能は `"use client"`。articles / privacy は Server Component。

```

```
