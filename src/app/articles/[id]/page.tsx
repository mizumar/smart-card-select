import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleById, getAllArticles } from "@/lib/articles";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ id: string }>;
}

// 動的 メタデータ生成 (SEO対策)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) return {};

  return {
    title: `${article.title} | スマートクレカ比較`,
    description: article.excerpt,
  };
}

// 静的ルート生成 (SSG) のため全IDを取得
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/articles"
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            コラム一覧へ
          </Link>
        </div>
      </header>

      {/* メイン文章エリア */}
      <main className="max-w-md mx-auto px-4 pt-6">
        <article className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          {/* メタ情報 */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="inline-flex items-center font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
              <Tag className="w-3 h-3 mr-1" />
              {article.category}
            </span>
            <span className="flex items-center ml-auto">
              <Calendar className="w-3 h-3 mr-1" />
              {article.date}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}
            </span>
          </div>

          {/* タイトル */}
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-6 border-b border-slate-100 pb-4">
            {article.title}
          </h1>

          {/* 本文 (Markdown レンダリングエリア) */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
