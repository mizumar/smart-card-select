import robots from "../robots";

describe("robots", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
    }
  });

  test("クローラーにすべてのページへのアクセスを許可すること", () => {
    const result = robots();

    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
  });

  test("sitemapのURLが正しく設定されること", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://smart-card-select.vercel.app";

    const result = robots();

    expect(result.sitemap).toBe(
      "https://smart-card-select.vercel.app/sitemap.xml",
    );
  });

  test("環境変数が未設定の場合は本番URLを使用すること", () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;

    const result = robots();

    expect(result.sitemap).toBe(
      "https://smart-card-select.vercel.app/sitemap.xml",
    );
  });
});
