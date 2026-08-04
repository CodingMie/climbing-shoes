import { expect, test, type Page } from "@playwright/test";
import Database from "better-sqlite3";
import { E2E_DATABASE_PATH } from "../src/db/path";

type SeedIds = { shoeWithReviews: number; shoeWithoutReviews: number };

function ensureSeed(): SeedIds {
  const db = new Database(E2E_DATABASE_PATH);
  try {
    const findShoe = db.prepare("SELECT id FROM shoe WHERE model = ?");
    const existing = findShoe.get("聚合测试鞋") as { id: number } | undefined;
    const existingEmpty = findShoe.get("聚合空鞋") as { id: number } | undefined;
    if (existing && existingEmpty) {
      return {
        shoeWithReviews: existing.id,
        shoeWithoutReviews: existingEmpty.id,
      };
    }

    const brandId = db
      .prepare("INSERT INTO brand (name) VALUES (?)")
      .run("聚合测试品牌").lastInsertRowid;
    const insertShoe = db.prepare(
      `INSERT INTO shoe (brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, images, status)
       VALUES (?, ?, 999, '["抱石"]', '软', '中', '进阶', '自然', '魔术贴', '[]', 'approved')`,
    );
    const shoeWithReviews = Number(
      insertShoe.run(brandId, "聚合测试鞋").lastInsertRowid,
    );
    const shoeWithoutReviews = Number(
      insertShoe.run(brandId, "聚合空鞋").lastInsertRowid,
    );

    const now = Math.floor(Date.now() / 1000);
    const insertUser = db.prepare(
      "INSERT INTO user (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    );
    const insertProfile = db.prepare(
      `INSERT INTO foot_profile (user_id, foot_length, foot_width, foot_shape, arch, instep, heel, bunion, street_size)
       VALUES (?, 250, ?, ?, '正常', '正常', ?, '无', 42)`,
    );
    const reviewers = [
      { id: "agg-anna", footWidth: "宽", footShape: "埃及脚", heel: "宽" },
      { id: "agg-ben", footWidth: "窄", footShape: "埃及脚", heel: "窄" },
      { id: "agg-coco", footWidth: "宽", footShape: "希腊脚", heel: "中" },
    ];
    for (const reviewer of reviewers) {
      insertUser.run(
        reviewer.id,
        reviewer.id,
        `${reviewer.id}@example.com`,
        now,
        now,
      );
      insertProfile.run(
        reviewer.id,
        reviewer.footWidth,
        reviewer.footShape,
        reviewer.heel,
      );
    }

    const insertReview = db.prepare(
      `INSERT INTO review (user_id, shoe_id, size_tried, size_system, size_delta,
        wrap, comfort, precision, sensitivity, friction, support, overall,
        heel_fit, toe_fit, instep_fit, forefoot_fit, arch_fit, breathability,
        scenarios_used, duration, content)
       VALUES (?, ?, 40, 'EU', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '["抱石"]', '1 个月内', '聚合测试测评内容')`,
    );
    insertReview.run(
      "agg-anna",
      shoeWithReviews,
      -1,
      5, 5, 4, 5, 5, 4, 5,
      "贴合", "自然", "合适", "舒适", "正常", "透气",
    );
    insertReview.run(
      "agg-ben",
      shoeWithReviews,
      -0.5,
      3, 2, 3, 3, 4, 2, 3,
      "略松", "挤压", "压迫", "挤压", "疼痛", "一般",
    );
    insertReview.run(
      "agg-coco",
      shoeWithReviews,
      -1,
      2, 1, 2, 2, 3, 1, 1,
      "脚跟空", "抽筋", "合适", "疼痛", "正常", "闷热",
    );

    return { shoeWithReviews, shoeWithoutReviews };
  } finally {
    db.close();
  }
}

function statsSection(page: Page) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { name: "测评数据", exact: true }),
  });
}

function subBlock(page: Page, heading: string) {
  return statsSection(page).locator("section").filter({
    has: page.getByRole("heading", { level: 3, name: heading, exact: true }),
  });
}

function dimension(page: Page, label: string) {
  return subBlock(page, "维度均分").locator("li").filter({ hasText: label });
}

function sizeRow(page: Page, label: string) {
  return subBlock(page, "尺码偏移").locator("li").filter({ hasText: label });
}

function fitCard(page: Page, label: string) {
  return statsSection(page)
    .locator("section")
    .filter({
      has: page.getByRole("heading", { level: 4, name: label, exact: true }),
    });
}

function fitOption(page: Page, part: string, option: string) {
  return fitCard(page, part).locator("li").filter({ hasText: option });
}

async function applyFootFilter(page: Page, selections: Record<string, string>) {
  for (const [label, value] of Object.entries(selections)) {
    await page
      .getByRole("combobox", { name: label, exact: true })
      .selectOption(value);
  }
  await page.getByRole("button", { name: "筛选" }).click();
}

