import { render, screen, fireEvent, within } from "@testing-library/react";
import Home from "@/app/page";

describe("2.2 & 2.3 メイン画面 フィルタリング・レイアウトテスト", () => {
  test("2-1 & 2-3: 検索展開時のタブ変化および閉じた時の表示復元", () => {
    render(<Home />);

    // 上部タブコンテナを取得
    const tabsContainer = screen.getByTestId("filter-tabs");

    // 初期状態：コンテナ内の「すべて表示」「お気に入り」ボタンを確認
    expect(
      within(tabsContainer).getByRole("button", { name: /すべて表示/ }),
    ).toBeInTheDocument();
    expect(
      within(tabsContainer).getByRole("button", { name: /お気に入り/ }),
    ).toBeInTheDocument();

    // 検索アイコンを押下して展開
    const openButton = screen.getByRole("button", { name: "検索を開く" });
    fireEvent.click(openButton);

    // 展開後：コンテナ内が「すべて」のみに切り替わっているか検証
    expect(
      within(tabsContainer).getByRole("button", { name: "すべて" }),
    ).toBeInTheDocument();
    expect(
      within(tabsContainer).queryByRole("button", { name: /すべて表示/ }),
    ).not.toBeInTheDocument();

    // 閉じるボタンを押下
    const closeButton = screen.getByRole("button", { name: "検索を閉じる" });
    fireEvent.click(closeButton);

    // 復元後：元の表記に戻っているか検証
    expect(
      within(tabsContainer).getByRole("button", { name: /すべて表示/ }),
    ).toBeInTheDocument();
    expect(
      within(tabsContainer).getByRole("button", { name: /お気に入り/ }),
    ).toBeInTheDocument();
  });

  test("3-1 & 3-4: キーワード検索と該当データなしの表示", () => {
    render(<Home />);

    // 検索バーを展開
    fireEvent.click(screen.getByRole("button", { name: "検索を開く" }));

    const input = screen.getByPlaceholderText("カード名・タグ...");

    // 該当しないキーワードを入力
    fireEvent.change(input, { target: { value: "存在しないカード999" } });

    // 空状態のメッセージが表示されるか確認
    expect(
      screen.getByText(
        "「存在しないカード999」に一致するカードが見つかりませんでした",
      ),
    ).toBeInTheDocument();
  });
});
