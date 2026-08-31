import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "プライバシーポリシー・免責事項 | スマートクレカ比較",
  description:
    "スマートクレカ比較のプライバシーポリシー、免責事項、運営者情報、アクセス解析ツールおよび広告配信に関する表示です。",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 pb-16">
      {/* 本文 */}
      <main className="max-w-md mx-auto px-4 pt-6 text-slate-700 text-xs leading-relaxed space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <h1 className="text-sm font-extrabold text-slate-900">
              プライバシーポリシー・免責事項
            </h1>
          </div>

          {/* 1. 広告配信について */}
          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-[13px]">
              1. 広告の配信について（PR表記）
            </h2>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              当サイト「スマートクレカ比較」は、各種アフィリエイトプログラム（もしもアフィリエイト、A8.net、バリューコマース、アクセストレード、レントラックス等）に参加しています。
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              当サイト内で紹介している商品・サービスを経由して申し込みが発生した際、当サイトは提携事業者から紹介料（報酬）を受ける場合があります。ただし、掲載されている比較順位や診断結果はユーザーの利便性を最優先に客観的なデータに基づき出力しており、広告主の影響を受けることはありません。
            </p>
          </section>

          {/* 2. 免責事項 */}
          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-[13px]">
              2. 免責事項
            </h2>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              当サイトに掲載している情報・コンテンツについては、可能な限り正確な情報を掲載するよう努めておりますが、クレジットカードの還元率・年会費・特典等の情報は各カード会社の改定等により変動する場合があります。
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              当サイトからのリンクやバナー等によって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。お申し込みの際は、必ず移動先の公式サイトの最新情報をご確認ください。
            </p>
          </section>

          {/* 3. アクセス解析・Cookieについて */}
          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-[13px]">
              3. アクセス解析・Cookieについて
            </h2>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              当サイトでは、サービスの改善や利用状況の把握を目的として、Cookie（クッキー）を利用したアクセス解析ツールを導入しています。アクセス解析には、Google
              LLCが提供する「Google
              Analytics」を利用しています。また、検索結果における当サイトの掲載状況や検索パフォーマンスを確認するため、「Google
              Search Console」を利用しています。
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              これらのツールでは、Cookie等を利用してサイトへのアクセス状況や利用状況に関する情報を収集・分析する場合があります。収集された情報は、サイトの改善やコンテンツの充実を目的として利用し、個人を直接特定する目的では使用しません。
            </p>
          </section>

          {/* 4. 運営者情報 */}
          <section className="space-y-1.5 border-t border-slate-100 pt-4">
            <h2 className="font-bold text-slate-900 text-[13px]">
              4. 運営者情報・お問い合わせ
            </h2>
            <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-[11px]">
              <p>
                <span className="font-bold text-slate-600">運営サイト:</span>{" "}
                スマートクレカ比較
              </p>
              <p>
                <span className="font-bold text-slate-600">サイトURL:</span>{" "}
                https://smart-card-select.vercel.app/
              </p>
              <p>
                <span className="font-bold text-slate-600">
                  Threads公式アカウント:
                </span>{" "}
                1円を拾う人_@life_hack_db
              </p>
              <p>
                <span className="font-bold text-slate-600">ThreadsURL:</span>{" "}
                <a href="https://www.threads.com/@life_hack_db">
                  https://www.threads.com/@life_hack_db
                </a>
              </p>
              <p>
                <span className="font-bold text-slate-600">お問い合わせ:</span>{" "}
                サイトに関するお問い合わせ・修正依頼等はThreads公式アカウントまでご連絡ください。
              </p>
            </div>
          </section>

          <p className="text-[10px] text-slate-400 text-right pt-2">
            制定日: 2026年8月11日
          </p>
        </div>
      </main>
    </div>
  );
}
