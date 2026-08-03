# 01 — 脚手架 + E2E 测试接缝

**What to build:** 应用可以启动并被自动化验证。Next.js（App Router）+ TypeScript + Tailwind + shadcn/ui + Drizzle/SQLite + better-auth 全部接通；首页以中文界面渲染；Playwright 按「一次性测试库」约定接入——每次 E2E 运行使用全新 SQLite 测试库并自动应用迁移。这是整个项目的测试接缝，后续所有 ticket 的验证都走这一条缝。

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [x] `bun run dev` 启动应用，首页正常渲染（中文界面）
- [x] Drizzle schema 与迁移工具接通；SQLite 数据库文件位于数据目录，路径可由环境变量覆盖
- [x] better-auth 依赖安装并预留接入位置（认证在下一 ticket 实现）
- [x] Playwright 配置 webServer 启动应用，E2E 使用一次性测试库（每次运行重建 + 自动迁移）
- [x] 一个冒烟 E2E 断言首页渲染
- [x] 单条命令（如 `bun run test:e2e`）跑通全部 E2E

## Comments

- 2026-08-03 实现完成，提交 0637dac。
- 与用户确认的偏差：本 ticket schema 保持为空（不预置 better-auth 表），迁移接缝就位但零迁移，真实迁移随 ticket 02 引入。
- better-sqlite3 v13 与 bun 运行时不兼容（NAPI 崩溃）；`bun run dev` 实际经 Node 运行 Next，应用侧不受影响，碰库脚本一律 `node` 执行（已记入 AGENTS.md）。
- E2E 专用 3100 端口（`dev:e2e`），避免与本地 3000 dev server 混用数据库。
