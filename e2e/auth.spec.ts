import { expect, test, type Page } from "@playwright/test";
import Database from "better-sqlite3";
import { E2E_DATABASE_PATH } from "../src/db/path";

const PASSWORD = "secret-12345";

async function register(
  page: Page,
  user: { username: string; email: string; password?: string },
) {
  await page.goto("/register");
  await page.getByLabel("用户名").fill(user.username);
  await page.getByLabel("邮箱").fill(user.email);
  await page.getByLabel("密码").fill(user.password ?? PASSWORD);
  await page.getByRole("button", { name: "注册" }).click();
  await expect(
    page.getByRole("banner").getByText(user.username),
  ).toBeVisible();
}

async function login(page: Page, identifier: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("用户名或邮箱").fill(identifier);
  await page.getByLabel("密码").fill(password);
  await page.getByRole("button", { name: "登录" }).click();
}

test("注册成功后自动登录，页面显示用户名", async ({ page }) => {
  await register(page, {
    username: "climber_alpha",
    email: "alpha@example.com",
  });
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("banner").getByText("climber_alpha"),
  ).toBeVisible();
});

test("重复邮箱注册被拒绝，返回中文错误提示", async ({ page }) => {
  await register(page, {
    username: "climber_beta",
    email: "beta@example.com",
  });
  await page.goto("/register");
  await page.getByLabel("用户名").fill("climber_other");
  await page.getByLabel("邮箱").fill("beta@example.com");
  await page.getByLabel("密码").fill(PASSWORD);
  await page.getByRole("button", { name: "注册" }).click();
  await expect(page.getByText("该邮箱已被注册")).toBeVisible();
  await expect(
    page.getByRole("banner").getByText("climber_other"),
  ).toHaveCount(0);
});

test("重复用户名注册被拒绝，返回中文错误提示", async ({ page }) => {
  await register(page, {
    username: "climber_gamma",
    email: "gamma@example.com",
  });
  await page.goto("/register");
  await page.getByLabel("用户名").fill("climber_gamma");
  await page.getByLabel("邮箱").fill("other@example.com");
  await page.getByLabel("密码").fill(PASSWORD);
  await page.getByRole("button", { name: "注册" }).click();
  await expect(page.getByText("该用户名已被占用")).toBeVisible();
});

test("非法用户名在前端被拒绝，返回中文错误提示", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("用户名").fill("ab");
  await page.getByLabel("邮箱").fill("valid@example.com");
  await page.getByLabel("密码").fill(PASSWORD);
  await page.getByRole("button", { name: "注册" }).click();
  await expect(page.getByText("用户名至少 3 个字符")).toBeVisible();

  await page.getByLabel("用户名").fill("非法用户名!");
  await page.getByRole("button", { name: "注册" }).click();
  await expect(
    page.getByText("用户名只能包含字母、数字和下划线"),
  ).toBeVisible();
});

test("错误密码登录被拒绝，返回中文错误提示", async ({ page }) => {
  await register(page, {
    username: "climber_delta",
    email: "delta@example.com",
  });
  await page.getByRole("button", { name: "退出" }).click();
  await login(page, "climber_delta", "wrong-password");
  await expect(page.getByText("用户名或密码错误")).toBeVisible();
  await expect(
    page.getByRole("banner").getByText("climber_delta"),
  ).toHaveCount(0);
});

test("完整旅程：注册 → 登出 → 邮箱再登录 → 登出 → 用户名再登录", async ({
  page,
}) => {
  await register(page, {
    username: "journey",
    email: "journey@example.com",
  });
  await expect(page.getByRole("banner").getByText("journey")).toBeVisible();

  await page.getByRole("button", { name: "退出" }).click();
  await expect(page.getByRole("link", { name: "登录" })).toBeVisible();
  await expect(page.getByRole("banner").getByText("journey")).toHaveCount(0);

  await login(page, "journey@example.com");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("banner").getByText("journey")).toBeVisible();

  await page.getByRole("button", { name: "退出" }).click();
  await expect(page.getByRole("link", { name: "登录" })).toBeVisible();

  await login(page, "journey");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("banner").getByText("journey")).toBeVisible();
});

test("会话在多次访问间保持（storage state）", async ({ browser }) => {
  const first = await browser.newContext();
  const page = await first.newPage();
  await register(page, {
    username: "climber_echo",
    email: "echo@example.com",
  });
  await expect(page.getByRole("banner").getByText("climber_echo")).toBeVisible();
  const state = await first.storageState();
  await first.close();

  const second = await browser.newContext({ storageState: state });
  const page2 = await second.newPage();
  await page2.goto("/");
  await expect(
    page2.getByRole("banner").getByText("climber_echo"),
  ).toBeVisible();
  await second.close();
});

test("密码仅以哈希存储，数据库中不出现明文", async ({ page }) => {
  const password = "plaintext-42";
  await register(page, {
    username: "climber_hash",
    email: "hash@example.com",
    password,
  });
  await expect(
    page.getByRole("banner").getByText("climber_hash"),
  ).toBeVisible();

  const db = new Database(E2E_DATABASE_PATH, { readonly: true });
  try {
    const rows = db.prepare("SELECT password FROM account").all() as {
      password: string | null;
    }[];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.password).toBeTruthy();
      expect(row.password).not.toContain(password);
      expect(row.password!.length).toBeGreaterThanOrEqual(32);
    }
  } finally {
    db.close();
  }
});

test("未登录访问受保护页面重定向到登录页", async ({ page }) => {
  await page.goto("/settings/profile");
  await expect(page).toHaveURL(/\/login/);
});

test("登录后可访问受保护页面", async ({ page }) => {
  await register(page, {
    username: "climber_foxtrot",
    email: "foxtrot@example.com",
  });
  await page.goto("/settings/profile");
  await expect(page).toHaveURL("/settings/profile");
  await expect(page.getByText("climber_foxtrot").first()).toBeVisible();
});
