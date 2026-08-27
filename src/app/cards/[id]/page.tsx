import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { cards as cardsData } from "@/data/cards";
import { DiagnosticBanner } from "@/components/DiagnosticBanner";
import { CalloutNotice } from "@/components/CalloutNotice";

interface Props {
  params: Promise<{ id: string }>;
}

// -------------------------------------------------------------
// A. 補助関数：MarkdownとFrontmatterの取得
// -------------------------------------------------------------
function getCardContent(id: string) {
  let markdownContent = "";
  let frontmatter: {
    title?: string;
    description?: string;
    updatedAt?: string;
    author?: string;
  } = {};

  try {
    const filePath = path.join(process.cwd(), "src/content/cards", `${id}.md`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      frontmatter = data;
      markdownContent = content;
    }
  } catch (error) {
    // 取得失敗時は空のまま続行
  }

  return { frontmatter, markdownContent };
}

// -------------------------------------------------------------
// B. SEO設定：generateMetadata（動的メタデータ生成）
// -------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = cardsData.find((c) => c.id === id);
  if (!card) return {};

  const { frontmatter } = getCardContent(id);

  // タイトルのフォールバック処理（MDに無ければ自動生成）
  const pageTitle =
    frontmatter.title ||
    `${card.name}の評判・メリットは？還元率や特徴を徹底解説`;

  // 説明文のフォールバック処理
  const pageDescription =
    frontmatter.description ||
    `${card.name}の特徴、年会費（${card.annualFee}）、最大還元率（${card.maxReturnRate}）などの基本スペックやメリット・デメリットを分かりやすく解説します。`;

  const pageUrl = `https://smart-card-select.vercel.app/cards/${id}`; // ※実際のドメインに変更

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: "クレジットカード比較ナビ", // サービス名
      type: "article",
      images: card.imageUrl
        ? [
            {
              url: card.imageUrl,
              alt: card.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: card.imageUrl ? [card.imageUrl] : [],
    },
  };
}

// -------------------------------------------------------------
// C. ページ本体コンポーネント
// -------------------------------------------------------------
export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;
  const card = cardsData.find((c) => c.id === id);
  if (!card) notFound();

  const { frontmatter, markdownContent } = getCardContent(id);

  const specItems = [
    { label: "カード名", value: card.name, isBold: true },
    { label: "国際ブランド", value: card.brands?.join(" / ")?.toUpperCase() },
    { label: "年会費", value: card.annualFee },
    { label: "基本還元率", value: card.baseReturnRate },
    { label: "最大還元率", value: card.maxReturnRate },
    { label: "貯まるポイント", value: card.pointName },
    { label: "付帯保険", value: card.details?.insurance },
    { label: "電子マネー", value: card.details?.electronicMoney?.join("、") },
  ];

  // 構造化データ（Productスキーマ / JSON-LD）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    image: card.imageUrl,
    description: frontmatter.description || `${card.name}のスペック詳細`,
    offers: {
      "@type": "Offer",
      price:
        card.annualFee === "無料" || card.annualFee === "永年無料"
          ? "0"
          : undefined,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: card.affiliateUrl,
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 pb-32">
      {/* Google等へ伝える構造化データ（JSON-LD）を埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-md mx-auto px-5 space-y-9">
        {/* 2. ファーストビュー */}
        <section className="pt-2 text-center space-y-4">
          {card.badge && (
            <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full tracking-wider">
              {card.badge}
            </span>
          )}

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {card.name}
          </h1>

          {/* 券面画像（1x1ピクセルビーコン入り） */}
          {card.imageUrl ? (
            <div className="py-2 flex justify-center relative">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="h-36 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
              {card.trackingImageUrl && (
                <img
                  src={card.trackingImageUrl}
                  width={1}
                  height={1}
                  alt=""
                  className="absolute opacity-0 pointer-events-none w-px h-px"
                  aria-hidden="true"
                />
              )}
            </div>
          ) : (
            <div
              className={`w-48 h-30 mx-auto my-4 bg-linear-to-tr ${card.brandColor} rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-sm tracking-widest`}
            >
              {card.name}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-b border-slate-100 py-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                年会費
              </p>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {card.annualFee}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                最大還元率
              </p>
              <p className="text-lg font-black text-blue-600 mt-0.5">
                {card.maxReturnRate}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={card.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-sm"
            >
              公式サイトで詳細を見る
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>
        </section>

        {/* 3. features（主な特徴） */}
        {card.features && card.features.length > 0 && (
          <section className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100/80 space-y-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              主な特徴・注目メリット
            </h2>
            <ul className="space-y-2.5">
              {card.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-800 font-medium leading-relaxed"
                >
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px]">
                    ✓
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. 洗練されたプロ・コン */}
        {card.details && (
          <section className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-wide">
              カードの要点まとめ
            </h2>

            <div className="space-y-3">
              {card.details.pros && card.details.pros.length > 0 && (
                <div className="border border-slate-200/70 rounded-2xl p-4 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      MERIT
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      おすすめできる理由
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 pl-1">
                    {card.details.pros.map((pro, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {card.details.cons && card.details.cons.length > 0 && (
                <div className="border border-slate-200/70 rounded-2xl p-4 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      CHECK
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      事前に知っておきたい注意点
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 pl-1">
                    {card.details.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. 専門レビュー（Markdown本文） */}
        {markdownContent && (
          <section className="space-y-4 pt-4 border-t border-slate-100">
            {frontmatter.updatedAt && (
              <p className="text-[10px] text-slate-400 text-right">
                最終更新日: {frontmatter.updatedAt}
              </p>
            )}
            <h2 className="text-sm font-bold text-slate-900 tracking-wide">
              徹底考察
            </h2>
            <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-3">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="mt-8 mb-4 border-l-4 border-slate-900 pl-3 text-lg font-bold text-slate-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 mb-3 border-b border-slate-200 pb-2 text-base font-bold text-slate-800">
                      {children}
                    </h3>
                  ),
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
            {/* 下部リンク導線 */}
            <DiagnosticBanner />
          </section>
        )}

        {/* 6. スペック一覧表 */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 tracking-wide">
            基本スペック詳細
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {specItems.map(
              (item, i) =>
                item.value && (
                  <div
                    key={i}
                    className="py-3 flex justify-between items-center gap-4"
                  >
                    <span className="text-slate-400 font-medium shrink-0">
                      {item.label}
                    </span>
                    <span
                      className={`text-slate-800 text-right ${item.isBold ? "font-bold text-slate-900" : ""}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ),
            )}
          </div>
          <CalloutNotice
            title="※ ご注意・注釈事項"
            items={card.calloutNotices}
          />
        </section>
      </main>

      {/* 7. ボトム追従バー */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 shadow-2xl">
        <div className="max-w-md mx-auto">
          <a
            href={card.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg active:scale-[0.98] transition-all text-xs"
          >
            {card.name} 公式サイトへ
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}
