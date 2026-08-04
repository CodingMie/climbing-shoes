Status: ready-for-agent

# Spec：攀岩鞋试穿体验平台 MVP

攀岩鞋试穿体验记录与分享平台的完整 MVP：鞋款目录（社区提交 + 管理员审核）、用户脚型档案、结构化测评、聚合展示与筛选。

## Problem Statement

攀岩鞋的合脚程度高度依赖个人脚型（脚宽、足弓、脚背、脚后跟、拇外翻等），且不同品牌尺码体系差异巨大（EU/US/UK/CM，同款鞋常需相对日常码减小半码到两码）。但试穿体验信息散落在论坛、视频和群聊中，没有结构化的中文记录：我无法按场景/硬度/宽度筛选鞋款，无法知道某双鞋「大家普遍建议比日常码小多少」，也无法找到和我脚型相似的人的试穿反馈。买鞋基本靠盲试，试错成本高。

## Solution

一个自部署的中文 Web 平台：

- **鞋款目录**：结构化的鞋款信息（品牌、型号、价格、使用场景、硬度、宽度楦型、定位等级、下压程度、闭合方式等），由用户提交、管理员审核后上架，支持按属性筛选。不设「变体」概念：同一型号的不同版本（如系带版、VS 版）各自作为独立鞋款录入。
- **脚型档案**：注册用户维护自己的脚型数据（脚长、脚宽窄、脚型、足弓、脚背、脚后跟、拇外翻、日常鞋码）。
- **结构化测评**：每双鞋每人一条测评，包含试穿尺码与相对日常码的尺码偏移建议、七个维度的 1–5 分评分、六个部位的合身度反馈单选、使用场景与时长、文字体验与优缺点。
- **聚合展示**：鞋详情页展示各维度平均分、尺码建议分布（如「60% 用户建议比日常小 1 码」）、合身度反馈分布（如「35% 用户脚趾挤压」），测评旁展示作者脚型摘要，让读者判断参考价值。

MVP 阶段做属性筛选；基于脚型档案的智能匹配推荐为二期方向，本期数据模型为其预留。

## User Stories

### 浏览与筛选（访客）

1. As a 访客, I want to 浏览鞋款目录列表, so that 我可以发现平台收录的攀岩鞋。
2. As a 访客, I want to 按品牌筛选鞋款, so that 我可以聚焦我信任或想尝试的品牌。
3. As a 访客, I want to 按使用场景筛选鞋款（馆内全能/抱石/难度/传统多段/竞技）, so that 我可以找到匹配我攀爬方式的鞋。
4. As a 访客, I want to 按硬度筛选鞋款（软/中/硬）, so that 我可以按偏好过滤。
5. As a 访客, I want to 按宽度楦型筛选鞋款（窄/中/宽）, so that 我可以避开明显不合脚宽的鞋。
6. As a 访客, I want to 按定位等级筛选鞋款（入门/进阶/极致性能）, so that 我可以匹配自己的水平与预算阶段。
7. As a 访客, I want to 按价格区间筛选鞋款, so that 我可以控制在预算内。
8. As a 访客, I want to 在鞋款详情页看到完整参数与图片, so that 我可以了解这双鞋的规格。
9. As a 访客, I want to 在鞋款详情页看到七个维度的平均评分, so that 我可以快速判断口碑。
10. As a 访客, I want to 看到尺码建议分布（相对日常码的偏移占比）, so that 我可以选对尺码。
11. As a 访客, I want to 看到合身度反馈分布（各部位各选项的占比）, so that 我可以预判这双鞋在我脚上可能的合身问题。
12. As a 访客, I want to 阅读某双鞋的全部测评列表, so that 我可以了解真实试穿体验。
13. As a 访客, I want to 在每条测评旁看到作者的脚型摘要（脚宽、足弓、脚背、脚后跟、拇外翻等）, so that 我可以判断这条测评对我是否有参考价值。
14. As a 访客, I want to 在测评详情页看到完整测评内容与作者脚型档案, so that 我可以深入了解细节。
15. As a 访客, I want to 在首页看到热门鞋款与最新测评, so that 我可以快速了解社区动态。

