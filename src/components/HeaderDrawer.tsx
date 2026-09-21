"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Home,
  Sparkles,
} from "lucide-react";
import { NavBanner } from "@/components/NavBanner";

interface HeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDiagnosis?: () => void; // トップページにいる場合に直接モーダルを開く用
}

export function HeaderDrawer({
  isOpen,
  onClose,
  onOpenDiagnosis,
}: HeaderDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleDiagnosisClick = () => {
    onClose();
    // トップページにいても別ページにいても、常にクエリ付きで遷移させる
    router.push("/?openDiagnosis=true");
  };
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. バックドロップ（背景の黒透過エリア） */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-100"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. ドロワー本体（画面右から幅75%〜80%で表示） */}
      <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-15">
        <div className="w-screen max-w-280px sm:max-w-xs bg-background shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-250 ease-out border-l border-border/40">
          {/* ヘッダーエリア（タイトル ＋ 閉じるボタン） */}
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <span className="text-sm font-bold tracking-tight text-slate-800">
              メニュー
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* コンテンツエリア（スクロール可能） */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {/* NavBannerブロック */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                おすすめ機能
              </span>
              <NavBanner
                onClick={handleDiagnosisClick}
                subTitle="10秒でわかる"
                title="カード診断"
                icon={<Sparkles className="w-4 h-4" />}
                theme="orange"
              />
            </div>

            {/* 上部：バナーブロック（特集・おすすめページなどへの誘導） */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Pick Up
              </span>
              <Link
                href="/feature/credit-card-money-date-300"
                onClick={onClose}
                className="group block relative overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 p-3.5 text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 mb-1">
                  <Sparkles className="h-3 w-3" />
                  <span>threads投稿に300件以上の返信から考えたこと</span>
                </div>
                <p className="text-xs font-bold leading-snug group-hover:underline">
                  「お金が減る日」と「お金を使う日」は違う
                </p>
                <div className="mt-2 flex items-center text-[10px] font-medium text-blue-100">
                  <span>詳しく見る</span>
                  <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
              <Link
                href="/feature/rakuten-cards"
                onClick={onClose}
                className="group block relative overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 p-3.5 text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 mb-1">
                  <Sparkles className="h-3 w-3" />
                  <span>おすすめ特集</span>
                </div>
                <p className="text-xs font-bold leading-snug group-hover:underline">
                  楽天カード vs 楽天プレミアム徹底比較
                </p>
                <div className="mt-2 flex items-center text-[10px] font-medium text-blue-100">
                  <span>詳しく見る</span>
                  <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            {/* 下部：リスト形式ブロック（メインメニュー） */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                コンテンツ
              </span>
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="h-4 w-4 text-slate-400" />
                    <span>トップページ</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>

                <Link
                  href="/articles"
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>お役立ちコラム集</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>

                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>プライバシー・免責事項</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>
              </nav>
            </div>
          </div>

          {/* フッターエリア（必要に応じてコピーライトなど） */}
          <div className="p-4 border-t border-border/40 text-[10px] text-center text-muted-foreground">
            © スマートクレカ比較
          </div>
        </div>
      </div>
    </div>
  );
}
