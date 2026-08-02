#!/usr/bin/env python3
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, unquote, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import base64
import binascii
import hashlib
import html
import hmac
import json
import os
import re
import ssl
import time
import uuid
from glob import glob


SSL_CONTEXT = ssl._create_unverified_context()
APP_DIR = os.path.dirname(__file__)
API_KEY_FILE = os.path.join(os.path.dirname(__file__), ".deepseek_api_key")
OPENAI_API_KEY_FILE = os.path.join(os.path.dirname(__file__), ".openai_api_key")
ENV_FILE = os.path.join(APP_DIR, ".env")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com/chat/completions")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
DEEPSEEK_TIMEOUT_MS = int(os.environ.get("DEEPSEEK_TIMEOUT_MS", "90000"))
DEEPSEEK_TEMPERATURE = float(os.environ.get("DEEPSEEK_TEMPERATURE", "0.25"))
APP_ACCESS_CODE = os.environ.get("APP_ACCESS_CODE", "").strip()
API_VERSION = "v3.9.8"
OPENAI_RESPONSES_URL = os.environ.get("OPENAI_RESPONSES_URL", "https://openrouter.ai/api/v1/responses")
OPENAI_VISION_MODELS = {
    "luna": os.environ.get("OPENAI_VISION_LUNA_MODEL", "openai/gpt-5.6-luna"),
    "terra": os.environ.get("OPENAI_VISION_TERRA_MODEL", "openai/gpt-5.6-terra"),
}
OPENAI_VISION_PRO_MODELS = {
    "luna": os.environ.get("OPENAI_VISION_LUNA_PRO_MODEL", "openai/gpt-5.6-luna-pro"),
    "terra": os.environ.get("OPENAI_VISION_TERRA_PRO_MODEL", "openai/gpt-5.6-terra-pro"),
}
OPENAI_VISION_EFFORTS = {"low", "medium", "high", "max"}
# Keep the server-side wait below Vercel's 300s function limit. Max reasoning
# is intentionally preserved; a timeout remains a classified failure and
# never becomes a successful course write.
OPENAI_VISION_TIMEOUT_MS = int(os.environ.get("OPENAI_VISION_TIMEOUT_MS", "270000"))
# Reasoning models can spend most of the response budget on hidden reasoning
# before emitting the small JSON object we need.  Keep the ordinary budget
# unchanged and give Max enough room to finish its visible response.
OPENAI_VISION_MAX_OUTPUT_TOKENS = int(os.environ.get("OPENAI_VISION_MAX_OUTPUT_TOKENS", "12000"))
OPENAI_VISION_MAX_REASONING_OUTPUT_TOKENS = int(os.environ.get("OPENAI_VISION_MAX_REASONING_OUTPUT_TOKENS", "24000"))
COLOR_IMAGE_REQUEST_MAX_BYTES = 4 * 1024 * 1024
COLOR_IMAGE_MAX_DECODED_BYTES = 3 * 1024 * 1024
COLOR_REGISTER_PATH = os.path.join(APP_DIR, "data", "color-planet", "color-card-register-120.json")
ALLOWED_ORIGINS = {
    item.strip().rstrip("/")
    for item in os.environ.get(
        "ALLOWED_ORIGINS",
        "https://supvive.github.io,http://127.0.0.1:4173,http://localhost:4173",
    ).split(",")
    if item.strip()
}
LEARNING_PACK_DATA_DIR = os.path.join(APP_DIR, "data", "learning-packs")
LEARNING_PACK_MAX_BYTES = 100 * 1024
DAILY_PRACTICE_TIMEOUT_MS = int(os.environ.get("DAILY_PRACTICE_TIMEOUT_MS", "90000"))
ENGLISH_BLOCKS_TIMEOUT_MS = int(os.environ.get("ENGLISH_BLOCKS_TIMEOUT_MS", "90000"))
AI_EXAMPLE_TIMEOUT_MS = int(os.environ.get("AI_EXAMPLE_TIMEOUT_MS", "60000"))
JSON_REPAIR_TIMEOUT_MS = int(os.environ.get("JSON_REPAIR_TIMEOUT_MS", "30000"))
AI_FAILURE_LOG_DIR = os.path.join(APP_DIR, "logs", "ai-failures")
MAX_AI_PROMPT_TOKENS = int(os.environ.get("MAX_AI_PROMPT_TOKENS", "1500"))
CIRCUIT_BREAKER_WINDOW = int(os.environ.get("AI_CIRCUIT_BREAKER_WINDOW", "10"))
CIRCUIT_BREAKER_MIN_CALLS = int(os.environ.get("AI_CIRCUIT_BREAKER_MIN_CALLS", "5"))
CIRCUIT_BREAKER_FAIL_RATE = float(os.environ.get("AI_CIRCUIT_BREAKER_FAIL_RATE", "0.3"))
CIRCUIT_BREAKER_COOLDOWN_MS = int(os.environ.get("AI_CIRCUIT_BREAKER_COOLDOWN_MS", "30000"))
AI_CIRCUIT_STATE = {}
FRIENDLY_JSON_ERROR = "AI返回格式异常，已拦截。请重新生成"
STRICT_JSON_INSTRUCTIONS = """
你必须只输出一个严格合法的 JSON 对象。
不要输出 Markdown。
不要输出 ```json 代码块。
不要输出解释文字。
不要输出注释。
不要使用尾随逗号。
不要省略逗号。
所有 key 必须使用英文双引号。
所有 string value 必须使用英文双引号。
如果字符串内部有英文双引号，必须转义，或者改用中文引号。
换行必须写成 \\n，不要在字符串中直接换行。
""".strip()


class ModelOutputError(Exception):
    pass


class AIStageError(Exception):
    def __init__(self, stage, message, *, user_message=None, status=500, raw_output="", prompt_chars=0, feature=""):
        super().__init__(message)
        self.stage = stage or "unknown"
        self.user_message = user_message or ai_user_message(self.stage)
        self.status = status
        self.raw_output = raw_output or ""
        self.prompt_chars = prompt_chars or 0
        self.feature = feature or ""
        self.timings = {}


