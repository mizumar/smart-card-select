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
];

export function getAllFeatureArticles(): FeatureArticle[] {
  return featureArticlesData;
}
