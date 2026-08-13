import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { ChevronLeft, BookOpen } from "lucide-react";

export const metadata = {
  title: "クレカ活用コラム・知恵袋 | スマートクレカ比較",
  description:
    "クレジットカードの選び方やポイント還元率、タッチ決済の活用法などのお役立ち情報を発信中。",
};

export default function ArticlesPage() {
  // 日付の降順（最新順）にソート
  const sortedArticles = [...ARTICLES].sort((a, b) => {
    return (
      new Date(b.date.replace(/\./g, "-")).getTime() -
      new Date(a.date.replace(/\./g, "-")).getTime()
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/80 pb-16">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>診断アプリへ戻る</span>
          </Link>
          <span className="text-xs font-extrabold text-slate-800">
            コラム一覧
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="text-base font-bold text-slate-900">
            クレジットカード知識・活用ガイド
          </h1>
        </div>

        {/* ソート済みの記事リスト */}
        <div className="space-y-3.5">
          {sortedArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                  {article.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {article.date}
                </span>
              </div>
              <h2 className="text-xs font-bold text-slate-800 mb-1.5 leading-snug">
                {article.title}
              </h2>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
