import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderDrawer } from "../HeaderDrawer";
import { useRouter } from "next/navigation";

// next/navigation のモック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HeaderDrawer", () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("isOpenがfalseの場合は何も表示されないこと", () => {
    const { container } = render(
      <HeaderDrawer isOpen={false} onClose={mockOnClose} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("isOpenがtrueのときにメニューコンテンツが表示されること", () => {
    render(<HeaderDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("メニュー")).toBeInTheDocument();
    expect(screen.getByText("カード診断")).toBeInTheDocument();
    expect(screen.getByText("トップページ")).toBeInTheDocument();
  });

  it("閉じるボタンをクリックするとonCloseが呼ばれること", () => {
    render(<HeaderDrawer isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", {
      name: "メニューを閉じる",
    });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("カード診断をタップした際にonCloseが呼ばれ、/?openDiagnosis=true へ遷移すること", () => {
    render(<HeaderDrawer isOpen={true} onClose={mockOnClose} />);

    const diagnosisButton = screen.getByText("カード診断");
    fireEvent.click(diagnosisButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/?openDiagnosis=true");
  });
});
