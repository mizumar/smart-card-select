# スタイル・デザイン・SEO仕様

## デザイン方針

- **レイアウト**: モバイルファースト、`max-w-md` 中央寄せ[cite: 5]。
- **フォント**: Noto Sans JP (`next/font/google` 経由)[cite: 5]。
- **Tailwind**: v4（`globals.css` にて `@import` 及びインラインテーマ設定）[cite: 5]。
- **shadcn/ui**: base-nova スタイル、neutral カラー[cite: 5]。

## SEO・インデックス仕様

- **サイト全体**: `index`, `follow`（検索エンジン公開）[cite: 5]。
- `src/app/layout.tsx` の metadata で制御[cite: 5]。

## フッター・PR表記

- アフィリエイトプログラムによる収益を得ている旨を明記[cite: 5]。
- プライバシーポリシー（`/privacy`）へのリンクを配置[cite: 5]。
