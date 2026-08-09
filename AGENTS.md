# Climbing Shoe Platform

攀岩鞋试穿体验记录与分享平台（中文社区，自部署）。

- 技术栈：Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Drizzle ORM + @libsql/client（本地 SQLite ⇄ 生产 Turso）+ better-auth
- 包管理：bun
- 界面语言：中文

## 约定

- 数据库驱动统一用 `@libsql/client`（`src/db/index.ts` 的 `getDb()`）：本地无 `TURSO_DATABASE_URL` 时连本地 SQLite 文件（`data/app.db`，`DATABASE_PATH` 可覆盖），设置 `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` 时连 Turso 远程库。drizzle libsql 驱动是 async 的，所有查询函数返回 Promise，调用处一律 `await`。
- @libsql/client 本地文件为原生模块，与 bun 运行时存在 NAPI 兼容问题；碰数据库的脚本一律用 `node` 执行（Next 服务本身跑在 Node 上，不受影响）。
- E2E（Playwright）是唯一测试接缝：`bun run test:e2e` 单条命令，使用一次性测试库（重建 + 自动迁移）。详见 README。
- 类型检查：`bun run typecheck`；lint：`bun run lint`。
- 开发流程：不用 TDD、不先写测试，直接实现功能（UI 将重构，测试暂缓）。完成改动后仍跑 `bun run typecheck` + `bun run lint`；改动涉及已有 E2E 覆盖的行为时跑 `bun run test:e2e` 确认没弄坏。

## 代码地图（定位开发位置，避免全库扫描）

分层：页面 `src/app/<route>/page.tsx` → 服务端写操作放同目录 `actions.ts`（server action）→ 数据读写 `src/lib/*.ts` → 表与枚举常量 `src/db/schema.ts`。

- 受保护页面用 `src/lib/session.ts` 的 `requireUser()`；会话/认证在 `src/lib/auth.ts`（服务端）与 `src/lib/auth-client.ts`（客户端），路由 `src/app/api/auth/[...all]/route.ts`。
- 现有功能：鞋库 `src/lib/shoes.ts` + `src/app/shoes/`；脚型档案 `src/lib/foot-profile.ts`、`src/lib/foot-profile-schema.ts` + `src/app/settings/profile/`；测评 `src/lib/reviews.ts`、`src/lib/reviews-schema.ts` + `src/app/reviews/`（new/[id]/[id]/edit，actions 同目录）；首页最新测评流 `src/app/page.tsx`；用户主页 `src/lib/users.ts` + `src/app/u/[username]/`。测评卡片统一用 `src/components/reviews/review-card.tsx`。
- 校验 schema（zod，中文提示）放 `src/lib/<feature>-schema.ts`，保持 client-safe（不 import `@/db`），前后端共用；DB 读写单独放 `src/lib/<feature>.ts`。通用小工具：`src/lib/zod-helpers.ts`（zod 首条错误消息）、`src/lib/params.ts`（路由/查询参数解析）、`src/lib/shoes.ts` 的 `formatShoeTitle`。
- 客户端组件（`"use client"`）不得 import `@/db`（其会拉起 libsql 连接）；枚举常量（`SHOE_*`/`FOOT_*`）定义在 `src/db/schema.ts`。
- UI 组件：shadcn 原语在 `src/components/ui/`，业务组件在 `src/components/<feature>/`；表单参照 `register-form.tsx` 的模式（zod 前端校验 + 单条 `role="alert"` 中文错误）。
- 表名单数、列 snake_case、drizzle 属性 camelCase；迁移输出到 `drizzle/` 并随代码提交，`bun run db:generate` 生成、`bun run db:migrate` 应用。
- E2E 在 `e2e/<feature>.spec.ts`（断言外部可见行为）；需求与实现备注在 `.scratch/climbing-shoe-platform/issues/`（已完成 ticket 的 Comments 含落地细节）。
- 鞋款图片：本地采集图存 `public/shoe-images/`，DB `shoe.images` 存 `/shoe-images/<file>.jpg` 或外部 URL；给鞋补真实产品图用 skill `fetch-shoe-images`（见 `.agents/skills/fetch-shoe-images/SKILL.md`）。
- 领域术语以根目录 `CONTEXT.md` 为准（如「宽度楦型」是鞋、「脚宽窄」是脚，勿混用）。

典型任务路径：

- 加/改页面功能 → 对应 `src/app/<route>/page.tsx`（+ `actions.ts`）与 `src/components/<feature>/`。
- 加表/字段 → 改 `src/db/schema.ts` → `bun run db:generate && bun run db:migrate` → 更新 `src/lib/<feature>.ts`。
- 加校验 → 在 `src/lib/<feature>-schema.ts` 定义 zod schema，action 与表单共用。
- 找某功能的既有实现 → 先读对应 ticket 的 Comments，再到 `src/lib/` 与 `src/app/`。

## Agent skills

### Issue tracker

Issues 与 spec 以 markdown 文件存放在 `.scratch/`（本地 Markdown tracker）。See `docs/agents/issue-tracker.md`.

### Triage labels

使用默认五角色标签词表（needs-triage / needs-info / ready-for-agent / ready-for-human / wontfix）。See `docs/agents/triage-labels.md`.

### Domain docs

Single-context 布局：根目录 `CONTEXT.md`（领域词汇表，已建立）+ `docs/adr/`（尚不存在时静默跳过）。See `docs/agents/domain.md`.
