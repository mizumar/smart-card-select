# プロジェクト概要

クレジットカードの比較・診断・2枚比較を行う Next.js 16 ベースの Web アプリ。
モバイルファースト（最大幅 `max-w-md`）の UI で、タグフィルター・ソート・10秒診断・最大2枚比較・アフィリエイトリンク遷移を提供する[cite: 5]。

## 技術スタック

- **フレームワーク**: next (16.2.11) - App Router, SSR/RSC[cite: 5]
- **UI**: react / react-dom (19.2.4)[cite: 5]
- **状態管理**: zustand (^5.0.14)[cite: 5]
- **スタイリング**: tailwindcss (^4), shadcn (^4.14.1)[cite: 5]
- **アイコン**: lucide-react (^1.26.0)[cite: 5]
- **言語**: typescript (^5)[cite: 5]

## npm スクリプト

- `dev`: 開発サーバー起動（http://localhost:3000）[cite: 5]
- `build`: 本番ビルド[cite: 5]
- `start`: 本番サーバー起動[cite: 5]
- `lint`: ESLint 実行[cite: 5]
