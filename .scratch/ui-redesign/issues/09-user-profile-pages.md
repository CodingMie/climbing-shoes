# 09 — 用户主页与脚型档案

**What to build:** 用户主页与脚型档案页按设计稿 restyle：用户页换为 micro 标签 + 用户名 + spec 网格脚型摘要 + TA 的测评列表（含空态）；脚型档案表单换为标签在上的网格布局。视觉规格见设计稿「08 用户主页 · 脚型档案」节。

**Blocked by:** 03 — 测评卡片与首页

**Status:** done

- [x] 用户页脚型摘要用 spec 网格（脚宽窄 / 足弓 / 脚后跟 / 拇外翻 / 脚长 / 日常鞋码 / 脚型），数据来源不变；空文案「TA 还没有填写脚型档案。」保留
- [x] 测评列表复用新卡片（不显作者用法）
- [x] 脚型档案表单字段与标签不变，role="alert" 错误与 role="status"「脚型档案已保存」保留
- [x] 受保护页面未登录重定向行为不变

## Comments

- 2026-08-05 落地备注：用户页 `src/app/u/[username]/page.tsx` 按设计稿「08」重排：micro-label「MEMBER · 脚型档案与测评」+ 26px black 用户名；脚型摘要改 spec 网格（与鞋详情同款 gap-px hairline 分栏，grid-cols-2 lg:grid-cols-4，cell bg-card px-4 py-3.5，micro 标签 + 数值）8 格：脚宽窄/足弓/脚后跟（取 foot-summary.tsx 新导出的 FOOT_WIDTH_LABELS/ARCH_LABELS/HEEL_LABELS 自然措辞）/拇外翻（原值，避免「拇外翻：无拇外翻」冗余）/脚长 mm/日常鞋码 EU/脚型（mono 15px/600）/测评数（mono）。数据来源不变（getFootProfile + listUserReviews）。无档案时空文案「TA 还没有填写脚型档案。」改 dashed hairline-strong 盒（与鞋详情空态同款）；无测评空文案「还没有发布过测评。」同款空态盒。测评列表区 mt-[34px] h2 18px「TA 的测评（N）」+ ReviewCard（showAuthor={false}）grid gap-3.5。脚型档案页 `src/app/settings/profile/page.tsx`：micro「FOOT PROFILE」+ 26px black h1 + 13px sub（文案不变）+ 表单区 mt-6；`foot-profile-form.tsx` 改三行 3 列网格（grid gap-[22px]，行内 gap-3.5 sm:grid-cols-3，字段格 grid gap-1.5 标签在上）：①脚长/日常鞋码/脚型 ②脚宽窄/足弓/脚背 ③脚后跟/拇外翻/保存按钮（第 3 格 items-end + flex-1，对齐设计稿 filter-actions）；错误 role="alert" 与 role="status"「脚型档案已保存」机制与文案保留（字号随表单错误惯例 12.5px）。字段 id/name/标签全部不变。Playwright 实测：spec 网格数值/空态两分支、档案保存 → status → 刷新预填均正常；auth.spec 的 /settings/profile 重定向断言不受影响。typecheck/lint 绿，test:e2e 17/17 绿。
