# 10 — Contract 与最终审计

**What to build:** 收尾：删除不再被引用的旧组件，全站视觉一致性审计，交付改动清单与需真图清单。

**Blocked by:** 02–09 全部票据

**Status:** done

- [x] 不再被引用的旧组件（如 Card 家族）已删除，无死代码
- [x] 一致性审计通过：单一 accent（trail orange 仅用于尺码差值 / rating / 激活态 / 主 CTA）、2px 圆角统一、hairline 分组无阴影、表单与按钮对比度 ≥ WCAG AA、md 以下非对称布局折叠为单列
- [x] dark token 可渲染（.dark 下层级、对比度无明显破坏）
- [x] bun run typecheck / lint / test:e2e 全绿
- [x] 交付改动清单 + 需真图清单（鞋库卡片主图 4:3、鞋详情页主图 4:3）

## Comments

- 2026-08-05 审计备注：
  - 死代码：删除 `src/components/ui/card.tsx`（08 后 0 引用，唯一死组件）；逐一核对 src/components 与 src/lib 导出，其余全部有引用。
  - 单一 accent：全站 text-primary/bg-primary/var(--trail) 仅出现在——尺码差值（鞋详情结论句占比、分布条 fill、测评详情尺码盒 chip）、rating（星级选中/悬停、雷达图填充与顶点、鞋卡匹配均分、合身度最高项高亮——设计稿 `.fit-row li.top` 明文）、激活态（导航/返回链接/卡片链接 hover、按钮 focus ring）、主 CTA（Button default、移动端注册行）。无越界使用。
  - 2px 圆角：card.tsx 删除后全站仅 rounded-lg（= var(--radius) 2px）/ rounded-(--radius) / 条形 rounded-[1px]，无 rounded-md/xl/full。
  - 无阴影：`shadow-*` 0 处（focus ring 除外）。
  - 对比度：primary #C2410C 对 #FFF8F2 ≈ 4.8:1、destructive #A63A2E、granite #6A7266 对纸面 ≈ 4.6:1（01 票已核算），≥ WCAG AA。
  - 响应式折叠：hero 7:5 → 单列、鞋详情 5:6 头部与 spec 网格 4→2 列、聚合三格 lg 单列、筛选 4→2 列、表单 3/2 列 → sm 下单列，全部 lg/sm 断点折叠。
  - dark 验证：Playwright 加 .dark 实测 body #141A16 / 文字 #ECEEE8 / hairline #2C362E，层级与亮色一致；雷达图经 var(--trail)/var(--hairline) token 自动适配。
  - typecheck / lint 绿，test:e2e 17/17 绿。

### 交付改动清单（01–09）

| 票 | 范围 | 主要文件 |
| --- | --- | --- |
| 01 | 山系 token + 自托管字体 + 表单原语重做 | globals.css、layout.tsx、ui/button·input·select·textarea·label |
| 02 | 全局 shell：页头 + 移动端汉堡导航 | site-header(-shell)、logout-button |
| 03 | hairline 测评卡片 + 左对齐首页 hero | reviews/review-card、app/page.tsx |
| 04 | 鞋库：hairline 筛选面板 + 占位槽鞋卡 | app/shoes、shoes/filter-select |
| 05 | 鞋详情：5:6 头部 + spec 网格 + 聚合三格 + 服务端雷达图 | app/shoes/[id]、shoes/radar-chart |
| 06 | 测评详情：尺码盒 + 整数雷达 + kv 列表 + 优缺点并排盒 | app/reviews/[id] |
| 07 | 测评表单：hairline 分节 + 星级悬停修复 + 拦截页 | reviews/review-form、reviews/new、reviews/[id]/edit |
| 08 | 登录/注册：hairline 盒 + micro 标签 | app/login、app/register、auth/login-form·register-form |
| 09 | 用户主页 spec 网格 + 脚型档案三行网格 | app/u/[username]、settings/profile(-form)、foot-summary |
| 10 | 删 card.tsx + 全站一致性审计 | 本票 |

### 需真图清单

1. 鞋库卡片主图：4:3，每款鞋 1 张（当前为占位槽，`src/app/shoes/page.tsx` 鞋卡 img 槽）。
2. 鞋详情页主图：4:3，可多张（当前为占位槽「IMG · 鞋款主图 800×600」，`src/app/shoes/[id]/page.tsx`）。
3. （可选）首页无数据时的空态插图：线性山形风格。
