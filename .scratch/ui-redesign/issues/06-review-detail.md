# 06 — 测评详情

**What to build:** 测评详情页 restyle：尺码信息换为尺码盒（日常码 → 试穿 + accent 差值 chip）；维度评分与鞋详情同构（综合推荐指数数字 + 6 维雷达图，单人整数分）；合身度反馈 / 使用背景用 kv hairline 列表；文字体验 + 优缺点并排 hairline 盒；作者脚型摘要盒。视觉规格见设计稿「05 测评详情」节。

**Blocked by:** 05 — 鞋款详情页（雷达组件）

**Status:** done

- [x] 尺码盒按设计稿：mono 数值、accent 差值 chip
- [x] 维度评分复用微信雷达组件（6 维 + 综合推荐指数整数分）
- [x] 编辑测评 / 删除测评按钮与文案保留（仅作者可见）
- [x] 各节文案与结构不变（尺码信息 / 维度评分 / 合身度反馈 / 使用背景 / 文字体验 / 优点 / 缺点 / 作者脚型摘要）

## Comments

- 2026-08-05 落地备注：`src/app/reviews/[id]/page.tsx` 按设计稿「05 测评详情」重排（max-w-3xl 窄版心不变）：页头 micro-label「{brand} · {model}」+ 26px black h1「{author} 的测评」（username 链接带 underline offset-4）+ mono 11.5px 发布日期；返回链接改 backlink 样式（text-label muted hover trail）。尺码信息换尺码盒：flex wrap hairline 盒 mono 12.5px，「日常码 · STREET」（取作者 foot_profile.street_size，EU 前缀，缺失时「—」）→ 箭头（hairline-strong）→「试穿 · TRIED」（{sizeSystem} {sizeTried}），右侧 ml-auto accent chip（h-5 mono 11px/600，bg-trail-tint text-primary border-primary/25，文案 formatSizeDelta）。维度评分与鞋详情同构：gap-px hairline 分栏容器内单 agg-cell，sr-only ul（综合推荐指数居首，li「标签 整数 分」）+ overall-line（micro「综合推荐指数 · OVERALL」+ mono 24px 整数 / 5）+ 雷达图。雷达组件 `src/components/shoes/radar-chart.tsx` 增加三个可选 props：ariaLabel（默认「六维度均分雷达图」）、formatValue（默认 toFixed(1)）、className（cn 合并，twMerge 覆盖 max-w）——鞋详情页不传参行为不变；测评详情传 ariaLabel「六维度评分雷达图」、formatValue 整数、max-w-[280px]。合身度反馈 / 使用背景改用页面内 KvList（dl，hairline 盒，行 px-4 py-[11px] 13px，dt muted dd 500 右对齐，border-t 分栏 first:border-t-0），文案逐字不变。文字体验 13.5px/1.9 ink-soft；优点 / 缺点并排 hairline 盒（两者都有时 grid-cols-2 gap-3.5，单一时独占一行），h4 13px bold + 12.5px/1.8 ink-soft。作者脚型摘要 hairbox（px-[18px] py-4）：h3 13px bold + 作者名 13px/500 + 复用 FootSummaryLine / FootStatsLine（组件未动，u/[username] 共用）。各节标题按设计稿 h3 15px bold（优点/缺点 h4），节文案逐字保留。编辑/删除按钮条件逻辑与文案不变（outline sm + destructive sm，后者即设计稿 btn-danger）。数据层 / actions / 路由未动。手工验证：dev 库渲染（含 pros/cons 并排、作者视角按钮、整数雷达值 5/4/3/3/3/4）；typecheck/lint 绿，test:e2e 17/17 绿（雷达 props 扩展不影响鞋详情聚合定位器）。
