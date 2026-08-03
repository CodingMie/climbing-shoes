# 攀岩鞋试穿体验平台

攀岩鞋试穿体验记录与分享平台（中文社区，自部署）。

## 技术栈

- Next.js 15（App Router）+ TypeScript + Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + better-sqlite3（SQLite）
- better-auth（依赖已安装，认证逻辑由后续 ticket 接入）
- Playwright E2E（唯一测试接缝）
- 包管理：bun

## 开发

```bash
bun install
bunx playwright install chromium
bun run dev          # http://localhost:3000
```

## 数据库

- SQLite 文件默认位于 `data/app.db`，可用环境变量 `DATABASE_PATH` 覆盖。
- `bun run db:generate`：schema 变更后生成迁移（输出到 `drizzle/`，随代码提交）。
- `bun run db:migrate`：对 `DATABASE_PATH` 指向的库应用迁移。

## 测试

```bash
bun run test:e2e
```

单条命令完成：重建一次性测试库 `data/e2e.db`（自动应用迁移）→ 在 3100 端口启动专用 dev server → 运行全部 E2E。

E2E 是唯一测试接缝：只断言外部可见行为（页面内容、跳转），不断言内部实现。

## 约定

- 数据库脚本与 Playwright 均运行在 Node 运行时；better-sqlite3 与 bun 运行时不兼容，不要用 bun 直接执行碰数据库的脚本。
- better-auth 依赖已安装；服务端配置（`src/lib/auth.ts`）与路由（`src/app/api/auth/[...all]/route.ts`）将在下一 ticket 创建。
