# スマートクレカ比較（smart-card-select）

ライフスタイルに合わせてクレジットカードを診断・比較できる、モバイルファーストの Web アプリです。

**本番 URL:** https://smart-card-select.vercel.app/

## 主な機能

- カード一覧（掲載 11 枚）: タグ絞り込み、キーワード検索、ソート（人気順／還元率順／年会費順）
- 10 秒診断: 3 つの質問に答えると、タグのマッチ度でおすすめを最大 2 枚提示
- 2 枚比較: スペックの並列比較に加え、年間メリットと損益分岐のシミュレーション
- お気に入り: 端末内に保存（Zustand persist）
- カード詳細: スペック、徹底考察（Markdown）、関連カードとおすすめ記事への内部リンク
- コラム／特集: クレカ選びの記事（`/articles`）と特集ページ（`/feature`）

## 技術スタック

- Next.js 16（App Router）/ React 19 / TypeScript
- Tailwind CSS v4 / shadcn/ui / lucide-react
- 状態管理: Zustand（比較・お気に入り）
- テスト: Jest（単体）＋ Playwright（E2E）、PR で CI が実行される

## 開発

必要環境: Node.js 20 以上

```bash
npm install
npm run dev        # 開発サーバー（http://localhost:3000）
npm test           # 単体テスト（Jest）
npx playwright test # E2E テスト
npm run build      # 本番ビルド
```

## データの持ち方

- カード: `src/data/` の JSON 3 つ（`cards-basic.json` / `cards-spec.json` / `cards-affiliate.json`）を `cards.ts` で結合
- 記事: `src/content/articles/*.md`（Markdown ＋ frontmatter）。関連カード・関連記事は frontmatter の `relatedCards` / `relatedArticles` で指定する

## デプロイ

Vercel。main へのプッシュで本番へ自動デプロイされる。

## ライセンス

Private
