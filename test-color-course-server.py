import base64
import inspect
import json
import os
import tempfile
import unittest
from unittest import mock

import server


REGISTER = [
    {"code": "B028", "nameZh": "宝蓝"},
    {"code": "B215", "nameZh": "炫目蓝"},
    {"code": "S", "nameZh": "黑色"},
    {"code": "W01", "nameZh": "白色"},
]


def valid_analysis():
    return {
        "schemaVersion": "helen-color-reference-analysis/1",
        "usable": True,
        "rejectionReasonZh": "",
        "titleZh": "蓝色小熊",
        "aspectRatio": 2 / 3,
        "lightingDirectionZh": "左上方",
        "objects": [
            {"id": "bear", "labelZh": "小熊", "primitive": "ellipse", "bbox": [120, 100, 600, 720], "depth": 2}
        ],
        "paletteTargets": [
            {"id": "blue", "roleZh": "背景主色", "targetColorZh": "蓝色", "targetHex": "#4477AA", "candidates": ["B028", "B215"]},
            {"id": "white", "roleZh": "主体白色", "targetColorZh": "白色", "targetHex": "#FFFFFF", "candidates": ["W01", "B215"]},
        ],
        "overlays": {
            "position": [{"type": "rect", "x": 120, "y": 100, "width": 600, "height": 720, "labelZh": "主体范围"}],
            "skeleton": [{"type": "ellipse", "cx": 420, "cy": 320, "rx": 180, "ry": 160}],
            "occlusion": [{"type": "polygon", "points": [[120, 500], [700, 500], [700, 820]], "depth": 3}],
            "lineart": [{"type": "polyline", "points": [[120, 100], [300, 80], [700, 820]]}],
            "colorRegions": [{"type": "polygon", "points": [[0, 0], [1000, 0], [1000, 1000]], "targetId": "blue"}],
        },
    }


