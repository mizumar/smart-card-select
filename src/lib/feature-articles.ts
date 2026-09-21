export interface FeatureArticle {
  id: string;
  title: string;
  description: string;
  href: string;
  date?: string;
}

export const featureArticlesData: FeatureArticle[] = [
  {
    id: "rakuten-cards",
    title: "楽天カードと楽天プレミアムカード、どっちを選ぶ？",
    description: "年会費と利用額から違いを考える",
    href: "/feature/rakuten-cards",
  },
  {
    id: "credit-card-money-date-300",
    title: "「お金が減る日」と「お金を使う日」は違う",
    description: "Threadsの投稿に300件以上の返信が来て考えたこと",
    href: "/feature/credit-card-money-date-300",
  },
];

export function getAllFeatureArticles(): FeatureArticle[] {
  return featureArticlesData;
}
