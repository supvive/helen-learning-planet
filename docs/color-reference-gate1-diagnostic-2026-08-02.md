# 参考图课程 Gate 1 诊断记录

日期：2026-08-02

## 已核实

- 公共 Pages 已发布 `v3.9.7`（commit `b6d0c1c`）。当前前端的颜色星球首页卡片和首页入口都固定进入 `color-work-choice`；旧的静态“小狗”数据仍只作为历史目录数据，不再是默认入口。
- 生产 API `https://helen-learning-planet-api.vercel.app/api/health` 在本次检查时可达，但仍返回 `version: v3.9.6`，并报告参考图服务已配置。
- 生产分析接口在没有访问码时返回 `401`、`stage: auth`，没有调用模型，也没有写入课程。
- 本机以现有密钥做了一次受控 OpenRouter 检查（密钥未输出、未写入仓库）：请求确实使用 `openai/gpt-5.6-luna`、`reasoning.effort=max`；OpenRouter 返回 `403`，原始原因是“该模型在当前区域不可用”。同一账号下 Luna Pro、Terra、Terra Pro 也返回相同区域限制。
- 现有响应读取器兼容 Responses API（`output_text`/`output`）和 Chat Completions（`choices`），并在校验通过前不写入图片、课程或进度。

## 本 Gate 修复

- 后端版本集中为 `v3.9.8`，健康检查和本地启动标识一致。
- 将 OpenRouter 的“模型在区域不可用”从笼统的授权错误改为 `model_unavailable`，前端显示可行动的区域/路由提示；真正的无效访问码仍保留为 `auth`。
- 增加区域限制、无效密钥和版本断言测试。

## 外部验收边界

- 生产 Vercel 仍需部署包含本 Gate 修复的后端；本地可复现请求已证明失败发生在 OpenRouter 模型路由区域限制，而不是图片读取、JSON 解析或课程写入。
- 生产真实 Luna＋最高请求还需要用户在浏览器中已有的家庭访问码作为请求头；本记录不保存、不显示该访问码。部署完成后，使用同一张参考图可确认生产提示与本地分类一致。

## Gate 2｜Pro 路由结果

- UI 仍只显示 Luna/Terra；后端将 `最高（Max）` 映射为对应 `*-pro` 模型并发送 `reasoning: {"mode":"pro"}`。低/中/高继续发送普通模型与 `reasoning: {"effort": ...}`。
- 使用同一公开参考图做了一次真实 Luna Max 请求，实际路由为 `openai/gpt-5.6-luna-pro`；OpenRouter 在约 5.8 秒后返回 HTTP 403。后端现在将其分类为 `model_unavailable`，前端提示为“当前模型在 OpenRouter 所在区域不可用……”，没有写入课程或图片。
- 按 Gate 约束未继续轮试其他模型，也未声称模型调用成功。需在部署后由用户确认 OpenRouter 账户/区域路由，才能进行下一次正式验收。
