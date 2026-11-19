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

  test("関連記事未指定の記事は自分自身を除外して最新記事へフォールバックする", async ({
    page,
  }) => {
    const fallbackArticle = getAllArticles().find(
      (article) => !article.relatedArticles,
    );

    expect(
      fallbackArticle,
      "relatedArticles未設定の記事が必要です",
    ).toBeDefined();

    await page.goto(`/articles/${fallbackArticle!.id}`);

    const section = page.getByRole("region", {
      name: "あわせて読みたいコラム",
    });

    await expect(section).toBeVisible();

    const links = section.getByRole("link");

    await expect(links).toHaveCount(5);

    for (let i = 0; i < 5; i++) {
      await expect(links.nth(i)).toHaveAttribute("href", /^\/articles\/.+/);

      await expect(links.nth(i)).not.toHaveAttribute(
        "href",
        `/articles/${fallbackArticle!.id}`,
      );
    }
  });
});
