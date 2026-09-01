import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE サイズ

test("375px画面幅でスライダーと比較モーダルがはみ出さずに表示されること", async ({
  page,
}) => {
  await page.goto("/");

  // 1. カードを2枚選択する（※実際のUIの「比較に追加」ボタンやチェックボックスの指定に書き換えてください）
  const compareButtons = page.locator('button:has-text("比較")'); // 例: 比較トグルボタン
  await compareButtons.nth(0).click();
  await compareButtons.nth(1).click();

  // 2. 「比較を見る」ボタンが表示されるのを待ってクリック
  const openCompareModalBtn = page.locator("text=比較を見る");
  await expect(openCompareModalBtn).toBeVisible();
  await openCompareModalBtn.click();

  // 3. モーダル内のスライダーが表示されているか確認
  const sliderBox = page.locator('input[type="range"]');
  await expect(sliderBox).toBeVisible();

  // 4. 375px幅で横スクロール（はみ出し）が発生していないかチェック
  const isHorizontalScrollbarVisible = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });

  expect(isHorizontalScrollbarVisible).toBe(false);
});
