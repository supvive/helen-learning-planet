# Deployment Progress

Last updated: 2026-08-01

## V3.9.0 reference-image course status

- The local V3.9.0 implementation is complete: reference image upload, Luna/Terra model choice, low/medium/high reasoning choice, fixed 13-step course generation, A4 sizing, marker-code choices, safe SVG overlays, IndexedDB image storage, duplicate-image reuse, and failure-safe writes.
- Automated tests and local desktop plus 320/360/390px browser checks pass.
- A local mock of the OpenAI Responses API completed the full 13/13 course path. The mock is not included in production code.
- A real OpenAI request reaches the API but currently returns 429 quota exceeded. ChatGPT/Codex credits do not fund OpenAI API usage.
- The user approved publishing the V3.9.0 browser interface before funding and connecting the private backend, to avoid a second frontend-development pass.
- Until the backend is deployed, the existing site remains usable and only “参考图课程”的生成操作 reports that the service is unavailable.
- After backend deployment, set the public page's `helen-api-origin` meta value to the verified HTTPS backend origin and rerun the real image test; the family-facing URL remains unchanged.

## Current production site

- Stable family-facing URL: `https://supvive.github.io/helen-learning-planet/`
- Direct latest Chinese lesson URL: `https://supvive.github.io/helen-learning-planet/#today-chinese`
- Publishing repository: `https://github.com/supvive/helen-learning-planet`
- The publishing repository is intentionally separate from the private development repository.
- The production URL must remain unchanged. Future releases update this same repository and users refresh the same URL.
- First fixed release: app `v3.4.8`, Day 14 Chinese Revision E, and the 14-step Color Planet lesson with all 14 images.
- Public checks completed for the home page, manifest, Day 14 Revision E pack, app assets, and the step-14 art image.
- The former `chatgpt.site` URL is not a valid family-facing fallback because Cloudflare blocked it on the user's other computer.

## Publishing boundary

- Publish only the browser learning app: `index.html`, `app.js`, `styles.css`, `assets/`, and `data/`.
- Never publish `.deepseek_api_key`, `.openai_api_key`, `.env`, `logs/`, `tools/`, recordings, or feedback archives.
- GitHub Pages hosts the learning-pack workflow, local progress, recording, feedback-package export, and other browser-side features.
- Server-only AI endpoints are not provided by GitHub Pages. Course content must continue to be authored by Dr. George/Allen and shipped inside the learning pack.

## Private development repository

- GitHub account authorized: `supvive`.
- Private repository: `https://github.com/supvive/hanzi-memory-app`.
- Render and Railway remain optional future backends, not the production family-facing URL.
- Render onboarding previously stopped at card verification.

## Optional backend work when the user says "信用卡到了"

1. Open Render dashboard:
   - `https://dashboard.render.com/`
2. Log in to the existing Render account.
3. Continue card verification if Render asks for it.
4. Create/deploy from GitHub repository:
   - Owner/repo: `supvive/hanzi-memory-app`
   - Branch: `main`
   - Blueprint/config file: `render.yaml`
5. Environment variables required:
   - `DEEPSEEK_API_KEY`: use the user's DeepSeek key. Do not print or expose it in chat.
   - `OPENROUTER_API_KEY`: use an OpenRouter API key with available credits; keep it server-side.
   - `OPENAI_VISION_LUNA_MODEL=openai/gpt-5.6-luna`
   - `OPENAI_VISION_TERRA_MODEL=openai/gpt-5.6-terra`
   - `APP_ACCESS_CODE`: a family access code chosen by the user.
   - `ALLOWED_ORIGINS=https://supvive.github.io`
6. After backend deployment, verify:
   - `/api/health` returns a healthy JSON response.
   - Daily Practice can call the AI service.
   - Keep the family-facing Learning Planet URL unchanged; connect backend capabilities without asking the family to adopt a new daily-use link.

## Notes

- Do not upload `.deepseek_api_key`, `.openai_api_key`, `.env`, `logs/`, or `tools/`.
- Render card verification is an account step, not an app code step.
- If Render becomes inconvenient, Railway can be tried with the existing `railway.json`.
