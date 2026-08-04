# 10 — Contract 与最终审计

**What to build:** 收尾：删除不再被引用的旧组件，全站视觉一致性审计，交付改动清单与需真图清单。

**Blocked by:** 02–09 全部票据

**Status:** ready-for-agent

- [ ] 不再被引用的旧组件（如 Card 家族）已删除，无死代码
- [ ] 一致性审计通过：单一 accent（trail orange 仅用于尺码差值 / rating / 激活态 / 主 CTA）、2px 圆角统一、hairline 分组无阴影、表单与按钮对比度 ≥ WCAG AA、md 以下非对称布局折叠为单列
- [ ] dark token 可渲染（.dark 下层级、对比度无明显破坏）
- [ ] bun run typecheck / lint / test:e2e 全绿
- [ ] 交付改动清单 + 需真图清单（鞋库卡片主图 4:3、鞋详情页主图 4:3）
