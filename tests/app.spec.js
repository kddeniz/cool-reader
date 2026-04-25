// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Cool Reader", () => {
  test("serves robots.txt as plain text", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).toMatch(
      /Content-Signal:\s*ai-train=no,\s*search=yes,\s*ai-input=no/i,
    );
    expect(body).toMatch(/Allow:\s*\//);
    const aiUserAgents = [
      "GPTBot",
      "OAI-SearchBot",
      "Claude-Web",
      "Google-Extended",
      "Amazonbot",
      "anthropic-ai",
      "Bytespider",
      "CCBot",
      "Applebot-Extended",
    ];
    for (const ua of aiUserAgents) {
      expect(body).toContain(`User-agent: ${ua}`);
    }
    expect(body).toMatch(/Sitemap:\s*https:\/\/cool-reader\.com\/sitemap\.xml/i);
  });

  test("serves sitemap.xml as XML with canonical URL", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
    expect(body).toMatch(/<loc>https:\/\/cool-reader\.com\/<\/loc>/);
  });

  test("homepage has Link response headers for agent discovery (RFC 8288)", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/text\/html/i);
    const h = res.headers();
    const link = h["link"] ?? h["Link"];
    expect(link).toBeDefined();
    expect(String(link)).toMatch(/<\/\.well-known\/api-catalog>;\s*rel="api-catalog"/i);
    expect(String(link)).toMatch(/<\/docs\/api\.html>;\s*rel="service-doc"/i);
    expect(String(link)).toMatch(/<\/schema-ld\.json>;\s*rel="describedby"/i);
  });

  test("homepage negotiates markdown when Accept prefers text/markdown", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/markdown" } });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/text\/markdown/i);
    const vary = res.headers().vary ?? res.headers().Vary ?? "";
    expect(String(vary).toLowerCase()).toContain("accept");
    const tokens = res.headers()["x-markdown-tokens"] ?? res.headers()["X-Markdown-Tokens"];
    expect(tokens).toBeDefined();
    expect(Number.parseInt(String(tokens), 10)).toBeGreaterThan(0);
    const body = await res.text();
    expect(body).toMatch(/^---\n/);
    expect(body).toMatch(/Cool Reader/i);
  });

  test("prefers HTML when Accept ranks text/html above markdown", async ({ request }) => {
    const res = await request.get("/", {
      headers: { Accept: "text/html, text/markdown;q=0.5" },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/text\/html/i);
  });

  test("shows toolbar tagline with product value prop", async ({ page }) => {
    await page.goto("/");
    const tagline = page.locator("#toolbarTagline");
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText("Browser-only Markdown with live, sanitized HTML preview");
  });

  test("footer links to GitHub repository", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer.app-footer");
    const source = footer.locator('a[href="https://github.com/kddeniz/cool-reader"]');
    await expect(source).toBeVisible();
    await expect(source).toHaveText("Source on GitHub");
    await expect(footer.locator(".app-footer__credit")).toContainText("Made with");
    await expect(footer.locator(".app-footer__credit")).toContainText("Kürşad");
  });

  test("renders markdown preview", async ({ page }) => {
    await page.goto("/");
    await page.locator("#editor").fill("# Hello\n**Bold**");
    await expect(page.locator("#preview")).toContainText("Hello");
    await expect(page.locator("#preview strong")).toHaveText("Bold");
  });

  test("downloads standalone HTML matching sanitized preview", async ({ page }) => {
    await page.goto("/");
    await page.locator("#editor").fill("# Exported\n\n**Bold**");
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#downloadHtmlBtn").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/document\.html$/i);
    const stream = await download.createReadStream();
    expect(stream).toBeTruthy();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const text = Buffer.concat(chunks).toString("utf8");
    expect(text).toMatch(/<!DOCTYPE html>/i);
    expect(text).toContain('<main class="cr-export">');
    expect(text).toMatch(/:root\{/);
    expect(text).toMatch(/--cr-prose-text/);
    expect(text).toMatch(/<h1[^>]*>Exported<\/h1>/);
    expect(text).toMatch(/<strong>Bold<\/strong>/);
    expect(text).not.toContain("<script>");
  });

  test("does not execute script tags from markdown", async ({ page }) => {
    await page.goto("/");
    await page.locator("#editor").fill('<script>window.__coolReaderXss = 1</script>\n\nHello');
    const flag = await page.evaluate(() => window.__coolReaderXss);
    expect(flag).toBeUndefined();
    await expect(page.locator("#preview script")).toHaveCount(0);
    await expect(page.locator("#preview")).toContainText("Hello");
  });

  test("toggles editor panel and updates aria-expanded", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#toggleEditor");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await toggle.click();
    await expect(page.locator("#app")).toHaveClass(/app--editor-collapsed/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
