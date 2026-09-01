import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { apps } from "../../src/data/registry";

const privacyContacts: Record<string, { label: string; url: string }> = {
  sublog: {
    label: "SubLog お問い合わせフォーム",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfm2fsJLBAy4CVIBscx2ueab2znR5pYTzxZo7ntUULdtaoODg/viewform",
  },
  caflog: {
    label: "CafLog お問い合わせフォーム",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfwkDqyQ_NutiUPmFnTw01q9hIgVFbHFzGJp95h6qgYd5awQQ/viewform",
  },
  "dev-tools": { label: "Dev-Tools お問い合わせ", url: "https://github.com/yuto1201/Dev-Tools/issues" },
};

async function expectResolvedColorContrast(page: Page, backgroundCss: string) {
  await page.addStyleTag({ content: backgroundCss });
  const results = await new AxeBuilder({ page })
    .withRules(["color-contrast", "link-name", "label", "button-name"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(results.incomplete.filter(({ id }) => id === "color-contrast")).toEqual([]);
  expect(results.passes.some(({ id }) => id === "color-contrast")).toBe(true);
}

async function expectFilterLabelContrast(page: Page) {
  const results = await new AxeBuilder({ page })
    .include(".filter-label")
    .withRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(results.incomplete).toEqual([]);
  expect(results.passes.some(({ id }) => id === "color-contrast")).toBe(true);
}

async function exportedIndexRoutes(directory = "out", prefix = ""): Promise<string[]> {
  const routes: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? path.posix.join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) {
      routes.push(...await exportedIndexRoutes(path.join(directory, entry.name), relative));
    } else if (entry.name === "index.html" && !["404", "_not-found"].includes(prefix)) {
      routes.push(prefix ? `/${prefix}/` : "/");
    }
  }
  return routes;
}

function homeContrastCss(theme: "dark" | "light") {
  const palette = theme === "dark"
    ? { page: "#4b3932", surface: "#61504b", text: "#fff", accent: "#ff8fd0", cta: "#0062cc" }
    : { page: "#e0c4ff", surface: "#e9d6ff", text: "#1d1d1f", accent: "#0062cc", cta: "#0062cc" };
  return `
    html * { transition: none !important; animation: none !important; }
    body { background: ${palette.page} !important; }
    .glass, .search input, .chip, .clear-filters, .social-link,
    .hero-eyebrow, .hero-meta span, .hero-note-link {
      background: ${palette.surface} !important;
      backdrop-filter: none !important;
    }
    .glass::before, .glass::after { content: none !important; }
    .app-card { background: ${palette.page} !important; }
    .hero-line, .hero-letter {
      background: none !important;
      color: ${palette.text} !important;
      -webkit-text-fill-color: ${palette.text} !important;
    }
    .hero-line.accent, .hero-line.accent .hero-letter {
      color: ${palette.accent} !important;
      -webkit-text-fill-color: ${palette.accent} !important;
    }
    .reveal, .hero-letter, .hero-cta-wrap, .cta-btn {
      opacity: 1 !important;
      transform: none !important;
    }
    .cta-btn { background: ${palette.cta} !important; text-shadow: none !important; }
    .bg-shape { display: none !important; }
  `;
}

