# 04 — 脚型档案

**What to build:** 登录用户可以编辑并保存自己的脚型档案：脚长、脚宽窄（窄/中/宽）、脚型（埃及脚/希腊脚/罗马脚）、足弓（低/正常/高）、脚背（低/正常/高）、脚后跟（窄/中/宽）、拇外翻（无/轻度/中度/重度）、日常鞋码（EU，支持半码）。档案是测评的参考价值来源，也是写测评的前置条件（在测评 ticket 中校验）。

**Blocked by:** 02 — 认证：注册/登录/登出/会话

**Status:** ready-for-agent

- [x] foot_profiles 表与用户 1:1 关联，迁移生效
- [x] 档案编辑页覆盖全部字段；枚举与数值字段（脚长 mm、日常鞋码半码）有校验与中文提示
- [x] 保存后再次访问正确回显已保存的值，可反复编辑
- [x] 未登录访问编辑页重定向到登录页（沿用 ticket 02 的 requireUser + 既有 E2E 覆盖）
- [ ] E2E 覆盖：填写全部字段 → 保存 → 重新加载验证回显 → 修改后保存（按用户要求暂缓：UI 将重构，测试后补）

## Comments

- 2026-08-04 实现完成。
- 表名单数 `foot_profile`（延续 brand/shoe/user 约定），迁移 0002；`user_id` 直接为主键并外键引用 user（onDelete cascade），以主键强制 1:1。
- 字段：foot_length（integer，mm）、foot_width【窄/中/宽】、foot_shape【埃及脚/希腊脚/罗马脚】、arch【低/正常/高】、instep【低/正常/高】、heel【窄/中/宽】、bunion【无/轻度/中度/重度】、street_size（real，EU 支持半码）；枚举常量与类型定义在 src/db/schema.ts（FOOT_WIDTHS 等，延续 SHOE_* 约定）。
- 校验 schema（zod，中文提示）在 src/lib/foot-profile-schema.ts（不碰 DB，客户端组件可安全引用）；DB 读写在 src/lib/foot-profile.ts（getFootProfile / upsertFootProfile，insert … onConflictDoUpdate by user_id）。脚长：整数、150–350mm；日常鞋码：整码或 .5 半码、EU 30–50；枚举空值/非法值均有「请选择…」提示。
- 页面 /settings/profile（原占位页改造）：requireUser 未登录重定向 /login；服务端读取已有档案回显（uncontrolled 表单 defaultValue）；保存走 server action（src/app/settings/profile/actions.ts），服务端二次校验后 upsert，成功显示「脚型档案已保存」。
- 头部登录态的用户名改为指向 /settings/profile 的链接（档案入口）。
- 验证：typecheck + lint 通过；既有 E2E 11 条全部通过（含 /settings/profile 的未登录重定向与登录后可访问）；另用一次性脚本做了浏览器冒烟（注册 → 填全部 8 字段 → 保存 → 重载回显一致 → 改脚长/鞋码再保存 → 重载持久化 → 脚长 999 触发中文校验提示），脚本用后即删。
- 与 spec 数据模型一致：street_size 作为测评尺码偏移基准、档案为测评前置条件，均由 ticket 05 消费（存在完整档案行即视为必要字段已完善，因保存要求全字段通过校验）。
- code-review（Standards + Spec 双轴）：唯一实质修正是把「取首条 zod 错误消息」抽为 firstIssueMessage（actions 与表单共用）；其余均为已记录的判断项——表名单数 foot_profile 为有意偏离 spec 字面（延续 brand/shoe/user 约定，ticket 05 引用时注意）、校验区间 150–350mm / EU 30–50 为自定假设、头部用户名链接为档案入口（轻微 scope creep）、枚举常量经 @/db/schema 进入客户端 bundle（延续 SHOE_* 约定的取舍）。
