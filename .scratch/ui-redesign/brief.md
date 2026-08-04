# UI 重构 Brief — 攀岩鞋社区「山系」重设计

你是加载了 design-taste-frontend (taste) skill 的前端 agent。严格按 skill 流程推进：先输出一行 Design Read、设定三个 dial，redesign 先 audit 现有 UI 再动手。

## 0. 项目背景与红线
- 技术栈：Next.js 15 App Router + React 19 + TS + Tailwind CSS v4（CSS-first 配置，token 结构见 `src/app/globals.css`，shadcn 语义变量 oklch）+ shadcn/ui。包管理 bun。
- 先读仓库根 `AGENTS.md`（约定）与 `CONTEXT.md`（领域词汇：「宽度楦型」是鞋、「脚宽窄」是脚，勿混用）。界面文案全中文。
- 这是社区产品应用，不是营销落地页：借 taste skill 的审美纪律（anti-default、配色纪律、字体、布局节奏、状态完整、a11y），但不做落地页炫技（不 scroll-hijack、不 marquee、不巨大 hero、不 bento 炫技）。建议 dials：DESIGN_VARIANCE 6 / MOTION_INTENSITY 3 / VISUAL_DENSITY 5。
- 只改视觉层与信息布局：不改路由、数据获取、server actions、zod schema、DB schema。保留 E2E（`e2e/*.spec.ts`）依赖的外部可见行为与文案（按钮文字、表单标签、`role="alert"` 等）。
- 代码不加注释。完成后必须跑 `bun run typecheck` 与 `bun run lint`，并跑 `bun run test:e2e` 确认全绿。

## 1. 参考图（附图，移动端鞋款详情页）— 只提取风格，不照搬布局
参考图是风格参考，不是布局规格：不必复刻其页面结构（底部 tab bar、轮播、sticky 栏等均非必须），布局与构图由你按 taste skill 规则自行设计，可依内容/desktop 与 mobile 自由发挥。要提取的是它的视觉语言：
- hairline 分隔：1px 细线（divide-y / border-t）分组，不靠卡片堆叠或阴影；
- spec 网格：两列（或多列）数据网格，小标签 + 大数值，细线分栏；
- 大写宽字距技术性微标签（品牌名、FIT RATING 式双语小标签）；
- 数据表达：尺码/评分/差值用 mono 字面，差值用唯一 accent 强调；
- rating 条语言：小标签 + 细进度条；
- 整体克制、低饱和、信息密度高但有序的中性气质。

## 2. 设计方向：户外山系（taste skill 的 "Forest" 家族：deep green + bone + amber，参考 Filson / Patagonia / and wander 的质感）
- 配色（单一 accent，全站锁定，COLOR CONSISTENCY LOCK）：
  - 基底：偏冷的石白 / bone 纸色（避开 AI 默认暖 beige 族），中性色用 granite 灰；
  - 墨色：近黑深松绿（如 #141A16 族），禁纯黑；
  - 主色：pine / moss 绿；
  - 唯一 accent：trail orange / safety orange，仅用于尺码差值、rating 条、激活态与主 CTA。
- 字体：拉丁 display 用技术感 grotesque（Archivo / Space Grotesk 族），尺码/评分/日期等数据一律 mono（IBM Plex Mono 族）；中文 Noto Sans SC，标题重字重。全部 next/font 自托管。禁 Inter、禁 serif。
- 材质：hairline 分隔（divide-y / border-t）分组，统一小圆角或直角（SHAPE LOCK），无玻璃拟态、无渐变、无黑阴影；:active `scale-[0.98]` 物理按压感。
- 大写宽字距小标签保留线框图的技术感，但遵守 EYEBROW RESTRAINT，控制密度。

## 3. 范围与代码地图（restyle 现有页面，不新增功能页）
- 全局 token 与字体：`src/app/globals.css`、`src/app/layout.tsx`。
- 全局 shell：`src/components/site-header.tsx`（响应式，移动端导航形式自行设计；不新增收藏等新功能页）。
- 测评卡片（核心组件，按提取风格实现——街鞋/本款尺码盒 + accent 差值 + rating 条——并全站复用）：`src/components/reviews/review-card.tsx`；首页流 `src/app/page.tsx`。
- 鞋款详情页是风格语言的主战场（spec 网格、hairline、测评记录卡等）：`src/app/shoes/[id]/page.tsx`；鞋库 `src/app/shoes/page.tsx`。
- 测评详情/新建/编辑：`src/app/reviews/[id]/page.tsx`、`src/app/reviews/new/page.tsx`、`src/app/reviews/[id]/edit/page.tsx`；登录/注册 `src/app/login`、`src/app/register`；用户主页 `src/app/u/[username]/page.tsx`；脚型档案 `src/app/settings/profile/page.tsx`。
- 图标：项目当前无图标库，装一套 `@phosphor-icons/react` 或 `@tabler/icons-react`（统一 strokeWidth），禁手绘 SVG、禁 emoji。
- 图片：鞋款主图等暂用明确标注的占位槽，最后交需真图清单。

## 4. 完成定义
1. 一行 Design Read + 现有 UI audit 完成；
2. §3 全部页面视觉一致，移动端不对称布局折叠为单列；
3. 状态完整：hover/active/focus-visible、空态、loading 骨架；表单与按钮对比度达 WCAG AA；
4. `bun run typecheck` / `bun run lint` / `bun run test:e2e` 全绿；
5. 交改动清单 + 需真图清单。
