// src/components/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full max-w-md mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md text-center text-xs text-slate-400 space-y-6">
        {/* PR/広告開示および診断・比較の公平性表記 */}
        <div className="bg-slate-800/80 text-slate-300 p-4 rounded-xl text-[11px] border border-slate-700/60 text-left space-y-2.5">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1.5 flex items-center gap-1.5">
            PR表記および診断・比較アルゴリズムの透明性について
          </p>

          <p className="leading-relaxed">
            当サイトはアフィリエイトプログラムにより各種クレジットカード会社・提携ASP等から収益を得て運営されています。掲載内容には一部PRが含まれますが、提携有無や報酬額の多寡によって「10秒診断」の結果や比較表の掲載順位が歪められることは一切ありません。
          </p>

          <p className="leading-relaxed">
            診断プログラムは、お客様が指定した利用シーンや重視項目（還元率・年会費・特典等）に対し、独自に定義した数値パラメータを機械的かつ中立に加点集計（自動スコアリング）して適合度を算出しています。特定のカードを意図的に優先表示するロジックは含まれておりません。
          </p>

          <p className="leading-relaxed text-slate-400 text-[10px]">
            ※掲載している各種スペック（還元率・年会費・キャンペーン情報等）は定期的なデータ更新を行っていますが、最新・正確な情報は必ず各カード会社の公式サイトをご確認ください。
          </p>
        </div>

        {/* 内部リンク・コピーライト */}
        <div className="pt-1 space-y-3">
          <div className="flex justify-center items-center space-x-4 text-[11px]">
            <Link
              href="/privacy"
              className="hover:text-slate-200 transition-colors underline underline-offset-2"
            >
              プライバシーポリシー・免責事項
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/articles"
              className="hover:text-slate-200 transition-colors underline underline-offset-2"
            >
              お役立ちコラム集
            </Link>
          </div>
          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} スマートクレカ比較 All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
