# 2枚比較機能 (CompareBottomSheet)

## 選択制御ロジック

- `useCompareStore` による最大2枚の上限管理[cite: 5]。
- 3枚目選択時は Store 側で拒否し、UI（`CardItem`）側では `disabled` 制御を実施[cite: 5]。

## ボトムシートレイアウト仕様

- **コンテナ**: `fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40`[cite: 5]。
- **タップ透過制御**: 最外枠に `pointer-events-none` を付与し、ボタン類にのみ `pointer-events-auto` を適用することで、隙間の背景操作を阻害しない[cite: 5]。
- **バッジ表示**: ボトムバーの上部に選択カードを縦スタック表示。カード名は `max-w-[140px] truncate` でレイアウト崩れを防止[cite: 5]。

## 比較モーダル (詳細表示)

- `maxReturnRate` 等の数値を比較し、優位なカードに「おすすめ！」バッジ（Trophyアイコン）と `CheckCircle2` を表示[cite: 5]。
- 実画像 (`imageUrl`) 表示時は `aspect-[1.58/1]`・`object-contain`・`w-36` を適用し、縦スペースをフレックススペーサー (`flex-1`) で均一化[cite: 5]。
