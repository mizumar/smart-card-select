import { test, expect } from "@playwright/test";

test.describe("コラム機能 (Markdown移行) E2E・画面表示テスト", () => {
  // A. コラム一覧ページ (/articles)
  test.describe("一覧ページ (/articles)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/articles");
    });

    test("IT-01 & IT-02: 記事カード群およびメタ情報が画面描画されること", async ({
      page,
    }) => {
      const articleCards = page.locator('main a[href^="/articles/"]');
      await expect(articleCards.first()).toBeVisible();

      const firstCard = articleCards.first();
      await expect(firstCard.locator("h2")).not.toBeEmpty();
      await expect(firstCard).toContainText("分");
      await expect(firstCard).toContainText("202");

      await page.screenshot({
        path: "tests/screenshots/IT-01_articles_list.png",
        fullPage: true,
      });
    });

    // 【追加】IT-03: 一覧画面での日付降順（新しい順）ソート検証
    test("IT-03: 画面上に表示されている記事が日付の降順（新しい順）で並んでいること", async ({
      page,
    }) => {
      const articleCards = page.locator('main a[href^="/articles/"]');
      const count = await articleCards.count();

      // 記事が2件以上ある場合に並び順をチェック
      if (count >= 2) {
        const dates: number[] = [];

        for (let i = 0; i < count; i++) {
          const card = articleCards.nth(i);
          // カード内の日付文字列（例: "2026.08.19" や "2026-08-19"）を取得
          const dateText = await card
            .locator('span:has-text("202")')
            .innerText();
          // 比較しやすいようにタイムスタンプ（数値）に変換
          const timestamp = new Date(
            dateText.trim().replace(/\./g, "-"),
          ).getTime();
          dates.push(timestamp);
        }

        // 上のカードの日付が下のカード以上（降順）になっているか判定
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }
    });

    test("IT-04: カードタップにより詳細ページへ画面遷移すること", async ({
      page,
    }) => {
      const firstCard = page.locator('main a[href^="/articles/"]').first();
      const href = await firstCard.getAttribute("href");

      await firstCard.click();
      await page.waitForURL(`**${href}`);

      expect(page.url()).toContain(href!);
    });
  });

  // B. コラム詳細ページ (/articles/[id])
  test.describe("詳細ページ (/articles/[id])", () => {
    test("IT-05 & IT-07: マークダウンおよび @tailwindcss/typography スタイルが描画されること", async ({
      page,
    }) => {
      await page.goto("/articles/rakuten-limited-points-guide");

      await expect(page.locator("h1")).toBeVisible();

      const articleBody = page.locator("article .prose");
      await expect(articleBody).toBeVisible();
      await expect(articleBody.locator("h2").first()).toBeVisible();

      await page.screenshot({
        path: "tests/screenshots/IT-05_article_detail_rendered.png",
        fullPage: true,
      });
    });

    test("IT-06: 存在しない URL へのアクセス時に 404 がレスポンスされること", async ({
      page,
    }) => {
      const response = await page.goto("/articles/dummy-id-999");
      expect(response?.status()).toBe(404);

      await page.screenshot({ path: "tests/screenshots/IT-06_not_found.png" });
    });
  });
});
