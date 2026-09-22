import { test, expect } from "@playwright/test";

test.describe("ヘルプドロワー (HelpDrawer) E2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // トップページへアクセス
    await page.goto("/");
  });

  // E2E-01: ヘルプドロワーの開閉表示確認
  test("E2E-01: ヘッダーのヘルプボタンを押すと HelpDrawer が開くこと", async ({
    page,
  }) => {
    const helpButton = page.getByRole("button", { name: "使い方・概要を見る" });
    await expect(helpButton).toBeVisible();

    await helpButton.click();

    // ドロワータイトルが表示され、可視化されているか確認
    const drawerTitle = page.getByText("使い方ガイド");
    await expect(drawerTitle).toBeVisible();
  });

  // E2E-02: 閉じる操作の確認
  test("E2E-02: 閉じるボタンをクリックすると HelpDrawer が閉じること", async ({
    page,
  }) => {
    // ドロワーを開く
    await page.getByRole("button", { name: "使い方・概要を見る" }).click();

    const closeButton = page.getByRole("button", { name: "ヘルプを閉じる" });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // ドロワーが非表示になること
    await expect(page.getByText("使い方ガイド")).not.toBeVisible();
  });

  // E2E-03: アコーディオン切り替え動作
  test("E2E-03: 『お気に入り・2枚比較・お得額計算』アコーディオンを開くとシミュレーターの解説が表示されること", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "使い方・概要を見る" }).click();

    // 「お気に入り・2枚比較・お得額計算」のアコーディオンをクリック
    const compareAccordion = page.getByRole("button", {
      name: /お気に入り・2枚比較・お得額計算/,
    });
    await compareAccordion.click();

    // 解説テキストが表示されていることをアサート
    await expect(page.getByText("年間実質お得額シミュレーター")).toBeVisible();
    await expect(
      page.getByText(/月間利用額のスライダー（0〜100万円）を動かすだけで/),
    ).toBeVisible();
  });

  // E2E-04: コラム一覧への導線確認
  test("E2E-04: 『コラム記事一覧を見る』をクリックすると /articles へ遷移すること", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "使い方・概要を見る" }).click();

    const articlesLink = page.getByRole("link", {
      name: "コラム記事一覧を見る",
    });
    await expect(articlesLink).toBeVisible();
    await articlesLink.click();

    // URLが /articles に変更されたかチェック
    await expect(page).toHaveURL(/\/articles$/);
  });
});
