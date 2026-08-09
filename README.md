# 攀岩鞋试穿体验平台

攀岩鞋试穿体验记录与分享平台（中文社区，自部署）。

## 技术栈

- Next.js 15（App Router）+ TypeScript + Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + @libsql/client（本地 SQLite 文件 ⇄ 生产 Turso）
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

- 本地开发：用 `@libsql/client` 直连本地 SQLite 文件，默认 `data/app.db`（可用环境变量 `DATABASE_PATH` 覆盖）。
- 生产（Turso）：设置环境变量 `TURSO_DATABASE_URL`（如 `libsql://<db>.turso.io`）与 `TURSO_AUTH_TOKEN`，应用、脚本自动切换到 Turso 远程库；本地开发无此变量时始终用本地文件。
- `bun run db:generate`：schema 变更后生成迁移（输出到 `drizzle/`，随代码提交）。
- `bun run db:migrate`：应用迁移。未设置 Turso 变量时指向 `DATABASE_PATH` 的本地库；设置了 `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` 时指向 Turso 库。
- `bun run db:seed`：补充品牌/鞋款种子数据（全部 approved），并在 `public/seed/` 生成占位图。按品牌名/鞋款名去重，只插入缺失项、不清空已有数据（避免级联删除测评），可重复执行，仅用于开发库。
- 一键建 Turso 库结构 + 初始数据：`turso db shell <db-name> < turso/init.sql`（建表语句与 15 品牌 / 113 鞋款初始数据，内容与 migrate+seed 一致）。

环境变量速查：

| 变量 | 说明 |
| --- | --- |
| `DATABASE_PATH` | 本地 SQLite 文件路径（默认 `data/app.db`） |
| `TURSO_DATABASE_URL` | 生产 Turso 库 URL（如 `libsql://<db>.turso.io`）；设置后切换为远程库 |
| `TURSO_AUTH_TOKEN` | 生产 Turso 访问令牌 |
| `BETTER_AUTH_SECRET` | 生产必填，≥32 字符随机串 |
| `BETTER_AUTH_URL` | 可选，默认按请求 Host 动态解析 |

## 测试

```bash
bun run test:e2e
```

单条命令完成：重建一次性测试库 `data/e2e.db`（自动应用迁移）→ 在 3100 端口启动专用 dev server → 运行全部 E2E。

E2E 是唯一测试接缝：只断言外部可见行为（页面内容、跳转、数据库最终状态），不断言内部实现（组件结构、函数调用、样式细节）。

## 约定

- 数据库脚本与 Playwright 均运行在 Node 运行时；@libsql/client 本地文件为原生模块，与 bun 运行时存在 NAPI 兼容问题，不要用 bun 直接执行碰数据库的脚本。
- 认证：better-auth 服务端配置在 `src/lib/auth.ts`，路由 `src/app/api/auth/[...all]/route.ts`，客户端 `src/lib/auth-client.ts`；受保护页面用 `src/lib/session.ts` 的 `requireUser()`（未登录重定向 `/login`）。
