import { test, expect } from "@playwright/test";

test.describe("記事詳細ページ - 関連するカード", () => {
  test("関連するカードが表示される", async ({ page }) => {
    await page.goto("/articles/rakuten-limited-points-guide");

    const section = page.getByRole("region", {
      name: "関連するカード",
    });

    await expect(section).toBeVisible();

    const links = section.getByRole("link");

    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute("href", "/cards/rakuten-card");
    await expect(links.nth(1)).toHaveAttribute(
      "href",
      "/cards/rakuten-premium-card",
    );
  });
});
