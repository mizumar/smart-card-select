"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  // トップページかどうか
  const isTop = pathname === "/";
  // コラム詳細ページかどうか (/articles/[id])
  const isArticleDetail =
    pathname.startsWith("/articles/") && pathname !== "/articles";

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        {/* 左側：戻るボタン または サイトロゴ */}
        <div className="flex items-center gap-2">
          {isArticleDetail ? (
            <Link
              href="/articles"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-0.5" />
              コラム一覧へ
            </Link>
          ) : !isTop ? (
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-0.5" />
              トップへ
            </Link>
          ) : (
            <Link href="/" className="font-bold text-base tracking-tight">
              スマートクレカ比較
            </Link>
          )}
        </div>

        {/* 右側：サブページ表示時のロゴアイコン等（必要に応じて配置） */}
        {!isTop && (
          <Link
            href="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            スマートクレカ比較
          </Link>
        )}
      </div>
    </header>
  );
}
