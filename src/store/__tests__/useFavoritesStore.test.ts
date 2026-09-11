import { act } from "@testing-library/react";
import { useFavoritesStore } from "../useFavoritesStore";

describe("useFavoritesStore", () => {
  beforeEach(() => {
    // 各テスト前にストアとlocalStorageを初期化
    localStorage.clear();
    act(() => {
      useFavoritesStore.setState({ favoriteIds: [] });
    });
  });

  test("初期状態では favoriteIds が空配列であること", () => {
    const state = useFavoritesStore.getState();
    expect(state.favoriteIds).toEqual([]);
  });

  test("toggleFavorite で ID の追加と削除が正しく動作すること", () => {
    // 追加の検証
    act(() => {
      useFavoritesStore.getState().toggleFavorite("card-1");
    });
    expect(useFavoritesStore.getState().favoriteIds).toEqual(["card-1"]);
    expect(useFavoritesStore.getState().isFavorite("card-1")).toBe(true);

    // 削除の検証（同じIDを再度呼び出す）
    act(() => {
      useFavoritesStore.getState().toggleFavorite("card-1");
    });
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite("card-1")).toBe(false);
  });
});
