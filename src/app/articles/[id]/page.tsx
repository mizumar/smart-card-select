import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/data/articles";
import { ChevronLeft, Calendar, Tag } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return {};

  return {
    title: `${article.title} | スマートクレカ比較`,
    description: article.summary,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/80 pb-16">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/articles"
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>記事一覧へ</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-blue-600">
            診断アプリ
          </Link>
        </div>
      </header>

      {/* 本文エリア */}
      <main className="max-w-md mx-auto px-4 pt-6">
        <article className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
          </div>

          <h1 className="text-sm font-extrabold text-slate-900 mb-4 leading-snug">
            {article.title}
          </h1>

          <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* 下部リンク導線 */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium mb-3">
              あなたにぴったりの1枚を10秒で診断してみませんか？
            </p>
            <Link
              href="/"
              className="inline-block w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
            >
              10秒診断ツールを使ってみる
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
