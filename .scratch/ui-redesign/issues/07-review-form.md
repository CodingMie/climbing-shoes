# 07 — 测评表单（新建/编辑）

**What to build:** 测评表单（新建与编辑共用）按设计稿 restyle：分节以 hairline 上分隔分组，星级输入选中色改为 accent 橙，复选框改 pine，全部字段、校验与错误展示方式不变。「请先完善脚型档案」拦截页同步 restyle。视觉规格见设计稿「06 写测评」节。

**Blocked by:** 01 — 设计地基

**Status:** done

- [x] 五个分节（尺码信息 / 维度评分 / 合身度反馈 / 使用背景 / 文字体验）以 hairline 分隔，节标题与提示文案保留
- [x] 星级评分选中/悬停色为 accent 橙，键盘焦点态可见
- [x] 单条 role="alert" 中文错误机制不变；提交按钮文案（发布测评 / 保存修改 / 保存中…）不变
- [x] 字段 id/name/标签文案全部不变（server action 解析不受影响）
- [x] 未完善脚型档案的拦截态文案与「去完善脚型档案」按钮保留

## Comments

- 2026-08-05 落地备注：`src/components/reviews/review-form.tsx` 按设计稿「06 写测评」重排：Section 组件改 hairline 上分隔（mt/pt 22px + border-t border-border，first-of-type 重置——hidden input 在前故用 first-of-type 而非 first-child），标题 h3 15px bold、hint 12px muted mt-0.5，文案逐字保留；字段格改 `grid gap-1.5`（标签在上 6px 间距），各节内容网格 mt-3.5 gap-3.5（尺码 3 列 / 维度评分与合身度 2 列，sm 断点保留移动单列）。星级输入：label 追加 `peer` 类 + `hover:text-primary peer-hover:text-primary` 修复悬停预览（原 peer-hover 只挂在 sr-only input 上实际不触发）——悬停第 N 颗点亮 1..N 颗 accent 橙；选中仍 peer-checked:text-primary；尺寸对齐设计稿 19px/3px 间距；键盘焦点保留 peer-focus-visible ring（Playwright 实测焦点环可见、悬停 1-4 亮 5 不亮）。使用背景：场景 label mt-3，checks 行 gap-x 18px / gap-y 10px、选项 13px/7px 间距、复选框 size-[15px] accent-pine；使用时长限宽 320px。文字体验 textarea rows 5→4（设计稿）。提交行 mt-[26px] flex gap-3.5：按钮在左、单条 role="alert" 错误（text-xs destructive）在右，机制与文案不变。页面头（new/edit 两页）：backlink 样式（text-label muted hover trail）+ h1 26px black mt-3.5 + 目标鞋款 13px muted mt-1 + 表单区 mt-[26px]；「请先完善脚型档案」拦截页同步（h1 26px + hairline 盒 15px bold 标题 + 13px 说明 + 原按钮），文案逐字保留。全部字段 id/name/label 未动；Playwright 全流程实测：新建提交 → 详情页、编辑预填/报错（「请输入试穿尺码」）/保存均正常。typecheck/lint 绿，test:e2e 17/17 绿。
