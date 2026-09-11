// __tests__/SearchInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "@/components/SearchInput";

describe("2.1 SearchInput コンポーネント単体テスト", () => {
  const mockOnChange = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1-1: 初期状態の表示 (isOpen: false)", () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        isOpen={false}
        onToggle={mockOnToggle}
      />,
    );

    const openButton = screen.getByRole("button", { name: "検索を開く" });
    expect(openButton).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("カード名・タグ..."),
    ).not.toBeInTheDocument();
  });

  test("1-2: 検索バー展開 (isOpen: true)", () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        isOpen={true}
        onToggle={mockOnToggle}
      />,
    );

    expect(
      screen.getByPlaceholderText("カード名・タグ..."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "検索を閉じる" }),
    ).toBeInTheDocument();
  });

  test("1-3: テキスト入力", () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        isOpen={true}
        onToggle={mockOnToggle}
      />,
    );

    const input = screen.getByPlaceholderText("カード名・タグ...");
    fireEvent.change(input, { target: { value: "テスト" } });

    expect(mockOnChange).toHaveBeenCalledWith("テスト");
  });

  test("1-4: 検索の終了", () => {
    render(
      <SearchInput
        value="検索中"
        onChange={mockOnChange}
        isOpen={true}
        onToggle={mockOnToggle}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "検索を閉じる" });
    fireEvent.click(closeButton);

    expect(mockOnChange).toHaveBeenCalledWith("");
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });
});