class ColorCourseServerTests(unittest.TestCase):
    def test_api_version_matches_gate_release(self):
        self.assertEqual(server.API_VERSION, "v3.9.12")

    def test_max_keeps_canonical_model_and_reasoning_effort(self):
        self.assertEqual(
            server.resolve_color_reference_route("luna", "max"),
            {"model": "openai/gpt-5.6-luna", "reasoning": {"effort": "max"}, "route": "standard"},
        )
        self.assertEqual(
            server.resolve_color_reference_route("terra", "max"),
            {"model": "openai/gpt-5.6-terra", "reasoning": {"effort": "max"}, "route": "standard"},
        )
        self.assertEqual(
            server.resolve_color_reference_route("terra", "medium"),
            {"model": "openai/gpt-5.6-terra", "reasoning": {"effort": "medium"}, "route": "standard"},
        )

    def test_cors_allows_client_trace_header(self):
        self.assertIn("X-Client-Trace-Id", inspect.getsource(server.Handler.end_headers))

    def test_public_key_setup_endpoint_is_removed(self):
        source = inspect.getsource(server.Handler)
        self.assertNotIn("/api/save-key", source)
        self.assertNotIn("def save_key", source)
        self.assertNotIn("OPENAI_API_KEY_FILE", inspect.getsource(server))

    def test_color_provider_reads_server_environment_key(self):
        with mock.patch.dict(os.environ, {"OPENROUTER_API_KEY": "router-test-key", "OPENAI_API_KEY": "legacy-key"}, clear=True), mock.patch.object(server, "read_env_value", return_value=""):
            self.assertEqual(server.get_openai_api_key(), "router-test-key")

    def test_vercel_rewrite_preserves_original_api_path(self):
        self.assertEqual(
            server.resolve_api_path("/api/index.py?path=color-course%2Fanalyze"),
            "/api/color-course/analyze",
        )

    def test_image_magic_and_hash_are_server_owned(self):
        raw = b"\xff\xd8\xff" + b"jpeg-data"
        result = server.validate_color_image_request({
            "schemaVersion": "helen-color-reference-request/1",
            "image": {
                "mimeType": "image/jpeg",
                "dataBase64": base64.b64encode(raw).decode("ascii"),
                "sha256": "client-value-is-ignored",
            },
        })
        self.assertEqual(result["mimeType"], "image/jpeg")
        self.assertNotEqual(result["sha256"], "client-value-is-ignored")
        self.assertEqual(result["modelTier"], "luna")
        self.assertEqual(result["reasoningEffort"], "medium")

    def test_analysis_profile_is_whitelisted(self):
        raw = b"\xff\xd8\xff" + b"jpeg-data"
        payload = {
            "schemaVersion": "helen-color-reference-request/1",
            "analysisProfile": {"modelTier": "terra", "reasoningEffort": "max"},
            "image": {"mimeType": "image/jpeg", "dataBase64": base64.b64encode(raw).decode("ascii")},
        }
        result = server.validate_color_image_request(payload)
        self.assertEqual((result["modelTier"], result["reasoningEffort"]), ("terra", "max"))
        payload["analysisProfile"]["modelTier"] = "sol"
        with self.assertRaisesRegex(ValueError, "视觉模型"):
            server.validate_color_image_request(payload)
        payload["analysisProfile"] = {"modelTier": "luna", "reasoningEffort": "ultra"}
        with self.assertRaisesRegex(ValueError, "推理强度"):
            server.validate_color_image_request(payload)

    def test_openrouter_response_shapes_and_failure_stages(self):
        self.assertEqual(
            server.collect_responses_output_text({"choices": [{"message": {"content": "{}"}}]}),
            "{}",
        )
        self.assertEqual(
            server.collect_responses_output_text({"choices": [{"message": {"content": [{"type": "text", "text": "{"}, {"type": "text", "text": "}"}]}}]}),
            "{}",
        )
        self.assertEqual(
            server.collect_responses_output_text({"output": [{"type": "message", "content": [{"type": "text", "text": "{"}, {"type": "output_text", "text": "}"}]}]}),
            "{}",
        )
        self.assertEqual(
            server.collect_responses_output_text({"choices": [{"message": {"reasoning_content": "hidden", "content": ""}}]}),
            "",
        )
        self.assertTrue(server.is_provider_response_truncated({"choices": [{"finish_reason": "length"}]}))
        self.assertEqual(server.classify_color_reference_provider_stage(400, "reasoning effort max unsupported"), "model_unavailable")
        self.assertEqual(server.classify_color_reference_provider_stage(403, "This model is not available in your region."), "model_unavailable")
        self.assertEqual(server.classify_color_reference_provider_stage(400, "No endpoints found for this model"), "model_unavailable")
        self.assertEqual(server.classify_color_reference_provider_stage(401, "invalid API key"), "auth")
        self.assertEqual(
            server.color_reference_provider_message("model_unavailable", "This model is not available in your region.", "max"),
            "当前模型在 OpenRouter 所在区域不可用，请在 OpenRouter 选择可用的模型路由后重试。",
        )
        self.assertEqual(
            server.color_reference_provider_message("model_unavailable", "reasoning effort max unsupported", "max"),
            "当前模型不支持最高推理，请选择其他模型或降低推理强度后重试。",
        )

    def test_openrouter_chat_response_is_parsed(self):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                return json.dumps({
                    "choices": [{"message": {"content": json.dumps(valid_analysis(), ensure_ascii=False)}}],
                    "usage": {"input_tokens": 10, "output_tokens": 20},
                }, ensure_ascii=False).encode("utf-8")

        def fake_urlopen(request, **_):
            return Response()

        image = {"mimeType": "image/jpeg", "base64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii")}
        with mock.patch.object(server, "urlopen", fake_urlopen):
            parsed, _ = server.call_openai_color_reference_model(
                "test-key", image, REGISTER, request_id="test", model="openai/gpt-5.6-luna", reasoning_effort="max"
            )
        self.assertTrue(parsed["usable"])

    def test_complete_chat_json_survives_length_finish_reason(self):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                return json.dumps({
                    "choices": [{
                        "finish_reason": "length",
                        "message": {
                            "reasoning_content": "reasoning reached its limit",
                            "content": json.dumps(valid_analysis(), ensure_ascii=False),
                        },
                    }],
                }, ensure_ascii=False).encode("utf-8")

        image = {"mimeType": "image/jpeg", "base64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii")}
        with mock.patch.object(server, "urlopen", lambda request, **_: Response()):
            parsed, _ = server.call_openai_color_reference_model(
                "test-key", image, REGISTER, request_id="test", model="openai/gpt-5.6-luna", reasoning_effort="max"
            )
        self.assertTrue(parsed["usable"])

    def test_complete_responses_json_survives_incomplete_status(self):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                return json.dumps({
                    "status": "incomplete",
                    "incomplete_details": {"reason": "max_output_tokens"},
                    "output": [{
                        "type": "message",
                        "status": "incomplete",
                        "content": [{"type": "output_text", "text": json.dumps(valid_analysis(), ensure_ascii=False)}],
                    }],
                }, ensure_ascii=False).encode("utf-8")

        image = {"mimeType": "image/jpeg", "base64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii")}
        with mock.patch.object(server, "urlopen", lambda request, **_: Response()):
            parsed, _ = server.call_openai_color_reference_model(
                "test-key", image, REGISTER, request_id="test", model="openai/gpt-5.6-luna", reasoning_effort="max"
            )
        self.assertTrue(parsed["usable"])

    def test_empty_truncated_and_invalid_json_are_distinct(self):
        class Response:
            def __init__(self, payload):
                self.payload = payload

            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                return json.dumps(self.payload, ensure_ascii=False).encode("utf-8")

        image = {"mimeType": "image/jpeg", "base64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii")}
        cases = [
            ({}, "response_empty"),
            ({"choices": [{"finish_reason": "length", "message": {"content": "{"}}]}, "response_truncated"),
            ({"choices": [{"message": {"content": "not-json"}}]}, "json_parse"),
        ]
        for payload, stage in cases:
            with self.subTest(stage=stage):
                with mock.patch.object(server, "urlopen", lambda request, _payload=payload, **_: Response(_payload)):
                    with self.assertRaises(server.AIStageError) as caught:
                        server.call_openai_color_reference_model(
                            "test-key", image, REGISTER, request_id="test", model="openai/gpt-5.6-luna", reasoning_effort="max"
                        )
                self.assertEqual(caught.exception.stage, stage)

    def test_failure_logs_do_not_store_model_output(self):
        error = server.AIStageError("json_parse", "Bearer secret-token api_key=another-secret", raw_output="private model output")
        with tempfile.TemporaryDirectory() as directory:
            with mock.patch.object(server, "AI_FAILURE_LOG_DIR", directory):
                server.save_ai_failure_log("test-request", "color_reference", "json_parse", error)
            with open(os.path.join(directory, "test-request.json"), encoding="utf-8") as handle:
                saved = json.load(handle)
        self.assertEqual(saved["rawOutputChars"], len("private model output"))
        self.assertNotIn("private model output", json.dumps(saved, ensure_ascii=False))
        self.assertNotIn("secret-token", json.dumps(saved, ensure_ascii=False))
        self.assertNotIn("another-secret", json.dumps(saved, ensure_ascii=False))

    def test_mime_spoof_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "格式与文件内容"):
            server.validate_color_image_request({
                "schemaVersion": "helen-color-reference-request/1",
                "image": {
                    "mimeType": "image/png",
                    "dataBase64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii"),
                },
            })

    def test_analysis_keeps_only_registered_codes(self):
        analysis = valid_analysis()
        analysis["paletteTargets"][0]["candidates"].append("FAKE")
        result = server.validate_color_reference_analysis(analysis, REGISTER)
        self.assertEqual([item["code"] for item in result["paletteTargets"][0]["candidates"]], ["B028", "B215"])
        self.assertEqual(len(result["paletteTargets"][1]["candidates"]), 1)

    def test_raw_svg_and_unknown_color_region_are_rejected(self):
        analysis = valid_analysis()
        analysis["overlays"]["position"] = [{"type": "path", "d": "<script>"}]
        with self.assertRaisesRegex(ValueError, "图形类型"):
            server.validate_color_reference_analysis(analysis, REGISTER)
        analysis = valid_analysis()
        analysis["overlays"]["colorRegions"][0]["targetId"] = "unknown"
        with self.assertRaisesRegex(ValueError, "未知色区"):
            server.validate_color_reference_analysis(analysis, REGISTER)

    def test_unusable_image_returns_student_facing_reason(self):
        analysis = valid_analysis()
        analysis["usable"] = False
        analysis["rejectionReasonZh"] = "图片里有多个同等重要的作品。"
        with self.assertRaises(server.AIStageError) as caught:
            server.validate_color_reference_analysis(analysis, REGISTER)
        self.assertEqual(caught.exception.status, 422)
        self.assertIn("多个", caught.exception.user_message)

    def test_openrouter_max_request_uses_canonical_model_reasoning_and_metadata(self):
        captured = {}

        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                payload = {
                    "output": [{"type": "message", "content": [{"type": "output_text", "text": json.dumps(valid_analysis(), ensure_ascii=False)}]}],
                    "usage": {"input_tokens": 10, "output_tokens": 20},
                }
                return json.dumps(payload, ensure_ascii=False).encode("utf-8")

        def fake_urlopen(request, **_):
            captured.update(json.loads(request.data.decode("utf-8")))
            captured["headers"] = dict(request.header_items())
            return Response()

        image = {"mimeType": "image/jpeg", "base64": base64.b64encode(b"\xff\xd8\xffjpeg").decode("ascii")}
        route = server.resolve_color_reference_route("luna", "max")
        with mock.patch.object(server, "urlopen", fake_urlopen):
            parsed, _ = server.call_openai_color_reference_model(
                "test-key", image, REGISTER, request_id="test", model=route["model"], reasoning_effort="max", reasoning_config=route["reasoning"]
            )
        self.assertTrue(parsed["usable"])
        self.assertEqual(captured["model"], "openai/gpt-5.6-luna")
        self.assertEqual(captured["reasoning"], {"effort": "max"})
        self.assertEqual(route["reasoning"].get("mode", "effort"), "effort")
        self.assertEqual(captured["max_output_tokens"], 24000)
        self.assertEqual(captured["headers"]["Http-referer"], "https://supvive.github.io/helen-learning-planet/")


if __name__ == "__main__":
    unittest.main()
