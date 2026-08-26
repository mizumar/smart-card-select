# アーキテクチャ・ルーティング仕様

#### ディレクトリ構成

- src/app: ルーティング・ページ・グローバルレイアウト・SEO metadata
- src/components: UI コンポーネント（カード表示・診断・比較）
- src/content/articles: コラム用 Markdown ファイル
- src/content/cards: カード詳細記事用 Markdown ファイル（新規追加）
- src/data: カード・記事の静的マスターデータと型定義
- src/store: Zustand による比較選択状態のグローバル管理
- src/lib: 共通ユーティリティ（カードMD取得ロジック等）
- public: 画像・SVG 等の静的ファイル

#### ルーティング

- / (Client Component): カード比較メイン画面
- /cards/[id] (Server Component): カード詳細・専門解説ページ（新規追加）
- /articles (Server Component): コラム一覧（公開日最新順）
- /articles/[id] (Server Component): コラム詳細
- /privacy (Server Component): プライバシーポリシー

## 状態管理 (State Management)

- **グローバル (Zustand: `useCompareStore`)**: `selectedIds` (比較対象カードID配列)、`toggleCard`、`clearAll`
- **ローカル (`page.tsx`)**: `selectedFilter`、`sortOption`、`isDiagnosisOpen`、`showTooltip`

---

### カード詳細ページ仕様（/cards/[id]）

#### データ管理 & フォールバック

- 基本スペック（JSON: `cards-basic.json` 等）と詳細記事（Markdown: `src/content/cards/[id].md`）の二層構成。
- `.md` ファイルが存在しない ID の場合でも、JSON データを元に基本スペックのみでフォールバック表示。

#### SEO・構造化データ

- `generateMetadata` により Frontmatter（優先）または JSON データから `title`, `description`, `og:image` を動的生成。
- `Product` スキーマの JSON-LD 構造化データを自動埋め込み。

---

### テスト仕様マトリクス（追加分）

| ID        | 種別 | 対象                       | 内容                                                                   |
| --------- | ---- | -------------------------- | ---------------------------------------------------------------------- |
| **UT-06** | Jest | /cards/[id]                | 券面表示/フォールバック描画、.md 不在時フォールバック、1x1ピクセル計測 |
| **UT-07** | Jest | generateMetadata / JSON-LD | Frontmatter タイトル優先適用、Product スキーマ出力検証                 |
