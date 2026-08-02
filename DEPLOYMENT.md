# 固定线上部署说明

本项目已经整理为可部署到 Vercel Hobby Python Function 的单服务版本：

- 前端：`index.html`、`app.js`、`styles.css`
- 后端：`server.py`
- 启动命令：`python server.py`
- 健康检查：`/api/health`

## 推荐方案：Vercel Hobby

1. 从 GitHub 导入后端仓库，选择 `v3.9-backend` 分支。
2. Framework Preset 选择 `Other`，Root Directory 留空。
3. 在 Environment Variables 中设置：

   - `OPENROUTER_API_KEY`（仅保存在服务端环境变量，不在网页中输入）
   - `APP_ACCESS_CODE`（仅服务端环境变量）
   - `OPENAI_VISION_LUNA_MODEL=openai/gpt-5.6-luna`
   - `OPENAI_VISION_TERRA_MODEL=openai/gpt-5.6-terra`
   - `OPENAI_VISION_TIMEOUT_MS=120000`
   - `ALLOWED_ORIGINS=https://supvive.github.io`

4. 使用免费的 Hobby 计划部署。Vercel 会读取 `vercel.json`，将 `/api/*`
   交给现有 Python 后端处理，最长等待时间为300秒。
5. 当前固定后端网址：

   `https://helen-learning-planet-api.vercel.app`

Hobby 计划在免费额度内运行。两个 Secret 只保存在 Vercel 环境变量中，
不会出现在仓库、构建文件或网页源码中。

家庭访问码同时保存在本机“钥匙串访问”的 `Helen Learning Planet Access Code`
项目中，便于首次在浏览器中配置，聊天与仓库中均不保存明文。

## Render（备用）

`render.yaml` 继续保留，但新账户可能被要求添加银行卡，因此不再作为默认方案。

## Railway

1. 把 `outputs/hanzi-memory-app` 目录作为一个 Git 仓库推到 GitHub。
2. Railway 新建项目并连接仓库。
3. Railway 会读取 `railway.json`，使用 `python server.py` 启动。
4. 环境变量至少设置：

   - `DEEPSEEK_API_KEY`
   - `APP_ACCESS_CODE`

5. Railway 会给一个固定访问域名。

## 重要安全说明

正式部署时不要上传这些文件：

- `.deepseek_api_key`
- `.openai_api_key`
- `.env`
- `logs/`
- `tools/`

这些已经写入 `.gitignore`、`.renderignore` 和 `.railwayignore`。

## 访问码

如果设置了 `APP_ACCESS_CODE`：

- iPad 第一次触发 AI 出题、链接读取或字典联网查询时，会提示输入访问码。
- 输入后会保存在 iPad 的浏览器本地存储中。
- 后续同一台 iPad 通常不用重复输入。

## 当前数据边界

第一版线上部署仍然优先使用浏览器本地数据：

- 生字本
- 练习记录
- 英语认读进度
- 家长报告数据

这意味着同一个固定网址在不同设备上打开时，学习记录暂时不会自动同步。后续如果需要 iPad、Mac、其他电脑共享同一份进度，需要增加线上数据库。

## 本地开发

本地仍然可以直接运行：

```bash
python server.py
```

然后打开：

```text
http://127.0.0.1:4173/
```
