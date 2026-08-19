export interface CreditCard {
  // 1. 基本識別情報
  id: string;
  name: string;
  brandColor: string;

  // 2. ASP・アフィリエイト管理情報
  affiliateUrl: string; // 遷移先アフィリエイトURL
  imageUrl?: string; // バナー画像URL
  trackingImageUrl?: string; // 1x1ピクセルインプレッション計測用URL (例: 0.gif)
  aspName?: string; // ASP名 (例: "A8.net")
  isPromoting?: boolean; // 掲載状態フラグ (true: 掲載中 / false: 停止中)

  // 3. カードスペック情報
  badge?: string;
  annualFee: string;
  annualFeeValue: number;
  baseReturnRate: string;
  maxReturnRate: string;
  maxReturnRateValue: number;
  popularityRank: number;
  features: string[];
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

    affiliateUrl: "https://example.com/smbc",
    isPromoting: false,

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

    affiliateUrl: "https://example.com/jcb",

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

    affiliateUrl: "https://www.rakuten.co.jp/",

    badge: "定番人気",
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

    affiliateUrl: "https://paypay.ne.jp/",

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

    affiliateUrl: "https://example.com/epos",

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
  // NOTE:
  // - annualFeeValue / maxReturnRateValue / popularityRank はソート用の数値です。
  //   popularityRank は暫定値（掲載順=1,2,3,4）です。実際の人気順データに差し替えてください。
  // - imageUrl は未設定です。ASP管理画面 or 公式サイトの画像URLを取得後に設定してください。
  // - キャンペーン特典（入会特典・還元率アップ条件等）は変動するため、定期的に一次情報で確認してください。

  {
    id: "cosmo-the-card-opus",
    name: "コスモ・ザ・カード・オーパス",
    brandColor: "#E3001B", // 仮: コスモ石油コーポレートカラー系。要デザイン確認

    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=4BA1PC+7QMWNU+5XGQ+5YZ75",
    imageUrl:
      "https://www24.a8.net/svt/bgt?aid=260809248468&wid=002&eno=01&mid=s00000027665001003000&mc=1",
    trackingImageUrl:
      "https://www13.a8.net/0.gif?a8mat=4BA1PC+7QMWNU+5XGQ+5YZ75",
    aspName: "a8",
    isPromoting: true,

    badge: "イオングループでお得",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: "0.5%〜1.0%",
    maxReturnRate: "最大5.0%（5・15・25日リボ払い時）",
    maxReturnRateValue: 5.0,
    popularityRank: 4,
    features: [
      "コスモ石油の給油が会員価格でお得",
      "入会後最大400Lまでガソリン10円/Lキャッシュバック",
      "ETC利用でWAON POINTが3倍（還元率1.5%）",
      "イオングループの対象店舗でポイント2倍・お客さま感謝デーで5%OFF",
    ],
    tags: ["年会費無料", "ガソリン", "イオン系"],
    details: {
      insurance: "海外旅行傷害保険なし",
      electronicMoney: ["WAON POINT"],
      pros: [
        "コスモ石油をよく使う人・ドライバーにとってお得",
        "イオングループの買い物でも還元率アップ",
        "年会費永年無料",
      ],
      cons: [
        "海外旅行保険が付帯しない",
        "コスモ石油・イオン以外での還元率は標準的（0.5%）",
      ],
    },
  },
  {
    id: "epos-card",
    name: "エポスカード",
    brandColor: "from-rose-700 to-pink-900", // 仮: エポスカードのレッド系

    affiliateUrl: "https://www.eposcard.co.jp/aflt/index2.html",
    imageUrl: undefined,
    aspName: "a8",
    isPromoting: true,

    badge: "即時発行・年会費永年無料",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: "0.5%",
    maxReturnRate: "実質10%相当（マルコとマルオの10%オフ時）",
    maxReturnRateValue: 10.0,
    popularityRank: 2,
    features: [
      "海外旅行傷害保険が最高3000万円付帯（利用付帯）",
      "マルイの「マルコとマルオの10%オフ」でお得に買い物",
      "マルイ店舗受取なら即日発行も可能",
      "全国10,000以上の提携店舗で優待・割引",
    ],
    tags: ["年会費無料", "海外旅行保険", "マルイ"],
    details: {
      insurance: "海外旅行傷害保険 最高3,000万円（利用付帯）",
      electronicMoney: [],
      pros: [
        "年会費・家族カード・ETCカードすべて永年無料",
        "海外旅行保険が無料カードとしては手厚い",
        "即日発行に対応（店舗受取時）",
      ],
      cons: [
        "通常還元率は0.5%と標準的",
        "マルイをあまり利用しない人にはメリットが薄い",
      ],
    },
  },
  {
    id: "rakuten-card",
    name: "楽天カード",
    brandColor: "from-red-600 to-rose-800",

    affiliateUrl: "https://affiliate.rakuten.co.jp/group/card/",
    imageUrl: undefined,
    aspName: "rakuten",
    isPromoting: true,

    badge: "発行枚数3,100万枚突破",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    maxReturnRate: "3.0%以上（楽天市場利用時）",
    maxReturnRateValue: 3.0,
    popularityRank: 1,
    features: [
      "通常還元率1.0%と年会費無料カードの中でも高還元",
      "楽天市場・楽天ブックス利用でポイント3倍以上",
      "国際ブランドはVisa/Mastercard/JCB/Amexから選択可能",
      "海外旅行傷害保険（死亡後遺障害 最高2,000万円）付帯",
    ],
    tags: ["年会費無料", "高還元", "楽天経済圏"],
    details: {
      insurance: "海外旅行傷害保険 死亡後遺障害 最高2,000万円",
      electronicMoney: ["楽天Edy（発行手数料330円）"],
      pros: [
        "年会費無料で還元率1.0%と使いやすい",
        "楽天市場・楽天経済圏との相性が良い",
        "知名度・発行実績が高く安心感がある",
      ],
      cons: [
        "楽天経済圏をあまり使わない人はメリットが薄れる",
        "ETCカード年会費は会員ランクにより有料（550円）",
      ],
    },
  },
  {
    id: "nudge-card",
    name: "Nudge(ナッジ)",
    brandColor: "from-[#0F1D4C] to-[#404D7B]",

    affiliateUrl:
      "http://www.rentracks.jp/adx/r.html?idx=0.19855.385674.9932.14150&dna=163846",
    imageUrl: "http://www.image-rentracks.com/14150/01_300_250.png",
    trackingImageUrl:
      "http://www.rentracks.jp/adx/p.gifx?idx=0.19855.385674.9932.14150&dna=163846",
    aspName: "rentracks",
    isPromoting: true,

    badge: "18歳から作れるVisaカード",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: `還元率制度なし
（利用額に応じた抽選特典/ガチャ形式）`,
    maxReturnRate: `対象外
（テーマパークチケット・スタバチケット等が抽選で当たる）`,
    maxReturnRateValue: 0,
    popularityRank: 3,
    features: [
      "スマホアプリだけで申込〜利用管理が完結（2021年9月リリース）",
      "「学生部」は18〜25歳限定・54種類以上のデザインから選択可能",
      "支払い日を選べる機能付き（利用翌日〜最大2ヶ月手数料無料で返済）",
      "利用上限金額を自分で調整でき、使いすぎ防止に対応",
      "18歳以上なら高校生でも発行可能",
      // // ★ ASP成果対象クラブ限定の注意
      // "※本アフィリエイト案件の成果対象は「学生部」「nudge」「デザイン部」クラブでの発行のみ",
    ],
    tags: ["学生向け", "年会費無料", "アプリ完結", "18歳から"],
    details: {
      insurance: "要確認（公式サイトに記載なし）",
      electronicMoney: [],
      pros: [
        "18歳から申込可能で、高校生・大学生でも作りやすい",
        "支払日を自分で選べる・利用上限を調整できるので使いすぎ対策になる",
        "利用額に応じてテーマパークチケットやスタバチケット等が当たるガチャ特典あり",
        "デザインの選択肢が豊富（学生部だけで54種類以上）",
      ],
      cons: [
        "固定の還元率（ポイント制度）ではないため、他カードと単純比較しづらい",
        "海外旅行保険など基本スペックの公開情報が少ない",
        // ★ コンプライアンス上の留意点（データではなく制作時の注意）
        "「審査が通りやすい」等の表現は法令上NGのため、LPコピーでは使用不可",
      ],
    },
  },
];
