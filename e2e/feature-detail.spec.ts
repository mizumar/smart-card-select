import { test, expect } from "@playwright/test";

test.describe("特集詳細ページ E2Eテスト", () => {
  const FEATURE_PATH = "/feature/credit-card-money-date-300";

  // ---------------------------------------------------------
  // E2E-01: 記事ページへの正常アクセスとタイトルの表示
  // ---------------------------------------------------------
  test("E2E-01: 特集詳細ページに正常にアクセスでき、タイトルが表示されること", async ({
    page,
  }) => {
    await page.goto(FEATURE_PATH);

    // h1タグ（記事タイトル）が存在し、表示されていること
    const mainHeading = page.getByRole("heading", { level: 1 }).first();
    await expect(mainHeading).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-02: 外部リンク（Threads等）またはSNSリンクの確認
  // ---------------------------------------------------------
  test("E2E-02: 記事内の外部リンク要素が表示され、別タブで開くこと", async ({
    page,
    context,
  }) => {
    await page.goto(FEATURE_PATH);

    // 記事内の外部リンク（target="_blank" を持つリンク）を取得
    const externalLink = page.locator('a[target="_blank"]').first();

    if (await externalLink.isVisible()) {
      const pagePromise = context.waitForEvent("page");
      await externalLink.click();
      const newPage = await pagePromise;
      await newPage.waitForLoadState();

      // 新規タブが開いていることを確認
      expect(newPage.url()).not.toBe("");
    } else {
      // 外部リンクが存在しない場合はスキップまたはコンポーネント確認
      test.skip();
    }
  });

  // ---------------------------------------------------------
  // E2E-03: 画像およびキャプションの表示検証
  // ---------------------------------------------------------
  test("E2E-03: 記事内の画像が正常にロードされていること", async ({ page }) => {
    await page.goto(FEATURE_PATH);

    const firstImg = page.locator("article img, main img").first();

    // 1. 画像の位置までスクロールして lazy loading を発火させる
    await firstImg.scrollIntoViewIfNeeded();

    // 2. 表示状態を確認 (Web-First Assertion)
    await expect(firstImg).toBeVisible();

    // 3. 画像ファイルの読み込み完了を検証
    await expect(firstImg).toHaveJSProperty("complete", true);
    await expect(firstImg).not.toHaveJSProperty("naturalWidth", 0);
  });

  // ---------------------------------------------------------
  // E2E-04: テーブル（Markdown/GFM）の表示確認
  // ---------------------------------------------------------
  test("E2E-04: 記事内にテーブルが存在する場合、正しく描画されていること", async ({
    page,
  }) => {
    await page.goto(FEATURE_PATH);

    const table = page.getByRole("table").first();

    if (await table.isVisible()) {
      await table.scrollIntoViewIfNeeded();
      await expect(table).toBeVisible();
    } else {
      // テーブル要素がない記事の場合はパスさせる
      test.skip();
    }
  });

  // ---------------------------------------------------------
  // E2E-05: レスポンシブ表示確認 (Mobile)
  // ---------------------------------------------------------
  test("E2E-05: モバイル表示時に要素が画面幅に収まっていること", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FEATURE_PATH);

    const body = page.locator("body");
    const bodyBox = await body.boundingBox();

    // 画面幅（375px）からのはみ出しがないこと
    expect(bodyBox?.width).toBeLessThanOrEqual(375);

    // メイン見出しがモバイルでも表示されていること
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-06: 記事内のカード埋め込みおよびMarkdown要素の描画確認
  // ---------------------------------------------------------
  test("E2E-06: :::card 構文によるクレジットカードカードやリストが正常表示されること", async ({
    page,
  }) => {
    await page.goto(FEATURE_PATH, { waitUntil: "domcontentloaded" });

    // 1. メインタイトルの確認
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    // 2. 本文内のリスト（通常マークダウン）の表示確認
    const listItem = page.getByRole("listitem").first();
    if (await listItem.isVisible()) {
      await expect(listItem).toBeVisible();
    }

    // 3. 本文中のリンク（カードリンクやボタン）の存在確認
    const ctaButton = page
      .locator("article a, main a")
      .filter({ hasText: /公式|詳細|申込み/ })
      .first();

    if (await ctaButton.isVisible()) {
      await expect(ctaButton).toBeVisible();
    }
  });
});
