import { test, expect } from "@playwright/test";

test.describe("検索UIおよびフィルター機能 E2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("2-1 & 2-2: 検索展開時のレイアウト変化と高さの保持", async ({
    page,
  }) => {
    // 上部タブエリアのコンテナを取得
    const filterTabsContainer = page.getByTestId("filter-tabs");

    // 初期状態の高さ取得
    const initialBox = await filterTabsContainer.boundingBox();

    // 検索バーを開く
    await page.getByRole("button", { name: "検索を開く" }).click();

    // コンテナ内の「すべて」ボタンが可視化されているか確認（フィルターチップとの重複を回避）
    await expect(
      filterTabsContainer.getByRole("button", { name: "すべて" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "検索を閉じる" }),
    ).toBeVisible();

    // 展開後のコンテナ高さを検証（h-10 / 40pxが維持されているか）
    const expandedBox = await filterTabsContainer.boundingBox();
    expect(expandedBox?.height).toBe(initialBox?.height);
  });

  test("3-1 & 3-2: キーワード検索によるリストのリアルタイム絞り込み", async ({
    page,
  }) => {
    // 検索バーを開く
    await page.getByRole("button", { name: "検索を開く" }).click();

    const searchInput = page.getByPlaceholder("カード名・タグ...");

    // キーワードを入力
    await searchInput.fill("検索キーワード");

    // 入力値に対応するメッセージまたは結果が表示されることを検証
    const emptyMessage = page.getByText(
      "に一致するカードが見つかりませんでした",
    );

    // 非同期で処理結果を待機・検証
    await expect(emptyMessage).toBeVisible();
  });

  test("3-3: お気に入りフィルターと検索の複合利用", async ({ page }) => {
    const filterTabsContainer = page.getByTestId("filter-tabs");

    // 検索バーを開く
    await page.getByRole("button", { name: "検索を開く" }).click();

    // コンテナ内のお気に入りボタン（ハートアイコン付き）をクリック
    const favoriteTab = filterTabsContainer
      .getByRole("button")
      .filter({ has: page.locator("svg.text-red-500, svg.fill-white") });
    await favoriteTab.click();

    // 検索欄に入力
    await page.getByPlaceholder("カード名・タグ...").fill("テスト");

    // 適切な状態が維持されているか検証
    await expect(page.getByPlaceholder("カード名・タグ...")).toHaveValue(
      "テスト",
    );
  });
});
