import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { cards, cards as cardsData } from "@/data/cards";
import { CardItem } from "@/components/CardItem";
import { CompareBottomSheet } from "@/components/CompareBottomSheet";
import { FeatureHeroIcon } from "@/components/FeatureHeroIcon";

interface Props {
  params: Promise<{ id: string }>;
}
// -------------------------------------------------------------
// A. Markdown & Frontmatter 取得関数
// -------------------------------------------------------------
function getFeatureContent(id: string) {
  let markdownContent = "";
  let frontmatter: {
    title?: string;
    description?: string;
    updatedAt?: string;
    icon?: string;
    cardIds?: string[];
  } = {};

  try {
    const filePath = path.join(
      process.cwd(),
      "src/content/features",
      `${id}.md`,
    );
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
// B. 動的 SEO メタデータ生成
// -------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { frontmatter } = getFeatureContent(id);

  if (!frontmatter.title) return {};

  const pageTitle = frontmatter.title;
  const pageDescription = frontmatter.description || "";
  const pageUrl = `https://smart-card-select.vercel.app/feature/${id}`;

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
      type: "article",
    },
  };
}

// -------------------------------------------------------------
// C. メインページコンポーネント
// -------------------------------------------------------------
export default async function FeatureDetailPage({ params }: Props) {
  const { id } = await params;
  const { frontmatter, markdownContent } = getFeatureContent(id);

  if (!markdownContent) notFound();

  // 1. 本文中の :::card{id="..."} から使われているカードIDを正規表現ですべて抽出する
  const inlineCardIds = Array.from(
    markdownContent.matchAll(/:::card\{id="(.+?)"\}/g),
  ).map((match) => match[1]);

  // 2. Frontmatterで指定されたIDのうち、本文ですでに使われているものを除外して抽出
  const featuredCards = (frontmatter.cardIds || [])
    .filter((cardId) => !inlineCardIds.includes(cardId)) // ★ここで重複を防ぐ
    .map((cardId) => cardsData.find((c) => c.id === cardId))
    .filter((c): c is (typeof cardsData)[number] => c !== undefined);

  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20">
      <main className="max-w-md mx-auto px-5 space-y-6 pt-6">
        {/* ヘッダー・タイトルエリア */}
        <div className="space-y-3">
          <div>
            <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide uppercase">
              特集記事
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {frontmatter.title}
          </h1>
          {frontmatter.updatedAt && (
            <p className="text-[10px] text-slate-400">
              更新日: {frontmatter.updatedAt}
            </p>
          )}
        </div>

        {/* アイコン付き重ね合わせカードのトップ表示 */}
        <FeatureHeroIcon iconName={frontmatter.icon} />

        {/* Markdown 本文エリア */}
        <section className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="mt-8 mb-3 border-l-4 border-slate-900 pl-3 text-base font-bold text-slate-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-5 mb-2 border-b border-slate-200 pb-1 text-sm font-bold text-slate-800">
                  {children}
                </h3>
              ),
              // 本文中における :::card{id="xxx"} の埋め込み構文パース
              p: ({ children }) => {
                const childText = String(children);
                const match = childText.match(/^:::card\{id="(.+)"\}/);
                if (match) {
                  const targetCard = cardsData.find((c) => c.id === match[1]);
                  if (targetCard) {
                    return (
                      <div className="my-6">
                        <CardItem card={targetCard} />
                      </div>
                    );
                  }
                }
                return <p className="mb-3 leading-relaxed">{children}</p>;
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </section>

        {/* Frontmatter (cardIds) 指定のカード一覧（記事下部） */}
        {featuredCards.length > 0 && (
          <section className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">
              この記事で紹介したカード一覧
            </h3>
            <div className="space-y-4">
              {featuredCards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}
      </main>
      {/* 2枚比較ボトムシート */}
      <CompareBottomSheet cards={cards} />
    </div>
  );
}