test.describe.configure({ mode: "serial" });

test("未筛选时展示全部测评的均分、尺码分布与合身分布", async ({ page }) => {
  const { shoeWithReviews } = ensureSeed();
  await page.goto(`/shoes/${shoeWithReviews}`);

  const stats = statsSection(page);
  await expect(stats.getByText("基于 3 条测评")).toBeVisible();

  await expect(dimension(page, "综合推荐指数")).toContainText("3.0");
  await expect(dimension(page, "舒适")).toContainText("2.7");
  await expect(dimension(page, "摩擦")).toContainText("4.0");
  await expect(dimension(page, "支撑")).toContainText("2.3");

  await expect(
    stats.getByText("67% 用户选择比日常小 1 码"),
  ).toBeVisible();
  await expect(sizeRow(page, "比日常小 1 码")).toContainText("67%");
  await expect(sizeRow(page, "比日常小半码")).toContainText("33%");

  await expect(fitOption(page, "脚跟", "贴合")).toContainText("33%");
  await expect(fitOption(page, "脚跟", "略松")).toContainText("33%");
  await expect(fitOption(page, "脚跟", "脚跟空")).toContainText("33%");
  await expect(fitOption(page, "脚趾", "挤压")).toContainText("33%");
  await expect(fitOption(page, "脚趾", "抽筋")).toContainText("33%");
  await expect(fitOption(page, "脚背", "合适")).toContainText("67%");
});

test("按脚型筛选后只统计匹配测评（埃及脚）", async ({ page }) => {
  const { shoeWithReviews } = ensureSeed();
  await page.goto(`/shoes/${shoeWithReviews}`);

  await applyFootFilter(page, { 脚型: "埃及脚" });

  const stats = statsSection(page);
  await expect(
    stats.getByText("基于 2 条测评 · 脚型：埃及脚"),
  ).toBeVisible();
  await expect(dimension(page, "综合推荐指数")).toContainText("4.0");
  await expect(dimension(page, "舒适")).toContainText("3.5");

  await expect(
    stats.getByText("50% 用户选择比日常小 1 码"),
  ).toBeVisible();
  await expect(sizeRow(page, "比日常小 1 码")).toContainText("50%");
  await expect(sizeRow(page, "比日常小半码")).toContainText("50%");

  await expect(fitOption(page, "脚跟", "贴合")).toContainText("50%");
  await expect(fitOption(page, "脚跟", "略松")).toContainText("50%");
  await expect(fitOption(page, "脚跟", "脚跟空")).toHaveCount(0);
});

test("脚型条件可叠加（埃及脚 + 宽）", async ({ page }) => {
  const { shoeWithReviews } = ensureSeed();
  await page.goto(`/shoes/${shoeWithReviews}`);

  await applyFootFilter(page, { 脚型: "埃及脚", 脚宽窄: "宽" });

  const stats = statsSection(page);
  await expect(
    stats.getByText("基于 1 条测评 · 脚型：埃及脚 + 宽"),
  ).toBeVisible();
  await expect(dimension(page, "综合推荐指数")).toContainText("5.0");
  await expect(sizeRow(page, "比日常小 1 码")).toContainText("100%");
  await expect(fitOption(page, "脚跟", "贴合")).toContainText("100%");
});

test("无匹配脚型时展示空状态而非错误", async ({ page }) => {
  const { shoeWithReviews } = ensureSeed();
  await page.goto(`/shoes/${shoeWithReviews}`);

  await applyFootFilter(page, { 脚型: "罗马脚" });

  await expect(
    statsSection(page).getByText("没有符合所选脚型的测评"),
  ).toBeVisible();
  await expect(statsSection(page).getByText("基于")).toHaveCount(0);
});

test("无测评的鞋款展示空状态而非错误", async ({ page }) => {
  const { shoeWithoutReviews } = ensureSeed();
  await page.goto(`/shoes/${shoeWithoutReviews}`);

  await expect(
    statsSection(page).getByText("还没有测评，聚合数据会在首条测评后出现"),
  ).toBeVisible();
});

test("鞋库脚型筛选结果进入详情页后保持", async ({ page }) => {
  ensureSeed();
  await page.goto("/shoes");

  await page
    .getByRole("combobox", { name: "脚型", exact: true })
    .selectOption("埃及脚");
  await page.getByRole("button", { name: "筛选" }).click();
  await expect(
    page.getByText("匹配脚型均分 4.0 · 2 人评过"),
  ).toBeVisible();

  await page
    .getByRole("link")
    .filter({ hasText: "聚合测试鞋" })
    .first()
    .click();

  await expect(page).toHaveURL(/footShape=/);
  await expect(
    statsSection(page).getByText("基于 2 条测评 · 脚型：埃及脚"),
  ).toBeVisible();
});
