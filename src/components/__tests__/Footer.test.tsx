import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

// next/link のモック（必要に応じて）
jest.mock("next/link", () => {
  return ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe("Footer Component", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  describe("HTML構造・アクセシビリティ", () => {
    test("semantic な <footer> タグとしてレンダリングされること", () => {
      const footerElement = screen.getByRole("contentinfo");
      expect(footerElement).toBeInTheDocument();
    });
  });

  describe("透明性・PR開示・診断ロジック表記の検証", () => {
    test("PR表記および診断アルゴリズムのタイトルが表示されていること", () => {
      expect(
        screen.getByText(/PR表記および診断・比較アルゴリズムの透明性について/i),
      ).toBeInTheDocument();
    });

    test("アフィリエイト収益およびPRに関する言及が含まれていること", () => {
      expect(
        screen.getByText(
          /アフィリエイトプログラムにより各種クレジットカード会社・提携ASP等から収益を得て運営されています/i,
        ),
      ).toBeInTheDocument();
    });

    test("診断ロジック（自動スコアリング・公平性）に関する記述が含まれていること", () => {
      expect(
        screen.getByText(
          /独自に定義した数値パラメータを機械的かつ中立に加点集計（自動スコアリング）して適合度を算出しています/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /特定のカードを意図的に優先表示するロジックは含まれておりません/i,
        ),
      ).toBeInTheDocument();
    });

    test("免責事項・最新情報確認に関する注記が含まれていること", () => {
      expect(
        screen.getByText(
          /最新・正確な情報は必ず各カード会社の公式サイトをご確認ください/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("内部リンクの検証", () => {
    test("プライバシーポリシー・免責事項ページへのリンクが正しく設定されていること", () => {
      const privacyLink = screen.getByRole("link", {
        name: /プライバシーポリシー・免責事項/i,
      });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute("href", "/privacy");
    });

    test("お役立ちコラム集ページへのリンクが正しく設定されていること", () => {
      const articlesLink = screen.getByRole("link", {
        name: /お役立ちコラム集/i,
      });
      expect(articlesLink).toBeInTheDocument();
      expect(articlesLink).toHaveAttribute("href", "/articles");
    });
  });

  describe("コピーライト表記の検証", () => {
    test("現在の西暦年（2026年）を含むコピーライトが表示されていること", () => {
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(
          new RegExp(
            `© ${currentYear} スマートクレカ比較 All rights reserved\\.`,
            "i",
          ),
        ),
      ).toBeInTheDocument();
    });
  });
});
