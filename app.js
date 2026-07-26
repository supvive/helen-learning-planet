const HANZI_DATA = [
  { char: "日", pinyin: "rì", meaning: "太阳，也表示一天。", words: ["日子", "生日", "日光"], sentence: "今天的日光很温暖。" },
  { char: "月", pinyin: "yuè", meaning: "月亮，也表示月份。", words: ["月亮", "月牙", "一月"], sentence: "弯弯的月亮挂在天上。" },
  { char: "水", pinyin: "shuǐ", meaning: "透明的液体，人和植物都需要水。", words: ["喝水", "水果", "水杯"], sentence: "我每天都要喝水。" },
  { char: "火", pinyin: "huǒ", meaning: "燃烧时发光发热的东西。", words: ["火苗", "火车", "大火"], sentence: "火车慢慢开进车站。" },
  { char: "山", pinyin: "shān", meaning: "高高隆起的地面。", words: ["大山", "山路", "山水"], sentence: "远处有一座青山。" },
  { char: "田", pinyin: "tián", meaning: "种庄稼的土地。", words: ["田地", "水田", "田野"], sentence: "田野里开满了小花。" },
  { char: "人", pinyin: "rén", meaning: "我们每一个都是人。", words: ["大人", "人口", "人们"], sentence: "人们在公园里散步。" },
  { char: "口", pinyin: "kǒu", meaning: "嘴，也可以表示入口。", words: ["开口", "门口", "口水"], sentence: "我站在门口等妈妈。" },
  { char: "木", pinyin: "mù", meaning: "树木，也指木头。", words: ["木头", "树木", "木马"], sentence: "树木让空气更清新。" },
  { char: "禾", pinyin: "hé", meaning: "谷类植物的样子。", words: ["禾苗", "禾田", "禾木"], sentence: "禾苗在风里轻轻摇。" },
  { char: "上", pinyin: "shàng", meaning: "位置在高处或前面。", words: ["上学", "上面", "早上"], sentence: "早上我背着书包去上学。" },
  { char: "下", pinyin: "xià", meaning: "位置在低处或后面。", words: ["下面", "下雨", "下午"], sentence: "下午天空开始下雨。" }
];

const EXTRA_HANZI_DATA = [
  { char: "一", pinyin: "yī", meaning: "数目字，表示最小的正整数", words: ["一个", "一天", "一只"], sentence: "我有一本书" },
  { char: "二", pinyin: "èr", meaning: "数目字，一加一所得", words: ["二月", "二人", "第二"], sentence: "第二天，小兔又去练习" },
  { char: "三", pinyin: "sān", meaning: "数目字，二加一所得", words: ["三天", "三只", "三月"], sentence: "三只小鸟在树上唱歌" },
  { char: "四", pinyin: "sì", meaning: "数目字，三加一所得", words: ["四方", "四个", "四月"], sentence: "桌上有四个苹果" },
  { char: "五", pinyin: "wǔ", meaning: "数目字，四加一所得", words: ["五天", "五个", "五月"], sentence: "我写了五个字" },
  { char: "天", pinyin: "tiān", meaning: "天空，也表示一天的时间", words: ["天空", "今天", "明天"], sentence: "今天的天空很蓝" },
  { char: "地", pinyin: "dì", meaning: "地面，土地", words: ["土地", "地上", "天地"], sentence: "小草从地里长出来" },
  { char: "你", pinyin: "nǐ", meaning: "称呼对方", words: ["你好", "你们", "你的"], sentence: "你好，我们一起读书" },
  { char: "我", pinyin: "wǒ", meaning: "说话的人称自己", words: ["我们", "我的", "自我"], sentence: "我喜欢读故事" },
  { char: "他", pinyin: "tā", meaning: "称呼另一个男性或泛指第三人", words: ["他们", "他的", "他人"], sentence: "他认真回答问题" },
  { char: "该", pinyin: "gāi", meaning: "应当，也指这、那个", words: ["应该", "该做", "该走"], sentence: "上课铃响了，该回教室了" },
  { char: "刻", pinyin: "kè", meaning: "时间单位，也表示雕刻", words: ["立刻", "时刻", "刻苦"], sentence: "小兔立刻向终点跑去" },
  { char: "放", pinyin: "fàng", meaning: "使东西离开手或安置在某处", words: ["放下", "放心", "开放"], sentence: "他把书放在桌上" },
  { char: "收", pinyin: "shōu", meaning: "把东西拿回来或整理起来", words: ["收拾", "收到", "丰收"], sentence: "下课后我们收好文具" },
  { char: "骄", pinyin: "jiāo", meaning: "自满，看不起别人", words: ["骄傲", "骄气", "骄阳"], sentence: "骄傲会让人落后" },
  { char: "傲", pinyin: "ào", meaning: "自高自大，也表示不屈服", words: ["骄傲", "傲慢", "自傲"], sentence: "乌龟不骄傲，坚持向前走" },
  { char: "坚", pinyin: "jiān", meaning: "结实，不动摇", words: ["坚持", "坚强", "坚决"], sentence: "坚持练习就会进步" },
  { char: "持", pinyin: "chí", meaning: "拿着，保持", words: ["坚持", "保持", "支持"], sentence: "乌龟一直坚持走到终点" },
  { char: "终", pinyin: "zhōng", meaning: "结束，最后", words: ["终点", "终于", "始终"], sentence: "乌龟终于到了终点" },
  { char: "点", pinyin: "diǎn", meaning: "小的痕迹，也表示位置或时间", words: ["终点", "点头", "一点"], sentence: "终点就在前面" },
  { char: "兔", pinyin: "tù", meaning: "一种耳朵长、会跳的小动物", words: ["兔子", "白兔", "小兔"], sentence: "小兔跑得很快" },
  { char: "龟", pinyin: "guī", meaning: "一种背上有硬壳、行动较慢的动物", words: ["乌龟", "海龟", "龟兔"], sentence: "乌龟慢慢向前走" },
  { char: "赛", pinyin: "sài", meaning: "比赛，比高低", words: ["比赛", "赛跑", "竞赛"], sentence: "龟兔赛跑的故事很有意思" },
  { char: "跑", pinyin: "pǎo", meaning: "两脚快速向前移动", words: ["跑步", "赛跑", "快跑"], sentence: "小兔跑得很快" },
  { char: "铃", pinyin: "líng", meaning: "能发出清脆声音的小器物", words: ["铃声", "上课铃", "门铃"], sentence: "上课铃响了" },
  { char: "响", pinyin: "xiǎng", meaning: "发出声音", words: ["响声", "响亮", "铃响"], sentence: "上课铃响了" },
  { char: "回", pinyin: "huí", meaning: "返回，也表示回答", words: ["回来", "回答", "回家"], sentence: "孩子认真回答问题" },
  { char: "答", pinyin: "dá", meaning: "回答，应对", words: ["回答", "答题", "问答"], sentence: "他回答得很清楚" }
  ,{ char: "后", pinyin: "hòu", meaning: "时间或位置在后面", words: ["后来", "以后", "后面"], sentence: "后来，小兔明白了不能骄傲" }
  ,{ char: "来", pinyin: "lái", meaning: "从别处到这里", words: ["后来", "来到", "回来"], sentence: "第二天，小兔又来练习" }
  ,{ char: "第", pinyin: "dì", meaning: "表示次序", words: ["第二", "第一", "第几"], sentence: "第二天，小兔继续努力" }
  ,{ char: "乌", pinyin: "wū", meaning: "黑色，也常用于乌龟一词", words: ["乌龟", "乌黑", "乌云"], sentence: "乌龟一步一步向前走" }
  ,{ char: "课", pinyin: "kè", meaning: "学习的科目或一节学习时间", words: ["上课", "课文", "下课"], sentence: "上课铃响了" }
  ,{ char: "签", pinyin: "qiān", meaning: "写下姓名或作为标记的小条，在标签、签名、书签中读 qiān", words: ["标签", "签名", "书签"], sentence: "每张作品下面都有姓名标签" }
  ,{ char: "对", pinyin: "duì", meaning: "比较两边，看是否一致，也表示正确或面对", words: ["核对", "对照", "对错"], sentence: "交作业前要核对姓名和题号" }
];

const BASE_HANZI_DATA = [...HANZI_DATA, ...EXTRA_HANZI_DATA];

const PEP_GRADE_ONE_CHARS = "天地人你我他一二三四五上下口耳目手足站坐日月水火山石田禾对云雨风花鸟虫六七八九十爸妈马土不画打棋鸡字词语句子桌纸文数学音乐妹奶白皮小桥台雪儿草家是车羊走也早书刀尺本木林力心中五立正小大多少牛果鸟";
const GRADE_ONE_MATH_CHARS = "加减等于共还剩多左右前后里外大小长短高矮轻重比第几图形圆方角元分合组成算式题答案写读数个只本支朵条";

const ENGLISH_WORD_LIBRARY_VERSION = 4;
const ENGLISH_PROGRESS_KEY = "english-word-recognition-progress-v2";
const ENGLISH_PROGRESS_V1_KEY = "english-word-recognition-progress-v1";
const ENGLISH_BLOCK_EXAMPLE_CACHE_KEY = "english-block-example-cache-v1";
const ENGLISH_BLOCKS_PROGRESS_KEY = "english-blocks-progress-v1";
const ENGLISH_BLOCK_EXERCISE_CACHE_KEY = "english-block-exercise-batches-v1";
const ENGLISH_BLOCK_SELECTED_PATTERN_KEY = "english-blocks-selected-pattern-id-v1";
const ENGLISH_BLOCK_SOURCE_FILTER_KEY = "english-blocks-source-filter-v1";
const APP_METADATA = {
  version: "v3.4.8",
  buildId: "2026-07-26T11:25:00+08:00",
  product: "学习星球"
};
const ENGLISH_BLOCK_EXAMPLE_LEVEL = APP_METADATA.version;
const ENGLISH_BLOCK_EXAMPLE_PROMPT_VERSION = 1;
const ENGLISH_BLOCK_EXERCISE_PROMPT_VERSION = 6;
const LEARNING_PACK_SCHEMA_VERSION = "helen-learning-pack/1";
const SUPPORTED_LEARNING_PACK_SCHEMAS = ["helen-learning-pack/1", "helen-learning-pack/2"];
const LEARNING_PACK_STORAGE_KEY = "helen-learning-packs-v1";
const LEARNING_PACK_MAX_BYTES = 100 * 1024;
const BUILTIN_LEARNING_PACK_MANIFEST = "./data/learning-packs/manifest.json";
const WITHDRAWN_BUILTIN_PACK_IDS = new Set([
  "2026-07-26-helen-day14-open-books-art01",
  "2026-07-26-helen-day14-revision-d-open-books-art01"
]);
const COURSE_PROGRESS_STORAGE_KEY = "helen-course-progress-v1";
const COURSE_TIMER_MODEL_VERSION = 2;
const COURSE_TIMER_HEARTBEAT_MS = 5000;
const COURSE_TIMER_RECOVERY_GRACE_MS = 10000;
const RECORDING_DB_NAME = "helen-learning-recordings-v1";
const RECORDING_DB_VERSION = 1;
const RECORDING_TIMESLICE_MS = 10000;
const RECORDING_MAX_SECONDS = 300;
const COURSE_RESULT_LABELS = {
  independent: "独立完成",
  prompted: "少量提醒",
  modeled: "播放/示范后完成",
  not_yet: "暂时不会"
};
const FULL_COURSE_CONTENT_POLICY = {
  authority: "codex-course-designer",
  websiteMode: "render-only",
  allowModelGeneration: false
};
const PLANET_REGISTRY = [
  { id: "chinese", nameZh: "中文星球", nameEn: "Chinese Planet", icon: "中", route: "today-chinese", theme: "chinese", enabled: true, symbols: ["故事", "汉字", "书页"] },
  { id: "english", nameZh: "字母星球", nameEn: "Letter Planet", icon: "Aa", route: "english-planet", theme: "english", enabled: true, symbols: ["声音", "对话", "积木"] },
  { id: "art", nameZh: "颜色星球", nameEn: "Color Planet", icon: "色", route: "art-planet", theme: "art", enabled: true, symbols: ["颜色", "笔触", "作品"] }
];
const ALLOWED_ASSET_TYPES = {
  image: ["image/png", "image/jpeg", "image/webp"],
  audio: ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav"],
  video: ["video/mp4", "video/webm"]
};

const ENGLISH_PRONUNCIATIONS = {
  skip: { ipaUS: "/skɪp/", ipaUK: "/skɪp/" },
  jump: { ipaUS: "/dʒʌmp/", ipaUK: "/dʒʌmp/" },
  run: { ipaUS: "/rʌn/", ipaUK: "/rʌn/" },
  school: { ipaUS: "/skuːl/", ipaUK: "/skuːl/" },
  schoolbag: { ipaUS: "/ˈskuːlbæɡ/", ipaUK: "/ˈskuːlbæɡ/" },
  playground: { ipaUS: "/ˈpleɪɡraʊnd/", ipaUK: "/ˈpleɪɡraʊnd/" },
  miss: { ipaUS: "/mɪs/", ipaUK: "/mɪs/" },
  wang: { ipaUS: "/wɑːŋ/", ipaUK: "/wæŋ/" },
  book: { ipaUS: "/bʊk/", ipaUK: "/bʊk/" },
  pencil: { ipaUS: "/ˈpensəl/", ipaUK: "/ˈpensəl/" },
  ruler: { ipaUS: "/ˈruːlər/", ipaUK: "/ˈruːlə/" },
  teacher: { ipaUS: "/ˈtiːtʃər/", ipaUK: "/ˈtiːtʃə/" },
  hello: { ipaUS: "/həˈloʊ/", ipaUK: "/həˈləʊ/" },
  morning: { ipaUS: "/ˈmɔːrnɪŋ/", ipaUK: "/ˈmɔːnɪŋ/" },
  ready: { ipaUS: "/ˈredi/", ipaUK: "/ˈredi/" },
  together: { ipaUS: "/təˈɡeðər/", ipaUK: "/təˈɡeðə/" },
  "i'm": { ipaUS: "/aɪm/", ipaUK: "/aɪm/" },
  "it's": { ipaUS: "/ɪts/", ipaUK: "/ɪts/" },
  "what's": { ipaUS: "/wʌts/", ipaUK: "/wɒts/" },
  "let's": { ipaUS: "/lets/", ipaUK: "/lets/" },
  amy: { ipaUS: "/ˈeɪmi/", ipaUK: "/ˈeɪmi/" },
  helen: { ipaUS: "/ˈhelən/", ipaUK: "/ˈhelən/" },
  ok: { ipaUS: "/ˌoʊˈkeɪ/", ipaUK: "/ˌəʊˈkeɪ/" },
  "can't": { ipaUS: "/kænt/", ipaUK: "/kɑːnt/" },
  "don't": { ipaUS: "/doʊnt/", ipaUK: "/dəʊnt/" }
};

const DISPLAY_OVERRIDES = {
  i: "I",
  "i'm": "I'm",
  "it's": "It's",
  "what's": "What's",
  "let's": "Let's",
  amy: "Amy",
  helen: "Helen",
  miss: "Miss",
  wang: "Wang",
  ok: "OK",
  "can't": "can't",
  "don't": "don't"
};

const STORY_ZOO_WORDS = [
  "a", "all", "am", "and", "animal", "animals", "anything", "are",
  "at", "baby", "bamboo", "big", "black", "cage", "can", "can't",
  "come", "cute", "dad", "day", "do", "don't", "eat", "elephants",
  "every", "except", "family", "fast", "find", "for", "go", "grandma",
  "happy", "her", "here", "i", "in", "is", "it", "kind", "know",
  "like", "look", "love", "meat", "mom", "my", "need", "no", "oh",
  "ok", "panda", "pandas", "run", "see", "she", "so", "some",
  "something", "sure", "thank", "that", "the", "them", "there", "they",
  "this", "tigers", "to", "very", "walking", "want", "we", "what",
  "where", "which", "white", "with", "yes", "you", "zoo"
];

const STORY_KINDERGARTEN_WORDS = [
  "a", "afraid", "after", "am", "an", "and", "apple", "are", "ask",
  "asks", "at", "bag", "ball", "big", "black", "book", "boots", "boy",
  "boys", "bread", "but", "can", "can't", "chair", "children", "clean",
  "climb", "cookies", "dad", "day", "do", "dog", "drink", "eat",
  "exercise", "fast", "find", "first", "food", "friends", "fun", "girl",
  "girls", "go", "happy", "has", "hat", "he", "her", "here", "hop",
  "i", "is", "it", "juice", "jump", "kind", "kindergarten", "like",
  "little", "love", "many", "mom", "much", "my", "near", "new", "not",
  "now", "oh", "one", "or", "outside", "pink", "play", "purple", "run",
  "runs", "sad", "say", "says", "school", "see", "she", "sing", "skip",
  "small", "smile", "snack", "so", "some", "song", "swim", "teacher",
  "teaches", "team", "thank", "that", "the", "there", "this", "throw",
  "time", "to", "today", "together", "too", "under", "us", "very",
  "want", "we", "wears", "welcome", "where", "with", "wow", "yes",
  "you"
];

const STORY_PRIMARY_SCHOOL_WORDS = [
  "a", "afternoon", "amy", "and", "answer", "are", "asks", "at",
  "be", "bell", "big", "book", "books", "box", "break", "children",
  "class", "classroom", "come", "day", "desk", "do", "door", "end",
  "eraser", "first", "for", "friend", "girl", "good", "goodbye", "happy",
  "has", "have", "helen", "hello", "here", "hooray", "i", "i'm",
  "in", "is", "it", "it's", "jump", "learn", "let's", "listen",
  "me", "meet", "miss", "morning", "my", "name", "new", "next",
  "nice", "of", "on", "open", "our", "pencil", "pink", "play",
  "playground", "please", "points", "primary", "put", "read", "ready",
  "rings", "ruler", "run", "say", "says", "school", "schoolbag",
  "seat", "see", "she", "show", "sits", "skip", "smile", "stands",
  "starts", "teacher", "that", "the", "things", "this", "time", "to",
  "today", "together", "tomorrow", "too", "wang", "want", "we",
  "what's", "with", "yes", "you", "your"
];

const ENGLISH_SOURCES = {
  "story_zoo": {
    "id": "story_zoo",
    "type": "story",
    "title": "Story 1 · ZOO",
    "version": "v1.0",
    "order": 1
  },
  "story_kindergarten": {
    "id": "story_kindergarten",
    "type": "story",
    "title": "Story 2 · Kindergarten",
    "version": "v2.1",
    "order": 2
  },
  "story_primary_school": {
    "id": "story_primary_school",
    "type": "story",
    "title": "Story 3 · Hello, School!",
    "version": "v2.2",
    "order": 3
  }
};

const SOURCE_EXAMPLES = [
  {
    "id": "story_zoo:01",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 1,
    "kind": "body",
    "english": "I am at the zoo with my mom, dad and grandma.",
    "chinese": "我和我的妈妈、爸爸还有奶奶一起在动物园。"
  },
  {
    "id": "story_zoo:02",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 2,
    "kind": "body",
    "english": "We are so happy! Do you like this zoo, baby?",
    "chinese": "我们真开心！宝宝，你喜欢这个动物园吗？"
  },
  {
    "id": "story_zoo:03",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 3,
    "kind": "body",
    "english": "Yes! I love this zoo. Look! What is that?",
    "chinese": "喜欢！我爱这个动物园。看！那是什么？"
  },
  {
    "id": "story_zoo:04",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 4,
    "kind": "body",
    "english": "That is a panda. It is black and white.",
    "chinese": "那是一只熊猫。它是黑白相间的。"
  },
  {
    "id": "story_zoo:05",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 5,
    "kind": "body",
    "english": "She is very cute. Do you like her?",
    "chinese": "它（熊猫）很可爱。你喜欢它吗？"
  },
  {
    "id": "story_zoo:06",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 6,
    "kind": "body",
    "english": "Yes! I like her.",
    "chinese": "是的！我喜欢它。"
  },
  {
    "id": "story_zoo:07",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 7,
    "kind": "body",
    "english": "Can we go there to look at her?",
    "chinese": "我们能去那里看它吗？"
  },
  {
    "id": "story_zoo:08",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 8,
    "kind": "body",
    "english": "Sure! Come here, baby.",
    "chinese": "当然可以！过来这里宝宝。"
  },
  {
    "id": "story_zoo:09",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 9,
    "kind": "body",
    "english": "Don’t run fast.",
    "chinese": "别跑太快。"
  },
  {
    "id": "story_zoo:10",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 10,
    "kind": "body",
    "english": "OK, dad.",
    "chinese": "好的，爸爸。"
  },
  {
    "id": "story_zoo:11",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 11,
    "kind": "body",
    "english": "Where are the tigers? I can’t find them.",
    "chinese": "老虎在哪里？我找不到它们。"
  },
  {
    "id": "story_zoo:12",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 12,
    "kind": "body",
    "english": "They are in the big cage. Look, they are walking.",
    "chinese": "它们在那个大笼子里。看，它们正在走路。"
  },
  {
    "id": "story_zoo:13",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 13,
    "kind": "body",
    "english": "Do they eat meat? I need to know.",
    "chinese": "它们吃肉吗？我想知道。"
  },
  {
    "id": "story_zoo:14",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 14,
    "kind": "body",
    "english": "Yes, they do. They eat some meat every day.",
    "chinese": "是的，它们吃。它们每天吃一些肉。"
  },
  {
    "id": "story_zoo:15",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 15,
    "kind": "body",
    "english": "Which animal do you like, mom?",
    "chinese": "妈妈，你喜欢哪一种动物？"
  },
  {
    "id": "story_zoo:16",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 16,
    "kind": "body",
    "english": "I like elephants. They are big and kind.",
    "chinese": "我喜欢大象。它们很大并且温顺。"
  },
  {
    "id": "story_zoo:17",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 17,
    "kind": "body",
    "english": "Do you like all animals, grandma?",
    "chinese": "奶奶，你喜欢所有的动物吗？"
  },
  {
    "id": "story_zoo:18",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 18,
    "kind": "body",
    "english": "Yes, I do. I love all animals.",
    "chinese": "是的，我喜欢。我爱所有的动物。"
  },
  {
    "id": "story_zoo:19",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 19,
    "kind": "body",
    "english": "Is there anything you want to eat, baby?",
    "chinese": "宝宝，你想吃点什么吗？"
  },
  {
    "id": "story_zoo:20",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 20,
    "kind": "body",
    "english": "No, dad. I need to find something for the pandas.",
    "chinese": "不，爸爸。我想找些东西给熊猫吃。"
  },
  {
    "id": "story_zoo:21",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 21,
    "kind": "body",
    "english": "They don’t eat anything except bamboo.",
    "chinese": "它们除了竹子，什么都不吃。"
  },
  {
    "id": "story_zoo:22",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 22,
    "kind": "body",
    "english": "Oh! I see. Thank you, mom and dad.",
    "chinese": "哦！我知道了。谢谢爸爸妈妈。"
  },
  {
    "id": "story_zoo:23",
    "sourceId": "story_zoo",
    "sourceTitle": "Story 1 · ZOO",
    "sourceType": "story",
    "order": 23,
    "kind": "body",
    "english": "We are a happy family!",
    "chinese": "我们是幸福的一家人！"
  },
  {
    "id": "story_kindergarten:01",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 1,
    "kind": "body",
    "english": "I am at my kindergarten with my mom and dad.",
    "chinese": "我和爸爸妈妈来到我的幼儿园。"
  },
  {
    "id": "story_kindergarten:02",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 2,
    "kind": "body",
    "english": "Today is my first day here.",
    "chinese": "今天是我在这里的第一天。"
  },
  {
    "id": "story_kindergarten:03",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 3,
    "kind": "body",
    "english": "Wow! The school is big and clean.",
    "chinese": "哇！这个学校又大又干净。"
  },
  {
    "id": "story_kindergarten:04",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 4,
    "kind": "body",
    "english": "There are many children here.",
    "chinese": "这里有很多小朋友。"
  },
  {
    "id": "story_kindergarten:05",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 5,
    "kind": "body",
    "english": "Some boys can run very fast.",
    "chinese": "一些男孩跑得非常快。"
  },
  {
    "id": "story_kindergarten:06",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 6,
    "kind": "body",
    "english": "Some girls can jump and skip.",
    "chinese": "一些女孩会跳和蹦跳。"
  },
  {
    "id": "story_kindergarten:07",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 7,
    "kind": "body",
    "english": "I see a little girl with a pink hat.",
    "chinese": "我看到一个戴粉色帽子的小女孩。"
  },
  {
    "id": "story_kindergarten:08",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 8,
    "kind": "body",
    "english": "She has a purple bag.",
    "chinese": "她有一个紫色的书包。"
  },
  {
    "id": "story_kindergarten:09",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 9,
    "kind": "body",
    "english": "I like her bag very much.",
    "chinese": "我非常喜欢她的书包。"
  },
  {
    "id": "story_kindergarten:10",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 10,
    "kind": "body",
    "english": "“Do you want to play with us?” she asks.",
    "chinese": "“你想和我们一起玩吗？”她问。"
  },
  {
    "id": "story_kindergarten:11",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 11,
    "kind": "body",
    "english": "“Yes! I do!” I say.",
    "chinese": "“是的！想！”我说。"
  },
  {
    "id": "story_kindergarten:12",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 12,
    "kind": "body",
    "english": "We run, hop and throw a small ball together.",
    "chinese": "我们一起跑步、跳跃和扔小球。"
  },
  {
    "id": "story_kindergarten:13",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 13,
    "kind": "body",
    "english": "It is so fun.",
    "chinese": "太好玩了。"
  },
  {
    "id": "story_kindergarten:14",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 14,
    "kind": "body",
    "english": "But now I can’t find my book. “Where is my book?”",
    "chinese": "但是现在我找不到我的书了。“我的书在哪里？”"
  },
  {
    "id": "story_kindergarten:15",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 15,
    "kind": "body",
    "english": "“Is it under the chair?” my teacher asks.",
    "chinese": "“它在椅子下面吗？”老师问。"
  },
  {
    "id": "story_kindergarten:16",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 16,
    "kind": "body",
    "english": "Oh! Yes! It is there.“Thank you, teacher!”",
    "chinese": "哦！是的！它在那里。“谢谢老师！”"
  },
  {
    "id": "story_kindergarten:17",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 17,
    "kind": "body",
    "english": "“You are welcome,” she says with a smile.",
    "chinese": "“别客气，”她微笑着说。"
  },
  {
    "id": "story_kindergarten:18",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 18,
    "kind": "body",
    "english": "My teacher is very kind.",
    "chinese": "我的老师非常温柔。"
  },
  {
    "id": "story_kindergarten:19",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 19,
    "kind": "body",
    "english": "She teaches us a new song.",
    "chinese": "她教我们一首新歌。"
  },
  {
    "id": "story_kindergarten:20",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 20,
    "kind": "body",
    "english": "We sing together like one big team.",
    "chinese": "我们像一个大团队一样一起唱歌。"
  },
  {
    "id": "story_kindergarten:21",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 21,
    "kind": "body",
    "english": "At snack time, I eat some bread, cookies and an apple.",
    "chinese": "点心时间，我吃了一些面包、饼干和一个苹果。"
  },
  {
    "id": "story_kindergarten:22",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 22,
    "kind": "body",
    "english": "I drink some juice, too.",
    "chinese": "我还喝了一些果汁。"
  },
  {
    "id": "story_kindergarten:23",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 23,
    "kind": "body",
    "english": "“Do you like the food here?” dad asks.",
    "chinese": "“你喜欢这里的食物吗？”爸爸问。"
  },
  {
    "id": "story_kindergarten:24",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 24,
    "kind": "body",
    "english": "“Yes! I love it!”",
    "chinese": "“喜欢！我爱这里！”"
  },
  {
    "id": "story_kindergarten:25",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 25,
    "kind": "body",
    "english": "After that, we go outside.",
    "chinese": "之后，我们去外面。"
  },
  {
    "id": "story_kindergarten:26",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 26,
    "kind": "body",
    "english": "Some children climb and exercise.",
    "chinese": "一些小朋友在攀爬和运动。"
  },
  {
    "id": "story_kindergarten:27",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 27,
    "kind": "body",
    "english": "One boy wears big black boots.",
    "chinese": "一个男孩穿着大大的黑色靴子。"
  },
  {
    "id": "story_kindergarten:28",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 28,
    "kind": "body",
    "english": "A little dog runs near us.",
    "chinese": "一只小狗在我们旁边跑来跑去。"
  },
  {
    "id": "story_kindergarten:29",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 29,
    "kind": "body",
    "english": "“Can he swim?” I ask.",
    "chinese": "“它会游泳吗？”我问。"
  },
  {
    "id": "story_kindergarten:30",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 30,
    "kind": "body",
    "english": "“Yes, he can!” says my teacher.",
    "chinese": "“会的！”老师说。"
  },
  {
    "id": "story_kindergarten:31",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 31,
    "kind": "body",
    "english": "Now I am not sad or afraid.",
    "chinese": "现在我不伤心，也不害怕了。"
  },
  {
    "id": "story_kindergarten:32",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 32,
    "kind": "body",
    "english": "I am happy here.",
    "chinese": "我在这里很开心。"
  },
  {
    "id": "story_kindergarten:33",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 33,
    "kind": "body",
    "english": "This kindergarten is new and fun.",
    "chinese": "这个幼儿园既新又有趣。"
  },
  {
    "id": "story_kindergarten:34",
    "sourceId": "story_kindergarten",
    "sourceTitle": "Story 2 · Kindergarten",
    "sourceType": "story",
    "order": 34,
    "kind": "body",
    "english": "I love my school, my teacher and my new friends.",
    "chinese": "我爱我的学校、老师和新朋友们。"
  },
  {
    "id": "story_primary_school:01",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 1,
    "kind": "title",
    "english": "Hello, School!",
    "chinese": "你好，学校！"
  },
  {
    "id": "story_primary_school:02",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 2,
    "kind": "title",
    "english": "My First Day at Primary School",
    "chinese": "我在小学的第一天"
  },
  {
    "id": "story_primary_school:03",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 3,
    "kind": "body",
    "english": "Good morning! Today is my first day at primary school.",
    "chinese": "早上好！今天是我上小学的第一天。"
  },
  {
    "id": "story_primary_school:04",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 4,
    "kind": "body",
    "english": "My teacher stands at the classroom door with a big smile.",
    "chinese": "老师面带微笑站在教室门口。"
  },
  {
    "id": "story_primary_school:05",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 5,
    "kind": "body",
    "english": "“Good morning! I’m Miss Wang,” she says.",
    "chinese": "“早上好！我是王老师。”她说道。"
  },
  {
    "id": "story_primary_school:06",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 6,
    "kind": "body",
    "english": "“Good morning, Miss Wang! I’m Helen,” I say.",
    "chinese": "“王老师，早上好！我是Helen。”我说道。"
  },
  {
    "id": "story_primary_school:07",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 7,
    "kind": "body",
    "english": "“Nice to meet you, Helen.”",
    "chinese": "“很高兴认识你，Helen。”"
  },
  {
    "id": "story_primary_school:08",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 8,
    "kind": "body",
    "english": "“Nice to meet you, too.”",
    "chinese": "“我也很高兴认识您。”"
  },
  {
    "id": "story_primary_school:09",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 9,
    "kind": "body",
    "english": "Miss Wang points to a desk and says, “This is your seat.”",
    "chinese": "王老师指着一张课桌说：“这是你的座位。”"
  },
  {
    "id": "story_primary_school:10",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 10,
    "kind": "body",
    "english": "A girl sits next to me, and she has a pink pencil box.",
    "chinese": "一个女孩坐在我的旁边，她有一个粉色的文具盒。"
  },
  {
    "id": "story_primary_school:11",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 11,
    "kind": "body",
    "english": "“Hello! I’m Amy. What’s your name?” she asks.",
    "chinese": "“你好！我是Amy。你叫什么名字？”她问。"
  },
  {
    "id": "story_primary_school:12",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 12,
    "kind": "body",
    "english": "“My name is Helen. Nice to meet you!”",
    "chinese": "“我叫Helen。很高兴认识你！”"
  },
  {
    "id": "story_primary_school:13",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 13,
    "kind": "body",
    "english": "“Nice to meet you, too. Do you want to be my friend?”",
    "chinese": "“我也很高兴认识你。你愿意做我的朋友吗？”"
  },
  {
    "id": "story_primary_school:14",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 14,
    "kind": "body",
    "english": "“Yes, I do!”",
    "chinese": "“是的，我愿意！”"
  },
  {
    "id": "story_primary_school:15",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 15,
    "kind": "body",
    "english": "The school bell rings, and our first class starts.",
    "chinese": "上课铃响了，我们的第一节课开始了。"
  },
  {
    "id": "story_primary_school:16",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 16,
    "kind": "body",
    "english": "Miss Wang says, “Show me your school things, please.”",
    "chinese": "王老师说：“请给我看看你们的学习用品。”"
  },
  {
    "id": "story_primary_school:17",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 17,
    "kind": "body",
    "english": "I put my schoolbag on the desk and say, “Here is my schoolbag.”",
    "chinese": "我把书包放在课桌上，说：“这是我的书包。”"
  },
  {
    "id": "story_primary_school:18",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 18,
    "kind": "body",
    "english": "I open it and put my school things on the desk.",
    "chinese": "我打开书包，把学习用品放在课桌上。"
  },
  {
    "id": "story_primary_school:19",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 19,
    "kind": "body",
    "english": "“Here is my book, and here is my pencil box.”",
    "chinese": "“这是我的书，这是我的文具盒。”"
  },
  {
    "id": "story_primary_school:20",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 20,
    "kind": "body",
    "english": "“Here are my pencil, ruler and eraser.”",
    "chinese": "“这些是我的铅笔、尺子和橡皮。”"
  },
  {
    "id": "story_primary_school:21",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 21,
    "kind": "body",
    "english": "Miss Wang points to my pencil and asks, “What’s this?”",
    "chinese": "王老师指着我的铅笔问：“这是什么？”"
  },
  {
    "id": "story_primary_school:22",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 22,
    "kind": "body",
    "english": "“It’s my pencil,” I answer.",
    "chinese": "“这是我的铅笔。”我回答。"
  },
  {
    "id": "story_primary_school:23",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 23,
    "kind": "body",
    "english": "Amy points to my eraser and asks, “What’s that?”",
    "chinese": "Amy指着我的橡皮问：“那是什么？”"
  },
  {
    "id": "story_primary_school:24",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 24,
    "kind": "body",
    "english": "“It’s my eraser,” I say.",
    "chinese": "“那是我的橡皮。”我说道。"
  },
  {
    "id": "story_primary_school:25",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 25,
    "kind": "body",
    "english": "Miss Wang says, “Your ruler, please.”",
    "chinese": "王老师说：“请把你的尺子拿给我看一下。”"
  },
  {
    "id": "story_primary_school:26",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 26,
    "kind": "body",
    "english": "“Here is my ruler,” I say.",
    "chinese": "“这是我的尺子。”我说道。"
  },
  {
    "id": "story_primary_school:27",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 27,
    "kind": "body",
    "english": "“Hooray! I’m ready for class!”",
    "chinese": "“太好了！我准备好上课了！”"
  },
  {
    "id": "story_primary_school:28",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 28,
    "kind": "body",
    "english": "Our teacher says, “Open your books. Let’s read together.”",
    "chinese": "老师说：“打开你们的书，让我们一起读吧。”"
  },
  {
    "id": "story_primary_school:29",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 29,
    "kind": "body",
    "english": "We read, listen and learn together.",
    "chinese": "我们一起读、一起听、一起学习。"
  },
  {
    "id": "story_primary_school:30",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 30,
    "kind": "body",
    "english": "At break time, Amy says, “Come on! Let’s play together!”",
    "chinese": "课间休息时，Amy说：“来吧！让我们一起玩吧！”"
  },
  {
    "id": "story_primary_school:31",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 31,
    "kind": "body",
    "english": "We run, jump and skip in the playground.",
    "chinese": "我们在操场上跑步、跳跃和蹦跳。"
  },
  {
    "id": "story_primary_school:32",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 32,
    "kind": "body",
    "english": "In the afternoon, Miss Wang says, “Good afternoon, children!”",
    "chinese": "下午，王老师说：“孩子们，下午好！”"
  },
  {
    "id": "story_primary_school:33",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 33,
    "kind": "body",
    "english": "At the end of the day, we say, “Goodbye, Miss Wang! See you tomorrow!”",
    "chinese": "一天结束时，我们说：“王老师，再见！明天见！”"
  },
  {
    "id": "story_primary_school:34",
    "sourceId": "story_primary_school",
    "sourceTitle": "Story 3 · Hello, School!",
    "sourceType": "story",
    "order": 34,
    "kind": "body",
    "english": "I have a new teacher, a new friend and a happy first day at school.",
    "chinese": "我有了一位新老师、一个新朋友，也度过了快乐的入学第一天。"
  }
].map((item) => ({
  ...item,
  storyId: item.sourceId,
  storyTitle: item.sourceTitle,
  normalizedTokens: tokenizeEnglishSentence(item.english)
}));

const STORY_SENTENCES = SOURCE_EXAMPLES.filter((item) => item.sourceType === "story");
const WORD_EXAMPLE_INDEX = buildWordExampleIndex(SOURCE_EXAMPLES);

const ENGLISH_LEGACY_PATTERN_SNIPPETS = [
  { source: "story_primary_school", pattern: "This is {thing}.", blocks: ["This is", "{thing}"] },
  { source: "story_primary_school", pattern: "Here is my {thing}.", blocks: ["Here is", "my {thing}"] },
  { source: "story_primary_school", pattern: "{person} is my {description}.", blocks: ["{person}", "is", "my {description}"] },
  { source: "story_kindergarten", pattern: "I like {thing}.", blocks: ["I like", "{thing}"] },
  { source: "story_zoo", pattern: "I can {action}.", blocks: ["I can", "{action}"] },
  { source: "story_zoo", pattern: "We see {thing}.", blocks: ["We see", "{thing}"] }
];

const ENGLISH_PATTERN_LIBRARY = [
  patternItem("greeting_good_morning_afternoon", "greeting", "Good morning / Good afternoon", "Good morning / Good afternoon", "用于早上或下午打招呼。", ["story_primary_school", "grade_one_core"], [["Good morning!", "早上好！", "Story 3 · Hello, School"], ["Good afternoon, children!", "孩子们，下午好！", "Story 3 · Hello, School"]]),
  patternItem("self_intro_im_name", "self_introduction", "I'm + 名字", "I'm + name", "用于介绍自己是谁。", ["story_primary_school", "grade_one_core"], [["I'm Miss Wang.", "我是王老师。", "Story 3 · Hello, School"], ["I'm Helen.", "我是Helen。", "Story 3 · Hello, School"]]),
  patternItem("self_intro_my_name_is", "self_introduction", "My name is + 名字", "My name is + name", "用于介绍自己的名字。", ["story_primary_school", "grade_one_core"], [["My name is Helen.", "我叫Helen。", "Story 3 · Hello, School"]]),
  patternItem("nice_to_meet_you", "greeting", "Nice to meet you", "Nice to meet you", "用于第一次见面时表示很高兴认识对方。", ["story_primary_school", "grade_one_core"], [["Nice to meet you, Helen.", "很高兴认识你，Helen。", "Story 3 · Hello, School"], ["Nice to meet you, too.", "我也很高兴认识你。", "Story 3 · Hello, School"]]),
  patternItem("what_is_your_name", "question", "What's your name?", "What's your name?", "用于询问对方叫什么名字。", ["story_primary_school", "grade_one_core"], [["What's your name?", "你叫什么名字？", "Story 3 · Hello, School"]]),
  patternItem("this_is_your_thing", "object_identification", "This is your + 物品", "This is your + thing", "用于指出某个东西是对方的。", ["story_primary_school", "grade_one_core"], [["This is your seat.", "这是你的座位。", "Story 3 · Hello, School"]]),
  patternItem("this_that_is_noun", "object_identification", "This / That is + 名词", "This / That is + noun", "用于说明这个或那个是什么。", ["story_zoo", "story_primary_school", "grade_one_core"], [["That is a panda.", "那是一只熊猫。", "Story 1 · ZOO"], ["This is your seat.", "这是你的座位。", "Story 3 · Hello, School"]]),
  patternItem("it_is_noun_or_adj", "object_identification", "It is + 名词 / 形容词", "It is + noun / adjective", "用于说明它是什么，或者它怎么样。", ["story_zoo", "story_kindergarten", "grade_one_core"], [["It is black and white.", "它是黑白相间的。", "Story 1 · ZOO"], ["It is so fun.", "太好玩了。", "Story 2 · Kindergarten"]]),
  patternItem("whats_this_that", "question", "What's this / that?", "What's this / that?", "用于询问这个或那个是什么。", ["story_zoo", "story_primary_school", "grade_one_core"], [["What is that?", "那是什么？", "Story 1 · ZOO"], ["What's this?", "这是什么？", "Story 3 · Hello, School"], ["What's that?", "那是什么？", "Story 3 · Hello, School"]]),
  patternItem("its_my_thing", "object_identification", "It's my + 物品", "It's my + thing", "用于说明这是我的某个物品。", ["story_primary_school", "grade_one_core"], [["It's my pencil.", "这是我的铅笔。", "Story 3 · Hello, School"], ["It's my eraser.", "那是我的橡皮。", "Story 3 · Hello, School"]]),
  patternItem("here_is_my_thing", "object_identification", "Here is my + 物品", "Here is my + thing", "用于介绍“这是我的某个物品”。", ["story_primary_school", "textbook_core", "grade_one_core"], [["Here is my schoolbag.", "这是我的书包。", "Story 3 · Hello, School"], ["Here is my book.", "这是我的书。", "Story 3 · Hello, School"], ["Here is my ruler.", "这是我的尺子。", "Story 3 · Hello, School"]]),
  patternItem("here_are_my_things", "object_identification", "Here are my + 复数物品", "Here are my + plural things", "用于介绍多个属于自己的物品。", ["story_primary_school", "grade_one_core"], [["Here are my pencil, ruler and eraser.", "这些是我的铅笔、尺子和橡皮。", "Story 3 · Hello, School"]]),
  patternItem("thing_is_place", "location", "物品 + is + 位置", "Thing + is + place", "用于说明一个东西在哪里。", ["story_kindergarten", "story_primary_school", "textbook_core", "grade_one_core"], [["My schoolbag is on the desk.", "我的书包在课桌上。", "AI/Textbook Pattern"], ["It is under the chair.", "它在椅子下面。", "Story 2 · Kindergarten"]]),
  patternItem("subject_be_in_on_under_near_place", "location", "主语 + be + 方位介词 + 地点", "Subject + be + preposition + place", "用于说明人、动物或物品在某个位置。", ["story_zoo", "story_kindergarten", "story_primary_school", "grade_one_core"], [["They are in the big cage.", "它们在那个大笼子里。", "Story 1 · ZOO"], ["It is there.", "它在那里。", "Story 2 · Kindergarten"]]),
  patternItem("i_am_at_place_with_people", "location", "I am at + 地点 + with + 人", "I am at + place + with + people", "用于说明我和谁在什么地方。", ["story_zoo", "story_kindergarten"], [["I am at the zoo with my mom, dad and grandma.", "我和妈妈、爸爸、奶奶一起在动物园。", "Story 1 · ZOO"], ["I am at my kindergarten with my mom and dad.", "我和爸爸妈妈来到我的幼儿园。", "Story 2 · Kindergarten"]]),
  patternItem("there_are_plural_place", "there_be", "There are + 复数名词 + 地点", "There are + plural nouns + place", "用于表达某处有很多人或物。", ["story_kindergarten", "prior_lessons", "grade_one_core"], [["There are many children here.", "这里有很多小朋友。", "Story 2 · Kindergarten"]]),
  patternItem("is_there_anything_subject_want_to_verb", "there_be", "Is there anything + 主语 + want to + 动词", "Is there anything + subject + want to + verb", "用于询问某人有没有想要做或想要吃的东西。", ["story_zoo", "prior_lessons"], [["Is there anything you want to eat, baby?", "宝宝，你想吃点什么吗？", "Story 1 · ZOO"]]),
  patternItem("subject_want_to_verb", "want_need_like", "主语 + want to + 动词（短语）", "Subject + want to + verb phrase", "表示某人想要做某事，want to后面接动词原形。", ["story_zoo", "story_kindergarten", "story_primary_school", "prior_lessons", "grade_one_core"], [["I want to eat some bread.", "我想吃一些面包。", "AI Example"], ["Do you want to play with us?", "你想和我们一起玩吗？", "Story 2 · Kindergarten"], ["Do you want to be my friend?", "你愿意做我的朋友吗？", "Story 3 · Hello, School"]]),
  patternItem("do_you_want_to_verb", "question", "Do you want to + 动词（短语）?", "Do you want to + verb phrase?", "用于询问对方是否想做某事。", ["story_kindergarten", "story_primary_school", "prior_lessons"], [["Do you want to play with us?", "你想和我们一起玩吗？", "Story 2 · Kindergarten"], ["Do you want to be my friend?", "你愿意做我的朋友吗？", "Story 3 · Hello, School"]]),
  patternItem("subject_need_to_verb", "want_need_like", "主语 + need to + 动词", "Subject + need to + verb", "表示某人需要做某事。", ["story_zoo", "prior_lessons", "grade_one_core"], [["I need to know.", "我想知道。", "Story 1 · ZOO"], ["I need to find something for the pandas.", "我想找些东西给熊猫吃。", "Story 1 · ZOO"]]),
  patternItem("subject_like_object", "preference", "主语 + like / love + 名词", "Subject + like / love + noun", "用于表达喜欢某人、某物或某地方。", ["story_zoo", "story_kindergarten", "prior_lessons", "grade_one_core"], [["I like elephants.", "我喜欢大象。", "Story 1 · ZOO"], ["I love this zoo.", "我爱这个动物园。", "Story 1 · ZOO"], ["I like her bag very much.", "我非常喜欢她的书包。", "Story 2 · Kindergarten"]]),
  patternItem("do_you_like_object", "question", "Do you like + 名词?", "Do you like + noun?", "用于询问对方是否喜欢某人、某物或某地方。", ["story_zoo", "story_kindergarten", "prior_lessons", "grade_one_core"], [["Do you like this zoo, baby?", "宝宝，你喜欢这个动物园吗？", "Story 1 · ZOO"], ["Do you like her?", "你喜欢它吗？", "Story 1 · ZOO"], ["Do you like the food here?", "你喜欢这里的食物吗？", "Story 2 · Kindergarten"]]),
  patternItem("which_noun_do_you_like", "question", "Which + 名词 + do you like?", "Which + noun + do you like?", "用于询问对方喜欢哪一个或哪一种。", ["story_zoo", "prior_lessons"], [["Which animal do you like, mom?", "妈妈，你喜欢哪一种动物？", "Story 1 · ZOO"]]),
  patternItem("yes_i_do", "question", "Yes, I do", "Yes, I do", "用于回答Do开头的一般疑问句。", ["story_zoo", "story_kindergarten", "story_primary_school", "prior_lessons"], [["Yes, I do!", "是的，我愿意！", "Story 3 · Hello, School"], ["Yes, they do.", "是的，它们吃。", "Story 1 · ZOO"]]),
  patternItem("can_subject_verb", "ability", "Can + 主语 + 动词?", "Can + subject + verb?", "用于询问某人或动物是否会做某事。", ["story_zoo", "story_kindergarten", "prior_lessons", "grade_one_core"], [["Can we go there to look at her?", "我们能去那里看它吗？", "Story 1 · ZOO"], ["Can he swim?", "它会游泳吗？", "Story 2 · Kindergarten"]]),
  patternItem("subject_can_verb", "ability", "主语 + can + 动词", "Subject + can + verb", "用于表达某人或动物会做某事。", ["story_kindergarten", "prior_lessons", "grade_one_core"], [["Some boys can run very fast.", "一些男孩跑得非常快。", "Story 2 · Kindergarten"], ["Some girls can jump and skip.", "一些女孩会跳和蹦跳。", "Story 2 · Kindergarten"]]),
  patternItem("subject_cant_verb", "ability", "主语 + can't + 动词", "Subject + can't + verb", "用于表达某人不能或不会做某事。", ["story_zoo", "story_kindergarten", "prior_lessons"], [["I can't find them.", "我找不到它们。", "Story 1 · ZOO"], ["I can't find my book.", "我找不到我的书了。", "Story 2 · Kindergarten"]]),
  patternItem("subject_be_v_ing", "present_continuous", "主语 + be + 动词ing", "Subject + be + verb-ing", "用于表达正在做某事。", ["story_zoo", "prior_lessons", "grade_one_core"], [["They are walking.", "它们正在走路。", "Story 1 · ZOO"]]),
  patternItem("subject_simple_present_verb_object", "action", "主语 + 动词 + 宾语", "Subject + verb + object", "用于表达某人做某个动作。", ["story_zoo", "story_kindergarten", "story_primary_school", "grade_one_core"], [["They eat some meat every day.", "它们每天吃一些肉。", "Story 1 · ZOO"], ["I drink some juice, too.", "我还喝了一些果汁。", "Story 2 · Kindergarten"], ["We read, listen and learn together.", "我们一起读、一起听、一起学习。", "Story 3 · Hello, School"]]),
  patternItem("do_subject_verb", "question", "Do + 主语 + 动词?", "Do + subject + verb?", "用于构成一般疑问句，询问是否做某事。", ["story_zoo", "story_kindergarten", "story_primary_school", "prior_lessons"], [["Do they eat meat?", "它们吃肉吗？", "Story 1 · ZOO"], ["Do you like the food here?", "你喜欢这里的食物吗？", "Story 2 · Kindergarten"]]),
  patternItem("where_be_subject", "question", "Where + be + 主语?", "Where + be + subject?", "用于询问某人或某物在哪里。", ["story_zoo", "story_kindergarten", "prior_lessons", "grade_one_core"], [["Where are the tigers?", "老虎在哪里？", "Story 1 · ZOO"], ["Where is my book?", "我的书在哪里？", "Story 2 · Kindergarten"]]),
  patternItem("subject_has_object", "possession", "主语 + has / have + 物品", "Subject + has / have + object", "用于表达某人有某个东西。", ["story_kindergarten", "story_primary_school", "grade_one_core"], [["She has a purple bag.", "她有一个紫色的书包。", "Story 2 · Kindergarten"], ["She has a pink pencil box.", "她有一个粉色的文具盒。", "Story 3 · Hello, School"], ["I have a new teacher, a new friend and a happy first day at school.", "我有了一位新老师、一个新朋友，也度过了快乐的入学第一天。", "Story 3 · Hello, School"]]),
  patternItem("subject_stands_sits_points", "action", "主语 + 第三人称单数动词", "Subject + verb-s", "当主语是he、she或单个人名时，动词通常加s或es。", ["story_primary_school", "prior_lessons", "grade_one_core"], [["My teacher stands at the classroom door.", "老师站在教室门口。", "Story 3 · Hello, School"], ["A girl sits next to me.", "一个女孩坐在我的旁边。", "Story 3 · Hello, School"], ["Miss Wang points to my pencil.", "王老师指着我的铅笔。", "Story 3 · Hello, School"]]),
  patternItem("subject_says_quote", "action", "主语 + says", "Subject + says", "用于表达某人说道。", ["story_kindergarten", "story_primary_school", "grade_one_core"], [["She says with a smile.", "她微笑着说。", "Story 2 · Kindergarten"], ["Miss Wang says, \"Show me your school things, please.\"", "王老师说：“请给我看看你们的学习用品。”", "Story 3 · Hello, School"]]),
  patternItem("imperative_verb_object", "imperative", "动词原形 + 宾语", "Verb + object", "用于发出简单指令或请求。", ["story_zoo", "story_primary_school", "grade_one_core"], [["Look!", "看！", "Story 1 · ZOO"], ["Open your books.", "打开你们的书。", "Story 3 · Hello, School"], ["Show me your school things, please.", "请给我看看你们的学习用品。", "Story 3 · Hello, School"]]),
  patternItem("dont_verb", "imperative", "Don't + 动词原形", "Don't + verb", "用于提醒别人不要做某事。", ["story_zoo", "prior_lessons", "grade_one_core"], [["Don't run fast.", "别跑太快。", "Story 1 · ZOO"]]),
  patternItem("lets_verb_together", "imperative", "Let's + 动词 + together", "Let's + verb + together", "用于邀请别人一起做某事。", ["story_primary_school", "grade_one_core"], [["Let's read together.", "让我们一起读吧。", "Story 3 · Hello, School"], ["Let's play together!", "让我们一起玩吧！", "Story 3 · Hello, School"]]),
  patternItem("come_here_on", "imperative", "Come here / Come on", "Come here / Come on", "用于让别人过来，或邀请别人一起行动。", ["story_zoo", "story_primary_school", "grade_one_core"], [["Come here, baby.", "过来这里，宝宝。", "Story 1 · ZOO"], ["Come on!", "来吧！", "Story 3 · Hello, School"]]),
  patternItem("at_time_subject_verb", "time_scene", "At + 时间 + 主语 + 动词", "At + time + subject + verb", "用于说明在某个时间发生了什么。", ["story_kindergarten", "story_primary_school", "grade_one_core"], [["At snack time, I eat some bread, cookies and an apple.", "点心时间，我吃了一些面包、饼干和一个苹果。", "Story 2 · Kindergarten"], ["At break time, Amy says, \"Come on!\"", "课间休息时，Amy说：“来吧！”", "Story 3 · Hello, School"]]),
  patternItem("after_that_subject_verb", "time_scene", "After that, 主语 + 动词", "After that, subject + verb", "用于说明接下来发生的事情。", ["story_kindergarten"], [["After that, we go outside.", "之后，我们去外面。", "Story 2 · Kindergarten"]]),
  patternItem("at_end_of_day_subject_say", "time_scene", "At the end of the day, 主语 + say", "At the end of the day, subject + say", "用于说明一天结束时说了什么或发生了什么。", ["story_primary_school"], [["At the end of the day, we say, \"Goodbye, Miss Wang!\"", "一天结束时，我们说：“王老师，再见！”", "Story 3 · Hello, School"]]),
  patternItem("subject_be_not_adj_or_adj", "object_identification", "主语 + be + not + 形容词 + or + 形容词", "Subject + be + not + adjective + or + adjective", "用于表达某人现在不是某种状态，也不是另一种状态。", ["story_kindergarten", "grade_one_core"], [["Now I am not sad or afraid.", "现在我不伤心，也不害怕了。", "Story 2 · Kindergarten"]]),
  patternItem("subject_doing_did_do_contrast", "action", "do / doing / did 动作变化", "do / doing / did", "用于区分做、正在做、做过这些动作状态。", ["prior_lessons"], [["I do my homework.", "我做作业。", "Prior Lesson"], ["I am doing my homework.", "我正在做作业。", "Prior Lesson"], ["I did my homework.", "我做完了作业。", "Prior Lesson"]]),
  patternItem("subject_like_need_want_to_verb", "want_need_like", "主语 + like / need / want to + 动词", "Subject + like / need / want to + verb", "用于表达喜欢做、需要做、想要做某事。", ["prior_lessons", "grade_one_core"], [["I want to eat.", "我想吃。", "Prior Lesson"], ["I need to go.", "我需要走。", "Prior Lesson"], ["I like to run.", "我喜欢跑步。", "Prior Lesson"]]),
  patternItem("subject_dont_verb_anything_except_noun", "action", "主语 + don't + 动词 + anything except + 名词", "Subject + don't + verb + anything except + noun", "用于表达除了某物以外，什么都不做或不吃。", ["story_zoo"], [["They don't eat anything except bamboo.", "它们除了竹子，什么都不吃。", "Story 1 · ZOO"]]),
  patternItem("thank_you_you_are_welcome", "greeting", "Thank you / You're welcome", "Thank you / You're welcome", "用于表达感谢和回应感谢。", ["story_zoo", "story_kindergarten", "grade_one_core"], [["Thank you, mom and dad.", "谢谢爸爸妈妈。", "Story 1 · ZOO"], ["You are welcome.", "别客气。", "Story 2 · Kindergarten"]]),
  patternItem("goodbye_see_you_tomorrow", "greeting", "Goodbye / See you tomorrow", "Goodbye / See you tomorrow", "用于告别和约定明天见。", ["story_primary_school", "grade_one_core"], [["Goodbye, Miss Wang! See you tomorrow!", "王老师，再见！明天见！", "Story 3 · Hello, School"]])
];

function patternItem(id, category, displayZh, displayEn, explanationZh, sourceTags, seeds) {
  return {
    id,
    category,
    displayZh,
    displayEn,
    explanationZh,
    sourceTags,
    exampleSeeds: seeds.map(([english, chinese, source]) => ({ english, chinese, source }))
  };
}

const ENGLISH_BLOCK_PATTERNS = ENGLISH_PATTERN_LIBRARY.map((pattern) => {
  const first = pattern.exampleSeeds[0] || { english: pattern.displayEn, chinese: "" };
  return {
    ...pattern,
    internalTemplate: pattern.displayEn,
    pattern: pattern.displayEn,
    displayFormulaZh: pattern.displayZh,
    displayFormulaEn: pattern.displayEn,
    example: first.english,
    translationZh: first.chinese,
    sources: pattern.sourceTags,
    level: "v3.0.0",
    status: "learning",
    grammarTags: [pattern.category],
    blocks: splitSentenceToBlocks(first.english)
  };
});

const PRIOR_LESSON_WORDS = [
  "where", "here", "there",
  "no", "know", "now",
  "tea", "teach", "teacher", "teaches",
  "through", "throw",
  "do", "doing", "did", "does",
  "want", "need", "like",
  "skip", "jump", "hop",
  "eat", "eating", "ate"
];

const GRADE_ONE_CORE_WORDS = [
  "a", "afraid", "afternoon", "again", "all", "am", "an", "and",
  "angry", "animal", "animals", "answer", "apple", "are", "arm", "arms",
  "ask", "at", "baby", "bad", "bag", "ball", "banana", "bathroom",
  "be", "bear", "beautiful", "bedroom", "big", "bike", "bird", "black",
  "blue", "board", "book", "boots", "bottle", "box", "boy", "bread",
  "brother", "brown", "but", "bye", "cake", "can", "can't", "cannot",
  "cap", "car", "cat", "catch", "chair", "chicken", "child", "children",
  "circle", "class", "classroom", "clean", "climb", "close", "cloud",
  "coat", "cold", "color", "come", "cookie", "cookies", "cow", "crayon",
  "cup", "cute", "dad", "dance", "day", "desk", "dirty", "do", "does",
  "dog", "doll", "door", "draw", "dress", "drink", "duck", "ear",
  "ears", "eat", "egg", "eight", "eighteen", "elephant", "eleven",
  "eraser", "evening", "eye", "eyes", "face", "family", "fast",
  "father", "feet", "fifteen", "find", "first", "fish", "five", "food",
  "foot", "for", "four", "fourteen", "friend", "friends", "frog",
  "from", "fun", "funny", "girl", "give", "go", "good", "goodbye",
  "grandma", "grandpa", "grape", "gray", "green", "grey", "hair",
  "hand", "hands", "happy", "has", "hat", "have", "he", "head", "hear",
  "hello", "help", "her", "here", "hi", "him", "his", "home",
  "homework", "hop", "horse", "hospital", "hot", "how", "hungry", "i",
  "in", "is", "it", "juice", "jump", "kind", "kitchen", "kite",
  "know", "last", "leg", "legs", "lesson", "letter", "library", "like",
  "lion", "listen", "little", "long", "look", "love", "make", "man",
  "many", "me", "meat", "meet", "milk", "mom", "monkey", "morning",
  "mother", "mouth", "much", "mum", "my", "name", "near", "need",
  "new", "next", "nice", "night", "nine", "nineteen", "no", "noodles",
  "nose", "not", "notebook", "number", "of", "old", "on", "one",
  "open", "or", "orange", "our", "panda", "paper", "park", "pear",
  "pen", "pencil", "picture", "pig", "pink", "play", "playground",
  "please", "primary", "pupil", "purple", "put", "rabbit", "rain",
  "read", "ready", "red", "rice", "room", "ruler", "run", "sad", "say",
  "school", "schoolbag", "seat", "see", "seven", "seventeen", "she",
  "sheep", "shirt", "shoe", "shoes", "shop", "short", "sing", "sister",
  "sit", "six", "sixteen", "skip", "skirt", "sleep", "slow", "small",
  "snow", "sock", "socks", "some", "sorry", "square", "stand", "star",
  "student", "sun", "swim", "take", "tall", "tea", "teacher", "ten",
  "thank", "thanks", "that", "the", "their", "them", "there", "these",
  "they", "think", "thirsty", "thirteen", "this", "those", "three",
  "throw", "tiger", "tired", "to", "today", "together", "tomorrow",
  "too", "toy", "toys", "train", "triangle", "twelve", "twenty", "two",
  "under", "us", "very", "wake", "walk", "want", "wash", "water",
  "watermelon", "we", "welcome", "what", "when", "where", "which",
  "white", "who", "why", "will", "wind", "window", "with", "woman",
  "word", "write", "yellow", "yes", "you", "your", "zero", "zoo"
];

const BEIJING_GRADE1_SEMESTER_1_WORDS = [];

const BEIJING_GRADE1_SEMESTER_1_LIBRARY = {
  textbookId: "beijing_grade1_semester_1",
  title: "北京版小学一年级英语上册",
  coverageStatus: "partial",
  expectedUnits: null,
  importedUnits: [],
  missingUnits: [],
  units: []
};

const BEIJING_GRADE1_SEMESTER_1_SENTENCE_LIBRARY = {
  textbookId: "beijing_grade1_semester_1",
  title: "北京版小学一年级英语上册句型库",
  coverageStatus: "partial",
  units: []
};

const ENGLISH_MEANINGS = {
  a: "一个；一只", all: "全部", am: "是", and: "和；并且", animal: "动物", animals: "动物们", anything: "任何东西", are: "是",
  at: "在", baby: "宝宝；幼小的", bamboo: "竹子", big: "大的", black: "黑色的", cage: "笼子", can: "能；会", "can't": "不能；不会",
  come: "来", cute: "可爱的", dad: "爸爸", day: "一天；白天", do: "做", "don't": "不要；不", eat: "吃", elephants: "大象们",
  every: "每一个", except: "除了", family: "家庭；家人", fast: "快的", find: "找到", for: "为了；给", go: "去", grandma: "奶奶；外婆",
  happy: "开心的", her: "她的；她", here: "这里", i: "我", in: "在里面", is: "是", it: "它；这", kind: "友好的；种类", know: "知道",
  like: "喜欢；像", look: "看", love: "爱；喜欢", meat: "肉", mom: "妈妈", my: "我的", need: "需要", no: "不；没有", oh: "哦",
  ok: "好的", panda: "熊猫", pandas: "熊猫们", run: "跑", see: "看见", she: "她", so: "所以；很", some: "一些",
  something: "某样东西", sure: "当然；确定", thank: "谢谢", that: "那个", the: "这个；那个", them: "他们；它们", there: "那里", they: "他们；它们",
  this: "这个", tigers: "老虎们", to: "到；去", very: "非常", walking: "正在走", want: "想要", we: "我们", what: "什么",
  where: "哪里", which: "哪一个", white: "白色的", with: "和；带着", yes: "是的", you: "你；你们", zoo: "动物园",
  afraid: "害怕的", after: "在……之后", an: "一个", apple: "苹果", ask: "问", asks: "问；询问", bag: "书包；袋子", ball: "球",
  book: "书", boots: "靴子", boy: "男孩", boys: "男孩们", bread: "面包", but: "但是", chair: "椅子", children: "孩子们",
  clean: "干净的；打扫", climb: "爬", cookies: "饼干", dog: "狗", drink: "喝", exercise: "锻炼；练习", first: "第一；首先", food: "食物",
  friends: "朋友们", fun: "有趣", girl: "女孩", girls: "女孩们", has: "有", hat: "帽子", he: "他", hop: "单脚跳",
  juice: "果汁", jump: "跳", kindergarten: "幼儿园", little: "小的", many: "许多", much: "许多；很", near: "在附近", new: "新的",
  not: "不", now: "现在", one: "一", or: "或者", outside: "外面", pink: "粉色的", play: "玩；游戏", purple: "紫色的",
  runs: "跑", sad: "伤心的", say: "说", says: "说", school: "学校", sing: "唱歌", skip: "跳；跳过", small: "小的",
  smile: "微笑", snack: "点心", song: "歌曲", swim: "游泳", teacher: "老师", teaches: "教", team: "队伍", throw: "扔",
  time: "时间", today: "今天", together: "一起", too: "也；太", under: "在下面", us: "我们", wears: "穿着", welcome: "欢迎", wow: "哇",
  afternoon: "下午", amy: "艾米", answer: "回答；答案", be: "是；成为", bell: "铃；铃声", books: "书；多本书", box: "盒子", break: "课间休息",
  class: "班级；课堂", classroom: "教室", desk: "课桌", door: "门", end: "结束", eraser: "橡皮", friend: "朋友", good: "好的",
  goodbye: "再见", have: "有", helen: "海伦", hello: "你好", hooray: "太好了；万岁", "i'm": "我是；我……", "it's": "它是；这是",
  learn: "学习", "let's": "让我们……", listen: "听", me: "我", meet: "遇见；认识", miss: "小姐；老师称呼", morning: "早上",
  name: "名字", next: "下一个", nice: "好的；友好的", of: "……的", on: "在上面", open: "打开", our: "我们的", pencil: "铅笔",
  playground: "操场", please: "请", points: "指向", primary: "小学的；初级的", put: "放", read: "读", ready: "准备好的", rings: "响起",
  ruler: "尺子", schoolbag: "书包", seat: "座位", show: "展示", sits: "坐着", stands: "站着", starts: "开始", things: "物品；东西",
  tomorrow: "明天", wang: "王", "what's": "是什么；叫什么", your: "你的；你们的", tea: "茶", teach: "教", through: "穿过；通过",
  doing: "正在做", did: "做过", does: "做；用于提问", eating: "正在吃", ate: "吃过",
  again: "再一次", angry: "生气的", arm: "胳膊", arms: "胳膊", bad: "不好的", banana: "香蕉", bathroom: "卫生间", bear: "熊",
  beautiful: "美丽的", bedroom: "卧室", bike: "自行车", bird: "鸟", blue: "蓝色的", board: "板；黑板", bottle: "瓶子",
  brother: "兄弟", brown: "棕色的", bye: "再见", cake: "蛋糕", cannot: "不能", cap: "帽子", car: "汽车", cat: "猫",
  catch: "接住；抓住", chicken: "鸡肉；小鸡", child: "孩子", circle: "圆形", close: "关闭", cloud: "云", coat: "外套", cold: "冷的",
  color: "颜色", cookie: "饼干", cow: "奶牛", crayon: "蜡笔", cup: "杯子", dance: "跳舞", dirty: "脏的", doll: "玩具娃娃",
  draw: "画画", dress: "连衣裙", duck: "鸭子", ear: "耳朵", ears: "耳朵", egg: "鸡蛋", eight: "八", eighteen: "十八",
  elephant: "大象", eleven: "十一", evening: "晚上", eye: "眼睛", eyes: "眼睛", face: "脸", father: "父亲", feet: "脚",
  fifteen: "十五", fish: "鱼", five: "五", foot: "脚", four: "四", fourteen: "十四", frog: "青蛙", from: "从；来自",
  funny: "有趣的", give: "给", grandpa: "爷爷；外公", grape: "葡萄", gray: "灰色的", green: "绿色的", grey: "灰色的", hair: "头发",
  hand: "手", hands: "手", head: "头", hear: "听见", hi: "你好", him: "他", his: "他的", home: "家",
  homework: "作业", horse: "马", hospital: "医院", hot: "热的", how: "怎样", hungry: "饿的", kitchen: "厨房", kite: "风筝",
  last: "最后的；上一个", leg: "腿", legs: "腿", lesson: "课", letter: "字母；信", library: "图书馆", lion: "狮子", long: "长的",
  make: "制作；使", man: "男人", milk: "牛奶", monkey: "猴子", mother: "母亲", mouth: "嘴", mum: "妈妈", night: "夜晚",
  nine: "九", nineteen: "十九", noodles: "面条", nose: "鼻子", notebook: "笔记本", number: "数字", old: "旧的；老的", orange: "橙子；橙色",
  paper: "纸", park: "公园", pear: "梨", pen: "钢笔", picture: "图片", pig: "猪", pupil: "小学生", rabbit: "兔子",
  rain: "雨；下雨", red: "红色的", rice: "米饭", room: "房间", seven: "七", seventeen: "十七", sheep: "羊", shirt: "衬衫",
  shoe: "鞋", shoes: "鞋子", shop: "商店", short: "短的；矮的", sister: "姐妹", sit: "坐", six: "六", sixteen: "十六",
  skirt: "裙子", sleep: "睡觉", slow: "慢的", snow: "雪", sock: "袜子", socks: "袜子", sorry: "对不起", square: "正方形",
  stand: "站", star: "星星", student: "学生", sun: "太阳", take: "拿；带走", tall: "高的", ten: "十", thanks: "谢谢",
  their: "他们的", these: "这些", think: "想；认为", thirsty: "渴的", thirteen: "十三", those: "那些", three: "三", tiger: "老虎",
  tired: "累的", toy: "玩具", toys: "玩具", train: "火车", triangle: "三角形", twelve: "十二", twenty: "二十", two: "二",
  wake: "醒来", walk: "走路", wash: "洗", water: "水", watermelon: "西瓜", what: "什么", when: "什么时候", who: "谁", why: "为什么",
  will: "将要", wind: "风", window: "窗户", woman: "女人", word: "单词", write: "写", yellow: "黄色的", zero: "零"
};

const PINYIN_MAP = {
  一: "yī", 二: "èr", 三: "sān", 四: "sì", 五: "wǔ", 六: "liù", 七: "qī", 八: "bā", 九: "jiǔ", 十: "shí",
  天: "tiān", 地: "dì", 人: "rén", 你: "nǐ", 我: "wǒ", 他: "tā", 上: "shàng", 下: "xià",
  口: "kǒu", 耳: "ěr", 目: "mù", 手: "shǒu", 足: "zú", 站: "zhàn", 坐: "zuò",
  日: "rì", 月: "yuè", 水: "shuǐ", 火: "huǒ", 山: "shān", 石: "shí", 田: "tián", 禾: "hé",
  对: "duì", 云: "yún", 雨: "yǔ", 风: "fēng", 花: "huā", 鸟: "niǎo", 虫: "chóng",
  爸: "bà", 妈: "mā", 马: "mǎ", 土: "tǔ", 不: "bù", 画: "huà", 打: "dǎ", 棋: "qí", 鸡: "jī",
  字: "zì", 词: "cí", 语: "yǔ", 句: "jù", 子: "zi", 桌: "zhuō", 纸: "zhǐ", 文: "wén",
  数: "shù", 学: "xué", 音: "yīn", 乐: "yuè", 妹: "mèi", 奶: "nǎi", 白: "bái", 皮: "pí",
  小: "xiǎo", 桥: "qiáo", 台: "tái", 雪: "xuě", 儿: "ér", 草: "cǎo", 家: "jiā", 是: "shì",
  车: "chē", 羊: "yáng", 走: "zǒu", 也: "yě", 早: "zǎo", 书: "shū", 刀: "dāo", 尺: "chǐ",
  本: "běn", 木: "mù", 林: "lín", 力: "lì", 心: "xīn", 中: "zhōng", 立: "lì", 正: "zhèng",
  大: "dà", 多: "duō", 少: "shǎo", 牛: "niú", 果: "guǒ", 加: "jiā", 减: "jiǎn", 等: "děng", 于: "yú", 共: "gòng", 还: "hái", 剩: "shèng", 左: "zuǒ", 右: "yòu", 前: "qián", 里: "lǐ", 外: "wài", 长: "cháng", 短: "duǎn", 高: "gāo", 矮: "ǎi", 轻: "qīng", 重: "zhòng", 比: "bǐ", 几: "jǐ", 图: "tú", 形: "xíng", 圆: "yuán", 方: "fāng", 角: "jiǎo", 元: "yuán", 分: "fēn", 合: "hé", 组: "zǔ", 成: "chéng", 算: "suàn", 式: "shì", 题: "tí", 案: "àn", 写: "xiě", 读: "dú", 个: "gè", 只: "zhī", 支: "zhī", 朵: "duǒ", 条: "tiáo", 该: "gāi", 刻: "kè", 放: "fàng",
  收: "shōu", 追: "zhuī", 骄: "jiāo", 傲: "ào", 坚: "jiān", 持: "chí", 终: "zhōng", 点: "diǎn", 兔: "tù", 龟: "guī", 赛: "sài", 跑: "pǎo", 铃: "líng", 响: "xiǎng", 回: "huí", 答: "dá", 后: "hòu", 来: "lái", 第: "dì", 乌: "wū", 课: "kè", 赢: "yíng", 坡: "pō", 弃: "qì", 签: "qiān",
  互: "hù", 相: "xiāng", 及: "jí", 时: "shí", 蚂: "mǎ", 蚁: "yǐ", 鸽: "gē"
};

const RADICAL_MAP = {
  一: "一", 二: "二", 三: "一", 四: "囗", 五: "二", 六: "八", 七: "一", 八: "八", 九: "丿", 十: "十",
  天: "大", 地: "土", 人: "人", 你: "亻", 我: "戈", 他: "亻", 上: "一", 下: "一",
  口: "口", 耳: "耳", 目: "目", 手: "手", 足: "足", 日: "日", 月: "月", 水: "水", 火: "火",
  山: "山", 石: "石", 田: "田", 禾: "禾", 对: "寸", 云: "二", 雨: "雨", 风: "风",
  花: "艹", 鸟: "鸟", 虫: "虫", 字: "宀", 词: "讠", 语: "讠", 句: "口", 子: "子",
  该: "讠", 刻: "刂", 放: "攵", 收: "攵", 骄: "马", 傲: "亻", 坚: "土", 持: "扌",
  终: "纟", 点: "灬"
};

const STROKE_MAP = {
  一: 1, 二: 2, 三: 3, 四: 5, 五: 4, 六: 4, 七: 2, 八: 2, 九: 2, 十: 2,
  天: 4, 地: 6, 人: 2, 你: 7, 我: 7, 他: 5, 上: 3, 下: 3, 口: 3, 耳: 6,
  目: 5, 手: 4, 足: 7, 日: 4, 月: 4, 水: 4, 火: 4, 山: 3, 石: 5, 田: 5,
  禾: 5, 对: 5, 云: 4, 雨: 8, 风: 4, 花: 7, 鸟: 5, 虫: 6, 字: 6, 词: 7,
  语: 9, 句: 5, 子: 3, 该: 8, 刻: 8, 放: 8, 收: 6, 骄: 9, 傲: 12,
  坚: 7, 持: 9, 终: 8, 点: 9
};

const STRUCTURE_MAP = {
  你: "左右", 他: "左右", 地: "左右", 对: "左右", 词: "左右", 语: "左右", 该: "左右",
  刻: "左右", 放: "左右", 收: "左右", 骄: "左右", 傲: "左右", 持: "左右", 终: "左右",
  字: "上下", 花: "上下", 坚: "上下", 点: "上下", 国: "全包围", 四: "全包围"
};

const COMMON_CHAR_INFO = {
  爸: ["父亲，爸爸", ["爸爸", "爸妈", "老爸"], "爸爸陪我读书"],
  妈: ["母亲，妈妈", ["妈妈", "爸妈", "姑妈"], "妈妈给我讲故事"],
  马: ["一种善于奔跑的动物", ["小马", "马车", "木马"], "木马在转来转去"],
  土: ["土地，泥土", ["土地", "泥土", "土山"], "小草长在土里"],
  不: ["表示否定", ["不是", "不好", "不用"], "我不怕困难"],
  画: ["用笔画出图形，也指图画", ["画画", "图画", "画家"], "我喜欢画画"],
  打: ["用手或工具击，也表示做某些动作", ["打开", "打球", "打字"], "请打开书本"],
  棋: ["棋类游戏用的子或棋盘", ["下棋", "棋子", "围棋"], "爷爷教我下棋"],
  鸡: ["一种家禽", ["小鸡", "公鸡", "母鸡"], "公鸡早上叫了"],
  字: ["记录语言的符号", ["汉字", "写字", "生字"], "我会写这个字"],
  词: ["由字组成、有意义的语言单位", ["词语", "组词", "生词"], "请读这个词语"],
  语: ["话，语言", ["语文", "语言", "词语"], "语文课上读故事"],
  句: ["一句话", ["句子", "短句", "造句"], "请读这个句子"],
  子: ["常作名词后缀，也指孩子", ["儿子", "句子", "日子"], "这个句子很短"],
  桌: ["放东西或写字用的家具", ["桌子", "书桌", "课桌"], "书放在课桌上"],
  纸: ["写字、画画用的薄片", ["白纸", "纸张", "彩纸"], "我在纸上写字"],
  文: ["文字，也指语文、文章", ["语文", "课文", "文字"], "今天读一篇课文"],
  数: ["数目，也表示计算", ["数学", "数字", "数数"], "数学课上学数字"],
  学: ["学习，求知识", ["学习", "学校", "数学"], "我喜欢学习"],
  音: ["声音", ["音乐", "声音", "拼音"], "拼音能帮助认字"],
  乐: ["快乐，也指音乐", ["音乐", "快乐", "乐曲"], "音乐课很有趣"],
  妹: ["妹妹，年纪较小的女孩", ["妹妹", "姐妹", "表妹"], "妹妹在唱歌"],
  奶: ["奶奶，也指乳汁", ["奶奶", "牛奶", "奶声"], "奶奶讲故事"],
  白: ["像雪一样的颜色", ["白云", "白纸", "白天"], "天上有白云"],
  皮: ["物体外面的一层", ["皮球", "果皮", "皮肤"], "苹果皮是红色的"],
  桥: ["架在水上或空中供人通行的建筑", ["小桥", "桥上", "大桥"], "小桥下面有流水"],
  台: ["高而平的地方或量词", ["讲台", "台上", "一台"], "老师站在讲台前"],
  雪: ["天空中落下的白色冰晶", ["下雪", "雪花", "白雪"], "雪花落下来"],
  儿: ["孩子，也常作词尾", ["儿子", "女儿", "花儿"], "花儿开了"],
  草: ["矮小的绿色植物", ["小草", "草地", "青草"], "小草绿绿的"],
  家: ["居住的地方，也指家庭", ["回家", "家人", "大家"], "放学后回家"],
  是: ["表示判断或肯定", ["是的", "不是", "可是"], "这是我的书"],
  车: ["有轮子的交通工具", ["汽车", "火车", "车子"], "火车开来了"],
  羊: ["一种吃草的动物", ["小羊", "山羊", "羊毛"], "小羊在草地上"],
  走: ["用脚移动", ["走路", "走开", "行走"], "我自己走路上学"],
  也: ["表示同样", ["也是", "也许", "也好"], "我也会读这个字"],
  早: ["时间在前，早晨", ["早上", "早安", "早饭"], "早上我去上学"],
  书: ["装订成册的读物", ["书本", "读书", "书包"], "我喜欢读书"],
  刀: ["切东西的工具", ["小刀", "刀子", "剪刀"], "小刀要小心使用"],
  尺: ["量长度的工具", ["尺子", "直尺", "米尺"], "用尺子画线"],
  本: ["书本，也表示根本", ["书本", "本子", "一本"], "我有一个本子"],
  林: ["许多树木聚在一起", ["树林", "森林", "林子"], "树林里有小鸟"],
  力: ["力量", ["力气", "用力", "努力"], "我会努力练习"],
  心: ["心脏，也指思想感情", ["开心", "小心", "心里"], "我心里很高兴"],
  中: ["中间，里面", ["中间", "中国", "心中"], "苹果在桌子中间"],
  立: ["站着，也表示建立", ["立正", "站立", "立刻"], "上课前要立正"],
  正: ["不偏，也表示正确", ["正确", "立正", "正好"], "这个答案正确"],
  牛: ["一种家畜", ["小牛", "牛奶", "黄牛"], "小牛在吃草"],
  果: ["果实", ["水果", "苹果", "果子"], "我爱吃水果"],
  加: ["增加，合在一起", ["加法", "加上", "增加"], "三加二等于五"],
  减: ["去掉一部分，数量变少", ["减法", "减少", "减去"], "五减二等于三"],
  等: ["相同，也表示等待", ["等于", "相等", "等待"], "两边数量相等"],
  于: ["在，也用于等于一词", ["等于", "于是", "关于"], "三加二等于五"],
  共: ["合在一起的总数", ["一共", "共同", "共有"], "一共有五朵花"],
  还: ["仍然，也表示另外", ["还有", "还剩", "还是"], "盒子里还有两个苹果"],
  剩: ["留下没有用完的部分", ["还剩", "剩下", "剩余"], "吃掉两个，还剩三个"],
  左: ["面向前方时靠左的一边", ["左边", "左右", "左手"], "左边有一本书"],
  右: ["面向前方时靠右的一边", ["右边", "左右", "右手"], "右边有一支笔"],
  前: ["位置在前面或时间较早", ["前面", "以前", "前后"], "小明站在前面"],
  里: ["里面，内部", ["里面", "这里", "手里"], "盒子里有三颗糖"],
  外: ["外面，表面之外", ["外面", "门外", "里外"], "门外有脚步声"],
  长: ["长度大，也表示时间久", ["长短", "长方形", "很长"], "这根绳子很长"],
  短: ["长度小，和长相对", ["长短", "短句", "短一点"], "这句话比较短"],
  高: ["从下到上的距离大", ["高矮", "高山", "很高"], "这棵树很高"],
  矮: ["高度小，和高相对", ["高矮", "矮小", "不矮"], "这张桌子比较矮"],
  轻: ["重量小，和重相对", ["轻重", "轻轻", "很轻"], "这个书包很轻"],
  重: ["重量大，也表示重要", ["轻重", "重量", "很重"], "这块石头很重"],
  比: ["比较两个事物", ["比较", "比一比", "对比"], "比一比谁多"],
  几: ["询问数量", ["几个", "第几", "几只"], "篮子里有几个苹果"],
  图: ["画出的形象", ["图形", "图片", "看图"], "请看图回答问题"],
  形: ["样子，形状", ["图形", "形状", "圆形"], "这个图形是圆形"],
  圆: ["像圆圈一样的形状", ["圆形", "圆圈", "圆月"], "盘子是圆形的"],
  方: ["四边齐整的形状，也表示方向", ["方形", "方向", "正方形"], "正方形有四条边"],
  角: ["两条边相交的地方，也指钱的单位", ["角落", "三角形", "元角分"], "三角形有三个角"],
  元: ["人民币单位", ["元角分", "一元", "几元"], "一支铅笔两元"],
  分: ["分开，也表示钱或时间单位", ["分开", "几分", "元角分"], "把苹果分给大家"],
  合: ["合在一起", ["合成", "合计", "合上"], "二和三合成五"],
  组: ["组合在一起", ["组成", "小组", "组词"], "这些数字组成算式"],
  成: ["完成，也表示变成", ["组成", "完成", "成功"], "二和三组成五"],
  算: ["计算", ["算式", "计算", "口算"], "请写出算式"],
  式: ["一定的形式", ["算式", "样式", "式子"], "这个算式很简单"],
  题: ["需要回答或解决的问题", ["题目", "答题", "数学题"], "这道题会做吗"],
  案: ["答案或方案", ["答案", "图案", "案子"], "请说出答案"],
  写: ["用笔记录字或数", ["写字", "书写", "写出"], "请写出答案"],
  读: ["看着文字念出来", ["读书", "认读", "朗读"], "请读出这个字"],
  个: ["常用量词", ["一个", "几个", "每个"], "桌上有一个苹果"],
  只: ["常用量词，也表示单独", ["一只", "几只", "只有"], "树上有三只鸟"],
  支: ["常用于笔等细长物的量词", ["一支", "几支", "支点"], "我有一支铅笔"],
  朵: ["花等物的量词", ["一朵", "花朵", "几朵"], "花园里有五朵花"],
  条: ["长条形事物的量词", ["一条", "几条", "面条"], "河里有一条鱼"]
};

const CHINESE_LEXICAL_INFO = {
  日: { text: "日", type: "character", pinyin: "rì", meaning: "天上的太阳，也指一天的时间。", words: [
    { word: "日出", pinyin: "rì chū", meaning: "早晨太阳从东方升起。" },
    { word: "日子", pinyin: "rì zi", meaning: "一天一天的生活。" },
    { word: "生日", pinyin: "shēng rì", meaning: "一个人出生的那一天。" }
  ], sentence: "太阳每天从东方升起。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  月: { text: "月", type: "character", pinyin: "yuè", meaning: "夜晚天上弯弯或圆圆的月亮，也指一个月的时间。", words: [
    { word: "月亮", pinyin: "yuè liang", meaning: "夜晚天上发光的圆球。" },
    { word: "月饼", pinyin: "yuè bǐng", meaning: "中秋节吃的圆饼。" },
    { word: "一月", pinyin: "yī yuè", meaning: "一年的第一个月。" }
  ], sentence: "中秋的月亮又圆又亮。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  水: { text: "水", type: "character", pinyin: "shuǐ", meaning: "没有颜色、没有味道的液体，可以喝，可以洗东西。", words: [
    { word: "水果", pinyin: "shuǐ guǒ", meaning: "可以吃的果子，里面有很多水分。" },
    { word: "喝水", pinyin: "hē shuǐ", meaning: "把水喝进肚子里。" },
    { word: "开水", pinyin: "kāi shuǐ", meaning: "烧开过的水，可以喝。" }
  ], sentence: "我每天要喝很多水。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  火: { text: "火", type: "character", pinyin: "huǒ", meaning: "东西燃烧时发出的光和热，很烫。", words: [
    { word: "火车", pinyin: "huǒ chē", meaning: "在铁轨上跑的长长的车。" },
    { word: "大火", pinyin: "dà huǒ", meaning: "很大的火，很危险。" },
    { word: "点火", pinyin: "diǎn huǒ", meaning: "让火开始烧起来。" }
  ], sentence: "不要玩火，很危险。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  山: { text: "山", type: "character", pinyin: "shān", meaning: "地面上高高凸起的地方，比周围高很多。", words: [
    { word: "上山", pinyin: "shàng shān", meaning: "往山的高处走。" },
    { word: "大山", pinyin: "dà shān", meaning: "很高很大的山。" },
    { word: "山水", pinyin: "shān shuǐ", meaning: "山和水，也指风景。" }
  ], sentence: "远处有一座高高的山。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  田: { text: "田", type: "character", pinyin: "tián", meaning: "种庄稼的土地，一块一块的。", words: [
    { word: "水田", pinyin: "shuǐ tián", meaning: "里面有水的田，可以种稻子。" },
    { word: "田地", pinyin: "tián dì", meaning: "用来种东西的土地。" },
    { word: "田野", pinyin: "tián yě", meaning: "大片的田地和野地。" }
  ], sentence: "农民在田里种稻子。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  人: { text: "人", type: "character", pinyin: "rén", meaning: "我们这样的，会说话、会走路、会思考的生命。", words: [
    { word: "大人", pinyin: "dà rén", meaning: "已经长大的人，像爸爸妈妈。" },
    { word: "人们", pinyin: "rén men", meaning: "很多很多人。" },
    { word: "好人", pinyin: "hǎo rén", meaning: "心地善良的人。" }
  ], sentence: "公园里有很多人。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  口: { text: "口", type: "character", pinyin: "kǒu", meaning: "嘴巴，吃东西和说话的地方；也指一个洞或出入的地方。", words: [
    { word: "口水", pinyin: "kǒu shuǐ", meaning: "嘴巴里流出来的水。" },
    { word: "开口", pinyin: "kāi kǒu", meaning: "张开嘴巴说话。" },
    { word: "门口", pinyin: "mén kǒu", meaning: "门的前面。" }
  ], sentence: "请张开你的口。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  木: { text: "木", type: "character", pinyin: "mù", meaning: "树木，可以做成家具、纸等东西的材料。", words: [
    { word: "木头", pinyin: "mù tou", meaning: "树砍下来后变成的材料。" },
    { word: "树木", pinyin: "shù mù", meaning: "很多树，统称树木。" },
    { word: "木马", pinyin: "mù mǎ", meaning: "用木头做的玩具马。" }
  ], sentence: "这张桌子是木头做的。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  禾: { text: "禾", type: "character", pinyin: "hé", meaning: "谷类植物的苗，比如稻子、麦子小时候的样子。", words: [
    { word: "禾苗", pinyin: "hé miáo", meaning: "刚刚长出来的谷类小苗。" },
    { word: "锄禾", pinyin: "chú hé", meaning: "给禾苗松土除草。" },
    { word: "禾场", pinyin: "hé cháng", meaning: "打谷子、晒谷子的平地。" }
  ], sentence: "田里的禾苗绿绿的。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  上: { text: "上", type: "character", pinyin: "shàng", meaning: "位置在高处，或者从低处到高处去。", words: [
    { word: "上学", pinyin: "shàng xué", meaning: "去学校学习。" },
    { word: "上面", pinyin: "shàng miàn", meaning: "在高的地方。" },
    { word: "上车", pinyin: "shàng chē", meaning: "走进车里。" }
  ], sentence: "我每天早上去上学。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  下: { text: "下", type: "character", pinyin: "xià", meaning: "位置在低处，或者从高处到低处去。", words: [
    { word: "下雨", pinyin: "xià yǔ", meaning: "雨从天上落下来。" },
    { word: "下面", pinyin: "xià miàn", meaning: "在低的地方。" },
    { word: "下车", pinyin: "xià chē", meaning: "从车里走出来。" }
  ], sentence: "天黑了，要下雨了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  一: { text: "一", type: "character", pinyin: "yī", meaning: "数字1，表示最小的整数。", words: [
    { word: "一个", pinyin: "yī gè", meaning: "数量是1的人或东西。" },
    { word: "一天", pinyin: "yī tiān", meaning: "从早到晚的一整天。" },
    { word: "一起", pinyin: "yī qǐ", meaning: "大家一块儿做同一件事。" }
  ], sentence: "我有一个苹果。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  二: { text: "二", type: "character", pinyin: "èr", meaning: "数字2，表示比1多1。", words: [
    { word: "二月", pinyin: "èr yuè", meaning: "一年里的第二个月。" },
    { word: "二手", pinyin: "èr shǒu", meaning: "别人用过的，不是全新的。" },
    { word: "二胡", pinyin: "èr hú", meaning: "一种有两根弦的中国乐器。" }
  ], sentence: "我有两只铅笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  三: { text: "三", type: "character", pinyin: "sān", meaning: "数字3，表示比2多1。", words: [
    { word: "三个", pinyin: "sān gè", meaning: "数量是3的人或东西。" },
    { word: "三月", pinyin: "sān yuè", meaning: "一年里的第三个月。" },
    { word: "三角", pinyin: "sān jiǎo", meaning: "有三个角的形状。" }
  ], sentence: "桌上有三本书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  四: { text: "四", type: "character", pinyin: "sì", meaning: "数字4，表示比3多1。", words: [
    { word: "四个", pinyin: "sì gè", meaning: "数量是4的人或东西。" },
    { word: "四月", pinyin: "sì yuè", meaning: "一年里的第四个月。" },
    { word: "四方", pinyin: "sì fāng", meaning: "东、南、西、北四个方向。" }
  ], sentence: "我有四支彩笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  五: { text: "五", type: "character", pinyin: "wǔ", meaning: "数字5，表示比4多1。", words: [
    { word: "五个", pinyin: "wǔ gè", meaning: "数量是5的人或东西。" },
    { word: "五月", pinyin: "wǔ yuè", meaning: "一年里的第五个月。" },
    { word: "五星", pinyin: "wǔ xīng", meaning: "五颗星星，常指国旗上的星。" }
  ], sentence: "手有五根手指。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  天: { text: "天", type: "character", pinyin: "tiān", meaning: "天空；也指一昼夜的时间。", words: [
    { word: "天空", pinyin: "tiān kōng", meaning: "头顶上方高高的地方，有云和太阳。" },
    { word: "今天", pinyin: "jīn tiān", meaning: "说话时的这一天。" },
    { word: "天气", pinyin: "tiān qì", meaning: "冷、热、晴、雨等自然现象。" }
  ], sentence: "今天天气真好。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  地: { text: "地", type: "character", pinyin: "dì", meaning: "大地，我们脚下踩的地方。", words: [
    { word: "大地", pinyin: "dà dì", meaning: "广阔的地面。" },
    { word: "地方", pinyin: "dì fāng", meaning: "某个位置或区域。" },
    { word: "草地", pinyin: "cǎo dì", meaning: "长满草的地面。" }
  ], sentence: "小花开在草地上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  你: { text: "你", type: "character", pinyin: "nǐ", meaning: "称对方，指说话时对面的人。", words: [
    { word: "你们", pinyin: "nǐ men", meaning: "指两个或两个以上的人。" },
    { word: "你好", pinyin: "nǐ hǎo", meaning: "见面时打招呼的话。" },
    { word: "你的", pinyin: "nǐ de", meaning: "属于你的东西。" }
  ], sentence: "你好，我叫小明。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  我: { text: "我", type: "character", pinyin: "wǒ", meaning: "称自己，指说话的人。", words: [
    { word: "我们", pinyin: "wǒ men", meaning: "指包括自己在内的几个人。" },
    { word: "我的", pinyin: "wǒ de", meaning: "属于我的东西。" },
    { word: "自我", pinyin: "zì wǒ", meaning: "自己本人。" }
  ], sentence: "我爱我的家。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  他: { text: "他", type: "character", pinyin: "tā", meaning: "称男性或未知性别的人，指说话双方以外的人。", words: [
    { word: "他们", pinyin: "tā men", meaning: "指两个或两个以上的人。" },
    { word: "他的", pinyin: "tā de", meaning: "属于他的东西。" },
    { word: "他人", pinyin: "tā rén", meaning: "别的人。" }
  ], sentence: "他是我的同学。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  该: { text: "该", type: "character", pinyin: "gāi", meaning: "应当，表示应该这样做。", words: [
    { word: "应该", pinyin: "yīng gāi", meaning: "表示情理上必须这样。" },
    { word: "该当", pinyin: "gāi dāng", meaning: "应当，应该。" },
    { word: "活该", pinyin: "huó gāi", meaning: "表示不值得同情，自作自受。" }
  ], sentence: "我们该回家了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  刻: { text: "刻", type: "character", pinyin: "kè", meaning: "用刀等工具在硬东西上划出痕迹；也指时间单位，15分钟为一刻。", words: [
    { word: "立刻", pinyin: "lì kè", meaning: "马上，很快地。" },
    { word: "时刻", pinyin: "shí kè", meaning: "时间里的某一点。" },
    { word: "刻字", pinyin: "kè zì", meaning: "用刀在石头或木头上划出字。" }
  ], sentence: "请立刻过来。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  放: { text: "放", type: "character", pinyin: "fàng", meaning: "把东西安放在某处，或让它离开手。", words: [
    { word: "放下", pinyin: "fàng xià", meaning: "把拿着的东西放到下面或别处。" },
    { word: "放心", pinyin: "fàng xīn", meaning: "心里不担心。" },
    { word: "放学", pinyin: "fàng xué", meaning: "一天的课结束后离开学校。" }
  ], sentence: "请把书放桌上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  收: { text: "收", type: "character", pinyin: "shōu", meaning: "把东西聚拢或拿回来。", words: [
    { word: "收好", pinyin: "shōu hǎo", meaning: "把东西整理好放起来。" },
    { word: "收下", pinyin: "shōu xià", meaning: "接受别人给的东西。" },
    { word: "收工", pinyin: "shōu gōng", meaning: "结束工作。" }
  ], sentence: "妈妈把衣服收进柜子。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  骄: { text: "骄", type: "character", pinyin: "jiāo", meaning: "觉得自己很了不起，看不起别人。", words: [
    { word: "骄傲", pinyin: "jiāo ào", meaning: "觉得自己很厉害，看不起别人。" },
    { word: "骄阳", pinyin: "jiāo yáng", meaning: "夏天很热很晒的太阳。" },
    { word: "骄兵", pinyin: "jiāo bīng", meaning: "因为骄傲而打败仗的士兵。" }
  ], sentence: "他考了满分，有点骄傲。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  傲: { text: "傲", type: "character", pinyin: "ào", meaning: "觉得自己很了不起，不把别人放在眼里。", words: [
    { word: "骄傲", pinyin: "jiāo ào", meaning: "觉得自己很厉害，看不起别人。" },
    { word: "傲慢", pinyin: "ào màn", meaning: "对别人态度很冷淡，看不起人。" },
    { word: "傲气", pinyin: "ào qì", meaning: "觉得自己很了不起的样子。" }
  ], sentence: "他太傲慢了，没人喜欢他。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  坚: { text: "坚", type: "character", pinyin: "jiān", meaning: "很硬，不容易坏；也指不动摇。", words: [
    { word: "坚持", pinyin: "jiān chí", meaning: "一直做下去，不放弃。" },
    { word: "坚硬", pinyin: "jiān yìng", meaning: "很硬，不容易碎。" },
    { word: "坚固", pinyin: "jiān gù", meaning: "结实，不容易坏。" }
  ], sentence: "这块石头很坚硬。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  持: { text: "持", type: "character", pinyin: "chí", meaning: "拿着；保持下去。", words: [
    { word: "坚持", pinyin: "jiān chí", meaning: "一直做下去，不放弃。" },
    { word: "保持", pinyin: "bǎo chí", meaning: "让原来的样子不改变。" },
    { word: "手持", pinyin: "shǒu chí", meaning: "用手拿着。" }
  ], sentence: "他坚持每天读书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  终: { text: "终", type: "character", pinyin: "zhōng", meaning: "最后，结束。", words: [
    { word: "终于", pinyin: "zhōng yú", meaning: "等了很久之后，最后实现了。" },
    { word: "终点", pinyin: "zhōng diǎn", meaning: "结束的地方。" },
    { word: "始终", pinyin: "shǐ zhōng", meaning: "从开始到最后。" }
  ], sentence: "我们终于到终点了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  点: { text: "点", type: "character", pinyin: "diǎn", meaning: "小的痕迹或位置；时间单位；用笔加上小点。", words: [
    { word: "雨点", pinyin: "yǔ diǎn", meaning: "一滴一滴的雨。" },
    { word: "点心", pinyin: "diǎn xīn", meaning: "糕饼之类的小吃。" },
    { word: "点头", pinyin: "diǎn tóu", meaning: "头向下动一下，表示同意。" }
  ], sentence: "小雨点落在地上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  兔: { text: "兔", type: "character", pinyin: "tù", meaning: "一种小动物，耳朵长，尾巴短，跑得快。", words: [
    { word: "兔子", pinyin: "tù zi", meaning: "一种长耳朵、短尾巴的小动物。" },
    { word: "白兔", pinyin: "bái tù", meaning: "白色的兔子。" },
    { word: "小兔", pinyin: "xiǎo tù", meaning: "幼小的兔子。" }
  ], sentence: "小白兔爱吃萝卜。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  龟: { text: "龟", type: "character", pinyin: "guī", meaning: "一种爬行动物，背上有硬壳，走得慢。", words: [
    { word: "乌龟", pinyin: "wū guī", meaning: "一种背上有硬壳、爬得慢的动物。" },
    { word: "海龟", pinyin: "hǎi guī", meaning: "生活在海里的龟。" },
    { word: "龟壳", pinyin: "guī ké", meaning: "乌龟背上的硬壳。" }
  ], sentence: "乌龟慢慢地爬着。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  赛: { text: "赛", type: "character", pinyin: "sài", meaning: "比一比谁更好、更快。", words: [
    { word: "比赛", pinyin: "bǐ sài", meaning: "比一比谁做得好。" },
    { word: "赛跑", pinyin: "sài pǎo", meaning: "比谁跑得快。" },
    { word: "赛车", pinyin: "sài chē", meaning: "比谁开车或骑车快。" }
  ], sentence: "我们参加跑步比赛。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  跑: { text: "跑", type: "character", pinyin: "pǎo", meaning: "用脚快速向前移动。", words: [
    { word: "跑步", pinyin: "pǎo bù", meaning: "用脚快速向前移动的运动。" },
    { word: "跑车", pinyin: "pǎo chē", meaning: "跑得很快的汽车。" },
    { word: "跑开", pinyin: "pǎo kāi", meaning: "快速离开。" }
  ], sentence: "小明在操场上跑步。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  铃: { text: "铃", type: "character", pinyin: "líng", meaning: "用金属做成的小钟，摇动会发出声音。", words: [
    { word: "铃声", pinyin: "líng shēng", meaning: "铃发出的声音。" },
    { word: "门铃", pinyin: "mén líng", meaning: "装在门上的铃，按一下会响。" },
    { word: "铃铛", pinyin: "líng dang", meaning: "一种摇晃会响的小玩具。" }
  ], sentence: "下课铃声一响，我们就出去玩。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  响: { text: "响", type: "character", pinyin: "xiǎng", meaning: "发出声音。", words: [
    { word: "响声", pinyin: "xiǎng shēng", meaning: "听到的声音。" },
    { word: "响亮", pinyin: "xiǎng liàng", meaning: "声音很大，很清楚。" },
    { word: "响动", pinyin: "xiǎng dòng", meaning: "东西动时发出的声音。" }
  ], sentence: "外面有鞭炮的响声。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  回: { text: "回", type: "character", pinyin: "huí", meaning: "从别处到原来的地方。", words: [
    { word: "回家", pinyin: "huí jiā", meaning: "回到自己的家。" },
    { word: "回来", pinyin: "huí lái", meaning: "从别处到说话人所在的地方。" },
    { word: "回去", pinyin: "huí qù", meaning: "从所在的地方到别处。" }
  ], sentence: "放学后，我马上回家。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  答: { text: "答", type: "character", pinyin: "dá", meaning: "回答别人问的话。", words: [
    { word: "回答", pinyin: "huí dá", meaning: "对问题说出自己的话。" },
    { word: "答案", pinyin: "dá àn", meaning: "问题的正确结果。" },
    { word: "答应", pinyin: "dā yìng", meaning: "同意别人的要求。" }
  ], sentence: "老师提问，我举手回答。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  后: { text: "后", type: "character", pinyin: "hòu", meaning: "在背面或未来的时间。", words: [
    { word: "后面", pinyin: "hòu miàn", meaning: "位置在背面的地方。" },
    { word: "后来", pinyin: "hòu lái", meaning: "指过去某一时间之后的时间。" },
    { word: "以后", pinyin: "yǐ hòu", meaning: "现在或所说时间之后的时间。" }
  ], sentence: "小狗跟在我后面跑。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  来: { text: "来", type: "character", pinyin: "lái", meaning: "从别处到说话人这里。", words: [
    { word: "来到", pinyin: "lái dào", meaning: "到达某个地方。" },
    { word: "出来", pinyin: "chū lái", meaning: "从里面到外面。" },
    { word: "起来", pinyin: "qǐ lái", meaning: "从躺着或坐着到站立。" }
  ], sentence: "妈妈下班回来了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  第: { text: "第", type: "character", pinyin: "dì", meaning: "表示次序，用在数字前。", words: [
    { word: "第一", pinyin: "dì yī", meaning: "排在最前面的。" },
    { word: "第二", pinyin: "dì èr", meaning: "排在第一后面的。" },
    { word: "第三", pinyin: "dì sān", meaning: "排在第二后面的。" }
  ], sentence: "我考了全班第一名。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  乌: { text: "乌", type: "character", pinyin: "wū", meaning: "黑色，或者一种黑色的鸟。", words: [
    { word: "乌鸦", pinyin: "wū yā", meaning: "一种全身黑色的鸟，叫声不好听。" },
    { word: "乌云", pinyin: "wū yún", meaning: "黑色的云，快要下雨了。" },
    { word: "乌黑", pinyin: "wū hēi", meaning: "很黑很黑的颜色。" }
  ], sentence: "天上飘来一朵乌云。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  课: { text: "课", type: "character", pinyin: "kè", meaning: "学校里分科目教学的时间。", words: [
    { word: "上课", pinyin: "shàng kè", meaning: "老师教学生知识。" },
    { word: "下课", pinyin: "xià kè", meaning: "一节课结束。" },
    { word: "课本", pinyin: "kè běn", meaning: "上课用的书。" }
  ], sentence: "上课要认真听讲。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  耳: { text: "耳", type: "character", pinyin: "ěr", meaning: "人和动物用来听声音的器官。", words: [
    { word: "耳朵", pinyin: "ěr duo", meaning: "头两边听声音的器官。" },
    { word: "木耳", pinyin: "mù ěr", meaning: "一种可以吃的黑色菌类。" },
    { word: "耳环", pinyin: "ěr huán", meaning: "戴在耳朵上的装饰品。" }
  ], sentence: "小兔子有长长的耳朵。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  目: { text: "目", type: "character", pinyin: "mù", meaning: "眼睛，或者看的意思。", words: [
    { word: "目光", pinyin: "mù guāng", meaning: "眼睛看东西时的样子。" },
    { word: "目前", pinyin: "mù qián", meaning: "现在，眼前的时候。" },
    { word: "节目", pinyin: "jié mù", meaning: "电视或表演里的一段内容。" }
  ], sentence: "他的目光很温柔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  手: { text: "手", type: "character", pinyin: "shǒu", meaning: "人身体最前端能拿东西的部分。", words: [
    { word: "小手", pinyin: "xiǎo shǒu", meaning: "小朋友的手。" },
    { word: "洗手", pinyin: "xǐ shǒu", meaning: "用水把手洗干净。" },
    { word: "手心", pinyin: "shǒu xīn", meaning: "手掌的中心部分。" }
  ], sentence: "饭前便后要洗手。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  足: { text: "足", type: "character", pinyin: "zú", meaning: "脚，人或动物用来走路的身体部分。", words: [
    { word: "足球", pinyin: "zú qiú", meaning: "一种用脚踢的球类运动。" },
    { word: "足够", pinyin: "zú gòu", meaning: "数量或程度完全满足需要。" },
    { word: "不足", pinyin: "bù zú", meaning: "不够，缺少。" }
  ], sentence: "我喜欢踢足球。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  站: { text: "站", type: "character", pinyin: "zhàn", meaning: "身体直立，双脚着地。", words: [
    { word: "站立", pinyin: "zhàn lì", meaning: "直着身体，脚踩在地上。" },
    { word: "车站", pinyin: "chē zhàn", meaning: "车辆停靠让乘客上下车的地方。" },
    { word: "站台", pinyin: "zhàn tái", meaning: "车站里供乘客等车的高出地面的平台。" }
  ], sentence: "请站在门口等我。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  坐: { text: "坐", type: "character", pinyin: "zuò", meaning: "把屁股放在椅子、地上等，身体休息。", words: [
    { word: "坐下", pinyin: "zuò xià", meaning: "把身体放到座位上。" },
    { word: "乘坐", pinyin: "chéng zuò", meaning: "搭车、船、飞机等交通工具。" },
    { word: "坐车", pinyin: "zuò chē", meaning: "搭乘汽车或火车。" }
  ], sentence: "请坐在椅子上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  石: { text: "石", type: "character", pinyin: "shí", meaning: "坚硬的小块或大块矿物，如岩石。", words: [
    { word: "石头", pinyin: "shí tou", meaning: "小块或大块的坚硬矿物。" },
    { word: "石子", pinyin: "shí zǐ", meaning: "小块的石头。" },
    { word: "宝石", pinyin: "bǎo shí", meaning: "珍贵美丽的石头，可做首饰。" }
  ], sentence: "路边有一块大石头。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  对: { text: "对", type: "character", pinyin: "duì", meaning: "正确，跟“错”相反；也指朝着、向着。", words: [
    { word: "不对", pinyin: "bù duì", meaning: "错误，不正确。" },
    { word: "对面", pinyin: "duì miàn", meaning: "正前方或另一边。" },
    { word: "对话", pinyin: "duì huà", meaning: "两个人或更多人互相说话。" }
  ], sentence: "你的回答很对。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  云: { text: "云", type: "character", pinyin: "yún", meaning: "天空中的白色或灰色水汽团。", words: [
    { word: "白云", pinyin: "bái yún", meaning: "白色的云朵。" },
    { word: "乌云", pinyin: "wū yún", meaning: "黑色的云，常带来雨。" },
    { word: "云朵", pinyin: "yún duǒ", meaning: "一朵一朵的云。" }
  ], sentence: "天上飘着白云。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  雨: { text: "雨", type: "character", pinyin: "yǔ", meaning: "从云里落下的水滴。", words: [
    { word: "下雨", pinyin: "xià yǔ", meaning: "雨从天上落下来。" },
    { word: "雨伞", pinyin: "yǔ sǎn", meaning: "挡雨用的伞。" },
    { word: "雨衣", pinyin: "yǔ yī", meaning: "防雨的外衣。" }
  ], sentence: "今天下雨了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  风: { text: "风", type: "character", pinyin: "fēng", meaning: "空气流动的现象。", words: [
    { word: "大风", pinyin: "dà fēng", meaning: "很强的风。" },
    { word: "风筝", pinyin: "fēng zheng", meaning: "用线牵拉能飞上天的玩具。" },
    { word: "吹风", pinyin: "chuī fēng", meaning: "让风吹到身上。" }
  ], sentence: "外面刮大风了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  花: { text: "花", type: "character", pinyin: "huā", meaning: "植物开出的美丽部分，有各种颜色。", words: [
    { word: "花朵", pinyin: "huā duǒ", meaning: "花的总称，一朵一朵的花。" },
    { word: "花园", pinyin: "huā yuán", meaning: "种了很多花的地方。" },
    { word: "开花", pinyin: "kāi huā", meaning: "植物长出花朵。" }
  ], sentence: "公园里开了很多花。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  鸟: { text: "鸟", type: "character", pinyin: "niǎo", meaning: "有羽毛、会飞的动物。", words: [
    { word: "小鸟", pinyin: "xiǎo niǎo", meaning: "体型小的鸟。" },
    { word: "鸟儿", pinyin: "niǎo ér", meaning: "鸟的亲切叫法。" },
    { word: "鸟窝", pinyin: "niǎo wō", meaning: "鸟住的巢。" }
  ], sentence: "树上有一只小鸟。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  虫: { text: "虫", type: "character", pinyin: "chóng", meaning: "小型的爬行或飞行的动物，如昆虫。", words: [
    { word: "虫子", pinyin: "chóng zi", meaning: "小虫的总称。" },
    { word: "毛毛虫", pinyin: "máo mao chóng", meaning: "身上有毛的虫，会变蝴蝶。" },
    { word: "害虫", pinyin: "hài chóng", meaning: "对人有害的虫子。" }
  ], sentence: "叶子上有一条虫。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  六: { text: "六", type: "character", pinyin: "liù", meaning: "数字，比五多一。", words: [
    { word: "六个", pinyin: "liù gè", meaning: "数量是六。" },
    { word: "六月", pinyin: "liù yuè", meaning: "一年中的第六个月。" },
    { word: "六天", pinyin: "liù tiān", meaning: "六天的时间。" }
  ], sentence: "我有六支铅笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  七: { text: "七", type: "character", pinyin: "qī", meaning: "数字，比六多一。", words: [
    { word: "七个", pinyin: "qī gè", meaning: "数量是七的人或东西。" },
    { word: "七天", pinyin: "qī tiān", meaning: "一个星期的时间。" },
    { word: "七岁", pinyin: "qī suì", meaning: "年龄是七岁。" }
  ], sentence: "我有七个苹果。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  八: { text: "八", type: "character", pinyin: "bā", meaning: "数字，比七多一。", words: [
    { word: "八个", pinyin: "bā gè", meaning: "数量是八的人或东西。" },
    { word: "八月", pinyin: "bā yuè", meaning: "一年中的第八个月。" },
    { word: "八点", pinyin: "bā diǎn", meaning: "时间，早上或晚上的第八个小时。" }
  ], sentence: "桌子上有八本书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  九: { text: "九", type: "character", pinyin: "jiǔ", meaning: "数字，比八多一。", words: [
    { word: "九个", pinyin: "jiǔ gè", meaning: "数量是九的人或东西。" },
    { word: "九天", pinyin: "jiǔ tiān", meaning: "九个白天和黑夜。" },
    { word: "九月", pinyin: "jiǔ yuè", meaning: "一年中的第九个月。" }
  ], sentence: "我有九支铅笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  十: { text: "十", type: "character", pinyin: "shí", meaning: "数字，比九多一。", words: [
    { word: "十个", pinyin: "shí gè", meaning: "数量是十的人或东西。" },
    { word: "十月", pinyin: "shí yuè", meaning: "一年中的第十个月。" },
    { word: "十分", pinyin: "shí fēn", meaning: "非常，很。" }
  ], sentence: "我有十个手指。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  爸: { text: "爸", type: "character", pinyin: "bà", meaning: "称呼父亲。", words: [
    { word: "爸爸", pinyin: "bà ba", meaning: "父亲。" },
    { word: "老爸", pinyin: "lǎo bà", meaning: "对爸爸的亲切称呼。" },
    { word: "爸妈", pinyin: "bà mā", meaning: "爸爸和妈妈。" }
  ], sentence: "我爸爸很高。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  妈: { text: "妈", type: "character", pinyin: "mā", meaning: "称呼母亲。", words: [
    { word: "妈妈", pinyin: "mā ma", meaning: "母亲。" },
    { word: "老妈", pinyin: "lǎo mā", meaning: "对妈妈的亲切称呼。" },
    { word: "爸妈", pinyin: "bà mā", meaning: "爸爸和妈妈。" }
  ], sentence: "妈妈给我讲故事。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  马: { text: "马", type: "character", pinyin: "mǎ", meaning: "一种动物，可以骑或拉车。", words: [
    { word: "小马", pinyin: "xiǎo mǎ", meaning: "年纪小的马。" },
    { word: "马上", pinyin: "mǎ shàng", meaning: "立刻，很快。" },
    { word: "木马", pinyin: "mù mǎ", meaning: "木头做的马玩具。" }
  ], sentence: "小马在草地上跑。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  土: { text: "土", type: "character", pinyin: "tǔ", meaning: "地面上的泥或沙。", words: [
    { word: "土地", pinyin: "tǔ dì", meaning: "可以种东西的地。" },
    { word: "泥土", pinyin: "ní tǔ", meaning: "湿的土。" },
    { word: "土豆", pinyin: "tǔ dòu", meaning: "一种长在土里的食物，也叫马铃薯。" }
  ], sentence: "地上有很多土。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  不: { text: "不", type: "character", pinyin: "bù", meaning: "表示否定或不要。", words: [
    { word: "不是", pinyin: "bú shì", meaning: "表示否定，不对。" },
    { word: "不要", pinyin: "bú yào", meaning: "不想得到或不想做。" },
    { word: "不好", pinyin: "bù hǎo", meaning: "不让人满意。" }
  ], sentence: "我不是小学生。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  画: { text: "画", type: "character", pinyin: "huà", meaning: "用笔或颜料做出图形。", words: [
    { word: "画画", pinyin: "huà huà", meaning: "用笔画出东西。" },
    { word: "图画", pinyin: "tú huà", meaning: "画出来的画。" },
    { word: "画家", pinyin: "huà jiā", meaning: "很会画画的人。" }
  ], sentence: "我喜欢画画。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  打: { text: "打", type: "character", pinyin: "dǎ", meaning: "用手或东西敲击。", words: [
    { word: "打球", pinyin: "dǎ qiú", meaning: "玩球类游戏。" },
    { word: "打开", pinyin: "dǎ kāi", meaning: "把合着的东西弄开。" },
    { word: "打扫", pinyin: "dǎ sǎo", meaning: "清理干净。" }
  ], sentence: "我们一起去打球。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  棋: { text: "棋", type: "character", pinyin: "qí", meaning: "一种游戏，有棋盘和棋子。", words: [
    { word: "下棋", pinyin: "xià qí", meaning: "玩棋类游戏。" },
    { word: "棋子", pinyin: "qí zǐ", meaning: "下棋用的小块。" },
    { word: "象棋", pinyin: "xiàng qí", meaning: "一种棋，有将、士、象等棋子。" }
  ], sentence: "爷爷喜欢下棋。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  鸡: { text: "鸡", type: "character", pinyin: "jī", meaning: "一种家禽，会下蛋，肉可以吃。", words: [
    { word: "小鸡", pinyin: "xiǎo jī", meaning: "刚孵出来的鸡宝宝。" },
    { word: "鸡蛋", pinyin: "jī dàn", meaning: "鸡生的蛋，可以吃。" },
    { word: "公鸡", pinyin: "gōng jī", meaning: "会打鸣的雄鸡。" }
  ], sentence: "小鸡在院子里吃米。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  字: { text: "字", type: "character", pinyin: "zì", meaning: "用来记录语言的符号，比如汉字。", words: [
    { word: "汉字", pinyin: "hàn zì", meaning: "中国文字，每个字都有意思。" },
    { word: "写字", pinyin: "xiě zì", meaning: "用笔在纸上写出字来。" },
    { word: "名字", pinyin: "míng zi", meaning: "一个人或东西的称呼。" }
  ], sentence: "我会写自己的名字了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  词: { text: "词", type: "character", pinyin: "cí", meaning: "由字组成的、能表达意思的语言单位。", words: [
    { word: "词语", pinyin: "cí yǔ", meaning: "由字组成的词，比如“花朵”。" },
    { word: "歌词", pinyin: "gē cí", meaning: "歌曲里唱出来的话。" },
    { word: "词典", pinyin: "cí diǎn", meaning: "查词语意思和用法的书。" }
  ], sentence: "这个词语的意思我不懂。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  语: { text: "语", type: "character", pinyin: "yǔ", meaning: "人们说的话，或者语言。", words: [
    { word: "语文", pinyin: "yǔ wén", meaning: "学习语言和文字的课。" },
    { word: "汉语", pinyin: "hàn yǔ", meaning: "中国人说的语言。" },
    { word: "口语", pinyin: "kǒu yǔ", meaning: "用嘴说的话。" }
  ], sentence: "我喜欢上语文课。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  句: { text: "句", type: "character", pinyin: "jù", meaning: "由词组成的、能表达完整意思的话。", words: [
    { word: "句子", pinyin: "jù zi", meaning: "由词组成的、能表达完整意思的话。" },
    { word: "句号", pinyin: "jù hào", meaning: "表示一句话说完的标点，像小圆圈。" },
    { word: "造句", pinyin: "zào jù", meaning: "用词语写出句子。" }
  ], sentence: "请用这个词造句。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  子: { text: "子", type: "character", pinyin: "zǐ", meaning: "指孩子或小的东西，也常用在词语末尾。", words: [
    { word: "孩子", pinyin: "hái zi", meaning: "儿童，小朋友。" },
    { word: "桌子", pinyin: "zhuō zi", meaning: "用来放东西的家具。" },
    { word: "叶子", pinyin: "yè zi", meaning: "植物上的一片片绿色部分。" }
  ], sentence: "这个孩子很可爱。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  桌: { text: "桌", type: "character", pinyin: "zhuō", meaning: "一种家具，上面可以放东西，用来吃饭或学习。", words: [
    { word: "桌子", pinyin: "zhuō zi", meaning: "用来放东西的家具。" },
    { word: "书桌", pinyin: "shū zhuō", meaning: "专门用来看书、写字的桌子。" },
    { word: "饭桌", pinyin: "fàn zhuō", meaning: "吃饭用的桌子。" }
  ], sentence: "书桌上有一本故事书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  纸: { text: "纸", type: "character", pinyin: "zhǐ", meaning: "用植物纤维做的薄片，可以写字、画画。", words: [
    { word: "白纸", pinyin: "bái zhǐ", meaning: "白色的纸，没有写过字。" },
    { word: "折纸", pinyin: "zhé zhǐ", meaning: "把纸折成各种形状。" },
    { word: "纸巾", pinyin: "zhǐ jīn", meaning: "用来擦手、擦嘴的软纸。" }
  ], sentence: "请用白纸画一朵花。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  文: { text: "文", type: "character", pinyin: "wén", meaning: "文字或文章，也指文化。", words: [
    { word: "语文", pinyin: "yǔ wén", meaning: "学习语言和文字的课。" },
    { word: "文字", pinyin: "wén zì", meaning: "记录语言的符号，比如汉字。" },
    { word: "作文", pinyin: "zuò wén", meaning: "自己写的文章。" }
  ], sentence: "我喜欢写作文。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  数: { text: "数", type: "character", pinyin: "shù", meaning: "数字，用来表示多少或第几。", words: [
    { word: "数学", pinyin: "shù xué", meaning: "学习数字和计算的课。" },
    { word: "数字", pinyin: "shù zì", meaning: "表示数量的符号，比如1、2、3。" },
    { word: "数数", pinyin: "shǔ shù", meaning: "一个一个地数出数目。" }
  ], sentence: "我会从一数到一百。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  学: { text: "学", type: "character", pinyin: "xué", meaning: "学习知识或技能。", words: [
    { word: "学习", pinyin: "xué xí", meaning: "通过听讲、读书、练习来获得知识。" },
    { word: "学校", pinyin: "xué xiào", meaning: "专门学习的地方。" },
    { word: "同学", pinyin: "tóng xué", meaning: "一起学习的人。" }
  ], sentence: "我在学校学拼音。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  音: { text: "音", type: "character", pinyin: "yīn", meaning: "声音，也指音乐。", words: [
    { word: "音乐", pinyin: "yīn yuè", meaning: "有节奏、旋律的声音，可以唱歌或演奏。" },
    { word: "声音", pinyin: "shēng yīn", meaning: "耳朵能听到的响声。" },
    { word: "拼音", pinyin: "pīn yīn", meaning: "用字母表示汉字读音的方法。" }
  ], sentence: "我喜欢上音乐课。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  乐: { text: "乐", type: "character", pinyin: "lè", meaning: "快乐，高兴。", words: [
    { word: "快乐", pinyin: "kuài lè", meaning: "感到高兴、开心。" },
    { word: "音乐", pinyin: "yīn yuè", meaning: "有节奏和旋律的声音，可以唱歌或演奏。" },
    { word: "乐园", pinyin: "lè yuán", meaning: "让人快乐玩耍的地方。" }
  ], sentence: "我们快乐地唱歌。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  妹: { text: "妹", type: "character", pinyin: "mèi", meaning: "比自己小的女孩，同一个父母生的。", words: [
    { word: "妹妹", pinyin: "mèi mei", meaning: "比自己小的同父母女孩。" },
    { word: "姐妹", pinyin: "jiě mèi", meaning: "姐姐和妹妹。" },
    { word: "表妹", pinyin: "biǎo mèi", meaning: "爸爸或妈妈的兄弟姐妹的女儿，比自己小。" }
  ], sentence: "我的妹妹很可爱。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  奶: { text: "奶", type: "character", pinyin: "nǎi", meaning: "乳房里流出的白色汁液，可以喝；也指祖母。", words: [
    { word: "牛奶", pinyin: "niú nǎi", meaning: "从牛身上挤出来的奶，可以喝。" },
    { word: "奶奶", pinyin: "nǎi nai", meaning: "爸爸的妈妈。" },
    { word: "奶油", pinyin: "nǎi yóu", meaning: "牛奶上面一层黄黄的油，可以做蛋糕。" }
  ], sentence: "我每天早上喝牛奶。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  白: { text: "白", type: "character", pinyin: "bái", meaning: "像雪或牛奶一样的颜色。", words: [
    { word: "白色", pinyin: "bái sè", meaning: "像雪一样的颜色。" },
    { word: "白天", pinyin: "bái tiān", meaning: "从天亮到天黑的时间。" },
    { word: "白云", pinyin: "bái yún", meaning: "白色的云朵。" }
  ], sentence: "天上飘着白云。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  皮: { text: "皮", type: "character", pinyin: "pí", meaning: "人或动物身体外面的一层东西；也指东西的外壳。", words: [
    { word: "皮肤", pinyin: "pí fū", meaning: "身体外面的一层皮。" },
    { word: "树皮", pinyin: "shù pí", meaning: "树干外面的一层硬皮。" },
    { word: "橡皮", pinyin: "xiàng pí", meaning: "用来擦掉铅笔字的东西。" }
  ], sentence: "大象的皮肤很厚。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  小: { text: "小", type: "character", pinyin: "xiǎo", meaning: "不大，比平常的尺寸、年纪、数量等要少或短。", words: [
    { word: "大小", pinyin: "dà xiǎo", meaning: "大的和小的；指尺寸。" },
    { word: "小鸟", pinyin: "xiǎo niǎo", meaning: "体型不大的鸟。" },
    { word: "小孩", pinyin: "xiǎo hái", meaning: "年纪小的孩子。" }
  ], sentence: "树上有一只小鸟。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  桥: { text: "桥", type: "character", pinyin: "qiáo", meaning: "架在水上或空中让人和车通过的东西。", words: [
    { word: "小桥", pinyin: "xiǎo qiáo", meaning: "不大的桥。" },
    { word: "木桥", pinyin: "mù qiáo", meaning: "用木头做的桥。" },
    { word: "天桥", pinyin: "tiān qiáo", meaning: "架在空中的桥，让人从上面过马路。" }
  ], sentence: "我们走过小桥。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  台: { text: "台", type: "character", pinyin: "tái", meaning: "高起来的平面，可以放东西或站人。", words: [
    { word: "讲台", pinyin: "jiǎng tái", meaning: "老师讲课站的高台子。" },
    { word: "阳台", pinyin: "yáng tái", meaning: "房子外面伸出去的平台。" },
    { word: "台灯", pinyin: "tái dēng", meaning: "放在桌子上的灯。" }
  ], sentence: "老师站在讲台上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  雪: { text: "雪", type: "character", pinyin: "xuě", meaning: "天冷时从云里落下来的白色小冰花。", words: [
    { word: "雪花", pinyin: "xuě huā", meaning: "一片一片的雪，像花一样。" },
    { word: "下雪", pinyin: "xià xuě", meaning: "雪从天上落下来。" },
    { word: "雪人", pinyin: "xuě rén", meaning: "用雪堆成的人形。" }
  ], sentence: "冬天会下雪。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  儿: { text: "儿", type: "character", pinyin: "ér", meaning: "小孩子；也用在词尾，表示小的意思。", words: [
    { word: "儿子", pinyin: "ér zi", meaning: "爸爸妈妈生的男孩子。" },
    { word: "儿童", pinyin: "ér tóng", meaning: "年纪小的孩子。" },
    { word: "花儿", pinyin: "huār", meaning: "花朵，表示小的花。" }
  ], sentence: "儿童节我们很开心。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  草: { text: "草", type: "character", pinyin: "cǎo", meaning: "绿色的小植物，叶子细长，长在地上。", words: [
    { word: "小草", pinyin: "xiǎo cǎo", meaning: "小小的草。" },
    { word: "草地", pinyin: "cǎo dì", meaning: "长满草的地方。" },
    { word: "青草", pinyin: "qīng cǎo", meaning: "绿色的草。" }
  ], sentence: "草地上有小花。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  家: { text: "家", type: "character", pinyin: "jiā", meaning: "一家人住的地方；也指家庭。", words: [
    { word: "大家", pinyin: "dà jiā", meaning: "很多人，每一个人。" },
    { word: "回家", pinyin: "huí jiā", meaning: "回到自己住的地方。" },
    { word: "家人", pinyin: "jiā rén", meaning: "家里的人，爸爸妈妈等。" }
  ], sentence: "我爱我的家。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  是: { text: "是", type: "character", pinyin: "shì", meaning: "表示肯定、同意或正确。", words: [
    { word: "是的", pinyin: "shì de", meaning: "表示同意或肯定。" },
    { word: "不是", pinyin: "bú shì", meaning: "表示否定或错误。" },
    { word: "可是", pinyin: "kě shì", meaning: "表示转折，但是。" }
  ], sentence: "我是小学生。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  车: { text: "车", type: "character", pinyin: "chē", meaning: "有轮子的交通工具。", words: [
    { word: "汽车", pinyin: "qì chē", meaning: "用发动机驱动的车。" },
    { word: "火车", pinyin: "huǒ chē", meaning: "在铁轨上行驶的长车。" },
    { word: "自行车", pinyin: "zì xíng chē", meaning: "用脚蹬着走的两个轮子的车。" }
  ], sentence: "爸爸开汽车上班。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  羊: { text: "羊", type: "character", pinyin: "yáng", meaning: "一种吃草的动物，毛可以纺线。", words: [
    { word: "山羊", pinyin: "shān yáng", meaning: "一种羊，角向后弯。" },
    { word: "羊毛", pinyin: "yáng máo", meaning: "羊身上的毛，可以做衣服。" },
    { word: "小羊", pinyin: "xiǎo yáng", meaning: "幼小的羊。" }
  ], sentence: "小羊在吃青草。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  走: { text: "走", type: "character", pinyin: "zǒu", meaning: "用脚向前移动。", words: [
    { word: "走路", pinyin: "zǒu lù", meaning: "用脚在地上移动。" },
    { word: "走开", pinyin: "zǒu kāi", meaning: "离开某个地方。" },
    { word: "行走", pinyin: "xíng zǒu", meaning: "步行，走路。" }
  ], sentence: "我们走路去学校。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  也: { text: "也", type: "character", pinyin: "yě", meaning: "表示同样或并列。", words: [
    { word: "也是", pinyin: "yě shì", meaning: "同样也是。" },
    { word: "也好", pinyin: "yě hǎo", meaning: "表示可以或同意。" },
    { word: "也许", pinyin: "yě xǔ", meaning: "可能，不一定。" }
  ], sentence: "我也喜欢画画。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  早: { text: "早", type: "character", pinyin: "zǎo", meaning: "太阳出来的时候；时间靠前。", words: [
    { word: "早上", pinyin: "zǎo shang", meaning: "早晨，天刚亮的时候。" },
    { word: "早饭", pinyin: "zǎo fàn", meaning: "早晨吃的饭。" },
    { word: "早起", pinyin: "zǎo qǐ", meaning: "很早就起床。" }
  ], sentence: "早上太阳升起来了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  书: { text: "书", type: "character", pinyin: "shū", meaning: "有文字或图画的册子。", words: [
    { word: "书本", pinyin: "shū běn", meaning: "书的总称。" },
    { word: "看书", pinyin: "kàn shū", meaning: "阅读书籍。" },
    { word: "书包", pinyin: "shū bāo", meaning: "装书的包。" }
  ], sentence: "我喜欢看故事书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  刀: { text: "刀", type: "character", pinyin: "dāo", meaning: "用来切东西的锋利工具。", words: [
    { word: "小刀", pinyin: "xiǎo dāo", meaning: "小的刀。" },
    { word: "刀子", pinyin: "dāo zi", meaning: "刀的口语说法。" },
    { word: "剪刀", pinyin: "jiǎn dāo", meaning: "两片刀刃交叉，用来剪东西。" }
  ], sentence: "我用小刀削铅笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  尺: { text: "尺", type: "character", pinyin: "chǐ", meaning: "量长度的工具。", words: [
    { word: "尺子", pinyin: "chǐ zi", meaning: "量长度的工具。" },
    { word: "直尺", pinyin: "zhí chǐ", meaning: "画直线用的尺。" },
    { word: "卷尺", pinyin: "juǎn chǐ", meaning: "可以卷起来的软尺。" }
  ], sentence: "我用尺子画直线。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  本: { text: "本", type: "character", pinyin: "běn", meaning: "册子；原来的；自己方面的。", words: [
    { word: "书本", pinyin: "shū běn", meaning: "书的总称。" },
    { word: "本子", pinyin: "běn zi", meaning: "写字用的簿册。" },
    { word: "本来", pinyin: "běn lái", meaning: "原先，原来。" }
  ], sentence: "我买了一个新本子。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  林: { text: "林", type: "character", pinyin: "lín", meaning: "很多树木长在一起。", words: [
    { word: "树林", pinyin: "shù lín", meaning: "成片生长的树木。" },
    { word: "森林", pinyin: "sēn lín", meaning: "大片生长的树木。" },
    { word: "竹林", pinyin: "zhú lín", meaning: "成片的竹子。" }
  ], sentence: "树林里有很多小鸟。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  力: { text: "力", type: "character", pinyin: "lì", meaning: "力气，力量。", words: [
    { word: "力气", pinyin: "lì qi", meaning: "身体的力量。" },
    { word: "用力", pinyin: "yòng lì", meaning: "使出力气。" },
    { word: "大力", pinyin: "dà lì", meaning: "很大的力气。" }
  ], sentence: "我用力搬起椅子。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  心: { text: "心", type: "character", pinyin: "xīn", meaning: "人和动物身体里推动血液流动的器官，也指思想、感情。", words: [
    { word: "心里", pinyin: "xīn lǐ", meaning: "胸口内部，也指思想里。" },
    { word: "开心", pinyin: "kāi xīn", meaning: "心情快乐。" },
    { word: "小心", pinyin: "xiǎo xīn", meaning: "注意、留神，避免危险或出错。" }
  ], sentence: "我心里很开心。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  中: { text: "中", type: "character", pinyin: "zhōng", meaning: "中间，位置在四周距离相等的地方。", words: [
    { word: "中间", pinyin: "zhōng jiān", meaning: "在事物两端或周围等距离的位置。" },
    { word: "中午", pinyin: "zhōng wǔ", meaning: "白天十二点左右的时间。" },
    { word: "中心", pinyin: "zhōng xīn", meaning: "正中间的位置，也指主要部分。" }
  ], sentence: "书桌在房间中间。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  立: { text: "立", type: "character", pinyin: "lì", meaning: "站着，直着身体，脚踩在地上。", words: [
    { word: "立正", pinyin: "lì zhèng", meaning: "站直身体，两脚并拢，表示严肃。" },
    { word: "立刻", pinyin: "lì kè", meaning: "马上，很快地。" },
    { word: "起立", pinyin: "qǐ lì", meaning: "从坐着或躺着变成站着的姿势。" }
  ], sentence: "请同学们立正站好。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  正: { text: "正", type: "character", pinyin: "zhèng", meaning: "不歪斜，位置在中间；也指对的、好的。", words: [
    { word: "立正", pinyin: "lì zhèng", meaning: "站直身体，两脚并拢，表示严肃。" },
    { word: "正好", pinyin: "zhèng hǎo", meaning: "刚好合适，不早不晚。" },
    { word: "正方形", pinyin: "zhèng fāng xíng", meaning: "四条边一样长、四个角都是直角的图形。" }
  ], sentence: "这张纸是正方形。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  大: { text: "大", type: "character", pinyin: "dà", meaning: "在体积、面积、数量、力量等方面超过一般或超过比较对象。", words: [
    { word: "大人", pinyin: "dà rén", meaning: "成年人。" },
    { word: "大小", pinyin: "dà xiǎo", meaning: "大的和小的，也指尺寸。" },
    { word: "大象", pinyin: "dà xiàng", meaning: "一种很大的动物，有长鼻子和大耳朵。" }
  ], sentence: "大象的耳朵很大。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  多: { text: "多", type: "character", pinyin: "duō", meaning: "数量大，跟“少”相对。", words: [
    { word: "多少", pinyin: "duō shǎo", meaning: "问数量，也指数量的大小。" },
    { word: "许多", pinyin: "xǔ duō", meaning: "很多。" },
    { word: "多么", pinyin: "duō me", meaning: "表示程度高，带有感叹语气。" }
  ], sentence: "花园里有许多花。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  少: { text: "少", type: "character", pinyin: "shǎo", meaning: "数量小，跟“多”相对。", words: [
    { word: "多少", pinyin: "duō shǎo", meaning: "问数量，也指数量的大小。" },
    { word: "少数", pinyin: "shǎo shù", meaning: "较小的数量。" },
    { word: "减少", pinyin: "jiǎn shǎo", meaning: "让数量变少。" }
  ], sentence: "今天作业很少。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  牛: { text: "牛", type: "character", pinyin: "niú", meaning: "一种家畜，身体大，头上长角，能耕地或产奶。", words: [
    { word: "水牛", pinyin: "shuǐ niú", meaning: "一种喜欢在水里的牛，角弯弯的。" },
    { word: "牛奶", pinyin: "niú nǎi", meaning: "母牛产的奶，可以喝。" },
    { word: "吹牛", pinyin: "chuī niú", meaning: "说大话，夸耀自己。" }
  ], sentence: "水牛在田里干活。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  果: { text: "果", type: "character", pinyin: "guǒ", meaning: "植物结的果实，里面一般有种子。", words: [
    { word: "水果", pinyin: "shuǐ guǒ", meaning: "可以吃的植物果实，多汁，如苹果、香蕉。" },
    { word: "苹果", pinyin: "píng guǒ", meaning: "一种圆圆的、红色或绿色的水果。" },
    { word: "如果", pinyin: "rú guǒ", meaning: "表示假设，要是。" }
  ], sentence: "我喜欢吃水果。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  加: { text: "加", type: "character", pinyin: "jiā", meaning: "把两个或几个东西合在一起，使数量变多。", words: [
    { word: "加法", pinyin: "jiā fǎ", meaning: "把两个数合起来算的方法。" },
    { word: "加油", pinyin: "jiā yóu", meaning: "比喻努力，也指给车加燃料。" },
    { word: "参加", pinyin: "cān jiā", meaning: "加入某个活动或组织。" }
  ], sentence: "一加一等于二。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  减: { text: "减", type: "character", pinyin: "jiǎn", meaning: "从整体中去掉一部分，使数量变少。", words: [
    { word: "减法", pinyin: "jiǎn fǎ", meaning: "从一个数里去掉一部分的算法。" },
    { word: "减少", pinyin: "jiǎn shǎo", meaning: "让数量变少。" },
    { word: "加减", pinyin: "jiā jiǎn", meaning: "加法和减法，也指调整。" }
  ], sentence: "五减三等于二。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  等: { text: "等", type: "character", pinyin: "děng", meaning: "等待；或表示级别、程度相同。", words: [
    { word: "等待", pinyin: "děng dài", meaning: "等着，不离开直到人或事物出现。" },
    { word: "等于", pinyin: "děng yú", meaning: "两个数量或事物一样。" },
    { word: "平等", pinyin: "píng děng", meaning: "地位或待遇一样，没有差别。" }
  ], sentence: "我在门口等你。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  于: { text: "于", type: "character", pinyin: "yú", meaning: "在；对；表示比较。", words: [
    { word: "于是", pinyin: "yú shì", meaning: "表示接着前面的事情发生。" },
    { word: "对于", pinyin: "duì yú", meaning: "表示人、事物之间的关系。" },
    { word: "由于", pinyin: "yóu yú", meaning: "表示原因。" }
  ], sentence: "我于早上七点起床。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  共: { text: "共", type: "character", pinyin: "gòng", meaning: "一起；总合。", words: [
    { word: "一共", pinyin: "yī gòng", meaning: "合在一起计算。" },
    { word: "共同", pinyin: "gòng tóng", meaning: "大家一起做。" },
    { word: "公共", pinyin: "gōng gòng", meaning: "属于大家的。" }
  ], sentence: "我们一共有五个人。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  还: { text: "还", type: "character", pinyin: "hái", meaning: "仍然；更加；再。", words: [
    { word: "还有", pinyin: "hái yǒu", meaning: "另外存在。" },
    { word: "还是", pinyin: "hái shì", meaning: "表示选择或仍然。" },
    { word: "还好", pinyin: "hái hǎo", meaning: "不算坏，勉强可以。" }
  ], sentence: "我还没写完作业。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  剩: { text: "剩", type: "character", pinyin: "shèng", meaning: "多余下来；留下。", words: [
    { word: "剩下", pinyin: "shèng xià", meaning: "多出来的部分。" },
    { word: "剩余", pinyin: "shèng yú", meaning: "用不完留下的。" },
    { word: "剩饭", pinyin: "shèng fàn", meaning: "没吃完的饭。" }
  ], sentence: "盘子里剩了一点菜。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  左: { text: "左", type: "character", pinyin: "zuǒ", meaning: "面向南时靠东的一边。", words: [
    { word: "左手", pinyin: "zuǒ shǒu", meaning: "左边的手。" },
    { word: "左右", pinyin: "zuǒ yòu", meaning: "左边和右边；大约。" },
    { word: "向左", pinyin: "xiàng zuǒ", meaning: "朝着左边。" }
  ], sentence: "请举起你的左手。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  右: { text: "右", type: "character", pinyin: "yòu", meaning: "面向南时靠西的一边。", words: [
    { word: "右手", pinyin: "yòu shǒu", meaning: "右边的手。" },
    { word: "右边", pinyin: "yòu biān", meaning: "靠右的一侧。" },
    { word: "向右", pinyin: "xiàng yòu", meaning: "朝着右边。" }
  ], sentence: "他用右手写字。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  前: { text: "前", type: "character", pinyin: "qián", meaning: "面对的方向；过去的。", words: [
    { word: "前面", pinyin: "qián miàn", meaning: "正对的方向。" },
    { word: "前天", pinyin: "qián tiān", meaning: "昨天的前一天。" },
    { word: "向前", pinyin: "xiàng qián", meaning: "朝着前面。" }
  ], sentence: "学校在我家前面。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  里: { text: "里", type: "character", pinyin: "lǐ", meaning: "内部；一定范围以内。", words: [
    { word: "里面", pinyin: "lǐ miàn", meaning: "在内部。" },
    { word: "家里", pinyin: "jiā lǐ", meaning: "在家庭内部。" },
    { word: "心里", pinyin: "xīn lǐ", meaning: "在思想或感情中。" }
  ], sentence: "书包里有很多书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  外: { text: "外", type: "character", pinyin: "wài", meaning: "超出某个范围；不是内部的。", words: [
    { word: "外面", pinyin: "wài miàn", meaning: "超出界限的地方。" },
    { word: "门外", pinyin: "mén wài", meaning: "门的外边。" },
    { word: "外出", pinyin: "wài chū", meaning: "到外面去。" }
  ], sentence: "请到门外等我。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  长: { text: "长", type: "character", pinyin: "cháng", meaning: "两点之间距离大；长度。", words: [
    { word: "很长", pinyin: "hěn cháng", meaning: "长度大。" },
    { word: "长江", pinyin: "cháng jiāng", meaning: "中国最长的河流。" },
    { word: "长大", pinyin: "zhǎng dà", meaning: "生长变大。" }
  ], sentence: "这条绳子很长。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  短: { text: "短", type: "character", pinyin: "duǎn", meaning: "两点之间距离小；不长。", words: [
    { word: "很短", pinyin: "hěn duǎn", meaning: "长度小。" },
    { word: "短处", pinyin: "duǎn chù", meaning: "不足的地方。" },
    { word: "短跑", pinyin: "duǎn pǎo", meaning: "距离短的跑步。" }
  ], sentence: "铅笔太短了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  高: { text: "高", type: "character", pinyin: "gāo", meaning: "从下到上距离大；等级在上。", words: [
    { word: "很高", pinyin: "hěn gāo", meaning: "高度大。" },
    { word: "高兴", pinyin: "gāo xìng", meaning: "愉快而兴奋。" },
    { word: "高山", pinyin: "gāo shān", meaning: "很高的山。" }
  ], sentence: "他长得比我高。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  矮: { text: "矮", type: "character", pinyin: "ǎi", meaning: "身材短小，高度低。", words: [
    { word: "矮小", pinyin: "ǎi xiǎo", meaning: "又矮又小。" },
    { word: "矮凳", pinyin: "ǎi dèng", meaning: "矮的凳子。" },
    { word: "矮树", pinyin: "ǎi shù", meaning: "长得不高的树。" }
  ], sentence: "弟弟比我矮一点。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  轻: { text: "轻", type: "character", pinyin: "qīng", meaning: "重量小，不重。", words: [
    { word: "轻轻", pinyin: "qīng qīng", meaning: "动作很轻，不用力。" },
    { word: "轻声", pinyin: "qīng shēng", meaning: "说话声音很小。" },
    { word: "轻重", pinyin: "qīng zhòng", meaning: "轻和重，指重量大小。" }
  ], sentence: "这个书包很轻。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  重: { text: "重", type: "character", pinyin: "zhòng", meaning: "重量大，不轻。", words: [
    { word: "重要", pinyin: "zhòng yào", meaning: "非常关键，不能缺少。" },
    { word: "重量", pinyin: "zhòng liàng", meaning: "东西有多重。" },
    { word: "重心", pinyin: "zhòng xīn", meaning: "物体最重的中心点。" }
  ], sentence: "这袋米很重。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  比: { text: "比", type: "character", pinyin: "bǐ", meaning: "比较，看看谁高谁低、谁多谁少。", words: [
    { word: "比较", pinyin: "bǐ jiào", meaning: "比一比，看看有什么不同。" },
    { word: "比赛", pinyin: "bǐ sài", meaning: "比谁跑得快、跳得高等。" },
    { word: "比如", pinyin: "bǐ rú", meaning: "举个例子来说。" }
  ], sentence: "我比你高一点。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  几: { text: "几", type: "character", pinyin: "jǐ", meaning: "问数量多少，或表示不多的数目。", words: [
    { word: "几个", pinyin: "jǐ gè", meaning: "问有多少个，或表示不多的几个。" },
    { word: "几天", pinyin: "jǐ tiān", meaning: "问有多少天，或表示不多的天数。" },
    { word: "十几", pinyin: "shí jǐ", meaning: "比十多一点的数量。" }
  ], sentence: "桌上有几个苹果？", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  图: { text: "图", type: "character", pinyin: "tú", meaning: "画出来的形象或形状。", words: [
    { word: "图画", pinyin: "tú huà", meaning: "用笔画出来的画。" },
    { word: "图片", pinyin: "tú piàn", meaning: "印在纸上的图画或照片。" },
    { word: "地图", pinyin: "dì tú", meaning: "画着山河、道路的图。" }
  ], sentence: "这本书有很多图。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  形: { text: "形", type: "character", pinyin: "xíng", meaning: "样子，物体的外表。", words: [
    { word: "形状", pinyin: "xíng zhuàng", meaning: "东西的样子，如圆的、方的。" },
    { word: "圆形", pinyin: "yuán xíng", meaning: "圆圆的形状。" },
    { word: "方形", pinyin: "fāng xíng", meaning: "方方的形状。" }
  ], sentence: "这个积木是什么形？", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  圆: { text: "圆", type: "character", pinyin: "yuán", meaning: "像球或太阳的形状，没有角。", words: [
    { word: "圆形", pinyin: "yuán xíng", meaning: "圆圆的形状。" },
    { word: "圆圈", pinyin: "yuán quān", meaning: "圆圆的圈。" },
    { word: "圆球", pinyin: "yuán qiú", meaning: "圆圆的球。" }
  ], sentence: "月亮有时是圆的。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  方: { text: "方", type: "character", pinyin: "fāng", meaning: "四个角都是直角的形状，或方向。", words: [
    { word: "方形", pinyin: "fāng xíng", meaning: "方方的形状。" },
    { word: "方向", pinyin: "fāng xiàng", meaning: "东、南、西、北等朝向。" },
    { word: "地方", pinyin: "dì fāng", meaning: "一个位置或区域。" }
  ], sentence: "这个盒子是方的。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  角: { text: "角", type: "character", pinyin: "jiǎo", meaning: "物体边沿相接的地方，或牛、羊头上长的尖硬东西。", words: [
    { word: "角落", pinyin: "jiǎo luò", meaning: "墙角或屋子里的边角地方。" },
    { word: "牛角", pinyin: "niú jiǎo", meaning: "牛头上长的角。" },
    { word: "三角形", pinyin: "sān jiǎo xíng", meaning: "有三个角的形状。" }
  ], sentence: "桌子的角很尖。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  元: { text: "元", type: "character", pinyin: "yuán", meaning: "货币单位，也指开始的、第一的。", words: [
    { word: "一元", pinyin: "yī yuán", meaning: "一块钱。" },
    { word: "元旦", pinyin: "yuán dàn", meaning: "新年的第一天。" },
    { word: "元月", pinyin: "yuán yuè", meaning: "一年的第一个月，一月。" }
  ], sentence: "这支笔一元钱。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  分: { text: "分", type: "character", pinyin: "fēn", meaning: "把整体变成几部分，或货币单位，一角钱的十分之一。", words: [
    { word: "分开", pinyin: "fēn kāi", meaning: "把合在一起的东西弄开。" },
    { word: "一分", pinyin: "yī fēn", meaning: "一角钱的十分之一。" },
    { word: "十分", pinyin: "shí fēn", meaning: "非常，很。" }
  ], sentence: "请把糖果分给大家。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  合: { text: "合", type: "character", pinyin: "hé", meaning: "闭上，或者把东西对在一起。", words: [
    { word: "合上", pinyin: "hé shàng", meaning: "把打开的东西闭上。" },
    { word: "合作", pinyin: "hé zuò", meaning: "一起做事。" },
    { word: "合唱", pinyin: "hé chàng", meaning: "大家一起唱歌。" }
  ], sentence: "请把书合上。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  组: { text: "组", type: "character", pinyin: "zǔ", meaning: "把几个东西放在一起成为一群。", words: [
    { word: "小组", pinyin: "xiǎo zǔ", meaning: "几个人组成的小队。" },
    { word: "组成", pinyin: "zǔ chéng", meaning: "由几个部分合成一个整体。" },
    { word: "分组", pinyin: "fēn zǔ", meaning: "把人分成几个小队。" }
  ], sentence: "我们分成小组做游戏。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  成: { text: "成", type: "character", pinyin: "chéng", meaning: "做好了，完成了。", words: [
    { word: "完成", pinyin: "wán chéng", meaning: "把事情做完。" },
    { word: "成长", pinyin: "chéng zhǎng", meaning: "长大，变得更好。" },
    { word: "成为", pinyin: "chéng wéi", meaning: "变成。" }
  ], sentence: "我完成了作业。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  算: { text: "算", type: "character", pinyin: "suàn", meaning: "用数字来数一数、加一加。", words: [
    { word: "计算", pinyin: "jì suàn", meaning: "用数字来算一算。" },
    { word: "算数", pinyin: "suàn shù", meaning: "做数学题。" },
    { word: "算了", pinyin: "suàn le", meaning: "表示不再计较或停止。" }
  ], sentence: "我会算十以内的加法。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  式: { text: "式", type: "character", pinyin: "shì", meaning: "样子或方法。", words: [
    { word: "算式", pinyin: "suàn shì", meaning: "用数字和符号写的计算式子。" },
    { word: "方式", pinyin: "fāng shì", meaning: "做事情的方法。" },
    { word: "样式", pinyin: "yàng shì", meaning: "东西的样子。" }
  ], sentence: "请写出这个算式。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  题: { text: "题", type: "character", pinyin: "tí", meaning: "需要回答或解决的问题。", words: [
    { word: "题目", pinyin: "tí mù", meaning: "问题的名称或内容。" },
    { word: "问题", pinyin: "wèn tí", meaning: "需要回答的事情。" },
    { word: "做题", pinyin: "zuò tí", meaning: "解答题目。" }
  ], sentence: "这道题我会做。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  案: { text: "案", type: "character", pinyin: "àn", meaning: "对问题的解答或计划。", words: [
    { word: "答案", pinyin: "dá àn", meaning: "问题的正确结果。" },
    { word: "方案", pinyin: "fāng àn", meaning: "做事的计划。" },
    { word: "图案", pinyin: "tú àn", meaning: "画出来的花纹或图形。" }
  ], sentence: "我知道这道题的答案。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  写: { text: "写", type: "character", pinyin: "xiě", meaning: "用笔在纸上画出字或画。", words: [
    { word: "写字", pinyin: "xiě zì", meaning: "用笔写出汉字。" },
    { word: "写作业", pinyin: "xiě zuò yè", meaning: "完成老师布置的功课。" },
    { word: "书写", pinyin: "shū xiě", meaning: "写字。" }
  ], sentence: "我在田字格里写字。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  读: { text: "读", type: "character", pinyin: "dú", meaning: "看着文字念出声音。", words: [
    { word: "读书", pinyin: "dú shū", meaning: "看着书念出来。" },
    { word: "阅读", pinyin: "yuè dú", meaning: "看书并理解内容。" },
    { word: "朗读", pinyin: "lǎng dú", meaning: "大声清楚地读出来。" }
  ], sentence: "我喜欢读故事书。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  个: { text: "个", type: "character", pinyin: "gè", meaning: "表示单个的人或东西。", words: [
    { word: "一个", pinyin: "yī gè", meaning: "数量是一。" },
    { word: "个人", pinyin: "gè rén", meaning: "一个人。" },
    { word: "个子", pinyin: "gè zi", meaning: "人的身高。" }
  ], sentence: "我有一个新书包。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  只: { text: "只", type: "character", pinyin: "zhī", meaning: "用于动物、器具或成对东西中的一个。", words: [
    { word: "一只", pinyin: "yī zhī", meaning: "数量是一，用于动物等。" },
    { word: "只有", pinyin: "zhǐ yǒu", meaning: "仅仅有。" },
    { word: "只是", pinyin: "zhǐ shì", meaning: "仅仅是。" }
  ], sentence: "树上有一只小鸟。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  支: { text: "支", type: "character", pinyin: "zhī", meaning: "用于细长的东西，如笔。", words: [
    { word: "一支", pinyin: "yī zhī", meaning: "数量是一，用于笔等。" },
    { word: "支持", pinyin: "zhī chí", meaning: "帮助别人，赞同。" },
    { word: "支出", pinyin: "zhī chū", meaning: "把钱花出去。" }
  ], sentence: "我有一支新铅笔。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  朵: { text: "朵", type: "character", pinyin: "duǒ", meaning: "花朵，也用作量词，用于花或云彩。", words: [
    { word: "花朵", pinyin: "huā duǒ", meaning: "花的总称，一朵一朵的花。" },
    { word: "耳朵", pinyin: "ěr duo", meaning: "人和动物用来听声音的器官。" },
    { word: "云朵", pinyin: "yún duǒ", meaning: "天上飘着的一团一团的云。" }
  ], sentence: "花园里开了一朵红花。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  条: { text: "条", type: "character", pinyin: "tiáo", meaning: "细长的东西，也用作量词，用于长形物。", words: [
    { word: "面条", pinyin: "miàn tiáo", meaning: "用面粉做的细长条食物。" },
    { word: "一条", pinyin: "yī tiáo", meaning: "数量词，用于长形的东西。" },
    { word: "条件", pinyin: "tiáo jiàn", meaning: "影响事情发生或发展的因素。" }
  ], sentence: "妈妈煮了一碗面条。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  输: { text: "输", type: "character", pinyin: "shū", meaning: "在比赛或游戏中没有赢。", words: [
    { word: "输赢", pinyin: "shū yíng", meaning: "比赛或游戏中的失败和胜利。" },
    { word: "认输", pinyin: "rèn shū", meaning: "承认自己输了。" },
    { word: "运输", pinyin: "yùn shū", meaning: "把东西从一个地方送到另一个地方。" }
  ], sentence: "这次比赛我们输了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  练: { text: "练", type: "character", pinyin: "liàn", meaning: "反复做一件事，让自己更熟练。", words: [
    { word: "练习", pinyin: "liàn xí", meaning: "反复做题目或动作，让自己学得更好。" },
    { word: "练字", pinyin: "liàn zì", meaning: "反复写字，让字更好看。" },
    { word: "训练", pinyin: "xùn liàn", meaning: "通过练习学会某种本领。" }
  ], sentence: "我每天练习写字。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  认: { text: "认", type: "character", pinyin: "rèn", meaning: "认识、分辨人或东西。", words: [
    { word: "认识", pinyin: "rèn shi", meaning: "知道某人或某物是谁或什么。" },
    { word: "认真", pinyin: "rèn zhēn", meaning: "做事不马虎，很用心。" },
    { word: "认字", pinyin: "rèn zì", meaning: "学习并记住汉字。" }
  ], sentence: "我认识这个字。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  河: { text: "河", type: "character", pinyin: "hé", meaning: "天然的大水流，比小溪大。", words: [
    { word: "小河", pinyin: "xiǎo hé", meaning: "比较小的河流。" },
    { word: "河水", pinyin: "hé shuǐ", meaning: "河里的水。" },
    { word: "河边", pinyin: "hé biān", meaning: "河的旁边。" }
  ], sentence: "我家门前有一条小河。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  路: { text: "路", type: "character", pinyin: "lù", meaning: "供人或车走的地方。", words: [
    { word: "马路", pinyin: "mǎ lù", meaning: "城市里供车行驶的宽路。" },
    { word: "走路", pinyin: "zǒu lù", meaning: "用脚在路上行进。" },
    { word: "路口", pinyin: "lù kǒu", meaning: "两条路交叉的地方。" }
  ], sentence: "我走路去学校。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  包: { text: "包", type: "character", pinyin: "bāo", meaning: "用纸、布等把东西裹起来；也指装东西的袋子。", words: [
    { word: "书包", pinyin: "shū bāo", meaning: "学生用来装书本的包。" },
    { word: "包子", pinyin: "bāo zi", meaning: "一种有馅的面食。" },
    { word: "面包", pinyin: "miàn bāo", meaning: "用面粉烤制的食物。" }
  ], sentence: "我的书包很漂亮。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  校: { text: "校", type: "character", pinyin: "xiào", meaning: "学生学习的地方。", words: [
    { word: "学校", pinyin: "xué xiào", meaning: "学生上学的地方。" },
    { word: "校园", pinyin: "xiào yuán", meaning: "学校里面的场地。" },
    { word: "校长", pinyin: "xiào zhǎng", meaning: "学校最大的负责人。" }
  ], sentence: "我们的学校很大。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  师: { text: "师", type: "character", pinyin: "shī", meaning: "教别人知识或技能的人。", words: [
    { word: "老师", pinyin: "lǎo shī", meaning: "在学校教学生的人。" },
    { word: "师父", pinyin: "shī fu", meaning: "传授技艺的人。" },
    { word: "师生", pinyin: "shī shēng", meaning: "老师和学生。" }
  ], sentence: "老师教我们认字。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  友: { text: "友", type: "character", pinyin: "yǒu", meaning: "关系好、常在一起玩的人。", words: [
    { word: "朋友", pinyin: "péng you", meaning: "和自己关系好的人。" },
    { word: "友好", pinyin: "yǒu hǎo", meaning: "像朋友一样亲近、和睦。" },
    { word: "友情", pinyin: "yǒu qíng", meaning: "朋友之间的感情。" }
  ], sentence: "他是我的好朋友。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  测: { text: "测", type: "character", pinyin: "cè", meaning: "用工具或方法来了解、检验。", words: [
    { word: "测量", pinyin: "cè liáng", meaning: "用工具量出大小、长短等。" },
    { word: "测试", pinyin: "cè shì", meaning: "通过题目或操作检验能力。" },
    { word: "猜测", pinyin: "cāi cè", meaning: "根据线索试着想答案。" }
  ], sentence: "我们用尺子测量长度。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  签: { text: "签", type: "character", pinyin: "qiān", meaning: "写下姓名或用来标记的小条、小牌。", words: [
    { word: "标签", pinyin: "biāo qiān", meaning: "写着姓名、名称等信息的小卡片。" },
    { word: "签名", pinyin: "qiān míng", meaning: "写下自己的名字。" },
    { word: "书签", pinyin: "shū qiān", meaning: "夹在书里标记读到哪里的东西。" }
  ], sentence: "每张作品下面都有姓名标签。", source: "day14-revision-d", updatedAt: "2026-07-26" },
  对: { text: "对", type: "character", pinyin: "duì", meaning: "比较两边看是否一致，也表示正确。", words: [
    { word: "核对", pinyin: "hé duì", meaning: "把两边的信息逐项比较，看看是否一致。" },
    { word: "对照", pinyin: "duì zhào", meaning: "拿两个东西比较着看。" },
    { word: "对错", pinyin: "duì cuò", meaning: "正确和错误。" }
  ], sentence: "交作业前要核对姓名。", source: "day14-revision-d", updatedAt: "2026-07-26" },
  秒: { text: "秒", type: "character", pinyin: "miǎo", meaning: "时间单位，60秒是1分钟。", words: [
    { word: "秒针", pinyin: "miǎo zhēn", meaning: "钟表上指示秒的指针。" },
    { word: "分秒", pinyin: "fēn miǎo", meaning: "分钟和秒，表示很短的时间。" },
    { word: "秒表", pinyin: "miǎo biǎo", meaning: "可以精确到秒的计时器。" }
  ], sentence: "一分钟有六十秒。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  确: { text: "确", type: "character", pinyin: "què", meaning: "真实、对的，没有错误。", words: [
    { word: "正确", pinyin: "zhèng què", meaning: "答案或做法是对的。" },
    { word: "确实", pinyin: "què shí", meaning: "真的，不假。" },
    { word: "准确", pinyin: "zhǔn què", meaning: "完全符合要求，没有偏差。" }
  ], sentence: "你的回答很正确。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  容: { text: "容", type: "character", pinyin: "róng", meaning: "装得下，包含；也指脸上的样子。", words: [
    { word: "容易", pinyin: "róng yì", meaning: "做起来不困难。" },
    { word: "笑容", pinyin: "xiào róng", meaning: "脸上高兴的样子。" },
    { word: "容器", pinyin: "róng qì", meaning: "装东西的器具。" }
  ], sentence: "这个箱子能容下很多玩具。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  熟: { text: "熟", type: "character", pinyin: "shú", meaning: "食物加热到可以吃；也指对人或事很了解。", words: [
    { word: "成熟", pinyin: "chéng shú", meaning: "果实长到可以吃；人长大懂事。" },
    { word: "熟悉", pinyin: "shú xī", meaning: "对人或地方很了解。" },
    { word: "熟人", pinyin: "shú rén", meaning: "认识很久的人。" }
  ], sentence: "苹果熟了，红红的真好看。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  危: { text: "危", type: "character", pinyin: "wēi", meaning: "不安全，可能受到伤害或损失。", words: [
    { word: "危险", pinyin: "wēi xiǎn", meaning: "可能让人受伤或出事的。" },
    { word: "危害", pinyin: "wēi hài", meaning: "让东西或人受到伤害。" },
    { word: "危机", pinyin: "wēi jī", meaning: "很困难、很危险的时刻。" }
  ], sentence: "过马路时要注意危险。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  恶: { text: "恶", type: "character", pinyin: "è", meaning: "很坏，让人讨厌或害怕的。", words: [
    { word: "凶恶", pinyin: "xiōng è", meaning: "样子很可怕，不善良。" },
    { word: "恶人", pinyin: "è rén", meaning: "做坏事的人。" },
    { word: "恶劣", pinyin: "è liè", meaning: "很坏，让人不舒服。" }
  ], sentence: "大灰狼很凶恶，想吃小羊。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  易: { text: "易", type: "character", pinyin: "yì", meaning: "做起来不难；也指改变。", words: [
    { word: "容易", pinyin: "róng yì", meaning: "做起来不困难。" },
    { word: "交易", pinyin: "jiāo yì", meaning: "互相交换东西。" },
    { word: "易手", pinyin: "yì shǒu", meaning: "东西从一个人转到另一个人手里。" }
  ], sentence: "这道题很容易，我很快就做完了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  预: { text: "预", type: "character", pinyin: "yù", meaning: "事先，提前做准备。", words: [
    { word: "预习", pinyin: "yù xí", meaning: "上课前自己先学习。" },
    { word: "预报", pinyin: "yù bào", meaning: "提前告诉将要发生的事情。" },
    { word: "预备", pinyin: "yù bèi", meaning: "提前准备好。" }
  ], sentence: "明天要下雨，天气预报说了。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" },
  境: { text: "境", type: "character", pinyin: "jìng", meaning: "地方，周围的情况。", words: [
    { word: "环境", pinyin: "huán jìng", meaning: "周围的地方和情况。" },
    { word: "边境", pinyin: "biān jìng", meaning: "国家或地区边上的地方。" },
    { word: "处境", pinyin: "chǔ jìng", meaning: "现在的情况，多指困难或好的。" }
  ], sentence: "我们要保护环境，不乱扔垃圾。", source: "deepseek-v4-pro-bulk-v2.5.4", updatedAt: "2026-07-04" }
};

const SAMPLE_TEXT = "今日学习：日、月、水、火。词语：日光、月亮、喝水、火车。短句：今天的日光很温暖。易错：月、水。阅读主题：今日练习。";
const STORAGE_KEY = "hanzi-memory-app-v1";

let state = loadState();
let pendingLearningPackPreview = null;
let currentReadAloud = { key: "", utterance: null, audio: null, button: null };
let activeRecording = null;
const artImagePreloadCache = new Map();
const recordingStartPending = new Set();
let breakCountdownTimer = null;
let courseTimerInterval = null;
let courseTimerObserver = null;
let courseTimerObservedKind = "";
let lastCourseTimerHeartbeatWriteAt = 0;
let courseSessionCounter = 0;
let generatedQuestions = [];
let approvedQuestions = [];
let currentQuestionIndex = 0;
let characterPage = 0;
let dictionaryLookupToken = 0;
let dictionarySearchTimer = 0;
let generationInFlight = false;
let englishProgress = loadEnglishProgress();
let englishLibrary = buildEnglishWordLibrary();
let currentEnglishWord = null;
let englishActionLocked = false;
let englishStoryExampleMatches = [];
let englishStoryExampleIndex = 0;
let englishBlockExampleInFlight = false;
let englishCurrentExampleSentence = "";
let englishRenderedWordId = "";
let englishPage = 0;
let englishVisibleWords = [];
let englishPhoneticVisible = {};
let selectedEnglishCardId = "";
let englishExamplePhoneticsVisible = false;
let englishExampleTranslationVisible = false;
let englishExamplePanelMode = "story";
let englishCurrentBlockExample = null;
let blocksProgress = loadBlocksProgress();
let currentBlockPatternIndex = 0;
let selectedBlockPatternId = localStorage.getItem(ENGLISH_BLOCK_SELECTED_PATTERN_KEY) || "subject_want_to_verb";
let selectedSourceFilter = localStorage.getItem(ENGLISH_BLOCK_SOURCE_FILTER_KEY) || "all_sources";
let currentBlockExerciseType = "ordering";
let blockSourceExamples = [];
let blockSourceExampleIndex = 0;
let blockSourceExamplesVisible = false;
let activeBlockExerciseType = "ordering";
let blockQuestionsPerType = 3;
let blockExerciseBatch = loadLatestBlockExerciseBatch();
let blockExerciseIndex = 0;
let blockExerciseIndexes = {};
let blockGenerating = false;
let blockAnswerState = {};
let blockExerciseError = "";
let patternExampleCount = 3;
let generatedPatternExamples = [];
let generatedPatternExampleIndex = 0;
let generatedPatternExamplesVisible = false;
let currentPatternExampleIndex = 0;
let patternExamplePhoneticsVisible = false;
let patternExampleTranslationVisible = false;
let blockExampleDisplayMode = "default_pattern_example";
let blockExamplesCollapsed = false;
let blockExampleGenerating = false;
let blockExampleTranslationVisible = false;
let blockExampleError = "";
const CURRENT_APP_ORIGIN = typeof window !== "undefined" && window.location ? window.location.origin : "";
const LOCAL_API_ORIGINS = [
  CURRENT_APP_ORIGIN,
  "http://127.0.0.1:4173",
  "http://localhost:4173"
].filter(Boolean);
const APP_ACCESS_CODE_STORAGE_KEY = "hanzi_app_access_code";
const AI_TIMEOUTS = {
  dailyPractice: 90000,
  englishBlocks: 90000,
  examples: 60000
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindDailyPractice();
  bindDailyCoursePages();
  bindCharacterPractice();
  bindEnglishRecognition();
  bindEnglishBlocks();
  bindDictionarySearch();
  bindSettings();
  showView(getInitialView(), false);
  renderCharacters();
  renderEnglishRecognition();
  renderEnglishBlocks();
  renderTodayDashboard();
  renderPlanetOverview();
  renderPlanetPages();
  renderChineseLesson();
  renderEnglishLesson();
  renderArtLesson();
  renderWordbook();
  renderDictionary();
  renderReport();
  renderLexicalCheck();
  renderLearningPackApiStatus();
  restoreLearningPackInput();
  loadBuiltinLearningPack();
  startCourseTimerTicker();
  window.addEventListener("popstate", () => showView(getInitialView(), false));
  window.addEventListener("hashchange", () => showView(getInitialView(), false));
  bindGlobalKeyboardShortcuts();
});

function bindGlobalKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const tag = event.target?.tagName?.toLowerCase();
    if (["input", "textarea", "select"].includes(tag) || event.target?.isContentEditable) return;
    const delta = event.key === "ArrowRight" ? 1 : -1;
    if ($("#english")?.classList.contains("active") && englishStoryExampleMatches.length) {
      event.preventDefault();
      moveStoryExample(delta);
      return;
    }
    if ($("#english-blocks")?.classList.contains("active")) {
      if (getCurrentExerciseSetQuestions(activeBlockExerciseType).length > 1) {
        event.preventDefault();
        moveBlockExercise(delta);
      } else if (!blockExamplesCollapsed && getActiveBlockExamples().length > 1) {
        event.preventDefault();
        moveUnifiedBlockExample(delta);
      }
    }
  });
}

function getInitialView() {
  const { view } = parseRouteHash();
  if (view) return view;
  if (location.pathname === "/english-blocks") return "english-blocks";
  if (location.pathname === "/english-recognition" || location.pathname === "/english-words") return "english";
  return "daily";
}

function parseRouteHash() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return { view: "", date: "" };
  const [viewPart, queryPart = ""] = raw.split("?");
  const params = new URLSearchParams(queryPart);
  return { view: viewPart, date: params.get("date") || "" };
}

function loadState() {
  const fallback = {
    wordbook: {},
    attempts: {},
    dailyRecords: [],
    settings: {},
    mastery: {},
    chineseRecognition: { version: 2, items: {}, recentlyShownIds: [] },
    dictionaryCache: {},
    learnerChars: {},
    lastLink: "",
    latestLearning: null,
    learningPacks: {},
    learningPackArchive: { version: 1, entries: [], byDate: {} },
    courseProgress: {},
    latestLearningPackId: "",
    selectedLearningPackId: "",
    learningPackSelectionSource: "",
    lastAutoSelectedBuiltinPackId: "",
    builtinLearningPackLoad: null,
    lastLearningPackRaw: "",
    focusTitleOverride: "",
    answerPanelsHidden: false
  };
  try {
    const loaded = { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    loaded.chineseRecognition = migrateChineseRecognitionProgress(loaded);
    loaded.learningPacks = { ...(loadStandaloneLearningPacks().packs || {}), ...(loaded.learningPacks || {}) };
    const standalonePacks = loadStandaloneLearningPacks();
    loaded.latestLearningPackId ||= standalonePacks.latestPackId || "";
    loaded.selectedLearningPackId ||= standalonePacks.selectedPackId || loaded.latestLearningPackId || "";
    loaded.learningPackSelectionSource ||= standalonePacks.selectionSource || inferLearningPackSelectionSource(loaded);
    loaded.lastAutoSelectedBuiltinPackId ||= standalonePacks.lastAutoSelectedBuiltinPackId || (loaded.learningPackSelectionSource === "auto" ? loaded.selectedLearningPackId || "" : "");
    loaded.learningPackArchive = migrateLearningPackArchive(loaded);
    loaded.courseProgress = { ...(loadStandaloneCourseProgress().progress || {}), ...(loaded.courseProgress || {}) };
    normalizeStaleCourseRecordingStates(loaded);
    reconcilePersistedCourseTimers(loaded);
    return loaded;
  } catch {
    return fallback;
  }
}

function inferLearningPackSelectionSource(loaded) {
  if (!loaded?.selectedLearningPackId) return "auto";
  if (!loaded.latestLearningPackId || loaded.selectedLearningPackId === loaded.latestLearningPackId) return "auto";
  return "manual";
}

function reconcilePersistedCourseTimers(targetState, now = Date.now()) {
  Object.values(targetState.courseProgress || {}).forEach((progress) => {
    ["chinese", "english", "art"].forEach((course) => reconcileCourseTimerSide(progress?.[course], now, "app_restore"));
  });
}

function reconcileCourseTimerSide(side, now = Date.now(), reason = "app_restore") {
  if (!side) return side;
  const accumulated = clampDuration(Number(side.accumulatedMs ?? side.elapsedMs ?? 0));
  const wasRunning = Boolean(side.isRunning || side.runningSince);
  const runningSince = Number(side.runningSince || 0);
  const heartbeat = Number(side.lastHeartbeatAt || 0);
  side.timerModelVersion = Number(side.timerModelVersion || 1);
  side.accumulatedMs = accumulated;
  side.elapsedMs = accumulated;
  if (!wasRunning) {
    side.isRunning = false;
    side.runningSince = null;
    return side;
  }
  if (side.timerModelVersion >= COURSE_TIMER_MODEL_VERSION && isTrustedTimestamp(runningSince, now) && isTrustedTimestamp(heartbeat, now) && heartbeat >= runningSince) {
    const trustedEnd = Math.min(now, heartbeat + COURSE_TIMER_RECOVERY_GRACE_MS);
    side.accumulatedMs = clampDuration(accumulated + Math.max(0, trustedEnd - runningSince));
    side.elapsedMs = side.accumulatedMs;
  }
  side.isRunning = false;
  side.runningSince = null;
  side.lastHeartbeatAt = "";
  side.pausedAt = new Date(now).toISOString();
  side.pauseReason = reason;
  if (!side.finishedAt && side.startedAt) side.sessionStatus = "paused";
  side.timerModelVersion = COURSE_TIMER_MODEL_VERSION;
  Object.values(side.sections || side.steps || {}).forEach((item) => {
    if (!item?.runningSince) return;
    item.elapsedMs = clampDuration(Number(item.elapsedMs || 0));
    item.runningSince = null;
    item.pauseReason = reason;
  });
  return side;
}

function isTrustedTimestamp(value, now = Date.now()) {
  return Number.isFinite(value) && value > 0 && value <= now + 1000;
}

function clampDuration(value) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, 24 * 60 * 60 * 1000);
}

function normalizeStaleCourseRecordingStates(targetState) {
  const progressMap = targetState.courseProgress || {};
  Object.values(progressMap).forEach((progress) => {
    ["chinese", "english", "art"].forEach((course) => {
      const side = progress?.[course];
      if (!side || !["requesting", "recording", "saving"].includes(side.courseRecordingStatus)) return;
      const activityId = `${course}:course_recording`;
      const clips = Object.values(targetState.recordingClips || {}).filter((clip) => (
        clip.packId === progress.packId &&
        clip.planetId === course &&
        clip.activityId === activityId &&
        clip.includeInFeedback !== false
      ));
      const hasPersistedChunks = clips.some((clip) => Number(clip.chunkCount || 0) > 0);
      if (hasPersistedChunks) {
        side.courseRecordingStatus = "interrupted";
        side.recordingInterruptionReason ||= "page_reloaded";
        clips.forEach((clip) => {
          if (["countdown", "recording", "paused"].includes(clip.status)) {
            clip.status = "interrupted";
            clip.interruptionReason ||= "page_reloaded";
            clip.endedAt ||= new Date().toISOString();
          }
        });
      } else {
        side.courseRecordingStatus = "idle";
        side.recordingUnavailable = false;
        side.recordingUnavailableReason = "";
      }
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStandaloneLearningPacks(state.learningPacks || {}, state.latestLearningPackId || "");
  saveStandaloneCourseProgress(state.courseProgress || {});
}

function loadStandaloneLearningPacks() {
  try {
    return { version: 1, packs: {}, latestPackId: "", selectedPackId: "", selectionSource: "", lastAutoSelectedBuiltinPackId: "", archive: { version: 1, entries: [], byDate: {} }, ...JSON.parse(localStorage.getItem(LEARNING_PACK_STORAGE_KEY) || "{}") };
  } catch {
    return { version: 1, packs: {}, latestPackId: "", selectedPackId: "", selectionSource: "", lastAutoSelectedBuiltinPackId: "", archive: { version: 1, entries: [], byDate: {} } };
  }
}

function saveStandaloneLearningPacks(packs, latestPackId) {
  localStorage.setItem(LEARNING_PACK_STORAGE_KEY, JSON.stringify({
    version: 1,
    latestPackId,
    selectedPackId: state?.selectedLearningPackId || latestPackId || "",
    selectionSource: state?.learningPackSelectionSource || "",
    lastAutoSelectedBuiltinPackId: state?.lastAutoSelectedBuiltinPackId || "",
    archive: state?.learningPackArchive || { version: 1, entries: [], byDate: {} },
    packs
  }));
}

function migrateLearningPackArchive(loaded) {
  const existing = loaded.learningPackArchive?.version ? loaded.learningPackArchive : loadStandaloneLearningPacks().archive;
  const archive = {
    version: 1,
    entries: Array.isArray(existing?.entries) ? existing.entries : [],
    byDate: existing?.byDate && typeof existing.byDate === "object" ? existing.byDate : {}
  };
  Object.values(loaded.learningPacks || {}).forEach((record) => {
    const pack = record?.data || record;
    if (!pack?.packId || !pack?.date) return;
    upsertLearningPackArchiveEntry(archive, {
      date: pack.date,
      packId: pack.packId,
      title: pack.title || record.title || "",
      schemaVersion: pack.schemaVersion || record.schemaVersion || "",
      availableSubjects: getPackAvailableSubjects(pack),
      publishedAt: record.importedAt || record.updatedAt || ""
    });
  });
  return archive;
}

function upsertLearningPackArchiveEntry(archive, entry) {
  archive.entries ||= [];
  archive.byDate ||= {};
  const normalized = {
    date: entry.date,
    packId: entry.packId,
    title: entry.title || "",
    availableSubjects: entry.availableSubjects || [],
    schemaVersion: entry.schemaVersion || "",
    publishedAt: entry.publishedAt || ""
  };
  const index = archive.entries.findIndex((item) => item.packId === normalized.packId);
  if (index >= 0) archive.entries[index] = { ...archive.entries[index], ...normalized };
  else archive.entries.push(normalized);
  archive.entries.sort((a, b) =>
    String(a.date).localeCompare(String(b.date)) ||
    String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")) ||
    String(b.packId || "").localeCompare(String(a.packId || ""))
  );
  archive.byDate = archive.entries.reduce((map, item) => {
    if (!item.date || !item.packId) return map;
    map[item.date] ||= [];
    if (!map[item.date].includes(item.packId)) map[item.date].push(item.packId);
    return map;
  }, {});
}

function loadStandaloneCourseProgress() {
  try {
    return { version: 1, progress: {}, ...JSON.parse(localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY) || "{}") };
  } catch {
    return { version: 1, progress: {} };
  }
}

function saveStandaloneCourseProgress(progress) {
  localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify({
    version: 1,
    progress
  }));
}

function migrateChineseRecognitionProgress(loaded) {
  const existing = loaded.chineseRecognition;
  if (existing?.version === 2 && existing.items) {
    return {
      version: 2,
      items: existing.items,
      recentlyShownIds: Array.isArray(existing.recentlyShownIds) ? existing.recentlyShownIds.slice(0, 5) : []
    };
  }

  const items = {};
  Object.entries(loaded.mastery || {}).forEach(([char, value]) => {
    const level = Math.max(0, Number(value?.level || 0));
    items[`char:${char}`] = {
      ...getProgressDefaults(`char:${char}`),
      seenCount: level,
      masteryCount: level,
      lastSeenAt: value?.updatedAt ? new Date(value.updatedAt).getTime() : null,
      lastResult: level > 0 ? "mastered" : null,
      recentResults: Array(Math.min(level, 3)).fill("mastered")
    };
  });

  return { version: 2, items, recentlyShownIds: [] };
}

function getProgressDefaults(itemId) {
  return {
    itemId,
    seenCount: 0,
    masteryCount: 0,
    unsureCount: 0,
    unknownCount: 0,
    skipCount: 0,
    hintCount: 0,
    lastSeenAt: null,
    lastResult: null,
    recentResults: []
  };
}

function normalizeProgress(progress, itemId) {
  return {
    ...getProgressDefaults(itemId),
    ...(progress || {}),
    itemId,
    recentResults: Array.isArray(progress?.recentResults) ? progress.recentResults.slice(-8) : []
  };
}

function updateRecognitionProgress(progressMap, itemId, result) {
  const progress = normalizeProgress(progressMap[itemId], itemId);
  progress.seenCount += result === "skipped" ? 0 : 1;
  progress.lastSeenAt = Date.now();
  progress.lastResult = result;
  progress.recentResults = [...progress.recentResults.slice(-7), result];

  if (result === "unknown") {
    progress.unknownCount += 1;
    progress.masteryCount = Math.max(0, progress.masteryCount - 1);
  } else if (result === "unsure") {
    progress.unsureCount += 1;
  } else if (result === "mastered") {
    progress.masteryCount += 1;
  } else if (result === "skipped") {
    progress.skipCount += 1;
  }

  progressMap[itemId] = progress;
  return progress;
}

function weightedRandomSelect(items, progressMap, recentlyShownIds, weightFn) {
  if (!items.length) return null;
  let candidates = items.filter((item) => !recentlyShownIds.includes(item.id));
  if (candidates.length < Math.min(4, items.length)) candidates = items;
  const weighted = candidates.map((item) => {
    const progress = normalizeProgress(progressMap[item.id], item.id);
    const weight = Number(weightFn(item, progress, recentlyShownIds));
    return { item, weight: Number.isFinite(weight) && weight > 0 ? weight : 0.001 };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (!Number.isFinite(total) || total <= 0) return candidates[0];
  let pick = Math.random() * total;
  for (const entry of weighted) {
    pick -= entry.weight;
    if (pick <= 0) return entry.item;
  }
  return weighted.at(-1)?.item || candidates[0];
}

function pushRecent(queue, itemId, limit = 5) {
  return [itemId, ...(queue || []).filter((id) => id !== itemId)].slice(0, limit);
}

function bindNavigation() {
  $$(".nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToView(link.dataset.view);
    });
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-go-view]");
    if (!target) return;
    event.preventDefault();
    navigateToView(target.dataset.goView);
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-route-back]");
    if (!target) return;
    event.preventDefault();
    showView(getParentView(getActiveView()));
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-pack-date], [data-date-nav]");
    if (!target) return;
    event.preventDefault();
    if (target.dataset.packDate) selectLearningPackDate(target.dataset.packDate);
    if (target.dataset.dateNav) selectRelativeLearningDate(target.dataset.dateNav);
  });
}

function navigateToView(view) {
  if (view === "today-chinese" && selectLatestLearningPackForPrimaryCourse()) return;
  showView(view);
}

function showView(view, updateHash = true, options = {}) {
  const target = $(`#${view}`) ? view : "daily";
  const historyMode = typeof updateHash === "string" ? updateHash : updateHash ? "push" : "none";
  if (!options.skipRouteDateSelection) applyRouteDateSelection();
  stopReadAloud();
  if (target !== "english" && "speechSynthesis" in window) speechSynthesis.cancel();
  if (!["english", "english-blocks"].includes(target)) resetExampleDisplayState();
  $$(".nav a").forEach((item) => item.classList.toggle("active", item.dataset.view === target));
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === target));
  if (target === "daily") renderTodayDashboard();
  if (target === "daily") renderPlanetOverview();
  if (["chinese-planet", "english-planet", "art-planet"].includes(target)) renderPlanetPages();
  if (target === "today-chinese") renderChineseLesson();
  if (target === "today-english") renderEnglishLesson();
  if (target === "today-art") renderArtLesson();
  if (target === "parent") {
    renderReport();
    renderRecordingLibrary();
    renderLearningPackApiStatus();
  }
  updateRouteBackButtons(target);
  scheduleBreakCountdown();
  updateCourseTimerUi();
  if (historyMode !== "none") updateBrowserRoute(target, historyMode);
}

function getActiveView() {
  return $(".view.active")?.id || getInitialView();
}

function getParentView(view) {
  const parents = {
    "today-chinese": "chinese-planet",
    "today-english": "english-planet",
    "today-art": "art-planet",
    "chinese-planet": "daily",
    "english-planet": "daily",
    "art-planet": "daily"
  };
  return parents[view] || "daily";
}

function updateRouteBackButtons(activeView) {
  $$("[data-route-back]").forEach((button) => {
    const section = button.closest(".view");
    const parent = getParentView(section?.id || activeView);
    const labels = {
      daily: "返回学习星系",
      "chinese-planet": "返回中文星球",
      "english-planet": "返回字母星球",
      "art-planet": "返回颜色星球"
    };
    button.setAttribute("aria-label", labels[parent] || "返回上一层");
  });
}

function updateBrowserRoute(target, historyMode = "push") {
  const date = getSelectedLearningPack()?.date || "";
  const includeDate = date && ["daily", "parent", "chinese-planet", "english-planet", "art-planet", "today-chinese", "today-english", "today-art"].includes(target);
  const hash = includeDate ? `#${target}?date=${encodeURIComponent(date)}` : `#${target}`;
  if (location.hash === hash) return;
  const method = historyMode === "replace" ? "replaceState" : "pushState";
  history[method]({ view: target }, "", hash);
}

function applyRouteDateSelection() {
  const { date } = parseRouteHash();
  if (!date) return;
  const packId = getPackIdForDate(date);
  if (packId && packId !== state.selectedLearningPackId) {
    state.selectedLearningPackId = packId;
    state.learningPackSelectionSource = "manual";
    saveState();
  }
}

function selectRelativeLearningDate(direction) {
  const dates = getLearningPackDates();
  if (!dates.length) return false;
  const currentDate = getSelectedLearningPack()?.date || dates.at(-1);
  let index = Math.max(0, dates.indexOf(currentDate));
  if (direction === "prev") index = Math.max(0, index - 1);
  if (direction === "next") index = Math.min(dates.length - 1, index + 1);
  if (direction === "today") {
    const today = getShanghaiDateString();
    index = dates.includes(today) ? dates.indexOf(today) : dates.length - 1;
  }
  return selectLearningPackDate(dates[index]);
}

function getShanghaiDateString(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function bindDailyPractice() {
  $("#pastePackBtn")?.addEventListener("click", pasteLearningPack);
  $("#learningPackFile")?.addEventListener("change", loadLearningPackFile);
  $("#parsePackBtn").addEventListener("click", checkAndImportLearningPack);
  $("#confirmPackBtn")?.addEventListener("click", confirmLearningPackImport);
  $("#lastPracticeBtn")?.addEventListener("click", showLastPractice);
  $("#approveBtn").addEventListener("click", approvePractice);
  $("#regenerateBtn").addEventListener("click", () => generatePracticeFromLatestPack());
  $("#confirmFocusBtn").addEventListener("click", confirmFocusItems);
  $("#correctBtn").addEventListener("click", () => answerCurrent("correct"));
  $("#hesitatedBtn").addEventListener("click", () => answerCurrent("hesitated"));
  $("#wrongBtn").addEventListener("click", () => answerCurrent("wrong"));
  $("#toggleFocusBtn").addEventListener("click", () => toggleAnswerPanel("focus"));
  $("#toggleReviewBtn").addEventListener("click", () => toggleAnswerPanel("review"));
  $$(".pack-next-actions [data-go-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.goView));
  });
  $("[data-start-daily-practice]")?.addEventListener("click", () => {
    if (!generatedQuestions.length) generatePracticeFromLatestPack();
    approvePractice();
  });
  applyAnswerPanelVisibility();
}

function bindDailyCoursePages() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-course-session-start], [data-course-session-reset], [data-course-start], [data-course-pause-item], [data-course-complete], [data-course-pause], [data-course-end], [data-course-result], [data-course-toggle-answer], [data-course-choice], [data-chinese-oral-concept], [data-reading-char], [data-break-start], [data-break-end], [data-english-app-complete], [data-art-audio], [data-art-hint], [data-art-image-open], [data-art-image-retry], [data-art-lightbox-close], [data-read-aloud], [data-course-recording-action], [data-recording-action], [data-recording-consent], [data-recording-play], [data-recording-delete], [data-english-mode], [data-course-reset-blocks], [data-course-block], [data-course-submit-blocks], [data-copy-feedback], [data-feedback-copy]");
    if (!target) return;
    if (target.dataset.courseSessionStart) startCourseSession(target.dataset.courseSessionStart);
    if (target.dataset.courseSessionReset) resetCourseSession(target.dataset.courseSessionReset);
    if (target.dataset.courseStart) startCourseItem(target.dataset.courseStart);
    if (target.dataset.coursePauseItem) pauseCourseItem(target.dataset.coursePauseItem);
    if (target.dataset.courseComplete) completeCourseItem(target.dataset.courseComplete);
    if (target.dataset.coursePause) pauseCourse(target.dataset.coursePause);
    if (target.dataset.courseEnd) endCourse(target.dataset.courseEnd);
    if (target.dataset.courseResult) setCourseItemResult(target.dataset.courseResult, target.dataset.resultValue, target.dataset.hintLevel);
    if (target.dataset.courseToggleAnswer) toggleCourseAnswer(target);
    if (target.dataset.courseChoice) selectCourseChoice(target);
    if (target.dataset.chineseOralConcept) toggleChineseOralConcept(target);
    if (target.dataset.readingChar) toggleReadingCharacter(target);
    if (target.dataset.breakStart) startBreak(target.dataset.breakStart, Number(target.dataset.breakMinutes || 5));
    if (target.dataset.breakEnd) endBreak(target.dataset.breakEnd, "manual");
  if (target.dataset.englishAppComplete) completeEnglishAppStage(target.dataset.englishAppComplete);
  if (target.dataset.artAudio) playArtNarration(target);
  if (target.dataset.artHint) revealArtHint(target);
  if (target.dataset.artImageRetry) retryArtImage(target);
  if (target.dataset.artImageOpen) openArtImageLightbox(target.dataset.artImageOpen, target.dataset.artImageAlt || "步骤图");
    if (target.dataset.artLightboxClose) closeArtImageLightbox();
    if (target.dataset.readAloud) toggleReadAloud(target);
    if (target.dataset.courseRecordingAction) handleCourseRecordingAction(target);
    if (target.dataset.recordingAction) handleRecordingAction(target);
    if (target.dataset.recordingConsent) setRecordingConsent(target.dataset.recordingConsent, target.dataset.consentValue);
    if (target.dataset.recordingPlay) playRecordingClip(target.dataset.recordingPlay);
    if (target.dataset.recordingDelete) deleteRecordingClip(target.dataset.recordingDelete);
    if (target.dataset.englishMode) setEnglishCourseMode(target.dataset.englishMode);
    if (target.dataset.courseResetBlocks) resetCourseBlocks(target.dataset.courseResetBlocks);
    if (target.dataset.courseBlock) selectCourseBlock(target);
    if (target.dataset.courseSubmitBlocks) submitCourseBlocks(target.dataset.courseSubmitBlocks);
    if (target.dataset.copyFeedback || target.dataset.feedbackCopy) copyFeedbackPackage();
  });
  document.addEventListener("load", handleArtImageLoad, true);
  document.addEventListener("error", handleArtImageError, true);
  document.addEventListener("keydown", (event) => {
    const target = event.target.closest?.("[data-reading-char]");
    if (!target || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    toggleReadingCharacter(target);
  });
  $("#copyFeedbackBtn")?.addEventListener("click", () => copyFeedbackPackage());
  $("#downloadFeedbackBtn")?.addEventListener("click", downloadFeedbackPackage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAllRunningCourseTimers("page_hidden", { skipRecording: true });
      interruptActiveRecording("page_hidden");
    }
  });
  window.addEventListener("pagehide", () => {
    pauseAllRunningCourseTimers("pagehide", { skipRecording: true });
    interruptActiveRecording("pagehide");
  });
  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches?.("[data-course-ease], [data-course-hardest], [data-course-audio], [data-course-note]")) {
      updateCourseFeedbackField(target);
    }
  });
}

function bindCharacterPractice() {
  $("#firstCharactersBtn").addEventListener("click", () => {
    characterPage = 0;
    renderCharacters();
  });
  $("#prevCharactersBtn").addEventListener("click", () => {
    const total = getCharacterLibrary().length;
    const pageSize = getCharacterPageSize();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    characterPage = (characterPage - 1 + totalPages) % totalPages;
    renderCharacters();
  });
  $("#refreshCharactersBtn").addEventListener("click", () => {
    const total = getCharacterLibrary().length;
    const pageSize = getCharacterPageSize();
    characterPage = (characterPage + 1) % Math.max(1, Math.ceil(total / pageSize));
    renderCharacters();
  });

  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-reveal], [data-detail], [data-words], [data-star], [data-pinyin-speak], [data-question-prev], [data-question-next], [data-reference], [data-choice], [data-master-char], [data-chinese-result]");
    if (!target) return;

    if (target.dataset.pinyinSpeak) speak(target.dataset.pinyinSpeak);
    if (target.dataset.questionPrev) moveQuestion(-1);
    if (target.dataset.questionNext) moveQuestion(1);
    if (target.dataset.reference) toggleReference(target);
    if (target.dataset.choice) selectChoice(target);

    if (target.dataset.reveal) {
      const card = target.closest(".character-card, .dictionary-card, .dictionary-detail, .wordbook-card, .question-card");
      const pinyin = findInCard(card, "pinyin", target.dataset.reveal);
      if (pinyin) pinyin.hidden = !pinyin.hidden;
    }

    if (target.dataset.detail) {
      const card = target.closest(".character-card, .dictionary-card, .dictionary-detail, .wordbook-card, .question-card");
      const meaning = findInCard(card, "meaning", target.dataset.detail);
      if (meaning) {
        const words = findInCard(card, "words", target.dataset.detail);
        if (words) words.hidden = true;
        meaning.hidden = !meaning.hidden;
        if (!meaning.hidden) await hydrateMeaningElement(target.dataset.detail, meaning);
      }
    }

    if (target.dataset.words) {
      const card = target.closest(".character-card, .dictionary-card, .dictionary-detail, .wordbook-card, .question-card");
      const words = findInCard(card, "words", target.dataset.words);
      if (words) {
        const meaning = findInCard(card, "meaning", target.dataset.words);
        if (meaning) meaning.hidden = true;
        words.hidden = !words.hidden;
        if (!words.hidden) words.innerHTML = renderWordsContent(getCharacterByChar(target.dataset.words));
      }
    }

    if (target.dataset.star) {
      toggleWordbook(target.dataset.star);
      rerenderCharacterSurfaces();
    }

    if (target.dataset.masterChar) {
      markCharacterMastered(target.dataset.masterChar);
    }

    if (target.dataset.chineseResult) {
      updateChineseRecognitionResult(target.dataset.chineseChar, target.dataset.chineseResult);
    }
  });
}

function bindEnglishRecognition() {
  refreshEnglishScopeOptions();
  $("#englishSettingsBtn").addEventListener("click", () => {
    $("#englishSettingsPanel").hidden = !$("#englishSettingsPanel").hidden;
    renderEnglishSettings();
  });
  $("#firstEnglishBtn").addEventListener("click", () => {
    englishPage = 0;
    resetEnglishExamplePanel();
    renderEnglishRecognition();
  });
  $("#prevEnglishBtn").addEventListener("click", () => {
    const totalPages = getEnglishTotalPages();
    englishPage = (englishPage - 1 + totalPages) % totalPages;
    resetEnglishExamplePanel();
    renderEnglishRecognition();
  });
  $("#nextEnglishBtn").addEventListener("click", () => {
    const totalPages = getEnglishTotalPages();
    englishPage = (englishPage + 1) % totalPages;
    resetEnglishExamplePanel();
    renderEnglishRecognition();
  });
  $("#englishWordGrid").addEventListener("click", (event) => {
    const target = event.target.closest("[data-english-word], [data-english-phonetic], [data-english-result], [data-english-meaning], [data-english-story], [data-english-block]");
    if (!target) return;
    event.stopPropagation();
    const wordId = target.dataset.englishWord || target.dataset.englishPhonetic || target.dataset.englishChar || target.dataset.englishMeaning || target.dataset.englishStory || target.dataset.englishBlock;
    const word = englishLibrary.find((item) => item.id === wordId);
    if (!word) return;
    const cardIndex = Number(target.closest("[data-english-card-index]")?.dataset.englishCardIndex ?? -1);
    selectedEnglishCardId = word.id;
    currentEnglishWord = word;
    if (target.dataset.englishWord) toggleEnglishPhonetic(word, cardIndex);
    if (target.dataset.englishPhonetic) speakEnglishText(word.text);
    if (target.dataset.englishResult) recordEnglishResult(word, target.dataset.englishResult, cardIndex);
    if (target.dataset.englishMeaning) toggleCardMeaning(word.id, cardIndex);
    if (target.dataset.englishStory) showStoryExample(word);
    if (target.dataset.englishBlock) showBlockExample(word, false);
  });
  $("#englishExamplePanel").addEventListener("click", (event) => {
    const target = event.target.closest("[data-story-example-prev], [data-story-example-next], [data-example-text], [data-example-phonetics], [data-example-translation], [data-block-example-refresh]");
    if (!target) return;
    if (target.dataset.storyExamplePrev) moveStoryExample(-1);
    if (target.dataset.storyExampleNext) moveStoryExample(1);
    if (target.dataset.exampleText) toggleExamplePhonetics("english");
    if (target.dataset.examplePhonetics) speakEnglishText(englishCurrentExampleSentence, true);
    if (target.dataset.exampleTranslation) toggleExampleTranslation("english");
    if (target.dataset.blockExampleRefresh) showBlockExample(currentEnglishWord, true);
  });
  $("#englishScopeSelect").addEventListener("change", (event) => {
    englishProgress.settings.scope = event.target.value;
    saveEnglishProgress();
    currentEnglishWord = null;
    renderEnglishRecognition();
  });
  $("#englishVoiceSelect").addEventListener("change", (event) => {
    englishProgress.settings.voiceLang = event.target.value;
    saveEnglishProgress();
  });
  $("#englishShowChineseToggle").addEventListener("change", (event) => {
    englishProgress.settings.showChineseButton = event.target.checked;
    saveEnglishProgress();
    renderEnglishRecognition();
  });
  $("#englishResetBtn").addEventListener("click", resetEnglishProgress);
}

function bindEnglishBlocks() {
  $("#blocksSourceSelect").addEventListener("change", () => {
    selectedSourceFilter = $("#blocksSourceSelect").value || "all_sources";
    localStorage.setItem(ENGLISH_BLOCK_SOURCE_FILTER_KEY, selectedSourceFilter);
    ensureSelectedPatternInCurrentFilter();
    clearBlockPatternWorkState();
    renderEnglishBlocks();
  });
  $("#blocksPatternSelect")?.addEventListener("change", () => {
    setSelectedBlockPatternId($("#blocksPatternSelect").value);
  });
  $("#samePatternBtn")?.addEventListener("click", () => generatePatternExamples());
  $("#blocksLocalExampleCard")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-pattern-example-text], [data-block-example-prev], [data-block-example-next], [data-toggle-examples], [data-block-example-translation], [data-end-block-exercise], [data-change-block-pattern]");
    if (!target) return;
    if (target.dataset.endBlockExercise) {
      endBlockExerciseMode();
      return;
    }
    if (target.dataset.changeBlockPattern) {
      changeBlockPatternFromExerciseMode();
      return;
    }
    if (target.dataset.patternExampleText) toggleActiveBlockExamplePhonetics();
    if (target.dataset.blockExamplePrev) moveUnifiedBlockExample(-1);
    if (target.dataset.blockExampleNext) moveUnifiedBlockExample(1);
    if (target.dataset.blockExampleTranslation) {
      blockExampleTranslationVisible = !blockExampleTranslationVisible;
      renderEnglishBlocks();
    }
    if (target.dataset.toggleExamples) {
      blockExamplesCollapsed = !blockExamplesCollapsed;
      renderEnglishBlocks();
    }
  });
  $("#blocksShowSourceBtn")?.addEventListener("click", () => {
    blockExampleDisplayMode = "source_example";
    blockExamplesCollapsed = false;
  blockSourceExampleIndex = 0;
  blockExampleTranslationVisible = false;
    resetExampleDisplayState();
    renderEnglishBlocks();
  });
  $("#blocksExampleCountChips")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-example-count]");
    if (!target) return;
    patternExampleCount = Number(target.dataset.exampleCount) || 3;
    renderEnglishBlocks();
  });
  $("#blocksExerciseTypeChips")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-block-exercise-type]");
    if (!target) return;
    activeBlockExerciseType = target.dataset.blockExerciseType;
    blockExerciseIndex = 0;
    renderEnglishBlocks();
  });
  $("#blocksCountChips")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-block-count]");
    if (!target) return;
    blockQuestionsPerType = Number(target.dataset.blockCount) || 3;
    renderEnglishBlocks();
  });
  $("#generateBlockExercisesBtn")?.addEventListener("click", () => generateBlockExercises({ force: hasGeneratedExerciseSet() }));
  $("#blocksAiExercisePanel")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-block-question-prev], [data-block-question-next], [data-block-global-prev], [data-block-global-next], [data-block-option], [data-block-submit], [data-block-retry], [data-block-show-answer], [data-block-reset], [data-block-pool], [data-block-answer]");
    if (!target) return;
    if (target.dataset.blockQuestionPrev) moveBlockExercise(-1);
    if (target.dataset.blockQuestionNext) moveBlockExercise(1);
    if (target.dataset.blockGlobalPrev) moveGlobalBlockExercise(-1);
    if (target.dataset.blockGlobalNext) moveGlobalBlockExercise(1);
    if (target.dataset.blockOption) selectBlockOption(target.dataset.blockOption);
    if (target.dataset.blockPool) moveExerciseBlockToAnswer(target.dataset.blockPool);
    if (target.dataset.blockAnswer) moveExerciseBlockToPool(target.dataset.blockAnswer);
    if (target.dataset.blockReset) resetCurrentExerciseAnswer();
    if (target.dataset.blockSubmit) submitBlockExercise();
    if (target.dataset.blockRetry) retryBlockExercise();
    if (target.dataset.blockShowAnswer) showBlockAnswer();
  });
}

function endBlockExerciseMode() {
  blockExerciseBatch = null;
  blockExerciseIndex = 0;
  blockExerciseIndexes = {};
  blockAnswerState = {};
  blockExerciseError = "";
  blockExamplesCollapsed = false;
  renderEnglishBlocks();
}

function changeBlockPatternFromExerciseMode() {
  endBlockExerciseMode();
  window.setTimeout(() => $("#blocksPatternSelect")?.focus(), 0);
}

function loadBlocksProgress() {
  try {
    return { version: 1, records: [], variants: {}, ...JSON.parse(localStorage.getItem(ENGLISH_BLOCKS_PROGRESS_KEY) || "{}") };
  } catch {
    return { version: 1, records: [], variants: {} };
  }
}

function saveBlocksProgress() {
  localStorage.setItem(ENGLISH_BLOCKS_PROGRESS_KEY, JSON.stringify(blocksProgress));
}

function getBlockExerciseTypes() {
  return ["ordering", "replacement", "qa", "choice", "zhToEn", "dialog", "error"];
}

function nextBlockExerciseType(type) {
  const types = getBlockExerciseTypes();
  return types[(types.indexOf(type) + 1) % types.length] || "ordering";
}

function renderEnglishBlocks() {
  if (!$("#blocksExerciseCard")) return;
  renderBlockSourceOptions();
  renderBlockPatternOptions();
  const pattern = getCurrentBlockPattern();
  if (!pattern) {
    $("#blocksAiExercisePanel").innerHTML = `<div class="blocks-exercise-card empty-ai-card"><p class="blocks-prompt">当前来源下暂无句型。</p></div>`;
    return;
  }
  blockSourceExamples = getExamplesByPattern(pattern.id);
  if (blockSourceExampleIndex >= blockSourceExamples.length) blockSourceExampleIndex = 0;
  const isExerciseMode = hasGeneratedExerciseSet();
  const patternPicker = $("#blocksPatternSelect")?.closest(".blocks-pattern-picker");
  const sourceFilter = $("#blocksSourceSelect")?.closest(".blocks-source-filter");
  const exampleActions = $("#samePatternBtn")?.closest(".example-action-row");
  if (patternPicker) patternPicker.hidden = isExerciseMode;
  if (sourceFilter) sourceFilter.hidden = isExerciseMode;
  if (exampleActions) exampleActions.hidden = isExerciseMode;
  $("#blocksPatternSubtitle").textContent = isExerciseMode ? "" : pattern.displayFormulaEn || "";
  $("#blocksPatternExplanation").textContent = isExerciseMode ? "" : pattern.explanationZh || "";
  $("#blocksPatternExplanation").hidden = isExerciseMode;
  renderBlockExampleDisplay(pattern);
  renderPatternExampleControls();
  renderBlockExerciseControls();
  renderBlockExercisePanel();
}

function renderBlockExampleDisplay(pattern) {
  const panel = $("#blocksLocalExampleCard");
  if (!panel) return;
  if (hasGeneratedExerciseSet()) {
    panel.classList.add("collapsed-example-card", "exercise-mode-status-card");
    panel.innerHTML = `
      <div class="exercise-mode-status">
        <div>
          <div class="example-kicker">练习模式 / Practice Mode</div>
          <p class="collapsed-pattern-title">句型提示已隐藏</p>
          <p class="example-hint">当前不会显示句型、例句、音标或翻译。</p>
        </div>
        <div class="actions blocks-actions">
          <button class="button ghost compact-button" data-end-block-exercise="true" type="button">结束练习<br><span>End</span></button>
          <button class="button secondary compact-button" data-change-block-pattern="true" type="button">更换句型<br><span>Change</span></button>
        </div>
      </div>
    `;
    return;
  }
  panel.classList.remove("exercise-mode-status-card");
  if (blockExampleDisplayMode === "ai_example" && blockExampleError) {
    panel.classList.add("collapsed-example-card");
    panel.innerHTML = `
      <div class="example-kicker">AI例句 / AI Example</div>
      <p class="example-empty">${escapeHtml(blockExampleError)}</p>
      <p class="example-hint">系统不会用本地例句冒充 AI 结果。</p>
    `;
    return;
  }
  if (blockExamplesCollapsed) {
    panel.classList.add("collapsed-example-card");
    panel.innerHTML = `
      <div class="example-kicker">当前句型 / Current Pattern</div>
      <p class="collapsed-pattern-title">${escapeHtml(pattern.displayFormulaZh || pattern.example)}</p>
      <p class="example-hint">练习模式已收起例句，避免提示答案。</p>
      <button class="button ghost compact-button" data-toggle-examples="true" type="button">展开例句<br><span>Show Examples</span></button>
    `;
    return;
  }
  panel.classList.remove("collapsed-example-card");
  const examples = getActiveBlockExamples(pattern);
  const index = getActiveBlockExampleIndex();
  const example = examples[index] || getPatternLocalExamples(pattern)[0] || { sentence: pattern.example, translationZh: pattern.translationZh, blocks: pattern.blocks || [] };
  const sentence = example.sentence || example.english || "";
  const translation = example.translationZh || example.chinese || "";
  const sourceLabel = getActiveExampleLabel(example);
  panel.innerHTML = `
    <div class="example-card-top">
      <div class="example-kicker">${escapeHtml(sourceLabel)}</div>
      <strong class="example-counter">${examples.length ? `${index + 1}/${examples.length}` : "0/0"}</strong>
    </div>
    <div class="unified-example-row">
      ${examples.length > 1 ? `<button class="carousel-arrow" data-block-example-prev="true" type="button" aria-label="上一个">‹</button>` : `<span></span>`}
      <div class="unified-example-copy">
        ${sentence
          ? `<button class="example-english example-text-button" data-pattern-example-text="true" type="button">${escapeHtml(sentence)}</button>`
          : `<p class="example-empty">当前句型还没有可显示例句。</p>`}
        ${englishExamplePhoneticsVisible ? renderExamplePhoneticLine(sentence) : ""}
        ${translation && blockExampleTranslationVisible ? `<p class="example-chinese">${escapeHtml(translation)}</p>` : ""}
        ${translation ? `<button class="button ghost compact-button" data-block-example-translation="true" type="button">${blockExampleTranslationVisible ? "隐藏中文" : "查看中文"}<br><span>${blockExampleTranslationVisible ? "Hide" : "Chinese"}</span></button>` : ""}
        ${blockExampleDisplayMode === "source_example" && example.sourceTitle ? `<p class="example-hint">${escapeHtml(example.sourceTitle)}</p>` : ""}
      </div>
      ${examples.length > 1 ? `<button class="carousel-arrow" data-block-example-next="true" type="button" aria-label="下一个">›</button>` : `<span></span>`}
    </div>
  `;
  const button = $("#samePatternBtn");
  if (button) {
    button.disabled = blockExampleGenerating;
    button.innerHTML = blockExampleGenerating ? "AI生成中<br><span>AI Generating</span>" : "AI例句<br><span>AI Example</span>";
  }
}

function toggleActiveBlockExamplePhonetics() {
  const example = getActiveBlockExample();
  const sentence = example?.sentence || example?.english || "";
  if (!sentence) return;
  const willShow = !englishExamplePhoneticsVisible;
  englishExamplePhoneticsVisible = willShow;
  if (willShow) speakEnglishText(sentence, true);
  renderEnglishBlocks();
}

function renderExamplePhoneticLine(sentence) {
  const text = getSentencePhoneticTokens(sentence)
    .map((token) => token.phonetic || token.text)
    .join(" ");
  return text ? `<p class="example-phonetic">${escapeHtml(text)}</p>` : "";
}

function renderCurrentPatternExample(pattern) {
  renderBlockExampleDisplay(pattern);
}

function getActiveBlockExamples(pattern = getCurrentBlockPattern()) {
  if (blockExampleDisplayMode === "ai_example") return generatedPatternExamples;
  if (blockExampleDisplayMode === "source_example") return blockSourceExamples;
  return getPatternLocalExamples(pattern);
}

function getActiveBlockExample() {
  const examples = getActiveBlockExamples();
  return examples[getActiveBlockExampleIndex()] || examples[0] || null;
}

function getActiveBlockExampleIndex() {
  const examples = getActiveBlockExamples();
  if (!examples.length) return 0;
  if (blockExampleDisplayMode === "ai_example") {
    if (generatedPatternExampleIndex >= examples.length) generatedPatternExampleIndex = 0;
    return generatedPatternExampleIndex;
  }
  if (blockExampleDisplayMode === "source_example") {
    if (blockSourceExampleIndex >= examples.length) blockSourceExampleIndex = 0;
    return blockSourceExampleIndex;
  }
  if (currentPatternExampleIndex >= examples.length) currentPatternExampleIndex = 0;
  return currentPatternExampleIndex;
}

function setActiveBlockExampleIndex(index) {
  if (blockExampleDisplayMode === "ai_example") generatedPatternExampleIndex = index;
  else if (blockExampleDisplayMode === "source_example") blockSourceExampleIndex = index;
  else currentPatternExampleIndex = index;
}

function getActiveExampleLabel(example) {
  if (blockExampleDisplayMode === "ai_example") return "AI例句 / AI Example";
  if (blockExampleDisplayMode === "source_example") return example?.sourceTitle || "原文例句 / Source Example";
  return "例句 / Example";
}

function getCurrentPatternExample(pattern = getCurrentBlockPattern()) {
  const examples = getPatternLocalExamples(pattern);
  return examples[currentPatternExampleIndex] || examples[0] || null;
}

function showNextPatternExample() {
  const examples = getPatternLocalExamples(getCurrentBlockPattern());
  if (examples.length <= 1) return;
  currentPatternExampleIndex = (currentPatternExampleIndex + 1) % examples.length;
  resetPatternExampleDisplayState();
}

function togglePatternExamplePhonetics() {
  patternExamplePhoneticsVisible = !patternExamplePhoneticsVisible;
  if (patternExamplePhoneticsVisible) speakEnglishText(getCurrentPatternExample()?.sentence || "", true);
  renderCurrentPatternExample(getCurrentBlockPattern());
}

function togglePatternExampleTranslation() {
  patternExampleTranslationVisible = !patternExampleTranslationVisible;
  renderCurrentPatternExample(getCurrentBlockPattern());
}

function resetPatternExampleDisplayState() {
  patternExamplePhoneticsVisible = false;
  patternExampleTranslationVisible = false;
}

function getPatternLocalExamples(pattern) {
  if (pattern?.exampleSeeds?.length) {
    return pattern.exampleSeeds.map((seed, index) => ({
      id: `${pattern.id}-seed-${index + 1}`,
      sentence: seed.english,
      english: seed.english,
      chinese: seed.chinese,
      translationZh: seed.chinese,
      sourceTitle: seed.source || "Pattern Seed",
      blocks: splitSentenceToBlocks(seed.english),
      patternId: pattern.id,
      newWords: []
    }));
  }
  const examples = {
    want_to_do: [
      ["I want to eat some bread.", "我想吃一些面包。", ["I", "want to", "eat", "some bread."]],
      ["I want to read the book.", "我想读这本书。", ["I", "want to", "read", "the book."]],
      ["I want to play with Amy.", "我想和 Amy 一起玩。", ["I", "want to", "play", "with Amy."]],
      ["I want to climb the mountain.", "我想爬这座山。", ["I", "want to", "climb", "the mountain."]]
    ],
    here_is_my: [
      ["Here is my schoolbag.", "这是我的书包。", ["Here is", "my schoolbag."]],
      ["Here is my book.", "这是我的书。", ["Here is", "my book."]],
      ["Here is my ruler.", "这是我的尺子。", ["Here is", "my ruler."]]
    ],
    have_has: [
      ["She has a purple bag.", "她有一个紫色的包。", ["She", "has", "a purple bag."]],
      ["Amy has a pink pencil box.", "Amy 有一个粉色文具盒。", ["Amy", "has", "a pink pencil box."]]
    ],
    schoolbag_place: [
      ["My schoolbag is on the desk.", "我的书包在课桌上。", ["My schoolbag", "is", "on", "the desk."]],
      ["My schoolbag is in the classroom.", "我的书包在教室里。", ["My schoolbag", "is", "in", "the classroom."]],
      ["My book is on the desk.", "我的书在课桌上。", ["My book", "is", "on", "the desk."]]
    ],
    dialog_name: [
      ["Hello! I'm Amy. What's your name?", "你好！我是 Amy。你叫什么名字？", ["Hello!", "I'm Amy.", "What's your name?"]]
    ],
    parallel_actions: [
      ["We run, jump and skip in the playground.", "我们在操场上跑、跳、蹦。", ["We", "run, jump and skip", "in the playground."]]
    ],
    error_be: [
      ["She is happy.", "她很开心。", ["She", "is", "happy."]]
    ]
  }[pattern?.id] || [[pattern?.example || "", pattern?.translationZh || "", pattern?.blocks || []]];
  return examples.map(([sentence, translationZh, blocks]) => ({ sentence, english: sentence, chinese: translationZh, translationZh, blocks, patternId: pattern.id, newWords: [] }));
}

function splitSentenceToBlocks(sentence) {
  return String(sentence || "").replace(/[.!?]$/, "").split(/\s+/).filter(Boolean);
}

function renderBlockSourceExamples() {
  const panel = $("#blocksSourceExamplePanel");
  if (!panel) return;
  const item = blockSourceExamples[blockSourceExampleIndex];
  if (item) panel.dataset.exampleSentence = item.english || "";
  panel.innerHTML = renderSourceExampleCarousel({
    label: "原文例句 / Source Example",
    examples: blockSourceExamples,
    index: blockSourceExampleIndex,
    prevAttr: "data-block-source-prev",
    nextAttr: "data-block-source-next",
    emptyTitle: "当前句型还没有录入可核对的原文例句",
    emptyHint: "AI 练习题会单独标记，不会冒充原文",
    currentWord: "",
    phoneticsVisible: englishExamplePhoneticsVisible,
    translationVisible: englishExampleTranslationVisible
  });
}

function renderPatternExampleControls() {
  const countPanel = $("#blocksExampleCountChips");
  if (countPanel) {
    countPanel.innerHTML = [1, 3, 5].map((count) => `
      <button class="chip-button ${patternExampleCount === count ? "selected" : ""}" data-example-count="${count}" type="button">${count}句<span>${count} Examples</span></button>
    `).join("");
  }
}

async function generatePatternExamples() {
  if (blockExampleGenerating) return;
  const pattern = getCurrentBlockPattern();
  if (!pattern) return;
  blockExampleGenerating = true;
  blockExampleError = "";
  blockExampleDisplayMode = "ai_example";
  blockExamplesCollapsed = false;
  renderEnglishBlocks();
  const aiExamples = await requestPatternExamplesFromAI(pattern, patternExampleCount);
  blockExampleGenerating = false;
  if (!aiExamples?.length || !aiExamples.every((item) => isAuthenticAiMeta(item.meta))) {
    generatedPatternExamples = [];
    generatedPatternExamplesVisible = false;
    blockExampleError ||= "AI例句生成失败，请稍后重试 / AI example failed";
    renderEnglishBlocks();
    return;
  }
  generatedPatternExamples = aiExamples.map((item, index) => ({
    ...item,
    id: item.id || `ai-example-${pattern.id}-${Date.now()}-${index + 1}`,
    patternId: pattern.id,
    sourceTitle: "AI例句 / AI Example",
    sourceType: "ai",
    english: item.sentence || item.english,
    sentence: item.sentence || item.english,
    chinese: item.translationZh || item.chinese,
    translationZh: item.translationZh || item.chinese
  }));
  generatedPatternExampleIndex = 0;
  generatedPatternExamplesVisible = true;
  resetExampleDisplayState();
  blockExampleTranslationVisible = false;
  console.info("[AI_META]", generatedPatternExamples[0]?.meta || {});
  renderEnglishBlocks();
}

async function requestPatternExamplesFromAI(pattern, count) {
  const body = JSON.stringify({
    patternId: pattern.id,
    selectedPatternId: pattern.id,
    count,
    pattern: makeSelectedPatternPayload(pattern),
    selectedPattern: makeSelectedPatternPayload(pattern)
  });
  let lastError = "";
  for (const endpoint of getAIEndpoints("/api/english-blocks/examples")) {
    try {
      const response = await fetchWithTimeout(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body }, AI_TIMEOUTS.examples);
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        lastError = data?.error || `AI 服务返回 ${response.status}`;
        continue;
      }
      const examples = normalizePatternExamples(data.examples || data.result?.examples, pattern, count, data.meta);
      if (examples.length) return examples;
      lastError = "AI例句结构不完整";
    } catch (error) {
      lastError = error?.stage ? { error: error.message, stage: error.stage } : error?.message || "AI例句服务连接失败";
    }
  }
  console.info("English Blocks AI example failed:", lastError || "unavailable");
  blockExampleError = formatAIError(lastError || "AI例句服务连接失败");
  return null;
}

function normalizePatternExamples(examples, pattern, count, meta = null) {
  if (!Array.isArray(examples)) return [];
  return examples.slice(0, count).map((example, index) => {
    const sentence = String(example?.sentence || example?.english || "").trim();
    const translationZh = String(example?.translationZh || example?.chinese || "").trim();
    if (!sentence || !translationZh) return null;
    return {
      id: String(example.id || `ai-example-${pattern.id}-${index + 1}`),
      sentence,
      english: sentence,
      translationZh,
      chinese: translationZh,
      blocks: normalizeSentenceBlocks(example.blocks?.length ? example.blocks : splitSentenceToBlocks(sentence)).slice(0, 7),
      patternId: pattern.id,
      meta: example.meta || meta
    };
  }).filter(Boolean);
}

function renderGeneratedPatternExamples() {
  renderBlockExampleDisplay(getCurrentBlockPattern());
}

function moveGeneratedPatternExample(delta) {
  if (!generatedPatternExamples.length) return;
  generatedPatternExampleIndex = (generatedPatternExampleIndex + delta + generatedPatternExamples.length) % generatedPatternExamples.length;
  resetExampleDisplayState();
  renderEnglishBlocks();
}

function moveUnifiedBlockExample(delta) {
  const examples = getActiveBlockExamples();
  if (!examples.length) return;
  const next = (getActiveBlockExampleIndex() + delta + examples.length) % examples.length;
  setActiveBlockExampleIndex(next);
  resetExampleDisplayState();
  renderEnglishBlocks();
}

function renderBlockExerciseControls() {
  const typePanel = $("#blocksExerciseTypeChips");
  if (typePanel) {
    typePanel.innerHTML = getBlockAIExerciseTypes().map((type) => `
      <button class="chip-button exercise-type-tab bilingual-pill ${activeBlockExerciseType === type.id ? "selected" : ""}" data-block-exercise-type="${escapeHtml(type.id)}" type="button">
        ${escapeHtml(type.labelZh)}<span class="exercise-type-tab__en">${escapeHtml(getExerciseTypeProgressLabel(type.id))}</span>
      </button>
    `).join("");
  }
  const countPanel = $("#blocksCountChips");
  if (countPanel) {
    countPanel.innerHTML = [1, 3, 5].map((count) => `
      <button class="chip-button question-count-option bilingual-pill ${blockQuestionsPerType === count ? "selected" : ""}" data-block-count="${count}" type="button">每种${count}题<span>${count} Each</span></button>
    `).join("");
  }
  const button = $("#generateBlockExercisesBtn");
  if (button) {
    button.disabled = blockGenerating;
    button.innerHTML = blockGenerating
      ? "AI正在出题……<br><span>AI Generating</span>"
      : `${hasGeneratedExerciseSet() ? "重新AI出题" : "AI出题"}<br><span>${hasGeneratedExerciseSet() ? "Regenerate AI" : "AI Generate"}</span>`;
  }
}

function getExerciseTypeProgressLabel(type) {
  const questions = getCurrentExerciseSetQuestions(type);
  if (!questions.length) return "请先AI出题";
  const index = getExerciseTypeIndex(type) + 1;
  return `${index}/${questions.length}`;
}

function renderBlockExercisePanel() {
  const panel = $("#blocksAiExercisePanel");
  if (!panel) return;
  if (blockGenerating) {
    panel.innerHTML = `<div class="blocks-exercise-card"><p class="blocks-prompt">AI正在出题…… / AI Generating</p><p class="example-hint">正在调用 DeepSeek 并进行质量校验。</p></div>`;
    return;
  }
  if (blockExerciseError) {
    panel.innerHTML = `<div class="blocks-exercise-card empty-ai-card"><p class="blocks-prompt">${escapeHtml(blockExerciseError)}</p><p class="example-hint">请重新生成，系统不会展示未通过校验的题目。</p></div>`;
    return;
  }
  if (!hasGeneratedExerciseSet()) {
    panel.innerHTML = `<div class="blocks-exercise-card empty-ai-card"><p class="blocks-prompt">AI练习题 / AI Exercises</p><p class="example-hint">请先点击 AI出题。</p></div>`;
    return;
  }
  const questions = getCurrentExerciseSetQuestions(activeBlockExerciseType);
  if (!questions.length) {
    panel.innerHTML = `<div class="blocks-exercise-card empty-ai-card"><p class="blocks-prompt">${escapeHtml(getGeneratedExerciseLabel(activeBlockExerciseType))}</p><p class="example-hint">当前题型还没有题目。</p></div>`;
    return;
  }
  blockExerciseIndex = getExerciseTypeIndex(activeBlockExerciseType);
  if (blockExerciseIndex >= questions.length) blockExerciseIndex = 0;
  const question = questions[blockExerciseIndex];
  const state = getBlockQuestionState(question);
  panel.innerHTML = `
    <div class="blocks-exercise-card ai-question-card">
      <div class="source-carousel-top">
        <span>${escapeHtml(getGeneratedExerciseLabel(activeBlockExerciseType))} / AI Exercise</span>
        <strong>${blockExerciseIndex + 1} / ${questions.length}</strong>
      </div>
      <div class="source-carousel-row">
        ${questions.length > 1 ? `<button class="carousel-arrow" data-block-question-prev="true" type="button" aria-label="上一题">‹</button>` : `<span></span>`}
        <div class="ai-question-body">
          ${renderExerciseByType(question, state)}
        </div>
        ${questions.length > 1 ? `<button class="carousel-arrow" data-block-question-next="true" type="button" aria-label="下一题">›</button>` : `<span></span>`}
      </div>
    </div>
  `;
}

function getBlockAIExerciseTypes() {
  return [
    { id: "ordering", labelZh: "句子排序", labelEn: "Ordering" },
    { id: "fill_blank", labelZh: "选词填空", labelEn: "Fill Blank" },
    { id: "translation_build", labelZh: "中译英拼句", labelEn: "Build" },
    { id: "choose_correct", labelZh: "选择正确句子", labelEn: "Choose" },
    { id: "pattern_replace", labelZh: "句型替换", labelEn: "Replace" }
  ];
}

function renderExerciseByType(question, state) {
  if (question.type === "ordering") return OrderingExerciseCard(question, state);
  if (question.type === "fill_blank") return FillBlankExerciseCard(question, state);
  if (question.type === "translation_build") return TranslationBuildExerciseCard(question, state);
  if (question.type === "choose_correct") return ChooseCorrectExerciseCard(question, state);
  if (question.type === "pattern_replace") return PatternReplaceExerciseCard(question, state);
  return renderGeneratedExercise(question, state);
}

function OrderingExerciseCard(question, state) {
  return renderBlockBuildCard(question, state, "待选积木区", "你的答案区");
}

function TranslationBuildExerciseCard(question, state) {
  return renderBlockBuildCard(question, state, "待选积木区", "你的答案区");
}

function FillBlankExerciseCard(question, state) {
  return `
    <p class="blocks-prompt">${escapeHtml(question.instructionZh)}</p>
    <div class="blocks-answer prompt-only">${escapeHtml(question.promptEn || "")}</div>
    <div class="block-bank selectable-bank">
      ${(question.options || []).map((option, index) => `<button class="block-chip selectable-chip ${state.selected === option ? "selected" : ""}" data-block-option="${escapeHtml(option)}" type="button">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join("")}
    </div>
    ${renderExerciseActions(question, state)}
  `;
}

function ChooseCorrectExerciseCard(question, state) {
  return `
    <p class="blocks-prompt">${escapeHtml(question.instructionZh)}</p>
    <p class="blocks-translation">${escapeHtml(question.promptZh || "")}</p>
    <div class="choice-list">
      ${(question.options || []).map((option, index) => `<button class="choice-option ${state.selected === String(index) ? "selected" : ""}" data-block-option="${index}" type="button">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join("")}
    </div>
    ${renderExerciseActions(question, state)}
  `;
}

function PatternReplaceExerciseCard(question, state) {
  return `
    <p class="blocks-prompt">${escapeHtml(question.instructionZh)}</p>
    <div class="blocks-answer prompt-only">${escapeHtml(question.promptEn || "")}</div>
    <p class="blocks-translation">${escapeHtml(question.promptZh || "")}</p>
    <div class="choice-list">
      ${(question.options || []).map((option, index) => `<button class="choice-option ${state.selected === String(index) ? "selected" : ""}" data-block-option="${index}" type="button">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join("")}
    </div>
    ${renderExerciseActions(question, state)}
  `;
}

function renderBlockBuildCard(question, state, poolLabel, answerLabel) {
  const arranged = getValidArrangedBlocks(question, Array.isArray(state.arrangedBlocks) ? state.arrangedBlocks : []);
  const pool = getAvailableExerciseBlocks(question.blocks || [], arranged);
  return `
    <p class="blocks-prompt">${escapeHtml(question.instructionZh)}</p>
    ${question.promptZh ? `<p class="blocks-translation">${escapeHtml(question.promptZh)}</p>` : ""}
    ${question.promptEn ? `<div class="blocks-answer prompt-only">${escapeHtml(question.promptEn)}</div>` : ""}
    <div class="build-zones">
      <div>
        <strong>${escapeHtml(poolLabel)}</strong>
        <div class="block-bank build-bank">
          ${pool.map((block) => `<button class="block-chip selectable-chip" draggable="true" data-block-pool="${escapeHtml(block)}" type="button">${escapeHtml(block)}</button>`).join("") || `<span class="empty-zone">已全部加入答案</span>`}
        </div>
      </div>
      <div>
        <strong>${escapeHtml(answerLabel)}</strong>
        <div class="block-bank answer-bank">
          ${arranged.map((block) => `<button class="block-chip selectable-chip selected" draggable="true" data-block-answer="${escapeHtml(block)}" type="button">${escapeHtml(block)}</button>`).join("") || `<span class="empty-zone">点击上方积木加入答案</span>`}
        </div>
      </div>
    </div>
    <button class="button ghost compact-button" data-block-reset="true" type="button">重置本题<br><span>Reset</span></button>
    ${renderExerciseActions(question, state)}
  `;
}

function renderExerciseActions(question, state) {
  return `
    <div class="actions blocks-actions">
      <button class="button ghost" data-block-global-prev="true" type="button">上一题<br><span>Previous</span></button>
      <button class="button success" data-block-submit="true" type="button">提交<br><span>Submit</span></button>
      <button class="button ghost" data-block-show-answer="true" ${Number(state.attempts || 0) < 1 ? "disabled" : ""} type="button">查看答案<br><span>Answer</span></button>
      <button class="button secondary" data-block-global-next="true" type="button">下一题<br><span>Next</span></button>
    </div>
    ${renderExerciseFeedback(question, state)}
  `;
}

function renderExerciseFeedback(question, state) {
  if (!state.status || state.status === "unanswered") return "";
  if (state.status === "correct") {
    return `<div class="answer-feedback correct"><strong>正确！</strong><p>${escapeHtml(question.explanationZh || "答得很好。")}</p></div>`;
  }
  if (state.status === "answer_viewed") {
    return `<div class="answer-feedback answer-reveal"><strong>答案 / Answer</strong><p>${escapeHtml(formatGeneratedAnswer(question.correctAnswer, question))}</p><p>${escapeHtml(question.explanationZh || "")}</p></div>`;
  }
  return `<div class="answer-feedback needs-help"><strong>不正确，再想一想。</strong><p>${escapeHtml(Number(state.attempts || 0) >= 2 ? (question.hintZh || question.explanationZh || "再看一看句型结构。") : "可以调整答案后继续提交。")}</p></div>`;
}

function renderGeneratedExercise(question, state) {
  const selected = state.selected || [];
  const submitted = Boolean(state.submitted);
  const isCorrect = Boolean(state.correct);
  const optionItems = question.options?.length ? question.options : question.blocks || [];
  const selectedText = Array.isArray(selected) ? selected.join(" ") : String(selected || "");
  return `
    <p class="blocks-prompt">${escapeHtml(question.instructionZh || getGeneratedExerciseLabel(question.type))}</p>
    ${question.promptZh ? `<p class="blocks-translation">${escapeHtml(question.promptZh)}</p>` : ""}
    ${question.promptEn ? `<div class="blocks-answer prompt-only">${escapeHtml(question.promptEn)}</div>` : ""}
    ${optionItems.length ? `
      <div class="block-bank selectable-bank">
        ${optionItems.map((option, index) => {
          const value = question.type === "choose_sentence" ? String(index) : option;
          const chosen = Array.isArray(selected) ? selected.includes(value) : selected === value;
          return `<button class="block-chip selectable-chip ${chosen ? "selected" : ""}" data-block-option="${escapeHtml(value)}" type="button">${escapeHtml(option)}</button>`;
        }).join("")}
      </div>
    ` : ""}
    ${selectedText ? `<p class="blocks-answer draft-answer">${escapeHtml(selectedText)}</p>` : ""}
    <div class="actions blocks-actions">
      ${submitted ? `<button class="button secondary" data-block-retry="true" type="button">再试一次<br><span>Retry</span></button>` : `<button class="button success" data-block-submit="true" type="button">提交<br><span>Submit</span></button>`}
      <button class="button ghost" data-block-show-answer="true" type="button">查看答案<br><span>Answer</span></button>
    </div>
    ${submitted ? `
      <div class="answer-feedback ${isCorrect ? "correct" : "needs-help"}">
        <strong>${isCorrect ? "正确 / Correct" : "再想想 / Try Again"}</strong>
        <p>${escapeHtml(isCorrect ? (question.explanationZh || "句子搭得很清楚。") : "可以再拼一次，或者让家长点查看答案。")}</p>
      </div>
    ` : ""}
    ${state.showAnswer ? `
      <div class="answer-feedback answer-reveal">
        <strong>答案 / Answer</strong>
        <p>${escapeHtml(formatGeneratedAnswer(question.correctAnswer, question))}</p>
        <p>${escapeHtml(question.explanationZh || "")}</p>
      </div>
    ` : ""}
  `;
}

function getGeneratedExerciseLabel(type) {
  return getBlockAIExerciseTypes().find((item) => item.id === type)?.labelZh || "练习题";
}

function getCurrentBlockExerciseQuestion() {
  const questions = getCurrentExerciseSetQuestions(activeBlockExerciseType);
  const index = getExerciseTypeIndex(activeBlockExerciseType);
  return questions[index] || null;
}

function getBlockQuestionState(question) {
  if (!question) return {};
  const signature = makeBlockQuestionStateSignature(question);
  if (!blockAnswerState[question.id] || blockAnswerState[question.id]._signature !== signature) {
    blockAnswerState[question.id] = {
      _signature: signature,
      selected: "",
      arrangedBlocks: [],
      attempts: 0,
      status: "unanswered"
    };
  }
  blockAnswerState[question.id] = sanitizeBlockQuestionState(question, blockAnswerState[question.id]);
  return blockAnswerState[question.id];
}

function makeBlockQuestionStateSignature(question) {
  return JSON.stringify({
    batchId: blockExerciseBatch?.id || "",
    patternId: blockExerciseBatch?.patternId || "",
    type: question?.type || "",
    id: question?.id || "",
    blocks: question?.blocks || [],
    correctAnswer: question?.correctAnswer || []
  });
}

function sanitizeBlockQuestionState(question, state) {
  const arranged = getValidArrangedBlocks(question, state.arrangedBlocks || []);
  const selectedOptions = question.options || [];
  const selected = selectedOptions.some((option, index) => String(index) === String(state.selected) || String(option) === String(state.selected))
    ? state.selected
    : "";
  const changed = arranged.length !== (state.arrangedBlocks || []).length || selected !== state.selected;
  return {
    ...state,
    selected,
    arrangedBlocks: arranged,
    status: changed ? "unanswered" : (state.status || "unanswered")
  };
}

function getValidArrangedBlocks(question, arrangedBlocks = []) {
  const available = makeBlockCountMap(question?.blocks || []);
  const valid = [];
  for (const block of arrangedBlocks || []) {
    const key = normalizeAnswerText(block);
    if (!key || !available.get(key)) continue;
    valid.push(block);
    available.set(key, available.get(key) - 1);
  }
  return valid;
}

function getAvailableExerciseBlocks(blocks = [], arrangedBlocks = []) {
  const used = makeBlockCountMap(arrangedBlocks);
  return (blocks || []).filter((block) => {
    const key = normalizeAnswerText(block);
    const count = used.get(key) || 0;
    if (count <= 0) return true;
    used.set(key, count - 1);
    return false;
  });
}

function makeBlockCountMap(blocks = []) {
  const map = new Map();
  for (const block of blocks || []) {
    const key = normalizeAnswerText(block);
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function selectBlockOption(value) {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  const state = getBlockQuestionState(question);
  state.selected = state.selected === value ? "" : value;
  state.status = "unanswered";
  renderBlockExercisePanel();
}

function moveExerciseBlockToAnswer(value) {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  const state = getBlockQuestionState(question);
  const arranged = Array.isArray(state.arrangedBlocks) ? state.arrangedBlocks : [];
  const pool = getAvailableExerciseBlocks(question.blocks || [], arranged);
  if (!pool.some((block) => normalizeAnswerText(block) === normalizeAnswerText(value))) return;
  state.arrangedBlocks = [...arranged, value];
  state.status = "unanswered";
  renderBlockExercisePanel();
}

function moveExerciseBlockToPool(value) {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  const state = getBlockQuestionState(question);
  const arranged = Array.isArray(state.arrangedBlocks) ? [...state.arrangedBlocks] : [];
  const index = arranged.indexOf(value);
  if (index >= 0) arranged.splice(index, 1);
  state.arrangedBlocks = arranged;
  state.status = "unanswered";
  renderBlockExercisePanel();
}

function resetCurrentExerciseAnswer() {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  reshuffleCurrentExerciseQuestion(question);
  const state = getBlockQuestionState(question);
  state.selected = "";
  state.arrangedBlocks = [];
  state.status = "unanswered";
  renderBlockExercisePanel();
}

function reshuffleCurrentExerciseQuestion(question) {
  if (question.type === "ordering") {
    const correctOrder = Array.isArray(question.correctAnswer) ? question.correctAnswer : splitSentenceToBlocks(question.correctAnswer);
    question.blocks = shuffleUntilDifferent(correctOrder);
    return;
  }
  if (question.type === "translation_build") {
    const correctOrder = Array.isArray(question.correctAnswer) ? question.correctAnswer : splitSentenceToBlocks(question.correctAnswer);
    question.blocks = makeTranslationBuildBlocks(correctOrder, question.distractorBlocks || [], question.blocks || []);
    return;
  }
  if (question.type === "fill_blank") {
    question.options = makeValidatedShuffledOptions(question.correctAnswer, question.options);
    return;
  }
  if (["choose_correct", "pattern_replace"].includes(question.type)) {
    const correctOption = question.options?.[Number(question.correctAnswer)];
    if (!correctOption) return;
    question.options = makeValidatedShuffledOptions(correctOption, question.options);
    question.correctAnswer = String(question.options.findIndex((option) => normalizeAnswerText(option) === normalizeAnswerText(correctOption)));
  }
}

function submitBlockExercise() {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  const state = getBlockQuestionState(question);
  state.attempts = Number(state.attempts || 0) + 1;
  state.status = isGeneratedAnswerCorrect(question, state) ? "correct" : "incorrect";
  renderBlockExercisePanel();
}

function retryBlockExercise() {
  resetCurrentExerciseAnswer();
}

function showBlockAnswer() {
  const question = getCurrentBlockExerciseQuestion();
  if (!question) return;
  const state = getBlockQuestionState(question);
  if (Number(state.attempts || 0) < 1) return;
  state.status = state.status === "answer_viewed" ? "unanswered" : "answer_viewed";
  renderBlockExercisePanel();
}

function moveBlockExercise(delta) {
  const questions = getCurrentExerciseSetQuestions(activeBlockExerciseType);
  const total = questions.length;
  if (!total) return;
  const nextIndex = (getExerciseTypeIndex(activeBlockExerciseType) + delta + total) % total;
  setExerciseTypeIndex(activeBlockExerciseType, nextIndex);
  blockExerciseIndex = nextIndex;
  renderBlockExercisePanel();
}

function moveGlobalBlockExercise(delta) {
  const flat = getFlatBlockExerciseQuestions();
  if (!flat.length) return;
  const currentIndex = flat.findIndex((item) => item.type === activeBlockExerciseType && item.index === getExerciseTypeIndex(activeBlockExerciseType));
  const baseIndex = currentIndex >= 0 ? currentIndex : 0;
  const next = flat[(baseIndex + delta + flat.length) % flat.length];
  activeBlockExerciseType = next.type;
  setExerciseTypeIndex(next.type, next.index);
  blockExerciseIndex = next.index;
  renderEnglishBlocks();
}

function getFlatBlockExerciseQuestions() {
  if (!hasGeneratedExerciseSet()) return [];
  return getBlockAIExerciseTypes().flatMap((type) =>
    getCurrentExerciseSetQuestions(type.id).map((question, index) => ({ type: type.id, question, index }))
  );
}

function moveBlockSourceExample(delta) {
  if (!blockSourceExamples.length) return;
  blockSourceExampleIndex = (blockSourceExampleIndex + delta + blockSourceExamples.length) % blockSourceExamples.length;
  resetExampleDisplayState();
  renderBlockSourceExamples();
}

function isGeneratedAnswerCorrect(question, state) {
  if (["ordering", "translation_build"].includes(question.type)) {
    const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer : splitSentenceToBlocks(question.correctAnswer);
    const actual = Array.isArray(state.arrangedBlocks) ? state.arrangedBlocks : [];
    return expected.length === actual.length && expected.every((block, index) => normalizeAnswerText(block) === normalizeAnswerText(actual[index]));
  }
  if (["choose_correct", "pattern_replace"].includes(question.type)) {
    return String(question.correctAnswer) === String(state.selected || "");
  }
  return normalizeAnswerText(state.selected) === normalizeAnswerText(question.correctAnswer);
}

function formatGeneratedAnswer(answer, question) {
  if (Array.isArray(answer)) return answer.join(" ");
  if (question?.options?.[Number(answer)]) return question.options[Number(answer)];
  return String(answer || "");
}

function normalizeAnswerText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").replace(/\s+([.!?])/g, "$1").trim();
}

function hasGeneratedExerciseSet() {
  const pattern = getCurrentBlockPattern();
  return Boolean(pattern && isCompleteExerciseSet(blockExerciseBatch, pattern.id));
}

function getCurrentExerciseSetQuestions(type = activeBlockExerciseType) {
  if (!hasGeneratedExerciseSet()) return [];
  return Array.isArray(blockExerciseBatch.exercises?.[type]) ? blockExerciseBatch.exercises[type] : [];
}

function getExerciseTypeIndex(type) {
  const questions = getCurrentExerciseSetQuestions(type);
  if (!questions.length) return 0;
  const key = getExerciseIndexKey(type);
  const index = Number(blockExerciseIndexes[key] || 0);
  return Math.min(Math.max(0, index), questions.length - 1);
}

function setExerciseTypeIndex(type, index) {
  blockExerciseIndexes[getExerciseIndexKey(type)] = index;
}

function getExerciseIndexKey(type) {
  return `${blockExerciseBatch?.id || "draft"}:${type}`;
}

async function generateBlockExercises(options = {}) {
  if (blockGenerating) return;
  const pattern = getCurrentBlockPattern();
  if (!pattern) return;
  const payload = {
    patternId: pattern.id,
    selectedPatternId: pattern.id,
    selectedPattern: makeSelectedPatternPayload(pattern),
    selectedTypes: getBlockAIExerciseTypes().map((type) => type.id),
    countPerType: blockQuestionsPerType,
    sourceExampleIds: getExamplesByPattern(pattern.id).map((example) => example.id),
    blockedSentences: getBlockedBlockSentences(pattern),
    childProfile: { age: 7, level: "current_story_level" }
  };
  const cacheKey = getBlockExerciseCacheKey(payload);
  blockGenerating = true;
  blockExerciseIndex = 0;
  blockExerciseIndexes = {};
  blockAnswerState = {};
  blockExerciseError = "";
  renderEnglishBlocks();
  const aiBatch = await requestBlockExerciseSetFromAI(payload, pattern);
  blockGenerating = false;
  if (blockExerciseError) {
    blockExerciseBatch = null;
    renderEnglishBlocks();
    return;
  }
  const normalizedAiBatch = normalizeExerciseSet(aiBatch, pattern, blockQuestionsPerType);
  if (!normalizedAiBatch || !isAuthenticAiBatch(normalizedAiBatch)) {
    blockExerciseBatch = null;
    blockExerciseError = "AI出题失败，请稍后重试 / AI generation failed";
    renderEnglishBlocks();
    return;
  }
  blockExerciseBatch = normalizedAiBatch;
  saveLatestBlockExerciseBatch(blockExerciseBatch, cacheKey);
  blocksProgress.records.push({ id: pattern.id, type: "ai_exercise_set", count: getTotalExerciseCount(blockExerciseBatch), at: new Date().toISOString() });
  saveBlocksProgress();
  blockExamplesCollapsed = true;
  console.info("[AI_META]", blockExerciseBatch.meta);
  renderEnglishBlocks();
}

function getBlockedBlockSentences(pattern) {
  return unique([
    ...getPatternLocalExamples(pattern).map((example) => example.sentence),
    ...getExamplesByPattern(pattern.id).map((example) => example.english),
    ...generatedPatternExamples.map((example) => example.sentence || example.english)
  ].filter(Boolean)).slice(0, 30);
}

async function requestBlockExerciseSetFromAI(payload, pattern) {
  const makeBody = (attempt = 1, previousError = "") => JSON.stringify({
    ...payload,
    count: payload.countPerType,
    countPerType: payload.countPerType,
    attempt,
    previousError,
    pattern: {
      id: pattern.id,
      displayFormulaZh: pattern.displayFormulaZh,
      displayFormulaEn: pattern.displayFormulaEn,
      explanationZh: pattern.explanationZh,
      localExamples: getPatternLocalExamples(pattern).map(({ sentence, translationZh, blocks }) => ({ sentence, translationZh, blocks })),
      sourceExamples: getExamplesByPattern(pattern.id).slice(0, 8).map(({ english, chinese, sourceTitle }) => ({ english, chinese, sourceTitle }))
    },
    selectedPatternId: pattern.id,
    selectedPattern: makeSelectedPatternPayload(pattern),
    blockedSentences: payload.blockedSentences || []
  });
  let lastError = "";
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    for (const endpoint of getAIEndpoints("/api/english-blocks/generate")) {
      try {
        const response = await fetchWithTimeout(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: makeBody(attempt, formatAIError(lastError)) }, AI_TIMEOUTS.englishBlocks);
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          lastError = data || { error: `AI 服务返回 ${response.status}`, status: response.status };
          continue;
        }
        const batch = normalizeExerciseSet(validateGeneratedExerciseBatch(data.batch, pattern.id), pattern, payload.countPerType);
        if (batch && getTotalExerciseCount(batch) > 0) return batch;
        lastError = { error: "AI 返回结构不完整", stage: "schema_validate" };
      } catch (error) {
        lastError = error?.stage ? { error: error.message, stage: error.stage } : error?.message || "AI 服务连接失败";
      }
    }
  }
  console.info("English Blocks AI generation failed:", lastError || "unavailable");
  blockExerciseError = formatAIError(lastError || "AI出题失败，请稍后重试");
  return null;
}

function isCompleteExerciseSet(batch, patternId = "") {
  if (!batch?.exercises || typeof batch.exercises !== "object") return false;
  if (patternId && batch.patternId !== patternId) return false;
  return getBlockAIExerciseTypes().every((type) => Array.isArray(batch.exercises[type.id]) && batch.exercises[type.id].length > 0);
}

function normalizeExerciseSet(batch, pattern, countPerType = 3) {
  if (!batch || !pattern) return null;
  const normalizedCount = [1, 3, 5].includes(Number(batch.questionsPerType || countPerType)) ? Number(batch.questionsPerType || countPerType) : 3;
  const grouped = batch.exercises && typeof batch.exercises === "object"
    ? batch.exercises
    : groupQuestionsByType(batch.questions || []);
  const exercises = {};
  for (const type of getBlockAIExerciseTypes()) {
    const existing = Array.isArray(grouped[type.id]) ? grouped[type.id].slice(0, normalizedCount) : [];
    const normalizedQuestions = existing.map((question, index) => normalizeExerciseQuestion(question, pattern, type.id, index)).filter(Boolean);
    if (normalizedQuestions.length !== normalizedCount) return null;
    exercises[type.id] = normalizedQuestions;
  }
  return {
    id: String(batch.id || `blocks-${pattern.id}-${Date.now()}`),
    patternId: pattern.id,
    selectedTypes: getBlockAIExerciseTypes().map((type) => type.id),
    questionsPerType: normalizedCount,
    createdAt: Number(batch.createdAt || Date.now()),
    source: batch.source || "ai_exercise_set",
    meta: batch.meta || null,
    exercises
  };
}

function isAuthenticAiBatch(batch) {
  return isAuthenticAiMeta(batch?.meta);
}

function isAuthenticAiMeta(meta) {
  const provider = meta?.provider;
  const latency = Number(meta?.latencyMs);
  return provider === "deepseek"
    && Boolean(meta?.requestId)
    && Number.isFinite(latency)
    && latency > 0
    && latency < 90000;
}

function markBatchFromCache(batch) {
  return {
    ...batch,
    meta: {
      ...(batch.meta || {}),
      fromCache: true
    }
  };
}

function groupQuestionsByType(questions) {
  return (questions || []).reduce((groups, question) => {
    if (!question?.type) return groups;
    groups[question.type] ||= [];
    groups[question.type].push(question);
    return groups;
  }, {});
}

function normalizeExerciseQuestion(question, pattern, type, index = 0) {
  if (!question) return null;
  if (!question.targetSentence || !question.correctAnswer && question.correctAnswer !== 0) return null;
  const base = {
    ...question,
    id: String(question.id || `${pattern.id}-${type}-${Date.now()}-${index + 1}`),
    type,
    targetPatternId: pattern.id,
    instructionZh: String(question.instructionZh || getDefaultExerciseInstruction(type)),
    promptZh: String(question.promptZh || ""),
    promptEn: String(question.promptEn || ""),
    explanationZh: String(question.explanationZh || ""),
    hintZh: String(question.hintZh || ""),
    targetSentence: String(question.targetSentence || ""),
    targetChinese: String(question.targetChinese || question.promptZh || ""),
    sceneTag: String(question.sceneTag || `scene-${index + 1}`),
    testedPoint: String(question.testedPoint || pattern.displayFormulaZh || pattern.id),
    answerSignature: String(question.answerSignature || question.targetSentence || ""),
    optionRationales: Array.isArray(question.optionRationales) ? question.optionRationales : []
  };
  if (type === "ordering") {
    const correctOrder = normalizeSentenceBlocks(Array.isArray(question.correctAnswer) ? question.correctAnswer : []);
    if (!correctOrder.length) return null;
    return { ...base, blocks: shuffleUntilDifferent(correctOrder), correctAnswer: correctOrder };
  }
  if (type === "translation_build") {
    const correctOrder = normalizeSentenceBlocks(Array.isArray(question.correctAnswer) ? question.correctAnswer : []);
    if (!correctOrder.length) return null;
    const requiredBlocks = normalizeSentenceBlocks(question.requiredBlocks?.length ? question.requiredBlocks : correctOrder);
    const distractorBlocks = normalizeSentenceBlocks(question.distractorBlocks || []);
    const mixedBlocks = normalizeSentenceBlocks(question.blocks || []);
    const candidate = { ...base, requiredBlocks, distractorBlocks, blocks: mixedBlocks, correctAnswer: correctOrder };
    if (!isValidTranslationBuildQuestion(candidate)) return null;
    return candidate;
  }
  if (type === "fill_blank") {
    const correct = String(question.correctAnswer || "");
    if (!correct || !Array.isArray(question.options)) return null;
    const options = makeValidatedShuffledOptions(correct, question.options, index);
    return { ...base, options, correctAnswer: correct };
  }
  if (!Array.isArray(question.options)) return null;
  const correctOption = question.options?.[Number(question.correctAnswer)];
  if (!correctOption) return null;
  const options = makeValidatedShuffledOptions(String(correctOption), question.options, index);
  return { ...base, options, correctAnswer: String(options.findIndex((option) => normalizeAnswerText(option) === normalizeAnswerText(correctOption))) };
}

function getDefaultExerciseInstruction(type) {
  return {
    ordering: "把英文积木排成一句完整的话",
    fill_blank: "选择合适的积木补全句子",
    translation_build: "看中文，用英文积木拼出句子",
    choose_correct: "选择正确的英文句子",
    pattern_replace: "选择一个积木，保持句型不变"
  }[type] || "完成这道AI练习题";
}

function normalizeSentenceBlocks(blocks) {
  return (blocks || []).map((block) => String(block || "").trim()).filter(Boolean);
}

function makeTranslationBuildBlocks(correctOrder, distractorBlocks = [], mixedBlocks = []) {
  const correct = normalizeSentenceBlocks(correctOrder);
  const distractors = uniqueByNormalized(normalizeSentenceBlocks(distractorBlocks)).filter((item) => !correct.some((block) => normalizeAnswerText(block) === normalizeAnswerText(item)));
  const incoming = uniqueByNormalized(normalizeSentenceBlocks(mixedBlocks));
  const hasAllCorrect = correct.every((block) => incoming.some((item) => normalizeAnswerText(item) === normalizeAnswerText(block)));
  const extras = incoming.filter((item) => !correct.some((block) => normalizeAnswerText(block) === normalizeAnswerText(item)));
  const source = hasAllCorrect && extras.length >= 2 ? incoming : [...correct, ...distractors.slice(0, Math.max(2, distractors.length))];
  const completed = uniqueByNormalized(source);
  if (completed.length <= correct.length) return [];
  const shuffled = shuffleUntilDifferent(completed);
  return arraysEqual(shuffled.slice(0, correct.length), correct) ? shuffleUntilDifferent(shuffled) : shuffled;
}

function isValidTranslationBuildQuestion(question) {
  if (!question || question.type !== "translation_build") return true;
  const correct = normalizeSentenceBlocks(question.correctAnswer || []);
  const required = normalizeSentenceBlocks(question.requiredBlocks || []);
  const distractors = normalizeSentenceBlocks(question.distractorBlocks || []);
  const blocks = normalizeSentenceBlocks(question.blocks || []);
  if (!question.targetSentence || !question.targetChinese) return false;
  if (!correct.length || !sameBlockBag(required, correct)) return false;
  if (distractors.length < 2) return false;
  if (blocks.length <= correct.length) return false;
  if (!blockBagContainsAll(blocks, correct)) return false;
  if (!blockBagContainsAll(blocks, required)) return false;
  if (!blockBagContainsAll(blocks, distractors)) return false;
  const answerSentence = joinExerciseBlocks(correct);
  if (normalizeAnswerText(answerSentence) !== normalizeAnswerText(question.targetSentence)) return false;
  if (!targetTokensCoveredByBlocks(question.targetSentence, correct)) return false;
  if (arraysEqual(blocks.slice(0, correct.length).map(normalizeAnswerText), correct.map(normalizeAnswerText))) return false;
  return true;
}

function sameBlockBag(first, second) {
  const firstMap = makeBlockCountMap(first);
  const secondMap = makeBlockCountMap(second);
  if (firstMap.size !== secondMap.size) return false;
  for (const [key, count] of firstMap.entries()) {
    if (secondMap.get(key) !== count) return false;
  }
  return true;
}

function blockBagContainsAll(blocks, required) {
  const available = makeBlockCountMap(blocks);
  for (const [key, count] of makeBlockCountMap(required).entries()) {
    if ((available.get(key) || 0) < count) return false;
  }
  return true;
}

function joinExerciseBlocks(blocks = []) {
  return (blocks || []).join(" ").replace(/\s+([.,!?;:])/g, "$1").trim();
}

function tokenizeEnglishCore(value) {
  return String(value || "").replace(/’/g, "'").toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
}

function targetTokensCoveredByBlocks(targetSentence, correctBlocks) {
  const target = tokenizeEnglishCore(targetSentence);
  const answer = tokenizeEnglishCore(joinExerciseBlocks(correctBlocks));
  const counts = new Map();
  answer.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  return target.length > 0 && target.every((token) => {
    const count = counts.get(token) || 0;
    if (count <= 0) return false;
    counts.set(token, count - 1);
    return true;
  });
}

function makeValidatedShuffledOptions(correctOption, rawOptions, salt = 0) {
  const correct = String(correctOption || "");
  const options = uniqueByNormalized([correct, ...(rawOptions || [])]).slice(0, 4);
  while (options.length < 4) {
    const filler = `option ${options.length + 1}`;
    if (!options.some((item) => normalizeAnswerText(item) === normalizeAnswerText(filler))) options.push(filler);
  }
  const shuffled = shuffleOptionsWithVariableAnswer(options.slice(0, 4), correct, salt);
  const correctCount = shuffled.filter((option) => normalizeAnswerText(option) === normalizeAnswerText(correct)).length;
  if (correctCount !== 1) return [correct, ...uniqueByNormalized(options.filter((option) => normalizeAnswerText(option) !== normalizeAnswerText(correct)))].slice(0, 4);
  return shuffled;
}

function shuffleOptionsWithVariableAnswer(options, correctOption, salt = 0) {
  const shuffled = shuffleArray(options);
  const correctIndex = shuffled.findIndex((option) => normalizeAnswerText(option) === normalizeAnswerText(correctOption));
  if (correctIndex > 0 || shuffled.length < 2) return shuffled;
  const fallback = [...shuffled];
  const swapIndex = 1 + (Math.abs(Number(salt) || 0) % (fallback.length - 1));
  [fallback[0], fallback[swapIndex]] = [fallback[swapIndex], fallback[0]];
  return fallback;
}

function uniqueByNormalized(values) {
  const seen = new Set();
  return (values || []).map((value) => String(value || "").trim()).filter((value) => {
    const key = normalizeAnswerText(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTotalExerciseCount(batch) {
  return Object.values(batch?.exercises || {}).reduce((sum, questions) => sum + (Array.isArray(questions) ? questions.length : 0), 0);
}

function validateGeneratedExerciseBatch(batch, patternId) {
  if (batch?.exercises && typeof batch.exercises === "object") return batch;
  if (!batch || !Array.isArray(batch.questions) || !batch.questions.length) return null;
  const allowedTypes = new Set(getBlockAIExerciseTypes().map((item) => item.id));
  const grouped = {};
  batch.questions.map((question, index) => {
    if (!allowedTypes.has(question.type)) return null;
    if (!question.correctAnswer && question.correctAnswer !== 0) return null;
    const item = {
      id: String(question.id || `${patternId}-${Date.now()}-${index}`),
      type: question.type,
      instructionZh: String(question.instructionZh || getGeneratedExerciseLabel(question.type)),
      promptZh: String(question.promptZh || ""),
      promptEn: String(question.promptEn || ""),
      blocks: Array.isArray(question.blocks) ? question.blocks.map(String).slice(0, 12) : [],
      options: Array.isArray(question.options) ? question.options.map(String).slice(0, 6) : [],
      correctAnswer: question.correctAnswer,
      explanationZh: String(question.explanationZh || ""),
      targetSentence: String(question.targetSentence || ""),
      targetChinese: String(question.targetChinese || ""),
      sceneTag: String(question.sceneTag || ""),
      testedPoint: String(question.testedPoint || ""),
      answerSignature: String(question.answerSignature || question.targetSentence || ""),
      slotValues: question.slotValues && typeof question.slotValues === "object" ? question.slotValues : {},
      requiredBlocks: Array.isArray(question.requiredBlocks) ? question.requiredBlocks.map(String).slice(0, 8) : [],
      distractorBlocks: Array.isArray(question.distractorBlocks) ? question.distractorBlocks.map(String).slice(0, 8) : [],
      optionRationales: Array.isArray(question.optionRationales) ? question.optionRationales : [],
      targetPatternId: String(question.targetPatternId || patternId)
    };
    grouped[item.type] ||= [];
    grouped[item.type].push(item);
    return item;
  }).filter(Boolean);
  if (!Object.keys(grouped).length) return null;
  return {
    id: String(batch.id || `batch-${Date.now()}`),
    patternId,
    selectedTypes: Array.isArray(batch.selectedTypes) ? batch.selectedTypes : getBlockAIExerciseTypes().map((type) => type.id),
    createdAt: Number(batch.createdAt || Date.now()),
    meta: batch.meta || null,
    exercises: grouped
  };
}

function getBlockExerciseCacheKey(payload) {
  return JSON.stringify({
    feature: "english_blocks_exercises",
    patternId: payload.patternId,
    selectedTypes: [...(payload.selectedTypes || [])].sort(),
    countPerType: payload.countPerType || payload.count,
    sourceHash: simpleHash(JSON.stringify({
      patternId: payload.patternId,
      sourceExampleIds: payload.sourceExampleIds || [],
      blockedSentences: payload.blockedSentences || []
    })),
    corpusVersion: ENGLISH_WORD_LIBRARY_VERSION,
    promptVersion: ENGLISH_BLOCK_EXERCISE_PROMPT_VERSION,
    schemaVersion: "english-blocks-batch-v1"
  });
}

function loadBlockExerciseCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(ENGLISH_BLOCK_EXERCISE_CACHE_KEY) || "null");
    if (!raw) return { latestKey: "", batches: {} };
    if (raw.questions) return { latestKey: "legacy", batches: { legacy: raw } };
    return { latestKey: raw.latestKey || "", batches: raw.batches || {} };
  } catch {
    return { latestKey: "", batches: {} };
  }
}

function loadLatestBlockExerciseBatch() {
  const cache = loadBlockExerciseCache();
  return cache.latestKey ? cache.batches[cache.latestKey] || null : null;
}

function getCachedBlockExerciseBatch(cacheKey) {
  return loadBlockExerciseCache().batches[cacheKey] || null;
}

function saveLatestBlockExerciseBatch(batch, cacheKey = "latest") {
  if (!isAuthenticAiBatch(batch)) return;
  const cache = loadBlockExerciseCache();
  cache.latestKey = cacheKey;
  cache.batches[cacheKey] = batch;
  const entries = Object.entries(cache.batches).slice(-8);
  localStorage.setItem(ENGLISH_BLOCK_EXERCISE_CACHE_KEY, JSON.stringify({
    latestKey: cache.latestKey,
    batches: Object.fromEntries(entries)
  }));
}

function renderBlockSourceOptions() {
  const select = $("#blocksSourceSelect");
  if (!select) return;
  const options = getBlockSourceFilterOptions();
  if (!options.some((option) => option.id === selectedSourceFilter)) {
    selectedSourceFilter = "all_sources";
    localStorage.setItem(ENGLISH_BLOCK_SOURCE_FILTER_KEY, selectedSourceFilter);
  }
  select.innerHTML = options.map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>`).join("");
  select.value = selectedSourceFilter;
}

function renderBlockPatternOptions() {
  const select = $("#blocksPatternSelect");
  if (!select) return;
  const patterns = getFilteredBlockPatterns();
  if (!patterns.length) {
    select.innerHTML = `<option value="">当前来源下暂无句型</option>`;
    select.value = "";
    return;
  }
  ensureSelectedPatternInCurrentFilter();
  const grouped = groupPatternsByCategory(patterns);
  select.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <optgroup label="${escapeHtml(getPatternCategoryLabel(category))}">
      ${items.map((pattern) => `<option value="${escapeHtml(pattern.id)}">${escapeHtml(pattern.displayZh)} ｜ ${escapeHtml(pattern.displayEn)}</option>`).join("")}
    </optgroup>
  `).join("");
  select.value = selectedBlockPatternId;
}

function getBlockSourceFilterOptions() {
  return [
    { id: "all_sources", label: "全部来源 / All Sources" },
    { id: "daily_pack", label: "今日学习包 / Today's Pack" },
    { id: "story_zoo", label: "Story 1 · ZOO" },
    { id: "story_kindergarten", label: "Story 2 · Kindergarten" },
    { id: "story_primary_school", label: "Story 3 · Hello, School" },
    { id: "prior_lessons", label: "已学语法 / Prior Lessons" },
    { id: "grade_one_core", label: "一年级核心 / Grade One Core" },
    { id: "textbook_core", label: "教材结构 / Textbook" }
  ];
}

function groupPatternsByCategory(patterns) {
  return patterns.reduce((groups, pattern) => {
    groups[pattern.category] ||= [];
    groups[pattern.category].push(pattern);
    return groups;
  }, {});
}

function getPatternCategoryLabel(category) {
  return {
    greeting: "问候与介绍",
    self_introduction: "问候与介绍",
    object_identification: "物品与位置",
    location: "物品与位置",
    preference: "喜好与想做",
    want_need_like: "喜好与想做",
    ability: "能力与动作",
    action: "能力与动作",
    there_be: "疑问句",
    question: "疑问句",
    classroom_instruction: "课堂指令",
    imperative: "课堂指令",
    possession: "物品与位置",
    present_continuous: "已学语法",
    time_scene: "时间场景"
  }[category] || "已学语法";
}

function getFilteredBlockPatterns() {
  const patterns = getAllBlockPatterns();
  if (selectedSourceFilter === "all_sources") return patterns;
  return patterns.filter((pattern) => pattern.sourceTags?.includes(selectedSourceFilter) || pattern.sources?.includes(selectedSourceFilter));
}

function getAllBlockPatterns() {
  const dailyPattern = getTodayPackBlockPattern();
  return dailyPattern ? [dailyPattern, ...ENGLISH_BLOCK_PATTERNS] : ENGLISH_BLOCK_PATTERNS;
}

function getCurrentBlockPattern() {
  const patterns = getFilteredBlockPatterns();
  if (!patterns.length) return null;
  let pattern = patterns.find((item) => item.id === selectedBlockPatternId);
  if (!pattern) {
    pattern = patterns[0];
    selectedBlockPatternId = pattern.id;
    localStorage.setItem(ENGLISH_BLOCK_SELECTED_PATTERN_KEY, selectedBlockPatternId);
  }
  return pattern;
}

function ensureSelectedPatternInCurrentFilter() {
  const patterns = getFilteredBlockPatterns();
  if (!patterns.length) return;
  if (!patterns.some((pattern) => pattern.id === selectedBlockPatternId)) {
    selectedBlockPatternId = patterns[0].id;
    localStorage.setItem(ENGLISH_BLOCK_SELECTED_PATTERN_KEY, selectedBlockPatternId);
  }
}

function setSelectedBlockPatternId(patternId) {
  const patterns = getFilteredBlockPatterns();
  const next = patterns.find((pattern) => pattern.id === patternId) || patterns[0];
  if (!next) return;
  selectedBlockPatternId = next.id;
  localStorage.setItem(ENGLISH_BLOCK_SELECTED_PATTERN_KEY, selectedBlockPatternId);
  clearBlockPatternWorkState();
  renderEnglishBlocks();
}

function clearBlockPatternWorkState() {
  currentPatternExampleIndex = 0;
  blockExampleDisplayMode = "default_pattern_example";
  blockExamplesCollapsed = false;
  blockSourceExampleIndex = 0;
  blockExampleTranslationVisible = false;
  generatedPatternExamples = [];
  generatedPatternExampleIndex = 0;
  generatedPatternExamplesVisible = false;
  blockExampleError = "";
  blockExerciseBatch = null;
  blockExerciseIndex = 0;
  blockExerciseIndexes = {};
  blockAnswerState = {};
  blockExerciseError = "";
  activeBlockExerciseType = "ordering";
  resetPatternExampleDisplayState();
  resetExampleDisplayState();
}

function makeSelectedPatternPayload(pattern) {
  return {
    id: pattern.id,
    displayZh: pattern.displayZh || pattern.displayFormulaZh,
    displayEn: pattern.displayEn || pattern.displayFormulaEn,
    displayFormulaZh: pattern.displayFormulaZh || pattern.displayZh,
    displayFormulaEn: pattern.displayFormulaEn || pattern.displayEn,
    explanationZh: pattern.explanationZh || "",
    sourceTags: pattern.sourceTags || pattern.sources || [],
    exampleSeeds: (pattern.exampleSeeds || getPatternLocalExamples(pattern).map((example) => ({
      english: example.sentence || example.english,
      chinese: example.translationZh || example.chinese,
      source: example.sourceTitle || ""
    }))).slice(0, 8)
  };
}

function rotateCurrentPatternVariant() {
  const pattern = getCurrentBlockPattern();
  if (!pattern?.slots?.length) return;
  blocksProgress.variants[pattern.id] = ((blocksProgress.variants[pattern.id] || 0) + 1) % Math.max(1, pattern.slots[0].options.length);
  saveBlocksProgress();
}

function getPatternVariant(pattern) {
  const slot = pattern.slots?.[0];
  if (!slot?.options?.length) return pattern;
  const index = blocksProgress.variants[pattern.id] || 0;
  const value = slot.options[index % slot.options.length];
  const example = pattern.example.replace(slot.id === "verbPhrase" ? "climb the mountain" : slot.id === "schoolThing" ? "schoolbag" : slot.id === "place" ? "on the desk" : "", value);
  return { ...pattern, example, blocks: makeBlocksForVariant(pattern, value) };
}

function makeBlocksForVariant(pattern, value) {
  if (pattern.id === "want_to_do") return ["I", "want to", ...value.split(" ")];
  if (pattern.id === "here_is_my") return ["Here is", `my ${value}`];
  if (pattern.id === "schoolbag_place") return ["My schoolbag", "is", ...value.split(" ")];
  return pattern.blocks;
}

function renderBlockExercise(rawPattern, type) {
  const pattern = getPatternVariant(rawPattern);
  if (type === "replacement") return renderReplacementExercise(pattern);
  if (type === "qa") return renderQAExercise(pattern);
  if (type === "choice") return renderChoiceExercise(pattern);
  if (type === "zhToEn") return renderZhToEnExercise(pattern);
  if (type === "dialog") return renderDialogExercise(pattern);
  if (type === "error") return renderErrorExercise(pattern);
  return renderOrderingExercise(pattern);
}

function renderOrderingExercise(pattern) {
  return `
    <p class="blocks-prompt">把积木排成一句完整的话</p>
    <div class="block-bank">${shuffleArray(pattern.blocks).map((block) => `<button class="block-chip" type="button">${escapeHtml(block)}</button>`).join("")}</div>
    <div class="blocks-answer">${escapeHtml(pattern.example)}</div>
    <p class="blocks-translation">${escapeHtml(pattern.translationZh)}</p>
  `;
}

function renderReplacementExercise(pattern) {
  const slot = pattern.slots?.[0];
  return `
    <p class="blocks-prompt">替换一个积木，句型不变</p>
    <div class="blocks-answer">${escapeHtml(pattern.example)}</div>
    <div class="block-bank">${(slot?.options || ["book", "pencil"]).map((option) => `<button class="block-chip" type="button">${escapeHtml(option)}</button>`).join("")}</div>
  `;
}

function renderQAExercise(pattern) {
  const q = pattern.id === "whats_your_name" ? "What's your name?" : pattern.example.includes("?") ? pattern.example : "Can he swim?";
  const a = pattern.answer || (q.includes("Can") ? "Yes, he can." : "My name is Helen.");
  return `
    <p class="blocks-prompt">问答配对</p>
    <div class="dialog-line"><strong>Q</strong>${escapeHtml(q)}</div>
    <div class="dialog-line"><strong>A</strong>${escapeHtml(a)}</div>
  `;
}

function renderChoiceExercise(pattern) {
  return `
    <p class="blocks-prompt">选择正确积木</p>
    <div class="blocks-answer">She ___ a purple bag.</div>
    <div class="block-bank">${["have", "has", "is", "are"].map((option) => `<button class="block-chip" type="button">${escapeHtml(option)}</button>`).join("")}</div>
  `;
}

function renderZhToEnExercise(pattern) {
  return `
    <p class="blocks-prompt">看中文搭英文</p>
    <div class="blocks-translation">${escapeHtml(pattern.translationZh)}</div>
    <div class="block-bank">${pattern.blocks.map((block) => `<button class="block-chip" type="button">${escapeHtml(block)}</button>`).join("")}</div>
    <div class="blocks-answer">${escapeHtml(pattern.example)}</div>
  `;
}

function renderDialogExercise(pattern) {
  return `
    <p class="blocks-prompt">对话接龙</p>
    <div class="dialog-line"><strong>Amy</strong>Hello! I'm Amy. What's your name?</div>
    <div class="dialog-line"><strong>Helen</strong>${escapeHtml(pattern.answer || "My name is Helen.")}</div>
  `;
}

function renderErrorExercise(pattern) {
  return `
    <p class="blocks-prompt">找出错误积木</p>
    <div class="block-bank">${(pattern.blocks || ["She", "are", "happy"]).map((block) => `<button class="block-chip ${block === (pattern.errorBlock || "are") ? "error-chip" : ""}" type="button">${escapeHtml(block)}</button>`).join("")}</div>
    <div class="blocks-answer">正确：${escapeHtml(pattern.correctedExample || "She is happy.")}</div>
  `;
}

function getBlockExerciseLabel(type) {
  return {
    ordering: "句子排序 / Ordering",
    replacement: "替换积木 / Replacement",
    qa: "问答配对 / Q&A",
    choice: "选择正确积木 / Choice",
    zhToEn: "看中文搭英文 / Chinese to English",
    dialog: "对话接龙 / Dialogue",
    error: "找出错误积木 / Error Fix"
  }[type] || "句子排序 / Ordering";
}

function getBlockSourceLabel(source) {
  return {
    story_zoo: "Story 1",
    story_kindergarten: "Story 2",
    story_primary_school: "Story 3",
    beijing_grade1_semester_1: "北京版一年级上册",
    prior_lessons: "已学句型"
  }[source] || source;
}

function shuffleArray(values) {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function arraysEqual(first, second) {
  return first.length === second.length && first.every((item, index) => item === second[index]);
}

function shuffleUntilDifferent(correctOrder) {
  if (correctOrder.length < 2) return [...correctOrder];
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const shuffled = shuffleArray(correctOrder);
    if (!arraysEqual(shuffled, correctOrder)) return shuffled;
  }
  const fallback = [...correctOrder];
  [fallback[0], fallback[1]] = [fallback[1], fallback[0]];
  return fallback;
}

function findInCard(card, kind, value) {
  if (!card) return null;
  const attr = kind === "pinyin" ? "pinyinFor" : kind === "words" ? "wordsFor" : "meaningFor";
  const selector = kind === "pinyin" ? "[data-pinyin-for]" : kind === "words" ? "[data-words-for]" : "[data-meaning-for]";
  return [...card.querySelectorAll(selector)]
    .find((item) => item.dataset[attr] === value) || card.querySelector(selector);
}

function normalizeEnglishText(input) {
  return String(input || "")
    .normalize("NFKC")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .toLowerCase()
    .trim();
}

function normalizeEnglishWord(input) {
  const token = tokenizeEnglishSentence(input)[0];
  return token || normalizeEnglishText(input);
}

function tokenizeEnglishSentence(sentence) {
  return normalizeEnglishText(sentence).match(/[a-z]+(?:'[a-z]+)?/g) || [];
}

function buildWordExampleIndex(examples) {
  return examples.reduce((index, example) => {
    unique(example.normalizedTokens || []).forEach((token) => {
      index[token] ||= [];
      index[token].push(example.id);
    });
    return index;
  }, {});
}

function getExamplesByWord(word) {
  const normalized = normalizeEnglishWord(word?.normalized || word?.text || word);
  const ids = WORD_EXAMPLE_INDEX[normalized] || [];
  const byId = new Map(SOURCE_EXAMPLES.map((example) => [example.id, example]));
  const priority = { story_primary_school: 1, story_kindergarten: 2, story_zoo: 3 };
  return ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .sort((a, b) => {
      const bodyPriority = (a.kind === "body" ? 0 : 1) - (b.kind === "body" ? 0 : 1);
      return bodyPriority || (priority[a.sourceId] || 9) - (priority[b.sourceId] || 9) || a.order - b.order;
    });
}

function getStoryExamplesForWord(word) {
  return getExamplesByWord(word).filter((example) => example.sourceType === "story");
}

function getExampleIdsByWord(word) {
  return getExamplesByWord(word).map((example) => example.id);
}

function getExamplesByPattern(patternId) {
  const matches = SOURCE_EXAMPLES.filter((example) => doesExampleMatchPattern(example, patternId));
  if (matches.length) return matches.sort((a, b) => (a.sourceId > b.sourceId ? 1 : -1) || a.order - b.order);
  const pattern = ENGLISH_BLOCK_PATTERNS.find((item) => item.id === patternId);
  return (pattern?.exampleSeeds || [])
    .filter((seed) => seed.source && seed.source !== "AI Example")
    .map((seed, index) => ({
      id: `${patternId}-source-seed-${index + 1}`,
      english: seed.english,
      chinese: seed.chinese,
      sourceTitle: seed.source,
      sourceId: seed.source,
      order: index + 1,
      normalizedTokens: tokenizeEnglishSentence(seed.english)
    }));
}

function doesExampleMatchPattern(example, patternId) {
  const tokens = example.normalizedTokens || [];
  const english = normalizeEnglishText(example.english);
  if (patternId === "want_to_do" || patternId === "subject_want_to_verb") return hasAdjacentTokens(tokens, "want", "to") || hasAdjacentTokens(tokens, "wants", "to");
  if (patternId === "here_is_my" || patternId === "here_is_my_thing") return english.includes("here is my") || english.includes("here are my");
  if (patternId === "whats_your_name" || patternId === "what_is_your_name") return tokens.includes("what's") && tokens.includes("name");
  if (patternId === "have_has" || patternId === "subject_has_object") return tokens.includes("has") || tokens.includes("have");
  if (patternId === "schoolbag_place" || patternId === "thing_is_place") return ["on", "under", "near", "in"].some((token) => tokens.includes(token)) && (tokens.includes("is") || tokens.includes("are"));
  if (patternId === "dialog_name" || patternId === "self_intro_im_name") return tokens.includes("i'm") || tokens.includes("hello") || tokens.includes("name") || tokens.includes("meet");
  if (patternId === "error_be") return tokens.includes("she") && tokens.includes("is");
  if (patternId === "parallel_actions" || patternId === "subject_simple_present_verb_object") return tokens.includes("run") || tokens.includes("read") || tokens.includes("eat") || tokens.includes("drink");
  if (patternId === "do_you_want_to_verb") return tokens.includes("do") && tokens.includes("you") && hasAdjacentTokens(tokens, "want", "to");
  if (patternId === "subject_like_object") return tokens.includes("like") || tokens.includes("love");
  if (patternId === "do_you_like_object") return tokens.includes("do") && tokens.includes("you") && tokens.includes("like");
  if (patternId === "can_subject_verb") return tokens.includes("can") && example.english.includes("?");
  if (patternId === "subject_can_verb") return tokens.includes("can") && !example.english.includes("?");
  if (patternId === "where_be_subject") return tokens.includes("where");
  if (patternId === "imperative_verb_object") return ["look", "open", "show"].some((token) => tokens.includes(token));
  return false;
}

function hasAdjacentTokens(tokens, first, second) {
  return tokens.some((token, index) => token === first && tokens[index + 1] === second);
}

function resetEnglishExamplePanel() {
  englishStoryExampleMatches = [];
  englishStoryExampleIndex = 0;
  englishCurrentExampleSentence = "";
  resetExampleDisplayState();
  const panel = $("#englishExamplePanel");
  if (panel) {
    panel.hidden = true;
    panel.innerHTML = "";
  }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function showStoryExample(word = currentEnglishWord) {
  currentEnglishWord = word;
  selectedEnglishCardId = word?.id || "";
  if (!currentEnglishWord) return;
  englishExamplePanelMode = "story";
  incrementEnglishExampleUsage("originalExampleViews");
  englishStoryExampleMatches = getStoryExamplesForWord(currentEnglishWord);
  englishStoryExampleIndex = 0;
  resetExampleDisplayState();
  renderStoryExamplePanel();
  updateEnglishSelectedCard();
}

function renderStoryExamplePanel() {
  const panel = $("#englishExamplePanel");
  if (!panel || !currentEnglishWord) return;
  panel.hidden = false;
  const item = englishStoryExampleMatches[englishStoryExampleIndex];
  englishCurrentExampleSentence = item?.english || "";
  panel.innerHTML = renderSourceExampleCarousel({
    label: "原文例句 / Source Example",
    examples: englishStoryExampleMatches,
    index: englishStoryExampleIndex,
    prevAttr: "data-story-example-prev",
    nextAttr: "data-story-example-next",
    emptyTitle: "该词目前没有录入可核对的原文例句",
    emptyHint: "可以试试“积木例句”，它会明确标记为 AI 生成",
    currentWord: currentEnglishWord.normalized,
    phoneticsVisible: englishExamplePhoneticsVisible,
    translationVisible: englishExampleTranslationVisible
  });
}

function renderSourceExampleCarousel({ label, examples, index, prevAttr, nextAttr, emptyTitle, emptyHint, currentWord, phoneticsVisible = false, translationVisible = false }) {
  if (!examples?.length) {
    return `
      <div class="example-kicker">${escapeHtml(label)}</div>
      <p class="example-empty">${escapeHtml(emptyTitle)}</p>
      <p class="example-hint">${escapeHtml(emptyHint)}</p>
    `;
  }
  const item = examples[index] || examples[0];
  const canMove = examples.length > 1;
  return `
    <div class="source-carousel-top">
      <span>${escapeHtml(item.sourceTitle || item.storyTitle || label)}</span>
      <strong>${index + 1} / ${examples.length}</strong>
    </div>
    <div class="source-carousel-row">
      ${canMove ? `<button class="carousel-arrow" ${prevAttr}="true" type="button" aria-label="上一条例句">‹</button>` : `<span></span>`}
      <div class="source-carousel-copy">
        <div class="example-kicker">${escapeHtml(label)}</div>
        <button class="example-english example-text-button" data-example-text="true" type="button">${highlightExampleWord(item.english, currentWord)}</button>
        ${phoneticsVisible ? renderSentencePhonetics(item.english) : ""}
        ${translationVisible ? `<p class="example-chinese">${escapeHtml(item.chinese || "")}</p>` : ""}
        <button class="button ghost compact-button" data-example-translation="true" type="button">${translationVisible ? "隐藏中文" : "查看中文"}<br><span>${translationVisible ? "Hide Chinese" : "Show Chinese"}</span></button>
      </div>
      ${canMove ? `<button class="carousel-arrow" ${nextAttr}="true" type="button" aria-label="下一条例句">›</button>` : `<span></span>`}
    </div>
  `;
}

function highlightExampleWord(sentence, currentWord) {
  if (!currentWord) return escapeHtml(sentence || "");
  const normalized = normalizeEnglishWord(currentWord);
  const parts = String(sentence || "").split(/([A-Za-z]+(?:[’'][A-Za-z]+)?)/g);
  return parts.map((part) => normalizeEnglishWord(part) === normalized
    ? `<mark class="example-highlight">${escapeHtml(part)}</mark>`
    : escapeHtml(part)
  ).join("");
}

function renderSentencePhonetics(sentence, actionAttr = "data-example-phonetics") {
  const tokens = getSentencePhoneticTokens(sentence);
  if (!tokens.length) return "";
  return `
    <button class="sentence-phonetics" ${actionAttr}="true" type="button" aria-label="朗读完整英文例句">
      ${tokens.map((token) => `
        <span class="sentence-phonetic-token">
          <strong>${escapeHtml(token.text)}</strong>
          <small>${escapeHtml(token.phonetic)}</small>
        </span>
      `).join("")}
    </button>
  `;
}

function getSentencePhoneticTokens(sentence) {
  const words = String(sentence || "").match(/[A-Za-z]+(?:[’'][A-Za-z]+)?/g) || [];
  return words.map((text) => ({
    text,
    phonetic: getReliableEnglishPhonetic(normalizeEnglishWord(text))
  }));
}

function getReliableEnglishPhonetic(word) {
  const normalized = normalizeEnglishWord(word);
  const entry = ENGLISH_PRONUNCIATIONS[normalized];
  const phonetic = (englishProgress.settings?.voiceLang || "en-US") === "en-GB" ? entry?.ipaUK || entry?.ipaUS || "" : entry?.ipaUS || entry?.ipaUK || "";
  return phonetic || makeReadablePhoneticFallback(normalized);
}

function resetExampleDisplayState() {
  englishExamplePhoneticsVisible = false;
  englishExampleTranslationVisible = false;
}

function toggleExamplePhonetics(source) {
  const sentence = source === "blockSource"
    ? blockSourceExamples[blockSourceExampleIndex]?.english || ""
    : source === "generatedPattern"
      ? generatedPatternExamples[generatedPatternExampleIndex]?.english || ""
      : englishCurrentExampleSentence;
  const willShow = !englishExamplePhoneticsVisible;
  englishExamplePhoneticsVisible = willShow;
  if (willShow) speakEnglishText(sentence, true);
  if (source === "blockSource") renderBlockSourceExamples();
  else if (source === "generatedPattern") renderGeneratedPatternExamples();
  else if (englishExamplePanelMode === "block") renderBlockExamplePanel(englishCurrentBlockExample);
  else renderStoryExamplePanel();
}

function toggleExampleTranslation(source) {
  englishExampleTranslationVisible = !englishExampleTranslationVisible;
  if (source === "blockSource") renderBlockSourceExamples();
  else if (source === "generatedPattern") renderGeneratedPatternExamples();
  else if (englishExamplePanelMode === "block") renderBlockExamplePanel(englishCurrentBlockExample);
  else renderStoryExamplePanel();
}

function moveStoryExample(delta) {
  if (!englishStoryExampleMatches.length) return;
  englishStoryExampleIndex = (englishStoryExampleIndex + delta + englishStoryExampleMatches.length) % englishStoryExampleMatches.length;
  resetExampleDisplayState();
  renderStoryExamplePanel();
}

async function showBlockExample(word = currentEnglishWord, forceNew = false) {
  currentEnglishWord = word;
  selectedEnglishCardId = word?.id || "";
  if (!currentEnglishWord || englishBlockExampleInFlight) return;
  englishExamplePanelMode = "block";
  resetExampleDisplayState();
  updateEnglishSelectedCard();
  incrementEnglishExampleUsage(forceNew ? "generatedExampleRefreshes" : "generatedExampleViews");
  const cached = getCachedBlockExample(currentEnglishWord.id, forceNew);
  if (cached) {
    renderBlockExamplePanel(cached);
    return;
  }
  englishBlockExampleInFlight = true;
  renderBlockLoadingPanel();
  const generated = await requestBlockExample(forceNew);
  englishBlockExampleInFlight = false;
  if (generated) {
    renderBlockExamplePanel(generated);
  } else {
    renderBlockExampleErrorPanel();
  }
  updateEnglishSelectedCard();
}

function renderBlockLoadingPanel() {
  const panel = $("#englishExamplePanel");
  panel.hidden = false;
  panel.innerHTML = `
    <div class="example-kicker">积木例句 / Block Sentence</div>
    <p class="example-empty">正在搭积木……</p>
  `;
}

function renderBlockExampleErrorPanel() {
  const panel = $("#englishExamplePanel");
  if (!panel) return;
  panel.hidden = false;
  panel.innerHTML = `
    <div class="example-kicker">AI积木例句 / Block Sentence</div>
    <p class="example-empty">AI例句生成失败，请稍后重试。</p>
    <p class="example-hint">系统不会用本地例句冒充 AI 结果。</p>
  `;
}

function renderBlockExamplePanel(example) {
  const panel = $("#englishExamplePanel");
  if (!panel) return;
  if (!example) return;
  englishCurrentBlockExample = example;
  englishCurrentExampleSentence = example.sentence || "";
  panel.hidden = false;
  panel.innerHTML = `
    <div class="example-kicker">AI积木例句 / Block Sentence</div>
    <button class="example-english example-text-button" data-example-text="true" type="button">${escapeHtml(example.sentence || "这次没有搭好，再试一次吧。")}</button>
    ${englishExamplePhoneticsVisible ? renderSentencePhonetics(example.sentence || "") : ""}
    ${englishExampleTranslationVisible ? `<p class="example-chinese">${escapeHtml(example.translationZh || "")}</p>` : ""}
    <div class="example-blocks">
      ${(example.blocks || []).map((block) => `<span>${escapeHtml(block)}</span>`).join("")}
    </div>
    <div class="example-actions">
      <button class="button ghost compact-button" data-example-translation="true" type="button">${englishExampleTranslationVisible ? "隐藏中文" : "查看中文"}<br><span>${englishExampleTranslationVisible ? "Hide Chinese" : "Show Chinese"}</span></button>
      <button class="button ghost compact-button" data-block-example-refresh="true" type="button">再来一个<br><span>Another</span></button>
    </div>
  `;
}

async function requestBlockExample(forceNew) {
  const payload = {
    task: "generate_block_sentence",
    targetWord: currentEnglishWord.normalized,
    displayWord: currentEnglishWord.text,
    meaningZh: currentEnglishWord.chinese || getEnglishMeaning(currentEnglishWord.normalized),
    sources: currentEnglishWord.sources,
    level: ENGLISH_BLOCK_EXAMPLE_LEVEL,
    childAge: 7,
    forceNew: Boolean(forceNew),
    recentExamples: getCachedBlockExamples(currentEnglishWord.id).slice(-3).map((item) => item.sentence),
    storySentences: STORY_SENTENCES.map(({ storyId, storyTitle, order, english, chinese }) => ({ storyId, storyTitle, order, english, chinese })),
    allowedVocabulary: englishLibrary
      .filter((word) => ["learned", "learning"].includes(word.learningStatus))
      .map((word) => word.normalized)
      .slice(0, 260),
    allowedPatterns: ENGLISH_PATTERN_LIBRARY,
    requirements: {
      mustContainTargetWord: true,
      preserveDisplayedFormWhenNatural: true,
      maxNewWords: 1,
      maxSentenceLength: 12,
      useSimpleGrammar: true,
      returnChineseTranslation: true,
      returnBlocks: true
    }
  };
  const body = JSON.stringify(payload);
  let lastError = "";
  for (const endpoint of getAIEndpoints("/api/generate-block-example")) {
    try {
      const response = await fetchWithTimeout(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body }, AI_TIMEOUTS.examples);
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        lastError = data?.error || `AI 服务返回 ${response.status}`;
        continue;
      }
      const example = validateBlockExample(data.example, currentEnglishWord);
      if (example?.meta && isAuthenticAiMeta(example.meta)) {
        cacheBlockExample(currentEnglishWord.id, example);
        console.info("[AI_META]", example.meta);
        return example;
      }
    } catch (error) {
      lastError = error?.stage ? { error: error.message, stage: error.stage } : error?.message || "AI 服务连接失败";
    }
  }
  console.info("English word block example failed:", lastError || "unavailable");
  return null;
}

function validateBlockExample(example, word) {
  if (!example?.sentence || !example?.translationZh) return null;
  const sentenceTokens = tokenizeEnglishSentence(example.sentence);
  const target = normalizeEnglishWord(word.normalized);
  if (!sentenceTokens.includes(target)) return null;
  if (sentenceTokens.length > 14) return null;
  const blocks = Array.isArray(example.blocks) && example.blocks.length ? example.blocks : [example.sentence];
  const combined = blocks.join(" ").replace(/\s+/g, " ").replace(/\s+([.!?])/g, "$1").trim();
  const normalizedCombined = combined.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  const normalizedSentence = String(example.sentence).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  if (normalizedCombined !== normalizedSentence && blocks.length > 1) return null;
  return {
    sentence: example.sentence,
    translationZh: example.translationZh,
    blocks,
    targetWord: example.targetWord || word.text,
    pattern: example.pattern || "",
    grammarPointZh: example.grammarPointZh || "",
    newWords: Array.isArray(example.newWords) ? example.newWords.slice(0, 3) : [],
    createdAt: example.createdAt || Date.now(),
    meta: example.meta || null
  };
}

function getBlockExampleCache() {
  try {
    return JSON.parse(localStorage.getItem(ENGLISH_BLOCK_EXAMPLE_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveBlockExampleCache(cache) {
  localStorage.setItem(ENGLISH_BLOCK_EXAMPLE_CACHE_KEY, JSON.stringify(cache));
}

function getBlockCacheKey(wordId) {
  return `block-example:${wordId}:${ENGLISH_BLOCK_EXAMPLE_LEVEL}:${ENGLISH_WORD_LIBRARY_VERSION}:${ENGLISH_BLOCK_EXAMPLE_PROMPT_VERSION}`;
}

function getCachedBlockExamples(wordId) {
  return getBlockExampleCache()[getBlockCacheKey(wordId)]?.examples || [];
}

function getCachedBlockExample(wordId, forceNew) {
  const examples = getCachedBlockExamples(wordId);
  if (!examples.length || forceNew) return null;
  const latest = examples[examples.length - 1];
  if (!isAuthenticAiMeta(latest?.meta)) return null;
  return { ...latest, meta: { ...latest.meta, fromCache: true } };
}

function cacheBlockExample(wordId, example) {
  const cache = getBlockExampleCache();
  const key = getBlockCacheKey(wordId);
  const existing = cache[key]?.examples || [];
  const next = [...existing.filter((item) => item.sentence !== example.sentence), example].slice(-5);
  cache[key] = { word: wordId, level: ENGLISH_BLOCK_EXAMPLE_LEVEL, examples: next };
  saveBlockExampleCache(cache);
}

function incrementEnglishExampleUsage(key) {
  englishProgress.exampleUsage ||= {};
  englishProgress.exampleUsage[key] = (englishProgress.exampleUsage[key] || 0) + 1;
  saveEnglishProgress();
}

function buildEnglishWordLibrary() {
  const sourceGroups = [
    { source: "story_zoo", words: STORY_ZOO_WORDS, baseWeight: 4 },
    { source: "story_kindergarten", words: STORY_KINDERGARTEN_WORDS, baseWeight: 4 },
    { source: "story_primary_school", words: STORY_PRIMARY_SCHOOL_WORDS, baseWeight: 5 },
    { source: "prior_lessons", words: PRIOR_LESSON_WORDS, baseWeight: 3 },
    ...getDynamicEnglishSourceGroups(),
    ...getBeijingTextbookSourceGroups(),
    { source: "grade_one_core", words: GRADE_ONE_CORE_WORDS, baseWeight: 1 }
  ];
  const byWord = new Map();
  sourceGroups.forEach((group) => {
    group.words.forEach((raw) => {
      const rawText = typeof raw === "string" ? raw : raw.text || raw.id;
      const normalized = normalizeEnglishWord(rawText);
      if (!normalized) return;
      const dynamicMeaning = typeof raw === "string" ? "" : raw.meaningZh || raw.chinese || "";
      const existing = byWord.get(normalized);
      const next = existing || {
        id: normalized,
        normalized,
        text: typeof raw === "string" ? DISPLAY_OVERRIDES[normalized] || normalized : raw.text || DISPLAY_OVERRIDES[normalized] || normalized,
        sources: [],
        exampleIds: getExampleIdsByWord(normalized),
        chinese: dynamicMeaning || getEnglishMeaning(normalized),
        baseWeight: group.baseWeight
      };
      if (!next.sources.includes(group.source)) next.sources.push(group.source);
      next.baseWeight = Math.max(next.baseWeight, group.baseWeight);
      next.chinese = dynamicMeaning || next.chinese || getEnglishMeaning(normalized);
      if (typeof raw !== "string") {
        next.packId = raw.packId || next.packId || "";
        next.packDate = raw.packDate || next.packDate || "";
        next.sourceSentence = raw.sourceSentence || raw.anchorSentence || next.sourceSentence || "";
        next.translationZh = raw.translationZh || next.translationZh || "";
      }
      byWord.set(normalized, next);
    });
  });
  return [...byWord.values()].map((word) => ({
    ...word,
    exampleIds: getExampleIdsByWord(word.normalized),
    learningStatus: getEnglishLearningStatus(word.sources)
  })).sort((a, b) => {
    const score = getEnglishSourcePriority(b) - getEnglishSourcePriority(a);
    return score || a.normalized.localeCompare(b.normalized);
  });
}

function getDynamicEnglishSourceGroups() {
  const groups = {};
  getDynamicEnglishWordsFromPacks().forEach((item) => {
    const source = item.source || "daily_pack";
    groups[source] ||= { source, words: [], baseWeight: 6 };
    groups[source].words.push(item);
  });
  return Object.values(groups);
}

function getBeijingTextbookSourceGroups() {
  const units = BEIJING_GRADE1_SEMESTER_1_LIBRARY.units || [];
  const allWords = unique([
    ...BEIJING_GRADE1_SEMESTER_1_WORDS,
    ...units.flatMap((unit) => unit.words || [])
  ]).filter(Boolean);
  const groups = [];
  if (allWords.length) {
    groups.push({ source: "beijing_grade1_semester_1", words: allWords, baseWeight: 2 });
  }
  units.forEach((unit) => {
    const words = unique(unit.words || []).filter(Boolean);
    if (!words.length) return;
    groups.push({
      source: unit.id || `beijing_grade1_semester_1_unit_${unit.unitNumber}`,
      words,
      baseWeight: unit.learningStatus === "locked" ? 0.4 : 2
    });
  });
  return groups;
}

function getEnglishLearningStatus(sources) {
  if (sources.some((source) => source.startsWith("daily_pack:"))) return "learning";
  if (sources.includes("story_primary_school") || sources.includes("prior_lessons")) return "learning";
  if (sources.includes("story_zoo") || sources.includes("story_kindergarten")) return "learned";
  if (sources.some((source) => source.startsWith("beijing_grade1_semester_1"))) return "preview";
  return "preview";
}

function getEnglishMeaning(word) {
  return ENGLISH_MEANINGS[normalizeEnglishWord(word)] || "一年级英语认读词";
}

function getEnglishSourcePriority(word) {
  let score = 0;
  if (word.sources.some((source) => source.startsWith("daily_pack:"))) score += 12;
  if (word.sources.includes("story_primary_school")) score += 10;
  if (word.sources.includes("story_kindergarten")) score += 8;
  if (word.sources.includes("story_zoo")) score += 8;
  if (word.sources.includes("prior_lessons")) score += 7;
  if (word.sources.includes("beijing_grade1_semester_1")) score += 5;
  if (word.sources.some((source) => source.startsWith("beijing_grade1_semester_1_unit_"))) score += 4;
  if (word.sources.includes("grade_one_core")) score += 2;
  return score;
}

function loadEnglishProgress() {
  const fallback = makeEnglishProgress();
  try {
    const raw = localStorage.getItem(ENGLISH_PROGRESS_KEY) || localStorage.getItem(ENGLISH_PROGRESS_V1_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const migrated = {
      ...fallback,
      ...parsed,
      version: 2,
      currentLibraryVersion: ENGLISH_WORD_LIBRARY_VERSION,
      words: parsed.words || parsed.items || {},
      recentlyShownIds: Array.isArray(parsed.recentlyShownIds) ? parsed.recentlyShownIds.slice(0, 5) : [],
      dailyStats: parsed.dailyStats || {},
      settings: { ...fallback.settings, ...(parsed.settings || {}) }
    };
    if ((parsed.currentLibraryVersion || 0) < 4 && migrated.settings.scope === "learned_learning") migrated.settings.scope = "all";
    return migrated;
  } catch {
    return fallback;
  }
}

function makeEnglishProgress() {
  return {
    version: 2,
    updatedAt: Date.now(),
    currentLibraryVersion: ENGLISH_WORD_LIBRARY_VERSION,
    words: {},
    recentlyShownIds: [],
    dailyStats: {},
    settings: {
      showChineseButton: true,
      voiceLang: "en-US",
      scope: "all"
    }
  };
}

function saveEnglishProgress() {
  englishProgress.updatedAt = Date.now();
  localStorage.setItem(ENGLISH_PROGRESS_KEY, JSON.stringify(englishProgress));
}

function refreshEnglishScopeOptions() {
  const select = $("#englishScopeSelect");
  if (!select) return;
  const current = englishProgress.settings?.scope || "all";
  const options = getEnglishScopeOptions();
  select.innerHTML = options.map((option) => `
    <option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>
  `).join("");
  select.value = options.some((option) => option.id === current) ? current : "all";
  englishProgress.settings.scope = select.value;
}

function getEnglishScopeOptions() {
  return [
    { id: "today_pack", label: "今日学习包 / Today's Pack" },
    { id: "learned_learning", label: "已学 + 正在学 / Learned + Learning" },
    { id: "all", label: "全部词汇 / All Words" },
    { id: "stories_all", label: "三篇文章 / Stories 1-3" },
    { id: "story_zoo", label: "Story 1 · ZOO" },
    { id: "story_kindergarten", label: "Story 2 · Kindergarten" },
    { id: "story_primary_school", label: "Story 3 · Hello, School!" },
    { id: "beijing_grade1_semester_1", label: "北京版一年级上册 / Beijing Grade 1A" },
    ...getTextbookUnitFilters(),
    { id: "grade_one_core", label: "一年级通用扩展 / Grade Core" },
    { id: "learned", label: "已经学过 / Learned" },
    { id: "learning", label: "正在学习 / Learning" },
    { id: "preview", label: "教材预习 / Preview" },
    { id: "mastered", label: "已经掌握 / Mastered" },
    { id: "review", label: "重点复习 / Review" }
  ];
}

function getTextbookUnitFilters() {
  return (BEIJING_GRADE1_SEMESTER_1_LIBRARY.units || []).map((unit) => ({
    id: unit.id || `beijing_grade1_semester_1_unit_${unit.unitNumber}`,
    label: unit.title ? `Unit ${unit.unitNumber} · ${unit.title}` : `Unit ${unit.unitNumber}`
  }));
}

function getEnglishScopeItems() {
  const scope = englishProgress.settings?.scope || "all";
  if (scope === "all" || scope === "stories_core") return englishLibrary;
  if (scope === "today_pack") {
    const ids = getTodayPackWordIds();
    return englishLibrary.filter((word) => ids.has(word.id));
  }
  if (scope === "learned_learning") return englishLibrary.filter((word) => ["learned", "learning"].includes(word.learningStatus));
  if (scope === "stories_only" || scope === "stories_all") return englishLibrary.filter((word) => word.sources.some((source) => source.startsWith("story_")));
  if (scope === "learned" || scope === "learning" || scope === "preview") return englishLibrary.filter((word) => word.learningStatus === scope);
  if (scope === "mastered") return englishLibrary.filter((word) => isStablyMastered(normalizeProgress(englishProgress.words[word.id], word.id)));
  if (scope === "review") return englishLibrary.filter((word) => needsEnglishReview(normalizeProgress(englishProgress.words[word.id], word.id)));
  if (scope === "grade_one_core") return englishLibrary.filter((word) => word.sources.includes("grade_one_core"));
  if (scope === "beijing_grade1_semester_1") return englishLibrary.filter((word) => word.sources.some((source) => source.startsWith("beijing_grade1_semester_1")));
  if (scope.startsWith("beijing_grade1_semester_1_unit_")) return englishLibrary.filter((word) => word.sources.includes(scope));
  if (scope.startsWith("story_")) return englishLibrary.filter((word) => word.sources.includes(scope));
  return englishLibrary;
}

function getEnglishWordWeight(word, progress, recentlyShownIds) {
  const storySourceCount = word.sources.filter((source) => ["story_zoo", "story_kindergarten", "story_primary_school"].includes(source)).length;
  const sourceWeight = 1
    + storySourceCount * 2
    + (word.sources.includes("story_primary_school") ? 1 : 0)
    + (word.sources.includes("prior_lessons") ? 1.5 : 0)
    + (word.sources.includes("beijing_grade1_semester_1") ? 1.2 : 0)
    + (word.sources.includes("grade_one_core") ? 0.5 : 0);
  const unseenBoost = progress.seenCount === 0 ? 3 : 1;
  const masteryFactor = Math.max(0.08, Math.pow(0.55, progress.masteryCount));
  const difficultyFactor = 1 + progress.unknownCount * 0.9 + progress.unsureCount * 0.35;
  const recentMistakeBoost = progress.lastResult === "unknown" ? 1.7 : progress.lastResult === "unsure" ? 1.25 : 1;
  const recentPenalty = recentlyShownIds.includes(word.id) ? 0.03 : 1;
  return Math.max(0.001, word.baseWeight * sourceWeight * unseenBoost * masteryFactor * difficultyFactor * recentMistakeBoost * recentPenalty);
}

function renderEnglishRecognition() {
  const grid = $("#englishWordGrid");
  if (!grid) return;
  const sorted = getWeightedEnglishScopeItems();
  const pageSize = getEnglishPageSize();
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  if (englishPage >= totalPages) englishPage = 0;
  englishVisibleWords = sorted.slice(englishPage * pageSize, englishPage * pageSize + pageSize);
  $("#englishSetTitle").textContent = `第 ${englishPage + 1} 组`;
  $("#englishSetMeta").textContent = `当前 ${sorted.length} 词 · 总词库 ${englishLibrary.length} 词 · 每组 ${pageSize} 个`;
  if (!englishVisibleWords.length) {
    grid.innerHTML = `<article class="english-word-card empty-card">当前筛选范围没有已导入单词</article>`;
  } else {
    grid.innerHTML = englishVisibleWords.map((word, index) => renderEnglishWordCard(word, index)).join("");
  }
  renderEnglishStats();
  renderEnglishSettings();
}

function getWeightedEnglishScopeItems() {
  return getEnglishScopeItems().map((word) => ({
    word,
    weight: getEnglishWordWeight(word, normalizeProgress(englishProgress.words[word.id], word.id), englishProgress.recentlyShownIds || [])
  })).sort((a, b) => b.weight - a.weight || a.word.normalized.localeCompare(b.word.normalized)).map((entry) => entry.word);
}

function getEnglishPageSize() {
  return window.matchMedia("(max-width: 620px)").matches ? 6 : 9;
}

function getEnglishTotalPages() {
  return Math.max(1, Math.ceil(getWeightedEnglishScopeItems().length / getEnglishPageSize()));
}

function renderEnglishWordCard(word, index = 0) {
  const progress = normalizeProgress(englishProgress.words[word.id], word.id);
  const phoneticVisible = Boolean(englishPhoneticVisible[word.id]);
  const meaningVisible = Boolean(englishProgress.meaningVisible?.[word.id]);
  return `
    <article class="english-word-card ${selectedEnglishCardId === word.id ? "selected" : ""}" data-english-card-index="${index}" data-english-card-id="${escapeHtml(word.id)}">
      <div class="english-card-source">${escapeHtml(getEnglishSourceLabel(word))}</div>
      <div class="english-word-area">
        <button class="english-card-word" data-english-word="${escapeHtml(word.id)}" type="button">${escapeHtml(word.text)}</button>
        <button class="english-phonetic" data-english-phonetic="${escapeHtml(word.id)}" ${phoneticVisible ? "" : "hidden"} type="button">${escapeHtml(getEnglishPhonetic(word))}</button>
        <p class="english-card-meaning" data-english-meaning-for="${escapeHtml(word.id)}" ${meaningVisible ? "" : "hidden"}>${escapeHtml(word.chinese || getEnglishMeaning(word.normalized))}</p>
      </div>
      <div class="mini-actions english-result-actions">
        <button class="button warning" data-english-char="${escapeHtml(word.id)}" data-english-result="unknown" type="button">不认识<br><span>Unknown</span></button>
        <button class="button secondary" data-english-char="${escapeHtml(word.id)}" data-english-result="unsure" type="button">有点熟<br><span>Unsure</span></button>
        <button class="button success" data-english-char="${escapeHtml(word.id)}" data-english-result="mastered" type="button">已掌握<br><span>${progress.masteryCount}</span></button>
        <button class="button ghost" data-english-char="${escapeHtml(word.id)}" data-english-result="skipped" type="button">跳过<br><span>Skip</span></button>
      </div>
      <div class="mini-actions english-helper-actions">
        <button class="button ghost" data-english-story="${escapeHtml(word.id)}" type="button">原文例句<br><span>Story</span></button>
        <button class="button ghost" data-english-block="${escapeHtml(word.id)}" type="button">积木例句<br><span>Block</span></button>
        <button class="button ghost" data-english-meaning="${escapeHtml(word.id)}" type="button">查看中文<br><span>Chinese</span></button>
      </div>
    </article>
  `;
}

function toggleEnglishPhonetic(word, cardIndex = -1) {
  const willShow = !englishPhoneticVisible[word.id];
  englishPhoneticVisible[word.id] = willShow;
  if (willShow) speakEnglishText(word.text);
  renderEnglishCardAtIndex(cardIndex);
}

function getEnglishPhonetic(word) {
  const entry = ENGLISH_PRONUNCIATIONS[word.normalized];
  if (entry) {
    return (englishProgress.settings?.voiceLang || "en-US") === "en-GB" ? entry.ipaUK || entry.ipaUS : entry.ipaUS || entry.ipaUK;
  }
  return makeReadablePhoneticFallback(word.normalized);
}

function makeReadablePhoneticFallback(word) {
  const normalized = normalizeEnglishWord(word);
  return `/${normalized}/`;
}

function toggleCardMeaning(wordId, cardIndex = -1) {
  englishProgress.meaningVisible ||= {};
  englishProgress.meaningVisible[wordId] = !englishProgress.meaningVisible[wordId];
  saveEnglishProgress();
  renderEnglishCardAtIndex(cardIndex);
}

function recordEnglishResult(word, result, cardIndex = -1) {
  if (!word || englishActionLocked) return;
  englishActionLocked = true;
  updateRecognitionProgress(englishProgress.words, word.id, result);
  englishProgress.recentlyShownIds = pushRecent(englishProgress.recentlyShownIds, word.id);
  updateEnglishDailyStats(result);
  saveEnglishProgress();
  replaceSingleEnglishCard(cardIndex, word);
  window.setTimeout(() => {
    englishActionLocked = false;
  }, 80);
}

function replaceSingleEnglishCard(cardIndex, oldWord) {
  const index = Number(cardIndex);
  if (!Number.isInteger(index) || index < 0 || index >= englishVisibleWords.length) {
    renderEnglishRecognition();
    return;
  }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const excludeIds = new Set(englishVisibleWords.map((item) => item.id));
  excludeIds.add(oldWord.id);
  (englishProgress.recentlyShownIds || []).forEach((id) => excludeIds.add(id));
  const replacement = selectReplacementEnglishWord(excludeIds) || oldWord;
  clearEnglishCardTransientState(oldWord.id);
  clearEnglishCardTransientState(replacement.id);
  englishVisibleWords[index] = replacement;
  if (selectedEnglishCardId === oldWord.id || currentEnglishWord?.id === oldWord.id) {
    resetEnglishExamplePanel();
    selectedEnglishCardId = "";
    currentEnglishWord = null;
  }
  renderEnglishCardAtIndex(index);
  renderEnglishStats();
  renderEnglishSettings();
}

function selectReplacementEnglishWord(excludeIds) {
  const candidates = getEnglishScopeItems().filter((word) => !excludeIds.has(word.id));
  if (!candidates.length) return null;
  return weightedRandomSelect(
    candidates,
    englishProgress.words,
    englishProgress.recentlyShownIds || [],
    (word, progress, recentlyShownIds) => getEnglishWordWeight(word, progress, recentlyShownIds)
  );
}

function clearEnglishCardTransientState(wordId) {
  delete englishPhoneticVisible[wordId];
  if (englishProgress.meaningVisible?.[wordId]) {
    delete englishProgress.meaningVisible[wordId];
    saveEnglishProgress();
  }
}

function renderEnglishCardAtIndex(index) {
  const cardIndex = Number(index);
  if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= englishVisibleWords.length) return;
  const grid = $("#englishWordGrid");
  const existing = grid?.querySelector(`[data-english-card-index="${cardIndex}"]`);
  if (!existing) return;
  existing.outerHTML = renderEnglishWordCard(englishVisibleWords[cardIndex], cardIndex);
}

function updateEnglishSelectedCard() {
  $$("#englishWordGrid .english-word-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.englishCardId === selectedEnglishCardId);
  });
}

function updateEnglishDailyStats(result) {
  const key = todayKey();
  englishProgress.dailyStats[key] ||= { practicedCount: 0, masteredCount: 0, unsureCount: 0, unknownCount: 0, skippedCount: 0 };
  if (result !== "skipped") englishProgress.dailyStats[key].practicedCount += 1;
  if (result === "mastered") englishProgress.dailyStats[key].masteredCount += 1;
  if (result === "unsure") englishProgress.dailyStats[key].unsureCount += 1;
  if (result === "unknown") englishProgress.dailyStats[key].unknownCount += 1;
  if (result === "skipped") englishProgress.dailyStats[key].skippedCount += 1;
}

function toggleEnglishMeaning() {
  $("#englishMeaning").hidden = !$("#englishMeaning").hidden;
}

function speakCurrentEnglishWord() {
  if (!currentEnglishWord || !("speechSynthesis" in window)) return;
  speakEnglishText(currentEnglishWord.text);
}

function speakEnglishText(text, countAsExample = false) {
  if (!text || !("speechSynthesis" in window)) return;
  if (countAsExample) incrementEnglishExampleUsage("exampleSpeechCount");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = englishProgress.settings?.voiceLang || "en-US";
  utterance.rate = 0.86;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find((voice) => voice.lang === utterance.lang) || voices.find((voice) => voice.lang?.startsWith("en"));
  if (preferred) utterance.voice = preferred;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function renderEnglishStats() {
  const scoped = getEnglishScopeItems();
  const progressValues = Object.values(englishProgress.words || {});
  const scopedIds = new Set(scoped.map((word) => word.id));
  const scopedProgress = progressValues.filter((progress) => scopedIds.has(progress.itemId));
  const today = englishProgress.dailyStats?.[todayKey()] || {};
  const seen = scopedProgress.filter((progress) => progress.seenCount > 0).length;
  const stable = scopedProgress.filter(isStablyMastered).length;
  const review = scopedProgress.filter(needsEnglishReview).length;
  $("#englishStats").innerHTML = [
    ["今日已练", today.practicedCount || 0, "Today"],
    ["词库总数", scoped.length, "Total"],
    ["已见过", seen, "Seen"],
    ["稳定掌握", stable, "Stable"],
    ["重点复习", review, "Review"]
  ].map(([label, value, en]) => `<span><strong>${value}</strong>${label}<small>${en}</small></span>`).join("");
}

function isStablyMastered(progress) {
  const recent = (progress.recentResults || []).slice(-3);
  return progress.masteryCount >= 3 && recent.length >= 2 && recent.every((result) => result === "mastered") && progress.lastResult !== "unknown";
}

function needsEnglishReview(progress) {
  return progress.unknownCount > 0 || progress.unsureCount >= 2 || progress.lastResult === "unknown";
}

function renderEnglishSettings() {
  if (!$("#englishSettingsPanel") || $("#englishSettingsPanel").hidden) return;
  refreshEnglishScopeOptions();
  $("#englishScopeSelect").value = englishProgress.settings?.scope || "learned_learning";
  $("#englishVoiceSelect").value = englishProgress.settings?.voiceLang || "en-US";
  $("#englishShowChineseToggle").checked = englishProgress.settings?.showChineseButton !== false;
  renderEnglishTextbookStatus();
  const recentUnknown = getEnglishWordsByProgress((progress) => progress.lastResult === "unknown").slice(0, 10);
  const recentUnsure = getEnglishWordsByProgress((progress) => progress.lastResult === "unsure").slice(0, 10);
  const review = getEnglishWordsByProgress(needsEnglishReview).slice(0, 16);
  $("#englishReviewLists").innerHTML = `
    ${renderEnglishWordList("重点复习 / Review", review)}
    ${renderEnglishWordList("最近错误 / Unknown", recentUnknown)}
    ${renderEnglishWordList("最近模糊 / Unsure", recentUnsure)}
  `;
}

function renderEnglishTextbookStatus() {
  const target = $("#englishTextbookStatus");
  if (!target) return;
  const stats = getBeijingTextbookStats();
  target.innerHTML = `
    <strong>北京版教材数据：${stats.coverageStatus === "complete" ? "全册已完成" : "已导入部分单元"}</strong>
    <span>已导入 ${stats.importedUnits.length} 个单元 · 原始词形 ${stats.rawWordCount} · 去重词形 ${stats.uniqueWordCount} · 与当前词库重合 ${stats.overlapWithBaseCount}</span>
  `;
}

function getBeijingTextbookStats() {
  const rawWords = [
    ...BEIJING_GRADE1_SEMESTER_1_WORDS,
    ...(BEIJING_GRADE1_SEMESTER_1_LIBRARY.units || []).flatMap((unit) => unit.words || [])
  ].map(normalizeEnglishWord).filter(Boolean);
  const uniqueWords = [...new Set(rawWords)];
  const nonTextbookWords = new Set(
    [
      ...STORY_ZOO_WORDS,
      ...STORY_KINDERGARTEN_WORDS,
      ...STORY_PRIMARY_SCHOOL_WORDS,
      ...PRIOR_LESSON_WORDS,
      ...GRADE_ONE_CORE_WORDS
    ].map(normalizeEnglishWord)
  );
  return {
    coverageStatus: BEIJING_GRADE1_SEMESTER_1_LIBRARY.coverageStatus,
    importedUnits: BEIJING_GRADE1_SEMESTER_1_LIBRARY.importedUnits || [],
    missingUnits: BEIJING_GRADE1_SEMESTER_1_LIBRARY.missingUnits || [],
    rawWordCount: rawWords.length,
    uniqueWordCount: uniqueWords.length,
    overlapWithBaseCount: uniqueWords.filter((word) => nonTextbookWords.has(word)).length,
    sentencePatternCount: (BEIJING_GRADE1_SEMESTER_1_SENTENCE_LIBRARY.units || []).reduce((sum, unit) => sum + (unit.patterns?.length || 0), 0)
  };
}

function getEnglishWordsByProgress(predicate) {
  const wordsById = new Map(englishLibrary.map((word) => [word.id, word]));
  return Object.values(englishProgress.words || {})
    .map((progress) => ({ progress, word: wordsById.get(progress.itemId) }))
    .filter((entry) => entry.word && predicate(entry.progress))
    .sort((a, b) => (b.progress.lastSeenAt || 0) - (a.progress.lastSeenAt || 0))
    .map((entry) => entry.word);
}

function renderEnglishWordList(title, words) {
  return `
    <div class="english-list">
      <strong>${title}</strong>
      <div class="review-targets">
        ${words.length ? words.map((word) => `<span title="${escapeHtml(word.chinese)}">${escapeHtml(word.text)}</span>`).join("") : "<span>暂无</span>"}
      </div>
    </div>
  `;
}

function resetEnglishProgress() {
  if (!confirm("确认重置英语认读记录？这个操作不会影响中文记录。")) return;
  englishProgress = makeEnglishProgress();
  currentEnglishWord = null;
  saveEnglishProgress();
  renderEnglishRecognition();
}

function getEnglishSourceLabel(word) {
  const labels = {
    daily_pack: "今日学习包",
    story_primary_school: "Hello, School!",
    story_kindergarten: "Kindergarten",
    story_zoo: "ZOO",
    prior_lessons: "已学辨析",
    beijing_grade1_semester_1: "北京版一年级上册",
    grade_one_core: "一年级扩展"
  };
  return word.sources.map((source) => {
    if (source.startsWith("daily_pack:")) return "今日学习包";
    return labels[source] || getTextbookSourceLabel(source) || source;
  }).join(" · ");
}

function getTextbookSourceLabel(source) {
  const unit = (BEIJING_GRADE1_SEMESTER_1_LIBRARY.units || [])
    .find((item) => (item.id || `beijing_grade1_semester_1_unit_${item.unitNumber}`) === source);
  if (!unit) return "";
  return unit.title ? `Unit ${unit.unitNumber} · ${unit.title}` : `Unit ${unit.unitNumber}`;
}

function bindDictionarySearch() {
  $("#dictionarySearch").addEventListener("input", () => {
    clearTimeout(dictionarySearchTimer);
    dictionarySearchTimer = setTimeout(renderDictionary, 220);
  });
}

function bindSettings() {
  $("#generateReportBtn").addEventListener("click", () => renderCurrentFeedbackSnapshot());
}

async function loadBuiltinLearningPack() {
  const beforeSelectedPackId = state.selectedLearningPackId || "";
  const beforeLatestPackId = state.latestLearningPackId || "";
  const beforeSelectionSource = state.learningPackSelectionSource || inferLearningPackSelectionSource(state);
  const selectionSnapshot = { beforeSelectedPackId, beforeLatestPackId, beforeSelectionSource };
  const isFileUrl = /^file:/i.test(location.protocol || location.href || "");
  let fetchError = null;
  if (!isFileUrl && typeof fetch === "function") {
    try {
      const source = await fetchBuiltinLearningPackSet();
      importBuiltinLearningPackSet(source.manifest, source.packs, { ...selectionSnapshot, source: "fetch" });
      return;
    } catch (error) {
      fetchError = error;
    }
  }
  const bundle = getBuiltinLearningPackBundle();
  if (bundle) {
    try {
      importBuiltinLearningPackSet(bundle.manifest, bundle.packs, {
        ...selectionSnapshot,
        source: isFileUrl ? "file_bundle" : "bundle_fallback",
        fallbackReason: fetchError?.message || ""
      });
      return;
    } catch (error) {
      const message = fetchError
        ? `网络读取失败：${fetchError.message}；内置bundle读取失败：${error.message}`
        : error.message;
      recordBuiltinLearningPackLoadFailure("bundle_error", message);
      renderCoursePackLoadStatus();
      return;
    }
  }
  const message = fetchError
    ? `网络读取失败：${fetchError.message}；页面内置bundle不可用。`
    : "页面内置bundle不可用。";
  recordBuiltinLearningPackLoadFailure(isFileUrl ? "file_bundle_unavailable" : "load_error", message);
  renderCoursePackLoadStatus();
}

async function fetchBuiltinLearningPackSet() {
  const manifestResponse = await fetch(withBuiltinCacheBust(BUILTIN_LEARNING_PACK_MANIFEST), { cache: "no-store" });
  if (!manifestResponse.ok) throw new Error(`manifest ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  const entries = normalizeBuiltinManifestEntries(manifest);
  if (!entries.length) throw new Error("manifest 没有可用课包");
  const packs = {};
  for (const entry of entries) {
    const packUrl = new URL(entry.path, new URL(BUILTIN_LEARNING_PACK_MANIFEST, location.href)).toString();
    const packResponse = await fetch(withBuiltinCacheBust(packUrl), { cache: "no-store" });
    if (!packResponse.ok) throw new Error(`pack ${entry.packId || entry.path} ${packResponse.status}`);
    packs[entry.packId || entry.path] = await packResponse.text();
  }
  return { manifest, packs };
}

function getBuiltinLearningPackBundle() {
  const root = typeof globalThis !== "undefined" ? globalThis : window;
  const bundle = root?.HELEN_BUILTIN_LEARNING_PACKS || root?.window?.HELEN_BUILTIN_LEARNING_PACKS;
  if (!bundle || typeof bundle !== "object") return null;
  if (!bundle.manifest || !bundle.packs) return null;
  return bundle;
}

function importBuiltinLearningPackSet(manifest, packSources, options = {}) {
  const beforeSelectedPackId = options.beforeSelectedPackId || "";
  const beforeLatestPackId = options.beforeLatestPackId || "";
  const beforeSelectionSource = options.beforeSelectionSource || inferLearningPackSelectionSource(state);
  const entries = normalizeBuiltinManifestEntries(manifest);
  if (!entries.length) throw new Error("manifest 没有可用课包");
  const loadedPacks = [];
  for (const entry of entries) {
    const rawPack = getBuiltinPackSource(packSources, entry);
    if (!rawPack) throw new Error(`bundle 缺少课包：${entry.packId || entry.path}`);
    const parsed = parseLearningPackInput(typeof rawPack === "string" ? rawPack : JSON.stringify(rawPack));
    const preview = buildLearningPackPreview(parsed);
    if (!preview.valid) throw new Error(preview.errors?.join("；") || `内置课包校验失败：${entry.packId || entry.path}`);
    importLearningPack(parsed, preview, { select: false, markLatest: false, publishedAt: entry.publishedAt || "", builtinLatest: true });
    loadedPacks.push(parsed);
  }
  hideWithdrawnBuiltinArchiveEntries();
  const latestPackId = manifest.latestPackId || entries.find((entry) => entry.path === manifest.latest)?.packId || loadedPacks[0]?.packId || "";
  if (!latestPackId || !state.learningPacks?.[latestPackId]) throw new Error(`latest 不存在：${latestPackId || "空"}`);
  state.latestLearningPackId = latestPackId;
  applyBuiltinPackSelectionPolicy({
    latestPackId,
    beforeSelectedPackId,
    beforeLatestPackId,
    beforeSelectionSource
  });
  const selectedPack = getSelectedLearningPack();
  if (selectedPack) {
    initializeCourseProgress(selectedPack);
    state.lastLearningPackRaw = JSON.stringify(selectedPack, null, 2);
    state.latestLearning = focusFromLearningPack(selectedPack);
    state.focusTitleOverride = selectedPack.title || "今日学习包";
  }
  state.builtinLearningPackLoad = {
    ok: true,
    stage: options.source || "complete",
    latestPackId,
    selectedPackId: state.selectedLearningPackId || "",
    loadedPackIds: loadedPacks.map((pack) => pack.packId),
    loadedAt: new Date().toISOString()
  };
  if (options.fallbackReason) state.builtinLearningPackLoad.fallbackReason = safePlainText(options.fallbackReason, 220);
  saveState();
  renderTodayDashboard();
  renderPlanetOverview();
  renderPlanetPages();
  renderChineseLesson();
  renderEnglishLesson();
  renderArtLesson();
  renderCoursePackLoadStatus();
  if ($("#packStatus")) $("#packStatus").textContent = `今日课程已准备好：${getSelectedLearningPack()?.date || ""} · ${state.selectedLearningPackId || ""}`;
  if ($("#todayDashboardPanel")) $("#todayDashboardPanel").hidden = false;
}

function hideWithdrawnBuiltinArchiveEntries() {
  if (!state.learningPackArchive?.entries?.length || !WITHDRAWN_BUILTIN_PACK_IDS.size) return;
  state.learningPackArchive.entries = state.learningPackArchive.entries.filter((entry) => !WITHDRAWN_BUILTIN_PACK_IDS.has(entry.packId));
  state.learningPackArchive.byDate = state.learningPackArchive.entries.reduce((map, item) => {
    if (!item.date || !item.packId) return map;
    map[item.date] ||= [];
    if (!map[item.date].includes(item.packId)) map[item.date].push(item.packId);
    return map;
  }, {});
}

function getBuiltinPackSource(packSources, entry) {
  if (!packSources) return null;
  if (Array.isArray(packSources)) {
    return packSources.find((pack) => pack?.packId === entry.packId) || null;
  }
  const path = entry.path || "";
  const fileName = path.split("/").pop();
  return packSources[entry.packId] ||
    packSources[path] ||
    packSources[`./${path.replace(/^\.\//, "")}`] ||
    packSources[fileName] ||
    null;
}

function withBuiltinCacheBust(url) {
  const parsed = new URL(url, location.href || "http://localhost/");
  parsed.searchParams.set("v", APP_METADATA.version);
  parsed.searchParams.set("build", APP_METADATA.buildId);
  return parsed.toString();
}

function normalizeBuiltinManifestEntries(manifest) {
  const entries = Array.isArray(manifest?.packs) ? manifest.packs : [];
  const latestEntry = entries.find((item) => item.packId === manifest.latestPackId) || (manifest.latest ? { packId: manifest.latestPackId || "", path: manifest.latest } : null);
  const uniqueEntries = [];
  [latestEntry, ...entries].filter(Boolean).forEach((entry) => {
    if (!entry.path || uniqueEntries.some((item) => (item.packId && item.packId === entry.packId) || item.path === entry.path)) return;
    uniqueEntries.push(entry);
  });
  return uniqueEntries;
}

function applyBuiltinPackSelectionPolicy({ latestPackId, beforeSelectedPackId, beforeLatestPackId, beforeSelectionSource }) {
  const routeDate = parseRouteHash().date;
  if (routeDate) {
    const routePackId = getPackIdForDate(routeDate);
    if (routePackId) {
      state.selectedLearningPackId = routePackId;
      state.learningPackSelectionSource = "manual";
      return;
    }
  }
  const selectedExists = beforeSelectedPackId && state.learningPacks?.[beforeSelectedPackId];
  const selectedPack = selectedExists ? state.learningPacks[beforeSelectedPackId].data : null;
  const latestPack = state.learningPacks?.[latestPackId]?.data;
  const wasAutomatic = !beforeSelectedPackId ||
    beforeSelectionSource !== "manual" ||
    beforeSelectedPackId === beforeLatestPackId ||
    beforeSelectedPackId === state.lastAutoSelectedBuiltinPackId;
  if (!selectedExists || wasAutomatic) {
    state.selectedLearningPackId = latestPackId;
    state.learningPackSelectionSource = "auto";
    state.lastAutoSelectedBuiltinPackId = latestPackId;
    return;
  }
  if (shouldAutoSelectBuiltinRevision(selectedPack, latestPack)) {
    state.selectedLearningPackId = latestPackId;
    state.learningPackSelectionSource = "auto";
    state.lastAutoSelectedBuiltinPackId = latestPackId;
    return;
  }
  const refreshedSameDatePackId = selectedPack?.date ? getPackIdForDate(selectedPack.date) : beforeSelectedPackId;
  state.selectedLearningPackId = refreshedSameDatePackId || beforeSelectedPackId;
  state.learningPackSelectionSource = "manual";
}

function recordBuiltinLearningPackLoadFailure(stage, message) {
  const pack = getSelectedLearningPack();
  state.builtinLearningPackLoad = {
    ok: false,
    stage,
    message: safePlainText(message || "未知错误", 220),
    selectedPackId: state.selectedLearningPackId || "",
    selectedDate: pack?.date || "",
    failedAt: new Date().toISOString()
  };
  if ($("#packStatus")) $("#packStatus").textContent = `课程更新失败：${state.builtinLearningPackLoad.message}`;
  saveState();
}

function renderCoursePackLoadStatus() {
  const status = renderBuiltinPackLoadNotice(getSelectedLearningPack());
  $$(".course-pack-load-status").forEach((target) => {
    target.innerHTML = status;
  });
}

function renderBuiltinPackLoadNotice(pack = getSelectedLearningPack()) {
  const load = state.builtinLearningPackLoad;
  if (!load || load.ok) {
    if (!pack) return "";
    return `<div class="pack-load-notice ok">当前课程：${escapeHtml(pack.date || "")} · ${escapeHtml(pack.packId || "")}</div>`;
  }
  return `
    <div class="pack-load-notice error" role="alert">
      <strong>课程更新失败</strong>
      <span>${escapeHtml(load.message || "无法读取内置课包。")}</span>
      <small>当前显示：${escapeHtml(load.selectedDate || pack?.date || "未知日期")} · ${escapeHtml(load.selectedPackId || pack?.packId || "未知课包")} · 阶段 ${escapeHtml(load.stage || "load")}</small>
    </div>
  `;
}

function shouldAutoSelectBuiltinRevision(selectedPack, latestPack) {
  if (!selectedPack || !latestPack) return false;
  if (selectedPack.packId === latestPack.packId) return false;
  return selectedPack.date === latestPack.date;
}

async function pasteLearningPack() {
  try {
    const text = await navigator.clipboard.readText();
    $("#learningPackInput").value = text;
    $("#packStatus").textContent = "已粘贴学习包 / Pack pasted";
  } catch {
    $("#packStatus").textContent = "请手动粘贴 / Paste manually";
  }
}

async function loadLearningPackFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (/\.(zip|hspack)$/i.test(file.name)) {
    $("#learningPackApiStatus").textContent = "多媒体资源包导入接口已预留，本期仍在建设中；不会把资源伪装成已可用。";
    return;
  }
  if (!/\.(txt|json)$/i.test(file.name)) {
    $("#packStatus").textContent = "请选择 .txt 或 .json 文件 / Use .txt or .json";
    return;
  }
  if (file.size > LEARNING_PACK_MAX_BYTES) {
    $("#packStatus").textContent = "学习包超过100KB，请检查内容 / Pack too large";
    return;
  }
  const text = await file.text();
  $("#learningPackInput").value = text;
  $("#packStatus").textContent = "文件已读取，请解析预览 / File loaded";
}

function parseAndPreviewLearningPack() {
  const raw = $("#learningPackInput").value || "";
  pendingLearningPackPreview = null;
  $("#confirmPackBtn").disabled = true;
  $("#packSuccessPanel").hidden = true;
  try {
    const pack = parseLearningPackInput(raw);
    const preview = buildLearningPackPreview(pack);
    pendingLearningPackPreview = preview;
    renderLearningPackPreview(preview);
    $("#confirmPackBtn").disabled = !preview.valid;
    $("#packStatus").textContent = preview.valid ? "解析成功，请确认导入 / Preview ready" : "学习包有问题，请先修改";
  } catch (error) {
    renderLearningPackError(error);
    $("#packStatus").textContent = "解析失败，未修改任何数据 / Parse failed";
  }
}

function checkAndImportLearningPack() {
  parseAndPreviewLearningPack();
  if (!pendingLearningPackPreview?.valid) return;
  confirmLearningPackImport({ autoNavigate: true });
}

function confirmLearningPackImport(options = {}) {
  if (!pendingLearningPackPreview?.valid) {
    $("#packStatus").textContent = "请先检查学习包 / Check first";
    return;
  }
  const result = importLearningPack(pendingLearningPackPreview.pack, pendingLearningPackPreview);
  saveState();
  englishLibrary = buildEnglishWordLibrary();
  englishProgress.settings.scope = "today_pack";
  saveEnglishProgress();
  refreshEnglishScopeOptions();
  generatePracticeFromLearningPack(pendingLearningPackPreview.pack, result);
  renderLearningPackSuccess(pendingLearningPackPreview.pack, result);
  renderTodayDashboard();
  renderChineseLesson();
  renderEnglishLesson();
  renderCharacters();
  renderWordbook();
  renderDictionary();
  renderEnglishRecognition();
  selectedSourceFilter = "daily_pack";
  localStorage.setItem(ENGLISH_BLOCK_SOURCE_FILTER_KEY, selectedSourceFilter);
  selectedBlockPatternId = getTodayPackBlockPattern()?.id || selectedBlockPatternId;
  localStorage.setItem(ENGLISH_BLOCK_SELECTED_PATTERN_KEY, selectedBlockPatternId);
  clearBlockPatternWorkState();
  renderEnglishBlocks();
  $("#packStatus").textContent = `已导入：新增 ${result.added}，更新 ${result.updated}，保持 ${result.unchanged} / Imported`;
  if (options.autoNavigate) {
    $("#packPreviewPanel").hidden = true;
    showView("daily", false);
    document.querySelector("#planetOverview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function parseLearningPackInput(raw) {
  const text = String(raw || "");
  const bytes = new TextEncoder().encode(text).length;
  if (!text.trim()) throw new Error("请先粘贴学习包。");
  if (bytes > LEARNING_PACK_MAX_BYTES) throw new Error("学习包超过100KB。");
  if (/<\s*(script|iframe|object|embed|style|link|meta)\b/i.test(text) || /javascript\s*:/i.test(text)) {
    throw new Error("学习包不能包含网页脚本或HTML。");
  }
  const jsonText = extractSingleJsonObject(text);
  const parsed = JSON.parse(jsonText);
  return validateLearningPack(parsed);
}

function extractSingleJsonObject(text) {
  const trimmed = String(text || "").trim();
  const fenced = [...trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) => match[1].trim());
  const candidates = fenced.length ? fenced : findJsonObjectCandidates(trimmed);
  const valid = [];
  candidates.forEach((candidate) => {
    try {
      JSON.parse(candidate);
      valid.push(candidate);
    } catch {
      // Keep scanning candidates.
    }
  });
  if (valid.length !== 1) throw new Error(valid.length ? "学习包里出现了多个JSON对象，请只保留一个。" : "没有找到可解析的JSON学习包。");
  return valid[0];
}

function findJsonObjectCandidates(text) {
  const candidates = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escape) escape = false;
      else if (char === "\\") escape = true;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) candidates.push(text.slice(start, index + 1));
      if (depth < 0) {
        depth = 0;
        start = -1;
      }
    }
  }
  return candidates;
}

function validateLearningPack(input) {
  const errors = [];
  const warnings = [];
  const pack = structuredCloneSafe(input);
  if (!SUPPORTED_LEARNING_PACK_SCHEMAS.includes(pack.schemaVersion)) errors.push("schemaVersion 不支持。");
  if (!/^[a-zA-Z0-9._:-]{6,80}$/.test(pack.packId || "")) errors.push("packId 缺失或格式不合理。");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pack.date || "") || Number.isNaN(Date.parse(`${pack.date}T00:00:00`))) errors.push("date 必须是 YYYY-MM-DD。");
  if (!["standard", "light", "recovery"].includes(pack.loadMode)) errors.push("loadMode 只能是 standard、light 或 recovery。");
  pack.title = safePlainText(pack.title || "Helen 每日中英学习包", 80);
  pack.contentPolicy = validateContentPolicy(pack.contentPolicy || {});
  pack.sharedPlan = validateSharedPlan(pack.sharedPlan || {}, pack.loadMode);
  pack.chinese ||= {};
  pack.english ||= {};
  pack.art ||= null;
  pack.practice ||= {};

  pack.chinese.characters = uniqueBy((pack.chinese.characters || []).map((item, index) => validateChineseCharacterTarget(item, index, errors, warnings)).filter(Boolean), "text");
  pack.chinese.words = uniqueBy((pack.chinese.words || []).map((item, index) => validateChineseWordTarget(item, index, errors)).filter(Boolean), "text");
  pack.chinese.lesson = validateChineseLesson(pack.chinese.lesson || null, errors, warnings);
  pack.chinese.confusedPairs = (pack.chinese.confusedPairs || []).map((pair, index) => {
    if (!Array.isArray(pair) || pair.length !== 2 || !pair.every(isSingleChineseChar)) {
      errors.push(`中文易混组第 ${index + 1} 项必须是两个汉字。`);
      return null;
    }
    return pair;
  }).filter(Boolean);

  pack.english.storyId = safeId(pack.english.storyId || "daily_pack");
  pack.english.storyTitle = safePlainText(pack.english.storyTitle || "Today's Pack", 80);
  pack.english.sentenceIndex = Number.isFinite(Number(pack.english.sentenceIndex)) ? Number(pack.english.sentenceIndex) : null;
  if (String(pack.english.anchorSentence || "").length > 240) errors.push("今日英语句过长。");
  pack.english.anchorSentence = safePlainText(pack.english.anchorSentence || "", 240);
  pack.english.translationZh = safePlainText(pack.english.translationZh || "", 160);
  pack.english.words = uniqueBy((pack.english.words || []).map((item, index) => validateEnglishWordTarget(item, index, errors)).filter(Boolean), "id");
  pack.english.chunks = (pack.english.chunks || []).map((item) => safePlainText(item, 80)).filter(Boolean).slice(0, 12);
  pack.english.pattern = validateEnglishPattern(pack.english.pattern || {}, pack.english.anchorSentence, errors);
  pack.english.lesson = validateEnglishLesson(pack.english.lesson || null, pack.english, pack.sharedPlan, pack.loadMode, errors, warnings);
  pack.english.phonics = (pack.english.phonics || []).map((item) => ({
    focus: safePlainText(item?.focus || "", 30),
    words: (item?.words || []).map((word) => normalizeEnglishWord(word)).filter(Boolean).slice(0, 8),
    noteZh: safePlainText(item?.noteZh || "", 120)
  })).filter((item) => item.focus || item.words.length || item.noteZh).slice(0, 5);
  pack.art = validateArtLesson(pack.art, errors, warnings);

  if (pack.loadMode === "recovery") {
    const newTargets = [
      ...pack.chinese.characters.filter((item) => item.status !== "review"),
      ...pack.chinese.words.filter((item) => item.status !== "review"),
      ...pack.english.words.filter((item) => item.status !== "review")
    ];
    if (newTargets.length) errors.push("recovery 模式只能导入 status=review 的复习项目。");
    if (pack.english.lesson?.anchorSentence && pack.english.lesson.previousSentence && pack.english.lesson.anchorSentence !== pack.english.lesson.previousSentence) {
      warnings.push("recovery 模式将优先复习熟悉句子，不新增新句。");
    }
  }

  if (!pack.chinese.characters.length && !pack.chinese.words.length && !pack.english.words.length && !pack.english.anchorSentence && !pack.art) {
    errors.push("学习包没有可导入的学习目标。");
  }

  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.details = { errors, warnings };
    throw error;
  }
  pack._warnings = warnings;
  return pack;
}

function validateChineseCharacterTarget(item, index, errors, warnings) {
  const text = safePlainText(item?.text || item?.char || "", 8);
  if (!isSingleChineseChar(text)) {
    errors.push(`中文目标字第 ${index + 1} 项必须是一个汉字。`);
    return null;
  }
  const words = unique((item?.words || []).map((word) => safePlainText(word, 12)).filter(isGoodWord)).slice(0, 6);
  if (words.length < 3) warnings.push(`${text} 的组词少于3个。`);
  return {
    text,
    char: text,
    pinyin: safePlainText(item?.pinyin || "", 30),
    meaning: safePlainText(item?.meaning || "", 120),
    words,
    example: safePlainText(item?.example || item?.sentence || "", 80),
    status: normalizePackStatus(item?.status),
    priority: clampNumber(item?.priority, 1, 5, 3),
    source: safePlainText(item?.source || "每日学习包", 80)
  };
}

function validateChineseWordTarget(item, index, errors) {
  const text = safePlainText(item?.text || item?.word || "", 12);
  if (!isGoodWord(text)) {
    errors.push(`中文词语第 ${index + 1} 项格式不合理。`);
    return null;
  }
  return {
    text,
    meaning: safePlainText(item?.meaning || "", 120),
    status: normalizePackStatus(item?.status),
    source: safePlainText(item?.source || "每日学习包", 80)
  };
}

function validateEnglishWordTarget(item, index, errors) {
  const display = safePlainText(item?.text || item?.word || "", 40);
  const id = normalizeEnglishWord(display);
  if (!id || !/^[a-z]+(?:['-][a-z]+)?$/i.test(id)) {
    errors.push(`英文单词第 ${index + 1} 项格式不合理。`);
    return null;
  }
  return {
    id,
    normalized: id,
    text: display || DISPLAY_OVERRIDES[id] || id,
    meaningZh: safePlainText(item?.meaningZh || item?.chinese || "", 80),
    status: normalizePackStatus(item?.status),
    sourceSentence: safePlainText(item?.sourceSentence || "", 160),
    priority: clampNumber(item?.priority, 1, 5, 3)
  };
}

function validateEnglishPattern(pattern, anchorSentence, errors) {
  const id = safeId(pattern?.id || "daily_pack_pattern");
  const displayZh = safePlainText(pattern?.displayZh || "今日句型", 120);
  const blocks = (pattern?.blocks || []).map((item) => safePlainText(item, 80)).filter(Boolean).slice(0, 12);
  if (!blocks.length && anchorSentence) blocks.push(...splitSentenceToBlocks(anchorSentence).slice(0, 8));
  return { id, displayZh, blocks };
}

function validateSharedPlan(plan, loadMode) {
  const defaultMode = ["recovery", "light", "standard"].includes(plan?.defaultEnglishMode) ? plan.defaultEnglishMode : (loadMode === "standard" ? "light" : loadMode || "light");
  return {
    plannedChineseMinutes: clampNumber(plan?.plannedChineseMinutes, 0, 90, 35),
    plannedBreakMinutes: clampNumber(plan?.plannedBreakMinutes, 0, 30, 5),
    defaultEnglishMode: defaultMode,
    plannedEnglishMinutes: clampNumber(plan?.plannedEnglishMinutes, 0, 60, defaultMode === "standard" ? 28 : defaultMode === "recovery" ? 12 : 20),
    sequenceNoteZh: safePlainText(plan?.sequenceNoteZh || "中文和英语可以分时完成", 120),
    fallbackRules: {
      chineseOverMinutes: clampNumber(plan?.fallbackRules?.chineseOverMinutes, 20, 90, 45),
      easeBelow: clampNumber(plan?.fallbackRules?.easeBelow, 0, 10, 7),
      recoveryEaseBelow: clampNumber(plan?.fallbackRules?.recoveryEaseBelow, 0, 10, 6)
    }
  };
}

function validateChineseLesson(lesson, errors, warnings) {
  if (!lesson) return null;
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  if (!sections.length) warnings.push("中文课程没有 sections，将只显示今日字词。");
  const normalized = {
    title: safePlainText(lesson.title || "今日中文课", 100),
    lessonId: safeId(lesson.lessonId || ""),
    sections: sections.map((section, index) => validateChineseLessonSection(section, index, errors)).filter(Boolean).slice(0, 12),
    answerKey: sanitizeAnswerMap(lesson.answerKey || {})
  };
  return normalized;
}

function validateChineseLessonSection(section, index, errors) {
  if (!section || typeof section !== "object") return null;
  const id = safeId(section.id || `section_${index + 1}`);
  const type = safeId(section.type || "spoken_task");
  const normalized = {
    id,
    type,
    title: safePlainText(section.title || `第 ${index + 1} 部分`, 80),
    plannedMinutes: clampNumber(section.plannedMinutes, 0, 30, 5),
    childInstructionZh: safePlainText(section.childInstructionZh || section.childVisible?.instructionZh || "", 260),
    childVisible: section.childVisible && typeof section.childVisible === "object" ? structuredCloneSafe(section.childVisible) : undefined,
    learningGoalZh: safePlainText(section.learningGoalZh || "", 220),
    parentInstructionZh: safePlainText(section.parentInstructionZh || section.instructionZh || "", 180),
    answerMode: safePlainText(section.answerMode || "spoken", 30),
    readAloud: validateReadAloudConfig(section.readAloud),
    recording: validateRecordingConfig(section.recording)
  };
  if (section.textTitle) normalized.textTitle = safePlainText(section.textTitle, 80);
  if (section.prompt) normalized.prompt = safePlainText(section.prompt, 220);
  if (Array.isArray(section.paragraphs)) normalized.paragraphs = section.paragraphs.map((item) => safePlainText(item, 600)).filter(Boolean).slice(0, 12);
  if (Array.isArray(section.items)) normalized.items = section.items.map((item) => sanitizeLessonItem(item)).filter(Boolean).slice(0, 30);
  if (Array.isArray(section.questions)) normalized.questions = section.questions.map((item, qIndex) => sanitizeQuestionItem(item, `${id}_${qIndex}`)).filter(Boolean).slice(0, 12);
  if (Array.isArray(section.prompts)) normalized.prompts = section.prompts.map((item) => safePlainText(item, 80)).filter(Boolean).slice(0, 8);
  if (Array.isArray(section.characters)) normalized.characters = section.characters.map((item) => safePlainText(item?.text || item, 8)).filter(isSingleChineseChar).slice(0, 20);
  if (Array.isArray(section.words)) normalized.words = section.words.map((item) => safePlainText(item?.text || item, 16)).filter(isGoodWord).slice(0, 20);
  if (Array.isArray(section.supportRulesZh)) normalized.supportRulesZh = section.supportRulesZh.map((item) => safePlainText(item, 180)).filter(Boolean).slice(0, 8);
  if (section.stopRuleZh) normalized.stopRuleZh = safePlainText(section.stopRuleZh, 220);
  if (section.objectiveAnswers) normalized.objectiveAnswers = sanitizeAnswerMap(section.objectiveAnswers);
  if (section.historyOverlap) normalized.historyOverlap = structuredCloneSafe(section.historyOverlap);
  if (section.parentOnly && typeof section.parentOnly === "object") normalized.parentOnly = structuredCloneSafe(section.parentOnly);
  if (section.day13Evidence) normalized.day13Evidence = Array.isArray(section.day13Evidence) ? section.day13Evidence.map((item) => safePlainText(item, 120)).filter(Boolean).slice(0, 8) : [];
  if (!normalized.title) errors.push(`中文课程第 ${index + 1} 部分标题为空。`);
  return normalized;
}

function validateEnglishLesson(lesson, english, sharedPlan, loadMode, errors, warnings) {
  if (!lesson) return null;
  const source = lesson && typeof lesson === "object" ? lesson : {};
  const allowedModes = unique((Array.isArray(source.allowedModes) ? source.allowedModes : ["recovery", "light", "standard"]).filter((item) => ["recovery", "light", "standard"].includes(item)));
  const defaultMode = allowedModes.includes(source.defaultMode) ? source.defaultMode : allowedModes.includes(sharedPlan.defaultEnglishMode) ? sharedPlan.defaultEnglishMode : allowedModes[0] || "light";
  const steps = Array.isArray(source.steps) ? source.steps : [];
  if (lesson && steps.length && steps.length < 7) warnings.push("英语课程少于7步，将按现有步骤显示。");
  const normalized = {
    defaultMode,
    allowedModes: allowedModes.length ? allowedModes : ["light"],
    previousSentence: safePlainText(source.previousSentence || "", 240),
    anchorSentence: safePlainText(source.anchorSentence || english.anchorSentence || "", 240),
    translationZh: safePlainText(source.translationZh || english.translationZh || "", 180),
    appLocator: validateAppLocator(source.appLocator || {}),
    steps: steps.map((step, index) => validateEnglishLessonStep(step, index, errors)).filter(Boolean).slice(0, 12)
  };
  if (loadMode === "recovery" && normalized.allowedModes.includes("recovery")) normalized.defaultMode = "recovery";
  return normalized;
}

function validateContentPolicy(policy) {
  return {
    authority: safePlainText(policy.authority || "", 80),
    websiteMode: safePlainText(policy.websiteMode || "", 40),
    allowModelGeneration: policy.allowModelGeneration === false ? false : Boolean(policy.allowModelGeneration)
  };
}

function validateAppLocator(locator) {
  return {
    appName: safePlainText(locator.appName || "每日英语听力", 60),
    folder: safePlainText(locator.folder || "", 80),
    article: safePlainText(locator.article || "", 100),
    targetSentence: safePlainText(locator.targetSentence || "", 240),
    settingsZh: safePlainText(locator.settingsZh || "隐藏原文和译文，按步骤播放", 160)
  };
}

function validateEnglishLessonStep(step, index, errors) {
  if (!step || typeof step !== "object") return null;
  const id = safeId(step.id || `step_${index + 1}`);
  const normalized = {
    id,
    number: Number.isFinite(Number(step.number)) ? Number(step.number) : index + 1,
    titleZh: safePlainText(step.titleZh || step.title || `第 ${index + 1} 步`, 80),
    tool: safePlainText(step.tool || "website", 80),
    minutesByMode: {
      recovery: clampNumber(step.minutesByMode?.recovery, 0, 20, 2),
      light: clampNumber(step.minutesByMode?.light, 0, 20, 3),
      standard: clampNumber(step.minutesByMode?.standard, 0, 25, 5)
    },
    parentSaysZh: safePlainText(step.parentSaysZh || "", 240),
    actionsZh: Array.isArray(step.actionsZh) ? step.actionsZh.map((item) => safePlainText(item, 140)).filter(Boolean).slice(0, 8) : [],
    successCriteriaZh: safePlainText(step.successCriteriaZh || "", 220),
    expectedAnswer: safePlainText(step.expectedAnswer || "", 300)
  };
  normalized.readAloud = validateReadAloudConfig(step.readAloud);
  normalized.recording = validateRecordingConfig(step.recording);
  if (Array.isArray(step.blocks)) normalized.blocks = step.blocks.map((item) => safePlainText(item, 80)).filter(Boolean).slice(0, 16);
  if (Array.isArray(step.targetSentences)) normalized.targetSentences = step.targetSentences.map((item) => safePlainText(item, 240)).filter(Boolean).slice(0, 8);
  if (Array.isArray(step.acceptedAnswers)) normalized.acceptedAnswers = step.acceptedAnswers.map((item) => safePlainText(item, 240)).filter(Boolean).slice(0, 12);
  if (step.focus) normalized.focus = safePlainText(step.focus, 60);
  if (Array.isArray(step.items)) normalized.items = step.items.map((item) => sanitizeLessonItem(item)).filter(Boolean).slice(0, 20);
  if (Array.isArray(step.dialogue)) normalized.dialogue = step.dialogue.map((item) => sanitizeDialogueLine(item)).filter(Boolean).slice(0, 12);
  if (Array.isArray(step.exitChecks)) normalized.exitChecks = step.exitChecks.map((item) => safePlainText(item, 120)).filter(Boolean).slice(0, 8);
  if (!normalized.titleZh) errors.push(`英语课程第 ${index + 1} 步标题为空。`);
  return normalized;
}

function validateArtLesson(art, errors, warnings) {
  if (!art) return null;
  const source = art.lesson && typeof art.lesson === "object" ? art.lesson : art;
  const steps = Array.isArray(source.steps) ? source.steps : [];
  if (!steps.length) warnings.push("美术课程没有 steps，将不能启动完整美术课。");
  const reflectionSource = source.reflection;
  const reflectionPrompts = Array.isArray(reflectionSource)
    ? reflectionSource
    : Array.isArray(reflectionSource?.promptsZh)
      ? reflectionSource.promptsZh
      : [];
  return {
    courseId: safeId(source.courseId || art.courseId || "marker-drawing-foundations"),
    lessonId: safeId(source.lessonId || art.lessonId || `art_${Date.now().toString(36)}`),
    title: safePlainText(source.titleZh || source.title || "今日马克笔画", 100),
    plannedMinutes: clampNumber(source.plannedMinutes, 0, 90, 20),
    difficulty: safePlainText(source.difficulty || "", 40),
    techniqueFocus: Array.isArray(source.techniqueFocus) ? source.techniqueFocus.map((item) => safePlainText(item, 40)).filter(Boolean).slice(0, 8) : [],
    creativeChoice: safePlainText(source.creativeChoice || "", 120),
    coverAssetId: safeOptionalId(source.coverAssetId || ""),
    finalExampleAssetId: safeOptionalId(source.finalExampleAssetId || ""),
    assetBasePath: sanitizeAssetBasePath(source.assetBasePath || art.assetBasePath || "assets/art/color-planet-lesson-01"),
    skillFocus: Array.isArray(source.skillFocus) ? source.skillFocus.map((item) => safePlainText(item, 30)).filter(Boolean).slice(0, 8) : [],
    materials: Array.isArray(source.materials) ? source.materials.map((item) => ({
      name: safePlainText(item?.nameZh || item?.name || item, 80),
      nameZh: safePlainText(item?.nameZh || item?.name || item, 80),
      required: item?.required !== false,
      safetyNoteZh: safePlainText(item?.safetyNoteZh || "", 120)
    })).filter((item) => item.name).slice(0, 20) : [],
    safetyNotesZh: Array.isArray(source.safetyNotesZh) ? source.safetyNotesZh.map((item) => safePlainText(item, 160)).filter(Boolean).slice(0, 8) : [],
    warmup: source.warmup ? {
      id: safeId(source.warmup.id || "warmup"),
      title: safePlainText(source.warmup.titleZh || source.warmup.title || "热身", 80),
      instructionZh: safePlainText(source.warmup.instructionZh || "", 240),
      plannedMinutes: clampNumber(source.warmup.plannedMinutes, 0, 20, 3),
      successCriteriaZh: safePlainText(source.warmup.successCriteriaZh || "", 180),
      hintLevels: Array.isArray(source.warmup.hintLevels) ? source.warmup.hintLevels.map((item) => typeof item === "string" ? safePlainText(item, 160) : safePlainText(item?.textZh || "", 160)).filter(Boolean).slice(0, 3) : [],
      readAloud: validateReadAloudConfig(source.warmup.readAloud),
      recording: validateRecordingConfig(source.warmup.recording)
    } : null,
    steps: steps.map((step, index) => validateArtStep(step, index, errors)).filter(Boolean).slice(0, 16),
    reflection: reflectionPrompts.map((item) => safePlainText(item, 120)).filter(Boolean).slice(0, 8),
    nameArtwork: reflectionSource?.nameArtwork === true,
    completionCriteriaZh: safePlainText(source.completionCriteriaZh || source.completionCriteria || "", 220),
    assetManifest: (source.assetManifest || art.assetManifest) ? {
      packId: safePlainText((source.assetManifest || art.assetManifest).packId || "", 80),
      assets: Array.isArray((source.assetManifest || art.assetManifest).assets) ? (source.assetManifest || art.assetManifest).assets.map((item) => ({
        id: safeId(item?.id || ""),
        fileName: safePlainText(item?.fileName || "", 120),
        mime: safePlainText(item?.mime || "", 40),
        altZh: safePlainText(item?.altZh || item?.alt || "", 120)
      })).filter((item) => item.id && /^(image\/(png|jpeg|webp)|audio\/(mpeg|mp4|ogg|wav)|video\/(mp4|webm))$/.test(item.mime)).slice(0, 80) : []
    } : null
  };
}

function validateArtStep(step, index, errors) {
  if (!step || typeof step !== "object") return null;
  const id = safeId(step.id || `step_${index + 1}`);
  const hardGate = step.hardGate && typeof step.hardGate === "object" ? {
    id: safeId(step.hardGate.id || ""),
    requiredBeforeNext: step.hardGate.requiredBeforeNext === true,
    messageZh: safePlainText(step.hardGate.messageZh || "", 160)
  } : null;
  const normalized = {
    id,
    order: Number.isFinite(Number(step.order)) ? Number(step.order) : index + 1,
    title: safePlainText(step.titleZh || step.title || `第 ${index + 1} 步`, 80),
    titleZh: safePlainText(step.titleZh || step.title || `第 ${index + 1} 步`, 80),
    instructionZh: safePlainText(step.instructionZh || "", 300),
    childActionZh: safePlainText(step.childActionZh || step.instructionZh || "", 300),
    parentPromptZh: safePlainText(step.parentPromptZh || "", 220),
    plannedMinutes: clampNumber(step.plannedMinutes, 0, 30, 3),
    referenceAssetId: safeOptionalId(step.referenceAssetId || ""),
    imageAssetId: safeOptionalId(step.imageAssetId || step.referenceAssetId || ""),
    overlayAssetId: safeOptionalId(step.overlayAssetId || ""),
    narration: {
      textZh: safePlainText(step.narration?.textZh || "", 160),
      audioAssetId: safeOptionalId(step.narration?.audioAssetId || ""),
      slowAudioAssetId: safeOptionalId(step.narration?.slowAudioAssetId || ""),
      replayLabel: safePlainText(step.narration?.replayLabel || "再听一遍", 30)
    },
    readAloud: validateReadAloudConfig(step.readAloud),
    recording: validateRecordingConfig(step.recording),
    successCriteriaZh: safePlainText(step.successCriteriaZh || "", 200),
    completionCheckZh: safePlainText(step.completionCheckZh || "", 220),
    commonMistakeZh: safePlainText(step.commonMistakeZh || "", 220),
    hardGate,
    hintLevels: Array.isArray(step.hintLevels) ? step.hintLevels.map((item) => typeof item === "string" ? { textZh: safePlainText(item, 180) } : {
      textZh: safePlainText(item?.textZh || "", 180),
      imageAssetId: safeOptionalId(item?.imageAssetId || ""),
      audioAssetId: safeOptionalId(item?.audioAssetId || "")
    }).filter((item) => item.textZh).slice(0, 3) : []
  };
  if (!normalized.instructionZh) errors.push(`art.steps.${id}.instructionZh`);
  return normalized;
}

function sanitizeLessonItem(item) {
  if (typeof item === "string") return { text: safePlainText(item, 160) };
  if (!item || typeof item !== "object") return null;
  const normalized = {
    id: safeId(item.id || ""),
    text: safePlainText(item.text || item.word || item.character || "", 160),
    pinyin: safePlainText(item.pinyin || "", 40),
    meaning: safePlainText(item.meaning || item.meaningZh || "", 180),
    prompt: safePlainText(item.prompt || item.promptZh || "", 260),
    answer: safePlainText(item.answer || item.referenceAnswer || item.referenceAnswerZh || "", 260),
    responseMode: safePlainText(item.responseMode || "", 40),
    maxSeconds: clampNumber(item.maxSeconds, 0, 300, 0)
  };
  if (Array.isArray(item.stepsZh)) normalized.stepsZh = item.stepsZh.map((step) => safePlainText(step, 180)).filter(Boolean).slice(0, 8);
  if (item.setupZh) normalized.setupZh = safePlainText(item.setupZh, 180);
  if (item.referenceAnswerZh) normalized.referenceAnswerZh = safePlainText(item.referenceAnswerZh, 260);
  return normalized;
}

function sanitizeQuestionItem(item, fallbackId) {
  if (!item || typeof item !== "object") return null;
  const options = Array.isArray(item.options) ? item.options.map((option) => safePlainText(option, 160)).filter(Boolean).slice(0, 8) : [];
  const normalized = {
    id: safeId(item.id || fallbackId),
    prompt: safePlainText(item.prompt || item.question || "", 260),
    options,
    answer: safePlainText(item.answer || "", 180),
    referenceAnswer: safePlainText(item.referenceAnswer || item.explanation || "", 260),
    readAloud: validateReadAloudConfig(item.readAloud),
    recording: validateRecordingConfig(item.recording)
  };
  if (item.answerPosition) normalized.answerPosition = safePlainText(item.answerPosition, 4);
  if (item.preserveOptionOrder === true || item.answerPosition) normalized.preserveOptionOrder = true;
  if (item.responseMode) normalized.responseMode = safePlainText(item.responseMode, 40);
  if (item.distractorRationaleZh) normalized.distractorRationaleZh = safePlainText(item.distractorRationaleZh, 300);
  if (item.displayCards) normalized.displayCards = sanitizeQuestionDisplayCards(item.displayCards);
  if (item.oralAssessment) normalized.oralAssessment = sanitizeOralAssessment(item.oralAssessment);
  return normalized;
}

function sanitizeQuestionDisplayCards(cards) {
  if (!cards || typeof cards !== "object") return null;
  return {
    artworkCard: safePlainText(cards.artworkCard || "", 80),
    labelCards: Array.isArray(cards.labelCards) ? cards.labelCards.map((card, index) => ({
      id: safePlainText(card?.id || choiceLetter(index), 4),
      text: safePlainText(card?.text || "", 100),
      control: safePlainText(card?.control || "", 60)
    })).filter((card) => card.text).slice(0, 6) : []
  };
}

function sanitizeOralAssessment(config) {
  if (!config || typeof config !== "object") return null;
  return {
    required: config.required === true,
    requiredConcepts: Array.isArray(config.requiredConcepts) ? config.requiredConcepts.map((item) => safePlainText(item, 30)).filter(Boolean).slice(0, 6) : [],
    resultField: safePlainText(config.resultField || "spokenCheckedFields", 40),
    supportField: safePlainText(config.supportField || "answerSupport", 40),
    keepSeparateFromSelection: config.keepSeparateFromSelection !== false
  };
}

function validateReadAloudConfig(config) {
  if (!config || typeof config !== "object") return null;
  const policies = new Set(["full", "instruction_only", "prompt_and_options", "prompt_only", "disabled_during_assessment"]);
  return {
    policy: policies.has(config.policy) ? config.policy : "instruction_only",
    spokenTextZh: safePlainText(config.spokenTextZh || "", 500),
    optionSpokenTexts: Array.isArray(config.optionSpokenTexts) ? config.optionSpokenTexts.map((item) => safePlainText(item, 120)).filter(Boolean).slice(0, 8) : [],
    audioAssetId: safeOptionalId(config.audioAssetId || ""),
    slowAudioAssetId: safeOptionalId(config.slowAudioAssetId || "")
  };
}

function validateRecordingConfig(config) {
  if (!config || typeof config !== "object") return null;
  const modes = new Set(["none", "optional_response", "required_response"]);
  const categories = new Set(["retell", "oral_answer", "english_retrieval", "dialogue", "exit_check", "art_reflection"]);
  return {
    mode: modes.has(config.mode) ? config.mode : "none",
    maxSeconds: clampNumber(config.maxSeconds, 1, RECORDING_MAX_SECONDS, 120),
    promptZh: safePlainText(config.promptZh || "", 220),
    startCueZh: safePlainText(config.startCueZh || "准备好后点麦克风", 120),
    stopAction: ["done_button", "next_step"].includes(config.stopAction) ? config.stopAction : "done_button",
    allowMultipleTakes: config.allowMultipleTakes !== false,
    includeInFeedback: config.includeInFeedback !== false,
    category: categories.has(config.category) ? config.category : "oral_answer"
  };
}

function sanitizeDialogueLine(item) {
  if (typeof item === "string") return { speaker: "parent", text: safePlainText(item, 180) };
  if (!item || typeof item !== "object") return null;
  return {
    speaker: safePlainText(item.speaker || "parent", 30),
    text: safePlainText(item.text || item.line || "", 220),
    referenceZh: safePlainText(item.referenceZh || "", 180)
  };
}

function sanitizeAnswerMap(answerKey) {
  return Object.fromEntries(Object.entries(answerKey || {}).map(([key, value]) => [
    safePlainText(key, 80),
    typeof value === "string" ? safePlainText(value, 300) : structuredCloneSafe(value)
  ]).filter(([key]) => key));
}

function buildLearningPackPreview(pack) {
  const normalized = normalizeLearningPackForStorage(pack);
  const checksum = checksumString(JSON.stringify(normalized));
  const existing = state.learningPacks?.[pack.packId] || null;
  const targets = collectLearningPackTargets(pack);
  const isPackUpdate = Boolean(existing && existing.checksum !== checksum);
  const changes = targets.map((target) => describeLearningPackTargetChange(target, existing, isPackUpdate));
  const added = changes.filter((item) => item.action === "add").length;
  const updated = changes.filter((item) => item.action === "update").length;
  const unchanged = changes.filter((item) => item.action === "same").length;
  return {
    valid: true,
    pack: normalized,
    checksum,
    existing,
    isRepeat: Boolean(existing && existing.checksum === checksum),
    isPackUpdate,
    changes,
    added,
    updated,
    unchanged,
    warnings: pack._warnings || []
  };
}

function collectLearningPackTargets(pack) {
  return [
    ...pack.chinese.characters.map((item) => ({ kind: "中文目标字", id: `char:${item.text}`, text: item.text })),
    ...pack.chinese.words.map((item) => ({ kind: "中文词语", id: `zhword:${item.text}`, text: item.text })),
    ...pack.english.words.map((item) => ({ kind: "英文单词", id: `en:${item.id}`, text: item.text || item.id })),
    ...(pack.english.anchorSentence ? [{ kind: "今日英语句", id: `sentence:${pack.packId}`, text: pack.english.anchorSentence }] : [])
  ];
}

function describeLearningPackTargetChange(target, existingPack, isPackUpdate = false) {
  const existingInApp = target.kind === "中文目标字"
    ? state.learnerChars?.[target.text]
    : target.kind === "中文词语"
      ? state.wordbook?.[`word:${target.text}`]
      : target.kind === "英文单词"
        ? englishLibrary.some((word) => word.id === normalizeEnglishWord(target.text))
        : existingPack?.data?.english?.anchorSentence === target.text;
  const existedInSamePack = Boolean(existingPack?.targets?.some((item) => item.id === target.id));
  const action = existedInSamePack ? (isPackUpdate ? "update" : "same") : existingInApp ? "update" : "add";
  return { ...target, action };
}

function renderLearningPackPreview(preview) {
  $("#packPreviewPanel").hidden = false;
  $("#packPreviewTitle").textContent = `${preview.pack.date} · ${preview.pack.loadMode}`;
  const pack = preview.pack;
  const byAction = (action) => preview.changes.filter((item) => item.action === action);
  $("#packPreviewContent").innerHTML = `
    <div class="pack-overview-grid">
      <div><strong>日期</strong><span>${escapeHtml(pack.date)}</span></div>
      <div><strong>负荷模式</strong><span>${escapeHtml(loadModeLabel(pack.loadMode))}</span></div>
      <div><strong>中文目标字</strong><span>${pack.chinese.characters.length}</span></div>
      <div><strong>中文目标词</strong><span>${pack.chinese.words.length}</span></div>
      <div><strong>英文目标词</strong><span>${pack.english.words.length}</span></div>
      <div><strong>复习项目</strong><span>${countReviewTargets(pack)}</span></div>
    </div>
    <div class="pack-preview-sentence">
      <strong>今日英语句</strong>
      <p>${escapeHtml(pack.english.anchorSentence || "暂无")}</p>
    </div>
    ${renderPackPreviewGroup("将新增", byAction("add"))}
    ${renderPackPreviewGroup("将更新", byAction("update"))}
    ${renderPackPreviewGroup("保持不变", byAction("same"))}
    ${preview.warnings.length ? `<div class="pack-warning">提示：${preview.warnings.map(escapeHtml).join("；")}</div>` : ""}
    ${preview.isRepeat ? `<div class="pack-warning">这个学习包已经导入过，再次确认不会重复增加次数。</div>` : ""}
  `;
}

function renderPackPreviewGroup(title, items) {
  const content = items.length ? items.map((item) => `<span class="pack-chip">${escapeHtml(item.kind)}：${escapeHtml(item.text)}</span>`).join("") : `<span class="pack-muted">无</span>`;
  return `<section class="pack-preview-group"><h3>${escapeHtml(title)}</h3><div class="chips">${content}</div></section>`;
}

function renderLearningPackError(error) {
  $("#packPreviewPanel").hidden = false;
  $("#packPreviewTitle").textContent = "解析失败";
  $("#packPreviewContent").innerHTML = `
    <div class="pack-error">
      <strong>${escapeHtml(error?.message || "学习包格式不正确")}</strong>
      <p>没有修改任何学习数据。</p>
    </div>
  `;
}

function importLearningPack(pack, preview, options = {}) {
  const now = new Date().toISOString();
  const shouldSelect = options.select !== false;
  const markLatest = options.markLatest !== false;
  state.learningPacks ||= {};
  state.learningPackArchive ||= { version: 1, entries: [], byDate: {} };
  const existing = state.learningPacks[pack.packId] || null;
  const repeat = Boolean(existing && existing.checksum === preview.checksum);
  const stats = repeat ? { added: 0, updated: 0, unchanged: preview.changes.length } : {
    added: preview.added,
    updated: preview.updated,
    unchanged: preview.unchanged
  };
  const sourceId = `daily_pack:${pack.packId}`;
  if (!repeat) {
    mergeChinesePackTargets(pack, sourceId, now);
    mergeEnglishPackProgress(pack, sourceId, now);
  }
  const targets = collectLearningPackTargets(pack);
  state.learningPacks[pack.packId] = {
    packId: pack.packId,
    schemaVersion: pack.schemaVersion,
    date: pack.date,
    checksum: preview.checksum,
    importedAt: existing?.importedAt || now,
    updatedAt: now,
    data: pack,
    targets,
    importStats: stats,
    importCount: existing?.importCount || 1
  };
  upsertLearningPackArchiveEntry(state.learningPackArchive, {
    date: pack.date,
    packId: pack.packId,
    title: pack.title || "",
    schemaVersion: pack.schemaVersion,
    availableSubjects: getPackAvailableSubjects(pack),
    publishedAt: options.publishedAt || now
  });
  if (markLatest) state.latestLearningPackId = pack.packId;
  if (shouldSelect || !state.selectedLearningPackId) state.selectedLearningPackId = pack.packId;
  state.lastLearningPackRaw = JSON.stringify(pack, null, 2);
  state.latestLearning = focusFromLearningPack(pack);
  state.focusTitleOverride = pack.title || "今日学习包";
  return { ...stats, repeat, packId: pack.packId };
}

function getPackAvailableSubjects(pack) {
  return ["chinese", "english", "art"].filter((course) => isPlanetScheduled(pack, course));
}

function mergeChinesePackTargets(pack, sourceId, now) {
  state.learnerChars ||= {};
  state.wordbook ||= {};
  pack.chinese.characters.forEach((item) => {
    const existing = state.learnerChars[item.text] || {};
    state.learnerChars[item.text] = {
      ...existing,
      char: item.text,
      text: item.text,
      pinyin: item.pinyin || existing.pinyin || "",
      meaning: item.meaning || existing.meaning || "",
      words: item.words?.length ? item.words : existing.words || [],
      example: item.example || existing.example || existing.sentence || "",
      sentence: item.example || existing.sentence || "",
      status: existing.status === "mastered" ? existing.status : item.status || existing.status || "review",
      source: item.source || existing.source || "每日学习包",
      packSources: unique([...(existing.packSources || []), sourceId]),
      selectionReason: "每日学习包指定",
      latestFoundAt: now,
      firstFoundAt: existing.firstFoundAt || now,
      inWordbook: true,
      inCharacterPractice: true
    };
    mergeWordbookEntry(item.text, { type: "char", char: item.text, text: item.text, sourceId, status: item.status, contextWord: item.words?.[0] || "", now });
  });
  pack.chinese.words.forEach((item) => {
    mergeWordbookEntry(`word:${item.text}`, { type: "word", text: item.text, sourceId, status: item.status, contextWord: item.text, meaning: item.meaning, now });
  });
}

function mergeWordbookEntry(key, payload) {
  const existing = state.wordbook[key] || {};
  const sources = unique([...(existing.sources || []), payload.sourceId]);
  state.wordbook[key] = {
    ...existing,
    addedAt: existing.addedAt || payload.now,
    mastered: Boolean(existing.mastered),
    autoAdded: true,
    type: payload.type,
    text: payload.text,
    char: payload.char || existing.char || "",
    meaning: payload.meaning || existing.meaning || "",
    sources,
    count: Math.max(existing.count || 0, sources.length),
    latestStatus: payload.status || existing.latestStatus || "review",
    latestFoundAt: payload.now,
    contextWord: payload.contextWord || existing.contextWord || ""
  };
}

function mergeEnglishPackProgress(pack, sourceId, now) {
  englishProgress.words ||= {};
  pack.english.words.forEach((item) => {
    const existing = englishProgress.words[item.id] || {};
    englishProgress.words[item.id] = {
      ...existing,
      itemId: item.id,
      packSources: unique([...(existing.packSources || []), sourceId]),
      latestPackDate: pack.date,
      updatedAt: now
    };
  });
  saveEnglishProgress();
}

function generatePracticeFromLatestPack() {
  const pack = getLatestLearningPack();
  if (!pack) {
    $("#packStatus").textContent = "今日课程暂未准备好 / No course ready";
    return;
  }
  generatePracticeFromLearningPack(pack, { repeat: true, added: 0, updated: 0, unchanged: 0 });
}

function generatePracticeFromLearningPack(pack, result = {}) {
  const focus = focusFromLearningPack(pack);
  generatedQuestions = questionsFromLearningPack(pack);
  state.latestLearning = focus;
  const record = {
    date: new Date().toISOString(),
    source: `daily_pack:${pack.packId}`,
    sourceText: JSON.stringify(pack),
    packId: pack.packId,
    extracted: focus,
    questions: generatedQuestions,
    sourceDays: [pack.date],
    learnerSummary: { source: "learning_pack" },
    meta: { provider: "local_pack", requestId: pack.packId, latencyMs: 0 },
    approved: false,
    results: [],
    importResult: result
  };
  state.dailyRecords.push(record);
  saveState();
  renderFocus(focus);
  renderReview(generatedQuestions);
  $("#approveBtn").disabled = false;
  $("#regenerateBtn").disabled = false;
  state.answerPanelsHidden = false;
  applyAnswerPanelVisibility();
}

function focusFromLearningPack(pack) {
  return {
    theme: pack.title || "今日学习包",
    packId: pack.packId,
    loadMode: pack.loadMode,
    date: pack.date,
    chars: pack.chinese.characters.map((item) => item.text),
    weakChars: pack.chinese.characters.filter((item) => item.status !== "mastered").map((item) => item.text),
    words: pack.chinese.words.map((item) => item.text),
    sentences: [pack.english.anchorSentence, ...(pack.chinese.characters.map((item) => item.example))].filter(Boolean),
    charDetails: pack.chinese.characters.map((item) => ({
      character: item.text,
      char: item.text,
      pinyin: item.pinyin,
      meaning: item.meaning,
      commonWord: item.words?.[0] || "",
      words: item.words,
      wordGroups: item.words,
      example: item.example,
      source: item.source,
      status: item.status,
      selectionReason: "每日学习包指定"
    })),
    englishWords: pack.english.words.map((item) => item.text || item.id),
    englishSentence: pack.english.anchorSentence
  };
}

function questionsFromLearningPack(pack) {
  const chars = pack.chinese.characters;
  const words = pack.chinese.words;
  const questions = [];
  chars.forEach((item, index) => {
    questions.push({
      type: "认读",
      prompt: `${index + 1}. 读出这个字`,
      display: item.text,
      char: item.text,
      pinyin: item.pinyin,
      answer: item.meaning,
      words: item.words,
      example: item.example,
      explanation: item.meaning
    });
  });
  pack.chinese.confusedPairs.forEach((pair) => {
    questions.push({
      type: "易混字",
      prompt: "看一看，说说两个字怎么区分",
      display: pair.join(" / "),
      char: pair[0],
      choices: pair,
      answer: pair.join("、")
    });
  });
  words.forEach((item) => {
    questions.push({
      type: "词语认读",
      prompt: "读词语，说意思",
      display: item.text,
      char: [...item.text].find(isSingleChineseChar) || item.text[0],
      answer: item.meaning || `读出“${item.text}”并说一个小例子`
    });
  });
  return questions;
}

function renderLearningPackSuccess(pack, result) {
  $("#packSuccessPanel").hidden = false;
  $("#packSuccessTitle").textContent = `${pack.date} · ${loadModeLabel(pack.loadMode)}`;
  $("#packSuccessSummary").innerHTML = `
    <div class="pack-overview-grid">
      <div><strong>中文目标字</strong><span>${pack.chinese.characters.map((item) => escapeHtml(item.text)).join("、") || "无"}</span></div>
      <div><strong>中文目标词</strong><span>${pack.chinese.words.map((item) => escapeHtml(item.text)).join("、") || "无"}</span></div>
      <div><strong>英文目标词</strong><span>${pack.english.words.map((item) => escapeHtml(item.text || item.id)).join("、") || "无"}</span></div>
      <div><strong>复习项目</strong><span>${countReviewTargets(pack)}</span></div>
    </div>
    <div class="pack-preview-sentence"><strong>今日英语句</strong><p>${escapeHtml(pack.english.anchorSentence || "暂无")}</p></div>
    <p class="pack-muted">新增 ${result.added} · 更新 ${result.updated} · 保持 ${result.unchanged}</p>
  `;
}

function normalizeLearningPackForStorage(pack) {
  const clone = structuredCloneSafe(pack);
  delete clone._warnings;
  return clone;
}

function getLatestLearningPack() {
  const id = state.selectedLearningPackId || state.latestLearningPackId;
  return id ? state.learningPacks?.[id]?.data || null : null;
}

function getSelectedLearningPack() {
  return getLatestLearningPack();
}

function getPackIdForDate(date) {
  return getPackArchiveEntriesForDate(date).at(0)?.packId || "";
}

function getPackArchiveEntriesForDate(date) {
  const entries = (state.learningPackArchive?.entries || [])
    .filter((entry) => entry.date === date && state.learningPacks?.[entry.packId]);
  const latestId = state.latestLearningPackId || "";
  return entries.sort((a, b) => {
    if (a.packId === latestId) return -1;
    if (b.packId === latestId) return 1;
    const published = String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""));
    if (published) return published;
    return String(b.packId || "").localeCompare(String(a.packId || ""));
  });
}

function getLearningPackDates() {
  return (state.learningPackArchive?.entries || [])
    .filter((entry) => state.learningPacks?.[entry.packId])
    .map((entry) => entry.date)
    .filter((date, index, arr) => date && arr.indexOf(date) === index)
    .sort();
}

function selectLearningPackDate(date, push = true) {
  const packId = getPackIdForDate(date);
  if (!packId) return false;
  state.selectedLearningPackId = packId;
  state.learningPackSelectionSource = "manual";
  saveState();
  showView(getActiveView(), push, { skipRouteDateSelection: true });
  return true;
}

function selectLatestLearningPackForPrimaryCourse() {
  const latestPackId = state.latestLearningPackId || "";
  if (!latestPackId || !state.learningPacks?.[latestPackId]) return false;
  state.selectedLearningPackId = latestPackId;
  state.learningPackSelectionSource = "auto";
  state.lastAutoSelectedBuiltinPackId = latestPackId;
  saveState();
  showView("today-chinese", true, { skipRouteDateSelection: true });
  return true;
}

function getDynamicEnglishWordsFromPacks() {
  return Object.values(state.learningPacks || {}).flatMap((record) => {
    const pack = record.data || record;
    const source = `daily_pack:${pack.packId}`;
    return (pack.english?.words || []).map((item) => ({
      ...item,
      source,
      packId: pack.packId,
      packDate: pack.date,
      anchorSentence: pack.english?.anchorSentence || "",
      translationZh: pack.english?.translationZh || ""
    }));
  });
}

function getTodayPackWordIds() {
  const pack = getLatestLearningPack();
  return new Set((pack?.english?.words || []).map((item) => item.id || normalizeEnglishWord(item.text)));
}

function getTodayPackBlockPattern() {
  const pack = getLatestLearningPack();
  if (!pack?.english?.anchorSentence) return null;
  const patternId = `daily_pack_${safeId(pack.packId)}`;
  const blocks = pack.english.pattern?.blocks?.length ? pack.english.pattern.blocks : splitSentenceToBlocks(pack.english.anchorSentence);
  return {
    id: patternId,
    category: "daily_pack",
    displayZh: "今日学习包",
    displayEn: "Today's Pack",
    displayFormulaZh: pack.english.pattern?.displayZh || "今日句子",
    displayFormulaEn: pack.english.anchorSentence,
    explanationZh: pack.english.translationZh || "来自今日学习包",
    example: pack.english.anchorSentence,
    translationZh: pack.english.translationZh || "",
    blocks,
    sourceTags: ["daily_pack"],
    sources: ["daily_pack"],
    exampleSeeds: [{
      english: pack.english.anchorSentence,
      chinese: pack.english.translationZh || "",
      source: "今日学习包 / Today's Pack"
    }]
  };
}

function getCourseProgress(packId = state.selectedLearningPackId || state.latestLearningPackId) {
  if (!packId) return null;
  state.courseProgress ||= {};
    state.courseProgress[packId] ||= {
    packId,
    learnerId: "helen",
    chinese: createDefaultCourseSide("chinese", packId),
    english: createDefaultCourseSide("english", packId),
    art: createDefaultCourseSide("art", packId),
    breaks: []
  };
  return state.courseProgress[packId];
}

function createDefaultCourseSide(course, packId = state.selectedLearningPackId || state.latestLearningPackId) {
  const base = {
    planet: course,
    courseId: course === "chinese" ? "reading-bridge" : course === "english" ? "daily-english" : "marker-drawing-foundations",
    lessonId: "",
    sessionId: createCourseSessionId(packId, course),
    timerModelVersion: COURSE_TIMER_MODEL_VERSION,
    startedAt: "",
    finishedAt: "",
    sessionStatus: "not_started",
    accumulatedMs: 0,
    elapsedMs: 0,
    isRunning: false,
    runningSince: null,
    lastHeartbeatAt: "",
    pausedAt: "",
    pauseReason: "",
    childEase: null,
    parentEase: null,
    hardest: "",
    hardestSections: [],
    audioFeedbackExpected: false,
    note: ""
  };
  if (course === "chinese") return { ...base, sections: {}, readingAnnotations: {} };
  if (course === "english") return { ...base, steps: {}, selectedMode: "", blockAnswers: {} };
  return { ...base, steps: {}, artworkPhotoExpected: false, artworkFileName: "" };
}

function createCourseSessionId(packId, course) {
  courseSessionCounter += 1;
  return `${packId || "pack"}:${course}:${Date.now().toString(36)}:${courseSessionCounter.toString(36)}`;
}

function initializeCourseProgress(pack) {
  if (!pack?.packId) return null;
  const progress = getCourseProgress(pack.packId);
  ["chinese", "english", "art"].forEach((course) => {
    progress[course].courseId = getCourseId(pack, course);
    progress[course].lessonId = getLessonId(pack, course);
    progress[course].sessionId ||= `${pack.packId}:${course}:${Date.now().toString(36)}`;
    progress[course].planet = course;
  });
  getChineseLessonSections(pack).forEach((section) => {
    const key = `chinese:${section.id}`;
    progress.chinese.sections[key] ||= {};
  });
  getEnglishLessonSteps(pack).forEach((step) => {
    const key = `english:${step.id}`;
    progress.english.steps[key] ||= {};
  });
  getArtLessonSteps(pack).forEach((step) => {
    const key = `art:${step.id}`;
    progress.art.steps[key] ||= {};
  });
  if (!progress.english.selectedMode) progress.english.selectedMode = pack.english?.lesson?.defaultMode || pack.sharedPlan?.defaultEnglishMode || pack.loadMode || "light";
  return progress;
}

function renderTodayDashboard() {
  const pack = getLatestLearningPack();
  const panel = $("#todayDashboardPanel");
  if (!panel) return;
  if (!pack) {
    panel.hidden = true;
    return;
  }
  initializeCourseProgress(pack);
  panel.hidden = false;
  const progress = getCourseProgress(pack.packId);
  const chineseDone = countCompletedCourseItems(progress.chinese.sections);
  const chineseTotal = getChineseLessonSections(pack).length;
  const englishDone = countCompletedCourseItems(progress.english.steps);
  const englishTotal = getEnglishLessonSteps(pack).length;
  const selectedMode = getSelectedEnglishMode(pack);
  const readiness = getFullCourseReadiness(pack);
  $("#todayDashboardTitle").textContent = `${pack.date} · ${pack.title || "Helen 每日学习"}`;
  $("#todayDashboardSummary").innerHTML = `
    <div class="today-metrics">
      <div><strong>日期</strong><span>${escapeHtml(pack.date)}</span></div>
      <div><strong>课程标题</strong><span>${escapeHtml(pack.title || pack.chinese?.lesson?.title || "今日学习")}</span></div>
      <div><strong>中文预计</strong><span>${getPlannedChineseMinutes(pack)} 分钟</span></div>
      <div><strong>英语模式</strong><span>${escapeHtml(englishModeLabel(selectedMode))} · ${getPlannedEnglishMinutes(pack, selectedMode)} 分钟</span></div>
      <div><strong>共同负荷</strong><span>${escapeHtml(loadModeLabel(pack.loadMode))}</span></div>
      <div><strong>完成进度</strong><span>中文 ${chineseDone}/${chineseTotal} · 英语 ${englishDone}/${englishTotal}</span></div>
    </div>
    <p class="pack-muted">${escapeHtml(pack.sharedPlan?.sequenceNoteZh || "中文和英语可以分时完成")}</p>
    ${readiness.ready ? "" : renderCourseMissingBox(readiness.missing, "完整每日课程尚未就绪")}
  `;
}

function renderPlanetOverview() {
  const container = $("#planetOverview");
  if (!container) return;
  const pack = getLatestLearningPack();
  const cards = PLANET_REGISTRY.filter((planet) => planet.enabled).map((planet) => buildPlanetCard(planet, pack));
  container.innerHTML = cards.join("") + `
    <article class="planet-card planet-parent parent-console-card">
      <div class="planet-orb" aria-hidden="true"></div>
      <p>Parent Observatory</p>
      <h2>家长观察站</h2>
      <div class="planet-status"><span>◌ 查看进度</span><span>◌ 记录观察</span><span>◌ 生成反馈</span></div>
      <button class="button secondary" data-go-view="parent" type="button">打开<br /><span>Open</span></button>
    </article>
  `;
}

function buildPlanetCard(planet, pack) {
  const kind = planet.id;
  const status = getPlanetStatus(kind, pack);
  const actionText = status.hasCourse ? "继续探索" : "看看星球";
  return `
    <article class="planet-card planet-${kind}" data-planet-theme="${escapeHtml(planet.theme)}">
      <div class="planet-orb" aria-hidden="true">${escapeHtml(planet.icon)}</div>
      <p>${escapeHtml(planet.nameEn)}</p>
      <h2>${escapeHtml(planet.nameZh)}</h2>
      <div class="planet-symbols" aria-hidden="true">
        ${planet.symbols.map((symbol) => `<span>${escapeHtml(symbol)}</span>`).join("")}
      </div>
      <div class="planet-status">
        <span>● ${escapeHtml(status.hasCourse ? "今天有课" : "今天未安排")}</span>
        <span>◷ ${escapeHtml(status.minutes ? `${status.minutes} 分钟` : "按需")}</span>
        <span>◎ ${escapeHtml(status.progress)}</span>
      </div>
      <button class="button primary" data-go-view="${escapeHtml(planet.route)}" type="button">${escapeHtml(actionText)}<br /><span>Start</span></button>
    </article>
  `;
}

function getPlanetStatus(kind, pack) {
  if (!pack) return { hasCourse: false, minutes: 0, progress: "等待学习包" };
  const progress = getCourseProgress(pack.packId);
  if (kind === "chinese") {
    const total = getChineseLessonSections(pack).length;
    const done = countCompletedCourseItems(progress.chinese.sections);
    return { hasCourse: Boolean(pack.chinese?.lesson || pack.chinese?.characters?.length || pack.chinese?.words?.length), minutes: getPlannedChineseMinutes(pack), progress: `${done}/${total}` };
  }
  if (kind === "english") {
    const total = getEnglishLessonSteps(pack).length;
    const done = countCompletedCourseItems(progress.english.steps);
    return { hasCourse: Boolean(pack.english?.lesson || pack.english?.words?.length || pack.english?.anchorSentence), minutes: getPlannedEnglishMinutes(pack), progress: `${done}/${total}` };
  }
  if (kind === "art") {
    const total = getArtLessonSteps(pack).length;
    const done = countCompletedCourseItems(progress.art.steps);
    return { hasCourse: Boolean(pack.art), minutes: pack.art?.plannedMinutes || 0, progress: total ? `${done}/${total}` : "待开启" };
  }
  return { hasCourse: true, minutes: 0, progress: "导入与反馈" };
}

function renderPlanetPages() {
  const pack = getLatestLearningPack();
  renderPlanetModules("#chinesePlanetSummary", [
    planetModule("今日阅读", "按学习包顺序完成中文课", "today-chinese", getPlanetStatus("chinese", pack)),
    planetModule("识字练习", "练习今日目标字", "characters"),
    planetModule("生字本", "查看自动同步的字词", "wordbook"),
    planetModule("字典", "查询一个汉字", "dictionary")
  ]);
  renderPlanetModules("#englishPlanetSummary", [
    planetModule("今日英语", "七步英语课", "today-english", getPlanetStatus("english", pack)),
    planetModule("单词认读", "练今日包单词", "english"),
    planetModule("积木英语", "拼句与句型", "english-blocks"),
    planetModule("学习记录", "到家长观察站生成反馈", "parent")
  ]);
  renderPlanetModules("#artPlanetSummary", [
    planetModule("今日马克笔画", "材料、步骤、作品完成", "today-art", getPlanetStatus("art", pack)),
    planetModule("基础技能", "线条、形状、平涂", "today-art"),
    planetModule("作品画廊", "本机保存作品记录", "today-art"),
    planetModule("材料与准备", "安全画材和桌面保护", "today-art")
  ]);
}

function planetModule(title, desc, view, status = null) {
  return { title, desc, view, status };
}

function renderPlanetModules(selector, modules) {
  const container = $(selector);
  if (!container) return;
  container.innerHTML = renderDateSwitcher() + modules.map((module) => `
    <article class="surface planet-module-card">
      <span class="landing-dot" aria-hidden="true"></span>
      <h2>${escapeHtml(module.title)}</h2>
      <p>${escapeHtml(module.desc)}</p>
      ${module.status ? `<p class="pack-muted">${escapeHtml(module.status.progress)} · ${module.status.minutes ? `${module.status.minutes} 分钟` : "按需"}</p>` : ""}
      <button class="button primary" data-go-view="${escapeHtml(module.view)}" type="button">进入<br /><span>Open</span></button>
    </article>
  `).join("");
}

function renderDateSwitcher() {
  const dates = getLearningPackDates();
  const pack = getSelectedLearningPack();
  if (!pack) return "";
  const currentIndex = dates.indexOf(pack.date);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < dates.length - 1;
  return `
    <div class="date-switcher">
      <button class="button ghost compact-button" data-date-nav="prev" ${canPrev ? "" : "disabled"} type="button">← 前一天</button>
      <button class="button secondary compact-button" data-date-nav="today" type="button">今天<br /><span>Today</span></button>
      <button class="button ghost compact-button" data-date-nav="next" ${canNext ? "" : "disabled"} type="button">后一天 →</button>
      <details class="date-menu">
        <summary>往日课程</summary>
        <div class="date-menu-list">
          ${dates.map((date) => `<button class="button ${date === pack.date ? "primary" : "secondary"} compact-button" data-pack-date="${escapeHtml(date)}" type="button">${escapeHtml(date)}</button>`).join("")}
        </div>
      </details>
    </div>
  `;
}

function renderChineseLesson() {
  const pack = getLatestLearningPack();
  if (!$("#chineseLessonHeader")) return;
  if (!pack) {
    $("#chineseLessonHeader").innerHTML = renderEmptyCourse("请先导入今日学习包");
    $("#chineseLessonSections").innerHTML = "";
    return;
  }
  initializeCourseProgress(pack);
  const readiness = getFullCourseReadiness(pack, "chinese");
  if (!readiness.ready) {
    $("#chineseLessonHeader").innerHTML = renderCourseMissingBox(readiness.missing);
    $("#chineseLessonSections").innerHTML = "";
    return;
  }
  const progress = getCourseProgress(pack.packId);
  const sections = getChineseLessonSections(pack);
  $("#chineseLessonHeader").innerHTML = `
    <div class="course-pack-load-status">${renderBuiltinPackLoadNotice(pack)}</div>
    ${renderDateSwitcher()}
    <div class="course-topline">
      <div>
        <p class="eyebrow">每日中文 / Daily Chinese</p>
        <h2>${escapeHtml(pack.chinese?.lesson?.title || pack.title || "今日中文课")}</h2>
        <p class="pack-muted">预计 ${getPlannedChineseMinutes(pack)} 分钟 · 按顺序完成，口头回答只需点选结果</p>
      </div>
    </div>
    ${renderCourseStartSettings("chinese", progress.chinese, sections)}
  `;
  $("#chineseLessonSections").innerHTML = sections.map((section, index) => renderChineseSection(pack, section, index, progress)).join("") + renderCourseEndFeedback("chinese", progress.chinese, sections);
}

function renderEnglishLesson() {
  const pack = getLatestLearningPack();
  if (!$("#englishLessonHeader")) return;
  if (!pack) {
    $("#englishLessonHeader").innerHTML = renderEmptyCourse("请先导入今日学习包");
    $("#englishListeningZone").innerHTML = "";
    $("#englishLessonSteps").innerHTML = "";
    return;
  }
  initializeCourseProgress(pack);
  const readiness = getFullCourseReadiness(pack, "english");
  if (!readiness.ready) {
    $("#englishLessonHeader").innerHTML = renderCourseMissingBox(readiness.missing);
    $("#englishListeningZone").innerHTML = "";
    $("#englishLessonSteps").innerHTML = "";
    return;
  }
  const progress = getCourseProgress(pack.packId);
  const selectedMode = getSelectedEnglishMode(pack);
  const suggestedMode = getSuggestedEnglishMode(pack, progress);
  const steps = getEnglishLessonSteps(pack);
  $("#englishLessonHeader").innerHTML = `
    <div class="course-pack-load-status">${renderBuiltinPackLoadNotice(pack)}</div>
    ${renderDateSwitcher()}
    <div class="course-topline">
      <div>
        <p class="eyebrow">字母星球 / Letter Planet</p>
        <h2>${escapeHtml(pack.english?.lesson?.anchorSentence || pack.english?.anchorSentence || "今日英语")}</h2>
        <p class="pack-muted">${escapeHtml(pack.english?.lesson?.translationZh || pack.english?.translationZh || "")}</p>
        <p class="pack-muted">建议 ${escapeHtml(englishModeLabel(suggestedMode))} · 当前 ${escapeHtml(englishModeLabel(selectedMode))} · 预计 ${getPlannedEnglishMinutes(pack, selectedMode)} 分钟</p>
      </div>
      <div class="mode-picker">${getAllowedEnglishModes(pack).map((mode) => `<button class="button ${mode === selectedMode ? "primary" : "secondary"} compact-button" data-english-mode="${escapeHtml(mode)}" type="button">${escapeHtml(englishModeLabel(mode))}</button>`).join("")}</div>
    </div>
    <div class="course-app-path">
      <strong>准备</strong>
      <span>${escapeHtml(renderAppPath(pack))}</span>
    </div>
    ${renderCourseStartSettings("english", progress.english, steps, { pack, selectedMode, suggestedMode })}
  `;
  const listeningSteps = steps.filter((step) => step.number <= 4 || ["retrieval", "blind_listening", "meaning_and_text", "echo"].includes(step.id));
  const websiteSteps = steps.filter((step) => !listeningSteps.includes(step));
  $("#englishListeningZone").innerHTML = renderListeningZone(pack, listeningSteps, selectedMode, progress);
  $("#englishLessonSteps").innerHTML = websiteSteps.map((step, index) => renderEnglishStep(pack, step, index + listeningSteps.length, selectedMode, progress)).join("") + renderCourseEndFeedback("english", progress.english, steps);
}

function renderArtLesson() {
  const pack = getLatestLearningPack();
  if (!$("#artLessonHeader")) return;
  if (!pack) {
    $("#artLessonHeader").innerHTML = renderEmptyCourse("请先导入今日学习包");
    $("#artLessonSections").innerHTML = "";
    return;
  }
  initializeCourseProgress(pack);
  if (!pack.art) {
    $("#artLessonHeader").innerHTML = renderEmptyCourse("今天未安排美术课");
    $("#artLessonSections").innerHTML = "";
    return;
  }
  const progress = getCourseProgress(pack.packId);
  const steps = getArtLessonSteps(pack);
  $("#artLessonHeader").innerHTML = `
    <div class="course-pack-load-status">${renderBuiltinPackLoadNotice(pack)}</div>
    ${renderDateSwitcher()}
    <div class="course-topline">
      <div>
        <p class="eyebrow">颜色星球 / Color Planet</p>
        <h2>${escapeHtml(pack.art.title || "今日马克笔画")}</h2>
        <p class="pack-muted">预计 ${pack.art.plannedMinutes || 20} 分钟 · ${(pack.art.skillFocus || pack.art.techniqueFocus || []).map(escapeHtml).join("、") || "轻松创作"}</p>
      </div>
    </div>
    ${renderCourseStartSettings("art", progress.art, steps)}
    <div class="art-prep-grid">
      <section><h3>材料准备</h3><div class="course-chip-list">${(pack.art.materials || []).map((item) => `<span>${escapeHtml(item.required ? "必备 " : "可选 ")}${escapeHtml(item.nameZh || item.name)}</span>`).join("") || "<span>按学习包准备</span>"}</div></section>
      <section><h3>安全提示</h3><ul>${getArtSafetyNotes(pack).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    </div>
    <div class="actions compact">
      <label class="button secondary artwork-upload">选择作品照片<br /><span>Photo</span><input id="artworkPhotoInput" type="file" accept="image/png,image/jpeg,image/webp" hidden /></label>
    </div>
  `;
  bindArtworkPhotoInput();
  const warmup = pack.art.warmup ? [pack.art.warmup] : [];
  $("#artLessonSections").innerHTML = [...warmup, ...steps].map((step, index) => renderArtStep(pack, step, index, progress)).join("") + renderArtCompletion(pack, progress) + renderCourseEndFeedback("art", progress.art, steps);
  preloadArtLessonImages(pack);
}

function normalizeReadAloudConfig(config = {}, fallbackText = "", fallbackPolicy = "instruction_only") {
  config ||= {};
  return {
    policy: config.policy || fallbackPolicy || "instruction_only",
    spokenTextZh: safePlainText(config.spokenTextZh || fallbackText || "", 500),
    optionSpokenTexts: Array.isArray(config.optionSpokenTexts) ? config.optionSpokenTexts.map((item) => safePlainText(item, 120)).filter(Boolean).slice(0, 8) : [],
    audioAssetId: safeId(config.audioAssetId || ""),
    slowAudioAssetId: safeId(config.slowAudioAssetId || ""),
    audioUrl: safePlainText(config.audio?.url || config.audioUrl || "", 400),
    voiceId: safePlainText(config.audio?.voiceId || "", 80),
    textHash: safePlainText(config.audio?.textHash || "", 80)
  };
}

function getReadAloudText(config, options = {}) {
  if (!config || config.policy === "disabled_during_assessment") return "";
  if (options.assessment && options.targetText && config.spokenTextZh?.includes(options.targetText)) return "";
  if (config.policy === "prompt_and_options" && config.optionSpokenTexts?.length) {
    return [config.spokenTextZh, ...config.optionSpokenTexts.map((item, index) => `${String.fromCharCode(65 + index)}，${item}`)].filter(Boolean).join("。");
  }
  return config.spokenTextZh || "";
}

function renderReadAloudButton(activityKey, config, options = {}) {
  const text = getReadAloudText(config, options);
  if (!text) return "";
  return `<button class="read-aloud-icon" data-read-aloud="${escapeHtml(activityKey)}" data-read-text="${escapeHtml(text)}" data-audio-url="${escapeHtml(config.audioUrl || "")}" data-audio-asset="${escapeHtml(config.audioAssetId || "")}" data-slow-audio-asset="${escapeHtml(config.slowAudioAssetId || "")}" data-voice-id="${escapeHtml(config.voiceId || "")}" data-text-hash="${escapeHtml(config.textHash || "")}" data-assessment-risk="${options.assessmentRisk ? "true" : ""}" type="button" aria-label="朗读题目">${speakerIconSvg(false)}</button>`;
}

function speakerIconSvg(playing = false) {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 9.25h3.1l4.4-3.35v12.2l-4.4-3.35h-3.1z"></path>
      <path d="M16.1 8.2c1.05.95 1.65 2.24 1.65 3.8s-.6 2.85-1.65 3.8"></path>
      ${playing ? `<path d="M18.85 6.1c1.55 1.5 2.4 3.47 2.4 5.9s-.85 4.4-2.4 5.9"></path>` : ""}
    </svg>
  `;
}

function renderPromptRow(textHtml, readButton = "", className = "") {
  return `<div class="prompt-row ${escapeHtml(className)}"><div class="prompt-text">${textHtml}${readButton}</div></div>`;
}

function toggleReadAloud(button) {
  const key = button.dataset.readAloud || "";
  if (currentReadAloud.key === key && button.classList.contains("is-playing")) {
    stopReadAloud();
    return;
  }
  stopReadAloud();
  const text = button.dataset.readText || "";
  if (!text) {
    button.dataset.error = "true";
    button.title = "没有播放成功，请再点一次";
    return;
  }
  const audioUrl = button.dataset.audioUrl || "";
  recordReadAloudUse(key, {
    voiceSource: audioUrl || button.dataset.audioAsset ? "pack_audio" : "device_tts",
    slow: button.dataset.slow === "true",
    assessmentInvalidated: button.dataset.assessmentRisk === "true"
  });
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.onended = () => stopReadAloud(false);
    audio.onerror = () => {
      recordReadAloudUse(key, { failed: true, voiceSource: "pack_audio" });
      playReadAloudWithDeviceVoice(button, key, text);
    };
    button.classList.add("is-playing");
    button.setAttribute("aria-label", "停止朗读");
    button.innerHTML = speakerIconSvg(true);
    currentReadAloud = { key, audio, utterance: null, button };
    audio.play().catch(() => {
      recordReadAloudUse(key, { failed: true, voiceSource: "pack_audio" });
      playReadAloudWithDeviceVoice(button, key, text);
    });
    return;
  }
  playReadAloudWithDeviceVoice(button, key, text);
}

function playReadAloudWithDeviceVoice(button, key, text) {
  if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = button.dataset.slow === "true" ? 0.85 : 0.92;
    utterance.volume = 1;
    const voices = speechSynthesis.getVoices?.() || [];
    utterance.voice = selectBestChineseVoice(voices);
    utterance.onend = () => stopReadAloud(false);
    utterance.onerror = () => {
      recordReadAloudUse(key, { failed: true });
      button.dataset.error = "true";
      button.title = "没有播放成功，请再点一次";
      stopReadAloud(false);
    };
    button.classList.add("is-playing");
    button.setAttribute("aria-label", "停止朗读");
    button.innerHTML = speakerIconSvg(true);
    currentReadAloud = { key, utterance, audio: null, button };
    speechSynthesis.speak(utterance);
  } else {
    recordReadAloudUse(key, { failed: true, voiceSource: "unavailable" });
    button.dataset.error = "true";
    button.title = "没有播放成功，请再点一次";
  }
}

function selectBestChineseVoice(voices = []) {
  const zhVoices = voices.filter((voice) => /zh|cmn|Chinese|中文/i.test(`${voice.lang} ${voice.name}`));
  const quality = /(natural|premium|google|microsoft|ting|mei|xia|yao|siri|婷婷|晓|美|女)/i;
  return zhVoices.find((voice) => quality.test(voice.name)) || zhVoices[0] || null;
}

function stopReadAloud(cancel = true) {
  if (cancel && "speechSynthesis" in window) speechSynthesis.cancel();
  if (currentReadAloud.audio) {
    currentReadAloud.audio.pause();
    currentReadAloud.audio.currentTime = 0;
  }
  currentReadAloud.button?.classList.remove("is-playing");
  currentReadAloud.button?.setAttribute("aria-label", "朗读题目");
  if (currentReadAloud.button) currentReadAloud.button.innerHTML = speakerIconSvg(false);
  currentReadAloud = { key: "", utterance: null, audio: null, button: null };
}

function recordReadAloudUse(key, detail = {}) {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  bucket[key] = {
    ...item,
    readAloudUsed: true,
    readAloudCount: (item.readAloudCount || 0) + (detail.failed ? 0 : 1),
    voiceSource: detail.voiceSource || item.voiceSource || "device_tts",
    readAloudSlowUsed: Boolean(detail.slow || item.readAloudSlowUsed),
    readAloudFailed: Boolean(detail.failed || item.readAloudFailed),
    assessmentInvalidated: Boolean(detail.assessmentInvalidated || item.assessmentInvalidated),
    updatedAt: new Date().toISOString()
  };
  saveState();
}

function renderArtStep(pack, step, index, progress) {
  const key = `art:${step.id}`;
  const itemProgress = progress.art.steps[key] || {};
  if (step.type === "break" || step.id === "break") return renderBreakCard(key, step.titleZh || step.title || "休息一下", step.plannedMinutes || 5, itemProgress, step.instructionZh || step.parentPromptZh || "");
  const readAloud = normalizeReadAloudConfig(step.readAloud || step.narration, step.narration?.textZh || step.instructionZh || "", "full");
  const lock = getArtStepLock(pack, step, progress);
  const asset = resolveArtImageAsset(pack, step.imageAssetId || step.referenceAssetId || "");
  return `
    <article class="course-card art-step-card ${lock.locked ? "is-locked" : ""}" data-course-card="${escapeHtml(key)}" ${lock.locked ? `data-art-locked="${escapeHtml(lock.gateId)}"` : ""}>
      <div class="course-card-head">
        <div><span>${index + 1}</span>${renderPromptRow(`<h3>${escapeHtml(step.title)}</h3>`, "")}<p>${escapeHtml(step.parentPromptZh || "看一小步，动手完成")}</p></div>
        <strong>${step.plannedMinutes || 0} 分钟</strong>
      </div>
      ${lock.locked ? `<div class="pack-warning art-lock-message">先完成第 ${lock.requiredOrder} 步：${escapeHtml(lock.messageZh || "草稿检查完成后，才能打开下一步。")}</div>` : ""}
      <div class="art-step-layout">
        ${renderArtImageFrame(asset, step)}
        <div class="art-action-panel">
          ${renderPromptRow(`<p class="art-action-line">${escapeHtml(step.instructionZh || "按图完成这一小步")}</p>`, renderReadAloudButton(key, readAloud))}
          <div class="art-step-facts">
            <section>
              <strong>孩子现在做什么</strong>
              <p>${escapeHtml(step.childActionZh || step.instructionZh || "按图完成这一小步")}</p>
            </section>
            <section>
              <strong>做到什么算完成</strong>
              <p>${escapeHtml(step.successCriteriaZh || "完成当前步骤")}</p>
            </section>
            <section>
              <strong>怎么检查</strong>
              <p>${escapeHtml(step.completionCheckZh || "对照步骤图检查")}</p>
            </section>
            <section>
              <strong>最常见错误</strong>
              <p>${escapeHtml(step.commonMistakeZh || "不要急着进入下一步")}</p>
            </section>
          </div>
          ${step.parentPromptZh ? `<details class="parent-prompt-detail"><summary>家长提示</summary><p>${escapeHtml(step.parentPromptZh)}</p></details>` : ""}
          <div class="actions compact">
            ${step.hintLevels?.length ? `<button class="button ghost compact-button" data-art-hint="${escapeHtml(key)}" data-hint-level="1" ${lock.locked ? "disabled" : ""} type="button">看小提示<br /><span>Hint</span></button>` : ""}
          </div>
          <div class="art-hints">${(step.hintLevels || []).map((hint, hintIndex) => `<p data-art-hint-text="${escapeHtml(key)}" data-hint-index="${hintIndex + 1}" hidden>${escapeHtml(hint.textZh || hint)}</p>`).join("")}</div>
          <div class="actions compact">
            <button class="button success compact-button" data-course-complete="${escapeHtml(key)}" ${lock.locked ? "disabled" : ""} type="button">我画好了<br /><span>Done</span></button>
            <button class="button secondary compact-button" data-course-result="${escapeHtml(key)}" data-result-value="modeled" ${lock.locked ? "disabled" : ""} type="button">需要一点帮助<br /><span>Help</span></button>
            <button class="button secondary compact-button" data-course-pause="art" type="button">暂停<br /><span>Pause</span></button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderArtImageFrame(asset, step) {
  const label = step.title || step.titleZh || "步骤图";
  if (!asset?.url) {
    return `
      <div class="art-image-frame art-image-missing" role="status">
        <span>${step.imageAssetId ? "步骤图文件暂未到位" : "学习包未提供步骤图"}</span>
        ${step.imageAssetId ? `<small>缺少：${escapeHtml(step.imageAssetId)}</small>` : ""}
      </div>
    `;
  }
  const stepNumber = Number(step.order || 0) || "";
  const stepLabel = stepNumber ? `第${stepNumber}步` : "本步骤";
  const alt = asset.altZh || label;
  return `
    <div class="art-image-frame art-image-loading" data-art-image-frame="true" data-art-image-step="${escapeHtml(stepNumber || label)}" data-art-image-base-url="${escapeHtml(asset.url)}" data-art-image-alt="${escapeHtml(alt)}">
      <span class="art-image-loading-label" data-art-image-loading-label="true">${escapeHtml(stepLabel)}图片正在加载</span>
      <button class="art-image-preview" data-art-image-open="${escapeHtml(asset.url)}" data-art-image-alt="${escapeHtml(alt)}" type="button">
        <img src="${escapeHtml(asset.url)}" alt="${escapeHtml(alt)}" loading="eager" decoding="async" />
        <small>可放大查看</small>
      </button>
      <div class="art-image-fallback" role="status" hidden>
        <span>${escapeHtml(stepLabel)}图片加载失败</span>
        <button class="button secondary compact-button" data-art-image-retry="true" type="button">重新加载图片</button>
      </div>
    </div>
  `;
}

function preloadArtLessonImages(pack) {
  if (typeof Image !== "function") return;
  const steps = getArtLessonSteps(pack);
  for (const step of steps) {
    const asset = resolveArtImageAsset(pack, step.imageAssetId || step.referenceAssetId || "");
    if (!asset?.url || artImagePreloadCache.has(asset.url)) continue;
    const image = new Image();
    image.decoding = "async";
    image.loading = "eager";
    image.src = asset.url;
    artImagePreloadCache.set(asset.url, image);
  }
}

function handleArtImageLoad(event) {
  const image = event.target;
  if (image?.matches?.(".art-lightbox-panel img")) {
    const panel = image.closest(".art-lightbox-panel");
    panel?.querySelector?.(".art-lightbox-loading")?.setAttribute("hidden", "");
    return;
  }
  if (!image?.matches?.(".art-image-frame img")) return;
  const frame = image.closest("[data-art-image-frame]");
  if (!frame) return;
  frame.classList.remove("art-image-loading", "is-error");
  frame.classList.add("is-loaded");
  frame.querySelector("[data-art-image-loading-label]")?.setAttribute("hidden", "");
  const fallback = frame.querySelector(".art-image-fallback");
  if (fallback) fallback.hidden = true;
  const preview = frame.querySelector(".art-image-preview");
  if (preview) preview.hidden = false;
  image.hidden = false;
}

function handleArtImageError(event) {
  const image = event.target;
  if (image?.matches?.(".art-lightbox-panel img")) {
    const panel = image.closest(".art-lightbox-panel");
    panel?.querySelector?.(".art-lightbox-loading")?.setAttribute("hidden", "");
    const error = panel?.querySelector?.(".art-lightbox-error");
    if (error) error.hidden = false;
    image.hidden = true;
    return;
  }
  if (!image?.matches?.(".art-image-frame img")) return;
  const frame = image.closest("[data-art-image-frame]");
  if (!frame) return;
  frame.classList.remove("art-image-loading", "is-loaded");
  frame.classList.add("is-error");
  frame.querySelector("[data-art-image-loading-label]")?.setAttribute("hidden", "");
  image.hidden = true;
  const preview = frame.querySelector(".art-image-preview");
  if (preview) preview.hidden = true;
  const fallback = frame.querySelector(".art-image-fallback");
  if (fallback) fallback.hidden = false;
}

function retryArtImage(button) {
  const frame = button.closest("[data-art-image-frame]");
  if (!frame || frame.dataset.artImageRetried === "true") return;
  const baseUrl = frame.dataset.artImageBaseUrl || "";
  const image = frame.querySelector("img");
  const preview = frame.querySelector(".art-image-preview");
  if (!baseUrl || !image || !preview) return;
  const retryUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}retry=${Date.now()}`;
  frame.dataset.artImageRetried = "true";
  frame.classList.remove("is-error", "is-loaded");
  frame.classList.add("art-image-loading");
  frame.querySelector("[data-art-image-loading-label]")?.removeAttribute("hidden");
  const fallback = frame.querySelector(".art-image-fallback");
  if (fallback) fallback.hidden = true;
  preview.hidden = false;
  preview.dataset.artImageOpen = retryUrl;
  image.hidden = false;
  image.src = retryUrl;
}

function resolveArtImageAsset(pack, assetId) {
  const id = safeId(assetId || "");
  if (!id) return null;
  const manifest = pack?.art?.assetManifest;
  const asset = manifest?.assets?.find((item) => item.id === id);
  if (!asset || !/^image\/(png|jpeg|webp)$/.test(asset.mime || "")) return null;
  const fileName = sanitizeAssetFileName(asset.fileName || "");
  if (!fileName) return null;
  const basePath = sanitizeAssetBasePath(pack?.art?.assetBasePath || "assets/art/color-planet-lesson-01");
  return {
    id,
    url: `${basePath}/${fileName}`,
    mime: asset.mime,
    altZh: safePlainText(asset.altZh || asset.alt || "", 120)
  };
}

function openArtImageLightbox(url, alt = "步骤图") {
  if (!url || !document?.body) return;
  closeArtImageLightbox();
  const overlay = document.createElement("div");
  overlay.className = "art-lightbox";
  overlay.dataset.artLightbox = "true";
  overlay.innerHTML = `
    <div class="art-lightbox-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(alt)}">
      <button class="art-lightbox-close" data-art-lightbox-close="true" type="button" aria-label="关闭步骤图">×</button>
      <span class="art-lightbox-loading">步骤图正在加载</span>
      <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="eager" decoding="async" />
      <div class="art-lightbox-error" role="status" hidden>
        <span>放大图没有加载成功</span>
        <button class="button secondary compact-button" data-art-lightbox-close="true" type="button">返回步骤卡</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeArtImageLightbox() {
  document.querySelector("[data-art-lightbox]")?.remove();
}

function getArtStepLock(pack, step, progress) {
  const steps = getArtLessonSteps(pack);
  const currentOrder = Number(step.order || 0);
  const gateStep = steps.find((item) => item.hardGate?.requiredBeforeNext && Number(item.order || 0) < currentOrder);
  if (!gateStep) return { locked: false };
  const gateKey = `art:${gateStep.id}`;
  const completed = Boolean(progress?.art?.steps?.[gateKey]?.finishedAt);
  return {
    locked: !completed,
    gateId: gateStep.hardGate?.id || gateStep.id,
    requiredOrder: gateStep.order,
    requiredStepId: gateStep.id,
    messageZh: gateStep.hardGate?.messageZh || "草稿检查完成后，才能打开下一步。"
  };
}

function renderArtCompletion(pack, progress) {
  return `
    <article class="course-card">
      <div class="course-card-head">
        <div><span>✓</span><h3>作品完成页</h3><p>${escapeHtml(pack.art?.completionCriteriaZh || "今天先到这里也很好")}</p></div>
      </div>
      ${pack.art?.reflection?.length ? `<div class="course-chip-list">${pack.art.reflection.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
      <p class="pack-muted">作品照片只在家长明确选择后本地记录文件名，不会自动上传。</p>
    </article>
  `;
}

function getArtLessonSteps(pack) {
  return pack?.art?.steps || [];
}

function getArtSafetyNotes(pack) {
  const notes = pack.art?.safetyNotesZh?.length ? pack.art.safetyNotesZh : ["优先使用无毒、儿童安全的水性马克笔", "保护桌面，保持通风", "成人在旁陪同"];
  const materialText = (pack.art?.materials || []).map((item) => item.nameZh || item.name).join(" ");
  if (/酒精/.test(materialText) && !notes.some((item) => item.includes("通风"))) {
    return [...notes, "酒精马克笔需通风、保护桌面，并由成人陪同"];
  }
  return notes;
}

function bindArtworkPhotoInput() {
  const input = $("#artworkPhotoInput");
  if (!input || input.dataset.bound) return;
  input.dataset.bound = "true";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const progress = getCourseProgress();
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      $("#reportPanel").textContent = "作品照片需为 PNG/JPG/WebP，且小于5MB。";
      return;
    }
    progress.art.artworkPhotoExpected = true;
    progress.art.artworkFileName = safePlainText(file.name, 160);
    saveState();
    renderArtLesson();
  });
}

function getChineseLessonSections(pack) {
  const sections = pack.chinese?.lesson?.sections || [];
  if (sections.length) return sections;
  return [{
    id: "daily_words",
    type: "post_check",
    title: "今日字词",
    plannedMinutes: Math.max(3, Math.min(10, (pack.chinese?.characters?.length || 0) + (pack.chinese?.words?.length || 0))),
    parentInstructionZh: "请孩子直接认读，能说意思更好。",
    characters: (pack.chinese?.characters || []).map((item) => item.text),
    words: (pack.chinese?.words || []).map((item) => item.text),
    answerMode: "spoken"
  }];
}

function getEnglishLessonSteps(pack) {
  return pack.english?.lesson?.steps || [];
}

function renderChineseSection(pack, section, index, progress) {
  const key = `chinese:${section.id}`;
  const itemProgress = progress.chinese.sections[key] || {};
  if (section.type === "break" || section.id === "break") return renderBreakCard(key, section.title || "休息一下", section.plannedMinutes || 5, itemProgress, getChineseSectionChildInstruction(section));
  const assessment = ["post_check", "word_review"].includes(section.type);
  const childInstruction = getChineseSectionChildInstruction(section);
  const readText = assessment ? (childInstruction || "请按要求完成这一部分。") : [section.title, childInstruction || section.prompt || ""].filter(Boolean).join("。");
  const readAloud = normalizeReadAloudConfig(section.readAloud, readText, assessment ? "instruction_only" : "full");
  return `
    <article class="course-card" data-course-card="${escapeHtml(key)}">
      <div class="course-card-head">
        <div><span>${index + 1}</span>${renderPromptRow(`<h3>${escapeHtml(section.title)}</h3>`, renderReadAloudButton(key, readAloud, { assessment, targetText: [...(section.characters || []), ...(section.words || [])].join("") }))}<p>${escapeHtml(childInstruction || "按提示完成即可")}</p></div>
        <strong>${section.plannedMinutes || 0} 分钟</strong>
      </div>
      ${renderChineseSectionBody(pack, section, itemProgress)}
      ${renderCourseItemControls(key, itemProgress)}
    </article>
  `;
}

function getChineseSectionChildInstruction(section) {
  return safePlainText(section?.childInstructionZh || section?.childVisible?.instructionZh || section?.prompt || "", 260);
}

function renderChineseSectionBody(pack, section, itemProgress = {}) {
  if (section.paragraphs?.length) {
    return renderInteractiveReadingText(section);
  }
  const termItems = getChineseSectionTermItems(pack, section);
  const actionItems = getChineseActionItems(section);
  if (section.questions?.length) {
    return `
      ${termItems.length ? renderChineseTermList(termItems) : ""}
      ${actionItems.length ? renderChineseActionItems(actionItems) : ""}
      <div class="course-question-list">${section.questions.map((question, index) => renderCourseQuestion(question, `${section.id}_${index}`, itemProgress, index)).join("")}</div>
    `;
  }
  if (section.prompts?.length) {
    return `<div class="four-grid">${section.prompts.map((prompt, index) => `<div class="four-grid-item"><strong>${index + 1}</strong><span>${escapeHtml(prompt)}</span><button class="button secondary compact-button four-grid-action" data-course-result="chinese:${escapeHtml(section.id)}:grid:${index}" data-result-value="independent" type="button">完成</button></div>`).join("")}</div>`;
  }
  if (actionItems.length) return renderChineseActionItems(actionItems);
  if (termItems.length) return renderChineseTermList(termItems);
  if (section.prompt) return `<p class="course-prompt">${escapeHtml(section.prompt)}</p>`;
  return `<p class="pack-muted">按家长提示完成这一部分。</p>`;
}

function getChineseSectionTermItems(pack, section) {
  return [
    ...(section.items || []).filter((item) => !isChineseActionItem(item)).map((item) => item.text),
    ...(section.characters || []).map((item) => section.type === "post_check" ? safePlainText(item?.text || item, 8) : formatChineseCharacterTerm(pack, item)),
    ...(section.words || [])
  ].filter(Boolean);
}

function getChineseActionItems(section) {
  return (section.items || []).filter(isChineseActionItem);
}

function isChineseActionItem(item) {
  return Boolean(item?.stepsZh?.length || item?.responseMode);
}

function renderChineseActionItems(items = []) {
  return `
    <div class="chinese-action-list">
      ${items.map((item, index) => `
        <article class="chinese-action-item">
          <strong>${index + 1} ${escapeHtml(item.text || item.id || "任务")}</strong>
          ${item.setupZh ? `<p>${escapeHtml(item.setupZh)}</p>` : ""}
          ${item.prompt ? `<p>${escapeHtml(item.prompt)}</p>` : ""}
          ${item.stepsZh?.length ? `<ol>${item.stepsZh.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>` : ""}
          ${(item.referenceAnswerZh || item.answer) ? `<small>完成标准：${escapeHtml(item.referenceAnswerZh || item.answer)}</small>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function formatChineseCharacterTerm(pack, value) {
  const text = safePlainText(value?.text || value, 8);
  if (!text) return "";
  const target = (pack?.chinese?.characters || []).find((item) => item.text === text);
  return target?.pinyin ? `${text}（${target.pinyin}）` : text;
}

function renderChineseTermList(items = []) {
  return `
    <ol class="chinese-term-list">
      ${items.map((item, index) => `<li><span class="term-index">${index + 1}</span><span class="term-text">${escapeHtml(item)}</span></li>`).join("")}
    </ol>
  `;
}

function renderInteractiveReadingText(section) {
  const progress = getCourseProgress();
  const annotation = getReadingAnnotationSection(progress, section.id);
  const stats = getReadingAnnotationStats(annotation);
  return `
    <div class="reading-annotation-bar">
      <span>点1次 不认识｜点2次 不熟悉｜点3次 取消</span>
      <strong>不认识 ${stats.unknown} 字｜不熟悉 ${stats.unsure} 字</strong>
    </div>
    <div class="reading-text interactive-reading-text" data-reading-section="${escapeHtml(section.id)}">
      ${section.textTitle ? `<h4>${escapeHtml(section.textTitle)}</h4>` : ""}
      ${(section.paragraphs || []).map((paragraph, paragraphIndex) => `<p>${renderReadingParagraph(section.id, paragraph, paragraphIndex, annotation)}</p>`).join("")}
    </div>
  `;
}

function renderReadingParagraph(sectionId, paragraph, paragraphIndex, annotation) {
  return [...String(paragraph || "")].map((char, charIndex) => {
    if (!isHanCharacter(char)) return escapeHtml(char);
    const state = annotation.characters?.[char]?.status || "";
    const stateLabel = state === "unknown" ? "不认识" : state === "unsure" ? "不熟悉" : "未标记";
    const classes = ["reading-char", state ? `is-${state}` : ""].filter(Boolean).join(" ");
    return `<button class="${classes}" data-reading-char="${escapeHtml(char)}" data-reading-section="${escapeHtml(sectionId)}" data-reading-paragraph="${paragraphIndex}" data-reading-index="${charIndex}" type="button" aria-label="${escapeHtml(`${char}，${stateLabel}`)}">${escapeHtml(char)}</button>`;
  }).join("");
}

function isHanCharacter(char) {
  return /\p{Script=Han}/u.test(char);
}

function getReadingAnnotationSection(progress, sectionId) {
  const chinese = progress?.chinese || {};
  chinese.readingAnnotations ||= {};
  chinese.readingAnnotations[sectionId] ||= { sectionId, characters: {} };
  return chinese.readingAnnotations[sectionId];
}

function getReadingAnnotationStats(annotation) {
  const entries = Object.values(annotation?.characters || {});
  return {
    unknown: entries.filter((item) => item.status === "unknown").length,
    unsure: entries.filter((item) => item.status === "unsure").length
  };
}

function toggleReadingCharacter(button) {
  const char = button.dataset.readingChar;
  const sectionId = button.dataset.readingSection;
  if (!char || !sectionId) return;
  const progress = getCourseProgress();
  const annotation = getReadingAnnotationSection(progress, sectionId);
  const current = annotation.characters[char] || {
    character: char,
    paragraphIndexes: [],
    positions: [],
    firstMarkedAt: new Date().toISOString()
  };
  const nextStatus = current.status === "unknown" ? "unsure" : current.status === "unsure" ? "" : "unknown";
  if (!nextStatus) {
    delete annotation.characters[char];
  } else {
    const paragraphIndex = Number(button.dataset.readingParagraph || 0);
    const charIndex = Number(button.dataset.readingIndex || 0);
    annotation.characters[char] = {
      ...current,
      status: nextStatus,
      paragraphIndexes: [...new Set([...(current.paragraphIndexes || []), paragraphIndex])],
      positions: [...(current.positions || []), { paragraphIndex, charIndex }],
      firstMarkedAt: current.firstMarkedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  saveState();
  renderChineseLesson();
}

function renderCourseQuestion(question, key, itemProgress = {}, questionIndex = 0) {
  const options = getChineseQuestionOptionOrder(question, key, itemProgress);
  const isSpokenOpen = question.answerMode === "spoken" || (!options.length && (question.recording || question.referenceAnswer || question.answer));
  const fallbackSpokenText = isSpokenOpen ? (question.instructionZh || "请先自己读，再用自己的话说一说。") : (question.prompt || "请回答");
  const readAloud = normalizeReadAloudConfig(question.readAloud, fallbackSpokenText, options.length ? "prompt_and_options" : "instruction_only");
  if (options.length && !readAloud.optionSpokenTexts?.length) readAloud.optionSpokenTexts = options.map((option, index) => `${choiceLetter(index)}，${option}`);
  const draft = itemProgress.pendingChoices?.[key] || null;
  const result = (itemProgress.choiceResults || []).find((entry) => entry.questionKey === key);
  const selected = draft?.selected || result?.selected || "";
  const showFeedback = result && (!draft || draft.selected === result.selected);
  const oralResult = itemProgress.oralAssessmentResults?.[key] || null;
  return `
    <div class="course-question">
      ${renderQuestionDisplayCards(question)}
      ${renderPromptRow(`<strong>${questionIndex + 1}. ${escapeHtml(question.prompt || "请回答")}</strong>`, renderReadAloudButton(`chinese:${key}`, readAloud, { assessment: isSpokenOpen, targetText: question.prompt || question.answer || "" }))}
      ${isSpokenOpen ? `<p class="oral-answer-hint">口头回答即可。家长用下方四档结果记录，不需要输入文字。</p>` : ""}
      ${options.length ? `<div class="course-options">${options.map((option, optionIndex) => {
        const selectedClass = normalizeSentenceAnswer(option) === normalizeSentenceAnswer(selected) ? "selected" : "";
        return `<button class="button secondary compact-button course-choice-button ${selectedClass}" data-course-choice="${escapeHtml(key)}" data-choice-value="${escapeHtml(option)}" data-choice-answer="${escapeHtml(question.answer || "")}" data-choice-index="${optionIndex}" type="button"><span class="choice-letter">${choiceLetter(optionIndex)}</span><span class="choice-text">${escapeHtml(option)}</span></button>`;
      }).join("")}</div>` : ""}
      ${renderQuestionOralAssessment(question, key, oralResult)}
      ${showFeedback ? `<p class="answer-feedback ${result.correct ? "correct" : "needs-help"}"><strong>${result.correct ? "正确" : "再想想"}</strong><span>${escapeHtml(`你选了 ${result.selectedLetter || ""}`)}</span></p>` : ""}
      ${!options.length && !isSpokenOpen && (question.referenceAnswer || question.answer) ? `<button class="button ghost compact-button" data-course-toggle-answer="${escapeHtml(key)}" type="button">查看参考<br /><span>Answer</span></button><p class="course-answer" data-course-answer="${escapeHtml(key)}" hidden>${escapeHtml(question.referenceAnswer || question.answer)}</p>` : ""}
      ${isSpokenOpen ? renderCourseItemControls(`chinese:${key}`, getCourseProgress()?.chinese?.sections?.[`chinese:${key}`] || {}) : ""}
    </div>
  `;
}

function renderQuestionDisplayCards(question) {
  const cards = question.displayCards;
  if (!cards?.artworkCard && !cards?.labelCards?.length) return "";
  return `
    <div class="question-display-cards">
      ${cards.artworkCard ? `<div><strong>作品卡</strong><span>${escapeHtml(cards.artworkCard)}</span></div>` : ""}
      ${cards.labelCards?.length ? `<ol>${cards.labelCards.map((card) => `<li><strong>${escapeHtml(card.id)}</strong><span>${escapeHtml(card.text)}</span></li>`).join("")}</ol>` : ""}
    </div>
  `;
}

function renderQuestionOralAssessment(question, key, oralResult) {
  const config = question.oralAssessment;
  if (!config?.required || !config.requiredConcepts?.length) return "";
  const selected = new Set(oralResult?.[config.resultField || "spokenCheckedFields"] || oralResult?.spokenCheckedFields || []);
  return `
    <div class="oral-assessment-panel" data-oral-assessment="${escapeHtml(key)}">
      <strong>口答记录</strong>
      <span>孩子是否说出：</span>
      <div class="actions compact">
        ${config.requiredConcepts.map((concept) => `<button class="button secondary compact-button ${selected.has(concept) ? "selected" : ""}" data-chinese-oral-concept="${escapeHtml(key)}" data-oral-concept="${escapeHtml(concept)}" type="button">${escapeHtml(concept)}</button>`).join("")}
      </div>
    </div>
  `;
}

function choiceLetter(index) {
  return String.fromCharCode(65 + Number(index || 0));
}

function getChineseQuestionOptionOrder(question, key, itemProgress = {}) {
  const saved = (itemProgress.choiceResults || []).find((entry) => entry.questionKey === key)?.optionOrder;
  if (Array.isArray(saved) && saved.length) return saved;
  const pending = itemProgress.pendingChoices?.[key]?.optionOrder;
  if (Array.isArray(pending) && pending.length) return pending;
  const options = uniqueByNormalized((question.options || []).map((option) => String(option || "")).filter(Boolean)).slice(0, 4);
  if (options.length < 2) return [];
  if (question.preserveOptionOrder || question.answerPosition) return options;
  const ordered = stableShuffle(options, key);
  const answerIndex = ordered.findIndex((option) => normalizeSentenceAnswer(option) === normalizeSentenceAnswer(question.answer || ""));
  if (answerIndex === 0 && ordered.length > 1 && checksumString(`${key}:answer-position`) % 2 === 1) {
    const swapIndex = 1 + (checksumString(`${key}:answer-position`) % (ordered.length - 1));
    [ordered[0], ordered[swapIndex]] = [ordered[swapIndex], ordered[0]];
  }
  return ordered;
}

function parseChineseQuestionKey(questionKey = "") {
  const normalized = String(questionKey || "").replace(/^chinese:/, "");
  const separator = normalized.lastIndexOf("_");
  if (separator < 0) return null;
  const sectionId = normalized.slice(0, separator);
  const questionIndex = Number(normalized.slice(separator + 1));
  if (!sectionId || !Number.isInteger(questionIndex) || questionIndex < 0) return null;
  return { sectionId, sectionKey: `chinese:${sectionId}`, questionIndex, questionKey: normalized };
}

function getChineseQuestionContext(questionKey, pack = getLatestLearningPack()) {
  const parsed = parseChineseQuestionKey(questionKey);
  if (!parsed || !pack) return null;
  const section = getChineseLessonSections(pack).find((item) => item.id === parsed.sectionId);
  const question = section?.questions?.[parsed.questionIndex];
  if (!section || !question) return null;
  return { ...parsed, section, question };
}

function getChineseObjectiveQuestions(section) {
  return (section.questions || [])
    .map((question, index) => ({ question, index, questionKey: `${section.id}_${index}` }))
    .filter(({ question }) => Array.isArray(question.options) && question.options.length >= 2);
}

function renderListeningZone(pack, steps, mode, progress) {
  if (!steps.length) return "";
  const locator = pack.english?.lesson?.appLocator || {};
  const key = "english:app_stage";
  const itemProgress = progress.english.steps[key] || {};
  return `
    <article class="course-listening-card">
      <div class="course-card-head">
        <div><span>1-4</span><h3>每日英语听力阶段</h3><p>先看完说明，去 App 连续完成四步，回来只点一次完成</p></div>
        <strong>${steps.reduce((sum, step) => sum + getStepMinutes(step, mode), 0)} 分钟</strong>
      </div>
      <div class="course-app-path"><strong>App路径</strong><span>${escapeHtml(renderAppPath(pack))}</span></div>
      <ol class="app-stage-list">
        ${steps.map((step) => `<li><strong>${escapeHtml(step.titleZh)}</strong><span>${escapeHtml(step.parentSaysZh || step.actionsZh?.[0] || "")}</span></li>`).join("")}
      </ol>
      <div class="actions compact">
        <button class="button success compact-button" data-english-app-complete="${escapeHtml(key)}" type="button">${itemProgress.finishedAt ? "App阶段已完成" : "已完成App阶段，继续"}<br /><span>Continue</span></button>
      </div>
    </article>
  `;
}

function renderEnglishStep(pack, step, index, mode, progress, compact = false) {
  const key = `english:${step.id}`;
  const itemProgress = progress.english.steps[key] || {};
  if (step.type === "break" || step.id === "break") return renderBreakCard(key, step.titleZh || "休息一下", getStepMinutes(step, mode) || 5, itemProgress, step.parentSaysZh || step.actionsZh?.[0] || "");
  const body = renderEnglishStepBody(pack, step, mode);
  const assessment = /exit|check|reading|assessment/i.test(step.id || step.titleZh || "");
  const readText = assessment ? (step.parentSaysZh || step.actionsZh?.[0] || step.titleZh) : [step.titleZh, step.parentSaysZh, ...(step.actionsZh || [])].filter(Boolean).join("。");
  const readAloud = normalizeReadAloudConfig(step.readAloud, readText, assessment ? "instruction_only" : "full");
  return `
    <article class="${compact ? "course-mini-step" : "course-card"}" data-course-card="${escapeHtml(key)}">
      <div class="course-card-head">
        <div><span>${step.number || index + 1}</span>${renderPromptRow(`<h3>${escapeHtml(step.titleZh)}</h3>`, renderReadAloudButton(key, readAloud, { assessment, targetText: step.expectedAnswer || step.acceptedAnswers?.join(" ") || "" }))}<p>${escapeHtml(toolLabel(step.tool))}</p></div>
        <strong>${getStepMinutes(step, mode)} 分钟</strong>
      </div>
      ${body}
      ${renderCourseItemControls(key, itemProgress)}
    </article>
  `;
}

function renderEnglishStepBody(pack, step, mode) {
  if (step.id === "blocks" || step.blocks?.length || step.acceptedAnswers?.length) return renderCourseBlocks(step, pack);
  if (step.id === "phonics" || step.focus) {
    return `<div class="phonics-panel"><strong>${escapeHtml(step.focus || "拼读小目标")}</strong><div class="course-chip-list">${(step.items || []).map((item) => `<span>${escapeHtml(item.text || item)}</span>`).join("")}</div><p>${escapeHtml(step.successCriteriaZh || "读整词即可")}</p></div>`;
  }
  if (step.id === "dialogue_exit" || step.dialogue?.length) {
    return `<div class="dialogue-panel">${(step.dialogue || []).map((line) => `<p><strong>${escapeHtml(line.speaker === "child" ? "孩子" : "家长")}：</strong>${escapeHtml(line.text)}</p>`).join("")}${step.exitChecks?.length ? `<div class="course-chip-list">${step.exitChecks.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}${step.expectedAnswer ? `<button class="button ghost compact-button" data-course-toggle-answer="${escapeHtml(step.id)}" type="button">查看参考<br /><span>Answer</span></button><p class="course-answer" data-course-answer="${escapeHtml(step.id)}" hidden>${escapeHtml(step.expectedAnswer)}</p>` : ""}</div>`;
  }
  return `
    <div class="course-instructions">
      ${step.parentSaysZh ? `<p><strong>家长说</strong>${escapeHtml(step.parentSaysZh)}</p>` : ""}
      ${step.actionsZh?.length ? `<ul>${step.actionsZh.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      ${step.successCriteriaZh ? `<p><strong>结束标准</strong>${escapeHtml(step.successCriteriaZh)}</p>` : ""}
    </div>
  `;
}

function renderCourseBlocks(step, pack) {
  const key = `english:${step.id}`;
  const progress = getCourseProgress(pack.packId);
  const selected = progress.english.blockAnswers?.[key] || [];
  const blocks = getCourseBlockPool(step, pack);
  return `
    <div class="course-block-builder">
      <p>${escapeHtml(step.parentSaysZh || "点击积木，拼出今天的句子")}</p>
      <div class="course-block-pool">
        ${blocks.map((block, index) => selected.includes(index) ? "" : `<button class="block-chip" data-course-block="${escapeHtml(key)}" data-block-index="${index}" type="button">${escapeHtml(block)}</button>`).join("")}
      </div>
      <div class="course-answer-zone">
        ${selected.map((index) => `<button class="block-chip selected" data-course-block="${escapeHtml(key)}" data-block-index="${index}" type="button">${escapeHtml(blocks[index] || "")}</button>`).join("") || "<span>你的答案区</span>"}
      </div>
      <div class="actions compact">
        <button class="button primary compact-button" data-course-submit-blocks="${escapeHtml(key)}" type="button">提交<br /><span>Submit</span></button>
        <button class="button secondary compact-button" data-course-reset-blocks="${escapeHtml(key)}" type="button">重置<br /><span>Reset</span></button>
      </div>
      <p class="course-block-feedback" data-block-feedback="${escapeHtml(key)}">${escapeHtml(progress.english.steps[key]?.blockFeedback || "")}</p>
    </div>
  `;
}

function renderCourseItemControls(key, itemProgress) {
  const isChinese = key.startsWith("chinese:");
  const completeLabel = isChinese ? "确认" : "完成本环节";
  const completeClass = isChinese ? "primary chinese-confirm-button" : "success";
  return `
    <div class="course-controls ${isChinese ? "is-chinese-confirm" : ""}">
      <div class="course-timing-row">
        <button class="button ${completeClass} compact-button" data-course-complete="${escapeHtml(key)}" type="button">${escapeHtml(completeLabel)}${isChinese ? "" : "<br /><span>Done</span>"}</button>
      </div>
      ${isChinese && itemProgress.confirmationMessage ? `<p class="course-confirm-message" role="alert">${escapeHtml(itemProgress.confirmationMessage)}</p>` : ""}
      <div class="course-result-row">
        ${Object.entries(COURSE_RESULT_LABELS).map(([value, label]) => `<button class="button ${itemProgress.result === value ? "primary" : "ghost"} compact-button" data-course-result="${escapeHtml(key)}" data-result-value="${escapeHtml(value)}" type="button">${escapeHtml(label)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderRecordingCard(activityKey, config, course) {
  if (!config || config.mode === "none") return "";
  const progress = getCourseProgress();
  const side = progress?.[course] || {};
  const bucket = getCourseBucket(progress, activityKey);
  const item = bucket[activityKey] || {};
  const clips = getRecordingClipsForActivity(activityKey);
  const consent = side.recordingConsent;
  const canRecord = consent === true && !side.recordingUnavailable;
  const isActive = activeRecording?.activityKey === activityKey;
  return `
    <div class="recording-card" data-recording-card="${escapeHtml(activityKey)}">
      <div class="recording-card-head">
        <span class="recording-dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(config.promptZh || "准备好了吗？")}</strong>
          <p>${escapeHtml(config.startCueZh || "准备好后点麦克风")} · 最长 ${config.maxSeconds || 120} 秒</p>
        </div>
      </div>
      ${consent === undefined ? `<p class="pack-muted">需要录音时请使用课程顶部的录音按钮。</p>` : ""}
      ${consent === false ? `<p class="pack-muted">未开启录音，本题仍可继续完成。</p>` : ""}
      ${side.recordingUnavailable ? `<p class="pack-warning">麦克风不可用：${escapeHtml(side.recordingUnavailableReason || "授权失败或浏览器不支持")}。</p>` : ""}
      <div class="recording-status" data-recording-status="${escapeHtml(activityKey)}">${escapeHtml(item.recordingStatusText || (clips.length ? `已保存 ${clips.length} 段录音` : "尚未录音"))}</div>
      <div class="actions compact">
        <button class="button recording-start-button compact-button" data-recording-action="start" data-recording-key="${escapeHtml(activityKey)}" data-recording-course="${escapeHtml(course)}" ${canRecord && !isActive ? "" : "disabled"} type="button">开始录音<br /><span>Audio</span></button>
        <button class="button recording-stop-button compact-button" data-recording-action="stop" data-recording-key="${escapeHtml(activityKey)}" ${isActive ? "" : "disabled"} type="button">我说完了<br /><span>Done</span></button>
        ${config.allowMultipleTakes ? `<button class="button ghost compact-button" data-recording-action="retake" data-recording-key="${escapeHtml(activityKey)}" data-recording-course="${escapeHtml(course)}" ${canRecord && !isActive ? "" : "disabled"} type="button">重录<br /><span>Retake</span></button>` : ""}
      </div>
      ${clips.length ? `<div class="recording-clips">${clips.map((clip) => `<span>${escapeHtml(clip.status === "complete" ? "已保存" : "可恢复")} · ${Math.round(clip.duration || 0)}秒 · ${escapeHtml(clip.mimeType || "")}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderBreakCard(key, title, minutes = 5, itemProgress = {}, instruction = "") {
  const active = Boolean(itemProgress.breakEndsAt && !itemProgress.breakFinishedAt);
  const remainingMs = active ? Math.max(0, Number(itemProgress.breakEndsAt) - Date.now()) : Math.max(0, Number(minutes || 5) * 60000);
  return `
    <article class="course-card break-card" data-course-card="${escapeHtml(key)}">
      <div class="course-card-head">
        <div><span>休</span><h3>${escapeHtml(title || "休息一下")}</h3><p>${escapeHtml(instruction || "喝水、看远处，放松一下")}</p></div>
        <strong>休息 ${minutes || 5} 分钟</strong>
      </div>
      <div class="break-countdown ${active ? "is-active" : ""}" aria-live="polite">${formatClock(remainingMs)}</div>
      <div class="actions compact">
        <button class="button secondary compact-button" data-break-start="${escapeHtml(key)}" data-break-minutes="${Number(minutes || 5)}" ${active ? "disabled" : ""} type="button">开始${Number(minutes || 5)}分钟休息<br /><span>Break</span></button>
        <button class="button primary compact-button" data-break-end="${escapeHtml(key)}" ${active ? "" : "disabled"} type="button">提前结束休息<br /><span>End</span></button>
      </div>
      <p class="pack-muted">休息时间只计入 breakMinutes，不计入有效学习时间。</p>
    </article>
  `;
}

function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getRecordingClipsForActivity(activityKey) {
  return Object.values(state.recordingClips || {}).filter((clip) => clip.activityId === activityKey && clip.includeInFeedback !== false);
}

function getCourseRecordingKey(kind) {
  return `${kind}:course_recording`;
}

function getCourseRecordingClips(kind) {
  const sessionId = getCourseProgress()?.[kind]?.sessionId || "";
  return getRecordingClipsForActivity(getCourseRecordingKey(kind))
    .filter((clip) => !sessionId || clip.sessionId === sessionId)
    .sort((a, b) => Number(a.segmentIndex || 0) - Number(b.segmentIndex || 0) || String(a.startedAt).localeCompare(String(b.startedAt)));
}

function getCourseRecordingUiState(kind, side = getCourseProgress()?.[kind]) {
  const active = activeRecording?.course === kind && activeRecording?.activityKey === getCourseRecordingKey(kind);
  const clips = getCourseRecordingClips(kind);
  if (side?.recordingUnavailable) return "unavailable";
  if (side?.courseRecordingStatus === "requesting") return "requesting";
  if (activeRecording?.requesting && active) return "requesting";
  if (activeRecording?.paused && active) return "paused";
  if (active) return "recording";
  if (side?.courseRecordingStatus === "saving") return "saving";
  if (side?.courseRecordingStatus === "interrupted" || clips.some((clip) => clip.status === "interrupted")) return "interrupted";
  if (clips.length) return "saved";
  return "idle";
}

function renderCourseRecordingPanel(kind, progress) {
  const stateName = getCourseRecordingUiState(kind, progress);
  const clips = getCourseRecordingClips(kind);
  const totalSeconds = Math.round(clips.reduce((sum, clip) => sum + (clip.duration || 0), 0));
  const activeSeconds = activeRecording?.course === kind && activeRecording.startedAtMs ? Math.max(0, Math.round((Date.now() - activeRecording.startedAtMs) / 1000)) : 0;
  const statusText = {
    idle: "未开始录音",
    requesting: "正在准备录音",
    recording: `● 录音中 ${formatElapsed(activeSeconds * 1000)}`,
    paused: "录音已暂停",
    saving: "正在保存",
    saved: `已保存 ${formatElapsed(totalSeconds * 1000)}`,
    interrupted: "录音已中断，已保存前面的内容",
    unavailable: `录音不可用：${progress.recordingUnavailableReason || "允许麦克风后重试"}`
  }[stateName] || "未开始录音";
  const button = (label, action, extra = "secondary") => `<button class="button ${extra} compact-button" data-course-recording-action="${action}" data-course-recording-kind="${kind}" type="button">${label}</button>`;
  const actions = {
    idle: button("开始录音", "start", "primary"),
    requesting: `<button class="button secondary compact-button" disabled type="button">正在准备录音</button>`,
    recording: `${button("暂停录音", "pause")}${button("结束并保存", "save", "primary")}`,
    paused: `${button("继续录音", "resume", "primary")}${button("结束并保存", "save")}`,
    saving: `<button class="button secondary compact-button" disabled type="button">正在保存</button>`,
    saved: `${button("播放", "play")}${button("重新录音", "restart")}${button("删除录音", "delete", "ghost")}`,
    interrupted: `${button("继续录音", "resume", "primary")}${button("保存现有录音", "save")}`,
    unavailable: button("允许麦克风后重试", "start", "secondary")
  }[stateName];
  return `
    <div class="recording-consent course-recording-panel" data-course-recording-panel="${escapeHtml(kind)}">
      <strong>录音</strong>
      <p>整节中文课录音默认只保存在本机，不自动上传。</p>
      <div class="recording-status">${escapeHtml(statusText)}</div>
      <div class="actions compact">${actions}</div>
      ${clips.length ? `<div class="recording-clips">${clips.map((clip) => `<span>${escapeHtml(clip.status === "interrupted" ? "已中断" : "已保存")} · 第 ${Number(clip.segmentIndex || 0) + 1} 段 · ${Math.round(clip.duration || 0)}秒</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderCourseStartSettings(kind, progress, items) {
  normalizeCourseTimer(progress);
  const isRunning = Boolean(progress.isRunning);
  const hasStarted = Boolean(progress.startedAt);
  const elapsed = getCourseElapsed(progress, progress.sections || progress.steps || {});
  const statusText = isRunning ? `计时中 ${formatElapsed(elapsed)}` : hasStarted ? `已暂停 ${formatElapsed(elapsed)}` : "尚未开始 0:00";
  return `
    <div class="course-start-settings">
      <p class="course-tool-note">⏱ 开始今天的学习只记录用时；需要录音时点“开始录音”。</p>
      <div class="course-session-start" data-course-timer-root="${escapeHtml(kind)}">
        ${isRunning
          ? `<button class="button secondary compact-button" data-course-pause="${kind}" type="button">暂停<br /><span>Pause</span></button>`
          : `<button class="button primary compact-button" data-course-session-start="${kind}" type="button">${hasStarted ? "继续" : "开始今天的学习"}<br /><span>${hasStarted ? "Resume" : "Start"}</span></button>`}
        <button class="button ghost compact-button" data-course-session-reset="${escapeHtml(kind)}" type="button">↻ 重新开始本星球<br /><span>Restart</span></button>
        <strong data-course-timer-display="${escapeHtml(kind)}">${statusText}</strong>
      </div>
      ${kind === "chinese" ? renderCourseRecordingPanel(kind, progress) : ""}
    </div>
  `;
}

function renderCourseEndFeedback(kind, progress, items) {
  const hardestOptions = items.map((item, index) => ({ id: item.id || `item_${index}`, title: item.title || item.titleZh || `第 ${index + 1} 步` }));
  const selectedHardest = progress.hardestSections || (progress.hardest ? [progress.hardest] : []);
  return `
    <article class="course-end-feedback">
      <div class="section-title">
        <div>
          <p>${escapeHtml(courseLabel(kind))}反馈 / Feedback</p>
          <h2>今天学得怎么样？</h2>
        </div>
      </div>
      <div class="course-feedback-controls">
      <label>孩子轻松度 <input data-course-ease="${kind}" data-ease-kind="childEase" type="number" min="0" max="10" value="${progress.childEase ?? ""}" /></label>
      <label>家长轻松度 <input data-course-ease="${kind}" data-ease-kind="parentEase" type="number" min="0" max="10" value="${progress.parentEase ?? ""}" /></label>
      <div class="hardest-picker">
        <strong>最困难环节（可多选）</strong>
        <div class="hardest-chip-list">
          <label class="${selectedHardest.includes("none") ? "is-selected" : ""}"><input data-course-hardest="${kind}" data-hardest-id="none" type="checkbox" ${selectedHardest.includes("none") ? "checked" : ""} />没有明显困难</label>
          ${hardestOptions.map((item) => `<label class="${selectedHardest.includes(item.id) ? "is-selected" : ""}"><input data-course-hardest="${kind}" data-hardest-id="${escapeHtml(item.id)}" type="checkbox" ${selectedHardest.includes(item.id) ? "checked" : ""} />${escapeHtml(item.title)}</label>`).join("")}
        </div>
      </div>
      <label class="course-note">备注 <textarea data-course-note="${kind}" rows="2">${escapeHtml(progress.note || "")}</textarea></label>
      <div class="actions compact course-session-actions">
        <button class="button secondary compact-button" data-course-pause="${kind}" type="button">暂停并保存<br /><span>Pause</span></button>
        <button class="button primary compact-button" data-course-end="${kind}" type="button">结束本次学习<br /><span>Save</span></button>
      </div>
      </div>
    </article>
  `;
}

function renderCourseFeedbackControls(kind, progress, items) {
  return renderCourseStartSettings(kind, progress, items) + renderCourseEndFeedback(kind, progress, items);
}

function renderEmptyCourse(text) {
  return `<div class="pack-error"><strong>${escapeHtml(text)}</strong><p>回到今日页面粘贴学习包即可开始。</p></div>`;
}

function getFullCourseReadiness(pack, side = "all") {
  const missing = [];
  if (!pack) return { ready: false, missing: ["今日学习包"] };
  if (pack.contentPolicy?.authority !== FULL_COURSE_CONTENT_POLICY.authority) missing.push("contentPolicy.authority = codex-course-designer");
  if (pack.contentPolicy?.websiteMode !== FULL_COURSE_CONTENT_POLICY.websiteMode) missing.push("contentPolicy.websiteMode = render-only");
  if (pack.contentPolicy?.allowModelGeneration !== false) missing.push("contentPolicy.allowModelGeneration = false");
  if (side === "all" || side === "chinese") validateChineseCourseCompleteness(pack, missing);
  if (side === "all" || side === "english") validateEnglishCourseCompleteness(pack, missing);
  return { ready: missing.length === 0, missing };
}

function validateChineseCourseCompleteness(pack, missing) {
  const lesson = pack.chinese?.lesson;
  if (!lesson) {
    missing.push("chinese.lesson");
    return;
  }
  if (!lesson.title) missing.push("chinese.lesson.title");
  if (!lesson.sections?.length) missing.push("chinese.lesson.sections");
  lesson.sections?.forEach((section) => {
    const prefix = `chinese.lesson.sections.${section.id}`;
    if (!section.title) missing.push(`${prefix}.title`);
    if (!section.type) missing.push(`${prefix}.type`);
    if (!section.parentInstructionZh) missing.push(`${prefix}.parentInstructionZh`);
    if (section.type === "reading_text" && !section.paragraphs?.length) missing.push(`${prefix}.paragraphs`);
    if (section.questions?.length) section.questions.forEach((question, index) => {
      if (!question.prompt) missing.push(`${prefix}.questions[${index}].prompt`);
      if (question.options?.length && !question.answer) missing.push(`${prefix}.questions[${index}].answer`);
      if (question.options?.length && question.options.length < 2) missing.push(`${prefix}.questions[${index}].options`);
    });
    if (section.type === "four_grid_retell" && !section.prompts?.length) missing.push(`${prefix}.prompts`);
    if (section.type === "school_scenario" && !section.prompt) missing.push(`${prefix}.prompt`);
    if (section.type === "post_check" && !section.characters?.length && !section.words?.length) missing.push(`${prefix}.characters/words`);
  });
}

function validateEnglishCourseCompleteness(pack, missing) {
  const lesson = pack.english?.lesson;
  if (!lesson) {
    missing.push("english.lesson");
    return;
  }
  if (!lesson.anchorSentence) missing.push("english.lesson.anchorSentence");
  if (!lesson.translationZh) missing.push("english.lesson.translationZh");
  if (!lesson.allowedModes?.length) missing.push("english.lesson.allowedModes");
  if (!lesson.appLocator?.appName || !lesson.appLocator?.article || !lesson.appLocator?.targetSentence) missing.push("english.lesson.appLocator");
  const steps = lesson.steps || [];
  if (steps.length < 7 && lesson.defaultMode !== "recovery") missing.push("english.lesson.steps 七步完整内容");
  const requiredIds = lesson.defaultMode === "recovery"
    ? ["retrieval", "meaning_and_text", "echo", "dialogue_exit"]
    : ["retrieval", "blind_listening", "meaning_and_text", "echo", "blocks", "phonics", "dialogue_exit"];
  requiredIds.forEach((id) => {
    if (!steps.some((step) => step.id === id)) missing.push(`english.lesson.steps.${id}`);
  });
  steps.forEach((step) => {
    const prefix = `english.lesson.steps.${step.id}`;
    if (!step.titleZh) missing.push(`${prefix}.titleZh`);
    if (!step.actionsZh?.length && !step.blocks?.length && !step.dialogue?.length && !step.items?.length) missing.push(`${prefix}.actionsZh`);
    if (!step.successCriteriaZh && !step.exitChecks?.length) missing.push(`${prefix}.successCriteriaZh`);
    if (step.id === "blocks") {
      if (!step.blocks?.length) missing.push(`${prefix}.blocks`);
      if (!step.acceptedAnswers?.length) missing.push(`${prefix}.acceptedAnswers`);
    }
    if (step.id === "phonics" && !step.items?.length) missing.push(`${prefix}.items`);
    if (step.id === "dialogue_exit" && !step.dialogue?.length) missing.push(`${prefix}.dialogue`);
  });
}

function renderCourseMissingBox(missing, title = "今天的学习包内容不完整，请重新从总课程设计师获取") {
  return `
    <div class="pack-error course-missing">
      <strong>${escapeHtml(title)}</strong>
      <p>网站只执行学习包已有内容，不会调用模型补全。</p>
      <ul>${missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function startCourseItem(key) {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  if (item.runningSince) return;
  bucket[key] = { ...item, startedAt: item.startedAt || new Date().toISOString(), runningSince: Date.now() };
  if (key.startsWith("chinese:")) progress.chinese.startedAt ||= bucket[key].startedAt;
  if (key.startsWith("english:")) progress.english.startedAt ||= bucket[key].startedAt;
  saveState();
  rerenderCourseViews();
}

async function startCourseSession(kind, options = {}) {
  const progress = getCourseProgress();
  const side = progress?.[kind];
  if (!side) return;
  normalizeCourseTimer(side);
  if (side.isRunning) return;
  const now = Date.now();
  pauseOtherRunningCourses(progress, kind, "switched_course");
  side.startedAt ||= new Date(now).toISOString();
  side.accumulatedMs = Number(side.accumulatedMs || 0);
  side.isRunning = true;
  side.runningSince = now;
  side.lastHeartbeatAt = now;
  side.timerModelVersion = COURSE_TIMER_MODEL_VERSION;
  side.pausedAt = "";
  side.pauseReason = "";
  side.sessionStatus = "in_progress";
  saveState();
  if (!options.skipRecordingSync && activeRecording?.course === kind && activeRecording.paused) resumeActiveRecording(kind);
  rerenderCourseViews();
  updateCourseTimerUi();
}

function getCourseElapsed(side, map = {}) {
  normalizeCourseTimer(side);
  const delta = side?.isRunning && side?.runningSince ? Math.max(0, Date.now() - Number(side.runningSince)) : 0;
  const sessionElapsed = clampDuration((side?.accumulatedMs || 0) + delta);
  return sessionElapsed || getTotalElapsed(map);
}

function normalizeCourseTimer(side) {
  if (!side) return side;
  side.timerModelVersion ||= COURSE_TIMER_MODEL_VERSION;
  if (side.accumulatedMs === undefined) side.accumulatedMs = clampDuration(Number(side.elapsedMs || 0));
  if (side.isRunning === undefined) side.isRunning = Boolean(side.runningSince);
  if (side.isRunning && !side.runningSince) side.runningSince = Date.now();
  if (!side.isRunning) side.runningSince = null;
  side.accumulatedMs = clampDuration(Number(side.accumulatedMs || 0));
  side.elapsedMs = side.accumulatedMs;
  return side;
}

function pauseCourseItem(key) {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  if (!item.runningSince) return;
  bucket[key] = {
    ...item,
    elapsedMs: (item.elapsedMs || 0) + (Date.now() - item.runningSince),
    runningSince: null,
    updatedAt: new Date().toISOString()
  };
  saveState();
  rerenderCourseViews();
}

function startBreak(key, minutes = 5) {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  const startedAt = Date.now();
  bucket[key] = {
    ...item,
    startedAt: item.startedAt || new Date(startedAt).toISOString(),
    breakStartedAt: startedAt,
    breakEndsAt: startedAt + Math.max(1, minutes) * 60000,
    breakFinishedAt: null,
    result: "independent"
  };
  progress.breaks ||= [];
  saveState();
  rerenderCourseViews();
}

function endBreak(key, reason = "manual") {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  const now = Date.now();
  const elapsedMs = item.breakStartedAt ? Math.max(0, now - Number(item.breakStartedAt)) : 0;
  bucket[key] = {
    ...item,
    breakFinishedAt: new Date(now).toISOString(),
    breakActive: false,
    finishedAt: new Date(now).toISOString(),
    interruptionReason: reason
  };
  progress.breaks ||= [];
  const existingIndex = progress.breaks.findIndex((entry) => entry.activityId === key && entry.startedAt === item.breakStartedAt);
  const entry = {
    activityId: key,
    startedAt: item.breakStartedAt || now,
    endedAt: now,
    elapsedMs,
    reason
  };
  if (existingIndex >= 0) progress.breaks[existingIndex] = entry;
  else progress.breaks.push(entry);
  saveState();
  playSoftBreakSignal();
  rerenderCourseViews();
}

function completeCourseItem(key) {
  const progress = getCourseProgress();
  if (isCourseItemLocked(key, progress)) return;
  const bucket = getCourseBucket(progress, key);
  const item = bucket[key] || {};
  if (key.startsWith("chinese:") && !confirmChineseObjectiveSection(key, item, progress)) {
    saveState();
    renderChineseLesson();
    renderPlanetOverview();
    return;
  }
  const elapsedMs = (item.elapsedMs || 0) + (item.runningSince ? Date.now() - item.runningSince : 0);
  bucket[key] = { ...item, elapsedMs, runningSince: null, finishedAt: new Date().toISOString(), result: item.result || "independent" };
  if (key.startsWith("chinese:")) progress.chinese.finishedAt = maybeAllDone(progress.chinese.sections) ? new Date().toISOString() : progress.chinese.finishedAt;
  if (key.startsWith("english:")) progress.english.finishedAt = maybeAllDone(progress.english.steps) ? new Date().toISOString() : progress.english.finishedAt;
  saveState();
  rerenderCourseViews();
}

function confirmChineseObjectiveSection(sectionKey, item, progress) {
  const pack = getLatestLearningPack();
  const sectionId = sectionKey.replace(/^chinese:/, "");
  const section = getChineseLessonSections(pack).find((entry) => entry.id === sectionId);
  const objectiveQuestions = section ? getChineseObjectiveQuestions(section) : [];
  if (!objectiveQuestions.length) {
    item.confirmationMessage = "";
    return true;
  }
  item.pendingChoices ||= {};
  const now = new Date().toISOString();
  for (const { questionKey, index } of objectiveQuestions) {
    const existing = (item.choiceResults || []).find((entry) => entry.questionKey === questionKey);
    const draft = item.pendingChoices[questionKey];
    if (!draft?.selected && !existing?.selected) {
      item.confirmationMessage = `请先完成第${index + 1}题`;
      progress.chinese.sections[sectionKey] = item;
      return false;
    }
  }
  const nextResults = [];
  let correctCount = 0;
  for (const { question, questionKey } of objectiveQuestions) {
    const existing = (item.choiceResults || []).find((entry) => entry.questionKey === questionKey);
    const optionOrder = getChineseQuestionOptionOrder(question, questionKey, item);
    const draft = item.pendingChoices[questionKey];
    const selected = draft?.selected || existing?.selected || "";
    const selectedIndex = optionOrder.findIndex((option) => normalizeSentenceAnswer(option) === normalizeSentenceAnswer(selected));
    const correctIndex = optionOrder.findIndex((option) => normalizeSentenceAnswer(option) === normalizeSentenceAnswer(question.answer || ""));
    const correct = selectedIndex >= 0 && selectedIndex === correctIndex;
    if (correct) correctCount += 1;
    nextResults.push({
      questionKey,
      selected,
      answer: question.answer || "",
      correct,
      selectedLetter: selectedIndex >= 0 ? choiceLetter(selectedIndex) : "",
      correctLetter: correctIndex >= 0 ? choiceLetter(correctIndex) : "",
      optionOrder,
      selectedAt: draft?.selectedAt || existing?.selectedAt || now,
      confirmedAt: now
    });
    item.pendingChoices[questionKey] = {
      selected,
      selectedLetter: selectedIndex >= 0 ? choiceLetter(selectedIndex) : "",
      optionOrder,
      selectedAt: draft?.selectedAt || existing?.selectedAt || now
    };
    if (question.oralAssessment?.required) {
      item.oralAssessmentResults ||= {};
      const field = question.oralAssessment.resultField || "spokenCheckedFields";
      const existingOral = item.oralAssessmentResults[questionKey] || {};
      const spoken = Array.isArray(existingOral[field]) ? existingOral[field] : Array.isArray(existingOral.spokenCheckedFields) ? existingOral.spokenCheckedFields : [];
      item.oralAssessmentResults[questionKey] = {
        questionKey,
        requiredConcepts: question.oralAssessment.requiredConcepts || [],
        [field]: spoken,
        complete: (question.oralAssessment.requiredConcepts || []).every((concept) => spoken.includes(concept)),
        supportField: question.oralAssessment.supportField || "answerSupport",
        answerSupport: existingOral.answerSupport || "none",
        confirmedAt: now,
        updatedAt: now
      };
    }
  }
  item.choiceResults = nextResults;
  item.correctCount = correctCount;
  item.totalCount = objectiveQuestions.length;
  item.allCorrect = correctCount === objectiveQuestions.length;
  item.attempts = (item.attempts || 0) + 1;
  item.result = item.allCorrect ? "independent" : "prompted";
  item.confirmationMessage = "";
  item.updatedAt = now;
  progress.chinese.sections[sectionKey] = item;
  return true;
}

function toggleChineseOralConcept(button) {
  const questionKey = button.dataset.chineseOralConcept || "";
  const concept = button.dataset.oralConcept || "";
  const context = getChineseQuestionContext(questionKey);
  if (!context || !concept) return;
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, context.sectionKey);
  const item = bucket[context.sectionKey] || {};
  const config = context.question.oralAssessment || {};
  const field = config.resultField || "spokenCheckedFields";
  const existing = item.oralAssessmentResults?.[context.questionKey] || {};
  const current = new Set(Array.isArray(existing[field]) ? existing[field] : Array.isArray(existing.spokenCheckedFields) ? existing.spokenCheckedFields : []);
  if (current.has(concept)) current.delete(concept);
  else current.add(concept);
  const selected = [...current];
  bucket[context.sectionKey] = {
    ...item,
    oralAssessmentResults: {
      ...(item.oralAssessmentResults || {}),
      [context.questionKey]: {
        questionKey: context.questionKey,
        requiredConcepts: config.requiredConcepts || [],
        [field]: selected,
        complete: (config.requiredConcepts || []).every((item) => selected.includes(item)),
        supportField: config.supportField || "answerSupport",
        answerSupport: existing.answerSupport || "none",
        updatedAt: new Date().toISOString()
      }
    },
    updatedAt: new Date().toISOString()
  };
  saveState();
  renderChineseLesson();
}

function completeEnglishAppStage(key = "english:app_stage") {
  const pack = getLatestLearningPack();
  const progress = getCourseProgress(pack?.packId);
  if (!progress) return;
  const now = new Date().toISOString();
  const listeningSteps = getEnglishLessonSteps(pack).filter((step) => step.number <= 4 || ["retrieval", "blind_listening", "meaning_and_text", "echo"].includes(step.id));
  progress.english.steps[key] = {
    ...(progress.english.steps[key] || {}),
    startedAt: progress.english.steps[key]?.startedAt || progress.english.startedAt || now,
    finishedAt: now,
    result: "independent"
  };
  listeningSteps.forEach((step) => {
    const stepKey = `english:${step.id}`;
    progress.english.steps[stepKey] = {
      ...(progress.english.steps[stepKey] || {}),
      startedAt: progress.english.steps[stepKey]?.startedAt || progress.english.startedAt || now,
      finishedAt: progress.english.steps[stepKey]?.finishedAt || now,
      result: progress.english.steps[stepKey]?.result || "independent",
      completedViaAppStage: true
    };
  });
  saveState();
  renderEnglishLesson();
  renderPlanetOverview();
}

function pauseCourseSide(progress, kind, reason = "manual", options = {}) {
  const side = progress?.[kind];
  if (!side) return false;
  normalizeCourseTimer(side);
  side.sessionStatus = "paused";
  side.pausedAt = new Date().toISOString();
  side.pauseReason = reason;
  if (side.isRunning && side.runningSince) {
    side.accumulatedMs = clampDuration((side.accumulatedMs || 0) + Math.max(0, Date.now() - Number(side.runningSince)));
    side.elapsedMs = side.accumulatedMs;
    side.isRunning = false;
    side.runningSince = null;
    side.lastHeartbeatAt = "";
  }
  const map = side.sections || side.steps || {};
  Object.values(map).forEach((item) => {
    if (item.runningSince) {
      item.elapsedMs = clampDuration((item.elapsedMs || 0) + Math.max(0, Date.now() - item.runningSince));
      item.runningSince = null;
      item.pauseReason = reason;
    }
  });
  if (!options.skipRecording && activeRecording?.course === kind) pauseActiveRecording(kind);
  return true;
}

function pauseOtherRunningCourses(progress, activeKind, reason = "switched_course", options = {}) {
  ["chinese", "english", "art"].forEach((course) => {
    if (course !== activeKind && progress?.[course]?.isRunning) pauseCourseSide(progress, course, reason, options);
  });
}

function pauseAllRunningCourseTimers(reason = "page_hidden", options = {}) {
  let changed = false;
  Object.values(state.courseProgress || {}).forEach((progress) => {
    ["chinese", "english", "art"].forEach((course) => {
      if (progress?.[course]?.isRunning || hasRunningCourseItems(progress?.[course])) {
        changed = pauseCourseSide(progress, course, reason, options) || changed;
      }
    });
  });
  if (changed) {
    saveState();
    rerenderCourseViews();
    updateCourseTimerUi();
  }
  return changed;
}

function hasRunningCourseItems(side) {
  return Object.values(side?.sections || side?.steps || {}).some((item) => item.runningSince);
}

function pauseCourse(kind) {
  const progress = getCourseProgress();
  if (!progress?.[kind]) return;
  pauseCourseSide(progress, kind, "manual");
  saveState();
  rerenderCourseViews();
  updateCourseTimerUi();
}

async function resetCourseSession(kind) {
  const pack = getLatestLearningPack();
  const progress = pack ? getCourseProgress(pack.packId) : getCourseProgress();
  if (!pack || !progress?.[kind]) return false;
  const label = courseLabel(kind);
  const ok = confirm(`确认重新开始${label}吗？只会重置当前日期、当前课包、当前星球的本次学习；不影响其他星球、其他日期和已保存录音。`);
  if (!ok) return false;
  if (activeRecording?.course === kind) await stopActiveRecording("course_reset");
  const previousMode = progress.english?.selectedMode || "";
  const fresh = createDefaultCourseSide(kind, pack.packId);
  fresh.courseId = getCourseId(pack, kind);
  fresh.lessonId = getLessonId(pack, kind);
  if (kind === "english") fresh.selectedMode = previousMode || pack.english?.lesson?.defaultMode || pack.sharedPlan?.defaultEnglishMode || pack.loadMode || "light";
  progress[kind] = fresh;
  progress.breaks = (progress.breaks || []).filter((entry) => !String(entry.activityId || "").startsWith(`${kind}:`));
  initializeCourseProgress(pack);
  saveState();
  rerenderCourseViews();
  updateCourseTimerUi();
  return true;
}

function endCourse(kind, status = "stopped_early") {
  const progress = getCourseProgress();
  const side = progress?.[kind];
  if (!side) return;
  normalizeCourseTimer(side);
  if (side.isRunning && side.runningSince) {
    side.accumulatedMs = (side.accumulatedMs || 0) + (Date.now() - Number(side.runningSince));
    side.elapsedMs = side.accumulatedMs;
    side.isRunning = false;
    side.runningSince = null;
  }
  side.sessionStatus = countPendingActivities(kind).pending.length ? status : "completed";
  side.finishedAt = new Date().toISOString();
  if (activeRecording?.course === kind) stopActiveRecording("complete");
  saveState();
  rerenderCourseViews();
  const panel = $("#reportPanel");
  if (panel) panel.textContent = `${courseLabel(kind)}已保存。需要反馈时，请到家长观察站生成当前反馈。`;
}

function setCourseItemResult(key, result, hintLevelValue = 0) {
  const progress = getCourseProgress();
  if (isCourseItemLocked(key, progress)) return;
  const bucket = getCourseBucket(progress, key);
  const hintLevel = Number(hintLevelValue || 0);
  bucket[key] = {
    ...(bucket[key] || {}),
    result,
    hintLevelUsed: Math.max(bucket[key]?.hintLevelUsed || 0, Number.isFinite(hintLevel) ? hintLevel : 0),
    updatedAt: new Date().toISOString()
  };
  saveState();
  rerenderCourseViews();
}

function getCourseBucket(progress, key) {
  if (!progress) return {};
  if (key.startsWith("english:")) {
    progress.english.steps ||= {};
    return progress.english.steps;
  }
  if (key.startsWith("art:")) {
    progress.art.steps ||= {};
    return progress.art.steps;
  }
  progress.chinese.sections ||= {};
  return progress.chinese.sections;
}

function getCourseKindFromKey(key) {
  if (String(key).startsWith("english:")) return "english";
  if (String(key).startsWith("art:")) return "art";
  return "chinese";
}

function isCourseItemLocked(key, progress = getCourseProgress(), pack = getLatestLearningPack()) {
  if (!String(key).startsWith("art:")) return false;
  const stepId = String(key).replace(/^art:/, "");
  const step = getArtLessonSteps(pack).find((item) => item.id === stepId);
  if (!step) return false;
  return getArtStepLock(pack, step, progress).locked === true;
}

function setRecordingConsent(kind, value) {
  const progress = getCourseProgress();
  if (!progress?.[kind]) return;
  progress[kind].recordingConsent = value === "yes";
  progress[kind].recordingUnavailable = false;
  progress[kind].recordingUnavailableReason = "";
  saveState();
  rerenderCourseViews();
}

async function handleCourseRecordingAction(button) {
  const action = button.dataset.courseRecordingAction;
  const kind = button.dataset.courseRecordingKind || "chinese";
  if (action === "start") return startCourseRecording(kind);
  if (action === "pause") return pauseCourse(kind);
  if (action === "resume") {
    await startCourseSession(kind);
    if (getCourseRecordingUiState(kind) === "interrupted") return startCourseRecording(kind, { append: true });
    return null;
  }
  if (action === "save") return saveCourseRecording(kind);
  if (action === "play") return playCourseRecording(kind);
  if (action === "restart") return restartCourseRecording(kind);
  if (action === "delete") return deleteCourseRecording(kind);
  return null;
}

async function startCourseRecording(kind, options = {}) {
  const progress = getCourseProgress();
  const side = progress?.[kind];
  if (!side) return;
  const alreadyActive = activeRecording?.course === kind && activeRecording?.activityKey === getCourseRecordingKey(kind);
  if (recordingStartPending.has(kind) || side.courseRecordingStatus === "requesting" || alreadyActive) return;
  if (activeRecording && activeRecording.course !== kind) await stopActiveRecording("replaced");
  recordingStartPending.add(kind);
  side.recordingConsent = true;
  side.recordingUnavailable = false;
  side.recordingUnavailableReason = "";
  side.courseRecordingStatus = "requesting";
  saveState();
  try {
    if (!side.isRunning) await startCourseSession(kind, { skipRecordingSync: true });
    await startOrRetakeRecording(getCourseRecordingKey(kind), kind, Boolean(options.replace), { category: "course_recording", skipConsent: true, immediate: true });
  } finally {
    recordingStartPending.delete(kind);
  }
}

function pauseActiveRecording(kind) {
  if (!activeRecording || activeRecording.course !== kind || activeRecording.paused) return;
  const session = activeRecording;
  try { session.recorder?.requestData?.(); } catch {}
  if (session.recorder && session.recorder.state === "recording" && typeof session.recorder.pause === "function") {
    session.recorder.pause();
    session.paused = true;
    updateRecordingClip(session.clipId, { status: "paused" });
    updateCourseRecordingStatus(kind, "paused");
    updateActivityRecordingStatus(session.activityKey, "录音已暂停");
  } else {
    stopActiveRecording("paused");
    updateCourseRecordingStatus(kind, "interrupted");
  }
  saveState();
}

function resumeActiveRecording(kind) {
  if (!activeRecording || activeRecording.course !== kind || !activeRecording.paused) return false;
  const session = activeRecording;
  if (session.recorder && session.recorder.state === "paused" && typeof session.recorder.resume === "function") {
    session.recorder.resume();
    session.paused = false;
    updateRecordingClip(session.clipId, { status: "recording" });
    updateCourseRecordingStatus(kind, "recording");
    updateActivityRecordingStatus(session.activityKey, "正在录音");
    saveState();
    rerenderCourseViews();
    return true;
  }
  return false;
}

async function saveCourseRecording(kind) {
  updateCourseRecordingStatus(kind, "saving");
  if (activeRecording?.course === kind) {
    try { activeRecording.recorder?.requestData?.(); } catch {}
    await stopActiveRecording("complete");
  } else {
    updateCourseRecordingStatus(kind, "saved");
  }
  rerenderCourseViews();
}

async function restartCourseRecording(kind) {
  if (!confirm("确认重新录制本节中文课吗？已有本节录音会被删除，学习进度和计时不会受影响。")) return;
  await deleteCourseRecording(kind, { skipConfirm: true });
  return startCourseRecording(kind, { replace: true });
}

async function deleteCourseRecording(kind, options = {}) {
  if (!options.skipConfirm && !confirm("确认删除当前日期中文课录音吗？学习进度和计时不会受影响。")) return;
  if (activeRecording?.course === kind) await stopActiveRecording("deleted");
  const clips = getCourseRecordingClips(kind);
  for (const clip of clips) {
    try { await deleteRecordingChunks(clip.clipId); } catch {}
    delete state.recordingClips?.[clip.clipId];
  }
  const progress = getCourseProgress();
  if (progress?.[kind]) {
    progress[kind].courseRecordingStatus = "idle";
    progress[kind].recordingConsent = false;
  }
  saveState();
  rerenderCourseViews();
}

async function buildCourseRecordingBlob(kind) {
  const clips = getCourseRecordingClips(kind);
  const parts = [];
  let mimeType = "";
  for (const clip of clips) {
    const chunks = await getRecordingChunks(clip.clipId);
    chunks.forEach((item) => parts.push(item.blob));
    mimeType ||= clip.mimeType || "";
  }
  return parts.length ? new Blob(parts, { type: mimeType || "audio/webm" }) : null;
}

async function playCourseRecording(kind) {
  const blob = await buildCourseRecordingBlob(kind);
  if (!blob) {
    $("#recordingLibraryPanel") && ($("#recordingLibraryPanel").textContent = "这节课还没有可播放的录音。");
    return;
  }
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
}

function updateCourseRecordingStatus(kind, status, reason = "") {
  const progress = getCourseProgress();
  if (!progress?.[kind]) return;
  progress[kind].courseRecordingStatus = status;
  if (reason) progress[kind].recordingInterruptionReason = reason;
  progress[kind].recordingUpdatedAt = new Date().toISOString();
  saveState();
}

function getSupportedRecordingMime() {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
  return candidates.find((mime) => MediaRecorder.isTypeSupported?.(mime)) || "";
}

async function handleRecordingAction(button) {
  const action = button.dataset.recordingAction;
  const key = button.dataset.recordingKey;
  const course = button.dataset.recordingCourse || getCourseKindFromKey(key);
  if (action === "start" || action === "retake") return startOrRetakeRecording(key, course, action === "retake");
  if (action === "stop") return stopActiveRecording("complete");
  return null;
}

async function startOrRetakeRecording(activityKey, course, retake = false, options = {}) {
  stopReadAloud();
  if (activeRecording) await stopActiveRecording("replaced");
  const progress = getCourseProgress();
  const side = progress?.[course];
  if (!side?.recordingConsent && !options.skipConsent) return;
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    markRecordingUnavailable(course, "当前浏览器不支持网页录音");
    return;
  }
  const mimeType = getSupportedRecordingMime();
  if (!mimeType) {
    markRecordingUnavailable(course, "当前浏览器没有可用音频格式");
    return;
  }
  try {
    updateCourseRecordingStatus(course, "requesting");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const pack = getLatestLearningPack();
    const bucket = getCourseBucket(progress, activityKey);
    const existingTakes = getRecordingClipsForActivity(activityKey).length;
    const takeNumber = existingTakes + 1;
    const clipId = `${pack.packId}-${activityKey.replace(/[^a-z0-9_-]+/gi, "-")}-${Date.now().toString(36)}`;
    const startedAt = new Date().toISOString();
    const clip = {
      clipId,
      sessionId: side.sessionId || `${pack.packId}:${course}`,
      packId: pack.packId,
      planetId: course,
      courseId: getCourseId(pack, course),
      lessonId: getLessonId(pack, course),
      activityId: activityKey,
      takeNumber,
      startedAt,
      endedAt: "",
      duration: 0,
      mimeType,
      size: 0,
      status: "countdown",
      chunkCount: 0,
      includeInFeedback: true,
      category: options.category || findRecordingConfigForActivity(pack, activityKey)?.category || "oral_answer",
      segmentIndex: existingTakes,
      interruptionReason: "",
      retakeOf: retake ? getRecordingClipsForActivity(activityKey).at(-1)?.clipId || "" : ""
    };
    state.recordingClips ||= {};
    state.recordingClips[clipId] = clip;
    bucket[activityKey] = { ...(bucket[activityKey] || {}), recordingStatusText: "3秒后开始记录", recordingUnavailable: false };
    saveState();
    rerenderCourseViews();
    activeRecording = { clipId, activityKey, course, stream, recorder: null, startedAtMs: 0, countdownTimer: null, maxTimer: null, requesting: true, paused: false };
    const begin = () => beginMediaRecorder(activeRecording, mimeType);
    if (options.immediate) begin();
    else activeRecording.countdownTimer = setTimeout(begin, 3000);
  } catch (error) {
    markRecordingUnavailable(course, error?.name === "NotAllowedError" ? "麦克风授权被拒绝" : "麦克风无法启动");
  }
}

function beginMediaRecorder(session, mimeType) {
  if (!activeRecording || activeRecording.clipId !== session.clipId) return;
  const recorder = new MediaRecorder(session.stream, { mimeType });
  session.recorder = recorder;
  session.requesting = false;
  session.startedAtMs = Date.now();
  updateRecordingClip(session.clipId, { status: "recording" });
  updateCourseRecordingStatus(session.course, "recording");
  updateActivityRecordingStatus(session.activityKey, "正在记录");
  session.stream?.getTracks?.().forEach((track) => {
    track.onended = () => {
      if (activeRecording?.clipId === session.clipId) stopActiveRecording("track_ended");
    };
  });
  recorder.ondataavailable = async (event) => {
    if (!event.data || event.data.size === 0) return;
    await saveRecordingChunk(session.clipId, event.data);
  };
  recorder.onerror = () => stopActiveRecording("recorder_error");
  recorder.onstop = () => finishRecordingSession(session);
  recorder.start(RECORDING_TIMESLICE_MS);
  session.maxTimer = setTimeout(() => stopActiveRecording("max_seconds"), getRecordingMaxSeconds(session.activityKey) * 1000);
  rerenderCourseViews();
}

async function stopActiveRecording(reason = "complete") {
  if (!activeRecording) return;
  const session = activeRecording;
  activeRecording = null;
  clearTimeout(session.countdownTimer);
  clearTimeout(session.maxTimer);
  try { session.recorder?.requestData?.(); } catch {}
  updateRecordingClip(session.clipId, { interruptionReason: reason === "complete" ? "" : reason });
  if (session.recorder && session.recorder.state !== "inactive") {
    try { session.recorder.stop(); } catch {}
  } else {
    finishRecordingSession(session, reason);
  }
}

function interruptActiveRecording(reason) {
  if (!activeRecording) return;
  stopActiveRecording(reason);
}

function finishRecordingSession(session) {
  const clip = state.recordingClips?.[session.clipId];
  const endedAt = new Date().toISOString();
  const duration = session.startedAtMs ? Math.round((Date.now() - session.startedAtMs) / 1000) : 0;
  const interrupted = Boolean(clip?.interruptionReason && !["complete", ""].includes(clip.interruptionReason));
  updateRecordingClip(session.clipId, {
    endedAt,
    duration,
    status: interrupted ? "interrupted" : "complete"
  });
  session.stream?.getTracks?.().forEach((track) => track.stop());
  updateActivityRecordingStatus(session.activityKey, interrupted ? "录音已中断，可继续录一段" : "录音已保存");
  updateCourseRecordingStatus(session.course, interrupted ? "interrupted" : "saved", clip?.interruptionReason || "");
  saveState();
  rerenderCourseViews();
}

function updateActivityRecordingStatus(activityKey, text) {
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, activityKey);
  const clipIds = getRecordingClipsForActivity(activityKey).map((clip) => clip.clipId);
  bucket[activityKey] = { ...(bucket[activityKey] || {}), recordingStatusText: text, recordingClipIds: clipIds, recordingUpdatedAt: new Date().toISOString() };
  saveState();
}

function markRecordingUnavailable(course, reason) {
  const progress = getCourseProgress();
  if (!progress?.[course]) return;
  progress[course].recordingUnavailable = true;
  progress[course].recordingUnavailableReason = reason;
  saveState();
  rerenderCourseViews();
}

function updateRecordingClip(clipId, patch) {
  state.recordingClips ||= {};
  state.recordingClips[clipId] = { ...(state.recordingClips[clipId] || { clipId }), ...patch };
  saveState();
}

function findRecordingConfigForActivity(pack, activityKey) {
  const [course, ...rest] = String(activityKey).split(":");
  const id = rest[0];
  if (course === "chinese") {
    const section = getChineseLessonSections(pack).find((item) => item.id === id);
    if (section?.recording) return section.recording;
    const questionId = rest.join(":").replace(/^/, "");
    return section?.questions?.find((_, index) => `${section.id}_${index}` === questionId)?.recording || null;
  }
  if (course === "english") return getEnglishLessonSteps(pack).find((item) => item.id === id)?.recording || null;
  if (course === "art") return [pack.art?.warmup, ...(pack.art?.steps || [])].find((item) => item?.id === id)?.recording || null;
  return null;
}

function getRecordingMaxSeconds(activityKey) {
  const config = findRecordingConfigForActivity(getLatestLearningPack(), activityKey);
  return Math.min(RECORDING_MAX_SECONDS, Math.max(1, Number(config?.maxSeconds || 120)));
}

function openRecordingDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("indexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(RECORDING_DB_NAME, RECORDING_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("chunks")) db.createObjectStore("chunks", { keyPath: "chunkId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveRecordingChunk(clipId, blob) {
  const db = await openRecordingDb();
  const clip = state.recordingClips?.[clipId] || {};
  const chunkIndex = Number(clip.chunkCount || 0);
  const chunkId = `${clipId}-${chunkIndex}`;
  await new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readwrite");
    tx.objectStore("chunks").put({ chunkId, clipId, chunkIndex, blob, size: blob.size, createdAt: new Date().toISOString() });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  updateRecordingClip(clipId, { chunkCount: chunkIndex + 1, size: Number(clip.size || 0) + blob.size });
}

async function getRecordingChunks(clipId) {
  const db = await openRecordingDb();
  const chunks = await new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readonly");
    const request = tx.objectStore("chunks").getAll();
    request.onsuccess = () => resolve(request.result.filter((item) => item.clipId === clipId).sort((a, b) => a.chunkIndex - b.chunkIndex));
    request.onerror = () => reject(request.error);
  });
  db.close();
  return chunks;
}

async function playRecordingClip(clipId) {
  try {
    const clip = state.recordingClips?.[clipId];
    const chunks = await getRecordingChunks(clipId);
    if (!clip || !chunks.length) {
      $("#recordingLibraryPanel").textContent = "这段录音没有可播放的数据。";
      return;
    }
    const blob = new Blob(chunks.map((item) => item.blob), { type: clip.mimeType || "audio/webm" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  } catch {
    $("#recordingLibraryPanel").textContent = "没有播放成功，请再点一次。";
  }
}

async function deleteRecordingClip(clipId) {
  if (!confirm("确认删除这段本机录音吗？")) return;
  try {
    await deleteRecordingChunks(clipId);
  } catch {
    // Metadata deletion still proceeds so broken records can be cleared.
  }
  delete state.recordingClips?.[clipId];
  saveState();
  renderRecordingLibrary();
  rerenderCourseViews();
}

async function deleteRecordingChunks(clipId) {
  const db = await openRecordingDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction("chunks", "readwrite");
    const store = tx.objectStore("chunks");
    const request = store.getAll();
    request.onsuccess = () => {
      request.result.filter((item) => item.clipId === clipId).forEach((item) => store.delete(item.chunkId));
    };
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

function renderRecordingLibrary() {
  const panel = $("#recordingLibraryPanel");
  if (!panel) return;
  const clips = Object.values(state.recordingClips || {}).sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));
  if (!clips.length) {
    panel.textContent = "暂无录音。";
    return;
  }
  panel.innerHTML = `
    <div class="recording-library">
      ${clips.map((clip) => `
        <div class="recording-library-item">
          <strong>${escapeHtml(courseLabel(clip.planetId))} · ${escapeHtml(clip.activityId)}</strong>
          <p>${escapeHtml(clip.status)} · ${Math.round(clip.duration || 0)}秒 · ${escapeHtml(clip.mimeType || "")} · ${clip.chunkCount || 0} chunks</p>
          <div class="actions compact">
            <button class="button secondary compact-button" data-recording-play="${escapeHtml(clip.clipId)}" type="button">试听<br /><span>Play</span></button>
            <button class="button ghost compact-button" data-recording-delete="${escapeHtml(clip.clipId)}" type="button">删除<br /><span>Delete</span></button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function maybeAllDone(map) {
  const entries = Object.values(map || {});
  return entries.length > 0 && entries.every((item) => item.finishedAt);
}

function toggleCourseAnswer(button) {
  const key = button.dataset.courseToggleAnswer;
  const answer = document.querySelector(`[data-course-answer="${CSS.escape(key)}"]`);
  if (answer) answer.hidden = !answer.hidden;
  const progress = getCourseProgress();
  const bucketKey = key.includes(":") ? key : `chinese:${key}`;
  const bucket = getCourseBucket(progress, bucketKey);
  bucket[bucketKey] = {
    ...(bucket[bucketKey] || {}),
    hintLevelUsed: Math.max(bucket[bucketKey]?.hintLevelUsed || 0, 2),
    viewedAnswer: !answer?.hidden,
    updatedAt: new Date().toISOString()
  };
  saveState();
}

function selectCourseChoice(button) {
  const questionKey = button.dataset.courseChoice;
  const value = button.dataset.choiceValue || "";
  const context = getChineseQuestionContext(questionKey);
  if (!context || !value) return;
  const progress = getCourseProgress();
  const bucket = getCourseBucket(progress, context.sectionKey);
  const existing = bucket[context.sectionKey] || {};
  const optionOrder = getChineseQuestionOptionOrder(context.question, context.questionKey, existing);
  const selectedIndex = optionOrder.findIndex((option) => normalizeSentenceAnswer(option) === normalizeSentenceAnswer(value));
  bucket[context.sectionKey] = {
    ...existing,
    pendingChoices: {
      ...(existing.pendingChoices || {}),
      [context.questionKey]: {
        questionKey: context.questionKey,
        selected: value,
        selectedLetter: selectedIndex >= 0 ? choiceLetter(selectedIndex) : "",
        optionOrder,
        selectedAt: new Date().toISOString()
      }
    },
    confirmationMessage: "",
    updatedAt: new Date().toISOString()
  };
  saveState();
  renderChineseLesson();
}

function playArtNarration(button) {
  const key = button.dataset.artAudio;
  const assetId = button.dataset.audioAsset || "";
  const text = button.dataset.ttsText || "";
  const progress = getCourseProgress();
  const item = progress.art.steps[key] || {};
  const usedFallback = !assetId;
  progress.art.steps[key] = {
    ...item,
    audioPlays: (item.audioPlays || 0) + 1,
    audioFallbackUsed: Boolean(item.audioFallbackUsed || usedFallback),
    updatedAt: new Date().toISOString()
  };
  saveState();
  if (assetId) {
    $("#reportPanel").textContent = `音频资产 ${assetId} 已记录。本阶段资源包播放器接口已预留。`;
    return;
  }
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = button.dataset.slow ? 0.85 : 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

function revealArtHint(button) {
  const key = button.dataset.artHint;
  const progress = getCourseProgress();
  if (isCourseItemLocked(key, progress)) return;
  const item = progress.art.steps[key] || {};
  const nextLevel = Math.min((item.hintLevelUsed || 0) + 1, 3);
  progress.art.steps[key] = { ...item, hintLevelUsed: nextLevel, result: item.result || "prompted", updatedAt: new Date().toISOString() };
  saveState();
  document.querySelectorAll(`[data-art-hint-text="${CSS.escape(key)}"]`).forEach((node) => {
    node.hidden = Number(node.dataset.hintIndex || 0) > nextLevel;
  });
}

function setEnglishCourseMode(mode) {
  const pack = getLatestLearningPack();
  if (!pack || !getAllowedEnglishModes(pack).includes(mode)) return;
  const progress = getCourseProgress(pack.packId);
  progress.english.selectedMode = mode;
  saveState();
  renderTodayDashboard();
  renderEnglishLesson();
}

function getSelectedEnglishMode(pack) {
  const progress = getCourseProgress(pack.packId);
  const allowed = getAllowedEnglishModes(pack);
  const selected = progress?.english?.selectedMode || pack.english?.lesson?.defaultMode || pack.sharedPlan?.defaultEnglishMode || pack.loadMode || "light";
  return allowed.includes(selected) ? selected : allowed[0] || "light";
}

function getSuggestedEnglishMode(pack, progress = getCourseProgress(pack.packId)) {
  const allowed = getAllowedEnglishModes(pack);
  const rules = pack.sharedPlan?.fallbackRules || {};
  const chineseElapsedMinutes = Math.round(getTotalElapsed(progress.chinese.sections) / 60000);
  const childEase = Number(progress.chinese.childEase);
  const parentEase = Number(progress.chinese.parentEase);
  const minEase = Math.min(Number.isFinite(childEase) ? childEase : 10, Number.isFinite(parentEase) ? parentEase : 10);
  if (minEase < (rules.recoveryEaseBelow ?? 6) && allowed.includes("recovery")) return "recovery";
  if ((chineseElapsedMinutes > (rules.chineseOverMinutes ?? 45) || minEase < (rules.easeBelow ?? 7)) && allowed.includes("light")) return "light";
  const defaultMode = pack.english?.lesson?.defaultMode || pack.sharedPlan?.defaultEnglishMode || "light";
  return allowed.includes(defaultMode) ? defaultMode : allowed[0] || "light";
}

function getAllowedEnglishModes(pack) {
  return pack.english?.lesson?.allowedModes?.length ? pack.english.lesson.allowedModes : ["recovery", "light", "standard"];
}

function getPlannedChineseMinutes(pack) {
  return pack.sharedPlan?.plannedChineseMinutes || pack.practice?.chineseMinutes || 35;
}

function getPlannedEnglishMinutes(pack, mode = getSelectedEnglishMode(pack)) {
  const steps = getEnglishLessonSteps(pack);
  const bySteps = steps.reduce((sum, step) => sum + getStepMinutes(step, mode), 0);
  if (bySteps) return bySteps;
  return pack.sharedPlan?.plannedEnglishMinutes || pack.practice?.englishMinutes || (mode === "standard" ? 28 : mode === "recovery" ? 12 : 20);
}

function getStepMinutes(step, mode) {
  return Number(step.minutesByMode?.[mode] ?? step.minutesByMode?.light ?? step.plannedMinutes ?? 0) || 0;
}

function englishModeLabel(mode) {
  return { recovery: "恢复 / Recovery", light: "轻量 / Light", standard: "标准 / Standard" }[mode] || mode;
}

function toolLabel(tool) {
  if (tool === "daily_english_listening") return "每日英语听力 App";
  if (tool === "website_and_daily_english_listening") return "网站 + 每日英语听力";
  if (tool === "website_and_parent") return "网站 + 家长";
  if (tool === "website") return "网站";
  return tool || "网站";
}

function renderAppPath(pack) {
  const locator = pack.english?.lesson?.appLocator || {};
  return [locator.appName || "每日英语听力", locator.folder, locator.article, locator.targetSentence || pack.english?.anchorSentence].filter(Boolean).join(" · ");
}

function countCompletedCourseItems(map) {
  return Object.values(map || {}).filter((item) => item.finishedAt).length;
}

function getTotalElapsed(map) {
  return Object.values(map || {}).reduce((sum, item) => sum + (item.elapsedMs || 0) + (item.runningSince ? Date.now() - item.runningSince : 0), 0);
}

function formatElapsed(ms) {
  const seconds = Math.max(0, Math.round((ms || 0) / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function getCourseTimerState(kind) {
  const pack = getLatestLearningPack();
  const progress = pack ? getCourseProgress(pack.packId) : getCourseProgress();
  const side = progress?.[kind];
  normalizeCourseTimer(side);
  const elapsed = getCourseElapsed(side, side?.sections || side?.steps || {});
  return {
    kind,
    started: Boolean(side?.startedAt),
    running: Boolean(side?.isRunning),
    elapsed,
    label: side?.isRunning ? `计时中 ${formatElapsed(elapsed)}` : side?.startedAt ? `已暂停 ${formatElapsed(elapsed)}` : "尚未开始 0:00"
  };
}

function startCourseTimerTicker() {
  if (courseTimerInterval) return;
  courseTimerInterval = setInterval(updateCourseTimerUi, 1000);
  window.addEventListener?.("scroll", updateCourseTimerUi, { passive: true });
  window.addEventListener?.("resize", updateCourseTimerUi);
  updateCourseTimerUi();
}

function persistCourseTimerHeartbeat(force = false) {
  const now = Date.now();
  if (!force && now - lastCourseTimerHeartbeatWriteAt < COURSE_TIMER_HEARTBEAT_MS) return false;
  let changed = false;
  Object.values(state.courseProgress || {}).forEach((progress) => {
    ["chinese", "english", "art"].forEach((course) => {
      const side = progress?.[course];
      if (!side?.isRunning) return;
      side.timerModelVersion = COURSE_TIMER_MODEL_VERSION;
      side.lastHeartbeatAt = now;
      changed = true;
    });
  });
  if (changed) {
    lastCourseTimerHeartbeatWriteAt = now;
    saveState();
  }
  return changed;
}

function getActiveCourseKind() {
  const active = getActiveView();
  if (active === "today-chinese") return "chinese";
  if (active === "today-english") return "english";
  if (active === "today-art") return "art";
  return "";
}

function ensureCourseFloatingTimer() {
  let bar = $("#courseFloatingTimer");
  if (bar) return bar;
  if (!document.createElement || !document.body?.appendChild) {
    return { hidden: true, dataset: {}, querySelector: () => null };
  }
  bar = document.createElement("div");
  bar.id = "courseFloatingTimer";
  bar.className = "course-floating-timer";
  bar.hidden = true;
  bar.innerHTML = `
    <span data-floating-timer-label>尚未开始 0:00</span>
    <span class="floating-recording-state" data-floating-recording-state hidden></span>
    <button class="button secondary compact-button" data-floating-timer-action type="button">开始今天的学习</button>
  `;
  document.body.appendChild(bar);
  bar.querySelector("[data-floating-timer-action]")?.addEventListener("click", () => {
    const kind = bar.dataset.courseKind;
    if (!kind) return;
    const timer = getCourseTimerState(kind);
    if (timer.running) pauseCourse(kind);
    else startCourseSession(kind);
  });
  return bar;
}

function updateCourseTimerUi() {
  persistCourseTimerHeartbeat(false);
  const activeKind = getActiveCourseKind();
  ["chinese", "english", "art"].forEach((kind) => {
    const timer = getCourseTimerState(kind);
    $$(`[data-course-timer-display="${kind}"]`).forEach((node) => { node.textContent = timer.label; });
  });
  const bar = ensureCourseFloatingTimer();
  if (!activeKind) {
    bar.hidden = true;
    if (courseTimerObserver) courseTimerObserver.disconnect();
    courseTimerObserver = null;
    courseTimerObservedKind = "";
    return;
  }
  const timer = getCourseTimerState(activeKind);
  bar.dataset.courseKind = activeKind;
  const label = bar.querySelector("[data-floating-timer-label]");
  const action = bar.querySelector("[data-floating-timer-action]");
  const recording = bar.querySelector("[data-floating-recording-state]");
  if (label) label.textContent = timer.label;
  if (recording) {
    const recordingState = getCourseRecordingUiState(activeKind);
    const visible = ["recording", "paused", "interrupted"].includes(recordingState);
    recording.hidden = !visible;
    recording.textContent = recordingState === "recording" ? "● 录音中" : recordingState === "paused" ? "录音已暂停" : "录音已中断";
  }
  if (action) {
    action.textContent = timer.running ? "暂停" : timer.started ? "继续" : "开始今天的学习";
    action.className = `button ${timer.running ? "secondary" : "primary"} compact-button`;
  }
  setupCourseTimerObserver(activeKind);
  updateFloatingTimerVisibility(activeKind);
}

function setupCourseTimerObserver(kind) {
  const root = document.querySelector(`[data-course-timer-root="${kind}"]`);
  const bar = ensureCourseFloatingTimer();
  if (!root || !("IntersectionObserver" in window)) {
    bar.hidden = !kind;
    return;
  }
  if (courseTimerObservedKind === kind && courseTimerObserver) return;
  if (courseTimerObserver) courseTimerObserver.disconnect();
  courseTimerObservedKind = kind;
  courseTimerObserver = new IntersectionObserver((entries) => {
    if (entries[0]) updateFloatingTimerVisibility(kind);
  }, { threshold: 0 });
  courseTimerObserver.observe(root);
}

function updateFloatingTimerVisibility(kind) {
  const bar = ensureCourseFloatingTimer();
  const root = document.querySelector?.(`[data-course-timer-root="${kind}"]`);
  const active = getActiveCourseKind() === kind;
  bar.hidden = !active || !shouldShowCourseFloatingTimer(root);
}

function shouldShowCourseFloatingTimer(root, viewportHeight = window.innerHeight || 0) {
  if (!root?.getBoundingClientRect) return false;
  const rect = root.getBoundingClientRect();
  return rect.bottom <= 0 || rect.top >= viewportHeight;
}

function updateCourseFeedbackField(target) {
  const pack = getLatestLearningPack();
  if (!pack) return;
  const progress = getCourseProgress(pack.packId);
  const kind = target.dataset.courseEase || target.dataset.courseHardest || target.dataset.courseAudio || target.dataset.courseNote;
  const bucket = kind === "english" ? progress.english : kind === "art" ? progress.art : progress.chinese;
  if (target.dataset.courseEase) bucket[target.dataset.easeKind] = target.value === "" ? null : clampNumber(target.value, 0, 10, null);
  if (target.dataset.courseHardest) {
    const value = target.dataset.hardestId || target.value;
    const current = new Set(bucket.hardestSections || (bucket.hardest ? [bucket.hardest] : []));
    if (value === "none") {
      bucket.hardestSections = target.checked ? ["none"] : [];
    } else {
      current.delete("none");
      if (target.checked) current.add(value);
      else current.delete(value);
      bucket.hardestSections = [...current];
    }
    bucket.hardest = bucket.hardestSections[0] || "";
  }
  if (target.dataset.courseAudio) bucket.audioFeedbackExpected = target.checked;
  if (target.dataset.courseNote) bucket.note = safePlainText(target.value, 800);
  saveState();
  renderTodayDashboard();
}

function getCourseBlockPool(step, pack) {
  const required = step.blocks?.length ? step.blocks : pack.english?.pattern?.blocks || splitSentenceToBlocks(step.targetSentences?.[0] || pack.english?.anchorSentence || "");
  return stableShuffle(required, `${pack.packId}:${step.id}:blocks`);
}

function selectCourseBlock(button) {
  const key = button.dataset.courseBlock;
  const index = Number(button.dataset.blockIndex);
  const progress = getCourseProgress();
  progress.english.blockAnswers ||= {};
  const selected = progress.english.blockAnswers[key] || [];
  progress.english.blockAnswers[key] = selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index];
  saveState();
  renderEnglishLesson();
}

function resetCourseBlocks(key) {
  const progress = getCourseProgress();
  progress.english.blockAnswers ||= {};
  progress.english.blockAnswers[key] = [];
  progress.english.steps[key] = { ...(progress.english.steps[key] || {}), blockFeedback: "" };
  saveState();
  renderEnglishLesson();
}

function submitCourseBlocks(key) {
  const pack = getLatestLearningPack();
  const step = getEnglishLessonSteps(pack).find((item) => `english:${item.id}` === key);
  if (!step) return;
  const progress = getCourseProgress(pack.packId);
  const pool = getCourseBlockPool(step, pack);
  const selected = progress.english.blockAnswers?.[key] || [];
  const answer = selected.map((index) => pool[index]).join(" ").replace(/\s+([,.!?])/g, "$1");
  const accepted = (step.acceptedAnswers?.length ? step.acceptedAnswers : step.targetSentences || [pack.english?.anchorSentence]).filter(Boolean);
  const correct = accepted.some((item) => normalizeSentenceAnswer(item) === normalizeSentenceAnswer(answer));
  progress.english.steps[key] = {
    ...(progress.english.steps[key] || {}),
    result: correct ? "independent" : "prompted",
    blockAnswer: answer,
    blockFeedback: correct ? "拼对了，可以继续下一步。" : "再想想哪些积木不需要，或顺序哪里不对。",
    blockSubmissions: (progress.english.steps[key]?.blockSubmissions || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  saveState();
  renderEnglishLesson();
}

function normalizeSentenceAnswer(value) {
  return String(value || "").toLowerCase().replace(/[“”"'.!?。，！？]/g, "").replace(/\s+/g, " ").trim();
}

function rerenderCourseViews() {
  renderTodayDashboard();
  renderPlanetOverview();
  renderPlanetPages();
  if ($("#today-chinese")?.classList.contains("active")) renderChineseLesson();
  if ($("#today-english")?.classList.contains("active")) renderEnglishLesson();
  if ($("#today-art")?.classList.contains("active")) renderArtLesson();
  scheduleBreakCountdown();
  updateCourseTimerUi();
}

function scheduleBreakCountdown() {
  if (breakCountdownTimer) {
    clearInterval(breakCountdownTimer);
    breakCountdownTimer = null;
  }
  const progress = getCourseProgress();
  const maps = [progress?.chinese?.sections, progress?.english?.steps, progress?.art?.steps].filter(Boolean);
  const hasActiveBreak = maps.some((map) => Object.values(map).some((item) => item.breakEndsAt && !item.breakFinishedAt));
  if (!hasActiveBreak) return;
  breakCountdownTimer = setInterval(() => {
    const activeProgress = getCourseProgress();
    const activeMaps = [activeProgress?.chinese?.sections, activeProgress?.english?.steps, activeProgress?.art?.steps].filter(Boolean);
    activeMaps.forEach((map) => Object.entries(map).forEach(([key, item]) => {
      if (item.breakEndsAt && !item.breakFinishedAt && Date.now() >= Number(item.breakEndsAt)) endBreak(key, "timer_complete");
    }));
    if ($("#today-chinese")?.classList.contains("active")) renderChineseLesson();
    if ($("#today-english")?.classList.contains("active")) renderEnglishLesson();
    if ($("#today-art")?.classList.contains("active")) renderArtLesson();
  }, 1000);
}

function playSoftBreakSignal() {
  try {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 660;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
    setTimeout(() => context.close?.(), 300);
  } catch {
    // Browser may block non-user initiated audio; the visual countdown remains authoritative.
  }
}

function buildFeedbackPackage(course = "snapshot") {
  const pack = getLatestLearningPack();
  if (!pack) return null;
  const progress = getCourseProgress(pack.packId);
  if (["chinese", "english", "art"].includes(course)) return buildSingleCourseFeedback(pack, progress, course);
  return buildCurrentFeedbackSnapshot(pack, progress);
}

function buildCurrentFeedbackSnapshot(pack, progress) {
  const sequence = Number(state.feedbackSnapshotSequence || 0) + 1;
  const generatedAt = new Date().toISOString();
  const planets = {
    chinese: buildPlanetSnapshot(pack, progress, "chinese"),
    english: buildPlanetSnapshot(pack, progress, "english"),
    art: buildPlanetSnapshot(pack, progress, "art")
  };
  const plannedPlanetCount = Object.values(planets).filter((planet) => planet.status !== "not_scheduled").length;
  const startedPlanetCount = Object.values(planets).filter((planet) => !["not_scheduled", "not_started"].includes(planet.status)).length;
  const completedPlanetCount = Object.values(planets).filter((planet) => planet.status === "completed").length;
  const payload = {
    schemaVersion: "helen-learning-feedback/1",
    schema: "helen-learning-feedback/1",
    reportMode: "current_snapshot",
    snapshotId: `${pack.packId}-snapshot-${Date.now().toString(36)}`,
    sequence,
    generatedAt,
    localDate: new Date().toISOString().slice(0, 10),
    learnerId: progress.learnerId || "helen",
    packId: pack.packId,
    date: pack.date,
    activeDate: pack.date,
    activeLearningContext: {
      importedPackIds: Object.keys(state.learningPacks || {}),
      activePackIdsByPlanet: {
        chinese: planets.chinese.status === "not_scheduled" ? [] : [pack.packId],
        english: planets.english.status === "not_scheduled" ? [] : [pack.packId],
        art: planets.art.status === "not_scheduled" ? [] : [pack.packId]
      }
    },
    overall: {
      plannedPlanetCount,
      startedPlanetCount,
      completedPlanetCount,
      totalActiveMinutes: roundMinutes(Object.values(planets).reduce((sum, planet) => sum + (planet.elapsedSeconds || 0), 0) * 1000),
      breakMinutes: roundMinutes((progress.breaks || []).reduce((sum, item) => sum + (item.elapsedMs || 0), 0))
    },
    planets,
    attachmentsExpected: collectSnapshotAttachments(planets)
  };
  const human = formatSnapshotHuman(payload, pack);
  return { human, payload };
}

function buildPlanetSnapshot(pack, progress, course) {
  const scheduled = isPlanetScheduled(pack, course);
  const single = buildSingleCourseFeedback(pack, progress, course, { scheduled }).payload;
  return {
    status: scheduled ? single.sessionStatus : "not_scheduled",
    courseId: scheduled ? single.courseId : "",
    lessonId: scheduled ? single.lessonId : "",
    sessionId: scheduled ? single.resumeToken : "",
    packId: scheduled ? pack.packId : "",
    completionRatio: scheduled ? single.completionRatio : 0,
    completedActivityIds: scheduled ? single.completedActivityIds : [],
    lastCompletedActivityId: scheduled ? single.lastCompletedActivityId : "",
    pendingActivityIds: scheduled ? single.pendingActivityIds : [],
    activeMinutes: scheduled ? roundMinutes((single.shared?.totalElapsedSeconds || 0) * 1000) : 0,
    elapsedMinutes: scheduled ? roundMinutes((single.shared?.totalElapsedSeconds || 0) * 1000) : 0,
    elapsedSeconds: scheduled ? (single.shared?.totalElapsedSeconds || 0) : 0,
    breakMinutes: 0,
    childEase: single.shared?.childEase ?? null,
    parentEase: single.shared?.parentEase ?? null,
    hardestActivityId: single.shared?.hardestActivityId || "",
    hardestSections: single.shared?.hardestSections || [],
    stoppedReason: single.stoppedReason || "",
    notes: progress?.[course]?.note || "",
    audioFeedbackExpected: Boolean(single.audioFeedbackExpected),
    audioFileNames: single.audioFileNames || [],
    artworkPhotoExpected: Boolean(single.art?.artworkPhotoExpected),
    artworkFileName: single.art?.artworkFileName || "",
    recordings: getRecordingManifestForCourse(course),
    recordingSummary: summarizeRecordings(getRecordingManifestForCourse(course)),
    courseRecording: summarizeCourseRecording(course),
    readingAnnotations: course === "chinese" && scheduled ? summarizeReadingAnnotations(progress.chinese.readingAnnotations || {}) : null,
    interactions: scheduled ? getCourseInteractions(single, course) : [],
    answers: scheduled ? getCourseAnswers(single, course) : [],
    rawCourse: scheduled ? single[course] : null
  };
}

function summarizeReadingAnnotations(annotations = {}) {
  const details = Object.values(annotations).flatMap((section) => Object.values(section.characters || {}).map((item) => ({
    character: item.character,
    status: item.status,
    sectionId: section.sectionId,
    paragraphIndexes: item.paragraphIndexes || [],
    firstMarkedAt: item.firstMarkedAt || "",
    updatedAt: item.updatedAt || ""
  })));
  return {
    unknownCharacters: [...new Set(details.filter((item) => item.status === "unknown").map((item) => item.character))],
    unsureCharacters: [...new Set(details.filter((item) => item.status === "unsure").map((item) => item.character))],
    details
  };
}

function formatSnapshotHuman(payload, pack) {
  const planetLine = (label, planet) => `${label}：${snapshotStatusLabel(planet.status)}${["in_progress", "paused"].includes(planet.status) ? ` ${Math.round((planet.completionRatio || 0) * 100)}%` : ""}`;
  const audioCount = payload.attachmentsExpected?.audio?.length || 0;
  return [
    "请优先使用最新生成时间的反馈。",
    audioCount ? `本次另有${audioCount}段录音，请同时发送反馈资源包。` : "本次没有网页录音附件。",
    "Helen 当前反馈快照",
    `生成时间：${payload.generatedAt}`,
    `日期：${pack.date}`,
    `课程：${pack.title || ""}`,
    `packId：${pack.packId}`,
    "",
    planetLine("中文星球", payload.planets.chinese),
    planetLine("字母星球", payload.planets.english),
    planetLine("颜色星球", payload.planets.art),
    "",
    "```json",
    JSON.stringify(payload, null, 2),
    "```"
  ].join("\n");
}

function snapshotStatusLabel(status) {
  return {
    not_scheduled: "今天未安排",
    not_started: "未开始",
    in_progress: "进行中",
    paused: "已暂停",
    completed: "已完成",
    stopped_early: "提前结束",
    skipped: "已跳过"
  }[status] || status;
}

function collectSnapshotAttachments(planets) {
  return {
    audio: Object.values(planets).flatMap((planet) => (planet.recordings || []).map((clip) => clip.fileName)),
    images: planets.art.artworkPhotoExpected ? [planets.art.artworkFileName || "artwork-photo"] : [],
    video: []
  };
}

function getRecordingManifestForCourse(course) {
  const sessionId = getCourseProgress()?.[course]?.sessionId || "";
  return Object.values(state.recordingClips || {})
    .filter((clip) => clip.planetId === course && clip.includeInFeedback !== false && (!sessionId || clip.sessionId === sessionId))
    .map((clip) => ({
      clipId: clip.clipId,
      sessionId: clip.sessionId,
      planetId: clip.planetId,
      courseId: clip.courseId,
      lessonId: clip.lessonId,
      activityId: clip.activityId,
      takeNumber: clip.takeNumber,
      segmentIndex: clip.segmentIndex ?? clip.takeNumber ?? 0,
      startedAt: clip.startedAt,
      endedAt: clip.endedAt,
      duration: clip.duration || 0,
      mimeType: clip.mimeType,
      size: clip.size || 0,
      status: clip.status,
      chunkCount: clip.chunkCount || 0,
      interruptionReason: clip.interruptionReason || "",
      category: clip.category || "",
      fileName: `${safeFilePart(clip.clipId)}.${recordingExtension(clip.mimeType)}`
    }));
}

function summarizeCourseRecording(course) {
  const courseClips = getRecordingManifestForCourse(course)
    .filter((clip) => clip.category === "course_recording" || clip.activityId === `${course}:course_recording`);
  return {
    enabled: Boolean(getCourseProgress()?.[course]?.recordingConsent),
    active: activeRecording?.course === course && activeRecording?.activityKey === `${course}:course_recording`,
    clipCount: courseClips.length,
    totalSeconds: Math.round(courseClips.reduce((sum, clip) => sum + (clip.duration || 0), 0)),
    totalBytes: courseClips.reduce((sum, clip) => sum + (clip.size || 0), 0),
    clips: courseClips
  };
}

function summarizeRecordings(clips) {
  return {
    clipCount: clips.length,
    totalSeconds: clips.reduce((sum, clip) => sum + Number(clip.duration || 0), 0),
    interruptedCount: clips.filter((clip) => clip.status === "interrupted").length,
    completeCount: clips.filter((clip) => clip.status === "complete").length
  };
}

function recordingExtension(mimeType = "") {
  if (/mp4|m4a/.test(mimeType)) return "m4a";
  if (/ogg/.test(mimeType)) return "ogg";
  if (/wav/.test(mimeType)) return "wav";
  return "webm";
}

function safeFilePart(value) {
  return String(value || "file").replace(/[^a-z0-9_-]+/gi, "-").slice(0, 120);
}

function getCourseInteractions(single, course) {
  const data = single[course] || {};
  const items = data.sections || data.steps || [];
  return items.filter((item) => item.startedAt || item.completedAt || item.result || item.hintLevelUsed || item.viewedAnswer || item.attempts || item.readAloudUsed);
}

function getCourseAnswers(single, course) {
  if (course === "english") return [...(single.english?.choiceResults || []), ...(single.english?.blockResults || [])];
  if (course === "chinese") return (single.chinese?.sections || []).flatMap((item) => item.choiceResults || item.answers || []);
  if (course === "art") return (single.art?.steps || []).filter((item) => item.result || item.readAloudUsed).map((item) => ({ activityId: item.stepId, result: item.result, hintLevelUsed: item.hintLevelUsed }));
  return [];
}

function isPlanetScheduled(pack, course) {
  if (!pack) return false;
  if (course === "chinese") return Boolean(pack.chinese?.lesson || pack.chinese?.characters?.length || pack.chinese?.words?.length);
  if (course === "english") return Boolean(pack.english?.lesson || pack.english?.words?.length || pack.english?.anchorSentence);
  if (course === "art") return Boolean(pack.art);
  return false;
}

function roundMinutes(ms) {
  return Math.round((ms || 0) / 60000);
}

function storeLatestFeedbackSnapshot(feedback) {
  if (!feedback?.payload) return;
  state.feedbackSnapshotSequence = feedback.payload.sequence;
  state.latestFeedbackSnapshot = feedback.payload;
  state.feedbackSnapshots ||= [];
  state.feedbackSnapshots.push({ snapshotId: feedback.payload.snapshotId, generatedAt: feedback.payload.generatedAt, payload: feedback.payload });
  state.feedbackSnapshots = state.feedbackSnapshots.slice(-8);
  saveState();
}

function renderFeedbackSnapshotPreview(feedback) {
  const panel = $("#reportPanel");
  if (!panel || !feedback?.payload) return;
  const planets = feedback.payload.planets;
  const line = (label, planet) => `${label}：${snapshotStatusLabel(planet.status)}${["in_progress", "paused"].includes(planet.status) ? ` ${Math.round(planet.completionRatio * 100)}%` : ""}`;
  const audioCount = feedback.payload.attachmentsExpected?.audio?.length || 0;
  panel.innerHTML = `
    <div class="report-block feedback-snapshot-preview">
      <strong>当前反馈已生成</strong>
      <p>请优先使用最新生成时间的反馈：${escapeHtml(feedback.payload.generatedAt)}</p>
      <p>${escapeHtml(line("语文", planets.chinese))}</p>
      <p>${escapeHtml(line("英语", planets.english))}</p>
      <p>${escapeHtml(line("美术", planets.art))}</p>
      <p>${audioCount ? `另有 ${audioCount} 段录音，请下载完整反馈一起发送。` : "当前没有网页录音附件。"}</p>
    </div>
  `;
  $("#copyFeedbackBtn").hidden = false;
  $("#downloadFeedbackBtn").hidden = false;
}

function renderCurrentFeedbackSnapshot() {
  const feedback = buildFeedbackPackage();
  if (!feedback) {
    $("#reportPanel").textContent = "今日课程暂未准备好。";
    return null;
  }
  storeLatestFeedbackSnapshot(feedback);
  renderFeedbackSnapshotPreview(feedback);
  renderLexicalCheck();
  return feedback;
}

function buildSingleCourseFeedback(pack, progress, course, options = {}) {
  const side = progress[course] || {};
  const activityMap = side.sections || side.steps || {};
  const pending = countPendingActivities(course, pack, progress);
  const scheduled = options.scheduled ?? isPlanetScheduled(pack, course);
  const startedAt = [side.startedAt, ...Object.values(activityMap).map((item) => item.startedAt)].filter(Boolean).sort()[0] || "";
  const completedAt = side.finishedAt || "";
  const courseElapsed = getCourseElapsed(side, activityMap);
  const feedbackId = `${pack.packId}-${course}-${Date.now().toString(36)}`;
  const base = {
    schemaVersion: "helen-learning-feedback/1",
    feedbackId,
    packId: pack.packId,
    course,
    courseId: getCourseId(pack, course),
    lessonId: getLessonId(pack, course),
    date: pack.date,
    startedAt,
    completedAt,
    sessionStatus: scheduled ? inferSessionStatus(side, pending) : "not_scheduled",
    completionRatio: pending.total ? (pending.completed / pending.total) : 0,
    completedActivityIds: pending.completedIds,
    lastCompletedActivityId: pending.lastCompletedActivityId,
    pendingActivityIds: pending.pending,
    stoppedReason: side.stoppedReason || "",
    resumeToken: side.sessionId || `${pack.packId}:${course}`,
    audioFeedbackExpected: Boolean(side.audioFeedbackExpected),
    audioFileNames: side.audioFeedbackExpected && side.audioFileName ? [side.audioFileName] : [],
    shared: {
      totalElapsedSeconds: Math.round(courseElapsed / 1000),
      breakSeconds: 0,
      childEase: side.childEase ?? null,
      parentEase: side.parentEase ?? null,
      hardestActivityId: side.hardest || "",
      hardestSections: side.hardestSections || (side.hardest ? [side.hardest] : [])
    },
    generatedAt: new Date().toISOString()
  };
  if (course === "chinese") {
    base.chinese = {
      elapsedSeconds: Math.round(getCourseElapsed(progress.chinese, progress.chinese.sections) / 1000),
      sections: summarizeCourseItems(progress.chinese.sections, "section"),
      choiceResults: collectNestedResults(progress.chinese.sections, "choiceResults"),
      oralAssessmentResults: collectOralAssessmentResults(progress.chinese.sections)
    };
  } else if (course === "english") {
    base.english = {
      mode: getSelectedEnglishMode(pack),
      modeUsed: getSelectedEnglishMode(pack),
      elapsedSeconds: Math.round(getCourseElapsed(progress.english, progress.english.steps) / 1000),
      steps: summarizeCourseItems(progress.english.steps, "step"),
      choiceResults: collectNestedResults(progress.english.steps, "choiceResults"),
      blockResults: collectBlockResults(progress.english.steps),
      phonicsResults: collectStepResults(progress.english.steps, "phonics"),
      exitCheckResults: collectStepResults(progress.english.steps, "dialogue_exit"),
      anchorSentence: pack.english?.lesson?.anchorSentence || pack.english?.anchorSentence || ""
    };
  } else if (course === "art") {
    base.art = {
      elapsedSeconds: Math.round(getCourseElapsed(progress.art, progress.art.steps) / 1000),
      steps: summarizeCourseItems(progress.art.steps, "step"),
      audioFallbackUsed: Object.values(progress.art.steps || {}).some((item) => item.audioFallbackUsed),
      artworkPhotoExpected: Boolean(progress.art.artworkPhotoExpected),
      artworkFileName: progress.art.artworkFileName || "",
      favoritePart: progress.art.favoritePart || "",
      difficultPart: progress.art.hardest || ""
    };
  }
  const human = [
    `Helen ${courseLabel(course)}反馈包`,
    `日期：${pack.date}`,
    `课程：${pack.title || ""}`,
    `packId：${pack.packId}`,
    `完成度：${pending.completed}/${pending.total}`,
    `状态：${base.sessionStatus}`,
    `最困难环节：${base.shared.hardestSections?.length ? base.shared.hardestSections.join("、") : "未填"}`,
    `另附录音/照片：${base.audioFeedbackExpected || base.art?.artworkPhotoExpected ? "是" : "否"}`,
    `请把下面两样东西发给总课程设计师：`,
    `1. 网站反馈包；`,
    `2. 本次学习录音（如果已录制）。`,
    "",
    "```json",
    JSON.stringify(base, null, 2),
    "```"
  ].join("\n");
  return { human, payload: base };
}

function summarizeCourseItems(map, idName) {
  return Object.entries(map || {}).map(([key, item]) => ({
    [`${idName}Id`]: key,
    elapsedSeconds: Math.round((item.elapsedMs || 0) / 1000),
    completion: item.finishedAt ? "completed" : item.startedAt ? "started" : "not_started",
    result: item.result === "not_yet" ? "notYet" : item.result || "",
    parentResult: item.result === "not_yet" ? "notYet" : item.result || "",
    hintLevelUsed: item.hintLevelUsed || 0,
    attempts: item.attempts || (item.blockSubmissions || 0) || (item.choiceResults?.length || 0) || 0,
    answers: item.choiceResults || [],
    viewedAnswer: Boolean(item.viewedAnswer),
    readAloudUsed: Boolean(item.readAloudUsed),
    readAloudCount: item.readAloudCount || 0,
    voiceSource: item.voiceSource || "",
    readAloudSlowUsed: Boolean(item.readAloudSlowUsed),
    readAloudFailed: Boolean(item.readAloudFailed),
    assessmentInvalidated: Boolean(item.assessmentInvalidated),
    recordingClipIds: item.recordingClipIds || [],
    recordingStatusText: item.recordingStatusText || "",
    recordingUnavailable: Boolean(item.recordingUnavailable),
    parentNote: item.parentNote || "",
    startedAt: item.startedAt || "",
    completedAt: item.finishedAt || ""
  }));
}

function collectNestedResults(map, field) {
  return Object.entries(map || {}).flatMap(([activityId, item]) => (item[field] || []).map((entry) => ({ activityId, ...entry })));
}

function collectOralAssessmentResults(map) {
  return Object.entries(map || {}).flatMap(([activityId, item]) => Object.values(item.oralAssessmentResults || {}).map((entry) => ({ activityId, ...entry })));
}

function collectBlockResults(map) {
  return Object.entries(map || {}).filter(([, item]) => item.blockAnswer || item.blockFeedback).map(([activityId, item]) => ({
    activityId,
    submittedAnswer: item.blockAnswer || "",
    correct: item.blockFeedback?.includes("拼对了") || false,
    attempts: item.blockSubmissions || 0,
    feedback: item.blockFeedback || ""
  }));
}

function collectStepResults(map, stepId) {
  return Object.entries(map || {}).filter(([key]) => key.includes(stepId)).map(([activityId, item]) => ({
    activityId,
    result: item.result || "",
    elapsedSeconds: Math.round((item.elapsedMs || 0) / 1000),
    hintLevelUsed: item.hintLevelUsed || 0
  }));
}

function countPendingActivities(course, pack = getLatestLearningPack(), progress = getCourseProgress()) {
  const expected = getExpectedActivityIds(pack, course);
  const side = progress?.[course] || {};
  const map = side.sections || side.steps || {};
  const completedIds = expected.filter((id) => map[`${course}:${id}`]?.finishedAt || map[id]?.finishedAt);
  const pending = expected.filter((id) => !completedIds.includes(id));
  return {
    total: expected.length,
    completed: completedIds.length,
    completedIds,
    pending,
    lastCompletedActivityId: completedIds.at(-1) || ""
  };
}

function getExpectedActivityIds(pack, course) {
  if (!pack) return [];
  if (course === "chinese") return getChineseLessonSections(pack).map((item) => item.id);
  if (course === "english") return getEnglishLessonSteps(pack).map((item) => item.id);
  if (course === "art") return getArtLessonSteps(pack).map((item) => item.id);
  return [];
}

function inferSessionStatus(side, pending) {
  const map = side.sections || side.steps || {};
  const hasActivity = Object.values(map).some((item) => item.startedAt || item.finishedAt || item.result);
  if (side.sessionStatus && !(side.sessionStatus === "not_started" && hasActivity)) return side.sessionStatus;
  if (side.finishedAt && pending.pending.length === 0) return "completed";
  if (side.finishedAt) return "stopped_early";
  if (side.pausedAt) return "paused";
  if (hasActivity) return "in_progress";
  return "not_started";
}

function getCourseId(pack, course) {
  if (course === "chinese") return pack.chinese?.courseId || "reading-bridge";
  if (course === "english") return pack.english?.courseId || pack.english?.storyId || "daily-english";
  if (course === "art") return pack.art?.courseId || "marker-drawing-foundations";
  return "daily";
}

function getLessonId(pack, course) {
  if (course === "chinese") return pack.chinese?.lesson?.lessonId || pack.chinese?.lesson?.title || pack.packId;
  if (course === "english") return pack.english?.lesson?.lessonId || pack.english?.lesson?.anchorSentence || pack.packId;
  if (course === "art") return pack.art?.lessonId || pack.packId;
  return pack.packId;
}

function courseLabel(course) {
  return { chinese: "中文", english: "字母", art: "颜色", combined: "综合", snapshot: "当前" }[course] || course;
}

function getLatestFeedbackForOutput() {
  if (state.latestFeedbackSnapshot) {
    const pack = getLatestLearningPack();
    return { payload: state.latestFeedbackSnapshot, human: formatSnapshotHuman(state.latestFeedbackSnapshot, pack || { date: "", title: "", packId: "" }) };
  }
  return renderCurrentFeedbackSnapshot();
}

async function copyFeedbackPackage() {
  const feedback = getLatestFeedbackForOutput();
  if (!feedback?.payload) {
    $("#reportPanel").textContent = "今日课程暂未准备好。";
    return;
  }
  try {
    await navigator.clipboard.writeText(feedback.human);
    $("#reportPanel").textContent = "当前反馈已复制，可以发给总课程设计师。";
  } catch {
    $("#reportPanel").textContent = feedback.human;
  }
}

async function downloadFeedbackPackage() {
  const feedback = getLatestFeedbackForOutput();
  if (!feedback?.payload) {
    $("#reportPanel").textContent = "今日课程暂未准备好。";
    return;
  }
  const files = [{ name: "feedback.json", blob: new Blob([JSON.stringify(feedback.payload, null, 2)], { type: "application/json" }) }];
  for (const clip of Object.values(state.recordingClips || {}).filter((item) => item.includeInFeedback !== false)) {
    try {
      const chunks = await getRecordingChunks(clip.clipId);
      if (!chunks.length) continue;
      files.push({ name: `audio/${safeFilePart(clip.clipId)}.${recordingExtension(clip.mimeType)}`, blob: new Blob(chunks.map((item) => item.blob), { type: clip.mimeType || "audio/webm" }) });
    } catch {
      // Keep feedback export usable even when an audio blob cannot be recovered.
    }
  }
  const fileName = `${feedback.payload.localDate || "today"}-complete-feedback-${feedback.payload.sequence || 1}.hfeedback.zip`;
  const blob = await createStoredZip(files);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  $("#reportPanel").textContent = `完整反馈已下载：feedback.json${files.length > 1 ? ` + ${files.length - 1} 段录音` : ""}。`;
}

async function createStoredZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const file of files) {
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const nameBytes = encoder.encode(file.name.replace(/^\/+/, "").replace(/\.\./g, "_"));
    const crc = crc32(data);
    const local = zipLocalHeader(nameBytes, crc, data.length);
    localParts.push(local, data);
    centralParts.push(zipCentralHeader(nameBytes, crc, data.length, offset));
    offset += local.byteLength + data.byteLength;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
  const end = zipEndRecord(files.length, centralSize, offset);
  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

function zipLocalHeader(nameBytes, crc, size) {
  const header = new Uint8Array(30 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(8, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, nameBytes.length, true);
  header.set(nameBytes, 30);
  return header;
}

function zipCentralHeader(nameBytes, crc, size, offset) {
  const header = new Uint8Array(46 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, offset, true);
  header.set(nameBytes, 46);
  return header;
}

function zipEndRecord(fileCount, centralSize, centralOffset) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  return header;
}

function crc32(bytes) {
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

async function renderLearningPackApiStatus() {
  const panel = $("#learningPackApiStatus");
  if (!panel) return;
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const data = await response.json();
    const enabled = Boolean(data.learningPackApi?.writeEnabled);
    panel.innerHTML = `
      <p>学习包主通道：手动粘贴或选择文件。</p>
      <p>未来自动接口：${enabled ? "已启用访问码保护" : "未启用写入，线上不会开放自动推送"}。</p>
      <p class="muted">本地文件保存存在部署平台临时文件系统风险，正式同步前仍以手动导入为准。</p>
    `;
  } catch {
    panel.textContent = "无法读取接口状态，手动导入仍可使用。";
  }
}

function stableShuffle(items, seed) {
  const array = [...items];
  return array.map((item, index) => ({ item, score: checksumString(`${seed}:${item}:${index}`) }))
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.item);
}

function countReviewTargets(pack) {
  return [
    ...(pack.chinese?.characters || []),
    ...(pack.chinese?.words || []),
    ...(pack.english?.words || [])
  ].filter((item) => item.status === "review").length + (pack.chinese?.confusedPairs?.length || 0);
}

function normalizePackStatus(status) {
  const value = String(status || "review").trim().toLowerCase();
  return ["new", "review", "unstable", "unknown", "confused", "consolidating", "mastered"].includes(value) ? value : "review";
}

function loadModeLabel(mode) {
  return { standard: "标准 / Standard", light: "轻量 / Light", recovery: "恢复复习 / Recovery" }[mode] || mode;
}

function safePlainText(value, maxLength = 120) {
  return String(value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function safeId(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "daily_pack";
}

function safeOptionalId(value) {
  const id = String(value || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80);
  return id || "";
}

function sanitizeAssetFileName(value) {
  const fileName = String(value || "").trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}\.(png|jpe?g|webp)$/i.test(fileName)) return "";
  return fileName;
}

function sanitizeAssetBasePath(value) {
  const path = String(value || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!path || path.includes("..") || /^https?:/i.test(path) || /[<>"'\\]/.test(path)) return "assets/art/color-planet-lesson-01";
  return path.split("/").map((part) => safeFilePart(part)).filter(Boolean).join("/") || "assets/art/color-planet-lesson-01";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = item?.[key];
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function checksumString(text) {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) + hash) ^ text.charCodeAt(index);
  return `c${(hash >>> 0).toString(16)}`;
}

// Legacy only: retained for old manual debugging, but the v3.0.0 homepage no
// longer calls /api/read-share or extracts targets from ChatGPT share pages.
async function readShareLink(link) {
  const path = `/api/read-share?url=${encodeURIComponent(link)}`;
  const endpoints = getApiEndpoints(path);
  for (const endpoint of endpoints) {
    try {
      const response = await fetchWithTimeout(endpoint, {}, 45000);
      if (!response.ok) continue;
      const data = await response.json();
      if (data.text && data.text.length > 120) return data.text;
    } catch {
      // Try the next API endpoint.
    }
  }

  throw new Error("local-api-unavailable");
}

function syncFeedbackDiscoveredWords(sourceText) {
  const extracted = extractFeedbackDiscoveredItems(sourceText);
  const now = new Date().toISOString();
  state.learnerChars ||= {};
  state.wordbook ||= {};
  state.feedbackDiscoveredItems ||= {};
  let added = 0;
  let updated = 0;

  extracted.items.forEach((item) => {
    const key = item.type === "word" ? `word:${item.text}` : item.text;
    const existingRecord = state.feedbackDiscoveredItems[key] || null;
    if (existingRecord) updated += 1;
    else added += 1;
    const sources = mergeFeedbackSources(existingRecord?.sources || [], item.source);
    const nextRecord = {
      ...(existingRecord || {}),
      id: key,
      text: item.text,
      char: item.type === "char" ? item.text : "",
      type: item.type,
      contextWord: item.contextWord || existingRecord?.contextWord || "",
      sources,
      count: sources.length,
      latestStatus: item.status,
      confusedWith: item.confusedWith || existingRecord?.confusedWith || "",
      firstFoundAt: existingRecord?.firstFoundAt || now,
      latestFoundAt: now,
      inWordbook: true,
      inCharacterPractice: item.type === "char"
    };
    state.feedbackDiscoveredItems[key] = nextRecord;

    if (item.type === "char") {
      const existingChar = state.learnerChars[item.text] || {};
      state.learnerChars[item.text] = {
        ...existingChar,
        char: item.text,
        source: item.source.day || existingChar.source || "家长反馈",
        sourceText: item.contextWord || item.source.context || existingChar.sourceText || "",
        selectionReason: "通过卡顿发现的生字",
        status: mapFeedbackStatusToLearnerStatus(item.status),
        latestStatus: item.status,
        feedbackSources: sources,
        contextWords: unique([item.contextWord, ...(existingChar.contextWords || [])]).filter(Boolean),
        firstFoundAt: existingChar.firstFoundAt || now,
        latestFoundAt: now,
        foundCount: sources.length,
        inWordbook: true,
        inCharacterPractice: true,
        confusedWith: item.confusedWith || existingChar.confusedWith || ""
      };
    }

    const wordbookKey = item.type === "word" ? key : item.text;
    const existingWordbook = state.wordbook[wordbookKey] || {};
    state.wordbook[wordbookKey] = {
      ...existingWordbook,
      addedAt: existingWordbook.addedAt || now,
      mastered: false,
      autoAdded: true,
      type: item.type,
      text: item.text,
      char: item.type === "char" ? item.text : "",
      sources,
      count: sources.length,
      latestStatus: item.status,
      latestFoundAt: now,
      contextWord: item.contextWord || existingWordbook.contextWord || "",
      confusedWith: item.confusedWith || existingWordbook.confusedWith || ""
    };
  });

  state.lastFeedbackExtraction = {
    at: now,
    total: extracted.items.length,
    added,
    updated,
    sourceDays: extracted.days,
    addedItems: extracted.items.map((item) => item.text)
  };
  return state.lastFeedbackExtraction;
}

function mergeFeedbackSources(existingSources, nextSource) {
  const sources = Array.isArray(existingSources) ? [...existingSources] : [];
  const key = `${nextSource.day || ""}__${nextSource.context || ""}__${nextSource.status || ""}`;
  const exists = sources.some((source) => `${source.day || ""}__${source.context || ""}__${source.status || ""}` === key);
  if (!exists) sources.push(nextSource);
  return sources;
}

function extractFeedbackDiscoveredItems(sourceText) {
  const days = getRecentCompleteFeedbackDays(sourceText, 5);
  const itemMap = new Map();
  days.forEach((day) => {
    day.blocks.forEach((block) => {
      block.lines.forEach((line) => {
        parseFeedbackDiscoveryLine(line).forEach((item) => {
          const source = {
            day: day.day,
            context: line,
            status: item.status,
            contextWord: item.contextWord || "",
            confusedWith: item.confusedWith || "",
            field: "通过卡顿发现的生字"
          };
          const key = `${item.type}:${item.text}`;
          const existing = itemMap.get(key);
          itemMap.set(key, { ...item, source, sources: existing ? [...existing.sources, source] : [source] });
        });
      });
    });
  });
  return { days: days.map((day) => day.day), items: [...itemMap.values()] };
}

function getRecentCompleteFeedbackDays(sourceText, limit = 5) {
  const lines = normalizeShareLines(sourceText);
  const entries = [];
  let current = null;
  lines.forEach((line, index) => {
    const day = detectDayLabel(line);
    if (day) {
      current = { day, startIndex: index, lines: [], hasLesson: false, hasFeedback: false };
      entries.push(current);
    }
    if (!current) {
      current = { day: "未知日期", startIndex: 0, lines: [], hasLesson: false, hasFeedback: false };
      entries.push(current);
    }
    current.lines.push(line);
    if (/学习内容|桥梁阅读|融合课|阅读正文|今日课程|Day\s*\d+/i.test(line)) current.hasLesson = true;
    if (/反馈表|今日反馈|家长反馈|通过卡顿发现的生字/.test(line)) current.hasFeedback = true;
  });

  return entries
    .map((entry) => ({ ...entry, blocks: extractStumbleBlocksFromLines(entry.lines) }))
    .filter((entry) => entry.hasLesson && entry.hasFeedback && entry.blocks.length)
    .slice(-limit);
}

function normalizeShareLines(sourceText) {
  return String(sourceText || "").replace(/\r/g, "\n").split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function detectDayLabel(line) {
  const match = line.match(/\bDay\s*(\d+)\b/i) || line.match(/第\s*(\d+)\s*天/);
  return match ? `Day${match[1]}` : "";
}

function extractStumbleBlocksFromLines(lines) {
  const blocks = [];
  lines.forEach((line, index) => {
    if (!/^#{0,6}\s*通过卡顿发现的生字\s*[:：]?\s*/.test(line)) return;
    const first = line.replace(/^#{0,6}\s*通过卡顿发现的生字\s*[:：]?\s*/, "").trim();
    const blockLines = [];
    if (first) blockLines.push(first);
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const next = lines[cursor].trim();
      if (!next) continue;
      if (isTopLevelFeedbackHeading(next)) break;
      blockLines.push(next);
    }
    if (blockLines.length) blocks.push({ startLine: index, lines: blockLines });
  });
  return blocks;
}

function isTopLevelFeedbackHeading(line) {
  const text = line.replace(/^#{1,6}\s*/, "").trim();
  if (!/[:：]$/.test(text)) return false;
  if (/^通过卡顿发现的生字[:：]$/.test(text)) return false;
  return /^(家长陪读反馈|孩子体感轻松程度|家长体感轻松程度|第[一二三四五六七八九十\d]+部分|词语积累|阅读理解|课堂总结|小学情境迁移|阅读后的生字预测|生字预测|学生反馈|家长整体反馈|助手反馈|参考答案|今日反馈|反馈表)[:：]$/.test(text);
}

function parseFeedbackDiscoveryLine(line) {
  const text = cleanFeedbackLine(line);
  if (!text || !/[\u4e00-\u9fff]/.test(text)) return [];
  const status = inferFeedbackStatus(text);
  const confusedWith = inferConfusedWith(text);
  const items = [];
  const confusedTarget = text.match(/(?:将|把)?([\u4e00-\u9fff])(?:认读成了?|认成|念成|读成)([\u4e00-\u9fff])/);
  if (confusedTarget) {
    items.push({ type: "char", text: confusedTarget[1], contextWord: "", status: "混淆", confusedWith: confusedTarget[2] });
    return dedupeFeedbackItems(items);
  }
  const explicit = text.match(/([\u4e00-\u9fff]{2,8})的([\u4e00-\u9fff])/);
  if (explicit) {
    items.push({ type: "char", text: explicit[2], contextWord: explicit[1], status, confusedWith });
    return dedupeFeedbackItems(items);
  }
  const phrase = text.match(/^([\u4e00-\u9fff]{1,8})(?:不认识|不会读|不熟悉|猜读|猜出来|可以猜读|卡顿|有点卡|认成|念成|读成|又认成|又将|不稳|没读出|读不出)/);
  if (phrase) {
    addWordAndChars(items, phrase[1], status, confusedWith);
    return dedupeFeedbackItems(items);
  }
  const chars = [...text].filter((char) => /[\u4e00-\u9fff]/.test(char));
  if (chars.length === 1) items.push({ type: "char", text: chars[0], contextWord: "", status, confusedWith });
  return dedupeFeedbackItems(items);
}

function cleanFeedbackLine(line) {
  return String(line || "").replace(/^[-*•\d.、\s]+/, "").replace(/[✅❌]/g, "").trim();
}

function addWordAndChars(items, word, status, confusedWith) {
  const cleanWord = cleanCandidate(word);
  if (!cleanWord) return;
  if (cleanWord.length > 1) items.push({ type: "word", text: cleanWord, contextWord: cleanWord, status, confusedWith });
  [...cleanWord].filter((char) => /[\u4e00-\u9fff]/.test(char)).forEach((char) => {
    items.push({ type: "char", text: char, contextWord: cleanWord, status, confusedWith });
  });
}

function dedupeFeedbackItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.type}:${item.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferFeedbackStatus(text) {
  if (/认成|念成|读成|混淆/.test(text)) return "混淆";
  if (/不认识|不会读|没读出|读不出/.test(text)) return "不认识";
  if (/不熟悉|不稳/.test(text)) return "不熟悉";
  if (/猜读|猜出来|可以猜读/.test(text)) return "猜读";
  if (/卡顿|有点卡/.test(text)) return "卡顿";
  if (/可以认读|能认读/.test(text)) return "可认读";
  return "卡顿";
}

function inferConfusedWith(text) {
  const match = text.match(/(?:认成|念成|读成|认读成了?|读成了?)([\u4e00-\u9fff])/);
  return match ? match[1] : "";
}

function mapFeedbackStatusToLearnerStatus(status) {
  if (status === "混淆") return "confused";
  if (status === "不认识") return "unknown";
  if (status === "猜读" || status === "卡顿" || status === "不熟悉") return "unstable";
  if (status === "可认读") return "consolidating";
  return "unstable";
}

function getApiEndpoints(path) {
  const endpoints = [];
  if (location.protocol === "http:" || location.protocol === "https:") {
    endpoints.push(path);
    endpoints.push(`${location.origin}${path}`);
  }
  LOCAL_API_ORIGINS.forEach((origin) => endpoints.push(`${origin}${path}`));
  return [...new Set(endpoints)];
}

async function generatePractice(sourceText, source) {
  generationInFlight = true;
  if ($("#parsePackBtn")) $("#parsePackBtn").disabled = true;
  $("#regenerateBtn").disabled = true;
  if ($("#packStatus")) $("#packStatus").textContent = "AI正在出题…… / AI Generating";
  const { plan: aiPlan, error } = await generateWithAI(sourceText);
  generationInFlight = false;
  if ($("#parsePackBtn")) $("#parsePackBtn").disabled = false;
  const normalizedPlan = mergeFeedbackFocusIntoPlan(normalizePracticePlan(aiPlan));
  if (!normalizedPlan.focus || !normalizedPlan.questions?.length || !isAuthenticAiMeta(normalizedPlan.meta)) {
    if ($("#packStatus")) $("#packStatus").textContent = error || "AI出题失败，请稍后重试 / AI generation failed";
    $("#approveBtn").disabled = true;
    $("#regenerateBtn").disabled = true;
    return;
  }
  const extracted = normalizedPlan.focus;
  generatedQuestions = normalizeAIQuestions(normalizedPlan.questions, extracted);
  mergeLearnerCharacterData(normalizedPlan);
  state.latestLearning = extracted;
  state.focusTitleOverride = extracted.theme;

  const record = {
    date: new Date().toISOString(),
    source,
    sourceText,
    extracted,
    questions: generatedQuestions,
    sourceDays: normalizedPlan.sourceDays || [],
    learnerSummary: normalizedPlan.learnerSummary || {},
    meta: normalizedPlan.meta || null,
    approved: false,
    results: []
  };
  state.dailyRecords.push(record);
  saveState();

  renderFocus(extracted);
  renderReview(generatedQuestions);
  $("#approveBtn").disabled = false;
  state.answerPanelsHidden = false;
  applyAnswerPanelVisibility();
  renderCharacters();
  renderDictionary();
  $("#regenerateBtn").disabled = false;
  console.info("[AI_META]", normalizedPlan.meta || {});
  if ($("#packStatus")) $("#packStatus").textContent = "AI题目已生成 / AI practice ready";
}

function mergeFeedbackFocusIntoPlan(plan) {
  if (!plan?.focus) return plan;
  const recentDays = new Set(state.lastFeedbackExtraction?.sourceDays || []);
  const feedbackItems = Object.values(state.feedbackDiscoveredItems || {}).filter((item) => {
    if (!recentDays.size) return true;
    return (item.sources || []).some((source) => recentDays.has(source.day));
  });
  const chars = feedbackItems.filter((item) => item.type === "char" && isSingleChineseChar(item.text)).map((item) => item.text);
  const words = feedbackItems.filter((item) => item.type === "word").map((item) => item.text);
  if (!chars.length && !words.length) return plan;
  return {
    ...plan,
    focus: {
      ...plan.focus,
      chars: unique([...chars, ...(plan.focus.chars || [])]).slice(0, 30),
      weakChars: unique([...chars, ...(plan.focus.weakChars || [])]).slice(0, 18),
      words: unique([...words, ...(plan.focus.words || [])]).filter(isGoodWord).slice(0, 20)
    }
  };
}

async function generateWithAI(sourceText) {
  const body = JSON.stringify({
    apiKey: state.settings.apiKey || "",
    model: "deepseek-v4-pro",
    reasoning: "high",
    sourceText,
    practiceData: buildPracticeDataForModel()
  });
  let lastError = "";
  const endpoints = getAIEndpoints("/api/generate-practice");
  for (const endpoint of endpoints) {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      }, AI_TIMEOUTS.dailyPractice);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        lastError = data || { error: `AI 服务返回 ${response.status}`, status: response.status };
        break;
      }
      if (data?.ok) return { plan: data.plan, error: "" };
      lastError = data || { error: "AI 服务没有返回题目" };
      break;
    } catch (error) {
      lastError = error?.message || "AI 服务连接失败";
    }
  }
  return { plan: null, error: formatAIError(lastError) };
}

function buildPracticeDataForModel() {
  const recentRecords = state.dailyRecords.slice(-7).map((record) => ({
    date: record.date,
    theme: record.extracted?.theme,
    focusChars: record.extracted?.chars || [],
    focusWords: record.extracted?.words || [],
    results: record.results || [],
    sourceDays: record.sourceDays || []
  }));
  return {
    recentRecords,
    attempts: state.attempts || {},
    mastery: state.mastery || {},
    learnerChars: state.learnerChars || {},
    wordbook: state.wordbook || {},
    feedbackDiscoveredItems: state.feedbackDiscoveredItems || {},
    lastFeedbackExtraction: state.lastFeedbackExtraction || null
  };
}

function normalizePracticePlan(plan) {
  if (!plan) return { focus: null, questions: [] };
  if (plan.focus && Array.isArray(plan.questions)) return plan;

  const sections = Array.isArray(plan.sections) ? plan.sections : [];
  const characterItems = sectionItems(sections, "character_reading");
  const charDetailByChar = Object.fromEntries(characterItems.filter((item) => item.character).map((item) => [item.character, item]));
  const pinyinItems = sectionItems(sections, "pinyin_choice");
  const contextItems = sectionItems(sections, "context_choice");
  const sentenceItems = sectionItems(sections, "sentence_making");
  const learnerSummary = plan.learnerSummary || {};
  const chars = unique([
    ...characterItems.map((item) => item.character),
    ...pinyinItems.map((item) => item.targetCharacter || item.answer),
    ...contextItems.map((item) => item.answer),
    ...(learnerSummary.confirmedUnknown || []),
    ...(learnerSummary.unstable || []),
    ...(learnerSummary.consolidating || []),
    ...(learnerSummary.confusedPairs || []).flat()
  ]).filter(isSingleChineseChar).slice(0, 24);
  const words = unique([
    ...characterItems.map((item) => item.commonWord),
    ...sentenceItems.map((item) => item.word)
  ]).filter(isGoodWord).slice(0, 16);
  const sentences = unique([
    ...characterItems.map((item) => item.example),
    ...contextItems.map((item) => item.sentence),
    ...sentenceItems.map((item) => item.referenceSentence)
  ]).filter(isGoodSentence).slice(0, 8);
  const weakChars = unique([
    ...(learnerSummary.confirmedUnknown || []),
    ...(learnerSummary.unstable || []),
    ...(learnerSummary.confusedPairs || []).flat()
  ]).filter(isSingleChineseChar).slice(0, 12);

  return {
    meta: plan.meta || null,
    sourceDays: plan.sourceDays || [],
    learnerSummary,
    charDetails: characterItems,
    focus: {
      theme: inferPlanTheme(plan),
      chars,
      words,
      sentences,
      weakChars,
      charDetails: characterItems,
      learnerSummary
    },
    questions: [
      ...characterItems.map((item) => ({
        type: "认读",
        prompt: "读出这个字",
        display: item.character,
        answer: item.commonWord || "",
        char: item.character,
        pinyin: item.pinyin || "",
        reference: item.example || "",
        status: item.status,
        source: item.source,
        selectionReason: item.selectionReason,
        commonWord: item.commonWord,
        example: item.example,
        meaning: item.meaning || "",
        wordGroups: item.wordGroups || []
      })),
      ...pinyinItems.map((item) => ({
        ...pickDailyLexicalFields(charDetailByChar[item.targetCharacter || item.answer]),
        type: "拼音",
        prompt: "看拼音，选汉字",
        display: item.pinyin,
        answer: item.answer,
        char: item.targetCharacter || item.answer,
        pinyin: item.pinyin,
        choices: item.options || [],
        reference: item.answer
      })),
      ...contextItems.map((item) => ({
        ...pickDailyLexicalFields(charDetailByChar[item.answer]),
        type: "语境辨字",
        prompt: "读句子，选合适的字",
        display: item.sentence,
        answer: item.answer,
        char: item.answer,
        choices: item.options || [],
        reference: item.sentence
      })),
      ...sentenceItems.map((item) => ({
        ...pickDailyLexicalFields(charDetailByChar[[...(item.word || "")].find(isSingleChineseChar)]),
        type: "造句",
        prompt: "用词语说一句话",
        display: item.word,
        answer: item.referenceSentence || "",
        char: [...(item.word || "")].find(isSingleChineseChar) || "",
        reference: item.referenceSentence || ""
      }))
    ]
  };
}

function pickDailyLexicalFields(item = {}) {
  return {
    commonWord: item.commonWord || "",
    example: item.example || "",
    meaning: item.meaning || "",
    wordGroups: item.wordGroups || []
  };
}

function sectionItems(sections, type) {
  return sections.find((section) => section.type === type)?.items || [];
}

function inferPlanTheme(plan) {
  const day = plan.sourceDays?.find((item) => item.feedbackFound)?.day;
  return day || "今日识字复习";
}

function unique(items) {
  return [...new Set(items.filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
}

function isSingleChineseChar(value) {
  return /^[\u4e00-\u9fff]$/.test(value || "");
}

function mergeLearnerCharacterData(plan) {
  state.learnerChars ||= {};
  (plan.charDetails || []).forEach((item) => {
    if (!isSingleChineseChar(item.character)) return;
    const existing = state.learnerChars[item.character] || {};
    state.learnerChars[item.character] = {
      ...existing,
      char: item.character,
      pinyin: item.pinyin || existing.pinyin || "",
      words: unique([item.commonWord, ...(item.wordGroups || []), ...(existing.words || [])]).slice(0, 5),
      meaning: item.meaning || existing.meaning || "",
      sentence: item.example || existing.sentence || "",
      source: item.source || existing.source || "DeepSeek",
      selectionReason: item.selectionReason || existing.selectionReason || "",
      status: item.status || existing.status || "unstable",
      lastPracticeAt: new Date().toISOString()
    };
  });
  const summary = plan.learnerSummary || {};
  [
    ["unknown", summary.confirmedUnknown || []],
    ["unstable", summary.unstable || []],
    ["consolidating", summary.consolidating || []]
  ].forEach(([status, chars]) => {
    chars.filter(isSingleChineseChar).forEach((char) => {
      state.learnerChars[char] ||= { char };
      state.learnerChars[char].status = state.learnerChars[char].status || status;
    });
  });
  (summary.confusedPairs || []).flat().filter(isSingleChineseChar).forEach((char) => {
    state.learnerChars[char] ||= { char };
    state.learnerChars[char].status = "confused";
  });
}

function getAIEndpoints(path) {
  if (location.origin === LOCAL_API_ORIGINS[0] || location.origin === LOCAL_API_ORIGINS[1]) return [path];
  return LOCAL_API_ORIGINS.map((origin) => `${origin}${path}`);
}

function getStoredAppAccessCode() {
  try {
    return localStorage.getItem(APP_ACCESS_CODE_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function saveAppAccessCode(code) {
  try {
    if (code) localStorage.setItem(APP_ACCESS_CODE_STORAGE_KEY, code);
  } catch {
    // Ignore storage failures; the current request can still use the typed code.
  }
}

function withAppAccessHeaders(options = {}, code = getStoredAppAccessCode()) {
  const headers = { ...(options.headers || {}) };
  if (code) headers["X-App-Access-Code"] = code;
  return { ...options, headers };
}

function requestAppAccessCode() {
  const code = window.prompt("请输入学习网站访问码 / Access code");
  const clean = String(code || "").trim();
  if (clean) saveAppAccessCode(clean);
  return clean;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 90000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(url, { ...withAppAccessHeaders(options), signal: controller.signal });
    if (response.status === 401) {
      const code = requestAppAccessCode();
      if (code) {
        response = await fetch(url, { ...withAppAccessHeaders(options, code), signal: controller.signal });
      }
    }
    return response;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("AI request timeout");
      timeoutError.stage = "timeout";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function formatAIError(error) {
  if (!error) return "AI 服务连接失败 / AI service unavailable";
  const message = typeof error === "string" ? error : String(error.error || error.message || "");
  const stage = typeof error === "object" ? error.stage || "" : "";
  const requestId = typeof error === "object" && error.requestId ? ` 错误编号：${error.requestId}` : "";
  if (stage === "prompt_build") return `AI出题失败：系统提示词构建异常，请检查模板。${requestId}`;
  if (stage === "provider_call") return `AI出题失败：模型服务调用失败，请稍后重试。${requestId}`;
  if (stage === "json_parse") return `AI出题失败：AI返回格式异常，已拦截。请重新生成。${requestId}`;
  if (stage === "schema_validate") return `AI题目结构不完整，请重新生成。${requestId}`;
  if (stage === "rate_limit") return `DeepSeek 请求受限：额度不足或请求过于频繁，请稍后重试或检查 API 额度 / Rate limited${requestId}`;
  if (stage === "auth") return `出题服务未配置授权 / AI key missing${requestId}`;
  if (stage === "network") return `AI出题失败：网络连接异常，请稍后重试。${requestId}`;
  if (stage === "timeout" || message.includes("timeout")) return `AI出题超时，请重新生成。${requestId}`;
  if (message.includes("Server API key is not configured")) return `出题服务未配置授权 / AI key missing${requestId}`;
  if (message.includes("429") || message.includes("Too Many Requests") || message.includes("rate limit") || message.includes("quota")) {
    return `DeepSeek 请求受限：额度不足或请求过于频繁，请稍后重试或检查 API 额度 / Rate limited${requestId}`;
  }
  if (message.includes("UNEXPECTED_EOF_WHILE_READING") || message.includes("EOF occurred")) {
    return `DeepSeek 连接中断，请稍后再试 / DeepSeek connection interrupted${requestId}`;
  }
  if (message.includes("model") || message.includes("reasoning") || message.includes("unsupported")) return `出题模型配置失败：${message}${requestId}`;
  return `AI 出题失败：${message || "请重新生成"}${requestId}`;
}

function simpleHash(value) {
  const text = String(value || "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function normalizeAIQuestions(questions, focus) {
  const byChar = Object.fromEntries(getCharacterLibrary().map((item) => [item.char, item]));
  return questions.map((question) => {
    const char = question.char || [...(question.display || question.answer || "")].find((item) => /[\u4e00-\u9fff]/.test(item)) || focus.chars[0] || "日";
    const item = byChar[char] || makeFallbackChar(char);
    return {
      type: question.type || "认读",
      prompt: question.prompt || "读一读",
      display: question.display || char,
      answer: question.answer || "",
      char,
      pinyin: question.pinyin || item.pinyin || PINYIN_MAP[char] || "",
      choices: question.choices?.length ? question.choices : question.type === "拼音" ? makeChoices(char, focus.chars) : undefined,
      reference: question.reference || item.sentence || ""
    };
  });
}

function extractLearningFocus(text) {
  const knownChars = BASE_HANZI_DATA.map((item) => item.char);
  const priorityChars = extractPriorityChars(text);
  const words = extractPriorityWords(text);
  const sentences = extractReadingSentences(text);
  const weakChars = extractWeakChars(text, priorityChars);
  const foundKnownChars = [...new Set([...text].filter((char) => knownChars.includes(char)))];
  const wordChars = words.flatMap((word) => [...word].filter((char) => /[\u4e00-\u9fff]/.test(char)));
  const chars = [...new Set([...priorityChars, ...weakChars, ...wordChars, ...foundKnownChars])].slice(0, 18);
  const fallbackWords = [...new Set(chars.flatMap((char) => getCharacterByChar(char).words || []).filter(isGoodWord))].slice(0, 8);
  return {
    chars: chars.length ? chars : ["日", "月", "水", "火"],
    words: words.length ? words.slice(0, 10) : fallbackWords,
    sentences: sentences.length ? sentences : ["今天的日光很温暖"],
    weakChars: weakChars.length ? weakChars : chars.slice(-2),
    theme: inferTheme(text)
  };
}

function extractPriorityChars(text) {
  const chars = [];
  const add = (value) => {
    [...value].forEach((char) => {
      if (/[\u4e00-\u9fff]/.test(char) && !chars.includes(char)) chars.push(char);
    });
  };

  [...text.matchAll(/（([\u4e00-\u9fff])／([\u4e00-\u9fff])）/g)].forEach((match) => {
    add(match[1]);
    add(match[2]);
  });

  extractSections(text, ["生字", "认读", "易错字", "易混字", "不认识的字", "需要核对的字词"]).forEach((block) => {
    splitChineseItems(block).forEach((item) => {
      if (/^[\u4e00-\u9fff]{1,4}$/.test(item)) add(item);
    });
  });

  return chars.slice(0, 24);
}

function extractPriorityWords(text) {
  const words = [];
  const add = (value) => {
    const word = cleanCandidate(value);
    if (isGoodWord(word) && !words.includes(word)) words.push(word);
  };

  extractSections(text, ["今日词语", "词语积累", "昨日词语", "阅读后生词预测", "生词预测", "组词", "词语"]).forEach((block) => {
    splitChineseItems(block).forEach(add);
  });
  extractFeedbackBlocks(text).forEach((block) => splitChineseItems(block).forEach(add));

  BASE_HANZI_DATA.flatMap((item) => item.words).forEach((word) => {
    if (text.includes(word)) add(word);
  });

  return words.slice(0, 16);
}

function extractReadingSentences(text) {
  const sentences = [];
  const add = (value) => {
    const sentence = cleanSentence(value);
    if (isGoodSentence(sentence) && !sentences.includes(sentence)) sentences.push(sentence);
  };

  extractSections(text, ["短句", "句子", "阅读理解", "原文", "阅读内容"]).forEach((block) => {
    block.split(/[。！？!?\n]/).forEach(add);
  });
  text.split(/[。！？!?\n]/).forEach(add);
  return sentences.slice(0, 8);
}

function extractWeakChars(text, chars) {
  const weak = [];
  const add = (value) => {
    [...value].forEach((char) => {
      if (/[\u4e00-\u9fff]/.test(char) && !weak.includes(char)) weak.push(char);
    });
  };

  extractSections(text, ["通过卡顿发现的生字", "卡顿发现的生字", "易错", "易混", "卡住", "不熟", "复习", "回答错误", "读错"]).forEach((block) => {
    splitChineseItems(block).forEach(add);
  });
  extractFeedbackBlocks(text).forEach((block) => {
    if (/错|卡|不会|不熟|没读出|读不出/.test(block)) splitChineseItems(block).forEach(add);
  });
  chars.forEach((char) => {
    if (text.includes(`易错：${char}`) || text.includes(`易错:${char}`)) add(char);
  });
  return weak.slice(0, 8);
}

function extractFeedbackBlocks(text) {
  return extractSections(text, ["我的反馈", "家长反馈", "反馈", "正确", "错误", "卡顿"]);
}

function extractSections(text, headings) {
  const lines = text.split(/\n+/);
  const blocks = [];
  lines.forEach((line, index) => {
    if (headings.some((heading) => line.includes(heading))) {
      blocks.push(lines.slice(index, index + 8).join("\n"));
    }
  });
  return blocks;
}

function splitChineseItems(block) {
  return block
    .replace(/[，,；;、]/g, "\n")
    .split(/\n+/)
    .map((item) => item.replace(/^[\s\d.、-]+/, "").replace(/^[^：:]{1,12}[：:]/, "").trim())
    .flatMap((item) => item.split(/\s+/))
    .filter(Boolean);
}

function cleanCandidate(value) {
  return String(value || "").replace(/[^\u4e00-\u9fff]/g, "").trim();
}

function isGoodWord(word) {
  const blocked = ["请直接认读", "回答尽量包含", "孩子卡住时", "今日词语", "词语积累", "阅读内容", "短句理解", "生字认读"];
  if (word.endsWith("了") && word.length >= 5) return false;
  return /^[\u4e00-\u9fff]{2,6}$/.test(word) && !blocked.some((item) => word.includes(item));
}

function cleanSentence(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/^[\d.、-]+/, "")
    .replace(/^[^：:]{1,10}[：:]/, "")
    .trim();
}

function isGoodSentence(sentence) {
  if (!/[\u4e00-\u9fff]/.test(sentence)) return false;
  if (sentence.length < 5 || sentence.length > 36) return false;
  if (/[、：:《》]/.test(sentence)) return false;
  const blocked = ["请直接认读", "回答尽量包含", "孩子卡住时", "今日重点", "家长审核", "拼音", "组词", "生字", "词语", "易错"];
  return !blocked.some((item) => sentence.includes(item));
}

function inferTheme(text) {
  const storyTitle = text.match(/《([^》]{2,24})》/);
  if (storyTitle) return storyTitle[1];
  const dayTitle = text.match(/#\s*(Day\s*\d+[^#\n]*)/i);
  if (dayTitle) return dayTitle[1].replace(/[｜|].*/, "").trim();
  return "今日练习";
}

function buildQuestions(focus) {
  const byChar = Object.fromEntries(getCharacterLibrary().map((item) => [item.char, item]));
  const charItems = focus.chars.map((char) => byChar[char] || makeFallbackChar(char));
  const weak = focus.weakChars.map((char) => byChar[char] || makeFallbackChar(char));
  const choicePool = [...new Set(charItems.map((item) => item.char))];
  const questions = [];

  charItems.slice(0, 16).forEach((item) => {
    questions.push({
      type: "认读",
      prompt: "读字，说词语",
      display: item.char,
      answer: "",
      char: item.char
    });
  });

  charItems.filter((item) => item.pinyin).slice(0, 8).forEach((item) => {
    questions.push({
      type: "拼音",
      prompt: "看拼音，找汉字",
      display: item.pinyin,
      answer: item.char,
      char: item.char,
      choices: makeChoices(item.char, choicePool)
    });
  });

  (focus.words.length ? focus.words : charItems.flatMap((item) => item.words).slice(0, 8)).slice(0, 12).forEach((word) => {
    questions.push({
      type: "造句",
      prompt: "读词语，说句子",
      display: word,
      answer: makeWordReference(word, focus.sentences),
      char: [...word].find((char) => byChar[char]) || word[0]
    });
  });

  focus.sentences.slice(0, 5).forEach((sentence) => {
    questions.push({
      type: "短句理解",
      prompt: "读句子，说意思",
      display: sentence,
      answer: makeSentenceReference(sentence, focus.theme),
      char: [...sentence].find((char) => byChar[char]) || "日"
    });
  });

  weak.slice(0, 2).forEach((item) => {
    questions.push({
      type: "复习",
      prompt: "复习易错字，组词",
      display: item.char,
      answer: item.words.join("、"),
      char: item.char
    });
  });

  return questions;
}

function makeChoices(answer, pool) {
  const candidates = [...new Set([answer, ...pool, ...BASE_HANZI_DATA.map((item) => item.char)])].filter(Boolean);
  const distractors = candidates.filter((char) => char !== answer).slice(0, 3);
  return shuffle([answer, ...distractors]).slice(0, Math.min(4, candidates.length));
}

function shuffle(items) {
  return [...items].sort((a, b) => a.localeCompare(b, "zh-Hans"));
}

function makeWordReference(word, sentences) {
  const source = sentences.find((sentence) => sentence.includes(word)) || "";
  if (source) return `例句：${source}`;
  const local = BASE_HANZI_DATA.find((item) => item.words?.includes(word) && item.sentence);
  if (local) return `例句：${local.sentence}`;
  return `例句：请用“${word}”说一句完整的话`;
}

function makeSentenceReference(sentence, theme) {
  if (sentence.includes("上课铃响了")) return "参考：上课铃响了，说明要开始上课或回到教室";
  if (sentence.includes("终点")) return "参考：这句话在说谁坚持到了终点";
  if (sentence.includes("骄傲")) return "参考：这句话提醒我们不要骄傲";
  return `参考：这句话和“${theme || "今日阅读"}”有关，说清谁在做什么即可`;
}

function makeFallbackChar(char) {
  const lexical = getChineseLexicalInfo(char);
  const common = COMMON_CHAR_INFO[char];
  const words = lexical?.words?.map((item) => item.word) || common?.[1];
  return {
    char,
    pinyin: lexical?.pinyin || PINYIN_MAP[char] || "",
    meaning: lexical?.meaning || common?.[0] || "",
    words: words || [char],
    sentence: common?.[2] || ""
  };
}

function normalizeChineseText(input) {
  return String(input || "")
    .trim()
    .replace(/^char:/, "")
    .replace(/\s+/g, "");
}

function getChineseLexicalInfo(text) {
  const key = normalizeChineseText(text);
  return CHINESE_LEXICAL_INFO[key] || null;
}

function getDisplayTextFromItem(item) {
  return normalizeChineseText(item?.text || item?.char || item?.character || "");
}

function lookupFromExistingDictionary(text) {
  const key = normalizeChineseText(text);
  const cached = state.dictionaryCache?.[key];
  if (cached?.meaning) {
    return {
      text: key,
      type: key.length === 1 ? "character" : "word",
      pinyin: cached.pinyin || PINYIN_MAP[key] || "",
      meaning: cached.meaning,
      words: normalizeWordExamples(cached.words || []),
      source: ["在线字典缓存"]
    };
  }
  const local = BASE_HANZI_DATA.find((item) => item.char === key);
  if (local?.meaning) {
    return {
      text: key,
      type: "character",
      pinyin: local.pinyin || PINYIN_MAP[key] || "",
      meaning: local.meaning,
      words: normalizeWordExamples(local.words || []),
      source: ["基础识字字库"]
    };
  }
  const common = COMMON_CHAR_INFO[key];
  if (common?.[0]) {
    return {
      text: key,
      type: "character",
      pinyin: PINYIN_MAP[key] || "",
      meaning: common[0],
      words: normalizeWordExamples(common[1] || []),
      source: ["一年级常用字库"]
    };
  }
  return null;
}

function resolveChineseLexicalInfo(text) {
  const key = normalizeChineseText(text);
  if (!key) return null;
  const existing = lookupFromExistingDictionary(key);
  const supplemental = getChineseLexicalInfo(key);
  if (existing && supplemental) {
    return {
      ...existing,
      pinyin: supplemental.pinyin || existing.pinyin,
      meaning: hasRealMeaning(existing.meaning) ? existing.meaning : supplemental.meaning,
      words: resolveWordExamples(supplemental.words, existing.words),
      source: unique([...(existing.source || []), ...(supplemental.source || ["补充词汇库"])])
    };
  }
  return supplemental || existing;
}

function resolveChineseMeaning(text) {
  return resolveChineseLexicalInfo(text)?.meaning || "";
}

function resolveChineseWords(text) {
  return resolveChineseLexicalInfo(text)?.words || [];
}

function resolveWordExamples(primary = [], fallback = []) {
  const combined = [...normalizeWordExamples(primary), ...normalizeWordExamples(fallback)];
  const seen = new Set();
  return combined.filter((item) => {
    const key = normalizeChineseText(item.word);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

function normalizeWordExamples(words) {
  return (words || []).map((item) => {
    if (typeof item === "string") return { word: item };
    return { word: item.word || "", pinyin: item.pinyin || "", meaning: item.meaning || "" };
  }).filter((item) => item.word);
}

function getCharacterLibrary() {
  const byChar = new Map();
  const addItem = (item, source) => {
    if (!item?.char) return;
    const next = { ...item, source };
    const existing = byChar.get(item.char);
    if (!existing) {
      byChar.set(item.char, next);
      return;
    }
    byChar.set(item.char, mergeCharacterItem(existing, next));
  };

  Object.values(state.learnerChars || {}).forEach((item) => addItem(makeLearnerCharItem(item), "learner"));
  (state.latestLearning?.chars || []).forEach((char) => addItem(makeFallbackChar(char), "latest"));
  (state.latestLearning?.charDetails || []).forEach((item) => addItem(makeLearnerCharItem(item), "latest"));
  BASE_HANZI_DATA.forEach((item) => addItem(item, "base"));
  Object.values(state.dictionaryCache || {}).forEach((item) => addItem(makeDictionaryCharItem(item), "dictionary"));
  [...new Set([...PEP_GRADE_ONE_CHARS])].forEach((char) => addItem(makeFallbackChar(char), "pep"));
  [...new Set([...GRADE_ONE_MATH_CHARS])].forEach((char) => addItem(makeFallbackChar(char), "math"));
  return sortByMastery([...byChar.values()]);
}

function makeLearnerCharItem(item) {
  const char = item.character || item.char;
  const local = makeFallbackChar(char);
  return {
    ...local,
    char,
    pinyin: item.pinyin || local.pinyin,
    words: item.words?.length ? item.words : unique([item.commonWord, ...(item.wordGroups || []), ...local.words]).filter(Boolean),
    meaning: item.meaning || local.meaning,
    sentence: item.example || item.sentence || local.sentence,
    status: item.status || "unstable",
    sourceText: item.source || "",
    selectionReason: item.selectionReason || ""
  };
}

function makeDictionaryCharItem(entry) {
  return {
    char: entry.char,
    pinyin: entry.pinyin || "",
    meaning: entry.meaning || "",
    words: entry.words?.length ? entry.words : [entry.char],
    sentence: entry.sentence || ""
  };
}

function sortByMastery(items) {
  return items.sort((a, b) => {
    const aScore = getChineseItemWeight(a, getChineseProgress(a.char), state.chineseRecognition?.recentlyShownIds || []);
    const bScore = getChineseItemWeight(b, getChineseProgress(b.char), state.chineseRecognition?.recentlyShownIds || []);
    if (aScore !== bScore) return bScore - aScore;
    return a.char.localeCompare(b.char, "zh-Hans");
  });
}

function getChineseProgress(char) {
  const id = `char:${char}`;
  state.chineseRecognition ||= { version: 2, items: {}, recentlyShownIds: [] };
  state.chineseRecognition.items ||= {};
  const progress = normalizeProgress(state.chineseRecognition.items[id], id);
  state.chineseRecognition.items[id] = progress;
  return progress;
}

function getChineseItemWeight(item, progress, recentlyShownIds) {
  const id = `char:${item.char}`;
  const sourceBoost = Math.max(1, sourcePriority(item.source) / 40);
  const learnerBoost = ["learner", "latest"].includes(item.source) ? 2.5 : 1;
  const unseenBoost = progress.seenCount === 0 ? 3 : 1;
  const masteryFactor = Math.max(0.08, Math.pow(0.55, progress.masteryCount || getMasteryLevel(item.char)));
  const difficultyFactor = 1 + progress.unknownCount * 0.9 + progress.unsureCount * 0.35;
  const recentMistakeBoost = progress.lastResult === "unknown" ? 1.7 : progress.lastResult === "unsure" ? 1.25 : 1;
  const recentPenalty = recentlyShownIds.includes(id) ? 0.03 : 1;
  return Math.max(0.001, sourceBoost * learnerBoost * unseenBoost * masteryFactor * difficultyFactor * recentMistakeBoost * recentPenalty);
}

function sourcePriority(source) {
  if (source === "learner") return 140;
  if (source === "latest") return 100;
  if (source === "dictionary") return 80;
  if (source === "base") return 40;
  if (source === "math") return 25;
  return 10;
}

function masteryWeight(level) {
  return [0, -20, -45, -80, -130][Math.min(level, 4)] || -130;
}

function getMasteryLevel(char) {
  return state.mastery?.[char]?.level || 0;
}

function mergeCharacterItem(existing, next) {
  return {
    ...existing,
    pinyin: betterValue(existing.pinyin, next.pinyin),
    meaning: betterMeaning(existing.meaning, next.meaning),
    words: next.words?.length && next.words.join("") !== next.char ? next.words : existing.words,
    sentence: betterValue(existing.sentence, next.sentence),
    source: ["learner", "latest"].includes(existing.source) ? existing.source : next.source || existing.source
  };
}

function betterValue(current, incoming) {
  return current || incoming || "";
}

function betterMeaning(current, incoming) {
  const weak = !current
    || current.includes("暂无本地释义")
    || current.includes("结合今天")
    || current.includes("一年级常用字")
    || current.includes("结合学习内容");
  return weak && incoming ? incoming : current;
}

async function hydrateMeaningElement(char, element) {
  const text = normalizeChineseText(char);
  const item = getCharacterByChar(text);
  element.innerHTML = renderMeaningContent(item);
  recordMissingLexicalInfo(text);
}

function hasRealMeaning(value) {
  return Boolean(value)
    && !value.includes("请在字典页")
    && !value.includes("暂无")
    && !value.includes("结合");
}

async function ensureDictionaryEntry(char) {
  if (!isSingleChineseChar(char)) return null;
  state.dictionaryCache ||= {};
  if (state.dictionaryCache[char]?.meaning) return state.dictionaryCache[char];
  const online = await fetchOnlineDictionary(char);
  if (!online?.meaning) return null;
  state.dictionaryCache[char] = online;
  saveState();
  return online;
}

function renderMeaningContent(item, sourceLabel = getSourceLabel(item)) {
  const text = getDisplayTextFromItem(item);
  const lexical = resolveChineseLexicalInfo(text);
  const pinyin = item?.pinyin || lexical?.pinyin || PINYIN_MAP[text] || "";
  const meaning = item?.meaning || lexical?.meaning || makeGenericChineseMeaning(text);
  const sentenceText = item?.sentence || lexical?.sentence || "";
  const sentence = sentenceText ? `<br>例句 / Sentence: ${escapeHtml(displayText(sentenceText))}` : "";
  const lexicalSource = Array.isArray(lexical?.source) ? lexical.source.join("、") : lexical?.source;
  const source = item?.source || lexicalSource || sourceLabel;
  return `
    <strong>${escapeHtml(text)}${pinyin ? ` ${escapeHtml(pinyin)}` : ""}</strong><br>
    ${escapeHtml(displayText(meaning))}
    <small class="source-note">${escapeHtml(source)}</small>
    ${sentence}
  `;
}

function renderWordsContent(item) {
  const text = getDisplayTextFromItem(item);
  const ownWords = normalizeWordExamples(item?.words || []);
  const words = ownWords.length ? ownWords : resolveChineseWords(text);
  if (!words.length) {
    recordMissingLexicalInfo(text);
    return renderGeneratedWordGroups(text);
  }
  return `
    <div class="word-examples">
      ${words.slice(0, 3).map((word) => `
        <span class="word-example-chip">
          <strong>${escapeHtml(word.word)}</strong>
          ${word.meaning ? `<small>${escapeHtml(word.meaning)}</small>` : ""}
        </span>
      `).join("")}
    </div>
  `;
}

function makeGenericChineseMeaning(text) {
  const key = normalizeChineseText(text);
  if (!key) return "常用汉字，可结合词语和句子理解。";
  return key.length === 1
    ? `“${key}”是常用汉字，可结合组词认读和理解。`
    : `“${key}”是练习词语，可结合短句认读和理解。`;
}

function renderGeneratedWordGroups(text) {
  const key = normalizeChineseText(text);
  const groups = key.length === 1
    ? [`${key}字`, `${key}词`, `${key}句`]
    : [key, `${key}练习`, `${key}短句`];
  return `
    <div class="word-examples">
      ${groups.map((word) => `
        <span class="word-example-chip">
          <strong>${escapeHtml(word)}</strong>
        </span>
      `).join("")}
    </div>
  `;
}

function recordMissingLexicalInfo(text) {
  const key = normalizeChineseText(text);
  if (!key) return;
  state.missingLexicalInfo ||= { meanings: [], words: [] };
  if (!resolveChineseMeaning(key) && !state.missingLexicalInfo.meanings.includes(key)) {
    state.missingLexicalInfo.meanings.push(key);
  }
  if (resolveChineseWords(key).length < 3 && !state.missingLexicalInfo.words.includes(key)) {
    state.missingLexicalInfo.words.push(key);
  }
  saveState();
  renderLexicalCheck();
}

function getSourceLabel(item) {
  if (item?.source === "learner") return "今日重点字词";
  if (item?.source === "latest") return "今日练习来源";
  if (item?.source === "dictionary") return "在线字典";
  if (item?.source === "base") return "一年级语文常用字库";
  if (item?.source === "math") return "一年级数学常用字库";
  if (item?.source === "pep") return "人民教育出版社一年级字库";
  return "本地字典来源";
}

function getCharacterByChar(char) {
  return getCharacterLibrary().find((item) => item.char === char) || makeFallbackChar(char);
}

function getCharacterPageSize() {
  return window.matchMedia("(max-width: 620px)").matches ? 6 : 12;
}

function renderFocus(focus) {
  const title = state.focusTitleOverride || focus.theme;
  $("#focusTitle").textContent = title;
  $("#focusItemsInput").value = focusToEditableText(focus);
  renderFocusChips(focus);
}

function focusToEditableText(focus) {
  return [...new Set([
    ...focus.chars,
    ...focus.words,
    ...focus.sentences
  ])].join("\n");
}

function renderFocusChips(focus) {
  $("#focusChips").innerHTML = [
    ...focus.chars,
    ...focus.words,
    ...focus.sentences.slice(0, 4)
  ].map((label) => `<span>${escapeHtml(label)}</span>`).join("");
}

function renderPendingReview() {
  $("#reviewList").classList.add("empty");
  $("#reviewList").textContent = "请先确认今日重点 / Confirm today's focus first.";
}

function renderReview(questions) {
  $("#reviewList").classList.remove("empty");
  const grouped = groupQuestions(questions);
  $("#reviewList").innerHTML = grouped.map((group, index) => `
    <div class="review-item review-group">
      <strong>${index + 1}. ${escapeHtml(group.type)}</strong>
      <div class="review-prompt">${escapeHtml(group.prompt)}${group.sharedAnswer ? ` ${escapeHtml(group.sharedAnswer)}` : ""}</div>
      <div class="review-targets">
        ${group.items.map((item) => `<span>${escapeHtml(reviewDisplay(item))}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

function reviewDisplay(question) {
  if ((question.type === "拼音" || question.type === "语境辨字") && question.choices?.length) {
    return `${question.display}：${question.choices.join(" / ")}`;
  }
  return question.display;
}

function groupQuestions(questions) {
  const map = new Map();
  questions.forEach((question) => {
    const key = `${question.type}__${question.prompt}`;
    if (!map.has(key)) {
      map.set(key, {
        type: question.type,
        prompt: question.prompt,
        sharedAnswer: getSharedInstruction(question),
        items: []
      });
    }
    map.get(key).items.push(question);
  });
  return [...map.values()];
}

function getSharedInstruction(question) {
  if (question.type === "认读") return "";
  if (question.type === "造句") return "点击词语看例句";
  if (question.type === "语境辨字") return "每题只有一个合适的字";
  if (question.type === "短句理解") return "点击句子看参考";
  return "";
}

function confirmFocusItems() {
  const base = state.latestLearning || extractLearningFocus(SAMPLE_TEXT);
  const edited = parseFocusItems($("#focusItemsInput").value, base);
  state.latestLearning = edited;
  const value = edited.theme;
  state.focusTitleOverride = value;
  const latest = state.dailyRecords.at(-1);
  if (!generatedQuestions.length) {
    $("#packStatus").textContent = "今日课程暂未准备好 / Course not ready";
    $("#approveBtn").disabled = true;
    return;
  }
  if (latest) {
    latest.extracted = edited;
    latest.questions = generatedQuestions;
    latest.approved = false;
  }
  saveState();
  renderFocusChips(edited);
  renderReview(generatedQuestions);
  renderCharacters();
  renderDictionary();
  $("#approveBtn").disabled = false;
  $("#focusTitle").textContent = value;
  $("#packStatus").textContent = "今日重点已确认 / Focus confirmed";
}

function parseFocusItems(value, base) {
  const lines = [...new Set(value.split(/\n+/).map((line) => line.trim()).filter(Boolean))];
  const chars = [];
  const words = [];
  const sentences = [];

  lines.forEach((line) => {
    if (/^[\u4e00-\u9fff]$/.test(line)) {
      chars.push(line);
    } else if (isGoodSentence(line)) {
      sentences.push(line);
      [...line].forEach((char) => {
        if (/[\u4e00-\u9fff]/.test(char) && chars.length < 24 && !chars.includes(char)) chars.push(char);
      });
    } else if (isGoodWord(line)) {
      words.push(line);
      [...line].forEach((char) => {
        if (!chars.includes(char)) chars.push(char);
      });
    }
  });

  return {
    ...base,
    chars: chars.length ? chars.slice(0, 24) : base.chars,
    words: words.length ? words.slice(0, 16) : base.words,
    sentences: sentences.length ? sentences.slice(0, 8) : base.sentences,
    weakChars: base.weakChars?.filter((char) => chars.includes(char)) || [],
    theme: base.theme || "今日练习"
  };
}

function approvePractice() {
  approvedQuestions = generatedQuestions;
  currentQuestionIndex = 0;
  const latest = state.dailyRecords.at(-1);
  if (latest) latest.approved = true;
  state.answerPanelsHidden = true;
  saveState();
  applyAnswerPanelVisibility();
  $("#practiceRunner").hidden = false;
  renderQuestion();
}

function toggleAnswerPanel(scope) {
  if (scope === "focus") $("#focusPanel").classList.toggle("answer-hidden");
  if (scope === "review") $("#reviewPanel").classList.toggle("answer-hidden");
  syncAnswerPanelButtons();
  state.answerPanelsHidden = $("#focusPanel").classList.contains("answer-hidden") && $("#reviewPanel").classList.contains("answer-hidden");
  saveState();
}

function applyAnswerPanelVisibility() {
  $("#focusPanel").classList.toggle("answer-hidden", Boolean(state.answerPanelsHidden));
  $("#reviewPanel").classList.toggle("answer-hidden", Boolean(state.answerPanelsHidden));
  syncAnswerPanelButtons();
}

function syncAnswerPanelButtons() {
  syncPanelButton("#focusPanel", "#toggleFocusBtn");
  syncPanelButton("#reviewPanel", "#toggleReviewBtn");
}

function syncPanelButton(panelSelector, buttonSelector) {
  const hidden = $(panelSelector).classList.contains("answer-hidden");
  $(buttonSelector).innerHTML = hidden ? "展示<br><span>Show</span>" : "隐藏<br><span>Hide</span>";
}

function renderQuestion() {
  const question = approvedQuestions[currentQuestionIndex];
  if (!question) {
    finishPractice();
    return;
  }
  const baseItem = getCharacterByChar(question.char);
  const item = makeQuestionCharacterItem(question, baseItem);
  const isSingleChar = question.display === question.char;
  const revealTarget = isSingleChar ? question.char : item.char;
  const inWordbook = Boolean(state.wordbook[revealTarget]);
  const mainDisplay = renderQuestionMain(question, item, isSingleChar, revealTarget);
  const questionNumber = getQuestionNumber(question, currentQuestionIndex);
  const meaning = question.meaning || item.meaning || resolveChineseMeaning(revealTarget) || makeGenericChineseMeaning(revealTarget);
  $("#questionCard").innerHTML = `
    <div class="question-prompt">
      <span>${escapeHtml(questionNumber)} · ${escapeHtml(question.type)}</span>
      <strong>${escapeHtml(question.prompt)}</strong>
    </div>
    <div class="question-nav-row">
      <button class="arrow-button" data-question-prev="true" type="button" aria-label="上一个">‹</button>
      <div class="question-character-wrap">
        <button class="star question-star" data-star="${escapeHtml(revealTarget)}" type="button" aria-label="加入或移出生字本">${inWordbook ? "★" : "☆"}</button>
        ${mainDisplay}
        <button class="button secondary meaning-under-char" data-detail="${escapeHtml(revealTarget)}" type="button">查看释义<br><span>Meaning</span></button>
        <button class="button ghost meaning-under-char" data-words="${escapeHtml(revealTarget)}" type="button">组词<br><span>Words</span></button>
      </div>
      <button class="arrow-button" data-question-next="true" type="button" aria-label="下一个">›</button>
    </div>
    <div class="meaning" data-meaning-for="${escapeHtml(revealTarget)}" hidden>
      ${renderMeaningContent({ ...item, meaning })}
    </div>
    <div class="meaning word-panel" data-words-for="${escapeHtml(revealTarget)}" hidden>
      ${renderWordsContent(item)}
    </div>
  `;
}

function makeQuestionCharacterItem(question, baseItem) {
  const wordGroups = Array.isArray(question.wordGroups) ? question.wordGroups : [];
  const words = wordGroups.length
    ? wordGroups.map((word) => typeof word === "string" ? { word } : word)
    : [];
  return {
    ...baseItem,
    char: question.char || baseItem.char,
    pinyin: question.pinyin || baseItem.pinyin || "",
    meaning: question.meaning || baseItem.meaning || "",
    words: words.length ? words : baseItem.words,
    sentence: question.example || question.reference || baseItem.sentence || "",
    source: question.meaning || wordGroups.length ? "AI每日生成" : baseItem.source
  };
}

function renderQuestionMain(question, item, isSingleChar, revealTarget) {
  const pinyin = getQuestionPinyin(question, item);
  if (question.type === "拼音") {
    return `
      <span class="big-char phrase-display pinyin-prompt">${escapeHtml(question.display)}</span>
      ${renderChoices(question)}
      <button class="pinyin" data-pinyin-for="${escapeHtml(revealTarget)}" data-pinyin-speak="${escapeHtml(revealTarget)}" hidden type="button">${escapeHtml(pinyin)}</button>
    `;
  }

  if (question.type === "语境辨字") {
    return `
      <span class="big-char phrase-display context-prompt">${escapeHtml(question.display)}</span>
      ${renderChoices(question)}
      <button class="pinyin" data-pinyin-for="${escapeHtml(revealTarget)}" data-pinyin-speak="${escapeHtml(revealTarget)}" hidden type="button">${escapeHtml(pinyin)}</button>
    `;
  }

  if (question.type === "造句" || question.type === "短句理解") {
    return `
      <button class="big-char phrase-display reference-trigger" data-reference="${escapeHtml(question.answer || "")}" type="button">${escapeHtml(question.display)}</button>
      <div class="reference-answer" hidden>${escapeHtml(question.answer || "")}</div>
      <button class="pinyin" data-pinyin-for="${escapeHtml(revealTarget)}" data-pinyin-speak="${escapeHtml(revealTarget)}" hidden type="button">${escapeHtml(pinyin)}</button>
    `;
  }

  return `
    ${isSingleChar
      ? `<button class="big-char char-reveal" data-reveal="${escapeHtml(revealTarget)}" type="button">${escapeHtml(question.display)}</button>`
      : `<span class="big-char phrase-display">${escapeHtml(question.display)}</span>`}
    <button class="pinyin" data-pinyin-for="${escapeHtml(revealTarget)}" data-pinyin-speak="${escapeHtml(revealTarget)}" hidden type="button">${escapeHtml(pinyin)}</button>
  `;
}

function getQuestionPinyin(question, item) {
  return question.pinyin || item.pinyin || PINYIN_MAP[question.char] || "";
}

function getQuestionNumber(question, index) {
  const order = ["认读", "拼音", "语境辨字", "造句", "复习", "短句理解"];
  const group = Math.max(1, order.indexOf(question.type) + 1);
  const sub = approvedQuestions.slice(0, index + 1).filter((item) => item.type === question.type).length || 1;
  return `${group}.${sub}`;
}

function renderChoices(question) {
  const labels = ["A", "B", "C", "D"];
  return `
    <div class="choice-grid">
      ${(question.choices || [question.answer]).map((choice, index) => `
        <button class="choice-button" data-choice="${escapeHtml(choice)}" type="button">
          <span>${labels[index]}</span>
          <strong>${escapeHtml(choice)}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function toggleReference(target) {
  const answer = target.parentElement?.querySelector(".reference-answer");
  if (answer) answer.hidden = !answer.hidden;
}

function selectChoice(target) {
  const buttons = [...(target.parentElement?.querySelectorAll(".choice-button") || [])];
  const wasSelected = target.classList.contains("selected");
  buttons.forEach((button) => button.classList.remove("selected"));
  if (!wasSelected) target.classList.add("selected");
}

function moveQuestion(delta) {
  if (!approvedQuestions.length) return;
  currentQuestionIndex = (currentQuestionIndex + delta + approvedQuestions.length) % approvedQuestions.length;
  renderQuestion();
}

function answerCurrent(outcome) {
  const question = approvedQuestions[currentQuestionIndex];
  if (!question) return;
  const isCorrect = outcome === "correct";
  state.attempts[question.char] ||= { correct: 0, wrong: 0, hesitated: 0 };
  if (outcome === "correct") {
    state.attempts[question.char].correct += 1;
    updateChineseRecognitionResult(question.char, "mastered", false);
  } else if (outcome === "hesitated") {
    state.attempts[question.char].hesitated += 1;
    updateLearnerCharFromAnswer(question, "unstable");
    updateChineseRecognitionResult(question.char, "unsure", false);
  } else {
    state.attempts[question.char].wrong += 1;
    addToWordbook(question.char);
    updateLearnerCharFromAnswer(question, "unknown");
    updateChineseRecognitionResult(question.char, "unknown", false);
  }
  if (outcome === "correct") updateLearnerCharFromAnswer(question, "consolidating");
  const latest = state.dailyRecords.at(-1);
  if (latest) latest.results.push({
    char: question.char,
    type: question.type,
    correct: isCorrect,
    outcome,
    display: question.display,
    answer: question.answer,
    at: new Date().toISOString()
  });
  saveState();
  currentQuestionIndex += 1;
  renderQuestion();
  renderWordbook();
}

function updateLearnerCharFromAnswer(question, status) {
  if (!isSingleChineseChar(question.char)) return;
  state.learnerChars ||= {};
  const current = state.learnerChars[question.char] || { char: question.char };
  const now = new Date().toISOString();
  const correctStreak = status === "consolidating" ? (current.correctStreak || 0) + 1 : 0;
  state.learnerChars[question.char] = {
    ...current,
    char: question.char,
    pinyin: question.pinyin || current.pinyin || "",
    words: unique([question.commonWord, ...(question.wordGroups || []), ...(current.words || [])]).slice(0, 5),
    meaning: question.meaning || current.meaning || "",
    sentence: question.example || question.reference || current.sentence || "",
    status,
    lastPracticeAt: now,
    correctCount: (current.correctCount || 0) + (status === "consolidating" ? 1 : 0),
    hesitatedCount: (current.hesitatedCount || 0) + (status === "unstable" ? 1 : 0),
    wrongCount: (current.wrongCount || 0) + (status === "unknown" ? 1 : 0),
    correctStreak
  };
}

function finishPractice() {
  $("#questionCard").innerHTML = "<p>今天完成 / Completed</p><p>错题已同步生字本</p>";
  renderReport();
}

function getCurrentQuestionText() {
  return approvedQuestions[currentQuestionIndex]?.display || "每日练习";
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    $("#packStatus").textContent = "当前浏览器不支持朗读 / Speech unavailable";
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function renderCharacters() {
  const library = getCharacterLibrary();
  const pageSize = getCharacterPageSize();
  const totalPages = Math.max(1, Math.ceil(library.length / pageSize));
  if (characterPage >= totalPages) characterPage = 0;
  const start = characterPage * pageSize;
  const items = library.slice(start, start + pageSize);
  $("#characterSetTitle").textContent = `第 ${characterPage + 1} 组`;
  $("#characterSetMeta").textContent = `共 ${library.length} 字`;
  $("#characterGrid").innerHTML = items.map(renderCharacterCard).join("");
}

function renderCharacterCard(item) {
  const inWordbook = Boolean(state.wordbook[item.char]);
  const masteryLevel = getMasteryLevel(item.char);
  const progress = getChineseProgress(item.char);
  return `
    <article class="character-card">
      <button class="star" data-star="${item.char}" aria-label="加入生字本 Add to Wordbook">${inWordbook ? "★" : "☆"}</button>
      <div class="character-main-row">
        <button class="char-main char-reveal" data-reveal="${item.char}" type="button">${item.char}</button>
        <button class="pinyin" data-pinyin-for="${item.char}" data-pinyin-speak="${item.char}" hidden type="button">${item.pinyin}</button>
      </div>
      <button class="button secondary meaning-under-char" data-detail="${item.char}" type="button">查看释义<br><span>Meaning</span></button>
      <button class="button ghost meaning-under-char" data-words="${item.char}" type="button">组词<br><span>Words</span></button>
      <div class="meaning" data-meaning-for="${item.char}" hidden>
        ${renderMeaningContent({ ...item, meaning: item.meaning || resolveChineseMeaning(item.char) || makeGenericChineseMeaning(item.char) })}
      </div>
      <div class="meaning word-panel" data-words-for="${item.char}" hidden>
        ${renderWordsContent(item)}
      </div>
      <div class="mini-actions">
        <button class="button warning" data-chinese-char="${item.char}" data-chinese-result="unknown" type="button">不认识<br><span>Unknown</span></button>
        <button class="button secondary" data-chinese-char="${item.char}" data-chinese-result="unsure" type="button">有点熟<br><span>Unsure</span></button>
        <button class="button success" data-master-char="${item.char}" type="button">已掌握<br><span>${progress.masteryCount || masteryLevel}</span></button>
        <button class="button ghost" data-chinese-char="${item.char}" data-chinese-result="skipped" type="button">跳过<br><span>Skip</span></button>
      </div>
    </article>
  `;
}

function markCharacterMastered(char) {
  state.mastery[char] ||= { level: 0, updatedAt: "" };
  state.mastery[char].level = Math.min(4, state.mastery[char].level + 1);
  state.mastery[char].updatedAt = new Date().toISOString();
  updateChineseRecognitionResult(char, "mastered", false);
  saveState();
  renderCharacters();
}

function updateChineseRecognitionResult(char, result, rerender = true) {
  if (!isSingleChineseChar(char)) return;
  const id = `char:${char}`;
  state.chineseRecognition ||= { version: 2, items: {}, recentlyShownIds: [] };
  updateRecognitionProgress(state.chineseRecognition.items, id, result);
  state.chineseRecognition.recentlyShownIds = pushRecent(state.chineseRecognition.recentlyShownIds, id);
  if (result === "unknown") addToWordbook(char);
  if (rerender) {
    saveState();
    renderCharacters();
    renderWordbook();
  }
}

function bindCardActions() {
  // Event delegation in bindCharacterPractice keeps reveal controls working after refresh.
}

function addToWordbook(char) {
  if (!/^[\u4e00-\u9fff]$/.test(char || "")) return;
  state.wordbook[char] ||= { addedAt: new Date().toISOString(), mastered: false };
  saveState();
}

function toggleWordbook(char) {
  if (!/^[\u4e00-\u9fff]$/.test(char || "")) return;
  if (state.wordbook[char]) {
    delete state.wordbook[char];
  } else {
    state.wordbook[char] = { addedAt: new Date().toISOString(), mastered: false };
  }
  saveState();
}

function rerenderCharacterSurfaces() {
  renderCharacters();
  renderDictionary();
  renderWordbook();
  if (!$("#practiceRunner").hidden && approvedQuestions.length) renderQuestion();
}

function renderWordbook() {
  const entries = Object.entries(state.wordbook || {});
  if (!entries.length) {
    $("#wordbookList").innerHTML = `<article class="surface wordbook-card">还没有生字 / No saved characters yet.</article>`;
    return;
  }
  $("#wordbookList").innerHTML = entries.map(([key, record]) => {
    const text = record.text || record.char || key.replace(/^word:/, "");
    const isChar = isSingleChineseChar(text);
    const item = isChar ? getCharacterByChar(text) : null;
    const days = Math.max(1, Math.ceil((Date.now() - new Date(record.addedAt || Date.now()).getTime()) / 86400000));
    const latestSource = record.sources?.at(-1) || {};
    const statusLine = record.latestStatus ? `<p class="source-note">状态：${escapeHtml(record.latestStatus)} · 出现 ${record.count || 1} 次</p>` : "";
    const sourceLine = latestSource.context ? `<p class="source-note">来源：${escapeHtml(latestSource.day || "反馈")} · ${escapeHtml(latestSource.contextWord || record.contextWord || text)} · ${escapeHtml(latestSource.context)}</p>` : "";
    if (!isChar) {
      return `
        <article class="wordbook-card">
          <button class="char-main" type="button">${escapeHtml(text)}</button>
          <p class="days">进入生字本 ${days} 天 / ${days} day(s) in Wordbook</p>
          ${statusLine}
          ${sourceLine}
          <div class="mini-actions">
            <button class="button success" data-mastered="${escapeHtml(key)}">已掌握<br><span>Mastered</span></button>
          </div>
        </article>
      `;
    }
    return `
      <article class="wordbook-card">
        <button class="char-main char-reveal" data-reveal="${text}" type="button">${text}</button>
        <button class="pinyin" data-pinyin-for="${text}" data-pinyin-speak="${text}" hidden type="button">${item?.pinyin || ""}</button>
        <p class="days">进入生字本 ${days} 天 / ${days} day(s) in Wordbook</p>
        ${statusLine}
        ${sourceLine}
        <div class="meaning" data-meaning-for="${text}" hidden>
          ${renderMeaningContent({ ...item, meaning: resolveChineseMeaning(text) || item?.meaning || makeGenericChineseMeaning(text) })}
        </div>
        <div class="meaning word-panel" data-words-for="${text}" hidden>
          ${renderWordsContent(item)}
        </div>
        <div class="mini-actions">
          <button class="button secondary" data-detail="${text}">查看释义<br><span>Meaning</span></button>
          <button class="button ghost" data-words="${text}">组词<br><span>Words</span></button>
          <button class="button success" data-mastered="${escapeHtml(key)}">已掌握<br><span>Mastered</span></button>
        </div>
      </article>
    `;
  }).join("");
  $$("[data-mastered]").forEach((button) => button.addEventListener("click", () => {
    delete state.wordbook[button.dataset.mastered];
    saveState();
    renderWordbook();
    renderCharacters();
    renderDictionary();
  }));
}

async function renderDictionary() {
  const query = $("#dictionarySearch")?.value?.trim() || "";
  const list = $("#dictionaryList");
  const char = [...query].find((item) => /[\u4e00-\u9fff]/.test(item));

  if (!char) {
    dictionaryLookupToken += 1;
    list.innerHTML = `
      <article class="surface dictionary-empty">
        <strong>输入一个汉字</strong>
        <span>拼音、部首、笔画、释义、组词、例句</span>
      </article>
    `;
    return;
  }

  const token = ++dictionaryLookupToken;
  list.innerHTML = `<article class="surface dictionary-empty">正在查询 / Searching</article>`;

  const local = buildLocalDictionaryEntry(char);
  const online = await fetchOnlineDictionary(char);
  if (token !== dictionaryLookupToken) return;

  list.innerHTML = renderDictionaryDetail(mergeDictionaryEntry(local, online));
}

function buildLocalDictionaryEntry(char) {
  const item = getCharacterByChar(char);
  return {
    char,
    pinyin: item.pinyin || PINYIN_MAP[char] || "",
    radical: RADICAL_MAP[char] || "待补充",
    strokes: STROKE_MAP[char] || "待补充",
    structure: STRUCTURE_MAP[char] || "独体或待补充",
    meaning: item.meaning || "",
    words: item.words?.length ? item.words : [char],
    sentence: item.sentence || "",
    source: "本地字库"
  };
}

async function fetchOnlineDictionary(char) {
  try {
    const response = await fetchWithTimeout(`/api/dictionary?char=${encodeURIComponent(char)}`, {}, 30000);
    if (!response.ok) return null;
    const data = await response.json();
    return data.ok ? data.entry : null;
  } catch {
    return null;
  }
}

function mergeDictionaryEntry(local, online) {
  if (!online) return local;
  return {
    ...local,
    pinyin: local.pinyin || online.pinyin || "",
    radical: local.radical !== "待补充" ? local.radical : online.radical || local.radical,
    strokes: local.strokes !== "待补充" ? local.strokes : online.strokes || local.strokes,
    structure: local.structure !== "独体或待补充" ? local.structure : online.structure || local.structure,
    meaning: online.meaning || local.meaning,
    words: online.words?.length ? online.words : local.words,
    sentence: online.sentence || local.sentence,
    source: online.source ? `${online.source} + 本地校对` : local.source
  };
}

function renderDictionaryDetail(entry) {
  const inWordbook = Boolean(state.wordbook[entry.char]);
  const words = entry.words?.length ? entry.words : [entry.char];
  return `
    <article class="dictionary-detail surface">
      <button class="star" data-star="${escapeHtml(entry.char)}" aria-label="加入或移出生字本">${inWordbook ? "★" : "☆"}</button>
      <div class="dictionary-hero">
        <button class="char-main char-reveal" data-reveal="${escapeHtml(entry.char)}" type="button">${escapeHtml(entry.char)}</button>
        <button class="pinyin" data-pinyin-for="${escapeHtml(entry.char)}" data-pinyin-speak="${escapeHtml(entry.char)}" hidden type="button">${escapeHtml(entry.pinyin || "")}</button>
      </div>
      <div class="dictionary-facts">
        <span>部首 <strong>${escapeHtml(entry.radical || "待补充")}</strong></span>
        <span>笔画 <strong>${escapeHtml(entry.strokes || "待补充")}</strong></span>
        <span>结构 <strong>${escapeHtml(entry.structure || "待补充")}</strong></span>
        <span>来源 <strong>${escapeHtml(entry.source || "本地字库")}</strong></span>
      </div>
      <section class="dictionary-section">
        <h2>释义</h2>
        <p>${escapeHtml(displayText(entry.meaning || makeGenericChineseMeaning(entry.char)))}</p>
      </section>
      <section class="dictionary-section">
        <h2>组词</h2>
        <div class="review-targets">${words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</div>
      </section>
      <section class="dictionary-section">
        <h2>例句</h2>
        <p>${escapeHtml(displayText(entry.sentence || `请用“${entry.char}”说一句话`))}</p>
      </section>
    </article>
  `;
}

function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isToday(iso, key = todayKey()) {
  return iso ? todayKey(new Date(iso)) === key : false;
}

function buildTodayReport() {
  const date = todayKey();
  const records = state.dailyRecords.filter((record) => isToday(record.date, date));
  const answers = records.flatMap((record) => record.results || []);
  const correct = answers.filter((item) => item.correct).length;
  const wrong = answers.filter((item) => !item.correct);
  const focusChars = [...new Set(records.flatMap((record) => record.extracted?.chars || []))];
  const focusWords = [...new Set(records.flatMap((record) => record.extracted?.words || []))];
  const themes = [...new Set(records.map((record) => record.extracted?.theme).filter(Boolean))];
  const newWordbook = Object.entries(state.wordbook)
    .filter(([, value]) => isToday(value.addedAt, date))
    .map(([char]) => char);

  return {
    date,
    generatedAt: new Date().toISOString(),
    practiceCount: records.length,
    approvedCount: records.filter((record) => record.approved).length,
    questionCount: records.reduce((sum, record) => sum + (record.questions?.length || 0), 0),
    answeredCount: answers.length,
    correctCount: correct,
    wrongCount: wrong.length,
    accuracy: answers.length ? Math.round((correct / answers.length) * 100) : null,
    themes,
    focusChars,
    focusWords,
    wrongChars: [...new Set(wrong.map((item) => item.char).filter(Boolean))],
    newWordbook,
    sourceCount: records.filter((record) => /^https?:/.test(record.source)).length
  };
}

function renderReport(force = false) {
  if (!force) {
    if (state.latestFeedbackSnapshot) {
      renderFeedbackSnapshotPreview({ payload: state.latestFeedbackSnapshot });
    } else if ($("#reportPanel")) {
      $("#reportPanel").textContent = "随时都可以生成，会自动汇总三颗星球的当前进度。";
    }
    renderParentProgressPanel();
    renderLexicalCheck();
    return;
  }
  renderCurrentFeedbackSnapshot();
  return;
  const report = buildTodayReport();
  if (!force && report.answeredCount === 0) return;
  $("#reportPanel").innerHTML = `
    <div class="report-block">
      <strong>${report.date}</strong>
      <p>生成 ${report.practiceCount} 次 · 确认 ${report.approvedCount} 次 · ${report.questionCount} 题</p>
      <p>完成 ${report.answeredCount} 题 · 正确 ${report.correctCount} · 错误 ${report.wrongCount} · 正确率 ${report.accuracy === null ? "暂无" : `${report.accuracy}%`}</p>
      <p>主题 ${report.themes.length ? report.themes.join("、") : "暂无"}</p>
      <p>重点字 ${report.focusChars.length ? report.focusChars.join("、") : "暂无"}</p>
      <p>重点词 ${report.focusWords.length ? report.focusWords.join("、") : "暂无"}</p>
      <p>错题字 ${report.wrongChars.length ? report.wrongChars.join("、") : "暂无"}</p>
      <p>新生字本 ${report.newWordbook.length ? report.newWordbook.join("、") : "暂无"}</p>
      <p>链接来源 ${report.sourceCount} 条</p>
    </div>
  `;
  renderLexicalCheck();
}

function renderParentProgressPanel() {
  const panel = $("#parentProgressPanel");
  if (!panel) return;
  const pack = getSelectedLearningPack();
  if (!pack) {
    panel.textContent = "今日课程暂未准备好。";
    return;
  }
  const progress = getCourseProgress(pack.packId);
  const lines = ["chinese", "english", "art"].map((course) => {
    const status = getPlanetStatus(course, pack);
    const pending = countPendingActivities(course, pack, progress);
    return `<div class="parent-progress-line"><strong>${escapeHtml(courseLabel(course))}</strong><span>${escapeHtml(status.hasCourse ? `${pending.completed}/${pending.total}` : "这一天未安排")}</span><em>${escapeHtml(status.progress)}</em></div>`;
  }).join("");
  panel.innerHTML = `
    <div class="parent-progress-date">${escapeHtml(pack.date)} · ${escapeHtml(pack.title || "")}</div>
    ${lines}
    ${renderDateSwitcher()}
  `;
}

function analyzeChineseLexicalCoverage() {
  const items = getCharacterLibrary().filter((item) => isSingleChineseChar(item.char));
  const missingMeanings = items.filter((item) => !resolveChineseMeaning(item.char));
  const missingWordExamples = items.filter((item) => resolveChineseWords(item.char).length < 3);
  return {
    total: items.length,
    meaningCount: items.length - missingMeanings.length,
    missingMeaningCount: missingMeanings.length,
    wordsCount: items.length - missingWordExamples.length,
    missingWordsCount: missingWordExamples.length,
    missingMeanings: missingMeanings.map((item) => item.char),
    missingWordExamples: missingWordExamples.map((item) => item.char)
  };
}

function renderLexicalCheck() {
  const panel = $("#lexicalCheckPanel");
  if (!panel) return;
  const coverage = analyzeChineseLexicalCoverage();
  const missingMeaningPreview = coverage.missingMeanings.slice(0, 20).join("、") || "暂无";
  const missingWordsPreview = coverage.missingWordExamples.slice(0, 20).join("、") || "暂无";
  panel.innerHTML = `
    <div class="report-block lexical-check">
      <p>当前字库总数：${coverage.total}</p>
      <p>已有释义：${coverage.meaningCount} · 缺失释义：${coverage.missingMeaningCount}</p>
      <p>已有3个组词：${coverage.wordsCount} · 组词不足3个：${coverage.missingWordsCount}</p>
      <p>缺失释义前20个：${escapeHtml(missingMeaningPreview)}</p>
      <p>组词不足前20个：${escapeHtml(missingWordsPreview)}</p>
    </div>
  `;
}

function restoreLearningPackInput() {
  const input = $("#learningPackInput");
  if (input) input.value = state.lastLearningPackRaw || "";
}

function showLastPractice() {
  const pack = getLatestLearningPack();
  if (!pack) {
    $("#packStatus").textContent = "还没有导入课程 / No previous pack";
    return;
  }
  state.latestLearning = focusFromLearningPack(pack);
  state.focusTitleOverride = pack.title || "";
  saveState();
  const questions = questionsFromLearningPack(pack);
  generatedQuestions = questions;
  renderFocus(state.latestLearning);
  renderReview(questions);
  renderLearningPackSuccess(pack, { added: 0, updated: 0, unchanged: collectLearningPackTargets(pack).length, repeat: true });
  renderCharacters();
  renderDictionary();
  $("#approveBtn").disabled = false;
  $("#regenerateBtn").disabled = false;
  $("#packStatus").textContent = "已显示上次课程 / Last pack loaded";
}

function stripHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.textContent.replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayText(value) {
  return String(value || "").replace(/[。.]$/g, "");
}
