// src/components/ArticleImage.test.tsx
import { render, screen } from "@testing-library/react";
import { ArticleImage } from "@/components/ArticleImage";

describe("ArticleImage Component", () => {
  // UT-IMG-01: 画像の描画
  test("UT-IMG-01: 指定したsrcとalt属性で画像が描画されること", () => {
    render(<ArticleImage src="/test.jpg" alt="テスト画像" />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("test.jpg"));
    expect(image).toHaveAttribute("alt", "テスト画像");
  });

  // UT-IMG-02: キャプションの表示
  test("UT-IMG-02: captionを渡した場合にキャプションが表示されること", () => {
    render(
      <ArticleImage
        src="/test.jpg"
        alt="テスト画像"
        caption="サンプルキャプション"
      />,
    );

    expect(screen.getByText("サンプルキャプション")).toBeInTheDocument();
  });

  // UT-IMG-03: キャプション非表示
  test("UT-IMG-03: captionを渡さない場合にキャプション要素が描画されないこと", () => {
    render(<ArticleImage src="/test.jpg" alt="テスト画像" />);

    expect(screen.queryByText("サンプルキャプション")).not.toBeInTheDocument();
  });
});
