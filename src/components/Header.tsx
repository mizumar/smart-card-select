"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Menu, HelpCircle } from "lucide-react"; // HelpCircle を追加
import { HeaderDrawer } from "./HeaderDrawer";
import { HelpDrawer } from "./HelpDrawer"; // 追加

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // ヘルプ用 state

  // トップページかどうか
  const isTop = pathname === "/";
  // コラム詳細ページかどうか (/articles/[id])
  const isArticleDetail =
    pathname.startsWith("/articles/") && pathname !== "/articles";

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          {/* 左側：戻るボタン または サイトロゴ ＋ PR表記 */}
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
              <div className="flex flex-col justify-center">
                <Link
                  href="/"
                  className="font-bold text-base tracking-tight leading-none"
                >
                  スマートクレカ比較
                </Link>
                <span className="text-[8px] text-muted-foreground/80 mt-0.5 font-normal leading-tight">
                  [PR] 当サイトにはプロモーションが含まれています
                </span>
              </div>
            )}
          </div>

          {/* 右側：サブページ時のロゴ表示 & ハンバーガーボタン */}
          <div className="flex items-center gap-3">
            {!isTop && (
              <div className="flex flex-col justify-center text-right">
                <Link
                  href="/"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  スマートクレカ比較
                </Link>
                <span className="text-[8px] text-muted-foreground/80 font-normal leading-tight">
                  [PR] プロモーションが含まれています
                </span>
              </div>
            )}

            {/* 🆕 ヘルプボタン（ハンバーガーボタンの左隣） */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              aria-label="使い方・概要を見る"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* ハンバーガーボタン */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="メニューを開く"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ドロワーメニュー */}
      <HeaderDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {/* 🆕 ヘルプドロワー */}
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
