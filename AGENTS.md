# Climbing Shoe Platform

攀岩鞋试穿体验记录与分享平台（中文社区，自部署）。

- 技术栈：Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Drizzle ORM + SQLite + better-auth
- 包管理：bun
- 界面语言：中文

## 约定

- better-sqlite3 与 bun 运行时不兼容（NAPI 崩溃）；碰数据库的脚本一律用 `node` 执行（Next 服务本身跑在 Node 上，不受影响）。
- E2E（Playwright）是唯一测试接缝：`bun run test:e2e` 单条命令，使用一次性测试库（重建 + 自动迁移）。详见 README。
- 类型检查：`bun run typecheck`；lint：`bun run lint`。

## Agent skills

### Issue tracker

Issues 与 spec 以 markdown 文件存放在 `.scratch/`（本地 Markdown tracker）。See `docs/agents/issue-tracker.md`.

### Triage labels

使用默认五角色标签词表（needs-triage / needs-info / ready-for-agent / ready-for-human / wontfix）。See `docs/agents/triage-labels.md`.

### Domain docs

Single-context 布局：根目录 `CONTEXT.md` + `docs/adr/`（尚不存在时静默跳过）。See `docs/agents/domain.md`.
