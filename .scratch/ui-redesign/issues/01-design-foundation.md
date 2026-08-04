# 01 — 设计地基（expand）：字体、token、基础原语

**What to build:** 在不改变任何页面结构与行为的前提下，把全站切到「山系」设计地基：自托管字体（Space Grotesk 拉丁 display、IBM Plex Mono 数据、Noto Sans SC 中文）、bone 纸面 / 深松绿墨色 / pine 主色 / trail orange 唯一 accent 的色板（含 dark token）、统一 2px 圆角、重做基础表单原语（按钮、输入、下拉、多行输入、标签）并带全交互状态。本票完成后所有页面立即换色换字体，后续各页面 restyle 都建立在这套地基上。视觉规格以本目录 design-board.html 设计稿「00 设计 Token」节为准。

**Blocked by:** 无 — 可立即开工

**Status:** done

- [x] 安装 @phosphor-icons/react，图标统一 strokeWidth 1.5
- [x] 字体经 next/font 自托管，Inter 完全移除；数据类内容（尺码/评分/日期/价格）用 mono 字体
- [x] 色板映射到 shadcn 语义变量：light（paper #F3F4F0 / ink #161C17 / primary #C2410C / ring #2E4A38 / hairline 边框）与 .dark（#141A16 族，accent 提亮 #E8621A）；圆角统一 2px；禁纯黑纯白
- [x] 按钮具备 default/hover/active(scale 0.98)/focus-visible 全状态；primary 为 accent 橙且文字对比度 ≥ 4.5:1
- [x] 输入/下拉/多行输入：hairline-strong 边框、pine focus ring；标签在输入上方
- [x] bun run typecheck / lint / test:e2e 全绿

## Comments

- 2026-08-04 落地备注：token 全部落在 `src/app/globals.css`——:root/.dark 先定义原始色板变量（paper/surface/surface-2/ink/ink-soft/granite/hairline/hairline-strong/field/pine/pine-hover/moss/trail/trail-hover/trail-tint；dark 另有 pine-bright 作提亮 ring），再映射到 shadcn 语义变量（background=paper、foreground=ink、card=surface、primary=trail、primary-foreground=#FFF8F2（对 #C2410C 对比度约 4.9:1）、muted-foreground=granite、border=hairline、input=hairline-strong、ring=pine、destructive=#A63A2E）；.dark 用 #141A16/#1C241E/#232D25/#2C362E 族，primary 提亮 #E8621A（dark 主按钮文字用 paper，对比度约 5.2:1），ring 提亮 pine-bright #5B8A6C。hover 变体命名用 -hover（light 加深、dark 提亮，语义跨模式一致）。原始色板经 @theme inline 暴露为工具类（bg-pine / bg-trail-hover / text-ink-soft / bg-surface-2 / border-hairline-strong / bg-field / bg-trail-tint 等）供后续票使用；字号 13.5px/12.5px 收敛为 @theme 的 text-field/text-label。--radius: 0.125rem（2px），页面 rounded-xl 统一改 rounded-lg，评分条 rounded-full→rounded-[1px]；卡片/鞋卡去阴影改 hairline。字体在 `src/app/layout.tsx`：Space_Grotesk(--font-grotesk) / IBM_Plex_Mono 400-600(--font-plex) / Noto_Sans_SC 可变字重(--font-noto)，@theme 映射 font-sans=Noto、font-heading=Grotesk+Noto、font-mono=Plex+Noto；base 层 h1–h6 统一 font-heading。数据位（测评卡分数/日期、鞋价、匹配均分、维度均分、尺码/评分 dd、发布日期、脚型档案数值行）已加 font-mono。按钮（`src/components/ui/button.tsx`）重做：default=trail 橙 hover trail-hover、outline=surface+hairline-strong、ghost=ink-soft、destructive=描边幽灵态，全变体 active:scale-[0.98]、focus-visible 2px outline offset 2。input/select/textarea 重做：bg-field、border-input（hairline-strong）、focus pine ring 3px/15%、错误态 destructive ring/12；label text-label ink-soft（表单结构本来就是标签在上）。filter-select 复用 ui 原语（Label/Select/Button），删除重复的 filterFieldClass，鞋库价格输入改用 ui Input；星级输入 amber→primary、复选框 accent-pine 对齐单一 accent 纪律。@phosphor-icons/react@2.1.10 已装（本票无图标使用点，约定 strokeWidth 1.5 供后续票）。未评星颜色用 hairline token（设计稿 #D5D8CC 的 token 化近似，兼顾 dark 适配）；placeholder 用 muted-foreground/70（≈#969B93，token 化近似设计稿 #9AA192）。typecheck/lint 绿，test:e2e 17/17 绿。