test("一覧検索・カテゴリ・空状態と解除", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("プラットフォーム", { exact: true })).toBeVisible();
  await expect(page.getByText("カテゴリ", { exact: true })).toBeVisible();
  const cards = page.locator(".app-card");
  await expect(cards).toHaveCount(apps.length);
  const platformGroup = page.getByRole("group", { name: "プラットフォーム", exact: true });
  const platformAll = platformGroup.getByRole("button", { name: "すべて", exact: true });
  const platformIOS = platformGroup.getByRole("button", { name: "iOS", exact: true });
  const platformWeb = platformGroup.getByRole("button", { name: "Web", exact: true });
  const categoryGroup = page.getByRole("group", { name: "カテゴリ", exact: true });
  const categoryAll = categoryGroup.getByRole("button", { name: "すべて", exact: true });
  const categoryHealth = categoryGroup.getByRole("button", { name: "ヘルスケア", exact: true });
  await expect(platformAll).toHaveAttribute("aria-pressed", "true");
  await expect(categoryAll).toHaveAttribute("aria-pressed", "true");
  await expectFilterLabelContrast(page);
  await expectResolvedColorContrast(page, homeContrastCss("dark"));
  await page.locator("#search-input").fill("sublog");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("SubLog");
  await page.locator("#search-input").fill("no-such-app-1234");
  await expect(page.getByText("見つかりませんでした")).toBeVisible();
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await expect(cards).toHaveCount(apps.length);
  await categoryHealth.click();
  await expect(categoryHealth).toHaveAttribute("aria-pressed", "true");
  await expect(categoryAll).toHaveAttribute("aria-pressed", "false");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("CafLog");
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await platformIOS.click();
  await expect(platformIOS).toHaveAttribute("aria-pressed", "true");
  await expect(platformAll).toHaveAttribute("aria-pressed", "false");
  await expect(cards).toHaveCount(apps.filter((app) => app.platforms.includes("iOS")).length);
  await page.getByRole("button", { name: "条件をクリア" }).click();
  await platformWeb.click();
  await expect(platformWeb).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Dev-Tools");
  await cards.first().click();
  const webDialog = page.getByRole("dialog", { name: "Dev-Tools", exact: true });
  const webBadge = webDialog.locator('a.badge-btn[href="https://yuto1201.github.io/Dev-Tools/"]');
  await expect(webBadge).toBeVisible();
  await expect(webBadge).toContainText("ブラウザで開く");
  await expect(webBadge).toContainText("Web アプリ");
  await expect(webBadge).toHaveAttribute("target", "_blank");
  await webDialog.getByRole("button", { name: "閉じる", exact: true }).click();
});

