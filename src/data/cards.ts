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
  // NOTE:
  // - annualFeeValue / maxReturnRateValue / popularityRank はソート用の数値です。
  //   popularityRank は暫定値（掲載順=1,2,3,4）です。実際の人気順データに差し替えてください。
  // - imageUrl は未設定です。ASP管理画面 or 公式サイトの画像URLを取得後に設定してください。
  // - キャンペーン特典（入会特典・還元率アップ条件等）は変動するため、定期的に一次情報で確認してください。

  {
    //
    //コスモザカードオーパス_内容確認済み
    //
    id: "cosmo-the-card-opus",
    name: "コスモザカードオーパス",
    brandColor: "from-[#01ABB4] to-[#019CCC]", // 仮: コスモ石油コーポレートカラー系。要デザイン確認

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
      "年会費永年無料でコストをかけずにお得なカードライフをスタートできる",
      "イオングループでのお買い物でポイントが2倍",
      "全国のイオン・ダイエー・マックスバリューなど多数店舗で利用可能",
      "コスモ石油の給油が会員価格でお得",
      "ETC利用でWAON POINTが3倍（還元率1.5%）",
    ],
    tags: ["年会費無料", "ガソリン", "イオン系"],
    details: {
      insurance: "海外旅行傷害保険なし",
      electronicMoney: ["WAON POINT"],
      pros: [
        "イオングループでの日常の買い物でポイントが貯まりやすい",
        "年会費永年無料でコストがかからない",
        "全国のイオン系列店舗で使えて生活圏に合わせて活用しやすい",
        "20〜50代の主婦・ファミリー層に向く実用的なカード",
      ],
      cons: [
        "海外旅行保険が付帯しない",
        "コスモ石油・イオン以外での還元率は標準的（0.5%）",
      ],
    },
  },
  {
    //
    //エポスカード_内容確認済み
    //
    id: "epos-card",
    name: "エポスカード",
    brandColor: "from-rose-700 to-pink-900", // 仮: エポスカードのレッド系

    affiliateUrl:
      "//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3778032&pid=892681911",
    imageUrl:
      "//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3778032&pid=892681911",
    // trackingImageUrl: ,
    aspName: "valuecommerce",
    isPromoting: false,

    badge: "即時発行・年会費永年無料",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: `0.5%
通常200円（税込）につき1ポイント`,
    maxReturnRate: "マルコとマルオ期間中は10%OFF",
    maxReturnRateValue: 10.0,
    popularityRank: 2,
    features: [
      "海外旅行傷害保険 最高3,000万円（利用付帯）",
      "マルイの「マルコとマルオの10%オフ」でお得に買い物",
      "最短即日発行・マルイ店頭受取に対応",
      "全国約10,000店舗で優待・割引",
    ],
    tags: ["年会費無料", "海外旅行保険", "マルイ"],
    details: {
      insurance: "海外旅行傷害保険 最高3,000万円（利用付帯）",
      electronicMoney: ["Visaのタッチ決済", "EPOS Pay", "Apple Pay"],
      pros: [
        "本カードの年会費が永年無料",
        "ETCカードの年会費も永年無料",
        "年会費無料で海外旅行傷害保険が付帯",
        "即日発行に対応（店舗受取時）",
      ],
      cons: [
        "通常還元率は0.5%と標準的",
        "マルイをあまり利用しない人にはメリットが薄い",
      ],
    },
  },
  {
    //
    //楽天カード_内容確認済み
    //
    id: "rakuten-card",
    name: "楽天カード",
    brandColor: "from-red-600 to-rose-800",

    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hsc/56ad66b1.f8222ddb.55796d43.4d50cb62/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiIxIiwiYmFuIjozNzM0MjcsImFtcCI6ZmFsc2V9",
    imageUrl:
      "https://hbb.afl.rakuten.co.jp/hsb/56ad66b1.f8222ddb.55796d43.4d50cb62/?me_id=2101008&me_adv_id=373427&t=pict",
    aspName: "rakuten",
    isPromoting: true,

    badge: "発行枚数3,300万枚突破",
    annualFee: "無料（永年）",
    annualFeeValue: 0,
    baseReturnRate: "1.0%",
    maxReturnRate: `3.0%以上
楽天市場利用時`,
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
      electronicMoney: ["楽天Edy", "楽天ペイ", "Visaのタッチ決済"],
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
    id: "rakuten-premium-card",
    name: "楽天プレミアムカード",

    brandColor: "from-red-600 to-red-800",
    affiliateUrl:
      "https://hb.afl.rakuten.co.jp/hsc/56ae8763.96e7a036.55796d43.4d50cb62/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiIxIiwiYmFuIjo0NTExMzQsImFtcCI6ZmFsc2V9",
    imageUrl:
      "https://hbb.afl.rakuten.co.jp/hsb/56ae8763.96e7a036.55796d43.4d50cb62/?me_id=2101014&me_adv_id=451134&t=pict",
    aspName: "rakuten",
    isPromoting: true,

    badge: "楽天市場・旅行に強いプレミアムカード",
    annualFee: "11,000円（税込）",
    annualFeeValue: 11000,
    baseReturnRate: "1.0%",
    maxReturnRate: `最大4倍
楽天市場利用時`,
    maxReturnRateValue: 4.0,
    popularityRank: 10,
    features: [
      "通常還元率1％（100円につき1ポイント）",
      "楽天市場で毎週火・木曜日はポイント最大4倍",
      "国内主要空港ラウンジを無料で利用可能",
      "プライオリティ・パスに無料で申し込み可能",
      "海外旅行傷害保険が最高5,000万円",
      "国内旅行傷害保険が最高5,000万円",
      "動産総合保険が年間最高300万円",
      "楽天ETCカードの年会費が無料",
      "楽天証券の投信積立でポイント還元率1.0%",
    ],
    tags: ["楽天市場", "空港ラウンジ", "プライオリティ・パス"],
    details: {
      insurance:
        "海外旅行傷害保険 死亡後遺障害 最高5,000万円・国内旅行傷害保険 最高5,000万円・動産総合保険 年間最高300万円",
      electronicMoney: ["楽天Edy", "楽天ペイ", "Visaのタッチ決済"],
      pros: [
        "楽天市場をよく利用する人に向いている",
        "国内主要空港ラウンジを無料で利用できる",
        "プライオリティ・パスに無料で申し込める",
        "海外・国内旅行傷害保険が付帯",
        "楽天ETCカードの年会費が無料",
      ],
      cons: [
        "本カードの年会費が11,000円（税込）かかる",
        "楽天市場などの楽天サービスをあまり利用しない場合はメリットを活かしにくい",
        "プライオリティ・パスは年間5回まで無料",
      ],
    },
  },
  {
    //
    //Nudge(ナッジ)カード_内容確認済み
    //
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
      `スマホアプリだけで申込〜利用管理が完結
（2021年9月リリース）`,
      "学生部は18〜25歳限定・54種類以上のデザインから選択可能",
      `支払い日を選べる機能付き
（利用翌日〜最大2ヶ月手数料無料で返済）`,
      "利用上限金額を自分で調整でき、使いすぎ防止に対応",
      "18歳以上なら高校生でも発行可能",
      // // ★ ASP成果対象クラブ限定の注意
      // "※本アフィリエイト案件の成果対象は「学生部」「nudge」「デザイン部」クラブでの発行のみ",
    ],
    tags: ["学生向け", "年会費無料", "アプリ完結"],
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
        //"「審査が通りやすい」等の表現は法令上NGのため、LPコピーでは使用不可",
      ],
    },
  },
];
