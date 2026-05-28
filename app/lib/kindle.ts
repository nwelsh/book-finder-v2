import { chromium } from "playwright";

export async function checkKindleUnlimited(
  title: string
): Promise<boolean> {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    // Search Amazon
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
      title
    )}`;

    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Click first product result
    const firstLink = page.locator(
      'a[href*="/dp/"]'
    ).first();

    await firstLink.click();

    await page.waitForLoadState("domcontentloaded");

    // Read product page text
    const bodyText =
      (await page.textContent("body")) || "";

    console.log(bodyText);

    return (
      bodyText.includes("Kindle Unlimited") ||
      bodyText.includes("Read for Free") ||
      bodyText.includes("Included with Kindle Unlimited")
    );
  } catch (error) {
    console.error("KU CHECK ERROR:", error);

    return false;
  } finally {
    await browser.close();
  }
}