def make_request_id(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def make_ai_meta(feature, request_id, started_at, *, model=None, from_cache=False,
                 prompt_version="v3.0.0", schema_version="v1", timings=None):
    return {
        "provider": "deepseek",
        "model": model or DEEPSEEK_MODEL,
        "requestId": request_id,
        "createdAt": int(time.time() * 1000),
        "latencyMs": int((time.time() - started_at) * 1000),
        "fromCache": bool(from_cache),
        "promptVersion": prompt_version,
        "schemaVersion": schema_version,
        "feature": feature,
        "timings": normalize_ai_timings(timings),
        "bottlenecks": detect_ai_bottlenecks(timings),
    }


def log_ai_stage(event, request_id, **fields):
    lines = [f"[{event}]", f"requestId: {request_id}"]
    for key, value in fields.items():
        lines.append(f"{key}: {value}")
    print("\n".join(lines), flush=True)


def log_ai_start(feature, request_id, model=None):
    print(
        "\n".join([
            "[AI_REQUEST_START]",
            f"feature: {feature}",
            f"requestId: {request_id}",
            "provider: deepseek",
            f"model: {model or DEEPSEEK_MODEL}",
            f"timestamp: {int(time.time() * 1000)}",
        ]),
        flush=True,
    )


def log_ai_success(request_id, started_at, *, question_count=0, from_cache=False, timings=None):
    timings = normalize_ai_timings(timings)
    print(
        "\n".join([
            "[AI_REQUEST_SUCCESS]",
            f"requestId: {request_id}",
            f"totalDurationMs: {int((time.time() - started_at) * 1000)}",
            f"questionCount: {question_count}",
            f"fromCache: {str(bool(from_cache)).lower()}",
            f"queue_wait_time: {timings['queue_wait_time']}",
            f"prompt_build_time: {timings['prompt_build_time']}",
            f"api_call_time: {timings['api_call_time']}",
            f"first_token_time: {timings['first_token_time']}",
            f"json_parse_time: {timings['json_parse_time']}",
            f"schema_validate_time: {timings['schema_validate_time']}",
            f"retry_count: {timings['retry_count']}",
            f"bottleneck: {','.join(detect_ai_bottlenecks(timings)) or 'none'}",
        ]),
        flush=True,
    )


def log_ai_failure(request_id, started_at, stage, error, feature="", timings=None):
    resolved_feature = feature or getattr(error, "feature", "") or "unknown"
    save_ai_failure_log(request_id, resolved_feature, stage, error)
    timings = normalize_ai_timings(timings or getattr(error, "timings", None))
    print(
        "\n".join([
            "[AI_REQUEST_FAIL]",
            f"requestId: {request_id}",
            f"feature: {resolved_feature}",
            f"durationMs: {int((time.time() - started_at) * 1000)}",
            f"stage: {stage or 'unknown'}",
            f"queue_wait_time: {timings['queue_wait_time']}",
            f"prompt_build_time: {timings['prompt_build_time']}",
            f"api_call_time: {timings['api_call_time']}",
            f"first_token_time: {timings['first_token_time']}",
            f"json_parse_time: {timings['json_parse_time']}",
            f"schema_validate_time: {timings['schema_validate_time']}",
            f"retry_count: {timings['retry_count']}",
            f"bottleneck: {','.join(detect_ai_bottlenecks(timings)) or 'none'}",
            f"errorName: {type(error).__name__}",
            f"errorMessage: {redact_ai_log_text(error)}",
        ]),
        flush=True,
    )


def save_ai_failure_log(request_id, feature, stage, error):
    raw = getattr(error, "raw_output", "") or ""
    if not request_id or (not raw and stage not in {"response_empty", "response_truncated", "json_parse", "schema_validate", "timeout"}):
        return
    try:
        os.makedirs(AI_FAILURE_LOG_DIR, exist_ok=True)
        timings = normalize_ai_timings(getattr(error, "timings", None))
        payload = {
            "requestId": request_id,
            "feature": feature,
            "stage": stage or "unknown",
            "promptChars": getattr(error, "prompt_chars", 0) or 0,
            "timings": timings,
            "bottlenecks": detect_ai_bottlenecks(timings),
            "rawOutputChars": len(raw),
            "errorName": type(error).__name__,
            "errorMessage": redact_ai_log_text(error, 2000),
            "createdAt": int(time.time() * 1000),
        }
        with open(os.path.join(AI_FAILURE_LOG_DIR, f"{request_id}.json"), "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
    except OSError:
        pass


def redact_ai_log_text(error, limit=1000):
    text = str(error or "")[:limit]
    text = re.sub(r"(?i)(bearer\s+)[^\s,]+", r"\1[redacted]", text)
    text = re.sub(r"(?i)((?:api[_-]?key|authorization)\s*[:=]\s*)[^\s,]+", r"\1[redacted]", text)
    return text


def ai_user_message(stage):
    messages = {
        "prompt_build": "AI出题失败：系统提示词构建异常，请检查模板。",
        "prompt_too_large": "AI出题失败：提示词过大，已拦截。",
        "provider_call": "AI出题失败：模型服务调用失败，请稍后重试。",
        "response_empty": "AI没有返回可用内容，请重新生成。",
        "response_truncated": "AI返回内容被截断，请重新生成。",
        "json_parse": "AI出题失败：AI返回格式异常，已拦截。请重新生成。",
        "schema_validate": "AI出题失败：题目结构校验未通过，请重新生成。",
        "rate_limit": "DeepSeek 请求受限：额度不足或请求过于频繁，请稍后重试或检查 API 额度。",
        "auth": "出题服务授权无效，请检查 DeepSeek API Key。",
        "network": "AI出题失败：网络连接异常，请稍后重试。",
        "timeout": "AI出题超时，请重新生成。",
        "circuit_breaker": "系统繁忙，请30秒后再试。",
        "fake_ai_detected": "AI出题失败：未检测到真实模型调用。",
    }
    return messages.get(stage or "unknown", "AI出题失败，请重新生成。")


def build_ai_prompt(request_id, feature, builder, timings=None):
    log_ai_stage("AI_PROMPT_BUILD_START", request_id, feature=feature)
    started = time.time()
    try:
        prompt = builder()
    except Exception as exc:
        raise AIStageError("prompt_build", str(exc), status=500, feature=feature) from exc
    duration_ms = int((time.time() - started) * 1000)
    if timings is not None:
        timings["prompt_build_time"] = duration_ms
    prompt_tokens = estimate_prompt_tokens(prompt)
    if prompt_tokens > MAX_AI_PROMPT_TOKENS:
        exc = AIStageError("prompt_too_large", "prompt_too_large", status=413, prompt_chars=len(prompt), feature=feature)
        if timings is not None:
            exc.timings = normalize_ai_timings(timings)
        raise exc
    log_ai_stage("AI_PROMPT_BUILD_SUCCESS", request_id, promptChars=len(prompt), promptTokens=prompt_tokens, durationMs=duration_ms)
    return prompt


def normalize_ai_timings(timings=None):
    timings = dict(timings or {})
    return {
        "queue_wait_time": int(timings.get("queue_wait_time") or 0),
        "prompt_build_time": int(timings.get("prompt_build_time") or 0),
        "api_call_time": int(timings.get("api_call_time") or 0),
        "first_token_time": timings.get("first_token_time", "not_supported"),
        "json_parse_time": int(timings.get("json_parse_time") or 0),
        "schema_validate_time": int(timings.get("schema_validate_time") or 0),
        "retry_count": int(timings.get("retry_count") or 0),
        "api_called": bool(timings.get("api_called")),
    }


def detect_ai_bottlenecks(timings=None):
    timings = normalize_ai_timings(timings)
    bottlenecks = []
    if timings["api_call_time"] > 60000:
        bottlenecks.append("provider_slow")
    if timings["prompt_build_time"] > 5000:
        bottlenecks.append("prompt_bloat")
    if timings["json_parse_time"] > 2000:
        bottlenecks.append("parser_issue")
    if timings["retry_count"] > 1:
        bottlenecks.append("retry_loop")
    return bottlenecks


def estimate_prompt_tokens(prompt):
    text = str(prompt or "")
    words = re.findall(r"[A-Za-z0-9_']+", text)
    english_chars = sum(len(item) for item in words)
    chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", text))
    punctuation_chars = max(0, len(text) - english_chars - chinese_chars)
    return int(chinese_chars + len(words) * 1.2 + punctuation_chars / 4)


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript"}:
            self.skip = True

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript"}:
            self.skip = False

    def handle_data(self, data):
        if not self.skip:
            text = data.strip()
            if text:
                self.parts.append(text)

    def text(self):
        return re.sub(r"\s+", " ", " ".join(self.parts)).strip()


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        origin = self.headers.get("Origin", "").strip().rstrip("/")
        if origin and origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-App-Access-Code, X-Client-Trace-Id",
        )
        self.send_header("Access-Control-Allow-Private-Network", "true")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        request_path = resolve_api_path(self.path)
        if request_path == "/api/learning-packs":
            self.save_learning_pack_api()
            return
        if not self.ensure_api_access():
            return
        if request_path == "/api/generate-practice":
            self.generate_practice()
            return
        if request_path == "/api/generate-block-example":
            self.generate_block_example()
            return
        if request_path == "/api/english-blocks/examples":
            self.generate_english_block_examples()
            return
        if request_path == "/api/english-blocks/generate":
            self.generate_english_block_exercises()
            return
        if request_path == "/api/color-course/analyze":
            self.analyze_color_course()
            return
        if request_path == "/api/save-key":
            self.save_key()
            return
        self.send_json({"ok": False, "error": "Unknown endpoint."}, 404)

    def do_GET(self):
        parsed = urlparse(self.path)
        request_path = resolve_api_path(self.path)
        if request_path == "/api/health":
            self.send_json({
                "ok": True,
                "version": API_VERSION,
                "learningPackApi": {"writeEnabled": bool(APP_ACCESS_CODE)},
                "colorReferenceApi": {"configured": bool(get_openai_api_key())},
            })
            return
        if request_path.startswith("/api/") and not self.ensure_api_access():
            return
        if request_path == "/api/learning-packs/latest":
            self.get_latest_learning_pack_api()
            return
        if request_path == "/api/read-share":
            self.read_share(parsed.query)
            return
        if request_path == "/api/dictionary":
            self.read_dictionary(parsed.query)
            return
        if request_path == "/api/key-status":
            self.send_json({"ok": True, "configured": bool(get_api_key())})
            return
        if request_path in {"/english-blocks", "/english-recognition", "/english-words"}:
            self.path = "/index.html"
            super().do_GET()
            return
        super().do_GET()

    def read_json_body(self, max_bytes=None):
        length = int(self.headers.get("Content-Length", "0"))
        if max_bytes is not None and length > max_bytes:
            raise ValueError("Request body is too large.")
        if length > LEARNING_PACK_MAX_BYTES and self.path.startswith("/api/learning-packs"):
            raise ValueError("Learning pack body exceeds 100KB.")
        return json.loads(self.rfile.read(length).decode("utf-8") or "{}")

    def analyze_color_course(self):
        request_id = make_request_id("color-reference")
        client_trace_id = re.sub(r"[^A-Za-z0-9_-]", "", self.headers.get("X-Client-Trace-Id", "")[:80])
        trace_id = client_trace_id or request_id
        started_at = time.time()
        try:
            payload = self.read_json_body(max_bytes=COLOR_IMAGE_REQUEST_MAX_BYTES)
            image = validate_color_image_request(payload)
            effort = image["reasoningEffort"]
            route = resolve_color_reference_route(image["modelTier"], effort)
            model = route["model"]
            api_key = get_openai_api_key()
            if not api_key:
                self.send_json({
                    "ok": False,
                    "error": "参考图分析服务尚未配置。",
                    "stage": "auth",
                    "requestId": request_id,
                    "traceId": trace_id,
                }, 503)
                return
            register = load_color_register()
            log_ai_stage(
                "COLOR_REFERENCE_ANALYSIS_START",
                request_id,
                provider="openrouter",
                model=model,
                reasoningEffort=effort,
                reasoningMode=route["reasoning"].get("mode", "effort"),
                imageBytes=len(image["bytes"]),
                imageHash=image["sha256"][:12],
                traceId=trace_id,
            )
            raw, usage = call_openai_color_reference_model(
                api_key,
                image,
                register,
                request_id=request_id,
                model=model,
                reasoning_effort=effort,
                reasoning_config=route["reasoning"],
            )
            analysis = validate_color_reference_analysis(raw, register)
            analysis["imageHash"] = image["sha256"]
            meta = {
                "provider": "openrouter",
                "model": model,
                "modelTier": image["modelTier"],
                "reasoningEffort": effort,
                "reasoningMode": route["reasoning"].get("mode", "effort"),
                "requestId": request_id,
                "createdAt": int(time.time() * 1000),
                "latencyMs": int((time.time() - started_at) * 1000),
                "schemaVersion": "helen-color-reference-analysis/1",
                "usage": sanitize_openai_usage(usage),
            }
            log_ai_stage(
                "COLOR_REFERENCE_ANALYSIS_SUCCESS",
                request_id,
                durationMs=meta["latencyMs"],
                objectCount=len(analysis.get("objects") or []),
                paletteCount=len(analysis.get("paletteTargets") or []),
            )
            meta["traceId"] = trace_id
            self.send_json({"ok": True, "analysis": analysis, "meta": meta})
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc), "stage": "input", "requestId": request_id, "traceId": trace_id}, 400)
        except AIStageError as exc:
            log_ai_failure(request_id, started_at, exc.stage, exc, feature="color_reference")
            self.send_json({
                "ok": False,
                "error": exc.user_message,
                "stage": exc.stage,
                "requestId": request_id,
                "traceId": trace_id,
            }, exc.status)
        except Exception as exc:
            log_ai_failure(request_id, started_at, "unknown", exc, feature="color_reference")
            self.send_json({
                "ok": False,
                "error": "参考图分析失败，请重试。",
                "stage": "unknown",
                "requestId": request_id,
                "traceId": trace_id,
            }, 500)

    def ensure_api_access(self):
        if not APP_ACCESS_CODE:
            return True
        provided = self.headers.get("X-App-Access-Code", "").strip()
        if hmac.compare_digest(provided, APP_ACCESS_CODE):
            return True
        self.send_json({
            "ok": False,
            "error": "Access code required.",
            "stage": "auth",
            "requestId": make_request_id("access"),
        }, 401)
        return False

    def save_key(self):
        try:
            payload = self.read_json_body()
            api_key = payload.get("apiKey", "").strip()
            if not is_valid_api_key(api_key):
                self.send_json({"ok": False, "error": "Invalid API key format."}, 400)
                return
            save_api_key(api_key)
            self.send_json({"ok": True, "configured": bool(get_api_key())})
        except Exception as exc:
            self.send_json({"ok": False, "error": f"Save key failed: {exc}"}, 500)

    def save_learning_pack_api(self):
        if not APP_ACCESS_CODE:
            self.send_json({"ok": False, "error": "Learning pack API write is disabled until APP_ACCESS_CODE is configured."}, 403)
            return
        if not self.ensure_api_access():
            return
        try:
            payload = self.read_json_body()
            pack = validate_learning_pack_api_payload(payload)
            os.makedirs(LEARNING_PACK_DATA_DIR, exist_ok=True)
            path = os.path.join(LEARNING_PACK_DATA_DIR, f"{pack['packId']}.json")
            existing = None
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as handle:
                    existing = json.load(handle)
            checksum = checksum_text(json.dumps(pack, ensure_ascii=False, sort_keys=True))
            repeat = existing and existing.get("checksum") == checksum
            record = {
                "packId": pack["packId"],
                "schemaVersion": pack["schemaVersion"],
                "date": pack["date"],
                "checksum": checksum,
                "savedAt": existing.get("savedAt") if existing else int(time.time() * 1000),
                "updatedAt": int(time.time() * 1000),
                "pack": pack,
            }
            if not repeat:
                with open(path, "w", encoding="utf-8") as handle:
                    json.dump(record, handle, ensure_ascii=False, indent=2)
            self.send_json({"ok": True, "repeat": bool(repeat), "packId": pack["packId"], "checksum": checksum})
        except ValueError as exc:
            self.send_json({"ok": False, "error": str(exc)}, 400)
        except Exception as exc:
            self.send_json({"ok": False, "error": f"Save learning pack failed: {exc}"}, 500)

    def get_latest_learning_pack_api(self):
        try:
            files = glob(os.path.join(LEARNING_PACK_DATA_DIR, "*.json"))
            if not files:
                self.send_json({"ok": False, "error": "No learning pack saved."}, 404)
                return
            latest_path = max(files, key=lambda path: os.path.getmtime(path))
            with open(latest_path, "r", encoding="utf-8") as handle:
                record = json.load(handle)
            self.send_json({"ok": True, "record": record})
        except Exception as exc:
            self.send_json({"ok": False, "error": f"Read latest learning pack failed: {exc}"}, 500)

    def read_share(self, query):
        url = unquote(parse_qs(query).get("url", [""])[0])
        host = urlparse(url).netloc.lower()
        if not url.startswith(("https://", "http://")) or not (
            host.endswith("chatgpt.com") or host.endswith("openai.com")
        ):
            self.send_json({"ok": False, "error": "Only ChatGPT/OpenAI share links are supported."}, 400)
            return

        try:
            raw = fetch_page(url)
            text = extract_chatgpt_share_text(raw)
            if len(text) < 120:
                self.send_json({"ok": False, "error": "No readable conversation text found."}, 422)
                return
            self.send_json({"ok": True, "text": text})
        except HTTPError as exc:
            self.send_json({"ok": False, "error": format_http_error(exc)}, exc.code)
        except (URLError, TimeoutError) as exc:
            self.send_json({"ok": False, "error": f"Network error: {exc}"}, 502)
        except Exception as exc:
            self.send_json({"ok": False, "error": f"Parse error: {exc}"}, 500)

    def generate_practice(self):
        request_id = make_request_id("daily")
        started_at = time.time()
        log_ai_start("daily_practice", request_id)
        try:
            payload = self.read_json_body()
            incoming_key = payload.get("apiKey", "").strip()
            if incoming_key:
                save_api_key(incoming_key)
            api_key = get_api_key()
            source_text = payload.get("sourceText", "").strip()
            if not api_key:
                exc = AIStageError("auth", "Server API key is not configured.", user_message="出题服务未配置授权 / AI key missing", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            if len(source_text) < 120:
                exc = AIStageError("prompt_build", "Missing source text.", user_message="链接内容不足，无法出题。", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            plan, timings = callAI("daily_practice", {
                "sourceText": source_text,
                "practiceData": payload.get("practiceData", {}),
            }, api_key=api_key, request_id=request_id)
            meta = make_ai_meta("daily_practice", request_id, started_at, prompt_version="daily-v3.0.0", schema_version="daily-practice-v1", timings=timings)
            if isinstance(plan, dict):
                plan["meta"] = meta
            log_ai_success(request_id, started_at, question_count=count_daily_questions(plan), from_cache=False, timings=timings)
            self.send_json({"ok": True, "plan": plan})
        except AIStageError as exc:
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except (HTTPError, URLError, TimeoutError) as exc:
            log_ai_failure(request_id, started_at, "network", exc)
            self.send_json({"ok": False, "error": ai_user_message("network"), "stage": "network", "requestId": request_id}, 502)
        except ModelOutputError:
            exc = AIStageError("json_parse", FRIENDLY_JSON_ERROR, status=502)
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except Exception as exc:
            log_ai_failure(request_id, started_at, "unknown", exc)
            self.send_json({"ok": False, "error": ai_user_message("unknown"), "stage": "unknown", "requestId": request_id}, 500)

    def generate_block_example(self):
        request_id = make_request_id("block-example")
        started_at = time.time()
        log_ai_start("ai_example", request_id)
        try:
            payload = self.read_json_body()
            api_key = get_api_key()
            if not api_key:
                exc = AIStageError("auth", "Server API key is not configured.", user_message="出题服务未配置授权 / AI key missing", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            target_word = normalize_english_word(payload.get("targetWord", ""))
            display_word = str(payload.get("displayWord", "")).strip()
            if not target_word or not display_word:
                exc = AIStageError("prompt_build", "Missing target word.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            example, timings = callAI("ai_example", {
                **payload,
                "kind": "block_example",
            }, api_key=api_key, request_id=request_id)
            if not validate_block_example(example, target_word):
                exc = AIStageError("schema_validate", "Generated example did not pass validation.", status=422)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            meta = make_ai_meta("ai_example", request_id, started_at, prompt_version="block-example-v3.0.0", schema_version="block-example-v1", timings=timings)
            if isinstance(example, dict):
                example["meta"] = meta
            log_ai_success(request_id, started_at, question_count=1, from_cache=False, timings=timings)
            self.send_json({"ok": True, "example": example, "meta": meta})
        except AIStageError as exc:
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except (HTTPError, URLError, TimeoutError) as exc:
            log_ai_failure(request_id, started_at, "network", exc)
            self.send_json({"ok": False, "error": ai_user_message("network"), "stage": "network", "requestId": request_id}, 502)
        except ModelOutputError:
            exc = AIStageError("json_parse", FRIENDLY_JSON_ERROR, status=502)
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except Exception as exc:
            log_ai_failure(request_id, started_at, "unknown", exc)
            self.send_json({"ok": False, "error": ai_user_message("unknown"), "stage": "unknown", "requestId": request_id}, 500)

    def generate_english_block_exercises(self):
        request_id = make_request_id("blocks")
        started_at = time.time()
        log_ai_start("english_blocks", request_id)
        try:
            payload = self.read_json_body()
            api_key = get_api_key()
            if not api_key:
                exc = AIStageError("auth", "Server API key is not configured.", user_message="出题服务未配置授权 / AI key missing", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            pattern_id = str(payload.get("patternId", "")).strip()
            selected_types = payload.get("selectedTypes", [])
            count = int(payload.get("countPerType") or payload.get("count", 3))
            allowed_types = {"ordering", "fill_blank", "translation_build", "choose_correct", "pattern_replace"}
            selected_types = [item for item in selected_types if item in allowed_types]
            selected_pattern = normalize_selected_pattern(payload, pattern_id)
            if not selected_pattern:
                exc = AIStageError("prompt_build", "Unknown pattern.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            if not selected_types:
                exc = AIStageError("prompt_build", "Select at least one exercise type.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            if count not in {1, 3, 5}:
                exc = AIStageError("prompt_build", "Count must be 1, 3, or 5.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            batch, timings = callAI("english_blocks", {
                **payload,
                "pattern": selected_pattern,
                "selectedTypes": selected_types,
                "count": count,
            }, api_key=api_key, request_id=request_id)
            if not batch:
                exc = AIStageError(
                    "schema_validate",
                    "题目质量校验未通过，请重新生成",
                    user_message="AI题目结构不完整，请重新生成。",
                    status=422,
                    feature="english_blocks",
                    raw_output=json.dumps(batch, ensure_ascii=False)[:6000],
                )
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            meta = make_ai_meta("english_blocks", request_id, started_at, prompt_version="english-blocks-v3.0.0", schema_version="english-blocks-batch-v1", timings=timings)
            batch["meta"] = meta
            log_ai_success(request_id, started_at, question_count=len(batch.get("questions") or []), from_cache=False, timings=timings)
            self.send_json({"ok": True, "batch": batch})
        except AIStageError as exc:
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except (HTTPError, URLError, TimeoutError) as exc:
            log_ai_failure(request_id, started_at, "network", exc)
            self.send_json({"ok": False, "error": ai_user_message("network"), "stage": "network", "requestId": request_id}, 502)
        except ModelOutputError:
            exc = AIStageError("json_parse", FRIENDLY_JSON_ERROR, status=502)
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except Exception as exc:
            log_ai_failure(request_id, started_at, "unknown", exc)
            self.send_json({"ok": False, "error": ai_user_message("unknown"), "stage": "unknown", "requestId": request_id}, 500)

    def generate_english_block_examples(self):
        request_id = make_request_id("pattern-examples")
        started_at = time.time()
        log_ai_start("ai_example", request_id)
        try:
            payload = self.read_json_body()
            api_key = get_api_key()
            if not api_key:
                exc = AIStageError("auth", "Server API key is not configured.", user_message="出题服务未配置授权 / AI key missing", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            pattern_id = str(payload.get("patternId", "")).strip()
            count = int(payload.get("count", 3))
            selected_pattern = normalize_selected_pattern(payload, pattern_id)
            if not selected_pattern:
                exc = AIStageError("prompt_build", "Unknown pattern.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            if count not in {1, 3, 5}:
                exc = AIStageError("prompt_build", "Count must be 1, 3, or 5.", status=400)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            examples, timings = callAI("ai_example", {
                **payload,
                "kind": "pattern_examples",
                "pattern": selected_pattern,
                "count": count,
            }, api_key=api_key, request_id=request_id)
            examples = validate_english_block_examples(examples, count)
            if not examples:
                exc = AIStageError("schema_validate", "Generated examples did not pass validation.", status=422)
                log_ai_failure(request_id, started_at, exc.stage, exc)
                self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
                return
            meta = make_ai_meta("ai_example", request_id, started_at, prompt_version="pattern-examples-v3.0.0", schema_version="pattern-examples-v1", timings=timings)
            examples = [{**example, "meta": meta} for example in examples]
            log_ai_success(request_id, started_at, question_count=len(examples), from_cache=False, timings=timings)
            self.send_json({"ok": True, "examples": examples, "meta": meta})
        except AIStageError as exc:
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except (HTTPError, URLError, TimeoutError) as exc:
            log_ai_failure(request_id, started_at, "network", exc)
            self.send_json({"ok": False, "error": ai_user_message("network"), "stage": "network", "requestId": request_id}, 502)
        except ModelOutputError:
            exc = AIStageError("json_parse", FRIENDLY_JSON_ERROR, status=502)
            log_ai_failure(request_id, started_at, exc.stage, exc)
            self.send_json({"ok": False, "error": exc.user_message, "stage": exc.stage, "requestId": request_id}, exc.status)
        except Exception as exc:
            log_ai_failure(request_id, started_at, "unknown", exc)
            self.send_json({"ok": False, "error": ai_user_message("unknown"), "stage": "unknown", "requestId": request_id}, 500)

    def read_dictionary(self, query):
        char = parse_qs(query).get("char", [""])[0].strip()
        if not re.fullmatch(r"[\u4e00-\u9fff]", char):
            self.send_json({"ok": False, "error": "Please provide one Chinese character."}, 400)
            return

        try:
            entry = fetch_dictionary_entry(char)
            if not entry:
                self.send_json({"ok": False, "error": "No online dictionary entry found."}, 404)
                return
            self.send_json({"ok": True, "entry": entry})
        except (HTTPError, URLError, TimeoutError) as exc:
            self.send_json({"ok": False, "error": f"Network error: {exc}"}, 502)
        except Exception as exc:
            self.send_json({"ok": False, "error": f"Parse error: {exc}"}, 500)

    def send_json(self, payload, status=200):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def fetch_page(url):
    request = Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
        },
    )
    with urlopen(request, timeout=20, context=SSL_CONTEXT) as response:
        return response.read().decode("utf-8", errors="replace")


def validate_learning_pack_api_payload(pack):
    if not isinstance(pack, dict):
        raise ValueError("Learning pack must be a JSON object.")
    if pack.get("schemaVersion") not in {"helen-learning-pack/1", "helen-learning-pack/2"}:
        raise ValueError("Unsupported schemaVersion.")
    pack_id = str(pack.get("packId", "")).strip()
    if not re.fullmatch(r"[a-zA-Z0-9._:-]{6,80}", pack_id):
        raise ValueError("Invalid packId.")
    date = str(pack.get("date", "")).strip()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
        raise ValueError("Invalid date.")
    raw = json.dumps(pack, ensure_ascii=False)
    if len(raw.encode("utf-8")) > LEARNING_PACK_MAX_BYTES:
        raise ValueError("Learning pack body exceeds 100KB.")
    if re.search(r"<\s*(script|iframe|object|embed|style|link|meta)\b|javascript\s*:", raw, re.I):
        raise ValueError("Learning pack cannot contain scripts or unsafe HTML.")
    policy = pack.get("contentPolicy") or {}
    if pack.get("chinese", {}).get("lesson") or pack.get("english", {}).get("lesson"):
        if policy.get("authority") != "codex-course-designer" or policy.get("websiteMode") != "render-only" or policy.get("allowModelGeneration") is not False:
            raise ValueError("Full course packs must declare render-only contentPolicy.")
    return pack


def checksum_text(text):
    value = 5381
    for char in text:
      value = ((value << 5) + value) ^ ord(char)
    return f"c{value & 0xffffffff:x}"


def format_http_error(exc):
    detail = ""
    try:
        raw = exc.read().decode("utf-8", errors="replace")
        data = json.loads(raw)
        detail = data.get("error", {}).get("message") or data.get("message") or raw[:500]
    except Exception:
        detail = str(exc)
    if exc.code == 429:
        return f"DeepSeek 429 Too Many Requests: {detail}"
    return f"DeepSeek HTTP {exc.code}: {detail}"


def get_api_key():
    env_key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    if env_key:
        return env_key
    env_file_key = read_env_key()
    if env_file_key:
        return env_file_key
    try:
        with open(API_KEY_FILE, "r", encoding="utf-8") as handle:
            return handle.read().strip()
    except OSError:
        return ""


def save_api_key(api_key):
    if not is_valid_api_key(api_key):
        return
    try:
        with open(API_KEY_FILE, "w", encoding="utf-8") as handle:
            handle.write(api_key)
    except OSError:
        pass


def is_valid_api_key(api_key):
    return api_key.startswith(("sk-", "sess-")) and len(api_key) >= 20


SERVER_BLOCK_PATTERNS = {
    "want_to_do": {
        "displayFormulaZh": "主语 + want to + 动词（短语）",
        "displayFormulaEn": "Subject + want to + verb phrase",
        "explanationZh": "表示某人想做某事，want to 后面接动词原形。",
        "sourceExamples": [
            "Is there anything you want to eat, baby?",
            "Do you want to play with us?",
            "Do you want to be my friend?",
        ],
    },
    "here_is_my": {
        "displayFormulaZh": "Here is my + 物品",
        "displayFormulaEn": "Here is my + thing",
        "explanationZh": "用来介绍这是我的某个物品。",
        "sourceExamples": ["Here is my schoolbag.", "Here is my book, and here is my pencil box.", "Here is my ruler."],
    },
    "this_is_your_thing": {
        "displayFormulaZh": "This is your + 物品",
        "displayFormulaEn": "This is your + thing",
        "explanationZh": "用于指出某个东西是对方的。",
        "sourceExamples": ["This is your seat.", "This is your pencil.", "This is your book."],
    },
    "whats_your_name": {
        "displayFormulaZh": "What's your name?",
        "displayFormulaEn": "What is your name?",
        "explanationZh": "用来询问对方的名字。",
        "sourceExamples": ["Hello! I’m Amy. What’s your name?"],
    },
    "have_has": {
        "displayFormulaZh": "第三人称 + has + 物品",
        "displayFormulaEn": "He / She + has + thing",
        "explanationZh": "表示他或她拥有某个东西。",
        "sourceExamples": ["She has a purple bag.", "I have a new teacher, a new friend and a happy first day at school."],
    },
    "schoolbag_place": {
        "displayFormulaZh": "物品 + is + 位置",
        "displayFormulaEn": "Thing + is + place",
        "explanationZh": "用来说明一个东西在哪里。",
        "sourceExamples": ["I put my schoolbag on the desk and say, “Here is my schoolbag.”"],
    },
    "dialog_name": {
        "displayFormulaZh": "Hello + I'm + 名字 + What's your name?",
        "displayFormulaEn": "Greeting + name question",
        "explanationZh": "用来打招呼、介绍自己并询问名字。",
        "sourceExamples": ["Hello! I’m Amy. What’s your name?", "Good morning, Miss Wang! I’m Helen,” I say."],
    },
    "error_be": {
        "displayFormulaZh": "She + is + 形容词",
        "displayFormulaEn": "She + is + adjective",
        "explanationZh": "She 后面搭配 is。",
        "sourceExamples": ["She is very cute.", "My teacher is very kind."],
    },
    "parallel_actions": {
        "displayFormulaZh": "We + 多个动作 + 地点",
        "displayFormulaEn": "We + actions + place",
        "explanationZh": "表达我们在某个地方做几个动作。",
        "sourceExamples": ["We run, jump and skip in the playground."],
    },
}

CHINESE_LEXICON = {
    "输": {"pinyin": "shū", "meaning": "运送；传送；在比赛中失败", "wordGroups": ["运输", "输入", "输出", "输赢", "输送"], "sentence": "比赛输了也要继续努力"},
    "运输": {"pinyin": "yùn shū", "meaning": "把人或东西从一个地方送到另一个地方", "wordGroups": ["运输车", "运送", "输送"], "sentence": "卡车负责运输水果"},
    "输入": {"pinyin": "shū rù", "meaning": "把内容送进电脑或系统里", "wordGroups": ["输入法", "输入文字", "输入答案"], "sentence": "请在电脑里输入名字"},
    "输出": {"pinyin": "shū chū", "meaning": "把内容从里面送出来", "wordGroups": ["输出结果", "输出文字", "输出内容"], "sentence": "电脑输出了结果"},
    "输赢": {"pinyin": "shū yíng", "meaning": "比赛的失败和胜利", "wordGroups": ["不怕输赢", "输赢结果", "看淡输赢"], "sentence": "比赛不能只看输赢"},
    "练": {"pinyin": "liàn", "meaning": "反复学习或做，使自己更熟", "wordGroups": ["练习", "训练", "练字"], "sentence": "每天练习会进步"},
    "读": {"pinyin": "dú", "meaning": "看着文字念出来或理解文字", "wordGroups": ["读书", "认读", "朗读"], "sentence": "请读出这个字"},
    "认": {"pinyin": "rèn", "meaning": "分辨、认识", "wordGroups": ["认识", "认读", "认真"], "sentence": "我认识这个字"},
    "写": {"pinyin": "xiě", "meaning": "用笔记录字或话", "wordGroups": ["写字", "书写", "写出"], "sentence": "请写出答案"},
    "词": {"pinyin": "cí", "meaning": "由字组成、有意义的语言单位", "wordGroups": ["词语", "组词", "生词"], "sentence": "请读这个词语"},
    "句": {"pinyin": "jù", "meaning": "一句话，能表达完整意思", "wordGroups": ["句子", "造句", "短句"], "sentence": "这个句子很短"},
    "桥": {"pinyin": "qiáo", "meaning": "架在水上或空中供人通行的建筑", "wordGroups": ["小桥", "大桥", "桥上"], "sentence": "小桥下面有流水"},
    "境": {"pinyin": "jìng", "meaning": "地方、情况或周围的状态", "wordGroups": ["环境", "语境", "情境"], "sentence": "理解词语要放在语境里"},
    "河": {"pinyin": "hé", "meaning": "天然或人工的水道", "wordGroups": ["小河", "河水", "河边"], "sentence": "小河慢慢流过村子"},
    "路": {"pinyin": "lù", "meaning": "人或车走的道路", "wordGroups": ["道路", "马路", "走路"], "sentence": "上学路上要小心"},
    "桌": {"pinyin": "zhuō", "meaning": "放东西或写字用的家具", "wordGroups": ["桌子", "书桌", "课桌"], "sentence": "书放在课桌上"},
    "尺": {"pinyin": "chǐ", "meaning": "量长度的工具", "wordGroups": ["尺子", "直尺", "米尺"], "sentence": "用尺子画线"},
    "书": {"pinyin": "shū", "meaning": "装订成册的读物", "wordGroups": ["书本", "读书", "书包"], "sentence": "我喜欢读书"},
    "包": {"pinyin": "bāo", "meaning": "装东西的袋子，也表示包起来", "wordGroups": ["书包", "包子", "背包"], "sentence": "我把书放进书包"},
    "学": {"pinyin": "xué", "meaning": "学习，获得知识", "wordGroups": ["学习", "学校", "数学"], "sentence": "我喜欢学习"},
    "校": {"pinyin": "xiào", "meaning": "学校，也表示校正", "wordGroups": ["学校", "校园", "校门"], "sentence": "我们走进学校"},
    "师": {"pinyin": "shī", "meaning": "老师，教人知识的人", "wordGroups": ["老师", "师生", "教师"], "sentence": "老师教我们读书"},
    "友": {"pinyin": "yǒu", "meaning": "朋友，友好的人", "wordGroups": ["朋友", "友好", "好友"], "sentence": "我和朋友一起读书"},
    "该": {"pinyin": "gāi", "meaning": "应当，也指这、那个", "wordGroups": ["应该", "该做", "该走"], "sentence": "上课铃响了，该回教室了"},
    "刻": {"pinyin": "kè", "meaning": "时间的一小段，也表示雕刻或认真", "wordGroups": ["立刻", "时刻", "刻苦"], "sentence": "小兔立刻向前跑"},
    "放": {"pinyin": "fàng", "meaning": "把东西安置在某处或松开", "wordGroups": ["放下", "放心", "开放"], "sentence": "他把书放在桌上"},
    "收": {"pinyin": "shōu", "meaning": "把东西拿回或整理起来", "wordGroups": ["收拾", "收到", "丰收"], "sentence": "下课后收好文具"},
    "坚持": {"pinyin": "jiān chí", "meaning": "一直做下去，不轻易放弃", "wordGroups": ["坚持练习", "坚持到底", "继续坚持"], "sentence": "乌龟坚持走到终点"},
    "终点": {"pinyin": "zhōng diǎn", "meaning": "比赛或路程结束的地方", "wordGroups": ["到达终点", "终点线", "跑到终点"], "sentence": "终点就在前面"},
    "骄傲": {"pinyin": "jiāo ào", "meaning": "自满，看不起别人；也可表示自豪", "wordGroups": ["不能骄傲", "骄傲自满", "感到骄傲"], "sentence": "小兔太骄傲了"},
}


def normalize_selected_pattern(payload, pattern_id):
    incoming = payload.get("selectedPattern") or payload.get("pattern")
    if isinstance(incoming, dict):
        display_zh = str(incoming.get("displayZh") or incoming.get("displayFormulaZh") or "").strip()
        display_en = str(incoming.get("displayEn") or incoming.get("displayFormulaEn") or "").strip()
        explanation = str(incoming.get("explanationZh") or "").strip()
        seeds = incoming.get("exampleSeeds") if isinstance(incoming.get("exampleSeeds"), list) else []
        if pattern_id and (display_zh or display_en) and seeds:
            return {
                "id": pattern_id,
                "displayZh": display_zh,
                "displayEn": display_en,
                "displayFormulaZh": display_zh,
                "displayFormulaEn": display_en,
                "explanationZh": explanation,
                "sourceTags": incoming.get("sourceTags") if isinstance(incoming.get("sourceTags"), list) else [],
                "exampleSeeds": seeds[:12],
                "sourceExamples": incoming.get("sourceExamples", []) if isinstance(incoming.get("sourceExamples"), list) else [],
            }
    legacy = SERVER_BLOCK_PATTERNS.get(pattern_id)
    if legacy:
        return {
            "id": pattern_id,
            "displayZh": legacy.get("displayFormulaZh", ""),
            "displayEn": legacy.get("displayFormulaEn", ""),
            "displayFormulaZh": legacy.get("displayFormulaZh", ""),
            "displayFormulaEn": legacy.get("displayFormulaEn", ""),
            "explanationZh": legacy.get("explanationZh", ""),
            "sourceTags": [],
            "exampleSeeds": [{"english": item, "chinese": "", "source": "Legacy"} for item in legacy.get("sourceExamples", [])],
            "sourceExamples": legacy.get("sourceExamples", []),
        }
    return None


def read_env_key():
    try:
        with open(ENV_FILE, "r", encoding="utf-8") as handle:
            for line in handle:
                key, _, value = line.strip().partition("=")
                if key == "DEEPSEEK_API_KEY":
                    return value.strip().strip('"').strip("'")
    except OSError:
        return ""
    return ""


def read_env_value(name):
    try:
        with open(ENV_FILE, "r", encoding="utf-8") as handle:
            for line in handle:
                key, _, value = line.strip().partition("=")
                if key == name:
                    return value.strip().strip('"').strip("'")
    except OSError:
        return ""
    return ""


def resolve_api_path(raw_path):
    parsed = urlparse(raw_path)
    if parsed.path not in {"/api/index", "/api/index.py"}:
        return parsed.path
    forwarded = unquote((parse_qs(parsed.query).get("path") or [""])[0]).strip("/")
    return f"/api/{forwarded}" if forwarded else parsed.path


def get_openai_api_key():
    key = os.environ.get("OPENROUTER_API_KEY", "").strip() or read_env_value("OPENROUTER_API_KEY")
    key = key or os.environ.get("OPENAI_API_KEY", "").strip() or read_env_value("OPENAI_API_KEY")
    if key:
        return key
    try:
        with open(OPENAI_API_KEY_FILE, "r", encoding="utf-8") as handle:
            return handle.read().strip()
    except OSError:
        return ""


def load_color_register():
    with open(COLOR_REGISTER_PATH, "r", encoding="utf-8") as handle:
        register = json.load(handle)
    colors = register.get("colors") if isinstance(register, dict) else None
    if register.get("registryId") != "zhangwo-120-soft-tip-acrylic" or not isinstance(colors, list) or len(colors) != 120:
        raise ValueError("120色色号库不可用。")
    normalized = []
    seen = set()
    for item in colors:
        code = str(item.get("code") or "").strip()
        name = str(item.get("nameZh") or "").strip()
        if not code or not name or code in seen:
            raise ValueError("120色色号库不可用。")
        seen.add(code)
        normalized.append({"code": code, "nameZh": name})
    return normalized


def validate_color_image_request(payload):
    if not isinstance(payload, dict) or payload.get("schemaVersion") != "helen-color-reference-request/1":
        raise ValueError("参考图请求格式不正确。")
    profile = payload.get("analysisProfile") or {}
    if not isinstance(profile, dict):
        raise ValueError("分析设置格式不正确。")
    model_tier = str(profile.get("modelTier") or "luna").strip().lower()
    reasoning_effort = str(profile.get("reasoningEffort") or "medium").strip().lower()
    if model_tier not in OPENAI_VISION_MODELS:
        raise ValueError("不支持所选视觉模型。")
    if reasoning_effort not in OPENAI_VISION_EFFORTS:
        raise ValueError("不支持所选推理强度。")
    image = payload.get("image")
    if not isinstance(image, dict):
        raise ValueError("请选择参考图。")
    mime = str(image.get("mimeType") or "").lower().strip()
    allowed = {"image/jpeg", "image/png", "image/webp"}
    if mime not in allowed:
        raise ValueError("仅支持JPG、PNG或WebP图片。")
    encoded = str(image.get("dataBase64") or "").strip()
    if not encoded or len(encoded) > COLOR_IMAGE_REQUEST_MAX_BYTES:
        raise ValueError("参考图过大，请压缩后重试。")
    try:
        raw = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error) as exc:
        raise ValueError("参考图数据损坏。") from exc
    if not raw or len(raw) > COLOR_IMAGE_MAX_DECODED_BYTES:
        raise ValueError("参考图过大，请压缩后重试。")
    detected = ""
    if raw.startswith(b"\xff\xd8\xff"):
        detected = "image/jpeg"
    elif raw.startswith(b"\x89PNG\r\n\x1a\n"):
        detected = "image/png"
    elif len(raw) >= 12 and raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
        detected = "image/webp"
    if detected != mime:
        raise ValueError("参考图格式与文件内容不一致。")
    return {
        "mimeType": mime,
        "base64": encoded,
        "bytes": raw,
        "sha256": hashlib.sha256(raw).hexdigest(),
        "modelTier": model_tier,
        "reasoningEffort": reasoning_effort,
    }


def build_color_reference_prompt(register):
    palette = "、".join(f"{item['code']} {item['nameZh']}" for item in register)
    return f"""
你是一名专业动漫插画与丙烯马克笔教师。分析图片中最大的单幅可临摹作品，为掌握120色直液式软头丙烯马克笔课程提取结构化变量。
如果图片包含多个同等重要作品、不是绘画参考、主体无法辨认或清晰度不足，将 usable 设为 false，并用一句中文说明 rejectionReasonZh。
不要写完整课程，不要输出SVG或HTML。所有坐标使用0到1000的原图归一化坐标。
objects 最多12个；bbox为[x,y,width,height]；primitive只能是ellipse、rect、polygon。
paletteTargets按实际用途分组，最多10组。每组只能从给定色库选择1到2个候选色号；黑色、白色等明确颜色只选1个。
overlays只允许 position、skeleton、occlusion、lineart、colorRegions 五层。图元type只能是rect、ellipse、line、polyline、polygon；每层最多20个图元。
titleZh不超过12个汉字。所有学生可见文字使用专业、直接的语言，不出现“孩子”“小朋友”“请家长帮助”。

只输出以下JSON结构：
{{
  "schemaVersion":"helen-color-reference-analysis/1",
  "usable":true,
  "rejectionReasonZh":"",
  "titleZh":"",
  "aspectRatio":0.67,
  "lightingDirectionZh":"",
  "objects":[{{"id":"subject","labelZh":"主体","primitive":"ellipse","bbox":[100,100,500,600],"depth":2}}],
  "paletteTargets":[{{"id":"background_main","roleZh":"背景主色","targetColorZh":"蓝色","targetHex":"#4477AA","candidates":["B028","B215"]}}],
  "overlays":{{
    "position":[{{"type":"rect","x":100,"y":100,"width":500,"height":600,"labelZh":"主体范围"}}],
    "skeleton":[{{"type":"ellipse","cx":350,"cy":300,"rx":180,"ry":150,"labelZh":"头部"}}],
    "occlusion":[{{"type":"polygon","points":[[100,100],[200,100],[180,200]],"labelZh":"前景","depth":3}}],
    "lineart":[{{"type":"polyline","points":[[100,100],[150,120],[200,180]],"labelZh":"外轮廓"}}],
    "colorRegions":[{{"type":"polygon","points":[[100,100],[200,100],[180,200]],"targetId":"background_main"}}]
  }}
}}

允许使用的120色色号：{palette}
""".strip()


def resolve_color_reference_route(model_tier, reasoning_effort):
    tier = str(model_tier or "").strip().lower()
    effort = str(reasoning_effort or "").strip().lower()
    if tier not in OPENAI_VISION_MODELS or tier not in OPENAI_VISION_PRO_MODELS:
        raise ValueError("不支持所选视觉模型。")
    if effort not in OPENAI_VISION_EFFORTS:
        raise ValueError("不支持所选推理强度。")
    if effort == "max":
        return {
            "model": OPENAI_VISION_PRO_MODELS[tier],
            "reasoning": {"mode": "pro"},
            "route": "pro",
        }
    return {
        "model": OPENAI_VISION_MODELS[tier],
        "reasoning": {"effort": effort},
        "route": "standard",
    }


def call_openai_color_reference_model(api_key, image, register, *, request_id, model, reasoning_effort, reasoning_config=None):
    prompt = build_color_reference_prompt(register)
    max_output_tokens = (
        OPENAI_VISION_MAX_REASONING_OUTPUT_TOKENS
        if reasoning_effort == "max"
        else OPENAI_VISION_MAX_OUTPUT_TOKENS
    )
    body = {
        "model": model,
        "reasoning": reasoning_config or ({"mode": "pro"} if reasoning_effort == "max" else {"effort": reasoning_effort}),
        "input": [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {"type": "input_image", "image_url": f"data:{image['mimeType']};base64,{image['base64']}"},
            ],
        }],
        "max_output_tokens": max(1, max_output_tokens),
    }
    request = Request(
        OPENAI_RESPONSES_URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://supvive.github.io/helen-learning-planet/",
            "X-Title": "Helen Learning Planet",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=max(1, OPENAI_VISION_TIMEOUT_MS / 1000), context=SSL_CONTEXT) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = ""
        try:
            error = json.loads(exc.read().decode("utf-8", errors="replace"))
            detail = str((error.get("error") or {}).get("message") or "")[:500]
        except Exception:
            detail = str(exc)
        stage = classify_color_reference_provider_stage(exc.code, detail)
        raise AIStageError(
            stage,
            detail or str(exc),
            user_message=color_reference_provider_message(stage, detail, reasoning_effort),
            status=http_status_for_ai_stage(stage),
            feature="color_reference",
        ) from exc
    except TimeoutError as exc:
        raise AIStageError("timeout", str(exc), user_message="参考图分析超时，请重试。", status=504, feature="color_reference") from exc
    except URLError as exc:
        raise AIStageError("network", str(exc), user_message="参考图分析服务连接失败。", status=502, feature="color_reference") from exc
    log_ai_stage(
        "COLOR_REFERENCE_PROVIDER_RESPONSE",
        request_id,
        responseKeys=provider_response_keys(data),
        responseShape=provider_response_shape(data),
        truncated=str(is_provider_response_truncated(data)).lower(),
    )
    text = collect_responses_output_text(data)
    if not text:
        stage = "response_truncated" if is_provider_response_truncated(data) else "response_empty"
        message = "参考图分析被模型截断，请重试。" if stage == "response_truncated" else "模型没有返回分析内容，请重试。"
        raise AIStageError(stage, "OpenAI response contained no assistant text", user_message=message, status=502, feature="color_reference")
    try:
        parsed = safeParseAIResponse(text)
    except json.JSONDecodeError as exc:
        # A provider may report a length/incomplete finish reason because
        # hidden reasoning reached its budget even though visible JSON is
        # complete.  Parse first; only classify as truncation when JSON is
        # actually incomplete.  This keeps a valid result from being thrown
        # away merely because of provider metadata.
        if is_provider_response_truncated(data):
            raise AIStageError("response_truncated", "OpenAI response was incomplete", user_message="参考图分析被模型截断，请重试。", status=502, raw_output=text[:1], feature="color_reference") from exc
        raise AIStageError("json_parse", str(exc), user_message="参考图分析结果格式异常，请重试。", status=502, raw_output=text[:1], feature="color_reference") from exc
    return parsed, data.get("usage") or {}


def collect_message_content_text(value):
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return "".join(collect_message_content_text(item) for item in value).strip()
    if not isinstance(value, dict):
        return ""
    if value.get("type") in {"output_text", "text"} and isinstance(value.get("text"), str):
        return value["text"]
    if isinstance(value.get("content"), (str, list, dict)):
        return collect_message_content_text(value["content"])
    return ""


def collect_responses_output_text(data):
    direct = data.get("output_text") if isinstance(data, dict) else None
    if isinstance(direct, str) and direct.strip():
        return direct.strip()
    chunks = []
    for item in data.get("output", []) if isinstance(data, dict) else []:
        for content in item.get("content", []) if isinstance(item, dict) else []:
            if isinstance(content, dict) and content.get("type") == "output_text" and isinstance(content.get("text"), str):
                chunks.append(content["text"])
    if chunks:
        return "".join(chunks).strip()
    for choice in data.get("choices", []) if isinstance(data, dict) else []:
        message = choice.get("message") if isinstance(choice, dict) else None
        if not isinstance(message, dict):
            continue
        content = collect_message_content_text(message.get("content"))
        if content:
            return content
        text = collect_message_content_text(message.get("text"))
        if text:
            return text
    return "".join(chunks).strip()


def is_provider_response_truncated(data):
    if not isinstance(data, dict):
        return False
    if data.get("status") == "incomplete":
        return True
    details = data.get("incomplete_details")
    if isinstance(details, dict) and details.get("reason") in {"max_output_tokens", "length"}:
        return True
    for item in data.get("output", []) if isinstance(data.get("output"), list) else []:
        if isinstance(item, dict) and item.get("status") == "incomplete":
            return True
    for choice in data.get("choices", []) if isinstance(data.get("choices"), list) else []:
        if isinstance(choice, dict) and choice.get("finish_reason") in {"length", "max_tokens"}:
            return True
    return False


def provider_response_keys(data):
    return ",".join(sorted(str(key) for key in data.keys())[:20]) if isinstance(data, dict) else "non_object"


def provider_response_shape(data):
    if not isinstance(data, dict):
        return "non_object"
    if isinstance(data.get("output_text"), str):
        return "responses.output_text"
    if isinstance(data.get("output"), list):
        return "responses.output"
    if isinstance(data.get("choices"), list):
        return "chat.choices"
    return "unknown"


def classify_color_reference_provider_stage(status_code, detail=""):
    message = str(detail or "").lower()
    # OpenRouter reports region/model routing restrictions as 401/403 too.
    # Classify the provider's actionable reason before treating the response
    # as an invalid application credential.
    if any(token in message for token in ("not available in your region", "not available in this region", "model is not available", "model unavailable", "unsupported model")):
        return "model_unavailable"
    if status_code in {401, 403}:
        return "auth"
    if status_code in {402, 429} or any(token in message for token in ("quota", "credit", "rate limit", "insufficient")):
        return "quota_or_permission"
    if status_code in {400, 404} and any(token in message for token in ("model", "reasoning", "effort", "unsupported", "not found")):
        return "model_unavailable"
    if status_code in {408, 504}:
        return "timeout"
    return "provider_call"


def color_reference_provider_message(stage, detail="", reasoning_effort="medium"):
    message = str(detail or "").lower()
    if stage == "model_unavailable" and any(token in message for token in ("not available in your region", "not available in this region")):
        return "当前模型在 OpenRouter 所在区域不可用，请在 OpenRouter 选择可用的模型路由后重试。"
    if stage == "model_unavailable" and reasoning_effort == "max" and any(token in message for token in ("reasoning", "effort", "max", "unsupported")):
        return "当前模型不支持最高推理，请选择其他模型或降低推理强度后重试。"
    return {
        "auth": "参考图分析授权不可用，请检查服务配置。",
        "quota_or_permission": "参考图分析额度或权限受限，请稍后重试或联系管理员。",
        "model_unavailable": "当前参考图模型暂不可用，请选择其他模型后重试。",
        "timeout": "参考图分析超时，请重试。",
        "provider_call": "参考图分析服务暂时不可用，请稍后重试。",
    }.get(stage, "参考图分析服务暂时不可用，请稍后重试。")


def sanitize_openai_usage(usage):
    if not isinstance(usage, dict):
        return {}
    output = {}
    for source, target in (("input_tokens", "inputTokens"), ("output_tokens", "outputTokens"), ("total_tokens", "totalTokens")):
        value = usage.get(source)
        if isinstance(value, int) and 0 <= value <= 10000000:
            output[target] = value
    return output


def clean_color_text(value, max_length):
    text = re.sub(r"<[^>]*>|javascript\s*:", "", str(value or ""), flags=re.I)
    text = re.sub(r"\s+", " ", text).strip()
    text = text.replace("孩子", "学生").replace("小朋友", "学生").replace("请家长帮助", "")
    return text[:max_length]


def clamp_color_number(value):
    try:
        return round(max(0.0, min(1000.0, float(value))), 2)
    except (TypeError, ValueError):
        raise ValueError("参考图坐标不正确。")


def sanitize_color_bbox(value):
    if not isinstance(value, list) or len(value) != 4:
        raise ValueError("参考图对象范围不正确。")
    x, y, width, height = [clamp_color_number(item) for item in value]
    if width <= 0 or height <= 0:
        raise ValueError("参考图对象范围不正确。")
    return [x, y, min(width, 1000 - x), min(height, 1000 - y)]


def sanitize_overlay_primitive(item, palette_ids):
    if not isinstance(item, dict) or item.get("type") not in {"rect", "ellipse", "line", "polyline", "polygon"}:
        raise ValueError("辅助图形类型不正确。")
    kind = item["type"]
    output = {"type": kind}
    keys = {
        "rect": ("x", "y", "width", "height"),
        "ellipse": ("cx", "cy", "rx", "ry"),
        "line": ("x1", "y1", "x2", "y2"),
    }.get(kind, ())
    for key in keys:
        output[key] = clamp_color_number(item.get(key))
    if kind in {"polyline", "polygon"}:
        points = item.get("points")
        if not isinstance(points, list) or not 2 <= len(points) <= 30:
            raise ValueError("辅助图形坐标不正确。")
        output["points"] = [[clamp_color_number(pair[0]), clamp_color_number(pair[1])] for pair in points if isinstance(pair, list) and len(pair) == 2]
        if len(output["points"]) != len(points):
            raise ValueError("辅助图形坐标不正确。")
    label = clean_color_text(item.get("labelZh"), 24)
    if label:
        output["labelZh"] = label
    target_id = str(item.get("targetId") or "").strip()
    if target_id:
        if target_id not in palette_ids:
            raise ValueError("辅助图形引用了未知色区。")
        output["targetId"] = target_id
    depth = item.get("depth")
    if isinstance(depth, (int, float)):
        output["depth"] = max(0, min(9, int(depth)))
    return output


def validate_color_reference_analysis(value, register):
    if not isinstance(value, dict) or value.get("schemaVersion") != "helen-color-reference-analysis/1":
        raise AIStageError("schema_validate", "Invalid color analysis schema", user_message="参考图分析结果不完整，请重试。", status=502, feature="color_reference")
    if value.get("usable") is not True:
        reason = clean_color_text(value.get("rejectionReasonZh") or "这张图片暂时无法拆成单幅课程。", 80)
        raise AIStageError("schema_validate", reason, user_message=reason, status=422, feature="color_reference")
    title = clean_color_text(value.get("titleZh"), 18)
    if not title:
        raise AIStageError("schema_validate", "Missing title", user_message="参考图分析结果不完整，请重试。", status=502, feature="color_reference")
    try:
        aspect_ratio = float(value.get("aspectRatio"))
    except (TypeError, ValueError) as exc:
        raise AIStageError("schema_validate", "Invalid aspect ratio", user_message="参考图比例无法识别，请重试。", status=502, feature="color_reference") from exc
    if not 0.1 <= aspect_ratio <= 10:
        raise AIStageError("schema_validate", "Invalid aspect ratio", user_message="参考图比例无法识别，请重试。", status=502, feature="color_reference")
    code_names = {item["code"]: item["nameZh"] for item in register}
    targets = []
    palette_ids = set()
    for index, item in enumerate(value.get("paletteTargets") or []):
        if not isinstance(item, dict) or len(targets) >= 10:
            continue
        target_id = re.sub(r"[^a-z0-9_-]", "", str(item.get("id") or f"color_{index + 1}").lower())[:40]
        if not target_id or target_id in palette_ids:
            continue
        candidates = []
        for code in item.get("candidates") or []:
            clean_code = str(code or "").strip()
            if clean_code in code_names and clean_code not in candidates:
                candidates.append(clean_code)
            if len(candidates) == 2:
                break
        target_color = clean_color_text(item.get("targetColorZh"), 24)
        if any(word in target_color for word in ("黑", "白")) and candidates:
            candidates = candidates[:1]
        if not candidates:
            continue
        palette_ids.add(target_id)
        target_hex = str(item.get("targetHex") or "").strip().upper()
        if not re.fullmatch(r"#[0-9A-F]{6}", target_hex):
            target_hex = ""
        targets.append({
            "id": target_id,
            "roleZh": clean_color_text(item.get("roleZh") or target_color, 24),
            "targetColorZh": target_color,
            "targetHex": target_hex,
            "candidates": [{"code": code, "nameZh": code_names[code]} for code in candidates],
        })
    if not targets:
        raise AIStageError("schema_validate", "No valid palette targets", user_message="没有找到可用色号，请换一张更清晰的图片。", status=502, feature="color_reference")
    objects = []
    for index, item in enumerate(value.get("objects") or []):
        if not isinstance(item, dict) or len(objects) >= 12:
            continue
        primitive = item.get("primitive")
        if primitive not in {"ellipse", "rect", "polygon"}:
            continue
        objects.append({
            "id": re.sub(r"[^a-z0-9_-]", "", str(item.get("id") or f"object_{index + 1}").lower())[:40],
            "labelZh": clean_color_text(item.get("labelZh") or f"主体{index + 1}", 24),
            "primitive": primitive,
            "bbox": sanitize_color_bbox(item.get("bbox")),
            "depth": max(0, min(9, int(item.get("depth") or 0))),
        })
    if not objects:
        raise AIStageError("schema_validate", "No valid objects", user_message="没有识别出清晰主体，请换一张图片。", status=502, feature="color_reference")
    overlays = {}
    source_layers = value.get("overlays") if isinstance(value.get("overlays"), dict) else {}
    for layer in ("position", "skeleton", "occlusion", "lineart", "colorRegions"):
        items = source_layers.get(layer) if isinstance(source_layers.get(layer), list) else []
        overlays[layer] = [sanitize_overlay_primitive(item, palette_ids) for item in items[:20]]
    return {
        "schemaVersion": "helen-color-reference-analysis/1",
        "usable": True,
        "titleZh": title,
        "aspectRatio": round(aspect_ratio, 4),
        "lightingDirectionZh": clean_color_text(value.get("lightingDirectionZh"), 40),
        "objects": objects,
        "paletteTargets": targets,
        "overlays": overlays,
    }


def callAI(feature, payload, *, api_key, request_id):
    feature = normalize_ai_feature(feature)
    timings = normalize_ai_timings({"queue_wait_time": 0, "first_token_time": "not_supported"})
    check_ai_circuit(feature)
    try:
        compact_payload = compress_context(feature, payload or {})
        if feature == "daily_practice":
            result = call_openai_practice_model(
                api_key,
                compact_payload.get("sourceText", ""),
                compact_payload.get("practiceData", {}),
                request_id=request_id,
                feature=feature,
                timings=timings,
            )
        elif feature == "english_blocks":
            result = call_english_block_exercise_model(
                api_key,
                compact_payload,
                request_id=request_id,
                feature=feature,
                timings=timings,
            )
        elif feature == "ai_example":
            kind = compact_payload.get("kind")
            if kind == "pattern_examples":
                result = call_english_block_examples_model(
                    api_key,
                    compact_payload,
                    request_id=request_id,
                    feature=feature,
                    timings=timings,
                )
            else:
                result = call_block_example_model(
                    api_key,
                    compact_payload,
                    request_id=request_id,
                    feature=feature,
                    timings=timings,
                )
        elif feature == "chinese_lexicon":
            result = call_chinese_lexicon_model(
                api_key,
                compact_payload,
                request_id=request_id,
                feature=feature,
                timings=timings,
            )
        else:
            raise AIStageError("prompt_build", f"Unknown AI feature: {feature}", status=400, feature=feature)
        timings = normalize_ai_timings(timings)
        if not timings["api_called"]:
            raise AIStageError("fake_ai_detected", "fake_ai_detected", status=500, feature=feature)
        record_ai_circuit_result(feature, True)
        return result, timings
    except AIStageError as exc:
        exc.timings = normalize_ai_timings(timings)
        record_ai_circuit_result(feature, False)
        raise
    except Exception as exc:
        wrapped = AIStageError("unknown", str(exc), status=500, feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        record_ai_circuit_result(feature, False)
        raise wrapped from exc


def normalize_ai_feature(feature):
    aliases = {
        "english_blocks_exercises": "english_blocks",
        "english_blocks_example": "ai_example",
        "english_blocks_pattern_examples": "ai_example",
    }
    return aliases.get(str(feature or "").strip(), str(feature or "").strip())


def check_ai_circuit(feature):
    state = AI_CIRCUIT_STATE.setdefault(feature, {"results": [], "open_until": 0})
    now_ms = int(time.time() * 1000)
    if state.get("open_until", 0) > now_ms:
        exc = AIStageError("circuit_breaker", "circuit_breaker_open", status=503, feature=feature)
        exc.timings = normalize_ai_timings({"queue_wait_time": 0, "first_token_time": "not_supported"})
        raise exc


def record_ai_circuit_result(feature, success):
    state = AI_CIRCUIT_STATE.setdefault(feature, {"results": [], "open_until": 0})
    results = list(state.get("results") or [])
    results.append(bool(success))
    results = results[-CIRCUIT_BREAKER_WINDOW:]
    state["results"] = results
    if len(results) < CIRCUIT_BREAKER_MIN_CALLS:
        return
    fail_rate = sum(1 for item in results if not item) / len(results)
    if fail_rate > CIRCUIT_BREAKER_FAIL_RATE:
        state["open_until"] = int(time.time() * 1000) + CIRCUIT_BREAKER_COOLDOWN_MS


def compress_context(feature, payload):
    payload = dict(payload or {})
    if feature == "daily_practice":
        return {
            "sourceText": preprocess_daily_source_text(payload.get("sourceText", "")),
            "practiceData": compact_practice_data(payload.get("practiceData", {})),
            "minimalContext": True,
        }
    if feature == "english_blocks":
        pattern = payload.get("pattern") or {}
        pattern_id = str(payload.get("patternId") or pattern.get("id") or "").strip()
        allowed_words = get_allowed_words_for_pattern(pattern_id)
        return {
            "patternId": pattern_id,
            "pattern": {
                "id": pattern_id,
                "displayZh": pattern.get("displayZh") or pattern.get("displayFormulaZh") or "",
                "displayEn": pattern.get("displayEn") or pattern.get("displayFormulaEn") or "",
                "explanationZh": pattern.get("explanationZh") or "",
            },
            "selectedTypes": payload.get("selectedTypes", []),
            "count": int(payload.get("count") or payload.get("countPerType") or 3),
            "blockedSentences": [clean_line(str(item)) for item in (payload.get("blockedSentences") or []) if clean_line(str(item))][:12],
            "selectedWords": allowed_words[:24],
            "minimalContext": True,
        }
    if feature == "ai_example":
        pattern = payload.get("pattern") or {}
        return {
            **payload,
            "pattern": {
                "id": pattern.get("id") or payload.get("patternId") or "",
                "displayZh": pattern.get("displayZh") or pattern.get("displayFormulaZh") or "",
                "displayEn": pattern.get("displayEn") or pattern.get("displayFormulaEn") or "",
                "explanationZh": pattern.get("explanationZh") or "",
            },
            "allowedVocabulary": (payload.get("allowedVocabulary") or [])[:40],
            "allowedPatterns": (payload.get("allowedPatterns") or [])[:6],
            "storySentences": [],
            "recentExamples": (payload.get("recentExamples") or [])[-2:],
            "minimalContext": True,
        }
    if feature == "chinese_lexicon":
        return {"text": normalize_chinese_text(payload.get("text") or payload.get("char") or ""), "minimalContext": True}
    return payload


def call_openai_practice_model(api_key, source_text, practice_data=None, *, request_id="", feature="daily_practice", timings=None):
    model = DEEPSEEK_MODEL
    source_excerpt = preprocess_daily_source_text(source_text)
    practice_excerpt = json.dumps(compact_practice_data(practice_data or {}), ensure_ascii=False)[:500]
    prompt = build_ai_prompt(request_id, feature, lambda: f"""
角色：小学语文识字教研。只根据最近5个完整学习日的“通过卡顿发现的生字”字段和网页记录生成8-15分钟识字复习，不生成新阅读文章。
完整学习日必须有用户反馈，且反馈中包含“通过卡顿发现的生字”。不要从阅读正文、参考答案、预测区、课堂总结、情境迁移、助手反馈或全文其他位置推测孩子不会什么字。
证据优先级：明确不会/读错 > 卡顿/猜出/提醒后会 > 刚能独立读出 > 两天以上稳定读对。助手预测不能当事实。
选字：优先真实出错、高频、易混、单字不稳；降低一次性生僻字和无反馈难字。长期混淆如放/收、该/刻要保留。
题型固定：认读约12字；看拼音选字约6题；语境辨字4-6题；词语造句2题。拼音必须带声调，选择题只有一个答案。
认读 items 必须同时给出：pinyin、meaning、commonWord、wordGroups(3-5个常用词)、example。meaning 要适合一年级孩子，wordGroups 必须是真组词，不要写题目说明。
只输出 JSON：
{{
  "sourceDays": [{{"day": "Day 8", "lessonFound": true, "feedbackFound": true}}],
  "learnerSummary": {{"confirmedUnknown": ["叼"], "unstable": ["感"], "confusedPairs": [["放", "收"]], "consolidating": ["输"]}},
  "sections": [
    {{"type": "character_reading", "title": "认读", "items": [{{"character": "叼", "pinyin": "diāo", "meaning": "用嘴夹住或衔住。", "commonWord": "叼起", "wordGroups": ["叼起", "叼走", "叼着"], "example": "小鸟叼起叶子。", "source": "反馈", "selectionReason": "猜读", "status": "unstable"}}]}},
    {{"type": "pinyin_choice", "title": "看拼音选汉字", "items": [{{"pinyin": "kè", "options": ["该", "刻", "孩", "放"], "answer": "刻", "targetCharacter": "刻"}}]}},
    {{"type": "context_choice", "title": "语境辨字", "items": [{{"sentence": "上课铃响了，我立（ ）回到座位。", "options": ["该", "刻"], "answer": "刻"}}]}},
    {{"type": "sentence_making", "title": "词语造句", "items": [{{"word": "及时", "referenceSentence": "谢谢你及时提醒我。"}}]}}
  ],
  "difficulty": {{"easyRatio": 0.6, "mediumRatio": 0.25, "hardRatio": 0.15, "estimatedMinutes": 12}}
}}
网页记录：{practice_excerpt}
最近5天高可信学习证据摘录：
{source_excerpt}
""", timings=timings)
    return call_json_model(
        api_key,
        prompt,
        max_tokens=3000,
        model=model,
        system_prompt="必须严格符合用户给出的字段结构，内容要适合中国一年级学生。",
        validator=lambda parsed: hydrate_daily_practice_plan(validate_daily_practice_plan(parsed)),
        max_retries=0,
        request_id=request_id,
        feature=feature,
        timeout_ms=DAILY_PRACTICE_TIMEOUT_MS,
        timings=timings,
    )


def call_block_example_model(api_key, payload, *, request_id="", feature="ai_example", timings=None):
    target_word = normalize_english_word(payload.get("targetWord", ""))
    display_word = str(payload.get("displayWord", "")).strip()
    meaning = str(payload.get("meaningZh", "")).strip()
    allowed_vocabulary = payload.get("allowedVocabulary", [])[:260]
    allowed_patterns = payload.get("allowedPatterns", [])[:20]
    story_sentences = payload.get("storySentences", [])[:0]
    recent_examples = payload.get("recentExamples", [])[-3:]
    prompt = build_ai_prompt(request_id, feature, lambda: f"""
你是一名负责7岁儿童英语启蒙的老师。请为英语认读卡片生成一个“积木例句”。

这不是原文例句，不能冒充 Story 原文。生成一个短、新、可拆成语言积木的简单句子。

当前认读词：
- targetWord: {target_word}
- displayWord: {display_word}
- 中文释义: {meaning}
- 当前等级: {payload.get("level", "v3.0.0")}
- 孩子年龄: 7岁

硬性要求：
1. 英文 sentence 必须包含 targetWord 对应的当前词形；如果 displayWord 是 I'm、It's、What's、Let's 或 says、teaches、walking、runs 等词形，必须尽量保留该词形。
2. 句子最多12个英文词，不使用复杂从句、虚拟语气、成人化内容。
3. 最多引入1个不在 allowedVocabulary 中的新词。
4. 必须返回自然中文翻译。
5. blocks 必须能按顺序重新组合成完整英文句子。
6. 避免与 recentExamples 完全重复。
7. 只输出 JSON，不输出 Markdown。

允许词汇：
{json.dumps(allowed_vocabulary, ensure_ascii=False)}

可参考句型：
{json.dumps(allowed_patterns, ensure_ascii=False)}

最近生成过的例句：
{json.dumps(recent_examples, ensure_ascii=False)}

返回 JSON 格式：
{{
  "sentence": "Miss Wang is my new English teacher.",
  "translationZh": "王老师是我的新英语老师。",
  "blocks": ["Miss Wang", "is", "my new English teacher."],
  "targetWord": "Miss",
  "pattern": "{{person}} is my {{description}}.",
  "grammarPointZh": "is用于第三人称单数。",
  "newWords": []
}}
""", timings=timings)
    return call_json_model(
        api_key,
        prompt,
        max_tokens=900,
        system_prompt="例句必须适合7岁儿童英语启蒙。",
        max_retries=0,
        request_id=request_id,
        feature=feature,
        timeout_ms=AI_EXAMPLE_TIMEOUT_MS,
        timings=timings,
    )


def call_english_block_examples_model(api_key, payload, *, request_id="", feature="ai_example", timings=None):
    pattern = payload.get("pattern", {})
    count = payload.get("count", 3)
    prompt = build_ai_prompt(request_id, feature, lambda: f"""
你是一名负责7岁中国儿童英语启蒙的老师。请围绕当前句型生成 AI例句。

当前句型：
{json.dumps(pattern, ensure_ascii=False)}

数量：{count}

要求：
1. 当前用户选择的句型是：{pattern.get("displayZh") or pattern.get("displayFormulaZh") or pattern.get("id", "")}
2. 英文结构是：{pattern.get("displayEn") or pattern.get("displayFormulaEn") or ""}
3. 所有例句必须围绕这个句型生成，不要切换到其他句型，不要使用上一轮句型。
4. 这不是原文例句，不能标注或伪装成 Story 原文。
5. 句子短、生活化，适合7岁孩子。
6. 每条例句英文和中文必须一致。
7. 不生成阅读理解、故事复述或长篇解释。
8. 每条例句要给出 blocks，blocks 顺序能拼回完整英文句子。
9. 只输出 JSON，不输出 Markdown。

返回 JSON：
{{
  "examples": [
    {{
      "sentence": "I want to read a book.",
      "translationZh": "我想读一本书。",
      "blocks": ["I", "want to", "read", "a book."]
    }}
  ]
}}
""", timings=timings)
    return call_json_model(
        api_key,
        prompt,
        max_tokens=1200,
        system_prompt="例句必须适合7岁儿童英语启蒙。",
        max_retries=0,
        request_id=request_id,
        feature=feature,
        timeout_ms=AI_EXAMPLE_TIMEOUT_MS,
        timings=timings,
    )


def call_chinese_lexicon_model(api_key, payload, *, request_id="", feature="chinese_lexicon", timings=None):
    text = normalize_chinese_text(payload.get("text") or payload.get("char") or "")
    prompt = build_ai_prompt(request_id, feature, lambda: f"""
请为中国一年级孩子补全一个汉字或词语的学习信息。
对象：{text}
要求：拼音标准带声调；释义简短真实；给3-5个常用组词；给一个短例句。
只输出 JSON：{{"text":"{text}","pinyin":"...","meaning":"...","wordGroups":["...","...","..."],"sentence":"..."}}
""", timings=timings)
    return call_json_model(
        api_key,
        prompt,
        max_tokens=700,
        system_prompt="只输出中文词典 JSON，不能编造罕见解释。",
        validator=validate_chinese_lexicon_ai_result,
        max_retries=0,
        request_id=request_id,
        feature=feature,
        timeout_ms=AI_EXAMPLE_TIMEOUT_MS,
        timings=timings,
    )


def validate_chinese_lexicon_ai_result(result):
    if not isinstance(result, dict):
        raise ModelOutputError("Chinese lexicon result is not an object")
    text = normalize_chinese_text(result.get("text"))
    pinyin = clean_line(str(result.get("pinyin") or ""))
    meaning = clean_line(str(result.get("meaning") or ""))
    words = [clean_line(str(item)) for item in (result.get("wordGroups") or []) if clean_line(str(item))]
    if not text or not pinyin or not meaning or len(words) < 3:
        raise ModelOutputError("Chinese lexicon result incomplete")
    return {
        "text": text,
        "pinyin": pinyin,
        "meaning": meaning,
        "wordGroups": words[:5],
        "sentence": clean_line(str(result.get("sentence") or "")),
        "source": "AI词典补全",
    }


def make_english_block_blueprint_example():
    return json.dumps([
        {"type": "ordering", "targetSentence": "Amy wants to play in the playground.", "sceneTag": "playground"},
        {"type": "fill_blank", "targetSentence": "I want to read a book.", "sceneTag": "classroom"},
        {"type": "translation_build", "targetSentence": "We want to sing together.", "sceneTag": "class"},
        {"type": "choose_correct", "targetSentence": "Helen wants to open her book.", "sceneTag": "school things"},
        {"type": "pattern_replace", "targetSentence": "Miss Wang wants to show the ruler.", "sceneTag": "teacher"},
    ], ensure_ascii=False, indent=2)


def make_english_block_exercise_response_example(payload):
    return json.dumps({
        "id": "batch-...",
        "patternId": str(payload.get("patternId", "")),
        "selectedTypes": payload.get("selectedTypes", []),
        "createdAt": 0,
        "questions": [
            {
                "id": "q1",
                "type": "ordering",
                "targetSentence": "I want to play with Amy.",
                "targetChinese": "我想和 Amy 一起玩。",
                "sceneTag": "play",
                "testedPoint": "want to 后面接动词原形",
                "answerSignature": "want_to:i:play:withamy",
                "slotValues": {"subject": "I", "verb": "play", "object": "with Amy"},
                "instructionZh": "把积木排成一句完整的话",
                "promptZh": "",
                "promptEn": "",
                "requiredBlocks": [],
                "distractorBlocks": [],
                "blocks": ["with Amy.", "want to", "I", "play"],
                "options": [],
                "correctAnswer": ["I", "want to", "play", "with Amy."],
                "explanationZh": "want to 后面接动词原形。",
                "optionRationales": [
                    {"text": "wants to", "isCorrect": False, "errorType": "subject_verb_agreement", "rationaleZh": "I 后面不用 wants to"}
                ],
                "targetPatternId": str(payload.get("patternId", "")),
            }
        ],
    }, ensure_ascii=False, indent=2)


def get_allowed_words_for_pattern(pattern_id):
    common = ["I", "you", "we", "Amy", "Helen", "Miss Wang", "my", "your", "book", "pencil", "ruler", "schoolbag", "eraser"]
    by_pattern = {
        "want_to_do": common + ["want to", "wants to", "read", "play", "draw", "sing", "open", "show", "a book", "with Amy", "together"],
        "subject_want_to_verb": common + ["want to", "wants to", "read", "play", "draw", "sing", "open", "show", "a book", "with Amy", "together"],
        "its_my_thing": common + ["It's", "is", "his", "her"],
        "its_my": common + ["It's", "is", "his", "her"],
        "here_is_my_thing": common + ["Here is", "there is", "this is"],
        "here_is_my": common + ["Here is", "there is", "this is"],
        "this_is_your_thing": common + ["This is", "That is", "your", "my", "seat", "desk", "chair", "bag", "pencil box"],
        "this_that_is_noun": common + ["This is", "That is", "a", "panda", "seat", "desk", "chair"],
        "thing_is_place": common + ["is", "are", "on", "in", "under", "near", "desk", "chair", "box"],
        "schoolbag_place": common + ["is", "are", "on", "in", "under", "near", "desk", "chair", "box"],
        "do_you_like_object": common + ["Do", "like", "likes", "apples", "bread", "zoo"],
    }
    return unique_preserve(by_pattern.get(pattern_id, common))[:36]


def unique_preserve(items):
    seen = set()
    clean = []
    for item in items:
        value = clean_line(str(item))
        key = normalize_sentence_key(value)
        if value and key not in seen:
            seen.add(key)
            clean.append(value)
    return clean


def make_minimal_english_block_exercise_response_example(payload):
    return json.dumps({
        "questions": [
            {
                "type": "ordering",
                "targetSentence": "I want to play with Amy.",
                "targetChinese": "我想和 Amy 一起玩。",
                "answerSignature": "want_to:i:play:withamy",
                "promptZh": "",
                "promptEn": "",
                "blocks": ["with Amy.", "want to", "I", "play"],
                "correctAnswer": ["I", "want to", "play", "with Amy."],
                "options": [],
                "explanationZh": "want to 后面接动词原形。"
            },
            {
                "type": "translation_build",
                "targetSentence": "I want to read a book.",
                "targetChinese": "我想读一本书。",
                "answerSignature": "want_to:i:read:abook",
                "promptZh": "我想读一本书。",
                "blocks": ["read", "your", "I", "a book.", "wants to", "want to"],
                "requiredBlocks": ["I", "want to", "read", "a book."],
                "distractorBlocks": ["your", "wants to"],
                "correctAnswer": ["I", "want to", "read", "a book."],
                "options": [],
                "explanationZh": "I 后面用 want to。"
            }
        ]
    }, ensure_ascii=False, indent=2)


def call_english_block_exercise_model(api_key, payload, *, request_id="", feature="english_blocks", timings=None):
    pattern = payload.get("pattern", {})
    selected_types = payload.get("selectedTypes", [])
    count = payload.get("count", 3)
    blocked_sentences = payload.get("blockedSentences", [])[:12]
    allowed_words = get_allowed_words_for_pattern(str(payload.get("patternId") or pattern.get("id") or ""))
    sentence_count = max(1, len(selected_types) * count)
    prompt = build_ai_prompt(request_id, feature, lambda: f"""
你是7岁儿童英语启蒙老师。只生成英文目标句，不生成题目包装。
句型：{pattern.get("displayZh") or pattern.get("displayFormulaZh") or payload.get("patternId", "")}
英文结构：{pattern.get("displayEn") or pattern.get("displayFormulaEn") or ""}
允许词：{json.dumps(allowed_words[:24], ensure_ascii=False)}
已屏蔽例句：{json.dumps(blocked_sentences, ensure_ascii=False)}
数量：{sentence_count}
要求：句子短、生活化、适合7岁；不重复；不要使用屏蔽句；中文自然准确；只用当前句型。
中译英拼句会由系统本地包装：目标英文句必须包含中文含义里的核心动作和物品词，不要出现中文里有“说/读/拿”等核心意思但英文句缺少 say/read/take 等对应词的情况。
只输出 JSON：{{"sentences":[{{"sentence":"I want to read a book.","translationZh":"我想读一本书。","sceneTag":"classroom"}}]}}
""", timings=timings)
    sentence_plan = call_json_model(
        api_key,
        prompt,
        max_tokens=1600,
        system_prompt="只输出最终 JSON 对象。不要输出题目选项、blocks、解释或 Markdown。",
        validator=lambda parsed: validate_ai_sentence_plan(parsed, sentence_count, blocked_sentences),
        max_retries=0,
        request_id=request_id,
        feature=feature,
        timeout_ms=min(ENGLISH_BLOCKS_TIMEOUT_MS, 60000),
        timings=timings,
    )
    return wrap_ai_sentences_to_exercise_types(sentence_plan, payload, pattern, selected_types, count, blocked_sentences)


def validate_ai_sentence_plan(plan, required_count, blocked_sentences=None):
    if not isinstance(plan, dict) or not isinstance(plan.get("sentences"), list):
        raise ModelOutputError("AI sentence plan missing sentences")
    blocked = {normalize_sentence_key(item) for item in (blocked_sentences or []) if item}
    clean = []
    seen = set()
    for index, item in enumerate(plan.get("sentences") or []):
        if not isinstance(item, dict):
            continue
        sentence = clean_line(str(item.get("sentence") or item.get("targetSentence") or ""))
        translation = clean_line(str(item.get("translationZh") or item.get("targetChinese") or ""))
        key = normalize_sentence_key(sentence)
        if not sentence or not translation or key in seen or key in blocked:
            continue
        if len(tokenize_english_sentence(sentence)) > 12:
            continue
        seen.add(key)
        clean.append({
            "sentence": sentence,
            "translationZh": translation,
            "sceneTag": clean_line(str(item.get("sceneTag") or f"scene-{index + 1}")),
        })
        if len(clean) >= required_count:
            break
    if not clean:
        raise ModelOutputError(f"AI returned {len(clean)} usable sentences; need at least 1")
    return {"sentences": clean}


def wrap_ai_sentences_to_exercise_types(sentence_plan, payload, pattern, selected_types, count, blocked_sentences=None):
    pattern_id = str(payload.get("patternId") or pattern.get("id") or "").strip()
    sentences = list(sentence_plan.get("sentences") or [])
    plan_types = [qtype for qtype in selected_types for _ in range(count)]
    if len(sentences) < len(plan_types):
        sentences = fill_missing_english_block_sentences(pattern_id, sentences, len(plan_types), blocked_sentences)
    if len(sentences) < len(plan_types):
        raise ModelOutputError("Not enough AI sentences to wrap exercises")
    questions = []
    for index, qtype in enumerate(plan_types):
        question = make_local_wrapped_exercise(qtype, sentences[index], pattern_id, pattern, index)
        if question:
            questions.append(question)
    batch = {
        "id": f"batch-{int(time.time() * 1000)}",
        "patternId": pattern_id,
        "selectedTypes": selected_types,
        "createdAt": int(time.time() * 1000),
        "questions": questions,
    }
    validated = validate_english_exercise_batch(batch, pattern_id, selected_types, count, blocked_sentences)
    if not validated:
        raise ModelOutputError("Local exercise wrapping failed validation")
    return validated


def fill_missing_english_block_sentences(pattern_id, sentences, required_count, blocked_sentences=None):
    output = list(sentences or [])
    blocked = {normalize_sentence_key(item) for item in (blocked_sentences or []) if item}
    seen = {normalize_sentence_key(item.get("sentence", "")) for item in output if isinstance(item, dict)}
    for candidate in make_local_sentence_candidates(pattern_id):
        key = normalize_sentence_key(candidate.get("sentence", ""))
        if not key or key in seen or key in blocked:
            continue
        output.append(candidate)
        seen.add(key)
        if len(output) >= required_count:
            break
    return output


def make_local_sentence_candidates(pattern_id):
    pools = {
        "this_is_your_thing": [
            ("This is your pencil.", "这是你的铅笔。"),
            ("This is your book.", "这是你的书。"),
            ("This is your ruler.", "这是你的尺子。"),
            ("This is your schoolbag.", "这是你的书包。"),
            ("This is your eraser.", "这是你的橡皮。"),
            ("This is your desk.", "这是你的课桌。"),
            ("This is your chair.", "这是你的椅子。"),
            ("This is your bag.", "这是你的包。"),
            ("This is your pencil box.", "这是你的文具盒。"),
            ("This is your name card.", "这是你的姓名卡。"),
        ],
        "its_my_thing": [
            ("It's my book.", "这是我的书。"),
            ("It's my ruler.", "这是我的尺子。"),
            ("It's my schoolbag.", "这是我的书包。"),
            ("It's my pencil box.", "这是我的文具盒。"),
            ("It's my desk.", "这是我的课桌。"),
        ],
        "here_is_my_thing": [
            ("Here is my pencil.", "这是我的铅笔。"),
            ("Here is my eraser.", "这是我的橡皮。"),
            ("Here is my desk.", "这是我的课桌。"),
            ("Here is my chair.", "这是我的椅子。"),
            ("Here is my bag.", "这是我的包。"),
        ],
        "subject_want_to_verb": [
            ("I want to read a book.", "我想读一本书。"),
            ("We want to play together.", "我们想一起玩。"),
            ("You want to open your book.", "你想打开你的书。"),
            ("Amy wants to draw a ruler.", "Amy想画一把尺子。"),
            ("Helen wants to sing with Amy.", "Helen想和Amy一起唱歌。"),
        ],
    }
    default_pool = [
        ("This is my book.", "这是我的书。"),
        ("That is your ruler.", "那是你的尺子。"),
        ("Here is my pencil.", "这是我的铅笔。"),
        ("I want to read.", "我想读书。"),
        ("My book is on the desk.", "我的书在课桌上。"),
    ]
    return [
        {"sentence": sentence, "translationZh": translation, "sceneTag": f"local-fill-{index + 1}"}
        for index, (sentence, translation) in enumerate(pools.get(str(pattern_id or ""), default_pool))
    ]


def make_local_wrapped_exercise(qtype, sentence_item, pattern_id, pattern, index):
    sentence = clean_line(sentence_item.get("sentence"))
    translation = clean_line(sentence_item.get("translationZh"))
    correct_blocks = split_english_blocks(sentence)
    slot_values = infer_slot_values(pattern_id, sentence)
    base = {
        "id": f"{pattern_id}-{qtype}-{index + 1}",
        "type": qtype,
        "targetSentence": sentence,
        "targetChinese": translation,
        "sceneTag": sentence_item.get("sceneTag") or f"scene-{index + 1}",
        "testedPoint": pattern.get("explanationZh") or default_explanation_for_pattern(pattern_id),
        "answerSignature": make_pattern_answer_signature(pattern_id, sentence, correct_blocks, slot_values),
        "slotValues": slot_values,
        "instructionZh": "",
        "promptZh": "",
        "promptEn": "",
        "blocks": [],
        "requiredBlocks": [],
        "distractorBlocks": [],
        "options": [],
        "correctAnswer": "",
        "explanationZh": default_explanation_for_pattern(pattern_id),
        "optionRationales": [],
        "targetPatternId": pattern_id,
    }
    if qtype == "ordering":
        return {
            **base,
            "instructionZh": "把英文积木排成一句完整的话",
            "blocks": deterministic_reorder_blocks(correct_blocks, index),
            "correctAnswer": correct_blocks,
        }
    if qtype == "translation_build":
        distractors = derive_translation_distractors(pattern_id, correct_blocks)
        return {
            **base,
            "instructionZh": "看中文，用英文积木拼出句子",
            "promptZh": translation,
            "requiredBlocks": correct_blocks,
            "distractorBlocks": distractors,
            "blocks": deterministic_reorder_blocks([*correct_blocks, *distractors], index),
            "correctAnswer": correct_blocks,
        }
    if qtype == "fill_blank":
        correct = pick_fill_blank_answer(pattern_id, sentence)
        options = derive_fill_blank_options(pattern_id, correct, [])
        prompt_en = sentence.replace(correct, "____", 1) if correct and correct in sentence else sentence
        return {
            **base,
            "instructionZh": "选择合适的积木补全句子",
            "promptEn": prompt_en,
            "options": options,
            "correctAnswer": correct,
            "optionRationales": make_default_option_rationales(options, correct),
        }
    if qtype == "choose_correct":
        options, correct_index = make_sentence_choice_options(pattern_id, sentence, index)
        return {
            **base,
            "instructionZh": "选择正确的英文句子",
            "promptZh": translation,
            "options": options,
            "correctAnswer": str(correct_index),
            "optionRationales": make_default_option_rationales(options, str(correct_index)),
        }
    if qtype == "pattern_replace":
        correct = pick_pattern_replace_answer(pattern_id, sentence)
        options, correct_index = make_phrase_choice_options(pattern_id, correct, index)
        return {
            **base,
            "instructionZh": "选择一个积木，保持句型不变",
            "promptZh": translation,
            "promptEn": make_pattern_replace_prompt(pattern_id, sentence, correct),
            "options": options,
            "correctAnswer": str(correct_index),
            "optionRationales": make_default_option_rationales(options, str(correct_index)),
        }
    return None


def pick_fill_blank_answer(pattern_id, sentence):
    text = clean_line(sentence)
    lowered = text.lower()
    if "wants to" in lowered:
        return "wants to"
    if "want to" in lowered:
        return "want to"
    if "it's my" in lowered or "it is my" in lowered:
        return "my"
    if lowered.startswith("this is your") or lowered.startswith("that is your"):
        return "your"
    if lowered.startswith("here is"):
        return "Here is"
    for prep in ["on", "in", "under", "near"]:
        if re.search(rf"\b{prep}\b", lowered):
            return prep
    if lowered.startswith("do you like"):
        return "Do"
    words = split_english_blocks(text)
    return words[1] if len(words) > 2 else (words[0] if words else "")


def pick_pattern_replace_answer(pattern_id, sentence):
    slots = infer_slot_values(pattern_id, sentence)
    if slots.get("object"):
        return slots["object"]
    if slots.get("thing"):
        return slots["thing"]
    if slots.get("place"):
        return slots["place"]
    if slots.get("verb"):
        return slots["verb"]
    words = split_english_blocks(sentence)
    return words[-1] if words else clean_line(sentence)


def make_sentence_choice_options(pattern_id, sentence, index):
    base = derive_sentence_options(sentence, [])
    options = unique_preserve([sentence, *base])
    if len(options) < 4:
        options = unique_preserve([*options, *make_sentence_variants(pattern_id, sentence)])[:4]
    suffixes = ["now.", "today.", "in class.", "with Amy."]
    for suffix in suffixes:
        if len(unique_preserve(options)) >= 4:
            break
        options.append(f"{sentence.rstrip('.!?')} {suffix}")
    return place_correct_option(options[:4], sentence, index)


def make_phrase_choice_options(pattern_id, correct, index):
    options = unique_preserve([correct, *derive_phrase_distractors(pattern_id, correct)])[:4]
    while len(options) < 4:
        options.append(f"{correct} now")
    return place_correct_option(options[:4], correct, index)


def place_correct_option(options, correct, index):
    options = unique_preserve([correct, *options])
    while len(options) < 4:
        options.append(f"{correct} {len(options) + 1}")
        options = unique_preserve(options)
    options = options[:4]
    target_index = abs(int(index or 0)) % len(options)
    correct_key = normalize_sentence_key(correct)
    current_index = next((idx for idx, item in enumerate(options) if normalize_sentence_key(item) == correct_key), 0)
    options[current_index], options[target_index] = options[target_index], options[current_index]
    return options, target_index


def make_pattern_replace_prompt(pattern_id, sentence, correct):
    if correct and correct in sentence:
        return sentence.replace(correct, "____", 1)
    return sentence


def make_sentence_variants(pattern_id, sentence):
    variants = [
        re.sub(r"\bwant to\b", "wants to", sentence, flags=re.I),
        re.sub(r"\bwants to\b", "want to", sentence, flags=re.I),
        re.sub(r"\bmy\b", "your", sentence, flags=re.I),
        re.sub(r"\byour\b", "my", sentence, flags=re.I),
        re.sub(r"\bis\b", "are", sentence, flags=re.I),
        re.sub(r"\bare\b", "is", sentence, flags=re.I),
        re.sub(r"\bHere is\b", "This is", sentence, flags=re.I),
        re.sub(r"\bIt's\b", "Is", sentence, flags=re.I),
    ]
    return [item for item in variants if normalize_sentence_key(item) != normalize_sentence_key(sentence)]


def derive_phrase_distractors(pattern_id, correct):
    pool = {
        "want_to_do": ["reads", "reading", "want", "wants to"],
        "subject_want_to_verb": ["reads", "reading", "want", "wants to"],
        "its_my_thing": ["your pencil", "my ruler", "is pencil", "his book"],
        "its_my": ["your pencil", "my ruler", "is pencil", "his book"],
        "here_is_my_thing": ["there is", "your ruler", "are my", "this is"],
        "here_is_my": ["there is", "your ruler", "are my", "this is"],
        "thing_is_place": ["are", "under the chair", "on", "your desk"],
        "schoolbag_place": ["are", "under the chair", "on", "your desk"],
        "do_you_like_object": ["likes", "your book", "do like", "my ruler"],
    }.get(str(pattern_id or ""), ["is", "are", "my", "your"])
    return [item for item in pool if normalize_sentence_key(item) != normalize_sentence_key(correct)]


def validate_english_block_examples(result, count):
    examples = result.get("examples") if isinstance(result, dict) else result
    if not isinstance(examples, list):
        return None
    clean = []
    seen = set()
    for index, item in enumerate(examples[:count]):
        if not isinstance(item, dict):
            continue
        sentence = clean_line(str(item.get("sentence") or item.get("english") or ""))
        translation = clean_line(str(item.get("translationZh") or item.get("chinese") or ""))
        blocks = item.get("blocks") if isinstance(item.get("blocks"), list) else []
        blocks = [clean_line(str(block)) for block in blocks if clean_line(str(block))][:7]
        if not sentence or not translation:
            continue
        if normalize_sentence_key(sentence) in seen:
            continue
        if not blocks:
            blocks = split_english_blocks(sentence)
        if not blocks_join_to_sentence(blocks, sentence):
            blocks = split_english_blocks(sentence)
        seen.add(normalize_sentence_key(sentence))
        clean.append({
            "id": str(item.get("id") or f"ai-example-{index + 1}"),
            "sentence": sentence,
            "translationZh": translation,
            "blocks": blocks,
        })
    return clean if clean else None


def validate_daily_practice_plan(plan):
    if not isinstance(plan, dict):
        raise ModelOutputError("Daily practice is not an object")
    if isinstance(plan.get("focus"), dict) and isinstance(plan.get("questions"), list) and plan["questions"]:
        focus = plan["focus"]
        if not isinstance(focus.get("chars"), list) or not focus.get("chars"):
            raise ModelOutputError("Daily practice focus.chars missing")
        return plan
    sections = plan.get("sections")
    if not isinstance(sections, list) or not sections:
        raise ModelOutputError("Daily practice sections missing")
    required = {"character_reading", "pinyin_choice", "context_choice", "sentence_making"}
    found = {section.get("type") for section in sections if isinstance(section, dict) and isinstance(section.get("items"), list) and section.get("items")}
    if not required.intersection(found):
        raise ModelOutputError("Daily practice sections have no usable items")
    return plan


def preprocess_daily_source_text(source_text):
    days = extract_recent_stumble_feedback_days(source_text, limit=5)
    if not days:
        return "最近5天未发现“通过卡顿发现的生字”字段。请仅结合网页记录中的生字本和练习记录出题。"
    chunks = []
    for day in days:
        chunks.append(f"{day['day']} 通过卡顿发现的生字：")
        chunks.extend(day["lines"])
    return "\n".join(chunks)[-1200:]


def extract_recent_stumble_feedback_days(source_text, limit=5):
    lines = [line.strip() for line in str(source_text or "").replace("\r", "\n").splitlines() if line.strip()]
    entries = []
    current = None
    for line in lines:
        day = detect_day_label(line)
        if day:
            current = {"day": day, "lines": [], "has_lesson": True, "has_feedback": False}
            entries.append(current)
        if current is None:
            current = {"day": "未知日期", "lines": [], "has_lesson": False, "has_feedback": False}
            entries.append(current)
        current["lines"].append(line)
        if re.search(r"学习内容|桥梁阅读|融合课|阅读正文|今日课程|Day\s*\d+", line, flags=re.I):
            current["has_lesson"] = True
        if "通过卡顿发现的生字" in line:
            current["has_feedback"] = True
    complete = []
    for entry in entries:
        blocks = extract_stumble_blocks(entry["lines"])
        if entry["has_lesson"] and entry["has_feedback"] and blocks:
            complete.append({"day": entry["day"], "lines": blocks})
    return complete[-limit:]


def detect_day_label(line):
    match = re.search(r"\bDay\s*(\d+)\b", line, flags=re.I) or re.search(r"第\s*(\d+)\s*天", line)
    return f"Day{match.group(1)}" if match else ""


def extract_stumble_blocks(lines):
    output = []
    for index, line in enumerate(lines):
        if not re.match(r"^#{0,6}\s*通过卡顿发现的生字\s*[:：]?\s*", line):
            continue
        first = re.sub(r"^#{0,6}\s*通过卡顿发现的生字\s*[:：]?\s*", "", line).strip()
        if first:
            output.append(first)
        cursor = index + 1
        while cursor < len(lines):
            value = lines[cursor].strip()
            if value and is_feedback_top_level_heading(value):
                break
            if value:
                output.append(value)
            cursor += 1
    return output


def is_feedback_top_level_heading(line):
    text = re.sub(r"^#{1,6}\s*", "", line).strip()
    if not re.search(r"[:：]$", text):
        return False
    if re.match(r"^通过卡顿发现的生字[:：]$", text):
        return False
    return bool(re.match(r"^(家长陪读反馈|孩子体感轻松程度|家长体感轻松程度|第[一二三四五六七八九十\d]+部分|词语积累|阅读理解|课堂总结|小学情境迁移|阅读后的生字预测|生字预测|学生反馈|家长整体反馈|助手反馈|参考答案|今日反馈|反馈表)[:：]$", text))


def unique_text_lines(lines):
    seen = set()
    output = []
    for line in lines:
        key = re.sub(r"\s+", "", line)
        if key and key not in seen:
            seen.add(key)
            output.append(line)
    return output


def compact_practice_data(practice_data):
    if not isinstance(practice_data, dict):
        return {}
    keys = ["recentResults", "characterStats", "dailyStats", "wrongChars", "wordbook", "feedbackDiscoveredItems", "lastFeedbackExtraction", "manualSmoke"]
    return {key: practice_data.get(key) for key in keys if key in practice_data}


def hydrate_daily_practice_plan(plan):
    if not isinstance(plan, dict):
        raise ModelOutputError("Daily practice is not an object")
    hydrated_items = []
    sections = plan.get("sections") if isinstance(plan.get("sections"), list) else []
    for section in sections:
        if not isinstance(section, dict):
            continue
        for item in section.get("items") or []:
            if not isinstance(item, dict):
                continue
            text = item.get("character") or item.get("targetCharacter") or item.get("answer") or item.get("word") or item.get("display")
            hydrated = hydrate_chinese_practice_item(text, item)
            if hydrated and hydrated["type"] == "character":
                if "character" in item or section.get("type") == "character_reading":
                    item["character"] = hydrated["text"]
                item["pinyin"] = item.get("pinyin") or hydrated["pinyin"]
                item["meaning"] = item.get("meaning") or hydrated["meaning"]
                item["wordGroups"] = item.get("wordGroups") or hydrated["wordGroups"]
                item["commonWord"] = item.get("commonWord") or hydrated["wordGroups"][0]
                item["example"] = item.get("example") or hydrated.get("sentence", "")
                item["source"] = hydrated.get("source") or item.get("source") or ""
                hydrated_items.append(hydrated)
            elif hydrated:
                item["pinyin"] = item.get("pinyin") or hydrated["pinyin"]
                item["meaning"] = item.get("meaning") or hydrated["meaning"]
                item["wordGroups"] = item.get("wordGroups") or hydrated["wordGroups"]
                item["source"] = hydrated.get("source") or item.get("source") or ""
                if item.get("word"):
                    hydrated_items.append(hydrated)
    questions = plan.get("questions") if isinstance(plan.get("questions"), list) else []
    for item in questions:
        if not isinstance(item, dict):
            continue
        text = item.get("char") or item.get("display") or item.get("answer")
        hydrated = hydrate_chinese_practice_item(text, item)
        if not hydrated:
            continue
        item["pinyin"] = item.get("pinyin") or hydrated["pinyin"]
        item["meaning"] = item.get("meaning") or hydrated["meaning"]
        item["wordGroups"] = item.get("wordGroups") or hydrated["wordGroups"]
        item["reference"] = item.get("reference") or hydrated.get("sentence", "")
        item["source"] = hydrated.get("source") or item.get("source") or ""
        hydrated_items.append(hydrated)
    plan["chinesePracticeItems"] = dedupe_chinese_items(hydrated_items)
    validate_hydrated_chinese_items(plan["chinesePracticeItems"])
    return plan


def hydrate_chinese_practice_item(text, item=None):
    key = normalize_chinese_text(text)
    if not key:
        return None
    item = item or {}
    lexicon = resolve_chinese_lexicon(key)
    item_word_groups = item.get("wordGroups") if isinstance(item.get("wordGroups"), list) else []
    ai_supplied = bool(item.get("meaning")) and len([value for value in item_word_groups if clean_line(str(value))]) >= 3
    pinyin = clean_line(str(item.get("pinyin") or (lexicon or {}).get("pinyin") or ""))
    meaning = clean_line(str(item.get("meaning") or (lexicon or {}).get("meaning") or ""))
    word_groups = item_word_groups
    word_groups = [clean_line(str(value)) for value in word_groups if clean_line(str(value))]
    if len(word_groups) < 3 and lexicon:
        word_groups = unique_preserve([*word_groups, *((lexicon or {}).get("wordGroups") or [])])
    sentence = clean_line(str(item.get("sentence") or item.get("example") or (lexicon or {}).get("sentence") or ""))
    if not meaning:
        meaning = make_rule_chinese_meaning(key)
    if len(word_groups) < 3:
        word_groups = unique_preserve([*word_groups, *make_rule_word_groups(key)])
    if not pinyin:
        pinyin = clean_line(str(item.get("pinyin") or (lexicon or {}).get("pinyin") or ""))
    if not pinyin:
        pinyin = "待确认"
    return {
        "id": f"{'char' if len(key) == 1 else 'word'}:{key}",
        "text": key,
        "type": "character" if len(key) == 1 else "word",
        "pinyin": pinyin,
        "meaning": meaning,
        "wordGroups": word_groups[:5],
        "sentence": sentence,
        "source": "AI每日生成" if ai_supplied else (lexicon or {}).get("source", "系统规则补全"),
    }


def resolve_chinese_lexicon(key):
    if not key:
        return None
    if key in CHINESE_LEXICON:
        return {**CHINESE_LEXICON[key], "source": "本地中文词库"}
    if len(key) > 1:
        if key in CHINESE_LEXICON:
            return {**CHINESE_LEXICON[key], "source": "本地中文词库"}
        for char in key:
            if char in CHINESE_LEXICON:
                source = CHINESE_LEXICON[char]
                return {
                    "pinyin": source.get("pinyin", ""),
                    "meaning": f"“{key}”是包含“{char}”的练习词语，可结合上下文理解。",
                    "wordGroups": make_rule_word_groups(key),
                    "sentence": f"请认读词语：{key}",
                    "source": "系统规则补全",
                }
    if len(key) == 1:
        return {
            "pinyin": "",
            "meaning": make_rule_chinese_meaning(key),
            "wordGroups": make_rule_word_groups(key),
            "sentence": f"请用“{key}”组词。",
            "source": "系统规则补全",
        }
    return None


def make_rule_chinese_meaning(key):
    if len(key) == 1:
        return f"“{key}”是练习汉字，可通过组词和短句理解。"
    return f"“{key}”是练习词语，可结合短句认读和理解。"


def make_rule_word_groups(key):
    if not key:
        return []
    if key == "输":
        return ["运输", "输入", "输出", "输赢"]
    if len(key) == 1:
        return [f"{key}字", f"{key}词", f"{key}句", f"{key}语"]
    return [key, f"{key}练习", f"{key}短句", f"认读{key}"]


def normalize_chinese_text(value):
    return re.sub(r"[^\u4e00-\u9fff]", "", str(value or ""))


def dedupe_chinese_items(items):
    result = []
    seen = set()
    for item in items:
        if not item or item["id"] in seen:
            continue
        seen.add(item["id"])
        result.append(item)
    return result


def validate_hydrated_chinese_items(items):
    for item in items:
        if not item.get("pinyin") or not item.get("meaning") or len(item.get("wordGroups") or []) < 3:
            raise ModelOutputError(f"Chinese lexical item incomplete: {item.get('text')}")


def count_daily_questions(plan):
    if not isinstance(plan, dict):
        return 0
    if isinstance(plan.get("questions"), list):
        return len(plan["questions"])
    sections = plan.get("sections") if isinstance(plan.get("sections"), list) else []
    return sum(len(section.get("items") or []) for section in sections if isinstance(section, dict))


def validate_english_exercise_batch(batch, pattern_id, selected_types, count, blocked_sentences=None):
    if not isinstance(batch, dict):
        return None
    questions = batch.get("questions")
    if not isinstance(questions, list) or not questions:
        return None
    allowed_types = set(selected_types)
    clean_questions = []
    type_counts = {qtype: 0 for qtype in selected_types}
    max_total = max(1, count) * max(1, len(selected_types))
    blocked = {normalize_sentence_key(item) for item in (blocked_sentences or []) if item}
    seen_targets = set()
    seen_chinese = set()
    seen_answers = set()
    for idx, question in enumerate(questions):
        if not isinstance(question, dict):
            continue
        if len(clean_questions) >= max_total:
            break
        qtype = "translation_build" if question.get("type") == "build_from_chinese" else question.get("type")
        if qtype not in allowed_types:
            continue
        if type_counts.get(qtype, 0) >= count:
            continue
        correct = question.get("correctAnswer")
        if qtype not in {"ordering", "translation_build"} and isinstance(correct, list) and len(correct) == 1:
            correct = correct[0]
        if correct in (None, ""):
            continue
        target_sentence = clean_line(str(question.get("targetSentence") or ""))
        target_chinese = clean_line(str(question.get("targetChinese") or question.get("promptZh") or ""))
        target_key = normalize_sentence_key(target_sentence)
        chinese_key = normalize_sentence_key(target_chinese)
        slot_values = normalize_slot_values(question.get("slotValues"))
        if not slot_values:
            slot_values = infer_slot_values(pattern_id, target_sentence)
        answer_signature = clean_line(str(question.get("answerSignature") or ""))
        answer_signature = make_pattern_answer_signature(pattern_id, target_sentence, correct, slot_values, answer_signature)
        answer_key = normalize_sentence_key(answer_signature)
        if not target_sentence or target_key in blocked or target_key in seen_targets:
            continue
        options = question.get("options") if isinstance(question.get("options"), list) else []
        blocks = question.get("blocks") if isinstance(question.get("blocks"), list) else []
        blocks = [clean_line(str(item)) for item in blocks[:12] if clean_line(str(item))]
        blocks_were_provided = bool(blocks)
        required_blocks = []
        distractor_blocks = []
        if qtype in {"ordering", "translation_build"}:
            correct_blocks = [clean_line(str(item)) for item in correct] if isinstance(correct, list) else split_english_blocks(str(correct))
            if len(correct_blocks) < 2:
                continue
            if blocks == correct_blocks:
                blocks = deterministic_reorder_blocks(correct_blocks, idx)
            if qtype == "ordering" and not same_block_multiset(blocks, correct_blocks):
                continue
            if qtype == "translation_build":
                required_blocks = [clean_line(str(item)) for item in question.get("requiredBlocks", []) if clean_line(str(item))]
                distractor_blocks = [clean_line(str(item)) for item in question.get("distractorBlocks", []) if clean_line(str(item))]
                if not required_blocks:
                    required_blocks = correct_blocks
                if len(distractor_blocks) < 2:
                    continue
                if len(blocks) <= len(correct_blocks):
                    if blocks_were_provided:
                        continue
                    blocks = deterministic_reorder_blocks([*correct_blocks, *distractor_blocks], idx)
                if not validate_build_from_chinese_exercise({
                    **question,
                    "type": "translation_build",
                    "blocks": blocks,
                    "correctAnswer": correct_blocks,
                    "requiredBlocks": required_blocks,
                    "distractorBlocks": distractor_blocks,
                }, pattern_id):
                    continue
        if qtype in {"ordering", "translation_build"} and not blocks:
            continue
        options = [clean_line(str(item)) for item in options[:6] if clean_line(str(item))]
        if qtype == "fill_blank":
            if len(options) < 4:
                options = derive_fill_blank_options(pattern_id, str(correct), options)
            if len(options) != 4:
                continue
            if sum(1 for item in options if normalize_sentence_key(item) == normalize_sentence_key(str(correct))) != 1:
                continue
        if qtype in {"choose_correct", "pattern_replace"}:
            if len(options) < 4 and target_sentence:
                options = derive_sentence_options(target_sentence, options)
            if len(options) != 4:
                continue
            try:
                correct_index = int(correct)
            except (TypeError, ValueError):
                continue
            if correct_index < 0 or correct_index >= len(options):
                continue
            if qtype == "choose_correct" and sum(1 for item in options if looks_like_english_sentence(item)) < 4:
                continue
        draft = {
            "id": str(question.get("id") or f"{pattern_id}-{idx + 1}"),
            "type": qtype,
            "targetSentence": target_sentence,
            "targetChinese": target_chinese,
            "sceneTag": clean_line(str(question.get("sceneTag") or f"scene-{idx + 1}")),
            "testedPoint": clean_line(str(question.get("testedPoint") or "")),
            "answerSignature": answer_signature or format_answer_signature(correct),
            "slotValues": slot_values,
            "instructionZh": str(question.get("instructionZh") or ""),
            "promptZh": str(question.get("promptZh") or ""),
            "promptEn": str(question.get("promptEn") or ""),
            "blocks": blocks,
            "requiredBlocks": required_blocks,
            "distractorBlocks": distractor_blocks,
            "options": options,
            "correctAnswer": correct,
            "explanationZh": str(question.get("explanationZh") or ""),
            "optionRationales": normalize_option_rationales(question.get("optionRationales"), options, correct),
            "targetPatternId": pattern_id,
        }
        if not draft["explanationZh"]:
            draft["explanationZh"] = default_explanation_for_pattern(pattern_id)
        if not draft["optionRationales"] and options:
            draft["optionRationales"] = make_default_option_rationales(options, correct)
        clean_questions.append({**draft})
        seen_targets.add(target_key)
        if chinese_key:
            seen_chinese.add(chinese_key)
        if answer_key:
            seen_answers.add(answer_key)
        type_counts[qtype] = type_counts.get(qtype, 0) + 1
    if any(type_counts.get(qtype, 0) < count for qtype in selected_types):
        return None
    return {
        "id": str(batch.get("id") or f"batch-{int(time.time() * 1000)}"),
        "patternId": pattern_id,
        "selectedTypes": selected_types,
        "createdAt": int(time.time() * 1000),
        "questions": clean_questions,
    }


def normalize_sentence_key(value):
    value = str(value or "").replace("’", "'").lower()
    value = re.sub(r"\s+", " ", value)
    value = re.sub(r"[\s\"“”‘’.,!?;:，。！？；：]+", "", value)
    return value.strip()


def normalize_slot_values(value):
    if not isinstance(value, dict):
        return {}
    return {
        clean_line(str(key)): clean_line(str(item))
        for key, item in value.items()
        if clean_line(str(key)) and clean_line(str(item))
    }


def infer_slot_values(pattern_id, sentence):
    text = clean_line(str(sentence or "")).replace("’", "'")
    lowered = text.lower().rstrip(".!?")
    if lowered.startswith("it's my "):
        return {"thing": clean_line(text[8:].rstrip(".!?"))}
    if lowered.startswith("here is my "):
        return {"thing": clean_line(text[11:].rstrip(".!?"))}
    if lowered.startswith("this is your "):
        return {"thing": clean_line(text[13:].rstrip(".!?"))}
    if lowered.startswith("that is your "):
        return {"thing": clean_line(text[13:].rstrip(".!?"))}
    if lowered.startswith("do you like "):
        return {"object": clean_line(text[12:].rstrip(".!?"))}
    want_match = re.match(r"^(.+?)\s+(want|wants)\s+to\s+([A-Za-z']+)(?:\s+(.+))?$", text.rstrip(".!?"), flags=re.I)
    if want_match:
        return {
            "subject": clean_line(want_match.group(1)),
            "verb": clean_line(want_match.group(3)),
            "object": clean_line(want_match.group(4) or ""),
        }
    place_match = re.match(r"^(.+?)\s+(?:is|are)\s+((?:on|in|under|near)\s+.+)$", text.rstrip(".!?"), flags=re.I)
    if place_match:
        return {
            "thing": clean_line(place_match.group(1)),
            "place": clean_line(place_match.group(2)),
        }
    return {}


def make_pattern_answer_signature(pattern_id, target_sentence, correct, slot_values, fallback=""):
    pid = str(pattern_id or "")
    slots = normalize_slot_values(slot_values)
    if pid in {"its_my", "its_my_thing"} or normalize_sentence_key(target_sentence).startswith("itsmy"):
        thing = slots.get("thing") or infer_slot_values("its_my", target_sentence).get("thing", "")
        return f"its_my:{normalize_sentence_key(thing)}"
    if pid in {"here_is_my", "here_is_my_thing"} or normalize_sentence_key(target_sentence).startswith("hereismy"):
        thing = slots.get("thing") or infer_slot_values("here_is_my", target_sentence).get("thing", "")
        return f"here_is_my:{normalize_sentence_key(thing)}"
    if pid == "this_is_your_thing" or normalize_sentence_key(target_sentence).startswith(("thisisyour", "thatisyour")):
        thing = slots.get("thing") or infer_slot_values("this_is_your_thing", target_sentence).get("thing", "")
        return f"this_is_your:{normalize_sentence_key(thing)}"
    if pid in {"want_to_do", "subject_want_to_verb"} or "wantto" in normalize_sentence_key(target_sentence) or "wantsto" in normalize_sentence_key(target_sentence):
        inferred = infer_slot_values("want_to_do", target_sentence)
        subject = slots.get("subject") or inferred.get("subject", "")
        verb = slots.get("verb") or inferred.get("verb", "")
        obj = slots.get("object") or inferred.get("object", "")
        return f"want_to:{normalize_sentence_key(subject)}:{normalize_sentence_key(verb)}:{normalize_sentence_key(obj)}"
    if pid in {"thing_is_place", "schoolbag_place"}:
        inferred = infer_slot_values("thing_is_place", target_sentence)
        thing = slots.get("thing") or inferred.get("thing", "")
        place = slots.get("place") or inferred.get("place", "")
        return f"thing_is_place:{normalize_sentence_key(thing)}:{normalize_sentence_key(place)}"
    if pid == "do_you_like_object" or normalize_sentence_key(target_sentence).startswith("doyoulike"):
        obj = slots.get("object") or infer_slot_values("do_you_like_object", target_sentence).get("object", "")
        return f"do_you_like:{normalize_sentence_key(obj)}"
    return clean_line(str(fallback or format_answer_signature(correct)))


def same_block_multiset(first, second):
    first_keys = sorted(normalize_sentence_key(item) for item in first)
    second_keys = sorted(normalize_sentence_key(item) for item in second)
    return first_keys == second_keys


def block_key_counts(blocks):
    counts = {}
    for block in blocks or []:
        key = normalize_sentence_key(block)
        if key:
            counts[key] = counts.get(key, 0) + 1
    return counts


def block_bag_contains_all(blocks, required):
    available = block_key_counts(blocks)
    needed = block_key_counts(required)
    return all(available.get(key, 0) >= count for key, count in needed.items())


def join_english_blocks(blocks):
    sentence = " ".join(clean_line(str(item)) for item in blocks or [] if clean_line(str(item)))
    return re.sub(r"\s+([.,!?;:])", r"\1", sentence).strip()


def normalize_sentence_spacing(value):
    value = str(value or "").replace("’", "'").strip().lower()
    value = re.sub(r"\s+", " ", value)
    value = re.sub(r"\s+([.,!?;:])", r"\1", value)
    return value.strip()


def tokenize_english_core(value):
    return re.findall(r"[a-z]+(?:'[a-z]+)?", str(value or "").replace("’", "'").lower())


def target_sentence_covered_by_blocks(target_sentence, correct_blocks):
    target_tokens = tokenize_english_core(target_sentence)
    answer_tokens = tokenize_english_core(join_english_blocks(correct_blocks))
    if not target_tokens or not answer_tokens:
        return False
    answer_counts = {}
    for token in answer_tokens:
        answer_counts[token] = answer_counts.get(token, 0) + 1
    for token in target_tokens:
        if answer_counts.get(token, 0) <= 0:
            return False
        answer_counts[token] -= 1
    return True


def deterministic_reorder_blocks(blocks, salt=0):
    clean = [clean_line(str(item)) for item in blocks if clean_line(str(item))]
    if len(clean) < 2:
        return clean
    shift = 1 + (abs(int(salt or 0)) % (len(clean) - 1))
    reordered = clean[shift:] + clean[:shift]
    if reordered == clean:
        reordered = list(reversed(clean))
    return reordered


def derive_translation_distractors(pattern_id, correct_blocks):
    pool = {
        "want_to_do": ["wants to", "want", "reading", "your", "a ruler."],
        "subject_want_to_verb": ["wants to", "want", "reading", "your", "a ruler."],
        "its_my_thing": ["your", "his", "ruler.", "is"],
        "its_my": ["your", "his", "ruler.", "is"],
        "here_is_my_thing": ["your", "there is", "ruler.", "is"],
        "here_is_my": ["your", "there is", "ruler.", "is"],
        "this_is_your_thing": ["my", "his", "ruler.", "are"],
        "thing_is_place": ["are", "under", "chair.", "your"],
        "schoolbag_place": ["are", "under", "chair.", "your"],
    }.get(str(pattern_id or ""), ["your", "is", "book.", "wants to"])
    correct_keys = {normalize_sentence_key(item) for item in correct_blocks}
    return [item for item in pool if normalize_sentence_key(item) not in correct_keys][:3]


def derive_fill_blank_options(pattern_id, correct, existing):
    pool = {
        "want_to_do": ["want to", "wants to", "want", "wanting to"],
        "subject_want_to_verb": ["want to", "wants to", "want", "wanting to"],
        "its_my_thing": ["my", "your", "his", "her"],
        "this_is_your_thing": ["your", "my", "his", "her"],
        "here_is_my_thing": ["Here is", "This is", "There is", "Here are"],
        "thing_is_place": ["on", "in", "under", "near"],
    }.get(str(pattern_id or ""), [correct, "is", "are", "my"])
    return unique_preserve([correct, *existing, *pool])[:4]


def derive_sentence_options(target_sentence, existing):
    sentence = clean_line(str(target_sentence))
    variants = [
        sentence,
        re.sub(r"\bwant to\b", "wants to", sentence, flags=re.I),
        re.sub(r"\bwants to\b", "want to", sentence, flags=re.I),
        re.sub(r"\bmy\b", "your", sentence, flags=re.I),
        re.sub(r"\byour\b", "my", sentence, flags=re.I),
        re.sub(r"\bThis is\b", "That is", sentence, flags=re.I),
        re.sub(r"\bThis is\b", "This are", sentence, flags=re.I),
        re.sub(r"\bis\b", "are", sentence, flags=re.I),
    ]
    return unique_preserve([*existing, *variants])[:4]


def default_explanation_for_pattern(pattern_id):
    return {
        "want_to_do": "want to 后面接动词原形。",
        "subject_want_to_verb": "want to 后面接动词原形。",
        "its_my_thing": "my 表示“我的”。",
        "this_is_your_thing": "your 表示“你的”。",
        "here_is_my_thing": "Here is 用来介绍眼前的东西。",
        "thing_is_place": "is 后面可以说明位置。",
        "schoolbag_place": "is 后面可以说明位置。",
    }.get(str(pattern_id or ""), "注意句型顺序和关键词。")


def make_default_option_rationales(options, correct):
    correct_text = ""
    if isinstance(correct, int) or str(correct).isdigit():
        idx = int(correct)
        correct_text = options[idx] if 0 <= idx < len(options) else ""
    else:
        correct_text = str(correct)
    return [
        {
            "text": option,
            "isCorrect": normalize_sentence_key(option) == normalize_sentence_key(correct_text),
            "errorType": "" if normalize_sentence_key(option) == normalize_sentence_key(correct_text) else "wrong_structure",
            "rationaleZh": "" if normalize_sentence_key(option) == normalize_sentence_key(correct_text) else "结构或意思不匹配。",
        }
        for option in options
    ]


def validate_build_from_chinese_exercise(exercise, pattern_id=""):
    if exercise.get("type") not in {"translation_build", "build_from_chinese"}:
        return True
    target_sentence = clean_line(str(exercise.get("targetSentence") or ""))
    target_chinese = clean_line(str(exercise.get("targetChinese") or exercise.get("promptZh") or ""))
    required = [clean_line(str(item)) for item in exercise.get("requiredBlocks", []) if clean_line(str(item))]
    distractors = [clean_line(str(item)) for item in exercise.get("distractorBlocks", []) if clean_line(str(item))]
    blocks = [clean_line(str(item)) for item in exercise.get("blocks", []) if clean_line(str(item))]
    correct = [clean_line(str(item)) for item in exercise.get("correctAnswer", []) if clean_line(str(item))]
    if not target_sentence or not target_chinese:
        return False
    if not required or not same_block_multiset(required, correct):
        return False
    if len(distractors) < 2:
        return False
    if len(blocks) <= len(correct):
        return False
    if not block_bag_contains_all(blocks, correct):
        return False
    if not block_bag_contains_all(blocks, required):
        return False
    if not block_bag_contains_all(blocks, distractors):
        return False
    joined_answer = join_english_blocks(correct)
    if normalize_sentence_spacing(joined_answer) != normalize_sentence_spacing(target_sentence):
        return False
    if normalize_sentence_key(joined_answer) != normalize_sentence_key(target_sentence):
        return False
    if not target_sentence_covered_by_blocks(target_sentence, correct):
        return False
    if [normalize_sentence_key(item) for item in blocks[:len(correct)]] == [normalize_sentence_key(item) for item in correct]:
        return False
    return validate_distractor_quality(pattern_id, distractors)


def validate_distractor_quality(pattern_id, distractors):
    keys = {normalize_sentence_key(item) for item in distractors}
    obviously_unrelated = {"zoo", "happy", "run", "elephant"}
    if keys and keys.issubset(obviously_unrelated):
        return False
    allowed = {
        "its_my": {"your", "her", "his", "ruler", "ruler.", "book", "book.", "eraser", "eraser.", "schoolbag", "schoolbag.", "is"},
        "its_my_thing": {"your", "her", "his", "ruler", "ruler.", "book", "book.", "eraser", "eraser.", "schoolbag", "schoolbag.", "is"},
        "this_is_your_thing": {"my", "her", "his", "ruler", "ruler.", "book", "book.", "eraser", "eraser.", "schoolbag", "schoolbag.", "are"},
        "here_is_my": {"your", "her", "his", "there", "this", "ruler", "ruler.", "book", "book.", "eraser", "eraser.", "schoolbag", "schoolbag.", "is"},
        "here_is_my_thing": {"your", "her", "his", "there", "this", "ruler", "ruler.", "book", "book.", "eraser", "eraser.", "schoolbag", "schoolbag.", "is"},
        "want_to_do": {"want", "wants to", "wanting to", "eat", "eats", "read", "reads", "reading", "play", "plays", "book", "a book.", "bread", "some bread."},
        "subject_want_to_verb": {"want", "wants to", "wanting to", "eat", "eats", "read", "reads", "reading", "play", "plays", "book", "a book.", "bread", "some bread."},
        "thing_is_place": {"on", "in", "under", "near", "is", "are", "desk", "the desk.", "schoolbag", "book", "ruler"},
        "schoolbag_place": {"on", "in", "under", "near", "is", "are", "desk", "the desk.", "schoolbag", "book", "ruler"},
        "do_you_like_object": {"my", "your", "like", "likes", "book", "books", "ruler", "pencil", "eraser"},
    }.get(str(pattern_id or ""), set())
    if allowed and not any(normalize_sentence_key(item) in {normalize_sentence_key(value) for value in allowed} for item in distractors):
        return False
    return True


def validate_exercise_batch_diversity(questions):
    target_sentences = set()
    target_chinese = set()
    answer_signatures = set()
    slot_signatures = set()
    for item in questions:
        sentence_key = normalize_sentence_key(item.get("targetSentence", ""))
        chinese_key = normalize_sentence_key(item.get("targetChinese", ""))
        signature_key = normalize_sentence_key(item.get("answerSignature", ""))
        slot_values = item.get("slotValues") if isinstance(item.get("slotValues"), dict) else {}
        slot_key = normalize_sentence_key(json.dumps(slot_values, ensure_ascii=False, sort_keys=True))
        if sentence_key in target_sentences or chinese_key in target_chinese or signature_key in answer_signatures:
            return False
        if slot_key and slot_key in slot_signatures:
            return False
        target_sentences.add(sentence_key)
        target_chinese.add(chinese_key)
        answer_signatures.add(signature_key)
        if slot_key:
            slot_signatures.add(slot_key)
    return True


def validate_no_cross_exercise_leak(questions):
    for current in questions:
        current_blob = normalize_sentence_key(exercise_visible_blob(current, include_explanation=False))
        for other in questions:
            if current.get("id") == other.get("id"):
                continue
            other_sentence = normalize_sentence_key(other.get("targetSentence", ""))
            if other_sentence and other_sentence in current_blob:
                return False
    return True


def split_english_blocks(sentence):
    parts = re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?|[.,!?]", str(sentence))
    blocks = []
    index = 0
    while index < len(parts):
        token = parts[index]
        next_token = parts[index + 1] if index + 1 < len(parts) else ""
        third_token = parts[index + 2] if index + 2 < len(parts) else ""
        if token.lower() == "miss" and next_token.lower() == "wang":
            blocks.append("Miss Wang")
            index += 2
            continue
        if token.lower() in {"want", "wants"} and next_token.lower() == "to":
            blocks.append(f"{token} to")
            index += 2
            continue
        if token.lower() == "would" and next_token.lower() == "like" and third_token.lower() == "to":
            blocks.append("would like to")
            index += 3
            continue
        if token in ".,!?" and blocks:
            blocks[-1] += token
        elif token not in ".,!?":
            blocks.append(token)
        index += 1
    return blocks


def blocks_join_to_sentence(blocks, sentence):
    joined = re.sub(r"\s+([.!?,])", r"\1", " ".join(blocks)).strip()
    return normalize_sentence_key(joined) == normalize_sentence_key(sentence)


def option_shape_variety(options):
    shapes = set()
    for option in options:
        words = tokenize_english_sentence(option)
        shapes.add((len(words), bool(re.search(r"\bto\b", option.lower())), bool(re.search(r"ing\b", option.lower()))))
    return len(shapes)


def looks_like_english_sentence(option):
    words = tokenize_english_sentence(option)
    return len(words) >= 3 and bool(re.search(r"[.!?]$", option.strip()))


def format_answer_signature(correct):
    if isinstance(correct, list):
        return " ".join(str(item) for item in correct)
    return str(correct or "")


def normalize_option_rationales(rationales, options, correct):
    if not isinstance(rationales, list):
        return []
    correct_text = ""
    if isinstance(correct, int) or str(correct).isdigit():
        idx = int(correct)
        if 0 <= idx < len(options):
            correct_text = options[idx]
    else:
        correct_text = str(correct)
    clean = []
    for item in rationales:
        if not isinstance(item, dict):
            continue
        text = clean_line(str(item.get("text") or ""))
        if not text:
            continue
        clean.append({
            "text": text,
            "isCorrect": bool(item.get("isCorrect")) or normalize_sentence_key(text) == normalize_sentence_key(correct_text),
            "errorType": clean_line(str(item.get("errorType") or "")),
            "rationaleZh": clean_line(str(item.get("rationaleZh") or "")),
        })
    return clean


def has_option_rationales(question, options, correct):
    rationales = normalize_option_rationales(question.get("optionRationales"), options, correct)
    if not rationales:
        return False
    by_text = {normalize_sentence_key(item["text"]): item for item in rationales}
    if isinstance(correct, int) or str(correct).isdigit():
        correct_text = options[int(correct)] if 0 <= int(correct) < len(options) else ""
    else:
        correct_text = str(correct)
    for option in options:
        key = normalize_sentence_key(option)
        if key == normalize_sentence_key(correct_text):
            continue
        rationale = by_text.get(key)
        if not rationale or rationale.get("errorType") not in {
            "subject_verb_agreement",
            "missing_to",
            "wrong_verb_form",
            "wrong_structure",
            "semantic_mismatch",
        }:
            return False
    return True


def leaks_other_target_sentence(draft, accepted):
    draft_target = normalize_sentence_key(draft.get("targetSentence", ""))
    draft_blob = normalize_sentence_key(exercise_visible_blob(draft, include_explanation=False))
    for item in accepted:
        accepted_target = normalize_sentence_key(item.get("targetSentence", ""))
        accepted_blob = normalize_sentence_key(exercise_visible_blob(item, include_explanation=False))
        if accepted_target and accepted_target in draft_blob:
            return True
        if draft_target and draft_target in accepted_blob:
            return True
    return False


def exercise_visible_blob(question, include_explanation=True):
    parts = [
        question.get("prompt", ""),
        question.get("promptEn", ""),
        question.get("promptZh", ""),
        question.get("instructionZh", ""),
    ]
    if include_explanation:
        parts.append(question.get("explanationZh", ""))
    parts.extend(question.get("options", []) if isinstance(question.get("options"), list) else [])
    parts.extend(question.get("blocks", []) if isinstance(question.get("blocks"), list) else [])
    return " ".join(str(part) for part in parts if part)


def normalize_english_word(value):
    return re.sub(r"[^a-z']", "", str(value).replace("’", "'").lower())


def tokenize_english_sentence(sentence):
    return re.findall(r"[a-z]+(?:'[a-z]+)?", str(sentence).replace("’", "'").lower())


def validate_block_example(example, target_word):
    if not isinstance(example, dict):
        return False
    sentence = str(example.get("sentence", "")).strip()
    translation = str(example.get("translationZh", "")).strip()
    blocks = example.get("blocks", [])
    if not sentence or not translation or not isinstance(blocks, list) or not blocks:
        return False
    tokens = tokenize_english_sentence(sentence)
    if normalize_english_word(target_word) not in tokens:
        return False
    if len(tokens) > 14:
        return False
    combined = re.sub(r"\s+", " ", " ".join(str(block).strip() for block in blocks)).strip()
    combined = re.sub(r"\s+([.!?,])", r"\1", combined)
    normalized_sentence = re.sub(r"\s+", " ", sentence).strip()
    return combined == normalized_sentence


def call_json_model(api_key, prompt, *, max_tokens=2400, system_prompt="", model=None,
                    validator=None, max_retries=1,
                    request_id="", feature="", temperature=None, timeout_ms=None, timings=None):
    timings = timings if timings is not None else {}
    timings["retry_count"] = 0
    model = model or DEEPSEEK_MODEL
    temperature = DEEPSEEK_TEMPERATURE if temperature is None else temperature
    timeout_ms = timeout_ms or DEEPSEEK_TIMEOUT_MS
    deadline = time.time() + timeout_ms / 1000
    system_content = "\n".join(filter(None, [
        system_prompt or "你只输出 JSON，不要输出 Markdown。",
        STRICT_JSON_INSTRUCTIONS,
    ]))
    remaining_ms = int((deadline - time.time()) * 1000)
    if remaining_ms <= 0:
        exc = AIStageError("timeout", f"AI request exceeded {timeout_ms}ms", status=504, prompt_chars=len(prompt), feature=feature)
        exc.timings = normalize_ai_timings(timings)
        raise exc
    body = {
        "model": model,
        "thinking": {"type": "disabled"},
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_content},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": False,
    }
    request = Request(
        DEEPSEEK_BASE_URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    log_ai_stage(
        "AI_PROVIDER_CALL_START",
        request_id,
        feature=feature,
        attempt=1,
        provider="deepseek",
        model=model,
        baseURL=urlparse(DEEPSEEK_BASE_URL).netloc,
        timeoutMs=timeout_ms,
        remainingMs=remaining_ms,
        maxTokens=max_tokens,
        temperature=temperature,
        responseFormatEnabled="true",
    )
    provider_started = time.time()
    try:
        data = post_deepseek_once(request, timeout_ms=min(timeout_ms, remaining_ms))
        timings["api_called"] = True
    except HTTPError as exc:
        detail = format_http_error(exc)
        stage = classify_http_stage(exc.code)
        wrapped = AIStageError(stage, detail, status=http_status_for_ai_stage(stage), prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc
    except TimeoutError as exc:
        wrapped = AIStageError("timeout", str(exc), status=504, prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc
    except URLError as exc:
        stage = "timeout" if "timed out" in str(exc).lower() else "network"
        wrapped = AIStageError(stage, str(exc), status=504 if stage == "timeout" else 502, prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc
    except Exception as exc:
        wrapped = AIStageError("provider_call", str(exc), status=502, prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc
    api_call_time = int((time.time() - provider_started) * 1000)
    timings["api_call_time"] = api_call_time
    raw_chars = len(json.dumps(data, ensure_ascii=False))
    log_ai_stage("AI_PROVIDER_CALL_SUCCESS", request_id, durationMs=api_call_time, rawChars=raw_chars, firstTokenMs="not_supported")
    text = collect_chat_completion_text(data)
    raw_output = text or json.dumps(data, ensure_ascii=False)[:5000]
    if not text:
        exc = AIStageError("json_parse", f"No DeepSeek output text; {completion_diagnostic(data)}", status=502, raw_output=raw_output, prompt_chars=len(prompt), feature=feature)
        exc.timings = normalize_ai_timings(timings)
        raise exc
    parse_started = time.time()
    log_ai_stage("AI_JSON_PARSE_START", request_id, attempt=1, rawChars=len(text))
    try:
        parsed = safeParseAIResponse(text)
    except json.JSONDecodeError as exc:
        timings["json_parse_time"] = int((time.time() - parse_started) * 1000)
        wrapped = AIStageError("json_parse", str(exc), status=502, raw_output=raw_output, prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc
    timings["json_parse_time"] = int((time.time() - parse_started) * 1000)
    log_ai_stage("AI_JSON_PARSE_SUCCESS", request_id, attempt=1, durationMs=timings["json_parse_time"])
    validate_started = time.time()
    try:
        if validator:
            log_ai_stage("AI_SCHEMA_VALIDATE_START", request_id, attempt=1)
            validated = validator(parsed)
            if validated is None:
                raise ModelOutputError("Validator returned empty result")
            timings["schema_validate_time"] = int((time.time() - validate_started) * 1000)
            log_ai_stage("AI_SCHEMA_VALIDATE_SUCCESS", request_id, attempt=1, durationMs=timings["schema_validate_time"])
            return validated
        timings["schema_validate_time"] = 0
        log_ai_stage("AI_SCHEMA_VALIDATE_SUCCESS", request_id, attempt=1, durationMs=0, validator="none")
        return parsed
    except Exception as exc:
        timings["schema_validate_time"] = int((time.time() - validate_started) * 1000)
        wrapped = AIStageError("schema_validate", str(exc), status=502, raw_output=raw_output, prompt_chars=len(prompt), feature=feature)
        wrapped.timings = normalize_ai_timings(timings)
        raise wrapped from exc


def classify_http_stage(status_code):
    if status_code == 429:
        return "rate_limit"
    if status_code in {401, 403}:
        return "auth"
    return "provider_call"


def http_status_for_ai_stage(stage):
    if stage == "auth":
        return 401
    if stage == "rate_limit":
        return 429
    if stage == "prompt_too_large":
        return 413
    if stage == "circuit_breaker":
        return 503
    return 502


def safeParseAIResponse(text):
    extracted = extract_json_object(text)
    try:
        return json.loads(extracted)
    except json.JSONDecodeError:
        repaired = repair_json_text(extracted)
        return json.loads(repaired)


def parse_model_json(text):
    return safeParseAIResponse(text)


def extract_json_object(raw):
    text = str(raw or "").strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.I)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise json.JSONDecodeError("No JSON object found in model output", text, 0)
    return text[start:end + 1]


def repair_json_text(text):
    repaired = str(text or "")
    repaired = re.sub(r",\s*([}\]])", r"\1", repaired)
    repaired = re.sub(r"([}\]\"0-9])\s+(\"[A-Za-z_][A-Za-z0-9_]*\"\s*:)", r"\1, \2", repaired)
    repaired = re.sub(r"\b(true|false|null)\s+(\"[A-Za-z_][A-Za-z0-9_]*\"\s*:)", r"\1, \2", repaired)
    return repaired


def post_deepseek_once(request, timeout_ms=DEEPSEEK_TIMEOUT_MS):
    with urlopen(request, timeout=max(1, timeout_ms / 1000), context=SSL_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


def collect_output_text(value):
    chunks = []
    if isinstance(value, dict):
        if value.get("type") in {"output_text", "text"} and isinstance(value.get("text"), str):
            chunks.append(value["text"])
        for key in ("content", "text", "reasoning_content"):
            if isinstance(value.get(key), str) and value.get(key).strip():
                chunks.append(value[key])
        for item in value.values():
            nested = collect_output_text(item)
            if nested:
                chunks.append(nested)
    elif isinstance(value, list):
        for item in value:
            nested = collect_output_text(item)
            if nested:
                chunks.append(nested)
    return "".join(chunks)


def collect_chat_completion_text(value):
    try:
        choice = value["choices"][0]
        message = choice.get("message") or {}
        for key in ("content", "text", "reasoning_content"):
            item = message.get(key) if isinstance(message, dict) else None
            if isinstance(item, str) and item.strip():
                return item.strip()
            if isinstance(item, (list, dict)):
                nested = collect_output_text(item).strip()
                if nested:
                    return nested
        if isinstance(choice.get("text"), str) and choice["text"].strip():
            return choice["text"].strip()
        return collect_output_text(value).strip()
    except (KeyError, IndexError, TypeError, AttributeError):
        return collect_output_text(value).strip()


def completion_diagnostic(value):
    try:
        choice = value["choices"][0]
        message = choice.get("message") or {}
        content = message.get("content", "")
        reasoning = message.get("reasoning_content", "")
        keys = sorted(message.keys()) if isinstance(message, dict) else []
        return (
            f"finishReason={choice.get('finish_reason')}; "
            f"messageKeys={keys}; "
            f"contentChars={len(content) if isinstance(content, str) else 'non-string'}; "
            f"reasoningChars={len(reasoning) if isinstance(reasoning, str) else 'non-string'}"
        )
    except Exception as exc:
        return f"diagnosticUnavailable={exc}"


def fetch_dictionary_entry(char):
    raw = fetch_page(f"https://www.zdic.net/hans/{quote(char)}")
    text = extract_plain_text(raw)
    if char not in text:
        return None

    return {
        "char": char,
        "pinyin": pick_first(text, [r"拼音\s*([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹḿ\s]+)"]),
        "radical": pick_first(text, [r"部首\s*([\u4e00-\u9fff])", r"部首：\s*([\u4e00-\u9fff])"]),
        "strokes": pick_first(text, [r"总笔画\s*(\d+)", r"笔画\s*(\d+)"]),
        "structure": pick_first(text, [r"结构\s*([\u4e00-\u9fff]{2,4})"]),
        "meaning": extract_dictionary_meaning(text),
        "words": [],
        "sentence": "",
        "source": "在线字典"
    }


def pick_first(text, patterns):
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return clean_line(match.group(1))
    return ""


def extract_plain_text(raw):
    extractor = TextExtractor()
    extractor.feed(raw)
    return extractor.text()


def extract_dictionary_meaning(text):
    for pattern in [
        r"基本解释\s*(.*?)\s*详细解释",
        r"基本解释\s*(.*?)\s*康熙字典",
        r"详细字义\s*(.*?)\s*常用词组",
    ]:
        match = re.search(pattern, text, flags=re.S)
        if match:
            meaning = clean_line(match.group(1))
            meaning = re.sub(r"^[◎●]\s*", "", meaning)
            return meaning[:260]
    return ""


def extract_chatgpt_share_text(raw):
    candidates = []
    candidates.extend(extract_next_data(raw))
    candidates.extend(extract_next_flight_data(raw))
    candidates.extend(extract_react_router_stream_data(raw))
    candidates.extend(extract_embedded_script_text(raw))
    candidates.extend(extract_visible_text(raw))
    text = "\n".join(deduplicate_lines(candidates))
    text = clean_share_text(text)
    return text


def extract_next_data(raw):
    match = re.search(
        r'<script[^>]+id=["\']__NEXT_DATA__["\'][^>]*>(.*?)</script>',
        raw,
        flags=re.S | re.I,
    )
    if not match:
        return []
    try:
        data = json.loads(html.unescape(match.group(1)))
    except json.JSONDecodeError:
        return []
    return extract_conversation_strings(data)


def extract_next_flight_data(raw):
    parts = []
    for match in re.finditer(r"self\.__next_f\.push\((.*?)\)</script>", raw, flags=re.S):
        chunk = decode_js_like_text(match.group(1))
        parts.extend(extract_chinese_or_sentence_strings(chunk))
    return parts


def extract_react_router_stream_data(raw):
    parts = []
    pattern = r"window\.__reactRouterContext\.streamController\.enqueue\((.*?)\);?</script>"
    for match in re.finditer(pattern, raw, flags=re.S):
        chunk = decode_js_like_text(match.group(1))
        parts.extend(extract_chinese_or_sentence_strings(chunk))
    return parts


def extract_embedded_script_text(raw):
    parts = []
    for match in re.finditer(r"<script[^>]*>(.*?)</script>", raw, flags=re.S | re.I):
        script = match.group(1)
        if not script or len(script) < 80:
            continue
        if not re.search(r"[\u4e00-\u9fff]|\\u[0-9a-fA-F]{4}|message|content|parts|author", script):
            continue
        parts.extend(extract_chinese_or_sentence_strings(decode_nested_text(script)))
    return parts


def decode_js_like_text(value):
    value = html.unescape(value.strip())
    try:
        decoded = json.loads(value)
        if isinstance(decoded, str):
            value = decoded
        else:
            value = json.dumps(decoded, ensure_ascii=False)
    except json.JSONDecodeError:
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        value = value.replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t")
        value = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), value)
    return value


def decode_nested_text(value):
    value = html.unescape(value.strip())
    for _ in range(4):
        previous = value
        try:
            decoded = json.loads(value)
            if isinstance(decoded, str):
                value = decoded
            else:
                value = json.dumps(decoded, ensure_ascii=False)
        except json.JSONDecodeError:
            pass
        value = html.unescape(value)
        value = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), value)
        value = re.sub(r"\\x([0-9a-fA-F]{2})", lambda m: chr(int(m.group(1), 16)), value)
        value = value.replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t")
        value = value.replace('\\"', '"').replace("\\/", "/")
        if value == previous:
            break
    return value


def extract_visible_text(raw):
    extractor = TextExtractor()
    extractor.feed(raw)
    return extract_chinese_or_sentence_strings(extractor.text())


def extract_conversation_strings(value):
    results = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key in {"content", "text", "parts", "message", "title"}:
                results.extend(extract_conversation_strings(item))
            elif isinstance(item, (dict, list)):
                results.extend(extract_conversation_strings(item))
    elif isinstance(value, list):
        for item in value:
            results.extend(extract_conversation_strings(item))
    elif isinstance(value, str):
        results.extend(extract_chinese_or_sentence_strings(value))
    return results


def extract_chinese_or_sentence_strings(text):
    text = html.unescape(text)
    text = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), text)
    text = re.sub(r"\\n|\\r|\\t", "\n", text)
    pieces = re.split(r"[\n\r]+|(?<=。)|(?<=！)|(?<=？)", text)
    results = []
    for piece in pieces:
        cleaned = clean_line(piece)
        if is_likely_conversation_text(cleaned):
            results.append(cleaned)
    return results


def clean_line(line):
    line = re.sub(r"<[^>]+>", " ", line)
    line = re.sub(r"\s+", " ", line).strip(" -_:|,，")
    return line.strip()


def is_likely_conversation_text(line):
    if len(line) < 6 or len(line) > 800:
        return False
    blocked_fragments = [
        "跳至内容",
        "新聊天",
        "搜索聊天",
        "历史聊天记录",
        "查看套餐和定价",
        "登录以获取",
        "登录 ChatGPT",
        "免费注册",
        "使用即表示你同意",
        "隐私政策",
        "聊天内容可能会被审核",
        "ChatGPT 是 AI",
        "ChatGPT 可帮助",
        "有人觉得你会想看看这段聊天",
    ]
    if any(fragment in line for fragment in blocked_fragments):
        return False
    has_cjk = re.search(r"[\u4e00-\u9fff]", line)
    has_sentence = re.search(r"[。！？?!.]", line)
    return bool(has_cjk or (has_sentence and len(line.split()) > 4))


def deduplicate_lines(lines):
    seen = set()
    output = []
    for line in lines:
        key = re.sub(r"\s+", "", line)
        if key and key not in seen:
            seen.add(key)
            output.append(line)
    return output


def clean_share_text(text):
    for marker in ['\n","chunks"', '\n"chunks"', '\n",{', '\n,{']:
        index = text.find(marker)
        if index != -1:
            text = text[:index]
            break
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = []
    for line in text.splitlines():
        if re.fullmatch(r"[\[\]{}\",:_0-9.\-\s]+", line.strip()):
            continue
        if re.search(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", line):
            continue
        lines.append(line)
    return "\n".join(lines).strip()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    default_host = "0.0.0.0" if "PORT" in os.environ else "127.0.0.1"
    host = os.environ.get("HOST", default_host).strip() or default_host
    server = ThreadingHTTPServer((host, port), Handler)
    display_host = "127.0.0.1" if host in {"0.0.0.0", "::"} else host
    print(f"Hanzi Memory {API_VERSION} running at http://{display_host}:{port}")
    if host == "0.0.0.0":
        print("LAN mode enabled. Other devices on the same network can use http://<this-computer-ip>:%s" % port)
    server.serve_forever()
