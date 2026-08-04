# 《先看清，再放好》撤回复盘与发布门闸

撤回目标为 `2026-07-29-allen-chinese-repair-book-box-01`。历史 JSON（revision-a、revision-3）、本机 `learningPacks`、课程进度、生字、录音和反馈均保留；当前 manifest、内置 bundle manifest/source 与中文课程序列不再提供它。若本机仍保存旧 selected pack，启动刷新会回退到 Day 15 最新可用中文课。

`node test-audit-chinese-pack-release.mjs` 对目标课包与上一课执行发布审计，必须失败并报告：`CN-OVERLAP`（字词重复）、`CN-TYPE`（题型/能力点复用）、`CN-PREDICTABILITY`（固定选项顺序/答案位置审计缺失）、`CN-LOGIC`（阅读答案无法回指证据）、`CN-CA-CONTRACT`（C-A 必需栏目、四态/四格、休息手动结束和动态题证据契约不完整）、`CN-SEMANTIC`（reviewerId/reviewedAt、逐题 validity/ambiguity 盲审覆盖不完整）、`CN-RELEASE`（Allen + George 双审核不完整）以及 `CN-FEEDBACK-TRACE`（traceId、能力画像/下一步到目标知识点映射、反馈证据清单与 refs 回指不完整）。这些规则只审当前 candidate；历史 JSON 仍可读取和审计，不会因为历史文件本身缺少新元数据而改变。自动检查不能替代语义盲审。

这节课是“战略正确、战术失真”：反馈包和每日能力画像本应约束下一课的知识点、题型与难度，但没有成为可追溯输入；审核只查 schema/字段形状，没有查跨课语义重复、答案可预测性、阅读证据回指或适配性，且把候选状态误当成 `ready_for_import`。AI 只能从已登记反馈发现人类未察觉的点；每条建议必须标注不确定性、回指证据，不得凭空扩展内容。

可执行闭环：反馈证据 → 能力画像更新 → 目标选择 → 题型/难度设计 → Allen 审核 → George 签发 → 下一天用新反馈验证。`tools/audit-chinese-pack-release.mjs` 执行当前阻断规则，但不接入 Oxford v6 runtime，也不改变旧课包 schema。
