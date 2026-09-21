import { render, screen } from "@testing-library/react";
import { ThreadsCard } from "@/components/ThreadsCard";

describe("ThreadsCard Component", () => {
  const defaultProps = {
    author: "mizuki",
    text: "これはThreadsのテスト投稿です。",
    url: "https://www.threads.net/@mizuki/post/123456",
  };

  // UT-TH-01: 投稿要素の描画
  test("UT-TH-01: 著者名、本文テキストが正しく表示されること", () => {
    render(<ThreadsCard {...defaultProps} />);

    expect(screen.getByText("@mizuki")).toBeInTheDocument();
    expect(
      screen.getByText("これはThreadsのテスト投稿です。"),
    ).toBeInTheDocument();
  });

  // UT-TH-02: 引用元URLリンク
  test('UT-TH-02: 外部リンクがtarget="_blank"およびrel属性付きで設定されていること', () => {
    render(<ThreadsCard {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", defaultProps.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  // UT-TH-03: 特殊文字・改行
  test("UT-TH-03: 改行を含む本文が崩れずに表示されること", () => {
    const textWithNewline = "1行目のテキスト\n2行目のテキスト";
    render(<ThreadsCard {...defaultProps} text={textWithNewline} />);

    expect(
      screen.getByText((content) => content.includes("1行目のテキスト")),
    ).toBeInTheDocument();
  });
});
