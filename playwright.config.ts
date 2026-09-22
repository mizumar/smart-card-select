import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  /* Parallel execution */
  fullyParallel: true,
  /* Fail build on CI if test.only left in code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Workers */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter */
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  /* CIでは軽量化のため Chrome (Chromium) のみ実行 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // ↓ Firefox や Webkit は重くなるため CI 用に一旦コメントアウト
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* CI環境でテスト実行前に Next.js アプリを自動起動する設定 */
  webServer: {
    command: process.env.CI ? "npm run build && npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分以内にサーバーが立ち上がればOK
  },
});
