import { render, screen } from "@testing-library/react";
import { FeatureSection } from "../FeatureSection";
import { FeatureArticle } from "@/lib/feature-articles";

const mockFeatures: FeatureArticle[] = [
  {
    id: "test-feature-1",
    title: "テスト特集タイトル1",
    description: "テスト用の説明文1",
    href: "/feature/test-feature-1",
  },
  {
    id: "test-feature-2",
    title: "テスト特集タイトル2",
    description: "テスト用の説明文2",
    href: "/feature/test-feature-2",
  },
];

describe("FeatureSection", () => {
  it("見出しと特集カード群が正しく描画されること", () => {
    render(<FeatureSection features={mockFeatures} />);

    // 見出しの確認
    expect(screen.getByText("Pick Up")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "特集" }),
    ).toBeInTheDocument();

    // カード内容の確認
    expect(screen.getByText("テスト特集タイトル1")).toBeInTheDocument();
    expect(screen.getByText("テスト用の説明文1")).toBeInTheDocument();

    // リンク先の確認
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/feature/test-feature-1");
  });

  it("空のデータが渡された場合は何も表示しない（nullを返す）こと", () => {
    const { container } = render(<FeatureSection features={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
