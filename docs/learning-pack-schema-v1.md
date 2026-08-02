# Helen Learning Pack Schema

This document describes the machine-readable daily learning pack consumed by the v3.0.0 website.

The website supports:

- `helen-learning-pack/1`: word/character/English target import only.
- `helen-learning-pack/2`: full render-only course pack for Chinese, English, and/or Art.

## Required Envelope

```json
{
  "schemaVersion": "helen-learning-pack/1",
  "packId": "2026-07-25-cn13-en24",
  "date": "2026-07-25",
  "loadMode": "standard",
  "title": "Helen 每日中英学习包",
  "chinese": {},
  "english": {},
  "practice": {}
}
```

## Rules

- `schemaVersion` must be `helen-learning-pack/1` or `helen-learning-pack/2`.
- `packId` is the idempotency key. Importing the same unchanged pack does not increase counts or reset progress.
- `date` must use `YYYY-MM-DD`.
- `loadMode` must be one of `standard`, `light`, or `recovery`.
- The full pasted text must be no larger than 100KB.
- Markdown fences such as ```json are allowed. The parser extracts exactly one JSON object.
- HTML and script content are rejected.
- The parser never calls an AI model. Missing targets are not guessed or completed.
- Full course pages require render-only content policy:

```json
{
  "contentPolicy": {
    "authority": "codex-course-designer",
    "websiteMode": "render-only",
    "allowModelGeneration": false
  }
}
```

If this policy is missing, the pack can still import v1-style words, but it cannot start a full daily course.

## Chinese

`chinese.characters[]` items:

- `text`: exactly one Chinese character.
- `pinyin`: standard pinyin display.
- `meaning`: short child-friendly meaning.
- `words`: recommended three word examples.
- `example`: short example sentence.
- `status`: `new`, `review`, `unstable`, `unknown`, `confused`, `consolidating`, or `mastered`.
- `priority`: 1-5.
- `source`: parent-readable source label.

`chinese.words[]` items:

- `text`: Chinese word.
- `meaning`: short meaning.
- `status`: same status list.
- `source`: parent-readable source label.

`chinese.confusedPairs[]` is a list of two-character arrays such as `["放", "收"]`.

## English

`english.words[]` items:

- `text`: English word or contraction.
- `meaningZh`: Chinese meaning.
- `status`: same status list.
- `sourceSentence`: source sentence.
- `priority`: 1-5.

`english.anchorSentence` is today's English sentence for English Blocks.

`english.pattern.blocks` contains the sentence blocks used by English Blocks.

## Full Course Extensions

`sharedPlan` may define planned Chinese minutes, break minutes, default English mode, planned English minutes, and fallback rules.

`chinese.lesson.sections[]` contains the exact Chinese course in display order. Reading text, choices, answers, explanations, retell prompts, scenario prompts, and post-check items must already be present in the pack.

`english.lesson.steps[]` contains the exact English seven-step course. Recovery/light/standard timing and all blocks, accepted answers, phonics items, dialogue lines, prompts, and success criteria must already be present in the pack.

`art` contains one marker drawing lesson. The current product supports material checklist, safety notes, warmup, step images by asset id, narration metadata, hints, timing, completion, local artwork photo filename, and art feedback.

Art lesson content is still render-only. The website never generates drawing steps, images, narration, or scoring.

## Read Aloud

Child-visible activities, questions, instructions, and art steps may include:

```json
{
  "readAloud": {
    "policy": "full",
    "spokenTextZh": "请听题目。",
    "optionSpokenTexts": ["选项一", "选项二"],
    "audioAssetId": "optional-pack-audio",
    "slowAudioAssetId": "optional-slow-audio"
  }
}
```

Allowed policies:

- `full`: read the provided instruction text.
- `instruction_only`: read only the operation instruction, not the answer target.
- `prompt_and_options`: read the prompt and pack-provided options.
- `prompt_only`: read the prompt only.
- `disabled_during_assessment`: do not render a read-aloud button.

When a policy is missing, the website uses the safe default `instruction_only`. Chinese character recognition and English independent reading must not read the target answer before assessment.

## Recording

Oral tasks may include:

```json
{
  "recording": {
    "mode": "optional_response",
    "maxSeconds": 120,
    "promptZh": "请说一说你的答案。",
    "startCueZh": "准备好后点麦克风",
    "stopAction": "done_button",
    "allowMultipleTakes": true,
    "includeInFeedback": true,
    "category": "oral_answer"
  }
}
```

Allowed modes:

- `none`: no recording UI.
- `optional_response`: show the recording card only after parent enables oral recording for this lesson.
- `required_response`: show the same recording card, but permission denial still cannot block the course.

The website only records activities that explicitly declare `recording`. It does not record a full lesson continuously, and it does not upload audio automatically.

Implementation boundary:

- Audio chunks are saved in IndexedDB under `helen-learning-recordings-v1`.
- Clip metadata is saved in local state and referenced from feedback snapshots.
- Feedback JSON lists a recordings manifest only; audio files are exported separately inside `.hfeedback.zip`.
- If the page is hidden or closed, current recording is stopped and marked interrupted/recoverable.
- iPad/Safari background or lock-screen recording is not guaranteed and must not be promised.

## Feedback

The parent-facing export is a global current snapshot:

```json
{
  "schemaVersion": "helen-learning-feedback/1",
  "reportMode": "current_snapshot",
  "snapshotId": "...",
  "sequence": 1,
  "generatedAt": "...",
  "planets": {
    "chinese": {},
    "english": {},
    "art": {}
  }
}
```

Each planet includes `status`, `courseId`, `lessonId`, `sessionId`, `completionRatio`, `completedActivityIds`, `lastCompletedActivityId`, `pendingActivityIds`, elapsed time, interactions, answers, hint level, read-aloud usage, voice source, and attachment expectations when present.

Recording clips appear as a manifest with clip id, activity id, MIME type, chunk count, duration, status, and file name. The JSON never embeds base64 audio.

Course sessions remain independent internally. A snapshot does not end, pause, reset, or submit any course. Not scheduled planets use `not_scheduled`; scheduled but untouched planets use `not_started`.

## Assets

The planned resource package format is `.hspack` / `.learning-pack.zip` with `manifest.json` plus safe static assets.

Current implemented boundary:

- image/audio asset ids are accepted in schema and rendered as references.
- local artwork photo selection records filename only.
- video is reserved as a safe future asset type.
- full zip import, IndexedDB binary cache, and offline media replay are not yet complete.

## Import Targets

- Chinese characters merge into `learnerChars` and `wordbook`.
- Chinese words merge into `wordbook`.
- English words merge into the dynamic English word library with source `daily_pack:<packId>`.
- English anchor sentence and pattern are exposed to English Blocks as `Today's Pack`.
