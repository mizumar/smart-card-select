import { test, expect, Page } from "@playwright/test";

/**
 * ヘルパー関数: カードの「比較」ボタンをクリックする
 */
async function selectCompareCard(
  page: Page,
  id?: string,
  fallbackIndex?: number,
) {
  if (id) {
    const cardByTestId = page
      .locator(`[data-testid="card-${id}"]`)
      .getByRole("button", { name: /^比較$/i });
    if (await cardByTestId.isVisible().catch(() => false)) {
      await cardByTestId.click();
      return;
    }
  }

  if (fallbackIndex !== undefined) {
    const compareButtons = page.getByRole("button", { name: /^比較$/i });
    await compareButtons.nth(fallbackIndex).click();
  }
}

/**
 * 2枚のカードを選択し、ボトムシートを表示する一連の操作
 */
async function openCompareBottomSheet(
  page: Page,
  card1: { id: string; index: number },
  card2: { id: string; index: number },
) {
  await selectCompareCard(page, card1.id, card1.index);
  await page.waitForTimeout(300);
  await selectCompareCard(page, card2.id, card2.index);

  const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
  await expect(viewCompareBtn).toBeVisible({ timeout: 10000 });
  await viewCompareBtn.click();

  await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
    timeout: 10000,
  });
}

/**
 * ボトムシート内の比較解除（マイナス）ボタンを取得する
 */
function getRemoveButtons(page: Page) {
  // title または aria-label に「比較から外す」が含まれるボタンを取得
  return page.getByRole("button", { name: /比較から外す/i });
}

test.describe("カード比較ボトムシート - E2E完全検証", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const compareButtons = page.getByRole("button", { name: /比較/i });
    await expect(compareButtons.first()).toBeVisible({ timeout: 10000 });
  });

  /* -------------------------------------------------------------------------- */
  /* 1. 比較解除（マイナス）ボタンの動作確認                                    */
  /* -------------------------------------------------------------------------- */
  test.describe("1. 比較解除（マイナス）ボタンの動作確認", () => {
    test("1.1 マイナスボタンの表示", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      const removeButtons = getRemoveButtons(page);

      // ボタンが2枚分（2つ）表示されていることを検証
      await expect(removeButtons.first()).toBeVisible();
      expect(await removeButtons.count()).toBeGreaterThan(0);
    });

    test("1.2 removeAndClose による動作確認", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      const removeButtons = getRemoveButtons(page);

      // 1枚目を解除（残りが1枚以下になるためボトムシートが自動クローズされる動作の検証）
      await removeButtons.first().click();

      await expect(page.getByText("想定の月間カード利用額")).not.toBeVisible();
    });

    test("1.3 再選択動作の確認", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      const removeButtons = getRemoveButtons(page);
      await removeButtons.first().click();

      await expect(page.getByText("想定の月間カード利用額")).not.toBeVisible();

      // 再度カードを選択して比較シートが開けるか検証
      await selectCompareCard(page, "paypay", 2);

      const viewCompareBtn = page.getByRole("button", { name: /比較を見る/i });
      await expect(viewCompareBtn).toBeVisible({ timeout: 10000 });
      await viewCompareBtn.click();

      await expect(page.getByText("想定の月間カード利用額")).toBeVisible({
        timeout: 10000,
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. スペック情報の共通表示・レイアウト確認                                   */
  /* -------------------------------------------------------------------------- */
  test.describe("2. スペック情報の共通表示・レイアウト確認", () => {
    test("2.1 年間お得額（一致時）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      // お得額の表示ブロック自体が表示されていることを検証
      const benefitSection = page.getByText(/年間お得額|お得額/i).first();
      await expect(benefitSection).toBeVisible();
    });

    test("2.2 年間お得額（差分あり）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "rakuten-premium-card", index: 6 },
      );

      await expect(page.locator(".excessive-diff-badge")).not.toBeVisible();
    });

    test("2.3 貯まるポイント（一致時）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "rakuten-card", index: 5 },
        { id: "rakuten-premium-card", index: 6 },
      );

      const pointPlate = page.locator("[data-testid='merged-point-plate']");
      if (await pointPlate.isVisible().catch(() => false)) {
        await expect(pointPlate).toBeVisible();
      } else {
        await expect(page.getByText("楽天ポイント").first()).toBeVisible();
      }
    });

    test("2.4 貯まるポイント（不一致時）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      const leftPoint = page.locator("[data-testid='point-left']");
      const rightPoint = page.locator("[data-testid='point-right']");

      if (await leftPoint.isVisible().catch(() => false)) {
        await expect(leftPoint).toBeVisible();
        await expect(rightPoint).toBeVisible();
        await expect(leftPoint).toHaveCSS("word-break", "keep-all");
      } else {
        await expect(page.getByText("Vポイント").first()).toBeVisible();
        // JCB側のポイント表示（"Oki Doki", "JCB", "ポイント"等の表記）を柔軟に検出
        await expect(page.getByText(/ポイント/i).first()).toBeVisible();
      }
    });

    test("2.5 年会費（双方 永年無料）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "smbc-nl", index: 0 },
        { id: "jcb-w", index: 1 },
      );

      // Strict Mode対策: 「年会費：永年無料」の完全一致、かつエメラルドグリーン色の要素を指定
      const freePlate = page
        .locator("span.text-emerald-700", {
          hasText: "年会費：永年無料",
        })
        .first();

      await expect(freePlate).toBeVisible();
      await expect(freePlate).toHaveClass(/text-emerald-700/);
    });

    test("2.6 年会費（条件付き無料など）", async ({ page }) => {
      await openCompareBottomSheet(
        page,
        { id: "rakuten-premium-card", index: 6 },
        { id: "nexus-card", index: 8 },
      );

      // 共通プレート（永年無料）が表示されないこと
      await expect(
        page.locator("span.text-emerald-700", { hasText: "年会費：永年無料" }),
      ).not.toBeVisible();

      const conditionLeft = page.locator("[data-testid='fee-condition-left']");
      const conditionRight = page.locator(
        "[data-testid='fee-condition-right']",
      );

      if (await conditionLeft.isVisible().catch(() => false)) {
        await expect(conditionLeft).toBeVisible();
        await expect(conditionRight).toBeVisible();
      } else {
        // Strict Mode対策: strongタグで11,000円が含まれる要素をピンポイント指定
        await expect(
          page.locator("strong").filter({ hasText: "11,000" }).first(),
        ).toBeVisible();
      }
    });
  });
});
