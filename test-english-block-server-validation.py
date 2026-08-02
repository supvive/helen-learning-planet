import importlib.util
import json
from pathlib import Path


def load_server():
    path = Path(__file__).with_name("server.py")
    spec = importlib.util.spec_from_file_location("hanzi_server", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


server = load_server()


def rationales(options, correct):
    items = []
    for option in options:
        is_correct = option == correct
        items.append({
            "text": option,
            "isCorrect": is_correct,
            "errorType": "" if is_correct else "wrong_structure",
            "rationaleZh": "" if is_correct else "结构不匹配",
        })
    return items


valid_questions = [
    {
        "id": "q1",
        "type": "ordering",
        "targetSentence": "Amy wants to draw a picture.",
        "targetChinese": "Amy 想画一幅画。",
        "sceneTag": "drawing",
        "testedPoint": "want to 后接动词原形",
        "answerSignature": "Amy wants to draw a picture",
        "instructionZh": "把英文积木排成一句完整的话",
        "blocks": ["draw", "a picture.", "Amy", "wants to"],
        "correctAnswer": ["Amy", "wants to", "draw", "a picture."],
        "explanationZh": "wants to 后面接动词原形。",
    },
    {
        "id": "q2",
        "type": "fill_blank",
        "targetSentence": "I want to read a book.",
        "targetChinese": "我想读一本书。",
        "sceneTag": "reading",
        "testedPoint": "want to 结构",
        "answerSignature": "want to",
        "instructionZh": "选择合适的积木补全句子",
        "promptEn": "I ____ read a book.",
        "options": ["want to", "wants to", "want", "wanting to"],
        "correctAnswer": "want to",
        "optionRationales": rationales(["want to", "wants to", "want", "wanting to"], "want to"),
        "explanationZh": "I 后面用 want to。",
    },
    {
        "id": "q3",
        "type": "translation_build",
        "targetSentence": "We want to sing together.",
        "targetChinese": "我们想一起唱歌。",
        "sceneTag": "class",
        "testedPoint": "主语 We + want to",
        "answerSignature": "We want to sing together",
        "instructionZh": "看中文，用积木搭出英文句子",
        "promptZh": "我们想一起唱歌。",
        "requiredBlocks": ["We", "want to", "sing", "together."],
        "distractorBlocks": ["wants to", "read"],
        "blocks": ["read", "sing", "wants to", "together.", "We", "want to"],
        "correctAnswer": ["We", "want to", "sing", "together."],
        "explanationZh": "We 后面用 want to。",
    },
    {
        "id": "q4",
        "type": "choose_correct",
        "targetSentence": "Helen wants to open her book.",
        "targetChinese": "Helen 想打开她的书。",
        "sceneTag": "school things",
        "testedPoint": "第三人称 wants to",
        "answerSignature": "Helen wants to open her book",
        "instructionZh": "选择正确的英文句子",
        "promptZh": "Helen 想打开她的书。",
        "options": [
            "Helen want to open her book.",
            "Helen wants open her book.",
            "Helen wants to opens her book.",
            "Helen wants to open her book.",
        ],
        "correctAnswer": "3",
        "optionRationales": [
            {"text": "Helen want to open her book.", "isCorrect": False, "errorType": "subject_verb_agreement", "rationaleZh": "Helen 后面用 wants。"},
            {"text": "Helen wants open her book.", "isCorrect": False, "errorType": "missing_to", "rationaleZh": "缺少 to。"},
            {"text": "Helen wants to opens her book.", "isCorrect": False, "errorType": "wrong_verb_form", "rationaleZh": "to 后面用 open。"},
            {"text": "Helen wants to open her book.", "isCorrect": True},
        ],
        "explanationZh": "Helen 是第三人称单数。",
    },
    {
        "id": "q5",
        "type": "pattern_replace",
        "targetSentence": "Miss Wang wants to show the ruler.",
        "targetChinese": "王老师想展示尺子。",
        "sceneTag": "teacher",
        "testedPoint": "替换动作短语",
        "answerSignature": "show the ruler",
        "instructionZh": "选择一个积木，保持句型不变",
        "promptEn": "Miss Wang wants to ____.",
        "promptZh": "王老师想展示尺子。",
        "options": ["show the ruler", "shows the ruler", "showing the ruler", "the ruler show"],
        "correctAnswer": "0",
        "optionRationales": rationales(["show the ruler", "shows the ruler", "showing the ruler", "the ruler show"], "show the ruler"),
        "explanationZh": "wants to 后面接动词原形。",
    },
]


selected = ["ordering", "fill_blank", "translation_build", "choose_correct", "pattern_replace"]
valid = server.validate_english_exercise_batch({"questions": valid_questions}, "want_to_do", selected, 1, ["I want to eat some bread."])
assert_true(valid is not None, "A diverse valid batch should pass validation")
assert_true(len({q["targetSentence"] for q in valid["questions"]}) == 5, "Validated batch should preserve five target sentences")
assert_true(len({q["targetChinese"] for q in valid["questions"]}) == 5, "Validated batch should preserve five target Chinese prompts")
assert_true(len({q["answerSignature"] for q in valid["questions"]}) == 5, "Validated batch should preserve five answer signatures")
translation = next(q for q in valid["questions"] if q["type"] == "translation_build")
ordering = next(q for q in valid["questions"] if q["type"] == "ordering")
assert_true(len(translation["distractorBlocks"]) >= 2, "translation_build must include at least two distractor blocks")
assert_true(len(translation["blocks"]) > len(translation["correctAnswer"]), "translation_build blocks must include distractors")
assert_true(translation["targetSentence"] != ordering["targetSentence"], "translation_build must not reuse ordering target sentence")
assert_true(translation["answerSignature"] != ordering["answerSignature"], "translation_build must not reuse ordering answer signature")
extra_blocks = [block for block in translation["blocks"] if block not in translation["correctAnswer"]]
assert_true(len(extra_blocks) >= 2, "translation_build visible blocks must contain at least two extras")

duplicate = [dict(item) for item in valid_questions]
duplicate[1]["targetSentence"] = duplicate[0]["targetSentence"]
assert_true(server.validate_english_exercise_batch({"questions": duplicate}, "want_to_do", selected, 1, []) is None, "Duplicate targetSentence must fail")

leaking = [dict(item) for item in valid_questions]
leaking[1]["promptEn"] = "Amy wants to draw a picture. I ____ read a book."
assert_true(server.validate_english_exercise_batch({"questions": leaking}, "want_to_do", selected, 1, []) is not None, "Cross-exercise target leakage should be treated as a warning in v2.5.0")

weak_options = [dict(item) for item in valid_questions]
weak_options[1]["optionRationales"] = []
repaired_weak_options = server.validate_english_exercise_batch({"questions": weak_options}, "want_to_do", selected, 1, [])
assert_true(repaired_weak_options is not None, "Options without error rationales should be repaired")
assert_true(
    next(q for q in repaired_weak_options["questions"] if q["type"] == "fill_blank")["optionRationales"],
    "Missing rationales should be filled with default rationales",
)

list_correct = [dict(item) for item in valid_questions]
list_correct[1]["correctAnswer"] = ["want to"]
assert_true(server.validate_english_exercise_batch({"questions": list_correct}, "want_to_do", selected, 1, []) is not None, "Single-item correctAnswer arrays should be repaired for choice questions")

blocked = [dict(item) for item in valid_questions]
blocked[0]["targetSentence"] = "I want to eat some bread."
assert_true(server.validate_english_exercise_batch({"questions": blocked}, "want_to_do", selected, 1, ["I want to eat some bread."]) is None, "Blocked example sentences must fail")

no_distractors = [dict(item) for item in valid_questions]
no_distractors[2]["distractorBlocks"] = []
no_distractors[2]["blocks"] = ["sing", "together.", "We", "want to"]
repaired_no_distractors = server.validate_english_exercise_batch({"questions": no_distractors}, "want_to_do", selected, 1, [])
assert_true(repaired_no_distractors is None, "translation_build without distractors must fail instead of being silently repaired")

only_unrelated = [dict(item) for item in valid_questions]
only_unrelated[2]["distractorBlocks"] = ["zoo", "elephant"]
only_unrelated[2]["blocks"] = ["zoo", "sing", "elephant", "together.", "We", "want to"]
assert_true(server.validate_english_exercise_batch({"questions": only_unrelated}, "want_to_do", selected, 1, []) is None, "translation_build distractors cannot be obviously unrelated")

missing_required_block = [dict(item) for item in valid_questions]
missing_required_block[2] = {
    **missing_required_block[2],
    "targetSentence": "Is there anything Miss Wang wants to say?",
    "targetChinese": "王老师有什么想说的吗？",
    "answerSignature": "is_there_anything:misswang:say",
    "promptZh": "王老师有什么想说的吗？",
    "requiredBlocks": ["Is", "there", "anything", "Miss Wang", "wants to", "say?"],
    "distractorBlocks": ["want", "your", "book."],
    "blocks": ["want", "your", "to", "book."],
    "correctAnswer": ["Is", "there", "anything", "Miss Wang", "wants to"],
}
assert_true(server.validate_english_exercise_batch({"questions": missing_required_block}, "is_there_anything_subject_want_to_verb", selected, 1, []) is None, "translation_build missing say must fail")

good_question_blocks = server.split_english_blocks("Is there anything Miss Wang wants to say?")
assert_true("say?" in good_question_blocks, "English block splitting must keep the semantic verb say")
valid_say_question = [dict(item) for item in valid_questions]
valid_say_question[2] = {
    **valid_say_question[2],
    "targetSentence": "Is there anything Miss Wang wants to say?",
    "targetChinese": "王老师有什么想说的吗？",
    "answerSignature": "is_there_anything:misswang:say",
    "promptZh": "王老师有什么想说的吗？",
    "requiredBlocks": good_question_blocks,
    "distractorBlocks": ["want", "your", "book."],
    "blocks": ["want", "Is", "your", "there", "anything", "book.", "Miss Wang", "say?", "wants to"],
    "correctAnswer": good_question_blocks,
}
assert_true(server.validate_english_exercise_batch({"questions": valid_say_question}, "is_there_anything_subject_want_to_verb", selected, 1, []) is not None, "complete translation_build with say should pass")

assert_true(server.parse_model_json('```json\\n{"a":1}\\n```') == {"a": 1}, "Markdown JSON block should parse")
assert_true(server.parse_model_json('好的，下面是结果：\\n{"a":1}') == {"a": 1}, "Prefixed JSON should parse")
assert_true(server.parse_model_json('{"a":1,}') == {"a": 1}, "Trailing comma should repair")
assert_true(server.parse_model_json('{"a":1 "b":2}') == {"a": 1, "b": 2}, "Missing comma should repair")
assert_true(server.collect_chat_completion_text({"choices": [{"message": {"reasoning_content": '{"a":1}', "content": ""}, "finish_reason": "stop"}]}) == '{"a":1}', "DeepSeek reasoning_content fallback should be readable")

daily_plan = server.hydrate_daily_practice_plan({
    "sections": [
        {
            "type": "character_reading",
            "title": "认读",
            "items": [{"character": "输", "pinyin": "", "commonWord": "", "example": ""}],
        }
    ]
})
shu_item = daily_plan["chinesePracticeItems"][0]
assert_true(shu_item["text"] == "输", "Hydration should keep the target character")
assert_true("shū" in shu_item["pinyin"], "输 pinyin should be shū")
assert_true(shu_item["meaning"], "输 meaning should not be empty")
assert_true(len(shu_item["wordGroups"]) >= 3, "输 should have at least three word groups")
assert_true(len({"运输", "输入", "输出"} & set(shu_item["wordGroups"])) >= 2, "输 word groups should include common regression words")

timeout_error = server.AIStageError("timeout", "timeout", raw_output="raw", prompt_chars=12, feature="daily_practice")
server.save_ai_failure_log("unit-timeout", "daily_practice", "timeout", timeout_error)
assert_true((Path(server.AI_FAILURE_LOG_DIR) / "unit-timeout.json").exists(), "Timeout failure log should be saved")

meta = server.make_ai_meta(
    "english_blocks_exercises",
    "blocks-test",
    0,
    prompt_version="english-blocks-test",
    schema_version="english-blocks-batch-v1",
)
assert_true(meta["provider"] not in {"local", "mock"}, "AI generation meta must not look local or mock")
assert_true(meta["model"] == "deepseek-v4-pro", "AI generation meta must include the model")
assert_true(meta["fromCache"] is False, "Fresh AI generation meta should not be marked cached")

captured_prompts = []
original_post = server.post_deepseek_once


def fake_post_deepseek_once(request, timeout_ms=None):
    body = json.loads(request.data.decode("utf-8"))
    captured_prompts.append(body["messages"][-1]["content"])
    assert_true(server.estimate_prompt_tokens(body["messages"][-1]["content"]) <= server.MAX_AI_PROMPT_TOKENS, "AI prompts must stay within the v2.5.4 prompt budget")
    assert_true(body.get("thinking", {}).get("type") == "disabled", "DeepSeek thinking should be explicitly disabled for stable JSON output")
    assert_true("reasoning_effort" not in body, "DeepSeek request body should not include unsupported reasoning_effort field")
    return {
        "choices": [
            {
                "message": {
                    "content": fake_post_deepseek_once.content
                }
            }
        ]
    }


def pattern_payload(pattern_id, display_zh, display_en):
    return {
        "patternId": pattern_id,
        "pattern": {
            "id": pattern_id,
            "displayZh": display_zh,
            "displayEn": display_en,
            "displayFormulaZh": display_zh,
            "displayFormulaEn": display_en,
            "explanationZh": "测试句型。",
            "exampleSeeds": [{"english": "I want to play with Amy.", "chinese": "我想和 Amy 一起玩。"}],
        },
        "selectedTypes": selected,
        "count": 1,
        "blockedSentences": ["Do you want to play with us?"],
    }


server.post_deepseek_once = fake_post_deepseek_once
try:
    fake_post_deepseek_once.content = json.dumps({
        "sentences": [
            {"sentence": "I want to read a book.", "translationZh": "我想读一本书。", "sceneTag": "reading"},
            {"sentence": "Amy wants to draw a picture.", "translationZh": "Amy 想画一幅画。", "sceneTag": "drawing"},
            {"sentence": "We want to sing together.", "translationZh": "我们想一起唱歌。", "sceneTag": "class"},
            {"sentence": "Helen wants to open her book.", "translationZh": "Helen 想打开她的书。", "sceneTag": "school things"},
            {"sentence": "Miss Wang wants to show the ruler.", "translationZh": "王老师想展示尺子。", "sceneTag": "teacher"},
        ]
    }, ensure_ascii=False)
    for payload in [
        pattern_payload("want_to_do", "主语 + want to + 动词（短语）", "Subject + want to + verb phrase"),
        pattern_payload("its_my_thing", "It's my + 物品", "It's my + thing"),
        pattern_payload("here_is_my_thing", "Here is my + 物品", "Here is my + thing"),
        pattern_payload("thing_is_place", "物品 + is + 位置", "Thing + is + place"),
    ]:
        batch, timings = server.callAI("english_blocks", payload, api_key="sk-test-deepseek-key-123456", request_id="prompt-test")
        assert_true(timings["api_called"], "callAI must mark the provider call")
        assert_true(len(batch["questions"]) == len(selected), "English Blocks should wrap AI sentences into all selected exercise types")
        assert_true(all(question.get("targetSentence") for question in batch["questions"]), "Wrapped exercises must keep AI target sentences")

    fake_post_deepseek_once.content = json.dumps({
        "focus": {"theme": "龟兔赛跑", "chars": ["该", "刻", "放", "收"], "words": ["坚持", "终点", "骄傲"], "sentences": ["小兔子很骄傲。", "乌龟坚持走。"], "weakChars": ["该"]},
        "questions": [{"type": "认读", "prompt": "读一读", "display": "该", "answer": "该", "char": "该", "pinyin": "gāi", "choices": [], "reference": "应该"}],
    }, ensure_ascii=False)
    daily_plan, daily_timings = server.callAI("daily_practice", {"sourceText": "今日学习内容和今日反馈。" * 20, "practiceData": {}}, api_key="sk-test-deepseek-key-123456", request_id="daily-prompt-test")
    assert_true(daily_timings["api_called"], "Daily Practice must be routed through callAI")
    assert_true(daily_plan["chinesePracticeItems"], "Daily Practice should hydrate Chinese lexical items")

    fake_post_deepseek_once.content = json.dumps({"examples": [{"sentence": "I want to read a book.", "translationZh": "我想读一本书。", "blocks": ["I", "want to", "read", "a book."]}]}, ensure_ascii=False)
    server.callAI("ai_example", {**pattern_payload("want_to_do", "主语 + want to + 动词（短语）", "Subject + want to + verb phrase"), "kind": "pattern_examples"}, api_key="sk-test-deepseek-key-123456", request_id="examples-prompt-test")

    fake_post_deepseek_once.content = json.dumps({"sentence": "I want to read a book.", "translationZh": "我想读一本书。", "blocks": ["I", "want to", "read", "a book."], "targetWord": "want", "pattern": "I want to {{verb}}.", "grammarPointZh": "want to 后面接动词原形。", "newWords": []}, ensure_ascii=False)
    server.callAI("ai_example", {"kind": "block_example", "targetWord": "want", "displayWord": "want", "meaningZh": "想要", "allowedVocabulary": ["I", "want", "to", "read", "a", "book"], "allowedPatterns": ["I want to + verb"], "storySentences": []}, api_key="sk-test-deepseek-key-123456", request_id="word-example-prompt-test")
finally:
    server.post_deepseek_once = original_post

assert_true(captured_prompts, "Prompt builder tests should capture prompts")
assert_true(any('"sentences"' in prompt and '"sentence"' in prompt for prompt in captured_prompts), "English Blocks prompt should request sentence plans, not full exercises")
assert_true(not any('"correctAnswer"' in prompt and "题型规则" in prompt for prompt in captured_prompts), "English Blocks AI prompt should not ask the model to generate full exercise wrappers")
assert_true(not any("Invalid format specifier" in prompt for prompt in captured_prompts), "Prompt builder must not expose Invalid format specifier")

print({
    "validDiverseBatch": True,
    "duplicateRejected": True,
    "crossLeakWarningOnly": True,
    "missingRationalesRepaired": True,
    "blockedSentenceRejected": True,
    "translationBuildDistractorsValidated": True,
    "translationBuildMissingCoreRejected": True,
    "splitBlocksKeepsFinalVerb": True,
    "jsonExtractionAndRepair": True,
    "aiMetaIsAuthentic": True,
    "promptBuildersSafe": True,
    "repairableRationalesFilled": True,
    "singleItemCorrectArrayRepaired": True,
    "chineseHydration": True,
    "timeoutFailureLog": True,
})
