import { test, expect } from "@playwright/test";

test.describe("カード比較ボトムシート - CT-01 & IT-02", () => {
  test.beforeEach(async ({ page }) => {
    // 404の発生していた "/compare" から 正しいルート "/" へ変更
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const compareButtons = page.getByRole("button", { name: /比較/i });
    await expect(compareButtons.first()).toBeVisible({ timeout: 10000 });
  });

  /**
   * CT-01: 無料 vs 無料
   */
  test("CT-01: 無料 vs 無料のケースで自動セットチップが表示されないこと", async ({
    page,
  }) => {
    // インデックス頼みではなく特定のカード要素内の「比較」ボタンを選択
    const smbcCard = page
      .locator('[data-testid="card-smbc-nl"]')
      .getByRole("button", { name: /比較/i });
    const jcbCard = page
      .locator('[data-testid="card-jcb-w"]')
      .getByRole("button", { name: /比較/i });

    // フォールバック: データ属性がない場合は従来のボタン選択
    const compareButtons = page.getByRole("button", { name: /比較/i });
    if (await smbcCard.isVisible()) {
      await smbcCard.click();
      await jcbCard.click();
    } else {
      await compareButtons.nth(0).click();
      await page.waitForTimeout(300);
      await compareButtons.nth(1).click();
    }

    // 「比較を見る」でボトムシートを表示
    const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
    await expect(viewCompareBtn).toBeVisible({ timeout: 10000 });
    await viewCompareBtn.click();

    // ボトムシートの要素読み込みを待機
    await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
      timeout: 10000,
    });

    // ロジック非表示の検証
    await expect(page.getByText("自動セット")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /損益分岐点/i }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /実質0円/i }),
    ).not.toBeVisible();
  });

  /**
   * IT-02: 有料カード選択時の「実質0円」動作
   */
  test("IT-02: 有料カードの「実質0円」チップタップで月額利用額を自動セット", async ({
    page,
  }) => {
    const compareButtons = page.getByRole("button", { name: /比較/i });

    await compareButtons.nth(0).click();
    await page.waitForTimeout(300);
    await compareButtons.nth(6).click();

    const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
    await expect(viewCompareBtn).toBeVisible({ timeout: 10000 });
    await viewCompareBtn.click();

    await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
      timeout: 10000,
    });

    const zeroSpendBtn = page.getByRole("button", { name: /実質0円/i }).first();
    await expect(zeroSpendBtn).toBeVisible({ timeout: 5000 });
    await zeroSpendBtn.click();

    await expect(zeroSpendBtn).toHaveClass(/bg-slate-800/);

    const slider = page.locator("input[type='range']");
    await expect(slider).not.toHaveValue("100000");
  });
});
