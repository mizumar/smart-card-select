import { render, screen } from "@testing-library/react";
import type { CreditCard } from "@/data/cards";
import { RelatedContents } from "@/components/cards/RelatedContents";
import { getAllArticles } from "@/lib/articles";

jest.mock("@/lib/articles", () => ({
  getAllArticles: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock("gray-matter", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetAllArticles = getAllArticles as jest.MockedFunction<
  typeof getAllArticles
>;

const createCard = (
  relatedContents?: CreditCard["relatedContents"],
): CreditCard => ({
  id: "test-card",
  name: "テストカード",
  popularityRank: 1,
  tagIds: ["fee-free"],
  tags: [],
  brandColor: "#000000",
  affiliateUrl: "#",
  annualFee: "無料",
  annualFeeValue: 0,
  baseReturnRate: "1%",
  baseReturnRateValue: 1,
  maxReturnRate: "1%",
  maxReturnRateValue: 1,
  features: [],
  details: {
    insurance: "",
    electronicMoney: [],
    pros: [],
    cons: [],
  },
  relatedContents,
});

describe("RelatedContents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("指定した記事を表示する", () => {
    mockGetAllArticles.mockReturnValue([
      {
        id: "article-1",
        title: "楽天ポイントをお得に貯める方法",
        date: "2026-11-01",
        category: "ポイント",
        excerpt: "記事概要",
        readTime: "5分",
        content: "",
      },
    ]);

    const card = createCard([
      {
        type: "article",
        id: "article-1",
      },
    ]);

    render(<RelatedContents card={card} />);

    expect(
      screen.getByText("楽天ポイントをお得に貯める方法"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /楽天ポイントをお得に貯める方法/,
      }),
    ).toHaveAttribute("href", "/articles/article-1");
  });

  it("指定した特集を表示する", () => {
    const fs = require("fs");
    const matter = require("gray-matter");

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("mock markdown");
    matter.default.mockReturnValue({
      data: {
        title: "楽天カード特集",
      },
      content: "",
    });

    mockGetAllArticles.mockReturnValue([]);

    const card = createCard([
      {
        type: "feature",
        id: "rakuten-cards",
      },
    ]);

    render(<RelatedContents card={card} />);

    expect(screen.getByText("楽天カード特集")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /楽天カード特集/,
      }),
    ).toHaveAttribute("href", "/feature/rakuten-cards");
  });

  it("指定した関連記事と特集を指定した順番で表示する", () => {
    const fs = require("fs");
    const matter = require("gray-matter");

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("mock markdown");
    matter.default.mockReturnValue({
      data: {
        title: "楽天カード特集",
      },
      content: "",
    });

    mockGetAllArticles.mockReturnValue([
      {
        id: "article-1",
        title: "楽天ポイントの記事",
        date: "2026-11-01",
        category: "ポイント",
        excerpt: "記事概要",
        readTime: "5分",
        content: "",
      },
    ]);

    const card = createCard([
      {
        type: "feature",
        id: "rakuten-cards",
      },
      {
        type: "article",
        id: "article-1",
      },
    ]);

    render(<RelatedContents card={card} />);

    const links = screen.getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "特集楽天カード特集",
      "コラム楽天ポイントの記事",
    ]);
  });

  it("存在しない関連記事を除外する", () => {
    mockGetAllArticles.mockReturnValue([
      {
        id: "article-1",
        title: "存在する記事",
        date: "2026-11-01",
        category: "ポイント",
        excerpt: "記事概要",
        readTime: "5分",
        content: "",
      },
    ]);

    const card = createCard([
      {
        type: "article",
        id: "article-404",
      },
      {
        type: "article",
        id: "article-1",
      },
    ]);

    render(<RelatedContents card={card} />);

    expect(screen.queryByText("存在しない記事")).not.toBeInTheDocument();
    expect(screen.getByText("存在する記事")).toBeInTheDocument();
  });

  it("関連コンテンツの指定がない場合は最新記事5件を表示する", () => {
    mockGetAllArticles.mockReturnValue(
      Array.from({ length: 7 }, (_, index) => ({
        id: `article-${index + 1}`,
        title: `記事${index + 1}`,
        date: `2026-11-${String(index + 1).padStart(2, "0")}`,
        category: "ポイント",
        excerpt: "記事概要",
        readTime: "5分",
        content: "",
      })),
    );

    const card = createCard();

    render(<RelatedContents card={card} />);

    expect(screen.getAllByRole("link")).toHaveLength(5);

    expect(screen.getByText("記事1")).toBeInTheDocument();
    expect(screen.getByText("記事5")).toBeInTheDocument();
    expect(screen.queryByText("記事6")).not.toBeInTheDocument();
  });

  it("関連コンテンツが解決できない場合は最新記事5件にフォールバックする", () => {
    mockGetAllArticles.mockReturnValue([
      {
        id: "article-1",
        title: "最新記事1",
        date: "2026-11-01",
        category: "ポイント",
        excerpt: "記事概要",
        readTime: "5分",
        content: "",
      },
    ]);

    const card = createCard([
      {
        type: "article",
        id: "article-404",
      },
    ]);

    render(<RelatedContents card={card} />);

    expect(screen.getByText("最新記事1")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/articles/article-1",
    );
  });
});
