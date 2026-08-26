import { cards as cardsData } from "@/data/cards";
import { CreditCard } from "@/data/cards"; // Cardインターフェースの型定義パス

/**
 * 全カード一覧を取得する
 */
export function getAllCards(): CreditCard[] {
  return cardsData as CreditCard[];
}

/**
 * IDから単一のカードを取得する（詳細ページ用）
 */
export function getCardById(id: string): CreditCard | undefined {
  return cardsData.find((card) => card.id === id);
}
