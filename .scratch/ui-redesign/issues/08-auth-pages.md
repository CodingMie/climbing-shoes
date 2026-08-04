# 08 — 登录 / 注册

**What to build:** 登录与注册页按设计稿 restyle：去掉 Card 阴影，换为 hairline 盒 + 左对齐标题 + micro 标签；表单、错误展示与切换链接不变。视觉规格见设计稿「07 登录 / 注册」节。

**Blocked by:** 01 — 设计地基

**Status:** done

- [x] 页面结构按设计稿：micro 标签 + 标题 + 描述 + 表单 + 底部切换链接
- [x] 表单标签（用户名或邮箱 / 密码 / 用户名 / 邮箱）、按钮文案（登录 / 注册 / 登录中… / 注册中…）不变
- [x] role="alert" 错误文案（该邮箱已被注册 / 该用户名已被占用 / 用户名至少 3 个字符 等）正常展示
- [x] auth.spec 全绿

## Comments

- 2026-08-05 落地备注：登录/注册页（`src/app/login/page.tsx`、`src/app/register/page.tsx`）去掉 Card，改为 hairline 盒：`mx-auto max-w-[400px] rounded-lg border border-border bg-card px-7 py-14`（设计稿 .auth-wrap 400px / 56×28px 内距），盒内自上而下 micro-label（SIGN IN / SIGN UP）→ h1 24px black mt-1.5 → 描述 13px muted mt-1 → 表单区 mt-[22px] → 底部切换链接 mt-[18px] 居中 12.5px muted（链接 ink 700 underline offset 3px，设计稿 .auth-switch）。表单组件（`src/components/auth/login-form.tsx`、`register-form.tsx`）：form 改 `grid gap-3.5`（设计稿 .auth-box gap 14px），字段格 `grid gap-1.5`（.field gap 6px），错误 p 改 `text-label text-destructive`（12.5px，设计稿错误示例）；字段 id/name/label、按钮文案（登录/注册/登录中…/注册中…）、role="alert" 单条机制全部不变。页面不再垂直居中（设计稿 .auth-wrap 仅水平 margin auto），main 保留 px-6 py-16。`src/components/ui/card.tsx` 至此无引用（保留原语未删，供后续票决定）。Playwright 实测错误态「用户名至少 3 个字符」正常渲染；auth.spec 10/10 绿，test:e2e 17/17 绿，typecheck/lint 绿。
