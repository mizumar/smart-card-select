import { test, expect } from "@playwright/test";

test.describe("トップページ - 特集セクション", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("TC-01 & TC-02: 特集セクションの見出しおよびカード要素が表示されていること", async ({
    page,
  }) => {
    // 特集セクションの見出し要素の存在確認
    const featureHeading = page.getByRole("heading", {
      level: 2,
      name: "特集",
    });
    await expect(featureHeading).toBeVisible();

    // 少なくとも1つ以上の「FEATURE」ラベル付きカードが存在すること
    const featureLabel = page.getByText("FEATURE").first();
    await expect(featureLabel).toBeVisible();

    // 「詳しく見る」テキストリンクが存在すること
    const readMoreLink = page.getByText(/詳しく見る/i).first();
    await expect(readMoreLink).toBeVisible();
  });

  test("TC-04: 特集カードをクリックして対象の特集ページへ遷移できること", async ({
    page,
  }) => {
    // 最初の特集リンクを取得してクリック
    const firstFeatureCard = page
      .locator("section")
      .filter({ hasText: "特集" })
      .getByRole("link")
      .first();

    const expectedHref = await firstFeatureCard.getAttribute("href");
    expect(expectedHref).toBeTruthy();

    await firstFeatureCard.click();

    // 期待されるURLへ遷移しているか検証
    await page.waitForURL(`**${expectedHref}`);
    expect(page.url()).toContain(expectedHref!);
  });

  test("TC-06: 画面描画時にコンソールエラー（Key重複等）が発生していないこと", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    // コンソールエラーの監視
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();

    // 重複キーなどの警告・エラーが出ていないことを確認
    const hasDuplicateKeyError = consoleErrors.some((err) =>
      err.includes("Encountered two children with the same key"),
    );
    expect(hasDuplicateKeyError).toBe(false);
  });
});
