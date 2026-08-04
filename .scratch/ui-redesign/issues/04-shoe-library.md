# 04 — 鞋库

**What to build:** 鞋库页 restyle：hairline 筛选面板（属性筛选网格 +「按脚型筛选」组以 hairline 上分隔分组 + 筛选/清空），结果网格换为鞋卡片（明确标注的占位槽 + brand micro 标签 + display 型号 + mono 价格 + accent 脚型匹配行 + spec 行），空态 restyle。鞋图按 brief 用占位槽，不渲染 seed SVG。视觉规格见设计稿「03 鞋库」节。

**Blocked by:** 01 — 设计地基

**Status:** ready-for-agent

- [ ] 筛选面板按设计稿：4 列网格（移动端 2 列），脚型组有 hairline 上分隔与组标题，筛选为主 CTA，清空仅在有激活条件时出现
- [ ] 鞋图展示为占位槽（标注待真图），seed SVG 不再渲染
- [ ] 脚型筛选命中时卡片展示「匹配脚型均分 X.X · N 人评过」（accent）
- [ ] 空态文案「没有找到匹配的鞋款，试试调整筛选条件」保留
- [ ] aggregates.spec 鞋库用例绿（匹配脚型均分文案、鞋库→详情页参数传递）
