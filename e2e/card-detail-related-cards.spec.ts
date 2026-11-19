import { test, expect } from "@playwright/test";

test.describe("カード詳細ページ - 関連するカード", () => {
  test("関連するカードが表示される", async ({ page }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "関連するカード",
    });

    const links = section.getByRole("link");

    await expect(section).toBeVisible();
    await expect(links.first()).toBeVisible();
  });

  test("関連するカードのリンクがカード詳細ページになっている", async ({
    page,
  }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "関連するカード",
    });

    const links = section.getByRole("link");

    await expect(links.first()).toHaveAttribute("href", /^\/cards\/.+/);
  });

  test("現在表示しているカード自身は関連カードに表示されない", async ({
    page,
  }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "関連するカード",
    });

    const links = section.getByRole("link");

    const hrefs = await links.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")),
    );

    expect(hrefs).not.toContain("/cards/rakuten-card");
  });
  test("関連するカードは最大4件まで表示される", async ({ page }) => {
    await page.goto("/cards/rakuten-card");

    const section = page.getByRole("region", {
      name: "関連するカード",
    });

    const links = section.getByRole("link");

    await expect(links).toHaveCount(4);
  });
});
