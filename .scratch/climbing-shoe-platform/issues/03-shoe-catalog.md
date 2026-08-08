# 03 — 鞋款目录：鞋库筛选 + 详情页 + 种子数据

**What to build:** 访客可以浏览鞋库，按品牌、使用场景（馆内全能/抱石/难度/传统多段/竞技）、硬度（软/中/硬）、宽度楦型（窄/中/宽）、定位等级（入门/进阶/极致性能）、价格区间筛选，按关键词搜索，并查看鞋款详情页（完整参数 + 图片）。鞋款数据本期仅来自种子数据（鞋款提交与管理员审核流程推迟到后续阶段，schema 预留审核状态字段，种子数据全部为已上架状态）。

**Blocked by:** 01 — 脚手架 + E2E 测试接缝

**Status:** ready-for-agent

- [x] brands 与 shoes 表建立并迁移（含场景、硬度、宽度、定位、下压程度、闭合方式、鞋面材质、图片、审核状态字段）
- [x] 种子数据包含 8+ 主流品牌（La Sportiva、Scarpa、Tenaya、Evolv、Unparallel、Boreal、Mad Rock、Butora 等）与 10+ 热门鞋款
- [x] 鞋库页列出鞋款；品牌/场景/硬度/宽度/定位/价格筛选可组合生效
- [x] 关键词搜索匹配品牌/型号/变体
- [x] 鞋款详情页展示全部参数与图片
- [ ] E2E：种子数据正确渲染；各筛选条件返回正确结果集；详情页展示正确（按用户要求暂缓：UI 将重构，测试后补）

## Comments

- 2026-08-03 实现完成。
- 表名用单数 brand/shoe（与 better-auth 的 user/session 一致）；迁移 0001。scenarios 与 images 以 JSON 文本存储，场景筛选用 LIKE '%"值"%'（MVP 规模可接受）。
- status 列默认 'pending'（安全默认：新鞋款不可见），种子显式 approved；submitted_by/reviewed_by/reject_reason 为纯文本预留列（无外键）。
- 种子脚本 scripts/seed.ts（`bun run db:seed`，node 执行）：清空 brand/shoe 后重插，幂等可重跑；占位图为按品牌着色的 SVG，生成到 public/seed/（随代码提交）。
- 筛选走 GET 表单参数（/shoes?brand=&scenario=&stiffness=&width=&level=&priceMin=&priceMax=&q=），服务端渲染，可分享；未知/非法参数安全忽略。
- 手动验证（curl）：18 款全量；brand=La Sportiva 6 款；场景抱石 8 款；硬度硬 2 款；价格 1000-1200 7 款；q=miura 1 款（大小写不敏感）；q=VS 命中变体；组合 brand+硬度 4 款；详情页参数齐全、不存在/非法 id 返回 404。
- 现有 E2E 11 条全部通过（无回归）。本 ticket 的 E2E 覆盖按约定推迟到 UI 重构后。
- src/db/index.ts 相对导入补 .ts 后缀（Node 类型剥离要求），node 脚本可直接 import getDb。
- 2026-08-04 扩充种子数据：新增 Five Ten、Ocún、Red Chili、So Ill、AKU 5 个品牌及 44 款鞋款（共 13 品牌、62 鞋款），属性按真实鞋款定位填写。seed 脚本由「清空重插」改为「按品牌名/鞋款名去重的增量插入」——开发库已有测评（review.shoe_id 级联删除），清空会误删；重跑只补缺失项，README 同步更新。
