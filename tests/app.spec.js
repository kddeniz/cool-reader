// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Cool Reader", () => {
  test("renders markdown preview", async ({ page }) => {
    await page.goto("/");
    await page.locator("#editor").fill("# Merhaba\n**Kalın**");
    await expect(page.locator("#preview")).toContainText("Merhaba");
    await expect(page.locator("#preview strong")).toHaveText("Kalın");
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
