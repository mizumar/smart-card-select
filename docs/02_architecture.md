# アーキテクチャ・ルーティング仕様

## ディレクトリ構成

- `src/app`: ルーティング・ページ・グローバルレイアウト・SEO metadata[cite: 5]
- `src/components`: UI コンポーネント（カード表示・診断・比較）[cite: 5]
- `src/data`: カード・記事の静的マスターデータと型定義[cite: 5]
- `src/store`: Zustand による比較選択状態のグローバル管理[cite: 5]
- `src/lib`: 共通ユーティリティ[cite: 5]
- `public`: 画像・SVG 等の静的ファイル[cite: 5]

## ルーティング

- `/` (Client Component): カード比較メイン画面[cite: 5]
- `/articles` (Server Component): コラム一覧（公開日最新順）[cite: 5]
- `/articles/[id]` (Server Component): コラム詳細[cite: 5]
- `/privacy` (Server Component): プライバシーポリシー[cite: 5]

## 状態管理 (State Management)

- **グローバル (Zustand: `useCompareStore`)**: `selectedIds` (比較対象カードID配列)、`toggleCard`、`clearAll`[cite: 5]。
- **ローカル (`page.tsx`)**: `selectedFilter`、`sortOption`、`isDiagnosisOpen`、`showTooltip`[cite: 5]。
