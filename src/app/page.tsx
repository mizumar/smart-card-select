import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://smart-card-select.vercel.app";

export const metadata: Metadata = {
  title: "スマートクレカ比較 | 自分に合ったクレジットカードを比較・診断",
  description:
    "クレジットカードを年会費・還元率・ポイント・利用シーンから比較。カード診断や比較機能を使って、自分に合ったクレジットカードを見つけられます。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "スマートクレカ比較 | 自分に合ったクレジットカードを比較・診断",
    description:
      "クレジットカードを年会費・還元率・ポイント・利用シーンから比較。カード診断や比較機能を使って、自分に合ったクレジットカードを見つけられます。",
    images: ["/images/ogp.webp"],
    type: "website",
    locale: "ja_JP",
    siteName: "スマートクレカ比較",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "スマートクレカ比較 | 自分に合ったクレジットカードを比較・診断",
    description:
      "クレジットカードを比較・診断して、自分に合った1枚を見つけられます。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "スマートクレカ比較",
  url: baseUrl,
  description:
    "クレジットカードを年会費・還元率・ポイント・利用シーンから比較・診断できるサイトです。",
  inLanguage: "ja-JP",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient />
    </>
  );
}
