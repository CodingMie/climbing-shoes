---
name: extract-reviews
description: 把抓取的社媒帖子批量转成攀岩鞋测评数据。当用户给出抓取/爬取的帖子文件（如 data/search_contents_*.json）要求转成测评数据或导入时使用。
---

# 抓取帖子 → 测评数据

核心原则：**不虚构**。原文没有的信息只有两个去处——标为推断（`inferredFields`），或整条进人工区。

## 1. 锚定 schema 与现有鞋库

- 读 `src/db/schema.ts`（枚举、SIZE_DELTAS、review 表）与 `src/lib/reviews-schema.ts`（长度/格式约束）。
- 用 node + better-sqlite3 查 `data/app.db` 的 brand/shoe 表，得到现有鞋款清单（含 id）。
- 完成标志：枚举取值、sizeDelta 允许范围、现有鞋款清单都已就位。

## 2. 分诊

逐条帖子过一遍，每个「提到且有真实体验的鞋款」归入三类之一：

- **可转换**：具体型号 + 本人试穿/使用体验 + 能推出合法的 sizeTried 与 sizeDelta（= 试穿码 − 作者自述日常码，落在 SIZE_DELTAS 网格内）。
- **需人工**：真测评但撞 schema——偏移超出 -2～+1、缺尺码、试穿码未写明、非半码步长。保留原文要点与作者自己的星级评分，写明冲突原因。
- **跳过**：选购指南、店铺攻略、纯视频无型号、内容在图片里、撑鞋/脚感通论。

一篇帖子可拆出多条 review，也可同时产出可转换与需人工条目。

- 完成标志：全部帖子对账——每条帖子、每个有真实体验的鞋款都有着落。

## 3. 提取

每条可转换 review：

- content/pros/cons 摘录作者原话（轻度清理，保留口吻），长度符合 schema。
- 评分 1–5 一律为情感推断（原帖没有这套维度打分，别在原文里找分数）。
- 原文未提的合身度字段取中性默认：heelFit=贴合、toeFit=自然、instepFit=合适、forefootFit=舒适、archFit=正常、breathability=一般。
- 每个非原文直出的字段记入该条 `inferredFields`（scenariosUsed/duration 属推断时同样记入）。
- 鞋款能对上现有库则填 matchedShoeId，变体差异（HV/LV/CS 等）写入 matchNote；对不上填 null 并注明需新建。
- source 段保留 note_id、note_url、标题、作者脚型档案（若有）。

## 4. 校验与落盘

- 写 node 校验脚本逐字段核对所有记录：枚举取值、sizeDelta 网格、评分 1–5、content 5–2000 字、pros/cons ≤500、scenariosUsed 非空。
- 完成标志：脚本输出全部通过。
- 写入 `data/reviews_extracted_<源文件日期>.json`：meta（推断约定说明）+ reviews + manual_review_needed + skipped（含原因）。

## 交付边界

默认交付 JSON 文件。写库需用户明确要求；原帖作者昵称已脱敏，写库前先确认导入账号。
