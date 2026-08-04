# 03 — 测评卡片与首页

**What to build:** 按设计稿实现核心组件「测评卡片」并全站复用：brand micro 标签 + display 鞋名 + 作者行（含脚型摘要）| 右侧 mono 综合分（大数字 + /5），摘要，页脚（查看完整测评链接 + mono 日期）；不含 rating 条、不含尺码偏移。首页换为左对齐 hero（标题 + 副题 + CTA，无数据条）+ 最新测评流 + 空态。视觉规格见设计稿「00 测评卡片」「02 首页」节。

**Blocked by:** 01 — 设计地基

**Status:** done

- [x] 新测评卡片按设计稿：hairline 边框、2px 圆角、无阴影；综合分为 mono 大数字
- [x] 卡片支持三种用法：首页（显鞋名 + 作者）、鞋详情列表（不显鞋名）、用户主页（不显作者）
- [x] 首页 hero 左对齐，h1 文案「攀岩鞋试穿体验平台」不变；已登录隐藏注册 CTA（既有行为保留）
- [x] 首页测评流空态文案不变
- [x] smoke E2E 绿（lang/title/heading）

## Comments

- 2026-08-05 落地备注：`review-card.tsx` 按设计稿 `.rcard` 重做——hairline 边框（hover 变 hairline-strong）、rounded-lg（2px）、无阴影、px-5 py-[18px]；顶部行左 brand micro 标签 + display 鞋名（h3 16.5px bold，链接 hover underline 3px）+ 作者行（12px muted，「by 」前缀仅首页用法，作者链接 ink-soft medium，脚型摘要以「 · 」并入同一行），右侧综合分竖排（micro「综合」+ mono 22px/600 大数字 + mono 10.5px「/ 5」）；摘要 13px ink-soft lh 1.75（截断 100 字保留）；页脚 hairline 上分隔，「查看完整测评 →」12.5px hover 变 trail + mono 11px 日期（改 en-CA 输出 `2026-08-04` 式，对齐设计稿）。`ReviewCardData` 删除 sizeTried/sizeSystem/sizeDelta（卡片不再含尺码偏移，调用方行结构兼容）。micro 样式（mono 10.5px/0.18em/uppercase/muted）抽为 `globals.css` 的 `.micro-label` 组件类，卡片与首页共用（页头 9px/0.22em 变体保持独立）。`foot-summary.tsx` 抽出 `footSummaryLabels()`，`FootSummaryLine` 复用它。首页 `page.tsx`：hero 左对齐（micro eyebrow「社区 · COMMUNITY LOG」+ h1 27/38px black + 副题 14.5px ink-soft max-w-40ch + 双 CTA，hairline 底分隔，移动端 padding 28px 对齐设计稿移动规格，无数据条——按票覆盖设计稿 stat-strip）；「最新测评」标题行（h2 18px + 「去鞋库找一双 →」muted hover trail，仅有测评时显示）+ 卡片 grid gap-3.5；空态改 dashed hairline-strong 盒（`.empty` 样式），文案逐字保留。三种用法经截图核对：首页（鞋名+作者）、鞋详情（仅作者行、无「by」）、用户主页（仅鞋名）。typecheck/lint 绿，test:e2e 17/17 绿；code-review 双轴无硬违规，微标签重复与移动端 hero padding 两处 finding 已修。