### 注册登录与脚型档案（用户）

17. As a 新用户, I want to 用用户名/邮箱加密码注册, so that 我可以贡献测评。
18. As a 用户, I want to 登录与登出, so that 我的身份受到保护。
19. As a 用户, I want to 会话在多次访问间保持, so that 我不必每次都登录。
20. As a 用户, I want to 记录我的脚长, so that 尺码建议有基准。
21. As a 用户, I want to 记录我的脚宽窄（窄/中/宽）, so that 我的脚型档案完整。
22. As a 用户, I want to 记录我的脚型（埃及脚/希腊脚/罗马脚）, so that 我的脚型档案完整。
23. As a 用户, I want to 记录我的足弓类型（低/正常/高）, so that 我的脚型档案完整。
24. As a 用户, I want to 记录我的脚背高度（低/正常/高）, so that 我的脚型档案完整。
25. As a 用户, I want to 记录我的脚后跟宽窄（窄/中/宽）, so that 我的脚型档案完整。
26. As a 用户, I want to 记录我的拇外翻程度（无/轻度/中度/重度）, so that 我的脚型档案完整。
27. As a 用户, I want to 记录我的日常鞋码（EU）, so that 测评中的尺码偏移建议以我的日常码为基准。
28. As a 用户, I want to 随时编辑我的脚型档案, so that 档案保持准确。
29. As a 访客, I want to 在用户公开主页看到 TA 的脚型档案摘要与 TA 的测评列表, so that 我可以评估该作者测评的参考价值。

### 鞋款提交与审核（用户 + 管理员）

30. As a 用户, I want to 提交新鞋款（品牌、型号、价格、场景、硬度、宽度、定位、下压程度、闭合方式、鞋面材质）, so that 目录可以持续扩充。
31. As a 用户, I want to 在提交鞋款时上传图片, so that 鞋款有视觉信息。
32. As a 用户, I want to 看到我提交的鞋款处于待审核/已通过/已驳回状态, so that 我知道提交进展。
33. As a 用户, I want to 在被驳回时看到驳回理由, so that 我可以修正后重新提交。
34. As a 管理员, I want to 看到待审核鞋款队列, so that 我可以及时处理提交。
35. As a 管理员, I want to 在审核时编辑鞋款属性（如修正错别字、归类）, so that 上架数据质量有保证。
36. As a 管理员, I want to 通过鞋款提交, so that 鞋款对公众可见。
37. As a 管理员, I want to 驳回鞋款提交并填写理由, so that 提交者知道原因。
38. As a 访客, I want to 只看到已审核通过的鞋款, so that 目录数据可信。

### 测评（用户）

39. As a 用户, I want to 对我试穿过的鞋款写测评, so that 我可以分享试穿体验。
40. As a 用户, I want to 记录试穿尺码数值与尺码体系（EU/US/UK/CM）, so that 尺码信息明确。
41. As a 用户, I want to 记录试穿尺码相对我日常鞋码的偏移（如小一码半）, so that 他人可以据此选码。
42. As a 用户, I want to 对包裹性、舒适、精准度、灵敏度、摩擦、支撑、综合推荐指数七个维度分别打 1–5 分, so that 我的评价结构化可比。
43. As a 用户, I want to 对六个部位给出合身度反馈：脚跟（贴合/略松/脚跟空/磨脚跟）、脚趾（自然/自然微蜷/挤压/抽筋）、脚背（合适/压迫）、前掌（舒适/挤压/疼痛）、足弓（正常/疼痛）、透气（透气/一般/闷热）, so that 我的合身感受被结构化记录。
44. As a 用户, I want to 记录测评的使用场景与使用时长, so that 读者了解我的体验背景。
45. As a 用户, I want to 写文字体验与优缺点, so that 我可以表达评分之外的细节。
46. As a 用户, I want to 编辑我自己的测评, so that 体验更新后可以修正。
47. As a 用户, I want to 删除我自己的测评, so that 我可以撤回内容。
48. As a 用户, I want to 每双鞋只能写一条测评, so that 聚合数据不被重复刷分。
49. As a 用户, I want to 在写测评前被要求完善脚型档案中的必要字段, so that 我的测评对他人有参考价值。

