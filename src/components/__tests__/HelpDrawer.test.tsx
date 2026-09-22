import { render, screen, fireEvent } from "@testing-library/react";
import { HelpDrawer } from "../HelpDrawer";
import { Header } from "../Header";

// next/navigation のモック（usePathname と useRouter の両方を定義）
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("HelpDrawer Component Tests", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  // UT-01: 非表示状態のレンダリング
  it("UT-01: isOpen={false} の場合、何もレンダリングされないこと", () => {
    const { container } = render(
      <HelpDrawer isOpen={false} onClose={mockOnClose} />,
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("使い方ガイド")).not.toBeInTheDocument();
  });

  // UT-02: 表示状態のレンダリング
  it("UT-02: isOpen={true} の場合、タイトル『使い方ガイド』が表示されること", () => {
    render(<HelpDrawer isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("使い方ガイド")).toBeInTheDocument();
  });

  // UT-03: 閉じるボタンのクリックイベント
  it("UT-03: 閉じるボタン（X）をクリックした際、onClose が呼び出されること", () => {
    render(<HelpDrawer isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button", { name: "ヘルプを閉じる" });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // UT-04: バックドロップのクリックイベント
  it("UT-04: バックドロップ領域をクリックした際、onClose が呼び出されること", () => {
    const { container } = render(
      <HelpDrawer isOpen={true} onClose={mockOnClose} />,
    );
    // 最初の div がバックドロップ領域 (aria-hidden="true")
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).not.toBeNull();
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  // UT-05: アコーディオンの初期表示チェック
  it("UT-05: 初期状態では『10秒カード診断』のアコーディオンが開いていること", () => {
    render(<HelpDrawer isOpen={true} onClose={mockOnClose} />);
    expect(
      screen.getByText("あなたにマッチしたカードが提案されます"),
    ).toBeInTheDocument();
  });

  // UT-06: アコーディオンの開閉動作
  it("UT-06: 『お気に入り・2枚比較・お得額計算』をクリックした際、開閉状態が正しく切り替わること", () => {
    render(<HelpDrawer isOpen={true} onClose={mockOnClose} />);

    // 初期状態では比較アコーディオンの中身は非表示
    expect(
      screen.queryByText("年間実質お得額シミュレーター"),
    ).not.toBeInTheDocument();

    // 「お気に入り・2枚比較・お得額計算」のアコーディオンボタンをクリック
    const compareAccordionBtn = screen
      .getByText("お気に入り・2枚比較・お得額計算")
      .closest("button");
    expect(compareAccordionBtn).not.toBeNull();
    if (compareAccordionBtn) {
      fireEvent.click(compareAccordionBtn);
    }

    // 該当アコーディオンが展開され、コンテンツが表示されること
    expect(
      screen.getByText("年間実質お得額シミュレーター"),
    ).toBeInTheDocument();

    // 逆に初期開いていた診断アコーディオンは閉じること
    expect(
      screen.queryByText("あなたにマッチしたカードが提案されます"),
    ).not.toBeInTheDocument();
  });
});

describe("Header Integration Tests", () => {
  // UT-07: Header 内のヘルプボタン動作
  it("UT-07: Header 内のヘルプボタンが存在し、クリックで HelpDrawer が開くこと", () => {
    render(<Header />);

    // 初期状態では HelpDrawer は閉じている
    expect(screen.queryByText("使い方ガイド")).not.toBeInTheDocument();

    // ヘルプボタンを取得してクリック
    const helpButton = screen.getByRole("button", {
      name: "使い方・概要を見る",
    });
    expect(helpButton).toBeInTheDocument();
    fireEvent.click(helpButton);

    // HelpDrawer が開くこと
    expect(screen.getByText("使い方ガイド")).toBeInTheDocument();
  });
});
