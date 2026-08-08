# 攀岩鞋试穿体验平台

攀岩鞋试穿体验记录与分享平台（中文社区，自部署）。

## 技术栈

- Next.js 15（App Router）+ TypeScript + Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + better-sqlite3（SQLite）
- better-auth（用户名/邮箱 + 密码认证，会话存库）
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
- `bun run db:seed`：补充品牌/鞋款种子数据（全部 approved），并在 `public/seed/` 生成占位图。按品牌名/鞋款名去重，只插入缺失项、不清空已有数据（避免级联删除测评），可重复执行，仅用于开发库。

## 测试

```bash
bun run test:e2e
```

单条命令完成：重建一次性测试库 `data/e2e.db`（自动应用迁移）→ 在 3100 端口启动专用 dev server → 运行全部 E2E。

E2E 是唯一测试接缝：只断言外部可见行为（页面内容、跳转、数据库最终状态），不断言内部实现（组件结构、函数调用、样式细节）。

## 约定

- 数据库脚本与 Playwright 均运行在 Node 运行时；better-sqlite3 与 bun 运行时不兼容，不要用 bun 直接执行碰数据库的脚本。
- 认证：better-auth 服务端配置在 `src/lib/auth.ts`，路由 `src/app/api/auth/[...all]/route.ts`，客户端 `src/lib/auth-client.ts`；受保护页面用 `src/lib/session.ts` 的 `requireUser()`（未登录重定向 `/login`）。
- 环境变量：生产环境必须设置 `BETTER_AUTH_SECRET`（≥32 字符随机串）；`BETTER_AUTH_URL` 可选（默认按请求 Host 动态解析，dev 允许 localhost:3000/3100）。
