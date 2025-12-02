import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "B3"
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "OpenNext"
    );
  });

  test("should have Zustand counter functionality", async ({ page }) => {
    await page.goto("/");

    const incrementButton = page.getByRole("button", { name: "Increment" });
    const decrementButton = page.getByRole("button", { name: "Decrement" });
    const resetButton = page.getByRole("button", { name: "Reset" });

    await incrementButton.click();
    await expect(page.locator("text=1").first()).toBeVisible();

    await incrementButton.click();
    await expect(page.locator("text=2").first()).toBeVisible();

    await decrementButton.click();
    await expect(page.locator("text=1").first()).toBeVisible();

    await resetButton.click();
    await expect(page.locator("text=0").first()).toBeVisible();
  });

  test("should display tRPC card", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "tRPC Integration" })
    ).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    const links = [
      { text: "Next.js", href: "nextjs.org" },
      { text: "tRPC", href: "trpc.io" },
      { text: "Drizzle", href: "orm.drizzle.team" },
      { text: "Better Auth", href: "better-auth.com" },
    ];

    for (const link of links) {
      const linkElement = page.getByRole("link", { name: link.text });
      await expect(linkElement).toBeVisible();
      await expect(linkElement).toHaveAttribute("href", expect.stringContaining(link.href));
    }
  });
});
