import { CreditCard } from "@/data/cards"; // ※パスはプロジェクト構造に合わせて変更してください
/**
 * テスト用モックカード A
 * (楽天カード相当：永年無料 / 楽天ポイント)
 */
export const mockCardA: CreditCard = {
  id: "rakuten-card",
  name: "楽天カード",
  popularityRank: 1,
  tagIds: ["fee-free", "type-high-base", "use-daily", "use-ec"],
  tags: ["年会費永年無料", "ポイント高還元", "楽天市場でお得"],
  badge: "人気No.1",
  brandColor: "#bf0000",
  brands: ["visa", "mastercard", "jcb", "amex"],

  affiliateUrl: "https://example.com/affiliate/rakuten",
  imageUrl: "/images/cards/rakuten.png",
  trackingImageUrl: "https://example.com/track/rakuten.gif",
  aspName: "A8.net",
  isPromoting: true,

  annualFee: "永年無料",
  annualFeeValue: 0,
  baseReturnRate: "1.0%",
  baseReturnRateValue: 1.0,
  maxReturnRate: "3.0%",
  maxReturnRateValue: 3.0,
  pointName: "楽天ポイント",
  features: [
    "楽天市場で常にポイント3倍",
    "街の加盟店でもポイントが貯まる・使える",
    "海外旅行傷害保険が最高2,000万円利用付帯",
  ],
  details: {
    insurance: "海外旅行傷害保険 (最高2,000万円 / 利用付帯)",
    electronicMoney: ["楽天Edy", "Apple Pay", "Google Pay"],
    pros: [
      "ポイント還元率が基本1.0%と高い",
      "楽天グループサービスでの還元率が突出している",
    ],
    cons: [
      "期間限定ポイントは有効期限が短い",
      "ETCカードは会員ランクによって有料になる",
    ],
  },
  calloutNotices: ["※一部ポイント還元対象外の利用があります。"],
};

/**
 * テスト用モックカード B
 * (三井住友カード (NL)相当：条件付き/対象店舗高還元 / Vポイント)
 */
export const mockCardB: CreditCard = {
  id: "smbc-nl",
  name: "三井住友カード（NL）",
  popularityRank: 2,
  tagIds: ["fee-free", "type-special-store", "use-daily"],
  tags: ["ナンバーレス", "対象コンビニ・飲食で最大7%"],
  badge: "還元率重視",
  brandColor: "#004025",
  brands: ["visa", "mastercard"],

  affiliateUrl: "https://example.com/affiliate/smbc-nl",
  imageUrl: "/images/cards/smbc-nl.png",
  trackingImageUrl: "https://example.com/track/smbc-nl.gif",
  aspName: "ValueCommerce",
  isPromoting: true,

  annualFee: "永年無料",
  annualFeeValue: 0,
  baseReturnRate: "0.5%",
  baseReturnRateValue: 0.5,
  maxReturnRate: "7.0%",
  maxReturnRateValue: 7.0,
  pointName: "Vポイント",
  features: [
    "対象のコンビニ・飲食店でタッチ決済で最大7%還元",
    "券面にカード番号がない安心のナンバーレスデザイン",
    "SBI証券でのクレカ積立でVポイントが貯まる",
  ],
  details: {
    insurance: "選べる無料保険 (最高2,000万円 / 利用付帯)",
    electronicMoney: ["iD", "Apple Pay", "Google Pay"],
    pros: [
      "対象店舗でのタッチ決済の還元率が圧倒的",
      "ナンバーレスでセキュリティが高い",
    ],
    cons: [
      "基本還元率が0.5%と標準的",
      "対象店舗以外での日常使いでは旨味が少ない",
    ],
  },
  calloutNotices: ["※タッチ決済で最大7%還元には一定の条件があります。"],
};

/**
 * 条件比較検証用のモックカード一覧（配列）
 */
export const mockCards: CreditCard[] = [
  mockCardA, // ID: "rakuten-card" (永年無料 / 楽天ポイント)
  mockCardB, // ID: "smbc-nl" (永年無料 / Vポイント)
  {
    // ID: "jcb-card-w" (永年無料 / Oki Dokiポイント -> ポイント不一致検証用)
    id: "jcb-card-w",
    name: "JCB CARD W",
    popularityRank: 3,
    tagIds: ["fee-free", "type-high-base", "use-ec"],
    tags: ["39歳以下限定", "ポイント2倍"],
    badge: "WEB限定",
    brandColor: "#003399",
    brands: ["jcb"],
    affiliateUrl: "https://example.com/affiliate/jcb-w",
    imageUrl: "/images/cards/jcb-w.png",
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "10.0%",
    maxReturnRateValue: 10.0,
    pointName: "Oki Dokiポイント",
    features: ["いつでもポイント2倍", "Amazonやスタバで高還元"],
    details: {
      insurance: "海外旅行傷害保険 (最高2,000万円 / 利用付帯)",
      electronicMoney: ["QUICPay", "Apple Pay"],
      pros: ["Amazonでの還元率が高い"],
      cons: ["申込みが39歳以下に限定される"],
    },
  },
  {
    // ID: "gold-card" (有料年会費検証用)
    id: "gold-card",
    name: "プレミアムゴールドカード",
    popularityRank: 10,
    tagIds: ["fee-premium", "type-benefits", "use-travel"],
    tags: ["空港ラウンジ無料", "手厚い保険"],
    badge: "ステータス",
    brandColor: "#d4af37",
    brands: ["visa", "mastercard", "jcb"],
    affiliateUrl: "https://example.com/affiliate/gold",
    imageUrl: "/images/cards/gold.png",
    annualFee: "11,000円（税込）",
    annualFeeValue: 11000,
    baseReturnRate: "1.0%",
    baseReturnRateValue: 1.0,
    maxReturnRate: "5.0%",
    maxReturnRateValue: 5.0,
    pointName: "Vポイント",
    features: [
      "国内主要空港ラウンジが無料",
      "最高5,000万円の旅行傷害保険が自動付帯",
    ],
    details: {
      insurance: "国内・海外旅行傷害保険 (最高5,000万円 / 自動付帯)",
      electronicMoney: ["iD", "Apple Pay"],
      pros: ["付帯保険やラウンジ特典が充実"],
      cons: ["年会費がかかる"],
    },
  },
];
