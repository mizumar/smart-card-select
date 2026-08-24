# 10秒診断機能 (DiagnosisModal)

## スコアリングロジック

従来のタグ一致数判定から、質問別配点タグ自動加点スコアリング（`Set`/`reduce`活用）へ移行。

1. 各カードの `tagIds` を高速参照用に `Set` 構造へ変換。
2. ユーザーの選択回答に基づき、各質問の獲得スコアを算出して集計（`reduce`）。
3. 合計スコア (`totalScore`) の降順でカード配列をソートして返却（上位最大2枚）。

## 質問データ構造 (`src/data/diagnosisQuestions.json`)

```json
[
  {
    "id": "priority",
    "title": "カードを選ぶ際に最も重視するポイントは？",
    "options": [
      {
        "id": "base-return",
        "label": "普段の買い物での還元率（どこでもお得）",
        "targetTags": { "type-high-base": 30, "use-daily": 10 }
      }
    ]
  }
]
```

## テスト仕様 (`src/utils/__tests__/diagnosis.test.ts`)

- **TC-01**: 基本的なスコアリングと降順ソート
- **TC-02**: 該当タグを持たないカードがスコア0点で末尾にソートされること
- **TC-03**: 一部質問が未回答時の正常計算
- **TC-04**: `card.tagIds` が未定義時の安全な処理
- **TC-05**: 空データ時のフォールバック処理
