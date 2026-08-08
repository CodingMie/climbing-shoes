---
name: fetch-shoe-images
description: 给鞋库补真实产品图。当用户要求下载鞋款图片、替换 SVG 占位图、从官网/百度图库抓鞋图时使用。
---

# 鞋款图片采集

目标：把 `shoe.images` 里的 SVG 占位路径替换为真实产品图，存到 `public/shoe-images/` 并以 `/shoe-images/<文件>.jpg` 写库。

## 1. 盘点待采集鞋款

- 用 `node`（非 bun，better-sqlite3 不兼容）查 `data/app.db`：join `shoe` 与 `brand`，筛出 `images` 含 `.svg` 的鞋。
- 完成标志：待采集清单（brand + model + 期望文件名）已列出，数量与占位图数一致。

## 2. 按渠道分层采集

优先级从上到下，命中即下载到 `public/shoe-images/<brand>-<model>.jpg`（用下节规范化文件名）。

- **渠道 A · 百度图片 API**：`https://image.baidu.com/search/acjson?tn=resultjson_com&word=<urlencode关键词>&pn=0&rn=5&ie=utf-8`，取 `data[]` 的 `thumbURL`/`middleURL`。带浏览器 UA，每请求间隔 ≥2s。适合批量；命中即停，用 rn=5 逐条试。
- **渠道 B · 品牌官网 og:image**：抓产品页 HTML 取 `property="og:image"`。可靠来源：`us.scarpa.com/products/<slug>`、`www.lasportivausa.com/products/<slug>`（都是 Shopify）。直接用 `urllib`/`curl` 抓 HTML 提取即可，无需浏览器。
- **渠道 C · websearch 兜底**：搜 `品牌 型号 climbing shoe`，找到产品页（官网或大型零售商如 adidas.com、soillholds.com）再走渠道 B 提取 og:image。
- 完成标志：渠道 A/B/C 依次试完，能拿到的都已落盘；剩余无法获取的列出原因（反爬/超时/停产）。

## 3. 文件名规范化

`<brand>-<model>` 的 slug 规则：转小写 → `ó/ò`→`o`、`:`/`：`→`-`、空白→`-`、去掉其余非 `a-z0-9-` 字符。**中文模型名（如「系带版」）保留原样**。

## 4. 写库

- `node` 脚本：对每双仍有 SVG 的鞋，用规范化后的 brand+model 对 `public/shoe-images/*.jpg` 做 **includes 匹配**（勿精确匹配，防冒号/重音符/大小写差异），命中则把该鞋 images 里的 SVG 路径替换为 `/shoe-images/<文件>.jpg`，`UPDATE shoe SET images = ?`。
- 完成标志：UPDATE 数 = 待采集清单中已落盘数；复查后剩余 SVG 鞋与上节「无法获取」清单一致。

## 5. 验证

- 复查 DB：`images` 不再含 `.svg` 的鞋数 = 总鞋数 − 无法获取数。
- 启动 dev server 抽查 2–3 个 `/shoe-images/xxx.jpg` 返回 200。

## 坑点备忘

- **百度反爬**：连续请求后返回体只剩 `antiFlag`/`message`、无 `data` 键 → 该 IP 被限，等一段时间或换渠道 B/C。
- **Cloudflare**：tenaya.net 等有 JS 挑战，`urllib` 抓不到 og:image，走渠道 C 找镜像零售商。
- **小型/停产品牌**（AKU、Ocún、Red Chili、旧 Five Ten）官网常 403/404/超时，图片最难拿，可接受留下占位图并在完成清单里注明。
- **匹配用 includes 而非相等**：`Cobra 4:9`、`Ocún`、`Five Ten Anasazi 系带版` 都会因字符处理不同而对不上，contains 校验两边。
