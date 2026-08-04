# 05 — 鞋款详情页（风格语言主战场）

**What to build:** 鞋详情页按设计稿 restyle：顶部 5:6 非对称分栏（左占位槽，右 brand micro 标签 + display 型号 + mono 价格 + 品牌描述 + spec 网格）；「测评数据」区三块压缩为一行（移动端竖向堆叠）：维度均分（综合推荐指数数字 + 6 维雷达图，accent 填充）、尺码偏移（结论句 accent 强调占比 + 分布条）、合身度反馈（每部位一行，最高项 accent 高亮）。测评列表复用新卡片。视觉规格见设计稿「04 鞋款详情」节。

**Blocked by:** 03 — 测评卡片与首页；04 — 鞋库（筛选组件）

**Status:** done

- [x] spec 网格按设计稿：micro 标签 + 数值，4 列（移动端 2 列），gap 1px hairline 分栏
- [x] 测评数据三格并排为一个 hairline 分栏容器；移动端单列堆叠
- [x] 雷达图为纯服务端渲染 SVG（无客户端 JS），配视觉隐藏的七维列表（li，含综合推荐指数与一位小数均分，供读屏与既有 E2E 定位器）
- [x] 「基于 N 条测评」「还没有测评，聚合数据会在首条测评后出现」「没有符合所选脚型的测评」等文案不变
- [x] aggregates.spec 全绿（维度均分/尺码偏移/合身度定位器与数值、脚型筛选、空态、URL 参数保留）

## Comments

- 2026-08-05 落地备注：顶部按设计稿 5:6 非对称（lg:grid-cols-[5fr_6fr]，移动单列）：左占位槽 aspect-4/3 bg-surface-2 hairline 边框，双行 micro「IMG · 鞋款主图 800×600」+「占位槽 · 交付时换真图」（9px），seed SVG/img 分支删除；右 brand micro「{brand} · SPEC 规格」+ h1 32px black + mono 价格 22px/600 + 品牌描述 13px muted 52ch + spec 网格（dl，grid-cols-2 lg:grid-cols-4 gap-px bg-hairline hairline 分栏，cell bg-card px-4 py-3.5，micro 标签 + 14px/500 数值；第八格「参考价」mono 15px/600 补齐设计稿 4×2 网格）+ 写测评/编辑我的测评按钮（条件逻辑不变）。返回链接改 backlink 样式（text-label muted hover trail）。测评数据区：h2 20px + 13px 副题 + 脚型筛选面板（与鞋库同款 hairline 盒，3 字段 + FilterActions 占第 4 列）；「基于 N 条测评」mono 12px muted mt-5。聚合三格一个 hairline 分栏容器（grid gap-px bg-hairline border rounded-lg，lg:grid-cols-[1.1fr_0.95fr_1.15fr]，移动单列）：维度均分格 = h3 + sr-only 七维 ul（综合推荐指数居首，li「标签 一位小数」供读屏与 E2E）+ overall-line（micro「综合推荐指数 · OVERALL」+ mono 24px 大数字 / 5）+ 雷达图；尺码偏移格 = h3 + 结论句（accent mono 占比 + 其余 ink-soft，由 sizeHeadline 正则拆出）+ 分布条（lbl 92px 12px、3px track bg-surface-2 fill primary、sub 76px mono 11px）；合身度反馈格 = 每部位一行（h4 52px 13px bold + mono 12px 选项行，· 分隔，最高项 accent 600）。雷达图抽为 `src/components/shoes/radar-chart.tsx` 纯服务端组件：viewBox 300×262、中心 (150,140)、半径 85、六轴顺时针自顶部（包裹/舒适/精准/灵敏/摩擦/支撑），5 环 hairline 网格 + 轴线，数据多边形 var(--trail-tint) 填充 var(--trail) 描边 + 顶点圆点，轴标签 11px granite + mono 600 ink 数值（dark 模式经 token 自动适配）。E2E 结构保留：statsSection/h3/h4/li 定位器不变；合身度反馈格外层用 div（非 section）——若用 section 会同时命中 fitCard 的 h4 过滤造成 strict-mode 重复匹配。空态两案改 dashed hairline-strong 盒，文案逐字保留。测评列表 h2 18px + ReviewCard grid gap-3.5。数据层/路由/actions 未动。桌面 1280 / 移动 390 截图核对设计稿；typecheck/lint 绿，test:e2e 17/17 绿。
