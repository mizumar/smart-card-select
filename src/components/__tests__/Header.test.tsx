import { render, screen } from "@testing-library/react";
import { Header } from "../Header";
import { usePathname } from "next/navigation";

// next/navigation の usePathname をモック化
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // UT-HDR-01
  it("UT-HDR-01: トップページ (/) 閲覧時、ロゴが表示され戻るリンクが存在しないこと", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    // サイトタイトルの表示確認
    expect(screen.getByText("スマートクレカ比較")).toBeInTheDocument();

    // 戻るリンクが存在しないことの確認
    expect(screen.queryByText("トップへ")).not.toBeInTheDocument();
    expect(screen.queryByText("コラム一覧へ")).not.toBeInTheDocument();
  });

  // UT-HDR-02
  it("UT-HDR-02: コラム一覧 (/articles) 閲覧時、'‹ トップへ' リンクが表示されること", () => {
    mockUsePathname.mockReturnValue("/articles");
    render(<Header />);

    const link = screen.getByText("トップへ").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  // UT-HDR-03
  it("UT-HDR-03: コラム詳細 (/articles/test-id) 閲覧時、'‹ コラム一覧へ' リンクが表示されること", () => {
    mockUsePathname.mockReturnValue("/articles/test-id");
    render(<Header />);

    const link = screen.getByText("コラム一覧へ").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/articles");
  });

  // UT-HDR-04
  it("UT-HDR-04: サブページ (/privacy) 閲覧時、'‹ トップへ' リンクが表示されること", () => {
    mockUsePathname.mockReturnValue("/privacy");
    render(<Header />);

    const link = screen.getByText("トップへ").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  // UT-HDR-05
  it("UT-HDR-05: カード詳細 (/cards/smbc-nl) 閲覧時、'‹ トップへ' リンクが表示されること", () => {
    mockUsePathname.mockReturnValue("/cards/smbc-nl");
    render(<Header />);

    const link = screen.getByText("トップへ").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
