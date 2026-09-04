import { test, expect } from "@playwright/test";

test.describe("CardItem E2E & Layout Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // TC-01: レスポンシブ2カラムレイアウト確認
  test("TC-01: スマホ画面（幅375px）で画像と主要情報が2カラム構成で表示されること", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const firstCard = page.locator(".w-full.bg-white.rounded-2xl").first();
    await expect(firstCard).toBeVisible();

    const imageContainer = firstCard.locator(".w-28, .w-32").first();
    const rightContent = firstCard.locator(".flex-1.min-w-0").first();

    await expect(imageContainer).toBeVisible();
    await expect(rightContent).toBeVisible();
  });

  // TC-02: 1画面あたりのカード表示密度（縦幅）確認
  test("TC-02: スマホ画面スクロール前（1画面内）に複数のカードが表示されること", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const cards = page.locator(".w-full.bg-white.rounded-2xl");
    const count = await cards.count();

    expect(count).toBeGreaterThanOrEqual(3);
  });

  // TC-06: 公式サイトへのアフィリエイト遷移確認
  test("TC-06: 公式サイトボタンタップで正しい属性・別タブ遷移のリンクが設定されていること", async ({
    page,
  }) => {
    const ctaButton = page.locator("a", { hasText: "公式サイト" }).first();

    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute("target", "_blank");
    await expect(ctaButton).toHaveAttribute(
      "rel",
      "noopener noreferrer sponsored",
    );
  });

  // TC-08: カード詳細ページへの画面遷移確認
  test("TC-08: 詳細ボタンタップでカード詳細ページ（/cards/[id]）に正常に画面遷移すること", async ({
    page,
  }) => {
    const detailButton = page.locator("a", { hasText: "詳細" }).first();
    await expect(detailButton).toBeVisible();

    await detailButton.click();
    await page.waitForURL(/\/cards\/.+/);

    expect(page.url()).toMatch(/\/cards\/.+/);
  });
});