test("OGP metadata とサイト共通の法務ページ", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://app.yutodev.com/ogp.png");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "https://app.yutodev.com/ogp.png");

  await expect(page.getByRole("link", { name: "プライバシー", exact: true })).toHaveAttribute("href", "/privacy/");
  const privacyResponse = await request.get("/privacy/");
  expect(privacyResponse.ok()).toBe(true);
  const privacyHtml = await privacyResponse.text();
  expect(privacyHtml).toContain('<meta property="og:url" content="https://app.yutodev.com/privacy/"/>');
  expect(privacyHtml).toContain('<meta property="og:title" content="プライバシーポリシー — AppLibrary"/>');
  expect(privacyHtml).toContain('<meta property="og:image" content="https://app.yutodev.com/ogp.png"/>');
  await page.goto("/privacy/");
  await expect(page).toHaveURL(/\/privacy\/$/u);
  await expect(page.getByRole("heading", { level: 1, name: "プライバシーポリシー" })).toBeVisible();
  await expect(page.locator(".legal-language [lang='en']")).toHaveText("This page is available in Japanese only.");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://app.yutodev.com/privacy/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "プライバシーポリシー — AppLibrary");
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "プライバシーポリシー — AppLibrary");
  await expectResolvedColorContrast(
    page,
    "body{background:#4b3932!important}.legal-card{background:#61504b!important;backdrop-filter:none!important}",
  );
  await page.evaluate(() => localStorage.setItem("applibrary_state", JSON.stringify({ theme: "light" })));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectResolvedColorContrast(
    page,
    "body{background:#e0c4ff!important}.legal-card{background:#eedfff!important;backdrop-filter:none!important}",
  );

  await expect(page.getByRole("link", { name: "利用規約", exact: true })).toHaveAttribute("href", "/terms/");
  const termsResponse = await request.get("/terms/");
  expect(termsResponse.ok()).toBe(true);
  const termsHtml = await termsResponse.text();
  expect(termsHtml).toContain('<meta property="og:url" content="https://app.yutodev.com/terms/"/>');
  expect(termsHtml).toContain('<meta property="og:title" content="利用規約 — AppLibrary"/>');
  expect(termsHtml).toContain('<meta property="og:image" content="https://app.yutodev.com/ogp.png"/>');
  await page.goto("/terms/");
  await expect(page).toHaveURL(/\/terms\/$/u);
  await expect(page.getByRole("heading", { level: 1, name: "利用規約" })).toBeVisible();
  await expect(page.locator(".legal-language [lang='en']")).toHaveText("This page is available in Japanese only.");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://app.yutodev.com/terms/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "利用規約 — AppLibrary");
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "利用規約 — AppLibrary");
  await expectResolvedColorContrast(
    page,
    "body{background:#e0c4ff!important}.legal-card{background:#eedfff!important;backdrop-filter:none!important}",
  );
  await page.evaluate(() => localStorage.setItem("applibrary_state", JSON.stringify({ theme: "dark" })));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectResolvedColorContrast(
    page,
    "body{background:#4b3932!important}.legal-card{background:#61504b!important;backdrop-filter:none!important}",
  );
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
  await expect(dialog).toContainText("2026年4月14日");
  await expect(dialog.getByRole("button", { name: "閉じる", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("初回テーマと言語設定が再読み込み後も維持される", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("navigation", { name: "メインナビゲーション" })).toBeVisible();
  await page.getByRole("button", { name: "ライトモードに切り替える" }).click();
  await page.getByRole("button", { name: "英語に切り替える" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".hero-bio")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".hero-meta span").first()).toHaveAttribute("lang", "ja");
  await expect(page.locator(".hero-note-link span").last()).toHaveAttribute("lang", "ja");
  await expect(page.locator(".post")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("button", { name: "ファイナンス", exact: true })).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to Japanese" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-label", "Open menu");
  await expect(page.locator(".cta-btn")).toHaveCSS(
    "background-image",
    /rgb\(0, 98, 204\).*rgb\(0, 109, 145\)/u,
  );
  await page.locator("#search-input").fill("sublog");
  await expect(page.locator(".filter-state")).toBeVisible();
  await expectFilterLabelContrast(page);
  await expectResolvedColorContrast(page, homeContrastCss("light"));

  const sublogCard = page.locator(".app-card").filter({ has: page.getByRole("heading", { name: "SubLog", exact: true }) });
  await expect(sublogCard).toHaveAttribute("lang", "ja");
  await sublogCard.click();
  const dialog = page.getByRole("dialog", { name: "SubLog", exact: true });
  await expect(dialog.locator(".modal-header")).toHaveAttribute("lang", "ja");
  await expect(dialog.locator(".modal-description")).toHaveAttribute("lang", "ja");
  await dialog.getByRole("button", { name: "Close", exact: true }).click();

  for (const [route, selector] of [
    ["/apps/sublog/", ".app-shell"],
    ["/apps/sublog/privacy/", ".app-shell"],
    ["/privacy/", ".legal-page"],
    ["/terms/", ".legal-page"],
  ] as const) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(selector)).toHaveAttribute("lang", "ja");
    if (route === "/apps/sublog/") {
      await expect(page.getByRole("heading", { level: 2, name: "Features" })).toHaveAttribute("lang", "en");
    }
  }
});

test("robots と sitemap が全静的ルートを公開する", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  expect(await robotsResponse.text()).toContain("Sitemap: https://app.yutodev.com/sitemap.xml");

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]).sort();
  const expected = (await exportedIndexRoutes())
    .map((route) => new URL(route, "https://app.yutodev.com/").href)
    .sort();
  expect(actual).toEqual(expected);
});

test("通常モーションでは初回だけ Hero を再生し、履歴を消すと再生する", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hero-opening", "play");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-hero-opening", "off");
  await page.evaluate(() => sessionStorage.removeItem("applibrary_hero_seen"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-hero-opening", "play");
});

test("reduced-motion では初回でも Hero を再生しない", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hero-opening", "off");
});

