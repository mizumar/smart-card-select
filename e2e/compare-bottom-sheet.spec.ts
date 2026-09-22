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

    // 1. 「別タブが開くイベント」と「元のタブが画面遷移するイベント」を事前に準備し、
    //    クリック操作と同時に並列で発火させる
    const [newPage] = await Promise.all([
      context.waitForEvent("page"), // 1枚目（window.open）の別タブ発生を待機
      page.waitForURL((url) => url.href.includes("http")), // 2枚目（location.href）の自タブ遷移を待機
      openBothButton.click(), // クリック実行
    ]);

    // 2. 別タブ（1枚目）の読み込み完了とURL検証
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain("smbc-card.com");

    // 3. 元のタブ（2枚目）のURL検証
    // waitForURL が完了した時点で page.url() は遷移後のURLになっています
    expect(page.url()).toContain("http");
    // ※ カードBの特定ドメインがわかっている場合は以下のように書けます
    // expect(page.url()).toContain("rakuten-card.co.jp");
  });
});
