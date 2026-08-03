# 02 — 认证：注册/登录/登出/会话

**What to build:** 访客可以用用户名/邮箱 + 密码注册账号，登录、登出，会话在多次访问间保持。受保护页面具备会话检查与重定向登录的能力。管理员角色与审核流程不在本期范围，users 表仅保留 role 字段备用。

**Blocked by:** 01 — 脚手架 + E2E 测试接缝

**Status:** ready-for-agent

- [x] 注册（用户名/邮箱 + 密码）创建用户并自动登录
- [x] 重复的用户名/邮箱被拒绝，返回中文错误提示
- [x] 登录、登出正常工作；密码仅以哈希存储
- [x] 会话跨浏览器会话保持（E2E 用 storage state 验证）
- [x] E2E 覆盖完整旅程：注册 → 登录 → 登出 → 再登录

## Comments

- 2026-08-03 实现完成。
- better-auth 1.6.25 + Drizzle adapter（sqlite）+ username 插件；登录框单字段按是否含 `@` 分流到邮箱/用户名登录。
- 首个真实迁移 `drizzle/0000_ancient_psylocke.sql`：user/session/account/verification 四表，列名 snake_case，drizzle 属性 camelCase（adapter 按 camelCase 查找）；users 表含 username（唯一）与 role（默认 user，本期仅备用）。
- 中文错误提示在前端按 better-auth 错误码映射（`src/lib/auth-errors.ts`），如 USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL → 该邮箱已被注册、USERNAME_IS_ALREADY_TAKEN → 该用户名已被占用。
- 会话默认 7 天、cookie 持久（better-auth 默认行为），storage state E2E 验证跨浏览器会话保持。
- 受保护页面能力：`src/lib/session.ts` 提供 `getSession()`/`requireUser()`；以 `/settings/profile` 占位页作为首个受保护路由（未登录重定向 /login），脚型档案表单由 ticket 04 实现。
- 头部（layout 服务端组件）按会话显示 登录/注册 或 用户名 + 退出。
- 生产环境必须设置 `BETTER_AUTH_SECRET`；dev 有内置 fallback。`BETTER_AUTH_URL` 未设置时用动态 baseURL（allowedHosts: localhost:3000/3100）。
- E2E 10 条（e2e/auth.spec.ts），含数据库最终状态断言（account.password 无明文）；`bun run test:e2e` 全套 11 条通过。
- code-review 修正：注册表单接入 zod 前端校验（中文提示，spec 技术栈决策）；role 列用 drizzle text enum【user、admin】（仅 TS 层，不产生迁移）；README 测试接缝措辞与 spec 对齐（允许「数据库最终状态」断言）。
- 与 spec 字面偏差（better-auth 惯例）：密码哈希存于 account.password 而非 users 表；username 列可空（better-auth username 插件 schema 原样，UI 注册必提交 username）。
