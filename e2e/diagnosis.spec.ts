import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test.describe("診断機能 E2Eフロー検証", () => {
  test("診断回答から結果画面の動的表示・公式リンク遷移・レスポンシブ崩れがないこと", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. バナーをクリックしてモーダルを開く
    const banner = page.getByText("カード診断").first();
    await expect(banner).toBeVisible({ timeout: 5000 });
    await banner.click();

    // 2. 質問1の回答
    const option1 = page.getByText(/普段の買い物での還元率/).first();
    await expect(option1).toBeVisible({ timeout: 5000 });
    await option1.click();

    // 3. 質問2の回答
    const option2 = page.getByText(/絶対無料がいい/).first();
    await expect(option2).toBeVisible({ timeout: 5000 });
    await option2.click();

    // 4. 質問3の回答
    const option3 = page.getByText(/日常の買い物/).first();
    await expect(option3).toBeVisible({ timeout: 5000 });
    await option3.click();

    // 5. 診断完了画面の表示確認
    const resultHeading = page.getByText("ベストな2枚が見つかりました！");
    await expect(resultHeading).toBeVisible({ timeout: 10000 });

    // 6. 適合度および配点バッジの確認
    await expect(page.getByText(/適合度/).first()).toBeVisible();
    await expect(page.getByText(/pt/).first()).toBeVisible();

    // 7. 公式リンクの表示・属性検証（別タブ遷移の設定が正しく付与されているか）
    const officialLink = page.getByRole("link", { name: /公式/ }).first();
    await expect(officialLink).toBeVisible();
    await expect(officialLink).toHaveAttribute("target", "_blank");
    await expect(officialLink).toHaveAttribute("rel", /noopener/);

    // 8. 横スクロール（レイアウト崩れ）のチェック
    const isHorizontalScrollbarVisible = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(isHorizontalScrollbarVisible).toBe(false);
  });
});
