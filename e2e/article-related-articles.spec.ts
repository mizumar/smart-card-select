import { test, expect } from "@playwright/test";
import { getAllArticles } from "@/lib/articles";

test.describe("記事詳細ページ - あわせて読みたいコラム", () => {
  test("指定した関連記事が表示される", async ({ page }) => {
    await page.goto("/articles/rakuten-limited-points-guide");

    const section = page.getByRole("region", {
      name: "あわせて読みたいコラム",
    });

    await expect(section).toBeVisible();

    const links = section.getByRole("link");

    await expect(links).toHaveCount(2);

    await expect(links.nth(0)).toHaveAttribute(
      "href",
      "/articles/credit-card-2350-choices",
    );

    await expect(links.nth(1)).toHaveAttribute(
      "href",
      "/articles/credit-card-selection-experience-01",
    );
  });
});
