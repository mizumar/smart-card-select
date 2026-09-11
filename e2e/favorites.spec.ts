import { test, expect } from "@playwright/test";

test.describe("お気に入り機能 E2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // ローカルストレージをクリアしてトップページへアクセス
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("ハートボタン押下で件数が即座に増減し、お気に入りタブに抽出されること", async ({
    page,
  }) => {
    // 1. 初期状態の確認（exact: true または ^正規表現 でタブボタンのみに絞り込む）
    const favoriteTab = page.getByRole("button", {
      name: /^お気に入り \(\d+\)$/,
    });
    await expect(favoriteTab).toContainText("お気に入り (0)");

    // 2. 1枚目のカードのハートボタンを押す
    const firstCardHeart = page
      .getByRole("button", { name: "お気に入りに追加" })
      .first();
    await firstCardHeart.click();

    // 3. 上部カウントが即座に (1) に更新されること
    await expect(favoriteTab).toContainText("お気に入り (1)");

    // 4. 「お気に入り」タブに切り替え
    await favoriteTab.click();

    // 抽出されたカードが1件表示されていること
    const cardItems = page.locator(".space-y-2\\.5 > div");
    await expect(cardItems).toHaveCount(1);

    // 5. お気に入りタブ内でハートを解除する
    const removeHeart = page.getByRole("button", {
      name: "お気に入りから解除",
    });
    await removeHeart.click();

    // 6. 即座にカードが画面から消え、Empty State（空表示）が表示されること
    await expect(
      page.getByText("お気に入りに追加されたカードはありません"),
    ).toBeVisible();
    await expect(favoriteTab).toContainText("お気に入り (0)");
  });

  test("ページをリロード（F5）してもお気に入り状態が維持されていること", async ({
    page,
  }) => {
    // タブボタンを一意に特定できるロケーターを定義
    const favoriteTab = page.getByRole("button", {
      name: /^お気に入り \(\d+\)$/,
    });

    // ハートボタンを押してお気に入り追加
    const firstCardHeart = page
      .getByRole("button", { name: "お気に入りに追加" })
      .first();
    await firstCardHeart.click();

    await expect(favoriteTab).toContainText("お気に入り (1)");

    // ページリロード
    await page.reload();

    // リロード後も件数が維持されていること
    await expect(favoriteTab).toContainText("お気に入り (1)");
  });
});
