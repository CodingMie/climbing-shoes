# 02 — 全局 shell：页头与移动端导航

**What to build:** 山系全局页头：品牌块（pine 色块 + Mountain 图标 + 站名与 micro 副标）、桌面端单行导航（未登录/已登录两态）、移动端收起为汉堡菜单并展开为全宽面板（hairline 分组）。所有既有入口（鞋库、登录、注册、用户名、脚型档案、退出）与其行为保留。视觉规格见设计稿「01 全局 Shell」节。

**Blocked by:** 01 — 设计地基

**Status:** done

- [x] 桌面页头单行、高度 ≤ 80px、hairline 底分隔
- [x] 未登录展示 鞋库/登录/注册（注册为主 CTA）；已登录展示 鞋库/用户名/脚型档案/退出
- [x] 移动端汉堡面板可展开收起，条目齐全，hairline 分组
- [x] E2E：banner 内用户名可见、退出后「登录」链接可见、「退出」按钮可用（auth.spec 断言不破）

## Comments

- 2026-08-04 落地备注：`src/components/site-header.tsx` 保留为 server 壳（getSession 取 username），渲染 client 组件 `src/components/site-header-shell.tsx`。品牌块 = 26px pine 色块（rounded-lg=2px）+ `Mountains weight="fill"`（@phosphor-icons，底对齐 + translate-y 使山脚贴底、overflow hidden 裁切，图标色用 sidebar-primary-foreground 对应设计稿 #F0F4EE）+ 站名（font-heading 14.5px bold）+ micro 副标「TRIAL · FIT · LOG」（mono 9px tracking 0.22em，移动端隐藏，与设计稿一致）。桌面单行 60px、hairline 底分隔、px-7（移动 px-4）；导航 gap 22px、text-body 13.5px、hover 变 trail；未登录 = 鞋库 | 登录 + 注册（Button sm primary）；已登录 = 鞋库 | 用户名（bold，链 /u/[username]）+ 脚型档案（/settings/profile）+ 退出。分隔竖线 1px×16px hairline-strong。移动端汉堡（List/X 图标 strokeWidth 1.5，aria-expanded/aria-controls/aria-label 打开菜单·关闭菜单）展开为全宽面板：行 hairline 分组（border-b）、左中文右 mono 微标（SHOES/PROFILE/FOOT DATA/SIGN OUT、未登录 SIGN IN/SIGN UP），注册行 trail 加粗作主 CTA；面板条件渲染（关闭时不占 DOM，避免用户名/退出/登录在 banner 内重复匹配破坏 E2E strict mode）；点击条目或路由变化（usePathname effect）自动收起。`logout-button.tsx` 扩展为透传 Button props（Omit variant/onClick），移动端退出行复用它（h-auto w-full justify-between 行式样）。修复 01 遗留 token 冲突：`--text-field` 与 `--color-field` 同名使 Tailwind v4 将 `text-field` 解析为颜色（导航链接近白字、字号丢失），重命名为 `--text-body`，同步 button/input/select/textarea。typecheck/lint 绿，test:e2e 17/17 绿；iPhone 13 视口手动验证汉堡展开/收起/条目齐全/注册退出全流程。
