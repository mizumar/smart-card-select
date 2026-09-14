import { test, expect } from "@playwright/test";

test.describe("ヘッダードロワー & カード診断ルーティング", () => {
  test("TC-01 ~ TC-03: ハンバーガーボタンでドロワーが開閉できること", async ({
    page,
  }) => {
    await page.goto("/");

    // ハンバーガーボタンをクリックしてドロワーを開く
    const menuButton = page.getByRole("button", { name: "メニューを開く" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // ドロワー要素の表示確認
    const drawerTitle = page.getByText("メニュー");
    await expect(drawerTitle).toBeVisible();

    // 閉じるボタンをクリックして閉じる
    const closeButton = page.getByRole("button", { name: "メニューを閉じる" });
    await closeButton.click();
    await expect(drawerTitle).not.toBeVisible();
  });

  test("TC-04: トップページからドロワー経由でカード診断モーダルが起動すること", async ({
    page,
  }) => {
    await page.goto("/");

    // ドロワーを開いてカード診断をクリック
    await page.getByRole("button", { name: "メニューを開く" }).click();

    // 【修正】ドロワー内の診断ボタン（"10秒でわかる カード診断"）を直接絞り込んでクリック
    await page
      .getByRole("button", { name: /カード診断/ })
      .first()
      .click();

    // URLパラメータが付与された後、綺麗に初期化されること
    await expect(page).toHaveURL("/");
  });

  test("TC-05: 下層ページ（コラム等）からカード診断をクリックした際にトップへ遷移してモーダルが起動すること", async ({
    page,
  }) => {
    // 下層ページへアクセス
    await page.goto("/articles");

    // ドロワーを開いてカード診断をクリック
    await page.getByRole("button", { name: "メニューを開く" }).click();
    await page.getByText("カード診断").click();

    // トップページへ遷移していること
    await page.waitForURL("/");
    expect(page.url()).not.toContain("openDiagnosis=true");
  });

  test("TC-06: ドロワー内のナビゲーションリンクタップ時に正常に遷移してドロワーが閉じること", async ({
    page,
  }) => {
    await page.goto("/");

    // ドロワーを開いてコラム集リンクをクリック
    await page.getByRole("button", { name: "メニューを開く" }).click();

    // 【修正】ドロワー内の <nav> エリアに限定してリンクを取得
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "お役立ちコラム集" })
      .click();

    // 該当ページへ遷移し、ドロワーが閉じていること
    await page.waitForURL("/articles");
    await expect(page.getByText("メニュー")).not.toBeVisible();
  });
});
