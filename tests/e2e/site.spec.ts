import { expect, test } from "@playwright/test";
import { apps } from "../../src/data/registry";

test("一覧検索・カテゴリ・空状態と解除", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".app-card");
  await expect(cards).toHaveCount(apps.length);
  await page.locator("#search-input").fill("sublog");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("SubLog");
  await page.locator("#search-input").fill("no-such-app-1234");
  await expect(page.getByText("見つかりませんでした")).toBeVisible();
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await expect(cards).toHaveCount(apps.length);
  await page.getByRole("group", { name: "カテゴリ", exact: true }).getByRole("button", { name: "ヘルスケア" }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("CafLog");
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await page.getByRole("group", { name: "プラットフォーム", exact: true }).getByRole("button", { name: "iOS", exact: true }).click();
  await expect(cards).toHaveCount(apps.filter((app) => app.platforms.includes("iOS")).length);
});

test("カードの表示・モーダル・キーボード操作", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".app-card").filter({ has: page.getByRole("heading", { name: "SubLog", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/\bin\b/u);
  await expect(card).toHaveCSS("opacity", "1");
  await card.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "SubLog", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("初回テーマと言語設定が再読み込み後も維持される", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "日本語に切替" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-hero-opening", "off");
});

for (const app of apps) {
  test(`${app.slug}: 詳細とプライバシーの往復、画像、runtime エラー`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("link", { name: `${app.name} の個別ページへ` }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/$`, "u"));
    await expect(page.getByRole("heading", { name: app.name, exact: true, level: 1 })).toBeVisible();
    const screenshots = page.locator("#screenshots img");
    await expect(screenshots).toHaveCount(app.screenshots.length);
    for (const screenshot of await screenshots.all()) {
      await screenshot.scrollIntoViewIfNeeded();
      await expect(screenshot).toBeVisible();
      await expect.poll(() => screenshot.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    await page.getByRole("link", { name: "プライバシーポリシー", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/privacy/$`, "u"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("プライバシー");
    await page.getByRole("link", { name: `← ${app.name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/$`, "u"));
    await page.getByRole("link", { name: "← AppLibrary", exact: true }).click();
    await expect(page.locator(".app-card")).toHaveCount(apps.length);
    expect(errors).toEqual([]);
  });
}

test("未生成ルートは 404", async ({ request }) => {
  expect((await request.get("/apps/does-not-exist/")).status()).toBe(404);
});
