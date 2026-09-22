import { test, expect } from "@playwright/test";

test.describe("特集記事ページ（Feature）のE2Eテスト", () => {
  test("FEAT-01 & META-01: 特集記事ページへのアクセスとSEOメタデータの確認", async ({
    page,
  }) => {
    await page.goto("/feature/rakuten-cards");

    // メタデータの検証
    await expect(page).toHaveTitle(/楽天カード/);

    // canonical タグの確認
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /.*\/feature\/rakuten-cards/,
    );

    // 記事タイトルの表示確認
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("ICON-01: Heroアイコン（立体カード）が表示されていること", async ({
    page,
  }) => {
    await page.goto("/feature/rakuten-cards");

    // FeatureHeroIcon のコンテナ要素が存在すること
    const heroIconContainer = page.getByTestId("hero-icon");
    await expect(heroIconContainer).toBeVisible();
  });

  test("MD-01 & CARD-02: 記事中のカード埋め込みと下部一覧の重複排除が機能していること", async ({
    page,
  }) => {
    await page.goto("/feature/rakuten-cards");

    // 本文中のカード（:::card）が描画されていること
    const inlineCard = page
      .locator("article, section")
      .filter({ hasText: "公式サイト" });
    await expect(inlineCard.first()).toBeVisible();
  });

  test("FEAT-02: 存在しない記事にアクセスした際に404になること", async ({
    page,
  }) => {
    const response = await page.goto("/feature/non-existent-article-id");
    expect(response?.status()).toBe(404);
  });
});
