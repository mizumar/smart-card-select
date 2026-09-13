import { test, expect } from "@playwright/test";

test.describe("カード比較ボトムシート - 分岐点・実質0円機能 (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    // 比較ページへアクセス
    await page.goto("/");

    // カード一覧および「比較」ボタンが描画されるまで確実に待機
    const firstCompareBtn = page.getByRole("button", { name: "比較" }).first();
    await expect(firstCompareBtn).toBeVisible({ timeout: 10000 });

    await page.waitForLoadState("domcontentloaded");

    const compareButtons = page.getByRole("button", { name: /比較/i });
    await expect(compareButtons.first()).toBeVisible({ timeout: 10000 });
  });

  /**
   * CT-01: 無料 vs 無料
   * 両方とも年会費0円のカードを選択した際、
   * ボトムシート内に「自動セット」や「損益分岐点」が出現しないことを検証
   */
  test("無料 vs 無料: 自動セットチップが表示されないこと (CT-01)", async ({
    page,
  }) => {
    // 1. 無料カードを2枚選択（「比較」ボタンを上から2つタップ）
    const compareButtons = page.getByRole("button", { name: "比較" });
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();

    // 2. 「比較を見る」ボタンを押してボトムシートを開く
    const viewCompareBtn = page.getByRole("button", { name: "比較を見る" });
    await expect(viewCompareBtn).toBeVisible();
    await viewCompareBtn.click();

    // 3. ボトムシートが表示されたことを確認
    const bottomSheet = page
      .locator("div")
      .filter({ hasText: "想定の月間カード利用額" })
      .first();
    // テストIDまたは画面上のテキストを直接待ち受ける
    await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
      timeout: 10000,
    });

    // 4. 無料同士のため「自動セット」関連のチップが存在しないことを検証
    await expect(page.getByText("自動セット")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "損益分岐点" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "実質0円" }),
    ).not.toBeVisible();
  });
  /**
   * CT-01: 無料 vs 無料の比較ケース
   * 両方とも年会費0円のカードを選択した際、
   * ボトムシート内に「自動セット」や「損益分岐点」「実質0円」が出現しないことを検証
   */
  test("CT-01: 無料 vs 無料のケースで自動セットチップが表示されないこと", async ({
    page,
  }) => {
    // 1. 無料カードを2枚選択（例: JCB CARD W と もう1枚の無料カード）
    // ※ カードコンポーネント内の比較ボタンをクリックします
    const compareButtons = page.getByRole("button", { name: /比較/i });

    // 無料カードが連続している上部2つを選択
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();

    // 2. 「比較を見る」ボタンを押してボトムシートを表示
    const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
    await expect(viewCompareBtn).toBeVisible();
    await viewCompareBtn.click();

    // 3. ボトムシートが開いてコンテンツが描写されたことを確認
    await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
      timeout: 10000,
    });

    // 4. 無料同士のため「自動セット」「損益分岐点」「実質0円」が表示されないこと
    await expect(page.getByText("自動セット")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /損益分岐点/i }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /実質0円/i }),
    ).not.toBeVisible();
  });
  /**
   * IT-02: 「実質0円」チップの自動セット動作
   */

  test("IT-02: 有料カードの「実質0円」チップタップで月額利用額を自動セット", async ({
    page,
  }) => {
    const compareButtons = page.getByRole("button", { name: /比較/i });

    // 1枚目：無料カード（0番目：三井住友カード NL）
    await compareButtons.nth(0).click();
    await page.waitForTimeout(300);

    // 2枚目：有料カード（6番目：楽天プレミアムカード）
    await compareButtons.nth(6).click();

    // 「比較を見る」でボトムシートを開く
    const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
    await expect(viewCompareBtn).toBeVisible({ timeout: 10000 });
    await viewCompareBtn.click();

    // ボトムシート確認
    await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
      timeout: 10000,
    });

    // 有料カードが含まれているため「実質0円」チップを検証
    const zeroSpendBtn = page.getByRole("button", { name: /実質0円/i }).first();
    await expect(zeroSpendBtn).toBeVisible({ timeout: 5000 });
    await zeroSpendBtn.click();

    // アクティブ表示（bg-slate-800）の検証
    await expect(zeroSpendBtn).toHaveClass(/bg-slate-800/);

    // スライダーの値が更新されたことを確認
    const slider = page.locator("input[type='range']");
    await expect(slider).not.toHaveValue("100000");
  });
});