### 管理与部署（管理员 / 运维）

50. As a 管理员, I want to 查看用户列表, so that 我可以了解社区成员。
51. As a 运维, I want to 通过 Docker 部署并将 SQLite 数据与上传图片挂载为数据卷, so that 升级不丢数据。
52. As a 运维, I want to 有预置的品牌与热门鞋款种子数据及管理员账号, so that 平台上线即可用。

## Implementation Decisions

### 技术栈

- Next.js 15（App Router）+ TypeScript，前后端一体；包管理 bun。
- Tailwind CSS v4 + shadcn/ui 构建界面；界面语言中文（zh-CN），不引入 i18n 框架。
- Drizzle ORM + better-sqlite3，SQLite 数据库文件存放于数据目录（可挂载卷）。
- better-auth 实现用户名/邮箱 + 密码认证（credentials），会话存库，使用其 Drizzle adapter。
- zod 做表单与 API 入参校验。
- 图片存本地磁盘数据目录（如 `data/uploads`），通过 route handler 提供访问；不使用对象存储。

### 数据模型

**brands（品牌）**：name、logo、简介。

**shoes（鞋款）**：
- brand_id、型号 model、价格 price（不设 variant 字段；同型号不同版本作为独立鞋款录入，版本信息写进 model 名称）
- 使用场景 scenarios：多选枚举【馆内全能、抱石、难度、传统多段、竞技】
- 硬度 stiffness：枚举【软、中、硬】
- 宽度楦型 width：枚举【窄、中、宽】
- 定位等级 level：枚举【入门、进阶、极致性能】
- 下压程度 downturn：枚举【自然、适度、激进】
- 闭合方式 closure：枚举【魔术贴、系带、套脚】
- 鞋面材质 material：文本
- 图片 images：路径数组
- 审核状态 status：枚举【pending、approved、rejected】；submitted_by、reviewed_by、reject_reason
- 仅 approved 对公众可见

**users**：用户名、邮箱、密码哈希、role 枚举【user、admin】。管理员通过种子数据预置，不提供前台提权。

**foot_profiles（脚型档案，与用户 1:1）**：
- 脚长 foot_length（mm）
- 脚宽窄 foot_width：枚举【窄、中、宽】
- 脚型 foot_shape：枚举【埃及脚、希腊脚、罗马脚】
- 足弓 arch：枚举【低、正常、高】
- 脚背 instep：枚举【低、正常、高】
- 脚后跟 heel：枚举【窄、中、宽】
- 拇外翻 bunion：枚举【无、轻度、中度、重度】
- 日常鞋码 street_size（EU，数值，支持半码）——作为尺码偏移的基准

**reviews（测评）**：
- user_id + shoe_id 唯一约束（一人一鞋一条，可编辑可删除）
- 试穿尺码 size_tried（数值，支持半码）+ 尺码体系 size_system：枚举【EU、US、UK、CM】
- 尺码偏移 size_delta：数值，0.5 步长，范围约 -2 ～ +1，含义为「相对作者日常鞋码（EU）的偏移」；展示时换算为「比日常小一码半」等文案
- 结构化评分：七个维度各为整数 1–5 —— 包裹性 wrap、舒适 comfort、精准度 precision、灵敏度 sensitivity、摩擦 friction、支撑 support、综合推荐指数 overall
- 合身度反馈：六个部位各单选一枚举 ——
  - 脚跟 heel_fit：【贴合、略松、脚跟空、磨脚跟】
  - 脚趾 toe_fit：【自然、自然微蜷、挤压、抽筋】
  - 脚背 instep_fit：【合适、压迫】
  - 前掌 forefoot_fit：【舒适、挤压、疼痛】
  - 足弓 arch_fit：【正常、疼痛】
  - 透气 breathability：【透气、一般、闷热】
- 使用场景 scenarios_used：多选枚举（同鞋款场景枚举）
- 使用时长 duration：文本或枚举（如「首次试穿」「1 个月内」「3 个月以上」）
- 文字体验 content、优点 pros、缺点 cons
- 时间戳

