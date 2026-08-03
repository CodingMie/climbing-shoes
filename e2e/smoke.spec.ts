import { expect, test } from "@playwright/test";

test("首页以中文界面渲染", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page).toHaveTitle(/攀岩鞋试穿体验/);
  await expect(
    page.getByRole("heading", { name: "攀岩鞋试穿体验平台" }),
  ).toBeVisible();
});
