import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FavoriteButton } from "../FavoriteButton";
import { useFavoritesStore } from "@/store/useFavoritesStore";

describe("FavoriteButton", () => {
  beforeEach(() => {
    act(() => {
      useFavoritesStore.setState({ favoriteIds: [] });
    });
  });

  test("未登録時は『お気に入りに追加』のアリアラベルで描画されること", () => {
    render(<FavoriteButton cardId="card-1" />);
    const button = screen.getByRole("button", { name: "お気に入りに追加" });
    expect(button).toBeInTheDocument();
  });

  test("クリック時にトグルされ、親要素へのイベント伝播が止まること", () => {
    const parentClickMock = jest.fn();

    render(
      <div onClick={parentClickMock}>
        <FavoriteButton cardId="card-1" />
      </div>,
    );

    const button = screen.getByRole("button");

    // クリック実行
    fireEvent.click(button);

    // 親のクリックイベントが呼ばれていないこと (e.stopPropagation())
    expect(parentClickMock).not.toHaveBeenCalled();

    // アリアラベルがお気に入り解除に変化していること
    expect(
      screen.getByRole("button", { name: "お気に入りから解除" }),
    ).toBeInTheDocument();
    expect(useFavoritesStore.getState().favoriteIds).toContain("card-1");
  });
});
