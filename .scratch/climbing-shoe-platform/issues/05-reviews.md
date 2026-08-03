# 05 — 测评：创建/编辑/删除

**What to build:** 登录用户对已上架鞋款写测评：试穿尺码（数值 + EU/US/UK/CM 体系）、相对日常码的尺码偏移（0.5 步长，约 -2 ～ +1）、七个维度各 1–5 分（包裹性、舒适、精准度、灵敏度、摩擦、支撑、综合推荐指数）、六个部位合身度反馈单选（脚跟：贴合/略松/脚跟空/磨脚跟；脚趾：自然/自然微蜷/挤压/抽筋；脚背：合适/压迫；前掌：舒适/挤压/疼痛；足弓：正常/疼痛；透气：透气/一般/闷热）、使用场景与使用时长、文字体验与优缺点。一人一鞋一条测评，可编辑可删除。写测评前要求脚型档案必要字段已完善。测评卡片与详情页展示作者脚型摘要。

**Blocked by:** 03 — 鞋款目录；04 — 脚型档案

**Status:** ready-for-agent

- [x] reviews 表建立，(user, shoe) 唯一约束生效
- [x] 测评表单校验全部结构化字段：评分 1–5、枚举止值、偏移范围与步长、尺码体系
- [x] 作者脚型档案必要字段未完善时，引导其先完善档案，不能提交测评
- [x] 同一双鞋重复提交被拒，作者进入编辑模式
- [x] 作者可编辑、删除自己的测评；不能修改他人测评
- [x] 测评详情页展示完整测评内容与作者脚型摘要
- [x] 鞋款详情页列出该鞋的测评（含作者脚型摘要）；无测评时显示空状态
- [ ] E2E 覆盖：完善档案 → 创建测评 → 编辑 → 删除，以及一人一鞋一条约束（按用户要求暂缓：UI 将重构，测试后补）

## Comments

- 2026-08-04 实现完成。
- 表名单数 `review`（延续约定），迁移 0003：26 列，`review_user_shoe_unique` 唯一索引 (user_id, shoe_id) 强制一人一鞋一条；user_id/shoe_id 外键均 onDelete cascade。
- 枚举常量在 src/db/schema.ts：SIZE_SYSTEMS【EU/US/UK/CM】、SIZE_DELTAS【-2…+1 步长 0.5】、六个合身度枚举（HEEL_FITS/TOE_FITS/INSTEP_FITS/FOREFOOT_FITS/ARCH_FITS/BREATHABILITIES）、RATING_DIMENSIONS（wrap/comfort/precision/sensitivity/friction/support/overall 七维列名）。DURATIONS 在 spec 举例的三项基础上补了「1–3 个月」填补区间空隙（spec 原文为「如」举例）。
- 校验在 src/lib/reviews-schema.ts（client-safe，不碰 DB）：评分 1–5 整数、枚举止值、试穿尺码整码/半码（1–60）、偏移 -2～+1 且 0.5 步长、场景至少选一个、文字体验 5–2000 字、优缺点各 ≤500 字；DB 读写在 src/lib/reviews.ts；server actions 在 src/app/reviews/actions.ts（服务端二次校验）。
- 路由：/reviews/new?shoe=<id>（spec 页面结构的 /reviews/new，鞋款经查询参数传入）、/reviews/[id] 详情（公开）、/reviews/[id]/edit。
- 档案前置：ticket 04 保存即要求全字段通过校验，故「档案行存在」等价「必要字段已完善」；/reviews/new 无档案时渲染引导卡片（链接去完善档案），action 亦复查。
- 一人一鞋一条：已有测评时访问 /reviews/new?shoe= 直接重定向到编辑页；action 提交前复查，另兜底捕获 UNIQUE 约束错误返回中文提示。
- 权限：编辑页与 action 均校验 review.userId，非作者编辑页返回 404、action 拒绝；删除为纯表单 action（永远 redirect：非作者弹回测评详情）。
- 展示：formatSizeDelta 把偏移换算为「比日常小 1 码」类文案；鞋详情页测评卡片含作者名、综合分、尺码信息、脚型摘要（脚宽窄/足弓/脚背/脚后跟/拇外翻）与正文摘要；测评详情页含全部结构化字段、文字体验与作者脚型摘要（含脚长与日常鞋码）。
- 新增 UI 原语 src/components/ui/textarea.tsx；测评组件在 src/components/reviews/（review-form.tsx 创建/编辑复用、foot-summary.tsx 摘要行）。
- 验证：typecheck + lint 通过；既有 E2E 11 条全过；一次性浏览器冒烟覆盖：空状态 → 无档案引导 → 完善档案 → 空表单校验提示 → 填全字段发布 → 详情页回显 → 鞋页卡片与脚型摘要 → 重复进入转编辑模式 → 编辑保存并同步鞋页 → 他人编辑 404 → 作者删除回到空状态（脚本用后即删）。
- 注意：scripts/reset-e2e-db.ts 只迁移不种子；本次冒烟临时对 e2e 库跑过 seed（现库已重置）。后续测评相关 E2E 需先种子。
- code-review（Standards + Spec 双轴）后修正：firstIssueMessage 抽到 src/lib/zod-helpers.ts（脚型档案与测评共用）；正整数 id 解析抽到 src/lib/params.ts 的 parsePositiveInt（替换 4 处重复）；鞋款标题拼接抽为 src/lib/shoes.ts 的 formatShoeTitle（替换 3 处重复）；ReviewFormValues 改为从 reviewSchema 推导；SIZE_DELTA_LABELS/RATING_LABELS 用 SizeDelta/RatingDimension 类型做键；测评详情页作者脚型补充「脚型」字段（spec 故事 15 要求详情页展示作者脚型档案）。其余为已记录的判断项（EnumSelect 与脚型表单 EnumField 形似，UI 重构时再统一）。
