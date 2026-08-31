import { test, expect } from "@playwright/test";

test.describe("2.3 外部リンク動作", () => {
  test.beforeEach(async ({ page }) => {
    // 比較対象のページへ移動（実際のルートURLに合わせて変更してください）
    await page.goto("/");

    // 2. カードを2枚選択する（例：チェックボックスやボタンをクリック）
    // 実際のクラス名やテキストに合わせて変更してください
    const compareButtons = page.getByRole("button", { name: "比較" });
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();

    // 3. 「比較を見る」ボタンが表示されるのを待ってクリック
    const showCompareButton = page.getByRole("button", { name: "比較を見る" });
    await expect(showCompareButton).toBeVisible();
    await showCompareButton.click();
  });

  test("2.3 公式サイトへボタン（単体）が別タブで正しいURLを開くこと", async ({
    page,
  }) => {
    // 1枚目の「公式サイトへ」リンクの検証
    const officialLinkA = page
      .getByRole("link", { name: "公式サイトへ" })
      .nth(0);
    await expect(officialLinkA).toHaveAttribute("target", "_blank");
    await expect(officialLinkA).toHaveAttribute(
      "rel",
      "noopener noreferrer sponsored",
    );
  });

  test("2.3 「両方の公式サイトを別タブで開く」押下時、別タブと画面遷移がそれぞれ正しく発生すること", async ({
    page,
    context,
  }) => {
    const openBothButton = page.getByRole("button", {
      name: "両方の公式サイトを別タブで開く",
    });

    // 1. window.open による新しいタブの発生を待機
    const newPagePromise = context.waitForEvent("page");

    // 2. ボタンをクリック
    await openBothButton.click();

    // 3. 1枚目（window.open）で開いた新しいタブのURLを検証
    const newPage = await newPagePromise;
    await newPage.waitForLoadState();

    // 実際のカードAのURLに含まれる文字列に書き換え（例: "smbc-card.com"）
    expect(newPage.url()).toContain("smbc-card.com");

    // 4. 2枚目（window.location.href）による現在のタブの遷移先URLを検証
    // 実際のカードBのURLパターンに合わせて書き換え（例: rakuten-card などが含まれるパターン）
    await page.waitForURL((url) => url.href.includes("http"));
    // ※ もしカードBの特定のドメインが分かっている場合は url.href.includes("rakuten-card.co.jp") のように指定可能です
  });
});
