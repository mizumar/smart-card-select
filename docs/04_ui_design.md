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

## 共通ヘッダー

- **配置**: `src/app/layout.tsx` 内の `<main>` 上部に配置し、全ページで共通表示。
- **デザイン・装飾**: `sticky top-0 z-20` による画面上部固定と `backdrop-blur-md` によるすりガラス効果。各ページ個別ヘッダーは全撤去。
- **動的導線切り替え**: `usePathname` を参照し、現在地に応じたナビゲーションを自動判定。
- **トップ (`/`)**: サイトロゴを表示。
- **コラム詳細 (`/articles/[id]`)**: 「‹ コラム一覧へ」（`/articles`）を表示。
- **その他サブページ (`/articles`, `/privacy`, `/cards/[id]` 等)**: 「‹ トップへ」（`/`）を表示。

- **検証方針**: Jest での `usePathname` モック化による表示分岐検証と、Playwright による実ブラウザ導線・`sticky` 保持・二重表示防止の E2E 検証。
