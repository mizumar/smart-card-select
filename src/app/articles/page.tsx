import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";

export default function ArticlesPage() {
  // getAllArticles() で Markdown から取得（自動で日付降順ソート済み）
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* メインコンテンツ */}
      <main className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-slate-900">
            クレカお役立ちコラム
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            知っておきたいポイント還元や選び方のコツを解説
          </p>
        </div>

        {/* 記事一覧 */}
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                <span className="inline-flex items-center font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
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

              <h2 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                {article.title}
              </h2>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
