export interface CreditCard {
  id: string;
  name: string;
  brandColor: string;
  badge?: string; // ★ 施策1: 「人気No.1」「コンビニ還元率1位」などのバッジテキスト
  imageUrl?: string; // ★ 追加: ASPまたは公式サイトのカード画像URL（未指定時はモック表示）
  annualFee: string;
  annualFeeValue: number; // ★ 施策2: ソート用 (0: 実質無料/永年無料, 数字が大きいほど高額)
  baseReturnRate: string;
  maxReturnRate: string;
  maxReturnRateValue: number; // ★ 施策2: ソート用 (例: 7.0)
  popularityRank: number; // ★ 施策2: ソート用 (人気順の数値)
  features: string[];
  affiliateUrl: string;
  tags: string[];
  details: {
    insurance: string;
    electronicMoney: string[];
    pros: string[];
    cons: string[];
  };
}

export const cards: CreditCard[] = [
  {
    id: "smbc-nl",
    name: "三井住友カード（NL）",
    brandColor: "from-emerald-600 to-teal-800",
    badge: "👑 コンビニ高還元 No.1",
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "0.5%",
    maxReturnRate: "7.0%",
    maxReturnRateValue: 7.0,
    popularityRank: 9,
    features: [
      "対象のコンビニ・飲食店で最大7%還元",
      "ナンバーレスでセキュリティも安心",
      "最短10秒で即時発行",
    ],
    affiliateUrl: "https://example.com/smbc",
    tags: ["年会費無料", "コンビニ高還元", "初心者"],
    details: {
      insurance: "最高2,000万円の海外旅行傷害保険",
      electronicMoney: ["Visaのタッチ決済", "Mastercard®タッチ決済", "iD"],
      pros: ["対象店舗でのポイント還元率が抜群", "年会費が完全無料"],
      cons: ["基本還元率は0.5%と標準的"],
    },
  },
  {
    id: "jcb-w",
    name: "JCB CARD W",
    brandColor: "from-blue-700 to-indigo-900",
    badge: "🔥 基本還元率 2倍",
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    maxReturnRate: "5.5%",
    maxReturnRateValue: 5.5,
    popularityRank: 2,
    features: [
      "いつでもポイント2倍（基本還元率1.0%）",
      "Amazonやスタバでさらに還元率UP",
      "39歳以下の入会でWeb限定発行",
    ],
    affiliateUrl: "https://example.com/jcb",
    tags: ["年会費無料", "初心者", "Amazon・スタバ"],
    details: {
      insurance: "最高2,000万円の海外旅行傷害保険",
      electronicMoney: ["QUICPay", "JCB Contactless"],
      pros: [
        "基本還元率が1%と高くメインカードに最適",
        "Amazon利用時の還元率が高い",
      ],
      cons: ["40歳以上は新規申し込み不可"],
    },
  },
  {
    id: "rakuten",
    name: "楽天カード",
    brandColor: "from-red-600 to-rose-800",
    badge: "定番人気",
    imageUrl:
      "https://www24.a8.net/svt/bgt?aid=260809248468&wid=002&eno=01&mid=s00000027665001003000&mc=1", // ★ テスト
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    maxReturnRate: "3.0%",
    maxReturnRateValue: 3.0,
    popularityRank: 3,
    features: [
      "楽天市場でいつでもポイント3倍以上",
      "新規入会＆利用でポイントプレゼント",
      "街の加盟店でもポイントがザクザク貯まる",
    ],
    affiliateUrl: "https://www.rakuten.co.jp/",
    tags: ["年会費無料", "初心者", "ポイント還元"],
    details: {
      insurance: "最高2,000万円の海外旅行傷害保険（利用付帯）",
      electronicMoney: ["楽天Edy", "楽天ペイ", "Visaのタッチ決済"],
      pros: ["楽天経済圏での還元率が圧倒的", "ポイントの使い道が豊富"],
      cons: ["期間限定ポイントは有効期限が短い"],
    },
  },
  {
    id: "paypay",
    name: "PayPayカード",
    brandColor: "from-red-500 to-amber-600",
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    maxReturnRate: "5.0%",
    maxReturnRateValue: 5.0,
    popularityRank: 4,
    features: [
      "PayPayステップで還元率アップ",
      "Yahoo!ショッピングで最大5%還元",
      "縦型デザインでスタイリッシュ",
    ],
    affiliateUrl: "https://paypay.ne.jp/",
    tags: ["年会費無料", "PayPayユーザー"],
    details: {
      insurance: "なし（プラチナデノミネーション等で対応）",
      electronicMoney: ["PayPay", "タッチ決済"],
      pros: [
        "PayPayに直接チャージできる唯一のカード",
        "Yahoo!ショッピングで得",
      ],
      cons: ["旅行保険が付帯していない"],
    },
  },
  {
    id: "epos",
    name: "エポスカード",
    brandColor: "from-rose-700 to-pink-900",
    badge: "優待店舗 1万店以上",
    annualFee: "永年無料",
    annualFeeValue: 0,
    baseReturnRate: "0.5%",
    maxReturnRate: "2.5%",
    maxReturnRateValue: 2.5,
    popularityRank: 5,
    features: [
      "マルイのセールで10%OFF",
      "全国10,000店舗以上の優待特典",
      "海外旅行傷害保険が自動・利用付帯で手厚い",
    ],
    affiliateUrl: "https://example.com/epos",
    tags: ["年会費無料", "優待特典", "海外旅行保険"],
    details: {
      insurance: "最高3,000万円の海外旅行傷害保険",
      electronicMoney: ["Visaのタッチ決済", "EPOS Pay", "Apple Pay"],
      pros: [
        "飲食店やカラオケ等の割引優待が豊富",
        "インビテーションでゴールド永年無料",
      ],
      cons: ["基本還元率は0.5%"],
    },
  },
];
