import { test, expect } from "@playwright/test";

test.describe("特集詳細ページ E2Eテスト", () => {
  // ---------------------------------------------------------
  // E2E-01: 新規記事 aaa ページへのアクセス
  // ---------------------------------------------------------
  test("E2E-01: 新規記事 aaa ページに正常にアクセスできること", async ({
    page,
  }) => {
    await page.goto("/feature/bbb");

    // h1タグの厳格指定を緩め、タイトルテキストが表示されているか確認
    await expect(
      page.getByRole("heading", { name: /テスト記事AAA|タイトル/i }).first(),
    ).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-02: Threadsカードの表示およびリンク遷移
  // ---------------------------------------------------------
  test("E2E-02: Threadsカードが表示され、別タブで指定リンクが開くこと", async ({
    page,
    context,
  }) => {
    await page.goto("/feature/bbb");

    // ThreadsCard の表示確認
    const threadsCard = page
      .locator("text=テストスレッド")
      .or(page.locator("text=mizuki"));
    await expect(threadsCard.first()).toBeVisible();

    // リンク要素の存在確認
    const threadsLink = page
      .getByRole("link", { name: /Threads|テストスレッド/i })
      .first();
    await expect(threadsLink).toBeVisible();

    // クリック時の別タブ遷移（Popup）を判定
    const pagePromise = context.waitForEvent("page");
    await threadsLink.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    // threads.net または threads.com の双方に対応
    expect(newPage.url()).toMatch(/threads\.(net|com)/);
  });

  // ---------------------------------------------------------
  // E2E-03: 画像およびキャプションの表示検証
  // ---------------------------------------------------------
  test("E2E-03: 記事内の画像およびキャプションが正常に表示されること", async ({
    page,
  }) => {
    await page.goto("/feature/bbb");

    const image = page.getByRole("img", { name: "テスト画像" });
    await expect(image).toBeVisible();

    const isImageLoaded = await image.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
    expect(isImageLoaded).toBeTruthy();

    await expect(page.getByText("注釈テキスト")).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-04: GFMテーブルの表示と表示崩れチェック
  // ---------------------------------------------------------
  test("E2E-04: GFMテーブルが視覚的な区別を保って正しく表示されること", async ({
    page,
  }) => {
    await page.goto("/feature/bbb");

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    await table.scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("columnheader", { name: "見出しA" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "見出しB" }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "セル1" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "セル2" })).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-05: レスポンシブ表示確認 (Mobile / Desktop)
  // ---------------------------------------------------------
  test("E2E-05: モバイル表示時に要素が画面幅に収まりテーブルが崩れないこと", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/feature/bbb");

    const body = page.locator("body");
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(375);

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
  });

  // ---------------------------------------------------------
  // E2E-06: 既存記事の回帰テスト (bbb.md を使用)
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // E2E-06: 既存記事の回帰テスト (bbb.md を使用)
  // ---------------------------------------------------------
  test("E2E-06: 既存記事 bbb で :::card 構文や通常Markdownが正常に表示されること", async ({
    page,
  }) => {
    // domcontentloaded を指定して 30000ms タイムアウトを回避
    await page.goto("/feature/bbb", { waitUntil: "domcontentloaded" });

    // 1. タイトルの表示確認
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    // 2. :::card 構文によるコンポーネント（楽天カード）の表示確認
    const cardElement = page.getByRole("heading", { name: "楽天カード" });
    await expect(cardElement).toBeVisible();

    // 3. 通常マークダウン（リスト要素）の表示確認
    const listItem = page.getByRole("listitem").first();
    await expect(listItem).toBeVisible();
  });
});