for (const app of apps) {
  test(`${app.slug}: 詳細とプライバシーの直接ロード、往復、画像、runtime エラー`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const detailResponse = await request.get(`/apps/${app.slug}/`);
    expect(detailResponse.ok()).toBe(true);
    const detailHtml = await detailResponse.text();
    expect(detailHtml).toContain(`<meta property="og:url" content="https://app.yutodev.com/apps/${app.slug}/"/>`);
    expect(detailHtml).toContain(`<meta property="og:title" content="${app.name} — AppLibrary"/>`);
    expect(detailHtml).toContain('<meta property="og:image" content="https://app.yutodev.com/ogp.png"/>');
    const privacyResponse = await request.get(`/apps/${app.slug}/privacy/`);
    expect(privacyResponse.ok()).toBe(true);
    const privacyHtml = await privacyResponse.text();
    expect(privacyHtml).toContain(
      `<meta property="og:url" content="https://app.yutodev.com/apps/${app.slug}/privacy/"/>`,
    );
    expect(privacyHtml).toContain(`<meta property="og:title" content="プライバシーポリシー — ${app.name}"/>`);
    expect(privacyHtml).toContain('<meta property="og:image" content="https://app.yutodev.com/ogp.png"/>');
    await page.goto(`/apps/${app.slug}/`);
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/$`, "u"));
    await expect(page.getByRole("heading", { name: app.name, exact: true, level: 1 })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(248, 250, 252)");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://app.yutodev.com/apps/${app.slug}/`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", `${app.name} — AppLibrary`);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", `${app.name} — AppLibrary`);
    if (app.siteUrl) {
      const siteLink = page.getByRole("link", {
        name: app.platforms.includes("Web") ? "Web アプリを開く" : "公式サイト",
        exact: true,
      });
      await expect(siteLink).toHaveAttribute("href", app.siteUrl);
      await expect(siteLink).toHaveAttribute("target", "_blank");
    }
    await expectResolvedColorContrast(
      page,
      ".app-shell{background:#f8fafc!important}.hero-badge{background:#fff!important}.hero-tagline{background:none!important;color:var(--app-accent)!important}.btn-primary{background:var(--app-accent)!important}",
    );
    const features = page.locator("#features .feature-card");
    await expect(features).toHaveCount(app.features.length);
    await expect(features.first()).toContainText(app.features[0]!.description);
    const screenshots = page.locator("#screenshots img");
    await expect(screenshots).toHaveCount(app.screenshots.length);
    for (const screenshot of await screenshots.all()) {
      await screenshot.scrollIntoViewIfNeeded();
      await expect(screenshot).toBeVisible();
      await expect.poll(() => screenshot.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    if (app.slug === "caflog" && (page.viewportSize()?.width ?? 0) >= 1000) {
      const boxes = (await screenshots.all()).map(async (screenshot) => screenshot.boundingBox());
      const resolvedBoxes = (await Promise.all(boxes)).filter((box) => box !== null);
      const lastRowY = Math.max(...resolvedBoxes.map((box) => box.y));
      const lastRow = resolvedBoxes.filter((box) => Math.abs(box.y - lastRowY) < 2);
      const left = Math.min(...lastRow.map((box) => box.x));
      const right = Math.max(...lastRow.map((box) => box.x + box.width));
      const row = await page.locator(".shot-row").boundingBox();
      expect(row).not.toBeNull();
      expect(Math.abs((left + right) / 2 - (row!.x + row!.width / 2))).toBeLessThan(2);
    }
    await page.getByRole("link", { name: "プライバシーポリシー", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/privacy/$`, "u"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("プライバシー");
    await expect(page.locator(".legal-language [lang='en']")).toHaveText("This page is available in Japanese only.");
    const expectedContact = privacyContacts[app.slug]!;
    const contact = page.getByRole("link", { name: expectedContact.label, exact: true });
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute("href", expectedContact.url);
    await expect(page.locator("footer.page-footer")).toBeVisible();
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://app.yutodev.com/apps/${app.slug}/privacy/`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      `プライバシーポリシー — ${app.name}`,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      `プライバシーポリシー — ${app.name}`,
    );
    await expectResolvedColorContrast(page, ".app-shell{background:#f8fafc!important}");
    await page.getByRole("link", { name: `← ${app.name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${app.slug}/$`, "u"));
    await page.getByRole("link", { name: "← AppLibrary", exact: true }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/");
    await expect(page.locator(".app-shell")).toHaveCount(0);
    await expect(page.locator("body")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator("body")).not.toHaveCSS("background-color", "rgb(248, 250, 252)");
    await expect(page.locator(".app-card")).toHaveCount(apps.length);
    await page.getByRole("link", { name: "プライバシー", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "プライバシーポリシー" })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("color", "rgb(255, 255, 255)");
    expect(errors).toEqual([]);
  });
}

test("未生成ルートは 404", async ({ request }) => {
  expect((await request.get("/apps/does-not-exist/")).status()).toBe(404);
});
