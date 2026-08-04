# 04 — 鞋库

**What to build:** 鞋库页 restyle：hairline 筛选面板（属性筛选网格 +「按脚型筛选」组以 hairline 上分隔分组 + 筛选/清空），结果网格换为鞋卡片（明确标注的占位槽 + brand micro 标签 + display 型号 + mono 价格 + accent 脚型匹配行 + spec 行），空态 restyle。鞋图按 brief 用占位槽，不渲染 seed SVG。视觉规格见设计稿「03 鞋库」节。

**Blocked by:** 01 — 设计地基

**Status:** done

- [x] 筛选面板按设计稿：4 列网格（移动端 2 列），脚型组有 hairline 上分隔与组标题，筛选为主 CTA，清空仅在有激活条件时出现
- [x] 鞋图展示为占位槽（标注待真图），seed SVG 不再渲染
- [x] 脚型筛选命中时卡片展示「匹配脚型均分 X.X · N 人评过」（accent）
- [x] 空态文案「没有找到匹配的鞋款，试试调整筛选条件」保留
- [x] aggregates.spec 鞋库用例绿（匹配脚型均分文案、鞋库→详情页参数传递）

## Comments

- 2026-08-05 落地备注：页头按设计稿改左右结构——左 h1 26px black + 13px muted 副题，右 mono 12px「共 N 款 · 按匹配脚型测评者的平均分排序」（排序子句仅脚型筛选命中时出现）；页面 padding 移动 22/16/32、桌面 32/28/44（px-4 pt-[22px] pb-8 md:px-7 md:pt-8 md:pb-11）。筛选面板 hairline 盒（border-border bg-card rounded-lg p-[18px]）内 grid-cols-2 gap-3.5 lg:grid-cols-4；价格区间 col-span-2；FilterActions（筛选 primary flex-1、清空 outline 仅 hasActiveFilters 出现）移到价格后占第 4 列；「按脚型筛选」组 col-span-full + border-t 上分隔 + 13px bold 组标题 + 12px muted 说明，对齐设计稿 .filter-group-label。结果网格 mt-[22px] gap-3.5 lg:grid-cols-3（移动单列，对齐设计稿 900px 断点策略）。鞋卡按设计稿 .shoe-card：占位槽 aspect-4/3 bg-surface-2 border-b hairline 双行 micro「IMG · 主图 800×600」+「待真图」（9px），img/seed SVG 分支删除；body = brand micro-label + h3 15.5px bold + mono 价格 14px/600 + 匹配行 mono 11.5px/600 text-primary（文案逐字保留，aggregates.spec 依赖）+ spec 行 11px muted hairline 上分隔；hover border-hairline-strong，卡 h-full 等高。空态与首页同款 dashed hairline-strong 盒（px-5 py-9 13px 居中），文案逐字保留，按设计稿加「清空全部筛选」下划线链接（→ /shoes，hover trail）。数据层/路由/actions 未动（brief 红线）；FilterSelect/FilterActions 组件与 shoeHref 参数传递不变，E2E 可访问名（脚型 combobox、筛选按钮）保留。桌面 1280 / 移动 390 / 脚型命中 / 空态四态截图核对设计稿；typecheck/lint 绿，test:e2e 17/17 绿。
