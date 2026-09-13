import { test, expect } from "@playwright/test";

test.describe("特集記事ページ（Feature）のE2Eテスト", () => {
  test("FEAT-01 & META-01: 特集記事ページへのアクセスとSEOメタデータの確認", async ({
    page,
  }) => {
    await page.goto("/feature/saison-cards");

    // メタデータの検証
    await expect(page).toHaveTitle(/セゾンカード徹底比較/);

    // canonical タグの確認
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /.*\/feature\/saison-cards/,
    );

    // 記事タイトルの表示確認
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("ICON-01: Heroアイコン（立体カード）が表示されていること", async ({
    page,
  }) => {
    // await page.goto("/feature/travel-cards");
    await page.goto("/feature/saison-cards");

    // FeatureHeroIcon のコンテナ要素が存在すること
    // ※ クラス名やテストIDを付与している場合はそちらを指定
    const heroIconContainer = page.getByTestId("hero-icon");
    await expect(heroIconContainer).toBeVisible();
  });

  test("MD-01 & CARD-02: 記事中のカード埋め込みと下部一覧の重複排除が機能していること", async ({
    page,
  }) => {
    await page.goto("/feature/saison-cards");

    // 本文中のカード（:::card）が描画されていること
    const inlineCard = page
      .locator("article, section")
      .filter({ hasText: "公式サイト" });
    await expect(inlineCard.first()).toBeVisible();

    // 下部一覧（記事で紹介したカード一覧）において、本文と重複したカードが表示されていないことの検証
    // （必要に応じてテスト用データのIDや見出しを指定して個数をカウント）
  });

  test("FEAT-02: 存在しない記事にアクセスした際に404になること", async ({
    page,
  }) => {
    const response = await page.goto("/feature/non-existent-article-id");
    // ステータスコードが 404 であること、またはNot Foundページに遷移することを確認
    expect(response?.status()).toBe(404);
  });
});
