# 07 — 首页 + 用户主页

**What to build:** 首页展示热门鞋款（按测评数/综合推荐指数排序）与最新测评流，让访客快速了解社区内容；用户公开主页展示该用户的脚型档案摘要与 TA 的测评列表，让读者评估作者测评的参考价值。

**Blocked by:** 04 — 脚型档案；05 — 测评；06 — 聚合展示

**Status:** ready-for-agent

- [ ] 首页展示热门鞋款（按测评数/综合分排序）与最新测评流（最新测评流已实现；热门鞋款排行依赖聚合，待聚合方向确定后补——见 Comments）
- [x] 用户主页展示脚型档案摘要与该作者的测评列表
- [x] 无数据时首页与用户主页展示空状态
- [ ] E2E：种子数据 + 创建测评后，首页与用户主页内容正确（按用户要求暂缓：UI 将重构，测试后补）

## Comments

- 2026-08-04 实现为「骨架」版（用户选择）：先用现有数据搭首页最新测评流 + 用户主页，聚合与热门排行等方向定了再补。
- **范围决策背景**：用户提出「评分严重依赖脚型，简单聚合无效」。spec 本就把「同脚型测评聚合 / 脚型 ↔ 鞋款智能匹配」划为二期（spec.md L20、L170-172）。因此本 ticket 暂缓「热门鞋款（按测评数/综合分排序）」，把它留给 ticket 06 重新定义聚合方向（数据稀疏阶段，按脚型筛选/暴露脚型上下文可能比全局聚合更有价值）。06 不再是本 ticket 的硬阻塞。
- 数据层：`src/lib/reviews.ts` 新增 listLatestReviews（公开流，过滤 approved 鞋款）、listUserReviews；`src/lib/users.ts` 新增 getUserByUsername。
- 共享组件 `src/components/reviews/review-card.tsx`：鞋详情页（showShoe=false）、首页（showShoe+showAuthor）、用户主页（showAuthor=false）三处复用，消除原鞋页内联卡片重复；作者名链接到 `/u/[username]`。
- 用户主页路由 `/u/[username]`（spec 页面结构）：脚型档案摘要（复用 getFootProfile + FootSummaryLine，含脚长/日常鞋码/脚型）+ TA 的测评列表；用户不存在 404；无档案/无测评各有空状态。
- 首页保留 smoke 所需标题「攀岩鞋试穿体验平台」；最新测评流空状态文案引导注册。
- 作者入口：鞋详情页测评卡片与测评详情页标题的作者名均链接到用户主页。
- 验证：typecheck + lint 通过；既有 E2E 11 条全过（含首页 smoke）；一次性浏览器冒烟覆盖：首页空状态 → 建档 + 创建测评 → 首页最新流（含脚型摘要）→ 测评详情/首页作者链接进用户主页 → 用户主页数据与空状态 → 不存在用户 404（脚本用后即删）。
- code-review（Standards + Spec 双轴）：无硬违规、范围内无缺失。修正三处——ReviewCard 改用共享 formatShoeTitle（不再内联拼接）；listUserReviews 补 approved 鞋款过滤（与首页流一致，避免鞋链接 404）；脚长/日常鞋码/脚型统计行抽为 foot-summary.tsx 的 FootStatsLine（测评详情与用户主页共用）。保留的判断项：首页 hero 的两个 CTA 按钮（落地页合理延伸）；ReviewCardData 手写类型与查询列存在漂移可能（UI 重构时再统一推导）。
