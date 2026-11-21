import type { CreditCard } from "@/data/cards";

export function getActiveCalloutNotices(card: CreditCard): string[] {
  if (!card) return [];

  // 1. 画面上に表示されているテキスト要素を結合
  const targetTexts = [
    card.maxReturnRate,
    card.annualFee,
    card.baseReturnRate,
    card.badge,
    ...(card.details?.pros || []),
    ...(card.details?.cons || []),
  ]
    .filter(Boolean)
    .join(" ");

  // 2. テキスト内から 「※1」「※2」「*1」 等の記号パターンを抽出
  const matchedKeys = Array.from(
    new Set(targetTexts.match(/(※\d+|[※*＊]\d*)/g) || []),
  );

  const noticesObj = card.calloutNotices;
  if (!noticesObj) return [];

  // 3. オブジェクト構造の場合 ({ "※1": "説明...", ... })
  if (typeof noticesObj === "object" && !Array.isArray(noticesObj)) {
    const activeEntries = Object.entries(noticesObj).filter(([key]) =>
      matchedKeys.some((mKey) => key.includes(mKey) || mKey.includes(key)),
    );

    // 記号が見つからなかった場合のフォールバック（全件出力）
    if (activeEntries.length === 0 && matchedKeys.length === 0) {
      return Object.entries(noticesObj).map(([k, v]) => `${k} ${v}`);
    }

    return activeEntries.map(([key, value]) => `${key} ${value}`);
  }

  // 4. 配列構造の場合 (["※1 説明...", ...])
  if (Array.isArray(noticesObj)) {
    if (matchedKeys.length === 0) return noticesObj;

    return noticesObj.filter((notice) =>
      matchedKeys.some((mKey) => notice.includes(mKey)),
    );
  }

  return [];
}
