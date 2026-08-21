import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// ★ Google Fonts から Noto Sans JP を取得
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "スマートクレカ比較 | 10秒で自分に最適な1枚が見つかる",
  description:
    "ライフスタイルに合わせて最適なクレジットカードを瞬時に診断・比較。",
  verification: {
    google: "QQJrM_I1qi56PxSNtcKGWFlKJ826jD9XYfKAvW9aWa0",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      {/* antialiased でiPhoneの文字表示を美しく滑らかにする */}
      <body className="font-sans antialiased text-slate-800 bg-slate-50/80 tracking-tight">
        {children}
      </body>
    </html>
  );
}
