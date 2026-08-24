# スタイル・デザイン・SEO仕様

## デザイン方針

- **レイアウト**: モバイルファースト、`max-w-md` 中央寄せ。
- **フォント**: Noto Sans JP (`next/font/google` 経由)。
- **Tailwind**: v4（`globals.css` にて `@import` 及びインラインテーマ設定）。
- **shadcn/ui**: base-nova スタイル、neutral カラー。

## SEO・インデックス仕様

- **サイト全体**: `index`, `follow`（検索エンジン公開）。
- `src/app/layout.tsx` の metadata で制御。

## 共通レイアウト・フッター

- **配置**: `src/app/layout.tsx` に配置し、全ページで共通表示（`/`, `/articles`, `/privacy` 等）。
- **PR表記・透明性**:
  - アフィリエイト収益を得ている旨を明記。
  - 「10秒診断」は回答に基づき独自のスコアリングプログラムで機械的に適合度を算出している旨を記載。
- **導線・リンク**: プライバシーポリシー（`/privacy`）、コラム一覧（`/articles`）へのリンクを配置。
