import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Footer } from "@/components/Footer";

// ★ Google Fonts から Noto Sans JP を取得
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "スマートクレカ比較 | 10秒で自分に最適な1枚が見つかる",

  description:
    "クレジットカードを年会費・還元率・ポイント・利用シーンから比較。10秒診断で、自分のライフスタイルに合ったクレジットカードを見つけられます。",

  verification: {
    google: "QQJrM_I1qi56PxSNtcKGWFlKJ826jD9XYfKAvW9aWa0",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "スマートクレカ比較 | 10秒で自分に最適な1枚が見つかる",
    description:
      "クレジットカードを年会費・還元率・ポイント・利用シーンから比較。10秒診断で、自分に合った1枚を見つけられます。",
    type: "website",
    locale: "ja_JP",
    siteName: "スマートクレカ比較",
  },

  twitter: {
    card: "summary_large_image",
    title: "スマートクレカ比較 | 10秒で自分に最適な1枚が見つかる",
    description:
      "クレジットカードを比較・診断して、自分に合った1枚を見つけられます。",
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
        {/* GA4 測定IDをセット */}
        <GoogleAnalytics gaId="G-CR9PXZQX05" />
        <Footer />
      </body>
    </html>
  );
}