### 聚合与展示

- 鞋详情页聚合（MVP 规模下读取时计算即可）：
  - 七维度平均分与测评数
  - 尺码偏移分布（size_delta 分桶占比，如「-1.0：45%」）
  - 合身度反馈分布（每部位各选项占比）
- 测评卡片展示作者脚型摘要（脚宽窄、足弓、脚背、脚后跟、拇外翻）。
- 首页：热门鞋款（按测评数/综合分排序）+ 最新测评流。

### 页面结构

- `/` 首页；`/shoes` 鞋库（筛选）；`/shoes/[id]` 鞋详情（参数 + 聚合 + 测评列表）；`/shoes/submit` 提交鞋款
- `/reviews/new` 写测评；`/reviews/[id]` 测评详情
- `/u/[username]` 用户主页；`/settings/profile` 脚型档案编辑
- `/login`、`/register`；`/admin` 管理后台（审核队列、用户列表）
- 权限：写操作需登录；审核与管理后台需 admin 角色；未登录访问受保护页面重定向登录。

### 种子数据

- 预置主流品牌（La Sportiva、Scarpa、Tenaya、Evolv、Unparallel、Boreal、Mad Rock、Butora 等）与 10+ 热门鞋款（approved 状态）。
- 预置一个管理员账号（凭据走环境变量）。

### 二期预留（本期不实现）

脚型档案 + 合身度反馈 + 尺码偏移的数据模型已为「脚型 ↔ 鞋款智能匹配」「同脚型测评聚合」预留，不在本期实现。

## Testing Decisions

- **单一接缝：Playwright E2E。** 驱动真实 UI 跑完整用户旅程，使用一次性 SQLite 测试数据库（每个测试文件或套件前重建/迁移 + 种子）。不引入更低层的单元/集成接缝；聚合计算的断言通过 E2E 页面展示完成。
- **好测试的标准**：只断言外部可见行为（页面内容、跳转、数据库最终状态），不断言内部实现（组件结构、函数调用、样式细节）。
- **覆盖的核心旅程**：
  1. 注册 → 登录 → 完善脚型档案
  2. 提交鞋款 → 管理员审核（通过/驳回含理由）→ 鞋款对公众可见
  3. 写测评（尺码 + 偏移 + 七维评分 + 六部位合身反馈 + 文字）→ 鞋详情页聚合正确（均分、尺码分布、合身分布）
  4. 一人一鞋一条测评约束（重复提交被拒，可编辑）
  5. 鞋库筛选返回正确结果集
  6. 权限边界：未登录不能写测评/提交鞋款；普通用户不能访问管理后台
- **Prior art**：无（greenfield 项目）。Playwright 官方 Next.js 指南的 webServer 配置方式作为脚手架参考。

## Out of Scope

- 脚型 ↔ 鞋款智能匹配推荐（二期）
- 同脚型用户测评聚合视图（二期）
- 测评的点赞、评论、收藏
- 尺码换算工具（EU/US/UK/CM 互转）
- 第三方 OAuth 登录（微信/Google/GitHub）
- 邮箱验证、找回密码邮件（自部署 MVP 不做邮件发送）
- 测评内容审核/举报（本期仅审核鞋款提交）
- 通知系统（审核结果仅在提交状态页可见）
- 图片 CDN / 对象存储
- 国际化（仅中文）
- 移动端原生 App

## Further Notes

- 术语表（后续 /domain-modeling 可固化进 CONTEXT.md）：鞋款（shoe model）、测评（review）、脚型档案（foot profile）、合身度反馈（fit feedback）、尺码偏移（size delta，相对日常码）、审核（moderation）。
- 实施里程碑建议：脚手架 → 数据层 + 种子 → 认证与脚型档案 → 鞋库与详情 → 测评 → 鞋款提交与管理后台 → 首页与打磨 → Docker 部署准备。
- 环境：Node 24、bun 1.3 已就绪（pnpm 未安装）；部署目标为自部署（Docker + 数据卷）。better-sqlite3 为原生模块，bun 可正常加载；如遇兼容问题可退回 drizzle 的 bun:sqlite 驱动。
