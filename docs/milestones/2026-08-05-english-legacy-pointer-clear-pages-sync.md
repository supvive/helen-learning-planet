# Pages 发布同步记录｜清除空英语序列中的旧 D01–D14 指针（2026-08-05）

状态：**候选发布补丁，未包含 Oxford design-only 数据**。

## 变更范围

仅同步一个运行时安全修复到 Pages 工作树：当活动英语课程序列为空时，清除旧浏览器可能残留的 `selectedEnglishDiagnosticPackId`（例如 D14）及旧的自动选课标记，并回到 `adaptive_shell`。这样首页不会短暂闪现已退回的 D01–D14，也不会把历史指针当作当前课程。

本次提交只包含：

- `app.js`
- 本发布记录

明确未包含：

- `data/english-diagnostic-d01…d14.json`
- `data/learning-packs/manifest.json`
- `data/learning-packs/builtin-learning-packs.js`
- Oxford source graph、known-language candidate、G4 candidate
- 中文反馈门闸、中文课包、颜色课程、学习进度和录音

## 本机验证

- Pages `app.js`：`node --check` 通过。
- 用 Pages 工作树的同一运行时函数做 stale-D14 指针夹具：空序列后结果为 `selectedEnglishDiagnosticPackId=""`、`lastAutoSelectedEnglishLessonId=""`、`englishPrimaryEntryPending=false`、`englishCourseSource="adaptive_shell"`。
- 源仓库回归（与 Pages 同一补丁）：
  - `test-letter-diagnostic-regressions.mjs` 通过；
  - `test-planet-current-audit.mjs` 通过；
  - `test-planet-state-audit-queue.mjs` 通过（Oxford 仍 `design_only`）；
  - `test-learning-planet.mjs` 通过；
  - `test-adaptive-switcher.mjs` 通过。

在以 `public/main` 为基线的 Pages 发布树中，`test-planet-state-audit-queue.mjs` 所需的 Oxford blueprint/audit 文档没有随公开站点发布，这是有意的 design-only 隔离；该测试已在完整源仓库通过。Pages 树本身已用相同的 app.js 夹具验证旧 D14 指针清除，并通过 letter、planet-current、learning-planet、adaptive-switcher 回归。

## 发布边界

该补丁可以独立提交到 Pages 发布分支，但不应把当前主开发工作树的 Oxford 候选文件带入 Pages。若执行公开推送，应在 Pages 工作树中确认 `git diff --name-only` 只出现上述两个文件，然后运行：

```text
git add app.js docs/milestones/2026-08-05-english-legacy-pointer-clear-pages-sync.md
git commit -m "Fix stale English diagnostic pointer on empty sequence"
git push public HEAD:main
```

当前 `public/main` 与 `pages-final-sync-remote` 并非同一提交线，直接把后者强推到 `public/main` 会回退 Pages 已有的样式改动，因此本分支已从 `public/main` 单独建立，可在审阅后安全快进推送。若不执行推送，阻断原因仅是发布审批/部署窗口，而不是代码或回归失败；Oxford 仍需独立等待真实 learner-known、媒体、盲审和儿童证据。
