import { test, expect } from "@playwright/test";

test.describe("共通ヘッダー E2E テスト", () => {
  // 1. トップページの表示確認
  test("UT-HDR-01: トップページ (/) でサイトタイトルが表示され、戻るボタンが存在しないこと", async ({
    page,
  }) => {
    await page.goto("/");

    // サイトタイトルの確認
    await expect(
      page.getByRole("link", { name: "スマートクレカ比較" }),
    ).toBeVisible();

    // 戻るボタンが存在しないこと
    await expect(
      page.getByRole("link", { name: "トップへ" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("link", { name: "コラム一覧へ" }),
    ).not.toBeVisible();
  });

  // 2. 画面遷移の確認（コラム詳細 -> コラム一覧 -> トップ）
  test("UT-HDR-03 & 02: コラム詳細から一覧、一覧からトップへ正しく遷移できること", async ({
    page,
  }) => {
    // 例として任意のコラム詳細ページへアクセス（実際のIDに変更可能）
    await page.goto("/articles/card-recommend");

    // ヘッダーに「コラム一覧へ」が表示されているか確認
    const toArticlesLink = page.getByRole("link", { name: "コラム一覧へ" });
    await expect(toArticlesLink).toBeVisible();

    // クリックしてコラム一覧ページへ遷移
    await toArticlesLink.click();
    await expect(page).toHaveURL("/articles");

    // コラム一覧ヘッダーに「トップへ」が表示されているか確認
    const toTopLink = page.getByRole("link", { name: "トップへ" });
    await expect(toTopLink).toBeVisible();

    // クリックしてトップページへ遷移
    await toTopLink.click();
    await expect(page).toHaveURL("/");
  });

  // 3. サブページ（プライバシーポリシー）からの遷移
  test("UT-HDR-04: プライバシーポリシー (/privacy) からトップページへ正しく遷移できること", async ({
    page,
  }) => {
    await page.goto("/privacy");

    const toTopLink = page.getByRole("link", { name: "トップへ" });
    await expect(toTopLink).toBeVisible();

    await toTopLink.click();
    await expect(page).toHaveURL("/");
  });

  // 4. 固定表示 (sticky) およびスタイル検証
  test("スクロール時もヘッダーが画面上部に固定表示 (sticky) されること", async ({
    page,
  }) => {
    await page.goto("/privacy");

    const header = page.locator("header");

    // スクロール前のヘッダー可視性確認
    await expect(header).toBeVisible();

    // ページ下部へスクロール
    await page.evaluate(() => window.scrollTo(0, 1000));

    // スクロール後もヘッダーが画面上部 (top: 0 付近) に配置されているか検証
    const boundingBox = await header.boundingBox();
    expect(boundingBox?.y).toBe(0);
  });

  // 5. 二重表示防止の検証
  test("<header> タグがページ内に1つだけしか存在しないこと", async ({
    page,
  }) => {
    await page.goto("/articles/card-recommend");

    const headers = page.locator("header");
    await expect(headers).toHaveCount(1);
  });
});
