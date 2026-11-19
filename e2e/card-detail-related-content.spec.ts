import { test, expect } from "@playwright/test";
import { cards } from "@/data/cards";

test.describe("カード詳細ページ - あわせて読みたいコラム", () => {
  test("関連コラムが表示される", async ({ page }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "あわせて読みたいコラム",
    });

    const links = section.getByRole("link");

    await expect(section).toBeVisible();

    await expect(links.first()).toBeVisible();
  });

  test("指定した関連コンテンツへのリンクが表示される", async ({ page }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "あわせて読みたいコラム",
    });

    const links = section.getByRole("link");

    await expect(links).toHaveCount(2);

    await expect(links.nth(0)).toHaveAttribute(
      "href",
      "/feature/rakuten-cards",
    );

    await expect(links.nth(1)).toHaveAttribute(
      "href",
      "/articles/rakuten-limited-points-guide",
    );
  });
  test("関連コンテンツ未指定のカードは最新記事へフォールバックする", async ({
    page,
  }) => {
    const fallbackCard = cards.find((card) => !card.relatedContents);

    expect(fallbackCard).toBeDefined();

    await page.goto(`/cards/${fallbackCard!.id}`);

    const section = page.getByRole("region", {
      name: "あわせて読みたいコラム",
    });

    await expect(section).toBeVisible();

    const links = section.getByRole("link");

    // フォールバックでは最新記事5件を表示
    await expect(links).toHaveCount(5);

    // すべて記事ページへのリンクになっていることを確認
    for (let i = 0; i < 5; i++) {
      await expect(links.nth(i)).toHaveAttribute("href", /^\/articles\/.+/);
    }
  });
});
