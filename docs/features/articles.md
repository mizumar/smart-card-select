# コラム記事管理機能

## データ管理

- `src/content/articles/*.md` による Markdown ファイル分離方式で管理[cite: 5]。
- `react-markdown` と `@tailwindcss/typography` を利用して描画[cite: 5]。
- データ取得ロジックは `src/lib/articles.ts` に共通化[cite: 5]。

## ソート仕様

- 記事一覧は `date`（例: "YYYY.MM.DD"）の降順でソートして表示[cite: 5]。

## テスト仕様マトリクス

| ID            | 種別       | 対象               | 内容                                              |
| ------------- | ---------- | ------------------ | ------------------------------------------------- |
| **UT-01〜03** | Jest       | `getAllArticles()` | 全件取得、日付降順ソート、空配列処理[cite: 5]     |
| **UT-04〜05** | Jest       | `getArticleById()` | ID指定取得、存在しないID時の `null` 返却[cite: 5] |
| **IT-01〜04** | Playwright | `/articles`        | 一覧カード描画、日付降順表示、詳細遷移[cite: 5]   |
| **IT-05〜07** | Playwright | `/articles/[id]`   | Markdown要素装飾、404ページ表示[cite: 5]          |
