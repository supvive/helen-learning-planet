import fs from "node:fs";
import vm from "node:vm";
import { TextEncoder } from "node:util";

const source = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");
const indexSource = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const stylesSource = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8");
const builtinBundleSource = fs.readFileSync(new URL("./data/learning-packs/builtin-learning-packs.js", import.meta.url), "utf8");
const englishLibraryBundleSource = fs.readFileSync(new URL("./data/english-libraries/hello-school-32-lesson-library.js", import.meta.url), "utf8");
const helloSchoolLibrary = JSON.parse(fs.readFileSync(new URL("./data/english-libraries/hello-school-32-lesson-library.json", import.meta.url), "utf8"));
const pack = JSON.parse(fs.readFileSync(new URL("./examples/learning-pack-v3-three-planets.example.json", import.meta.url), "utf8"));
const day13Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-25-day13.json", import.meta.url), "utf8"));
const day13Rev2Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-25-day13-rev2.json", import.meta.url), "utf8"));
const oldDay14Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-26-day14.json", import.meta.url), "utf8"));
const day14Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-26-day14-revision-e.json", import.meta.url), "utf8"));
const day15Pack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json", import.meta.url), "utf8"));
const revisionAPack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-29-revision-a.json", import.meta.url), "utf8"));
const day14RevisionDPack = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/helen-learning-pack-2026-07-26-day14-revision-d.json", import.meta.url), "utf8"));
const colorPlanetCatalog = JSON.parse(fs.readFileSync(new URL("./data/color-planet/color-planet-daily-five-courses.json", import.meta.url), "utf8"));
const colorCardRegister = JSON.parse(fs.readFileSync(new URL("./data/color-planet/color-card-register-120.json", import.meta.url), "utf8"));
const builtinManifest = JSON.parse(fs.readFileSync(new URL("./data/learning-packs/manifest.json", import.meta.url), "utf8"));
const builtinBundle = (() => {
  const context = {};
  vm.runInNewContext(builtinBundleSource, context);
  return context.HELEN_BUILTIN_LEARNING_PACKS;
})();
const legacyBuiltinManifest = {
  ...builtinManifest,
  latestPackId: day15Pack.packId,
  latest: "./helen-learning-pack-2026-07-27-day15-revision-b.json",
  // This fixture models the pre-diagnostic manifest used by the refresh test.
  // Keep it limited to the pack sources supplied by that test's fetch map so a
  // newly added manifest entry cannot abort the full refresh before older
  // same-pack data is replaced.
  packs: builtinManifest.packs.filter((entry) => [day15Pack.packId, day14Pack.packId, day13Rev2Pack.packId, day13Pack.packId].includes(entry.packId))
};
const legacyBuiltinBundle = {
  ...builtinBundle,
  manifest: legacyBuiltinManifest,
  packs: Object.fromEntries(Object.entries(builtinBundle.packs).filter(([packId]) => packId !== revisionAPack.packId))
};
const englishLibraryBundle = (() => {
  const context = {};
  vm.runInNewContext(englishLibraryBundleSource, context);
  return context.HELEN_ENGLISH_LESSON_LIBRARIES;
})();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(source.includes("data-color-reference-dropzone"), "Reference image uploader should expose a drop zone");
assert(source.includes('document.addEventListener("drop"'), "Reference image uploader should accept dropped files");

function visibleText(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readPngDimensions(url) {
  const bytes = fs.readFileSync(url);
  assert(bytes.subarray(1, 4).toString("ascii") === "PNG", `${url} should be a PNG file`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

function settleAsyncWrites() {
  return new Promise((resolve) => setTimeout(resolve, 5));
}

async function waitForPersistedRecordingChunk(context, course = "chinese") {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await settleAsyncWrites();
    const clips = context.__planetTest.getCourseRecordingClips(course);
    if (clips.some((clip) => Number(clip.chunkCount || 0) > 0)) return clips;
  }
  return context.__planetTest.getCourseRecordingClips(course);
}

function createFakeIndexedDb() {
  const chunks = new Map();
  const db = {
    objectStoreNames: { contains: () => true },
    createObjectStore: () => {},
    transaction: () => {
      const tx = { oncomplete: null, onerror: null, error: null };
      const store = {
        put: (item) => {
          chunks.set(item.chunkId || item.id, item);
          setTimeout(() => tx.oncomplete?.(), 0);
        },
        get: (key) => {
          const request = {};
          setTimeout(() => {
            request.result = chunks.get(key);
            request.onsuccess?.();
          }, 0);
          return request;
        },
        getAll: () => {
          const request = {};
          setTimeout(() => {
            request.result = [...chunks.values()];
            request.onsuccess?.();
          }, 0);
          return request;
        },
        delete: (key) => {
          chunks.delete(key);
          setTimeout(() => tx.oncomplete?.(), 0);
        }
      };
      tx.objectStore = () => store;
      return tx;
    },
    close: () => {}
  };
  return {
    chunks,
    api: {
      open: () => {
        const request = {};
        setTimeout(() => {
          request.result = db;
          request.onsuccess?.();
        }, 0);
        return request;
      }
    }
  };
}

function makeContext(seed = {}, clock = { now: Date.now() }, options = {}) {
  const store = { ...seed };
  const BrowserURL = class extends URL {};
  BrowserURL.createObjectURL = () => "blob:test";
  BrowserURL.revokeObjectURL = () => {};
  const eventHandlers = {};
  let micRequests = 0;
  let resolveDeferredMic = null;
  let rejectDeferredMic = null;
  const appendedNodes = [];
  const fakeBody = {
    appendChild: (node) => {
      appendedNodes.push(node);
      node.remove = () => {
        const index = appendedNodes.indexOf(node);
        if (index >= 0) appendedNodes.splice(index, 1);
      };
      return node;
    }
  };
  const fakeDb = createFakeIndexedDb();
  class FakeMediaRecorder {
    static isTypeSupported() { return true; }
    constructor(stream, config = {}) {
      this.stream = stream;
      this.mimeType = config.mimeType || "audio/webm";
      this.state = "inactive";
      this.ondataavailable = null;
      this.onstop = null;
      this.onerror = null;
    }
    start() {
      this.state = "recording";
      this.requestData();
    }
    requestData() {
      this.ondataavailable?.({ data: new Blob([`chunk-${Date.now()}`], { type: this.mimeType }) });
    }
    pause() { this.state = "paused"; }
    resume() {
      this.state = "recording";
      this.requestData();
    }
    stop() {
      this.requestData();
      this.state = "inactive";
      this.onstop?.();
    }
  }
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [clock.now]));
    }
    static now() { return clock.now; }
    static parse(value) { return RealDate.parse(value); }
    static UTC(...args) { return RealDate.UTC(...args); }
  }
  const makeStream = () => ({ getTracks: () => [{ stop: () => {}, onended: null }] });
  const defaultLocation = { protocol: "http:", hash: "", pathname: "/", href: "http://localhost/#daily", origin: "http://localhost" };
  const locationValue = { ...defaultLocation, ...(options.location || {}) };
  const viewIds = [
    "daily",
    "chinese-planet",
    "english-planet",
    "art-planet",
    "today-chinese",
    "today-english",
    "today-art",
    "parent",
    "characters",
    "wordbook",
    "dictionary",
    "english",
    "english-blocks",
    "learning-records",
    "color-work-choice",
    "color-foundation",
    "color-gallery",
    "color-materials"
  ];
  const elementMap = new Map();
  const makeClassList = (initial = "") => {
    const classes = new Set(String(initial).split(/\s+/).filter(Boolean));
    return {
      add: (...items) => items.forEach((item) => classes.add(item)),
      remove: (...items) => items.forEach((item) => classes.delete(item)),
      contains: (item) => classes.has(item),
      toggle: (item, force) => {
        const shouldAdd = force === undefined ? !classes.has(item) : Boolean(force);
        if (shouldAdd) classes.add(item);
        else classes.delete(item);
        return shouldAdd;
      },
      toString: () => [...classes].join(" ")
    };
  };
  const makeElement = (id, className = "") => {
    const node = {
      id,
      className,
      dataset: {},
      innerHTML: "",
      textContent: "",
      hidden: false,
      style: {},
      classList: makeClassList(className),
      addEventListener: () => {},
      removeAttribute: (name) => { delete node[name]; },
      setAttribute: (name, value) => { node[name] = String(value); },
      querySelector: () => null,
      querySelectorAll: () => [],
      scrollIntoView: () => {},
      remove: () => {}
    };
    elementMap.set(`#${id}`, node);
    return node;
  };
  const routeView = (locationValue.hash || "").replace(/^#/, "").split("?")[0] || "daily";
  const viewElements = viewIds.map((id) => makeElement(id, `view${id === routeView ? " active" : ""}`));
  [
    "chineseLessonHeader",
    "chineseLessonSections",
    "englishLessonHeader",
    "englishListeningZone",
    "englishLessonSteps",
    "artLessonHeader",
    "artLessonSections",
    "planetOverview",
    "chinesePlanetSummary",
    "englishPlanetSummary",
    "artPlanetSummary",
    "englishLearningRecords",
    "colorWorkChoiceContent",
    "colorFoundationContent",
    "colorGalleryContent",
    "colorMaterialsContent",
    "legacyHomePanels",
    "todayDashboardPanel",
    "todayDashboardTitle",
    "todayDashboardSummary",
    "packPreviewPanel",
    "packSuccessPanel",
    "focusPanel",
    "reviewPanel",
    "practiceRunner"
  ].forEach((id) => makeElement(id));
  const navLinks = viewIds.map((id) => ({ dataset: { view: id }, classList: makeClassList(id === routeView ? "active" : ""), addEventListener: () => {} }));
  const setLocationHash = (url) => {
    const raw = String(url || "");
    const nextHash = raw.startsWith("#") ? raw : new URL(raw, locationValue.href || "http://localhost/").hash;
    locationValue.hash = nextHash;
    const base = `${locationValue.protocol || "http:"}//${locationValue.origin && locationValue.origin !== "null" ? locationValue.origin.replace(/^[a-z]+:\/\//, "") : "localhost"}${locationValue.pathname || "/"}`;
    locationValue.href = `${base}${nextHash}`;
  };
  const context = {
    console,
    TextEncoder,
    Date: FakeDate,
    Blob,
    MediaRecorder: FakeMediaRecorder,
    navigator: {
      mediaDevices: {
        getUserMedia: async () => {
          micRequests += 1;
          if (options.rejectMic) {
            const error = new Error("denied");
            error.name = "NotAllowedError";
            throw error;
          }
          if (options.deferMic) {
            return new Promise((resolve, reject) => {
              resolveDeferredMic = () => resolve(makeStream());
              rejectDeferredMic = (error = new Error("denied")) => {
                error.name ||= "NotAllowedError";
                reject(error);
              };
            });
          }
          return makeStream();
        }
      }
    },
    indexedDB: fakeDb.api,
    fetch: options.fetchMap ? async (url) => {
      const raw = String(url || "");
      const parsedUrl = new URL(raw, "http://localhost/");
      const normalizedPath = parsedUrl.pathname.replace(/^\//, "");
      const candidates = [
        raw,
        raw.replace(/\?.*$/, ""),
        parsedUrl.pathname,
        normalizedPath,
        `./${normalizedPath}`,
        `./${normalizedPath.split("/").pop()}`
      ];
      const value = candidates.map((key) => options.fetchMap[key]).find((item) => item !== undefined);
      if (value === undefined) {
        if (options.failMissingFetch) return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
        throw new Error(`missing fake fetch: ${raw}`);
      }
      if (value instanceof Error) throw value;
      const body = typeof value === "string" ? value : JSON.stringify(value);
      const status = typeof value === "object" && value?.status ? value.status : 200;
      return {
        ok: status >= 200 && status < 300,
        status,
        text: async () => body,
        json: async () => JSON.parse(body)
      };
    } : undefined,
    URL: BrowserURL,
    URLSearchParams,
    Audio: function Audio() { this.play = async () => {}; },
    confirm: () => !options.cancelConfirm,
    setTimeout: (fn, ms = 0) => {
      if (ms <= 10) queueMicrotask(fn);
      return 1;
    },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    HELEN_BUILTIN_LEARNING_PACKS: options.builtinBundle || undefined,
    HELEN_ENGLISH_LESSON_LIBRARIES: options.englishLibraryBundle || undefined,
    window: { matchMedia: () => ({ matches: false }), addEventListener: () => {}, location: locationValue, indexedDB: fakeDb.api, HELEN_BUILTIN_LEARNING_PACKS: options.builtinBundle || undefined, HELEN_ENGLISH_LESSON_LIBRARIES: options.englishLibraryBundle || undefined },
    location: locationValue,
    history: {
      pushState: (_state, _title, url) => setLocationHash(url),
      replaceState: (_state, _title, url) => setLocationHash(url)
    },
    document: {
      body: fakeBody,
      addEventListener: (type, handler) => {
        eventHandlers[type] ||= [];
        eventHandlers[type].push(handler);
      },
      createElement: (tagName) => ({ tagName, className: "", dataset: {}, innerHTML: "", hidden: false, querySelector: () => null, remove: () => {} }),
      querySelector: (selector) => {
        if (selector === "[data-art-lightbox]") return appendedNodes.at(-1) || null;
        if (selector === ".view.active") return viewElements.find((node) => node.classList.contains("active")) || null;
        return elementMap.get(selector) || null;
      },
      querySelectorAll: (selector) => {
        if (selector === ".view") return viewElements;
        if (selector === ".nav a") return navLinks;
        if (selector === "[data-route-back]") return [];
        return [];
      }
    },
    localStorage: {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; }
    },
    speechSynthesis: { cancel: () => {}, speak: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) { this.text = text; }
  };
  vm.runInNewContext(`${source}
globalThis.__planetTest = {
  parseLearningPackInput,
  buildLearningPackPreview,
  importLearningPack,
  loadBuiltinLearningPack,
  loadEnglishLessonLibrary,
  loadColorPlanetData,
  importEnglishLessonLibrary,
  importColorPlanetData,
  getColorPlanetDataStatus,
  renderColorLoadingSkeleton,
  renderColorCourseLoadingSkeleton,
  normalizeColorPlanetCatalog,
  normalizeColorCardRegister,
  normalizeEnglishLessonLibrary,
  getEnglishLessonLibrary,
  getSelectedEnglishLibraryLesson,
  getActiveEnglishPack,
  isAdaptiveEnglishPack,
  getActivePackForCourse,
  getActiveProgressForCourse,
  getEnglishLessonPackId,
  buildEnglishWordLibrary,
  getDynamicEnglishWordsFromPacks,
  getEnglishSourceLabel,
  selectEnglishLibraryLesson,
  selectRelativeEnglishLesson,
  openEnglishHistoryLibrary,
  openEnglishAdaptiveHome,
  buildEnglishLessonLibraryFeedback,
  initializeCourseProgress,
  getCourseProgress,
  getSelectedLearningPack,
  bindNavigation,
  showView,
  getActiveView,
  normalizeStudentRoute,
  getDomViewId,
  getVisibleRouteForView,
  getParentView,
  getRouteBackTarget,
  updateBrowserRoute,
  parseRouteHash,
  applyRouteDateSelection,
  buildFeedbackPackage,
  countPendingActivities,
  getLearningPackDates,
  getPackIdForDate,
  getPackArchiveEntriesForDate,
  selectLearningPackDate,
  getLearningCourseSequence,
  selectLearningCoursePack,
  selectRelativeLearningCourse,
  renderCourseSequenceSwitcher,
  getStudentCourseTitle,
  shouldAutoSelectBuiltinRevision,
  renderPlanetOverview,
  buildPlanetCard,
  getPlanetHomeState,
  getColorPlanetHomeState,
  navigateToView,
  selectLatestAdaptiveEnglishCourseForPrimaryCourse,
  ensureAdaptiveEnglishPrimaryCourse,
  keepLegacyHomePanelsHidden,
  renderPlanetPages,
  renderPlanetModules,
  getEnglishLearningRecordsSummary,
  renderEnglishLearningRecords,
  getColorGalleryEntries,
  renderColorWorkChoice,
  renderColorFoundation,
  renderColorGallery,
  renderColorMaterials,
  renderArtLesson,
  resolveColorBoardCell,
  resolveColorImageAsset,
  renderColorImageFrame,
  handleColorBoardProbeLoad,
  handleColorBoardProbeError,
  getColorCourses,
  getColorCourseById,
  getColorCourseProgress,
  getColorCourseCardStatus,
  getInProgressColorCourse,
  getActiveColorCourse,
  buildColorCoursePack,
  calculateA4PaperPlan,
  buildGeneratedColorSteps,
  buildGeneratedColorCourse,
  getGeneratedArtProgress,
  selectGeneratedColorPalette,
  renderGeneratedPaletteChoices,
  renderGeneratedPaletteSummary,
  renderGeneratedReferenceFigure,
  renderGeneratedColorCourseLesson,
  renderGeneratedOverlayPrimitive,
  renderColorReferenceUpload,
  formatColorReferenceError,
  setColorReferenceSetting,
  selectColorCourse,
  reselectColorCourse,
  startColorCourse,
  setColorCourseStep,
  scrollCurrentColorStepIntoView,
  completeColorCourseStep,
  completeColorCourse,
  toggleColorFoundation,
  completeColorFoundationStep,
  setColorMaterialSearch,
  renderColorChoiceLesson,
  getPlanetStatus,
  getFullCourseReadiness,
  getChineseLessonSections,
  getEnglishLessonSteps,
  getArtLessonSteps,
  renderChineseSection,
  renderChineseLesson,
  renderAnnotatableChineseText,
  renderBreakCard,
  startBreak,
  endBreak,
  getSessionEvents,
  getBreakEvents,
  renderCourseResultControls,
  getChineseMarkedTerms,
  toggleReadingCharacter,
  getReadingAnnotationSection,
  countCompletedChineseSections,
  areChineseSectionsComplete,
  renderCourseQuestion,
  renderCourseItemControls,
  renderCourseStartSettings,
  renderCourseToolbarControls,
  getCourseToolbarModel,
  getCourseTimerState,
  renderBuiltinPackLoadNotice,
  familyFacingPackTitle,
  renderArtStep,
  renderArtImageFrame,
  formatArtToolProfile,
  getArtPaletteRows,
  renderArtPaletteRows,
  renderEnglishStep,
  renderEnglishLesson,
  renderAdaptiveEnglishShellUnavailable,
  renderAdaptiveEnglishActivity,
  renderAdaptiveHints,
  revealAdaptiveEnglishHint,
  setAdaptiveEnglishActivity,
  selectAdaptiveEnglishOption,
  updateAdaptiveWritingAnswer,
  renderEnglishLessonSwitcher,
  renderListeningZone,
  renderChineseSectionBody,
  resolveArtImageAsset,
  getArtStepLock,
  isCourseItemLocked,
  getCourseBlockPool,
  handleArtImageLoad,
  handleArtImageError,
  retryArtImage,
  openArtImageLightbox,
  closeArtImageLightbox,
  renderPromptRow,
  renderReadAloudButton,
  normalizeReadAloudConfig,
  selectCourseChoice,
  toggleChineseOralConcept,
  confirmChineseObjectiveSection,
  getChineseQuestionOptionOrder,
  choiceLetter,
  shouldShowCourseFloatingTimer,
  startCourseSession,
  completeEnglishAppStage,
  startCourseRecording,
  handleCourseRecordingAction,
  completeCourseItem,
  resetCourseSession,
  saveCourseRecording,
  deleteCourseRecording,
  buildCourseRecordingBlob,
  getCourseRecordingUiState,
  getCourseRecordingClips,
  getRecordingMaxSeconds,
  interruptActiveRecording,
  pauseCourse,
  pauseAllRunningCourseTimers,
  persistCourseTimerHeartbeat,
  getCourseElapsed,
  formatElapsed,
  recordReadAloudUse,
  safeFilePart,
  recordingExtension,
  summarizeRecordings,
  summarizeReadingAnnotations,
  saveState,
  APP_METADATA,
  PLANET_REGISTRY,
  state
};`, context);
  context.__store = store;
  context.__elements = elementMap;
  context.__dispatchDocumentEvent = (type, event) => {
    for (const handler of eventHandlers[type] || []) handler(event);
  };
  context.__micRequests = () => micRequests;
  context.__resolveMic = () => resolveDeferredMic?.();
  context.__rejectMic = () => rejectDeferredMic?.();
  context.__fakeChunks = fakeDb.chunks;
  context.__appendedNodes = appendedNodes;
  return context;
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const sections = context.__planetTest.getChineseLessonSections(parsed);
  const byId = (id) => sections.find((section) => section.id === id);
  const rendered = Object.fromEntries(sections.filter((section) => section.type !== "break").map((section, index) => [section.id, context.__planetTest.renderChineseSection(parsed, section, index, progress)]));
  assert(rendered.reading.includes("data-reading-char="), "Short reading text should keep full three-state character annotation");
  ["review_words", "fill_blanks", "word_accumulation", "comprehension", "four_grid_retell", "school_scenario", "post_check"].forEach((sectionId) => {
    assert(!rendered[sectionId].includes("data-reading-char="), `${sectionId} fixed/dynamic copy should stay plain without explicit markedTerms`);
  });
  assert(rendered.review_words.includes("<h3>词语复习</h3>"), "Fixed Chinese section headings must remain plain, non-annotatable UI text");
  assert(!/<h3>[^<]*data-reading-char/.test(rendered.review_words), "Fixed section headings must not receive character controls");

  const choiceHtml = context.__planetTest.renderCourseQuestion(byId("fill_blanks").questions[0], "fill_blanks_0", progress.chinese.sections["chinese:fill_blanks"], 0);
  assert(/<div class="course-choice-button [^"]*"><button class="choice-letter" data-course-choice=/.test(choiceHtml), "Only the A/B/C letter control should select an answer");
  assert(!choiceHtml.includes("data-reading-char="), "Choice text should stay plain unless the pack declares markedTerms");
  assert(!/<div class="course-choice-button [^>]*data-course-choice=/.test(choiceHtml), "Clicking option text must not select the answer row");

  const beforeFound = Number(context.__planetTest.state.learnerChars.标?.foundCount || 0);
  const marker = { dataset: { readingChar: "标", readingSection: "post_check", readingSource: "term_0", readingIndex: "0" } };
  context.__planetTest.toggleReadingCharacter(marker);
  let annotation = context.__planetTest.getReadingAnnotationSection(progress, "post_check");
  assert(annotation.characters.标.status === "unknown", "First character click should mark unknown/red");
  const afterFirstFound = context.__planetTest.state.learnerChars.标.foundCount;
  assert(afterFirstFound === beforeFound + 1, "First current-course mark should add one evidence record");
  context.__planetTest.toggleReadingCharacter(marker);
  annotation = context.__planetTest.getReadingAnnotationSection(progress, "post_check");
  assert(annotation.characters.标.status === "unsure", "Second character click should mark unsure/yellow");
  assert(context.__planetTest.state.learnerChars.标.foundCount === afterFirstFound, "Changing unknown to unsure must update rather than duplicate evidence");
  let summary = context.__planetTest.summarizeReadingAnnotations(progress.chinese.readingAnnotations);
  assert(summary.unsureCharacters.includes("标") && !summary.unknownCharacters.includes("标"), "Feedback summary should expose the current status only");
  context.__planetTest.saveState();
  const restored = makeContext(context.__store);
  assert(restored.__planetTest.getCourseProgress(parsed.packId).chinese.readingAnnotations.post_check.characters.标.status === "unsure", "Character annotation should survive refresh");
  context.__planetTest.toggleReadingCharacter(marker);
  annotation = context.__planetTest.getReadingAnnotationSection(progress, "post_check");
  assert(!annotation.characters.标, "Third character click should cancel the current-course annotation");
  assert(context.__planetTest.state.learnerChars.标.foundCount === beforeFound, "Cancelling should remove only the current-course evidence count");
  summary = context.__planetTest.summarizeReadingAnnotations(progress.chinese.readingAnnotations);
  assert(!summary.unsureCharacters.includes("标") && !summary.unknownCharacters.includes("标"), "Cancelled annotation must disappear from the feedback package");
}

{
  const clock = { now: Date.parse("2026-07-27T10:00:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const side = progress.chinese;
  side.isRunning = true;
  side.runningSince = clock.now - 4000;
  side.timerStartedAt = new Date(clock.now - 4000).toISOString();
  side.lastHeartbeatAt = clock.now;
  const started = context.__planetTest.startBreak("chinese:fixed_break", 1);
  assert(started, "Rest should start as an explicit session event");
  const restItem = side.sections["chinese:fixed_break"];
  assert(restItem.breakEventId && !restItem.finishedAt && !restItem.result, "Rest must not write a course completion result");
  assert(!side.isRunning && side.runningSince === null, "Starting rest should freeze the course timer");
  const restEvent = context.__planetTest.getBreakEvents(progress)[0];
  assert(restEvent && restEvent.type === "break" && restEvent.resumeCourseOnEnd, "Rest event should remember whether the course was running");
  clock.now += 70000;
  assert(!restEvent.endedAt, "A countdown reaching zero must not end rest automatically");
  await context.__planetTest.endBreak("chinese:fixed_break");
  assert(restEvent.endedAt && restEvent.reason === "manual" && restEvent.autoEnded === false, "Only the manual end action should close rest");
  assert(side.isRunning === true, "Ending rest should resume a previously running course timer");
  const feedback = context.__planetTest.buildFeedbackPackage("chinese").payload;
  assert(feedback.completionRatio === 0 && feedback.pendingActivityIds.every((id) => id !== "fixed_break"), "Rest must not occupy a learning activity slot");
  assert(feedback.shared.breakSeconds >= 70, "Feedback should report elapsed rest time separately");
}

{
  const context = makeContext();
  const markedQuestion = {
    prompt: "联系上下文说说加点词的意思：她轻轻推了水杯。",
    markedTerms: ["轻轻"],
    answerMode: "spoken",
    referenceAnswer: "动作很轻。"
  };
  const html = context.__planetTest.renderCourseQuestion(markedQuestion, "comprehension_0", {}, 0, markedQuestion.markedTerms);
  assert((html.match(/data-reading-marked="true"/g) || []).length === 2, "Declared markedTerms should render inline marked-word controls");
  assert(html.includes("is-marked-term") && html.includes("加点词"), "Marked terms should expose a visual and accessible cue");
  const plain = context.__planetTest.renderAnnotatableChineseText("固定标题", "section", "title");
  assert(!plain.includes("data-reading-char="), "Without markedTerms fixed text must remain ordinary text");
}

{
  const context = makeContext();
  const older = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(older, context.__planetTest.buildLearningPackPreview(older), { select: true, markLatest: true });
  const olderProgress = context.__planetTest.initializeCourseProgress(older);
  const olderKey = Object.keys(olderProgress.chinese.sections)[0];
  olderProgress.chinese.sections[olderKey] = { startedAt: "2026-07-26T08:00:00.000Z" };
  const latest = context.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  context.__planetTest.importLearningPack(latest, context.__planetTest.buildLearningPackPreview(latest), { select: true, markLatest: true });
  context.__planetTest.initializeCourseProgress(latest);
  const home = context.__planetTest.getPlanetHomeState("chinese");
  assert(home.title === context.__planetTest.getStudentCourseTitle(latest, "chinese"), "Chinese home must prioritize the latest imported course over an older unfinished course");
  assert(context.__planetTest.getLearningCourseSequence("chinese").some((entry) => entry.packId === older.packId), "Older unfinished Chinese courses must remain in course history");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  context.__planetTest.initializeCourseProgress(parsed);
  const readiness = context.__planetTest.getFullCourseReadiness(parsed);
  assert(readiness.ready, `Three-planet pack should be full-course ready: ${readiness.missing.join(",")}`);
  assert(context.__planetTest.PLANET_REGISTRY.filter((item) => item.enabled).map((item) => item.id).join(",") === "chinese,english,art", "Only three current planets should be enabled");
  assert(context.__planetTest.PLANET_REGISTRY.map((item) => item.nameZh).join(",") === "中文星球,字母星球,颜色星球", "Planet display names should use the new naming");
  assert(indexSource.includes('id="planetOverview"'), "Student home should render the three planet cards directly");
  assert(indexSource.includes('href="#chinese-planet" data-view="chinese-planet">中文星球'), "Top Chinese Planet navigation should open the first-level menu");
  assert(context.__planetTest.PLANET_REGISTRY.find((item) => item.id === "chinese")?.route === "chinese-planet", "Home Chinese planet card should open the first-level menu");
  assert(!indexSource.includes('data-course-session-reset="chinese-planet"'), "Start exploration must not be wired to course reset");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "home_test" });

  const initialChinese = context.__planetTest.getPlanetHomeState("chinese");
  const initialEnglish = context.__planetTest.getPlanetHomeState("english");
  const initialArt = context.__planetTest.getPlanetHomeState("art");
  assert(initialChinese.status === "下一课" && !initialChinese.showProgress, "Unstarted Chinese should be the independent next course without 0/N");
  assert(initialEnglish.status === "待导入日课" && initialEnglish.title === "今日英语任务" && initialEnglish.route === "letter-course" && !initialEnglish.showProgress, "A clean browser should show the adaptive English shell instead of Story 3 Lesson 26");
  assert(initialArt.status === "参考图课程" && initialArt.route === "color-work-choice" && !initialArt.showProgress, "Color home should open the reference-image workspace instead of a static catalog course");

  // A browser that retained the withdrawn static Color selection must still
  // route the primary entry to the reference workspace.
  context.__planetTest.state.colorPlanet = {
    selectedCourseId: "color-choice-001-squatting-puppy",
    activeCourseId: "color-choice-001-squatting-puppy",
    generatedCourses: [],
    courseUi: {},
    foundationProgress: {}
  };
  assert(context.__planetTest.getPlanetHomeState("art").route === "color-work-choice", "Stale static Color selection must not change the home route");
  context.__planetTest.showView("color-course", false);
  assert(context.__elements.get("#colorWorkChoiceContent").innerHTML.includes("拖入图片或点击选择"), "Direct #color-course deep link should land on the reference uploader");
  context.__planetTest.navigateToView("color-course");
  assert(context.__planetTest.state.colorPlanet?.selectedCourseId === "color-choice-001-squatting-puppy", "Stale Color selection may remain in local history");
  assert(context.__elements.get("#colorWorkChoiceContent").innerHTML.includes("拖入图片或点击选择"), "Legacy Color route should land on the reference uploader");

  // A clean browser (or one pinned to old Story 3) must show the approved
  // adaptive shell, not silently reopen Lesson 26.
  context.__planetTest.state.englishCourseSource = "library";
  context.__planetTest.showView("letter-course", false);
  assert(context.__planetTest.state.englishCourseSource === "adaptive_shell", "Direct #letter-course deep link should migrate stale library state to the adaptive shell");
  const directShellHtml = `${context.__elements.get("#englishLessonHeader").innerHTML}${context.__elements.get("#englishLessonSteps").innerHTML}`;
  assert(directShellHtml.includes("今日英语任务") && directShellHtml.includes("今日任务尚未导入") && !directShellHtml.includes("Our teacher says"), "Direct English deep link must not expose the historical anchor");
  context.__planetTest.state.englishCourseSource = "library";
  context.__planetTest.navigateToView("letter-course");
  assert(context.__planetTest.state.englishCourseSource === "adaptive_shell", "Primary English entry should migrate stale library state to the adaptive shell");
  const shellHtml = `${context.__elements.get("#englishLessonHeader").innerHTML}${context.__elements.get("#englishLessonSteps").innerHTML}`;
  assert(shellHtml.includes("今日英语任务") && shellHtml.includes("今日任务尚未导入") && !shellHtml.includes("Our teacher says"), "Adaptive shell must not expose the historical anchor as today's task");
  assert(context.__planetTest.openEnglishHistoryLibrary(), "Historical Story 3 library must remain explicitly reachable");

  const firstChineseKey = Object.keys(progress.chinese.sections)[0];
  progress.chinese.sections[firstChineseKey] = {
    ...progress.chinese.sections[firstChineseKey],
    startedAt: "2026-07-26T08:00:00.000Z",
    finishedAt: "2026-07-26T08:04:00.000Z"
  };
  const activeChinese = context.__planetTest.getPlanetHomeState("chinese");
  assert(activeChinese.status === "继续课程" && activeChinese.showProgress && activeChinese.progressText === "1/8", "Only an in-progress Chinese course should expose its real learning progress");
  assert(context.__planetTest.getPlanetHomeState("english").status === "待导入日课" && context.__planetTest.getPlanetHomeState("art").status === "参考图课程", "Chinese progress must not change the independent English shell or Color reference entry");

  Object.keys(progress.art.steps).forEach((key) => {
    progress.art.steps[key] = { ...progress.art.steps[key], startedAt: "2026-07-26T09:00:00.000Z", finishedAt: "2026-07-26T09:03:00.000Z" };
  });
  assert(context.__planetTest.getPlanetHomeState("art").status === "参考图课程", "Completing a legacy art course must not restore it as the Color home default");

  context.__planetTest.renderPlanetOverview();
  const homeCards = context.__elements.get("#planetOverview").innerHTML;
  assert((homeCards.match(/<article class="planet-card /g) || []).length === 3, "Student home should render exactly three planet cards");
  ["planet-parent", "家长观察站", "分钟", "共同负荷", "planet-symbols", "Start</span>", "Chinese Planet", "Letter Planet", "Color Planet"].forEach((forbidden) => {
    assert(!homeCards.includes(forbidden), `Student home cards should omit legacy field: ${forbidden}`);
  });
  assert((homeCards.match(/planet-card-progress"/g) || []).length === 1, "Only the one in-progress course should render a progress bar");
  assert(homeCards.includes('data-go-view="chinese-course"') && homeCards.includes('data-go-view="letter-course"') && homeCards.includes('data-go-view="color-work-choice"'), "Home actions should open Chinese, adaptive English, and Color reference routes");

  context.__planetTest.keepLegacyHomePanelsHidden();
  ["legacyHomePanels", "todayDashboardPanel", "packPreviewPanel", "packSuccessPanel", "focusPanel", "reviewPanel", "practiceRunner"].forEach((id) => {
    const node = context.__elements.get(`#${id}`);
    assert(node.hidden && node["aria-hidden"] === "true", `Legacy home node ${id} should remain hidden and outside the accessibility tree`);
  });

  const visibleHomeSource = `${indexSource.slice(0, indexSource.indexOf("<main>"))}${indexSource.slice(indexSource.indexOf('<section id="daily"'), indexSource.indexOf('<section id="chinese-planet"'))}`;
  const studentHomeText = visibleText(visibleHomeSource);
  ["今日", "每日", "Today", "日期", "Day", "2026-", "beta", "Helen 每日学习", "课程已准备", "分钟", "共同负荷"].forEach((forbidden) => {
    assert(!studentHomeText.includes(forbidden), `Visible student home text should omit ${forbidden}`);
  });
  assert(studentHomeText.includes("学习星球") && !studentHomeText.includes("选择一颗星球"), "Student home should keep one self-explanatory heading above the cards");

  const gridCss = stylesSource.match(/\.planet-grid\s*\{[\s\S]*?\}/)?.[0] || "";
  const cardCss = stylesSource.match(/\.planet-card\s*\{[\s\S]*?\}/)?.[0] || "";
  const tabletCss = stylesSource.match(/@media \(min-width: 600px\) and \(max-width: 899px\)\s*\{[\s\S]*?\/ 72px minmax\(0, 1fr\) minmax\(140px, auto\);[\s\S]*?\n\}/)?.[0] || "";
  const phoneCss = stylesSource.match(/@media \(max-width: 599px\)\s*\{[\s\S]*?\.planet-card[\s\S]*?padding\s*:\s*20px[\s\S]*?\n\}/)?.[0] || "";
  assert(/repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(gridCss) && /gap\s*:\s*18px/.test(gridCss), "Desktop home should use three equal columns with an 18px gap");
  assert(/min-height\s*:\s*300px/.test(cardCss) && /padding\s*:\s*28px/.test(cardCss) && /border-radius\s*:\s*24px/.test(cardCss), "Desktop planet cards should follow the approved dimensions");
  assert(/min-height\s*:\s*152px/.test(tabletCss) && /padding\s*:\s*22px/.test(tabletCss), "Tablet planet cards should use the compact horizontal layout");
  assert(/min-height\s*:\s*220px/.test(phoneCss) && /padding\s*:\s*20px/.test(phoneCss), "Phone planet cards should use the approved single-column dimensions");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "planet_menu_test" });
  context.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "test" });
  context.__planetTest.renderPlanetPages();

  const chineseMenu = context.__elements.get("#chinesePlanetSummary").innerHTML;
  const englishMenu = context.__elements.get("#englishPlanetSummary").innerHTML;
  const artMenu = context.__elements.get("#artPlanetSummary").innerHTML;
  const routes = (html) => [...html.matchAll(/data-go-view="([^"]+)"/g)].map((match) => match[1]);
  assert(routes(chineseMenu).join(",") === "chinese-course,characters,wordbook,dictionary", "Chinese Planet should expose the four fixed routes");
  assert(routes(englishMenu).join(",") === "letter-course,word-recognition,english-blocks,learning-records", "Letter Planet should expose four independent routes");
  assert(routes(artMenu).join(",") === "color-work-choice,color-foundation,color-gallery,color-materials", "Color Planet should expose four distinct routes");
  assert(visibleText(artMenu).includes("参考图课程") && !visibleText(artMenu).includes("选择作品"), "Color Planet should lead with the reference-image course flow");
  assert(new Set(routes(artMenu)).size === 4, "Color Planet entries must not reuse the same destination");
  assert(!routes(englishMenu).includes("parent") && context.__planetTest.getParentView("learning-records") === "english-planet", "Learning records must be a student page under Letter Planet, not Parent Observatory");

  [chineseMenu, englishMenu, artMenu].forEach((menuHtml) => {
    assert((menuHtml.match(/<a class="surface planet-module-card"/g) || []).length === 4, "Each first-level menu should use four full-card links");
    ["<button", "<p", "进入", "Open", "date-switcher", "english-lesson-switcher", "按课程顺序", "用途"].forEach((forbidden) => {
      assert(!menuHtml.includes(forbidden), `First-level menu should omit buttons, descriptions, and course switchers: ${forbidden}`);
    });
    assert((menuHtml.match(/planet-module-arrow/g) || []).length === 4, "Each menu card should show one right arrow");
  });

  const routeDomPairs = {
    "chinese-course": "today-chinese",
    characters: "characters",
    wordbook: "wordbook",
    dictionary: "dictionary",
    "letter-course": "today-english",
    "word-recognition": "english",
    "english-blocks": "english-blocks",
    "learning-records": "learning-records",
    "color-work-choice": "color-work-choice",
    "color-foundation": "color-foundation",
    "color-gallery": "color-gallery",
    "color-materials": "color-materials"
  };
  Object.entries(routeDomPairs).forEach(([route, domId]) => {
    assert(context.__planetTest.getDomViewId(route) === domId, `${route} should resolve to its intended page`);
  });
  assert(context.__planetTest.normalizeStudentRoute("english") === "word-recognition", "Legacy #english should redirect to the student word-recognition route");
  assert(context.__planetTest.normalizeStudentRoute("today-art") === "color-course", "Legacy color course route should remain compatible");
  assert(context.__planetTest.getRouteBackTarget({ dataset: { routeBack: "color-work-choice" } }, "today-art") === "color-work-choice", "Color course hierarchy arrow should return directly to Work choice");
  assert(context.__planetTest.getRouteBackTarget({ dataset: { routeBack: "" } }, "today-art") === "art-planet", "Other hierarchy arrows should retain the normal parent route");
  ["characters", "wordbook", "dictionary", "today-chinese"].forEach((view) => assert(context.__planetTest.getParentView(view) === "chinese-planet", `${view} should return to Chinese Planet`));
  ["english", "english-blocks", "learning-records", "today-english"].forEach((view) => assert(context.__planetTest.getParentView(view) === "english-planet", `${view} should return to Letter Planet`));
  ["color-work-choice", "color-foundation", "color-gallery", "color-materials", "today-art"].forEach((view) => assert(context.__planetTest.getParentView(view) === "art-planet", `${view} should return to Color Planet`));

  const englishPack = context.__planetTest.getActiveEnglishPack();
  const englishProgress = context.__planetTest.getCourseProgress(englishPack.packId);
  const firstEnglishKey = Object.keys(englishProgress.english.steps)[0];
  englishProgress.english.steps[firstEnglishKey] = { startedAt: "2026-07-26T08:00:00.000Z", finishedAt: "2026-07-26T08:02:00.000Z" };
  context.__planetTest.renderEnglishLearningRecords();
  const recordsHtml = context.__elements.get("#englishLearningRecords").innerHTML;
  assert(recordsHtml.includes("进行中") && recordsHtml.includes("全部课程") && recordsHtml.includes("Our teacher says"), "Independent learning-records page should render real English library progress and current course");

  context.__planetTest.renderColorWorkChoice();
  context.__planetTest.renderColorFoundation();
  context.__planetTest.renderColorGallery();
  context.__planetTest.renderColorMaterials();
  const workChoiceHtml = context.__elements.get("#colorWorkChoiceContent").innerHTML;
  const foundationHtml = context.__elements.get("#colorFoundationContent").innerHTML;
  const galleryHtml = context.__elements.get("#colorGalleryContent").innerHTML;
  const materialsHtml = context.__elements.get("#colorMaterialsContent").innerHTML;
  const registerStart = materialsHtml.indexOf('<div class="color-register-grid">');
  const registerHtml = materialsHtml.slice(registerStart, materialsHtml.indexOf("</section>", registerStart));
  assert(workChoiceHtml.includes("拖入图片或点击选择") && !workChoiceHtml.includes("课程库"), "Reference-course page should expose only the image upload flow when no generated course exists");
  ["蹲蹲小狗", "野餐小兔", "阅读小猫", "浇花小熊", "风筝小鸭"].forEach((title) => {
    assert(!workChoiceHtml.includes(title), `Legacy static course ${title} should stay out of the primary page`);
  });
  const generatedCourse = context.__planetTest.buildGeneratedColorCourse({
    imageHash: "a".repeat(64),
    titleZh: "自选花园",
    aspectRatio: 2 / 3,
    objects: [],
    paletteTargets: [],
    lightingDirectionZh: "左上方"
  }, { width: 1000, height: 1500, mimeType: "image/jpeg" });
  const storedState = JSON.parse(context.__store["hanzi-memory-app-v1"]);
  storedState.colorPlanet.generatedCourses = [generatedCourse];
  const generatedContext = makeContext({ "hanzi-memory-app-v1": JSON.stringify(storedState) });
  generatedContext.__planetTest.renderColorWorkChoice();
  const generatedChoiceHtml = generatedContext.__elements.get("#colorWorkChoiceContent").innerHTML;
  assert(generatedChoiceHtml.includes("已生成课程") && generatedChoiceHtml.includes("自选花园") && generatedChoiceHtml.includes("开始课程"), "Generated reference courses should appear beneath the uploader");
  assert((foundationHtml.match(/foundation-skill-card/g) || []).length === 6 && (foundationHtml.match(/>练习<\/button>/g) || []).length === 6, "Foundation page should expose six real skill modules");
  const collapsedFoundationToggles = [...foundationHtml.matchAll(/data-color-foundation-toggle="([^"]+)" aria-expanded="false" aria-controls="([^"]+)"[^>]*>练习<\/button>/g)];
  assert(collapsedFoundationToggles.length === 6 && new Set(collapsedFoundationToggles.map((match) => match[2])).size === 6, "Each untouched foundation skill should expose a collapsed Practice control with a unique target");
  collapsedFoundationToggles.forEach((match) => assert(foundationHtml.includes(`id="${match[2]}" hidden`), `Collapsed foundation target ${match[2]} should remain an accessible hidden region`));
  assert(visibleText(galleryHtml) === "还没有作品 创建课程", "Gallery empty state should return to the reference-course creator");
  assert(!galleryHtml.includes("<p") && !galleryHtml.includes("<span"), "Gallery empty state should not add any explanatory copy");
  const galleryEmptyCss = stylesSource.match(/#colorGalleryContent > \.empty-student-page\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(/width:\s*min\(100%,\s*360px\);/.test(galleryEmptyCss) && /grid-column:\s*1\s*\/\s*-1;/.test(galleryEmptyCss), "Gallery empty state should use a compact 360px body while spanning the full grid");
  assert((registerHtml.match(/<div>/g) || []).length === 120, "Materials page should render all 120 registered colors");
  assert(materialsHtml.includes("R754") && materialsHtml.includes("艳红") && materialsHtml.includes("收纳与安全"), "Materials page should use the real color-card register and safety section");
  assert(registerHtml.includes("NG693") && registerHtml.includes("波尔多红"), "Three-column phone layout should retain the longest real code and color name without truncating data");
  assert(!registerHtml.includes("style=") && !registerHtml.includes("color-swatch"), "120-color register should not fabricate color swatches or inline colors");
  const registerGridRules = [...stylesSource.matchAll(/\.color-register-grid\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
  assert(registerGridRules.some((rule) => /repeat\(8,\s*minmax\(0,\s*1fr\)\)/.test(rule)), "120-color register should use 8 columns at 1440px");
  assert(registerGridRules.some((rule) => /repeat\(6,\s*minmax\(0,\s*1fr\)\)/.test(rule)), "120-color register should use 6 columns at 1024/834px");
  assert(registerGridRules.filter((rule) => (rule.match(/minmax\(0,\s*1fr\)/g) || []).length === 3 && !/repeat/.test(rule)).length >= 2, "120-color register should stay at 3 columns through 390/360px");
  assert(!registerGridRules.some((rule) => /repeat\((?:2|4),/.test(rule)), "120-color register should not fall back to sparse 2- or 4-column layouts");
  const registerCardRules = [...stylesSource.matchAll(/\.color-register-grid > div\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
  const registerCardCss = registerCardRules.at(-1) || "";
  assert(/padding:\s*9px;/.test(registerCardCss) && /box-shadow:\s*none;/.test(registerCardCss) && !/rgba\(169,\s*139,\s*234/.test(registerCardCss), "Register cells should use quiet 9px padding without shadows or pseudo-color backgrounds");
  const registerCodeCss = stylesSource.match(/\.color-register-grid strong\s*\{([\s\S]*?)\}/)?.[1] || "";
  const registerNameCss = stylesSource.match(/\.color-register-grid span\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(/font-size:\s*14px;/.test(registerCodeCss) && /font-weight:\s*700;/.test(registerCodeCss) && /overflow-wrap:\s*anywhere;/.test(registerCodeCss), "Register codes should use 14px/700 and wrap safely");
  assert(/font-size:\s*13px;/.test(registerNameCss) && /line-height:\s*1\.35;/.test(registerNameCss) && /overflow-wrap:\s*anywhere;/.test(registerNameCss), "Register color names should use 13px/1.35 and wrap safely");
  const registerSearchCss = stylesSource.match(/\.color-register-search\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(/width:\s*100%;/.test(registerSearchCss) && /max-width:\s*420px;/.test(registerSearchCss), "120-color search should use all available width up to 420px");
  assert(new Set([workChoiceHtml, foundationHtml, galleryHtml, materialsHtml]).size === 4, "The four Color Planet pages should render distinct content");

  ["learning-records", "color-work-choice", "color-foundation", "color-gallery", "color-materials"].forEach((id) => {
    assert(indexSource.includes(`<section id="${id}" class="view">`), `index should contain independent ${id} page`);
  });
  const colorCourseSource = indexSource.slice(indexSource.indexOf('<section id="today-art"'), indexSource.indexOf('<section id="characters"'));
  assert(colorCourseSource.indexOf('data-route-back="color-work-choice"') < colorCourseSource.indexOf('class="surface course-shell"'), "Color course should place its hierarchy arrow before the course shell");
  assert(colorCourseSource.includes('aria-label="返回参考图课程"') && visibleText(colorCourseSource).startsWith("←"), "Color course hierarchy arrow should use the exact accessible label without visible Return copy");
  assert((colorCourseSource.match(/data-route-back=/g) || []).length === 1 && !colorCourseSource.includes("返回</button>"), "Color course should expose one icon-only hierarchy control and no second text navigation row");
  const backHandlerSource = source.slice(source.indexOf('const target = event.target.closest("[data-route-back]")'), source.indexOf('const target = event.target.closest("[data-pack-date]'));
  assert(backHandlerSource.includes("showView(getRouteBackTarget(target, getActiveView()))") && !backHandlerSource.includes("replace"), "Color hierarchy arrow should use normal push navigation so browser Back remains available");
  ["characters", "english", "english-blocks", "wordbook", "dictionary"].forEach((id) => {
    const sectionSource = indexSource.slice(indexSource.indexOf(`<section id="${id}"`), indexSource.indexOf("</section>", indexSource.indexOf(`<section id="${id}"`)));
    assert(sectionSource.includes("data-route-back"), `${id} should include a hierarchy back arrow`);
  });
  assert(indexSource.includes('id="colorFoundationContent" class="student-content-grid foundation-skill-grid"'), "Foundation page should own a dedicated grid class");
  assert(indexSource.includes('id="colorGalleryContent" class="student-content-grid"') && !indexSource.includes('id="colorGalleryContent" class="student-content-grid foundation-skill-grid"'), "Dedicated foundation grid must not affect Gallery or other student grids");

  const moduleGridCss = stylesSource.match(/\.planet-module-grid\s*\{[\s\S]*?\}/)?.[0] || "";
  const tabletMenuCss = stylesSource.match(/@media \(max-width: 899px\)\s*\{[\s\S]*?\.planet-module-grid,[\s\S]*?repeat\(2,\s*minmax\(0,\s*1fr\)\)/)?.[0] || "";
  const phoneMenuCss = stylesSource.match(/@media \(max-width: 599px\)\s*\{[\s\S]*?\.planet-module-grid,[\s\S]*?minmax\(0,\s*1fr\)/)?.[0] || "";
  assert(/repeat\(4,\s*minmax\(0,\s*1fr\)\)/.test(moduleGridCss), "Desktop first-level menu should use four columns");
  assert(tabletMenuCss, "Tablet first-level menu should use a 2x2 grid");
  assert(phoneMenuCss, "Phone first-level menu should use one column");
  assert(stylesSource.includes(".planet-module-card:focus-visible"), "Full-card menu links should have a visible keyboard focus state");
  const foundationGridCss = stylesSource.match(/\.foundation-skill-grid\s*\{([\s\S]*?)\}/)?.[1] || "";
  const foundationTabletCss = stylesSource.slice(stylesSource.indexOf("@media (max-width: 1100px)"), stylesSource.indexOf("@media (max-width: 899px)"));
  const foundationPhoneCss = stylesSource.slice(stylesSource.indexOf("@media (max-width: 599px)"), stylesSource.indexOf("@keyframes gentle-float"));
  assert(/repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(foundationGridCss), "Foundation grid should use 3 columns and 2 rows at desktop width");
  assert(/\.foundation-skill-grid\s*\{[\s\S]*?repeat\(2,\s*minmax\(0,\s*1fr\)\)/.test(foundationTabletCss), "Foundation grid should use 2 columns and 3 rows at 1024/834px");
  assert(/\.foundation-skill-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(foundationPhoneCss), "Foundation grid should use one column at 390/360px");
  assert(/\.foundation-skill-card\.is-expanded\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1;/.test(stylesSource), "Expanded foundation skill should span the full current row");
  assert(/\.foundation-skill-card\s*\{[\s\S]*?height:\s*100%;/.test(stylesSource), "Collapsed foundation cards should stretch equally within each grid row");
}

{
  const normalizedCatalog = makeContext().__planetTest.normalizeColorPlanetCatalog(colorPlanetCatalog);
  const normalizedRegister = makeContext().__planetTest.normalizeColorCardRegister(colorCardRegister);
  const courses = normalizedCatalog.candidateSet.courses;
  const skills = normalizedCatalog.sections.foundationSkills.modules;
  assert(courses.length === 5, "Color Planet should load five candidate courses");
  assert(courses.flatMap((course) => course.steps).length === 70, "Five Color Planet courses should contain 70 authoritative steps");
  assert(skills.length === 6 && skills.every((skill) => skill.microPractice.steps.length === 4), "Foundation library should contain six four-step practices");
  assert(normalizedRegister.colors.length === 120, "Color-card register should contain 120 colors");
  assert(courses.map((course) => course.titleZh).join(",") === "蹲蹲小狗,野餐小兔,阅读小猫,浇花小熊,风筝小鸭", "Five signed-off course titles should remain exact");

  const context = makeContext();
  context.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "test" });
  const expectedBoards = {
    "color-choice-001-squatting-puppy": "./assets/art/color-planet-boards/squatting-puppy-14-step-board-v1.png",
    "color-choice-002-picnic-rabbit": "./assets/art/color-planet-boards/picnic-rabbit-14-step-board-v1.png",
    "color-choice-003-reading-cat": "./assets/art/color-planet-boards/reading-cat-14-step-board-v1.png",
    "color-choice-004-watering-bear": "./assets/art/color-planet-boards/watering-bear-14-step-board-v1.png",
    "color-choice-005-kite-duck": "./assets/art/color-planet-boards/kite-duck-14-step-board-v1.png"
  };
  const mappedStepAssets = courses.flatMap((course) => course.steps.map((step, index) => {
    const asset = context.__planetTest.resolveColorImageAsset({
      kind: "step",
      courseId: course.courseId,
      assetId: step.diagramRequirement.assetId,
      stepId: step.id,
      altZh: `${course.titleZh} ${step.titleZh}`
    });
    assert(asset.courseId === course.courseId && asset.assetId === step.diagramRequirement.assetId && asset.stepId === step.id, `Step ${course.courseId}:${index + 1} should preserve all stable hooks`);
    assert(asset.hasRealImage && asset.usesBoardSprite && asset.boardUrl === expectedBoards[course.courseId], `Step ${course.courseId}:${index + 1} should resolve to its formal board`);
    assert(asset.cellIndex === index && asset.cellColumn === index % 4 && asset.cellRow === Math.floor(index / 4), `Step ${course.courseId}:${index + 1} should use the correct 4x4 cell index`);
    return asset;
  }));
  assert(mappedStepAssets.length === 70 && mappedStepAssets.every((asset) => asset.hasRealImage), "Formal Color teaching image coverage should be 70/70");
  mappedStepAssets.forEach((asset) => {
    const frameHtml = context.__planetTest.renderColorImageFrame(asset);
    assert(frameHtml.includes(`data-color-course-id="${asset.courseId}"`) && frameHtml.includes(`data-color-asset-id="${asset.assetId}"`) && frameHtml.includes(`data-color-step-id="${asset.stepId}"`), `Rendered frame should preserve hooks for ${asset.courseId}:${asset.assetId}`);
    assert(frameHtml.includes('data-has-real-image="true"') && frameHtml.includes(`data-color-cell-index="${asset.cellIndex}"`) && frameHtml.includes('class="color-board-sprite"'), `Rendered frame should expose the formal sprite cell for ${asset.courseId}:${asset.assetId}`);
  });
  Object.values(expectedBoards).forEach((boardUrl) => {
    const fileUrl = new URL(boardUrl, import.meta.url);
    assert(fs.existsSync(fileUrl), `Formal board should exist: ${boardUrl}`);
    const dimensions = readPngDimensions(fileUrl);
    assert(dimensions.width === 1254 && dimensions.height === 1254, `Formal board should remain 1254x1254: ${boardUrl}`);
  });
  const positionSamples = [
    { step: 1, x: 0, y: 0 },
    { step: 4, x: 100, y: 0 },
    { step: 5, x: 0, y: 33.333 },
    { step: 14, x: 33.333, y: 100 }
  ];
  positionSamples.forEach(({ step, x, y }) => {
    const asset = mappedStepAssets[step - 1];
    assert(asset.positionX === x && asset.positionY === y, `Step ${step} should use sprite position ${x}% ${y}%`);
  });
  courses.forEach((course) => {
    const choiceAsset = context.__planetTest.resolveColorImageAsset({
      kind: "choice",
      courseId: course.courseId,
      assetId: `${course.courseId}_choice`,
      altZh: course.titleZh
    });
    const galleryAsset = context.__planetTest.resolveColorImageAsset({
      kind: "gallery",
      courseId: course.courseId,
      assetId: `${course.courseId}_gallery`,
      altZh: course.titleZh
    });
    [choiceAsset, galleryAsset].forEach((asset) => {
      assert(asset.hasRealImage && asset.cellIndex === 0 && asset.positionX === 0 && asset.positionY === 0, `${asset.kind} ${course.courseId} should use the first completed-reference cell rather than step 14`);
    });
  });
  context.__planetTest.renderColorWorkChoice();
  let choiceHtml = context.__elements.get("#colorWorkChoiceContent").innerHTML;
  const choiceText = visibleText(choiceHtml);
  assert(choiceText.includes("拖入图片或点击选择"), "Reference-course page should render the upload action");
  courses.forEach((course) => {
    assert(!choiceText.includes(course.titleZh), `Reference-course page should not render legacy course ${course.titleZh}`);
  });
  ["课程库", "请选择一个题材", "五个题材，同一能力目标", "难度", "分钟", "0/14", "推荐"].forEach((forbidden) => {
    assert(!choiceText.includes(forbidden), `Selection page should omit ${forbidden}`);
  });

  const selectedId = "color-choice-003-reading-cat";
  assert(context.__planetTest.selectColorCourse(selectedId), "A legacy course should remain selectable for stored-history compatibility");
  const restoredSelection = makeContext(context.__store);
  restoredSelection.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "test_reload" });
  assert(restoredSelection.__planetTest.getActiveColorCourse().courseId === selectedId, "Selected course should persist locally across reload");

  assert(context.__planetTest.startColorCourse(selectedId), "Selected course should start");
  assert(!context.__planetTest.selectColorCourse("color-choice-001-squatting-puppy"), "An in-progress course should remain the active course");
  context.__planetTest.renderColorWorkChoice();
  choiceHtml = context.__elements.get("#colorWorkChoiceContent").innerHTML;
  assert(!choiceHtml.includes("进行中") && !choiceHtml.includes("继续课程"), "Legacy static progress should not restore the removed five-choice page");

  context.__planetTest.renderColorChoiceLesson();
  const courseHeaderHtml = context.__elements.get("#artLessonHeader").innerHTML;
  let courseStepHtml = context.__elements.get("#artLessonSections").innerHTML;
  const selectedCourse = context.__planetTest.getColorCourseById(selectedId);
  assert(courseHeaderHtml.includes("<h1>参考图课程</h1>") && courseHeaderHtml.includes("选择参考图"), "Legacy static courses should stay in history data but the primary lesson route should open the reference-image workspace");
  assert(courseStepHtml === "", "Legacy static course selection must not render a primary lesson body");

  const generatedAnalysis = {
    schemaVersion: "helen-color-reference-analysis/1",
    imageHash: "b".repeat(64),
    titleZh: "冰激凌小熊",
    aspectRatio: 2 / 3,
    lightingDirectionZh: "左上方",
    objects: [{ id: "bear", labelZh: "小熊", primitive: "ellipse", bbox: [140, 160, 620, 650], depth: 2 }],
    paletteTargets: [
      { id: "local", roleZh: "主体局部", targetColorZh: "粉紫", targetHex: "#AA66AA", candidates: [{ code: "P01", nameZh: "粉紫" }] },
      { id: "background", roleZh: "背景天空", targetColorZh: "蓝色", targetHex: "#4477AA", candidates: [{ code: "B028", nameZh: "宝蓝" }, { code: "B215", nameZh: "炫目蓝" }] },
      { id: "outline", roleZh: "描边黑色", targetColorZh: "黑色", targetHex: "#20252A", candidates: [{ code: "S", nameZh: "黑色" }] },
      { id: "shadow", roleZh: "局部暗部", targetColorZh: "深灰", targetHex: "#56616B", candidates: [{ code: "G01", nameZh: "深灰" }] }
    ],
    overlays: {
      position: [{ type: "line", x1: 500, y1: 0, x2: 500, y2: 1000 }],
      skeleton: [{ type: "ellipse", cx: 450, cy: 480, rx: 300, ry: 300 }],
      occlusion: [{ type: "line", x1: 300, y1: 540, x2: 700, y2: 540 }],
      lineart: [{ type: "polyline", points: [[140, 500], [300, 150], [760, 500], [700, 820]] }],
      colorRegions: [
        { type: "polygon", points: [[140, 500], [300, 150], [760, 500], [700, 820]], targetId: "local" },
        { type: "rect", x: 0, y: 0, width: 1000, height: 180, targetId: "background" },
        { type: "ellipse", cx: 520, cy: 720, rx: 120, ry: 70, targetId: "shadow" }
      ]
    }
  };
  const generatedCourse = context.__planetTest.buildGeneratedColorCourse(generatedAnalysis, { width: 1080, height: 1440, mimeType: "image/jpeg" });
  assert(generatedCourse.steps.length === 13 && generatedCourse.steps.map((step) => step.titleZh).join("|") === "选画笔|定画面|定位置|形状骨架|前后遮挡|完整草稿|主体平涂|配件与背景|闭合线稿|内部细节|局部暗部/高光|干后修补|讲评", "Generated reference courses should keep the approved 13-step shell");
  assert(generatedCourse.steps[0].referenceVisible && generatedCourse.steps[12].referenceVisible && generatedCourse.steps.slice(1, 12).every((step) => !step.referenceVisible), "Only steps 1 and 13 may expose the source reference image");
  assert(generatedCourse.steps.slice(1, 12).every((step) => step.processBoard === true) && generatedCourse.steps[1].dimensionAnnotations.length <= 4, "Steps 2–12 should use independent process boards and bounded dimension annotations");
  const generatedState = JSON.parse(context.__store["hanzi-memory-app-v1"]);
  generatedState.colorPlanet.generatedCourses = [generatedCourse];
  generatedState.colorPlanet.selectedCourseId = generatedCourse.courseId;
  generatedState.colorPlanet.activeCourseId = generatedCourse.courseId;
  generatedState.colorPlanet.courseUi = { [generatedCourse.courseId]: { currentStepIndex: 0 } };
  const generatedContext = makeContext({ "hanzi-memory-app-v1": JSON.stringify(generatedState) });
  generatedContext.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "generated_reference_test" });
  generatedContext.__planetTest.renderColorChoiceLesson();
  let generatedHtml = generatedContext.__elements.get("#artLessonSections").innerHTML;
  assert(generatedHtml.includes("color-reference-palette") && generatedHtml.includes("P01") && generatedHtml.includes("粉紫") && generatedHtml.includes("屏幕参考") && generatedHtml.includes("负责区域 / 用途"), "Current color cards should show legal code, short name, screen swatch and use");
  const generatedProgress = generatedContext.__planetTest.getGeneratedArtProgress(generatedCourse);
  assert(generatedProgress.art.paletteSelections.local === "P01" && generatedProgress.art.paletteSelections.outline === "S" && generatedProgress.art.paletteSelections.shadow === "G01", "Single-candidate colors should auto-select");
  const generatedCompleteButton = generatedHtml.match(/<button class="button primary"[^>]*data-color-step-complete[^>]*>/)?.[0] || "";
  assert(generatedCompleteButton.includes("disabled") && generatedHtml.includes("还需选择：背景天空"), "Missing current-step colors should keep Complete step disabled and name the missing target");
  assert(generatedContext.__planetTest.selectGeneratedColorPalette(generatedCourse.courseId, "background", "B028"), "Double-candidate color should be selectable");
  generatedHtml = generatedContext.__elements.get("#artLessonSections").innerHTML;
  const selectedGeneratedButton = generatedHtml.match(/<button class="button primary"[^>]*data-color-step-complete[^>]*>/)?.[0] || "";
  assert(!selectedGeneratedButton.includes("disabled") && generatedHtml.includes("✓ 已选"), "Selecting all current colors should enable Complete step and show the selected state");
  generatedContext.__planetTest.setColorCourseStep(generatedCourse.courseId, 1);
  generatedHtml = generatedContext.__elements.get("#artLessonSections").innerHTML;
  assert(generatedHtml.includes("color-process-board") && generatedHtml.includes("11.0 × 16.5 cm") && generatedHtml.includes("color-dimension-card") && !generatedHtml.includes("<img") && !generatedHtml.includes(generatedCourse.referenceImageId), "Step 2 should render a white A4 process board with dimensions and no source image");
  [6, 7, 8, 9, 10].forEach((index) => {
    generatedContext.__planetTest.setColorCourseStep(generatedCourse.courseId, index);
    generatedHtml = generatedContext.__elements.get("#artLessonSections").innerHTML;
    const ids = [...generatedHtml.matchAll(/data-color-palette-target="([^"]+)"/g)].map((match) => match[1]);
    const expected = ["local", "background", "outline", "outline", "shadow"][index - 6];
    assert(new Set(ids).size <= 1 && (!ids.length || ids[0] === expected), `Step ${index + 1} should only expose its current color group`);
    assert(!generatedHtml.includes("<img") && generatedHtml.includes("color-process-board"), `Step ${index + 1} should stay on an independent process board`);
  });
  const generatedReload = makeContext(generatedContext.__store);
  generatedReload.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "generated_reference_reload" });
  assert(generatedReload.__planetTest.getGeneratedArtProgress(generatedCourse).art.paletteSelections.background === "B028", "Color selections should persist across refresh");
  assert(stylesSource.includes(".color-process-board") && stylesSource.includes(".color-reference-work-layout") && stylesSource.includes(".color-reference-candidates button.is-selected"), "Independent board, desktop split and selected color card styles should be present");

  const colorStepRules = [...stylesSource.matchAll(/\.color-step-index\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
  assert(colorStepRules.some((rule) => /grid-template-columns:\s*repeat\(7,\s*minmax\(0,\s*1fr\)\)/.test(rule)), "Color step index should remain a 7x2 grid from 900px upward");
  assert(!colorStepRules.some((rule) => /repeat\((?:2|4),/.test(rule)), "Color step index should never fall back to a multi-row 2- or 4-column grid");
  const mobileStepTrackCss = stylesSource.slice(stylesSource.indexOf("@media (max-width: 899px)"), stylesSource.indexOf("@media (max-width: 760px)"));
  assert(/\.color-step-index\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-wrap:\s*nowrap;[\s\S]*?overflow-x:\s*auto;/.test(mobileStepTrackCss), "At 899px and below the step index should be one horizontal track");
  assert(/\.color-step-index button\s*\{[\s\S]*?height:\s*48px;/.test(stylesSource), "Every Color step index item should be 48px high");
  const colorFrameCss = stylesSource.slice(stylesSource.indexOf(".color-image-frame {"), stylesSource.indexOf(".color-choice-card h2"));
  assert(/aspect-ratio:\s*4\s*\/\s*3;/.test(colorFrameCss) && /border-radius:\s*14px;/.test(colorFrameCss), "All Color image frames should reserve the signed-off 4:3 rounded geometry");
  assert(/\.color-image-frame-step\s*\{[\s\S]*?width:\s*min\(100%,\s*760px\)/.test(colorFrameCss), "Current step frame should cap at 760px and remain full-width when narrower");
  assert(/color-image-frame-choice img,[\s\S]*?object-fit:\s*cover/.test(colorFrameCss) && /color-image-frame-step img\s*\{[\s\S]*?object-fit:\s*contain/.test(colorFrameCss), "Future choice/gallery images should cover while instructional step images should contain");
  assert(/\.color-board-sprite\s*\{[\s\S]*?height:\s*100%;[\s\S]*?aspect-ratio:\s*1\s*\/\s*1;[\s\S]*?justify-self:\s*center;[\s\S]*?background-size:\s*400%\s*400%;/.test(colorFrameCss), "Formal board cells should use a centered equal-height square sprite without stretching the board");
  assert(/\.color-board-probe\s*\{[\s\S]*?width:\s*1px\s*!important;[\s\S]*?height:\s*1px\s*!important;[\s\S]*?opacity:\s*0;/.test(colorFrameCss), "Board load probes should never become visible broken images");
  assert(/\.color-board-fallback\[hidden\],[\s\S]*?display:\s*none;/.test(colorFrameCss), "The neutral SVG fallback should stop displaying whenever a formal board cell is available");
  const formalStepAsset = context.__planetTest.resolveColorImageAsset({
    kind: "step",
    courseId: selectedId,
    assetId: "reading_cat_step01",
    stepId: "observe"
  });
  assert(formalStepAsset.hasRealImage === true && formalStepAsset.url === expectedBoards[selectedId] && formalStepAsset.cellIndex === 0, "A known step hook should resolve to its real board and first cell");
  const resolvedFutureAsset = context.__planetTest.resolveColorImageAsset({
    kind: "step",
    courseId: selectedId,
    assetId: "reading_cat_step01",
    stepId: "observe",
    url: "assets/art/color-planet/reading-cat-step01.webp",
    altZh: "阅读小猫第一步"
  });
  const resolvedFutureFrame = context.__planetTest.renderColorImageFrame(resolvedFutureAsset);
  assert(resolvedFutureAsset.hasRealImage === true && resolvedFutureAsset.url === expectedBoards[selectedId] && resolvedFutureFrame.includes('data-has-real-image="true"') && resolvedFutureFrame.includes('class="color-board-sprite"'), "The authoritative board mapping should take precedence without changing the stable frame structure");
  const frameClasses = new Set(["color-image-frame", "has-real-image"]);
  const spriteNode = { hidden: false };
  const fallbackNode = { hidden: true };
  const fakeBoardFrame = {
    dataset: { hasRealImage: "true" },
    classList: {
      toggle: (name, force) => {
        if (force) frameClasses.add(name);
        else frameClasses.delete(name);
      }
    },
    querySelector: (selector) => selector === ".color-board-sprite" ? spriteNode : selector === ".color-board-fallback" ? fallbackNode : null
  };
  const fakeProbe = { closest: () => fakeBoardFrame };
  assert(context.__planetTest.handleColorBoardProbeError(fakeProbe), "A failed board request should be handled by its stable frame");
  assert(fakeBoardFrame.dataset.hasRealImage === "false" && frameClasses.has("is-empty") && !frameClasses.has("has-real-image") && spriteNode.hidden && !fallbackNode.hidden, "A failed board must become a neutral frame and must not remain marked as real");
  assert(context.__planetTest.handleColorBoardProbeLoad(fakeProbe), "A subsequently loaded board should restore its formal frame");
  assert(fakeBoardFrame.dataset.hasRealImage === "true" && frameClasses.has("has-real-image") && !frameClasses.has("is-empty") && !spriteNode.hidden && fallbackNode.hidden, "A loaded board should hide the fallback and restore the real-image state");
  const choiceBaselineCss = stylesSource.slice(stylesSource.indexOf(".color-choice-card {"), stylesSource.indexOf(".color-choice-confirmation {"));
  assert(/\.color-choice-card\s*\{[\s\S]*?position:\s*relative;[\s\S]*?height:\s*100%;/.test(choiceBaselineCss), "Choice cards should stretch to one stable row height");
  assert(/\.color-choice-card \.color-choice-status\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?top:\s*30px;[\s\S]*?right:\s*30px;/.test(choiceBaselineCss), "Choice status should float over the image without moving title or image baselines");
  assert(/\.color-choice-card h2\s*\{[\s\S]*?white-space:\s*nowrap;/.test(choiceBaselineCss) && /font-size:\s*24px;/.test(choiceBaselineCss), "Choice titles should remain a consistent single 24px line");
  assert(/\.color-choice-card p\s*\{[\s\S]*?height:\s*calc\(1\.55em \* 3\);[\s\S]*?font-size:\s*16px;[\s\S]*?line-height:\s*1\.55;/.test(choiceBaselineCss), "Choice descriptions should reserve exactly three aligned 16px lines");
  assert(/\.color-choice-action-slot\s*\{[\s\S]*?min-height:\s*50px;[\s\S]*?margin-top:\s*auto;/.test(choiceBaselineCss), "Choice actions should share a fixed bottom-aligned slot");
  const colorQualityCss = stylesSource.slice(stylesSource.indexOf(".color-quality-check {"), stylesSource.indexOf(".color-course-nav {"));
  assert(/\.color-quality-check section \+ section\s*\{[\s\S]*?border-top:\s*1px/.test(colorQualityCss), "Quality-check groups should share one container with a 1px separator");
  assert(/\.color-quality-check h3\s*\{[\s\S]*?font-size:\s*14px;[\s\S]*?font-weight:\s*600;/.test(colorQualityCss), "Quality-check labels should use the quiet 14px/600 hierarchy");
  assert(/\.color-quality-check p\s*\{[\s\S]*?font-size:\s*17px;[\s\S]*?font-weight:\s*400;[\s\S]*?line-height:\s*1\.6;/.test(colorQualityCss), "Quality-check content should use 17px text with 1.6 line height");
  assert(/section:first-child p\s*\{[\s\S]*?font-weight:\s*600;/.test(colorQualityCss) && /\.color-quality-check\s*\{[\s\S]*?box-shadow:\s*none;/.test(colorQualityCss) && /\.color-quality-check section\s*\{[\s\S]*?box-shadow:\s*none;/.test(colorQualityCss), "Completion standard may be emphasized while its container and inner sections explicitly remain shadow-free");
  const materialOverviewCss = stylesSource.match(/\.color-course-material-overview\s*\{([\s\S]*?)\}/)?.[1] || "";
  const materialOverviewRowCss = stylesSource.match(/\.color-course-overview-row\s*\{([\s\S]*?)\}/)?.[1] || "";
  const materialOverviewGroupCss = stylesSource.match(/\.color-course-overview-group\s*\{([\s\S]*?)\}/)?.[1] || "";
  const stepMaterialsCss = stylesSource.match(/\.color-step-materials\s*\{([\s\S]*?)\}/)?.[1] || "";
  [materialOverviewCss, materialOverviewRowCss, materialOverviewGroupCss, stepMaterialsCss].forEach((css, index) => {
    assert(/box-shadow:\s*none;/.test(css), `Color internal material surface ${index + 1} should explicitly remove nested shadows`);
  });
  assert(/background:\s*transparent;/.test(materialOverviewCss) && /background:\s*transparent;/.test(materialOverviewRowCss), "Whole-course materials should use transparent summary surfaces and 1px separation");
  assert(/border:\s*1px solid rgba\(36,\s*49,\s*59,\s*0\.08\)/.test(stepMaterialsCss) && /background:\s*rgba\(169,\s*139,\s*234,\s*0\.07\)/.test(stepMaterialsCss), "Current-step materials should use only a light background difference and 1px edge");
  const currentStepCss = stylesSource.match(/\n\.color-current-step\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(/box-shadow:\s*0 10px 28px rgba\(36,\s*49,\s*59,\s*0\.06\)/.test(currentStepCss) && !/box-shadow:\s*none/.test(currentStepCss), "Current Color step should remain the course page's one emphasized inner surface");
  assert(/#today-art \.course-shell\s*\{[\s\S]*?box-shadow:\s*0 8px 26px rgba\(36,\s*49,\s*59,\s*0\.035\)/.test(stylesSource), "Only the Color course shell should receive the quieter outer shadow override");

  let scrolledTo = null;
  const fakeTrack = {
    clientWidth: 320,
    getBoundingClientRect: () => ({ left: 0, right: 320 }),
    scrollTo: (options) => { scrolledTo = options; }
  };
  const fakeCurrent = {
    offsetLeft: 600,
    offsetWidth: 180,
    getBoundingClientRect: () => ({ left: 600, right: 780 })
  };
  const fakeRoot = {
    querySelector: (selector) => selector === ".color-step-index" ? fakeTrack : fakeCurrent
  };
  assert(context.__planetTest.scrollCurrentColorStepIntoView(fakeRoot) && scrolledTo?.left === 530, "Opening or switching steps should center an off-screen current item inside the track");

  selectedCourse.steps.forEach((step) => {
    assert(context.__planetTest.completeColorCourseStep(selectedId, step.id), `Step ${step.id} should complete`);
  });
  assert(context.__planetTest.completeColorCourse(selectedId), "Course should complete after all 14 steps");
  context.__planetTest.renderColorWorkChoice();
  choiceHtml = context.__elements.get("#colorWorkChoiceContent").innerHTML;
  assert(!choiceHtml.includes("备用题材"), "Reference-course page should not expose legacy reserve subjects");
  assert(context.__planetTest.getColorCourses().length === 5, "Reserve courses must remain in the local catalog");
  const completedArtProgress = context.__planetTest.getColorCourseProgress(selectedId).art;
  completedArtProgress.artworkFileName = "internal-helen-artwork-2026-07-27.webp";
  context.__planetTest.renderColorGallery();
  const completedGalleryHtml = context.__elements.get("#colorGalleryContent").innerHTML;
  assert(completedGalleryHtml.includes("阅读小猫"), "Completed course should enter the real gallery status page");
  assert(completedGalleryHtml.indexOf("color-image-frame-gallery") < completedGalleryHtml.indexOf("<h2>阅读小猫</h2>"), "Gallery card should reserve its 4:3 frame before the title");
  assert(completedGalleryHtml.includes('data-color-course-id="color-choice-003-reading-cat"') && completedGalleryHtml.includes('data-has-real-image="true"') && completedGalleryHtml.includes('data-color-cell-index="0"') && completedGalleryHtml.includes("background-position: 0% 0%"), "Gallery should use the formal first board cell rather than the step-14 camera cell");
  assert(visibleText(completedGalleryHtml) === "阅读小猫 已完成", "Student Gallery card should show only artwork frame, artwork name and Completed");
  assert(!visibleText(completedGalleryHtml).includes("internal-helen-artwork-2026-07-27.webp") && context.__planetTest.getColorGalleryEntries()[0].fileName === "internal-helen-artwork-2026-07-27.webp", "Technical artwork filename should remain in state but never become student-visible");

  const firstSkill = skills[0];
  assert(context.__planetTest.toggleColorFoundation(firstSkill.id), "Foundation practice should expand");
  let foundationHtml = context.__elements.get("#colorFoundationContent").innerHTML;
  assert((foundationHtml.match(/data-color-foundation-step=/g) || []).length === 4, "Expanded foundation practice should render four authoritative steps");
  assert((foundationHtml.match(/foundation-skill-card/g) || []).length === 6 && (foundationHtml.match(/foundation-skill-card is-expanded/g) || []).length === 1, "Exactly one of six equal foundation cards should expand across the whole row");
  const foundationPracticeId = `color-foundation-practice-${firstSkill.id}`;
  assert(foundationHtml.includes(`aria-expanded="true" aria-controls="${foundationPracticeId}"`) && foundationHtml.includes(">收起</button>"), "Expanded foundation control should say Collapse and expose its controlled region");
  assert(foundationHtml.includes(`class="foundation-practice" id="${foundationPracticeId}"`) && !foundationHtml.includes(`id="${foundationPracticeId}" hidden`), "Expanded foundation content should use the toggle's unique target id");
  assert((foundationHtml.match(/class="color-quality-check"/g) || []).length === 1, "Expanded foundation practice should reuse the same quality-check component");
  assert(foundationHtml.includes("<h3>完成标准</h3>") && foundationHtml.includes("<h3>自检</h3>"), "Foundation practice should expose the same Completion standard and Self-check labels");
  const firstFoundationStep = firstSkill.microPractice.steps[0];
  assert(context.__planetTest.completeColorFoundationStep(firstSkill.id, firstFoundationStep.id), `Foundation step ${firstFoundationStep.id} should complete`);
  foundationHtml = context.__elements.get("#colorFoundationContent").innerHTML;
  assert(!foundationHtml.includes(`data-color-foundation-step-id="${firstFoundationStep.id}"`) && foundationHtml.includes('<span class="foundation-step-complete"><span aria-hidden="true">✓</span> 已完成</span>'), "Completed foundation step should become a lightweight non-clickable status");
  assert(!context.__planetTest.completeColorFoundationStep(firstSkill.id, firstFoundationStep.id), "Completed foundation step should reject a repeated completion action");
  firstSkill.microPractice.steps.slice(1).forEach((step) => {
    assert(context.__planetTest.completeColorFoundationStep(firstSkill.id, step.id), `Foundation step ${step.id} should complete`);
  });
  foundationHtml = context.__elements.get("#colorFoundationContent").innerHTML;
  assert(foundationHtml.includes("已练习"), "Completed foundation practice should show the signed-off status");
  assert((foundationHtml.match(/foundation-step-complete/g) || []).length === 4 && !foundationHtml.includes("data-color-foundation-step-id="), "All completed foundation steps should be non-clickable lightweight states");
  assert(context.__planetTest.toggleColorFoundation(firstSkill.id), "Completed foundation practice should collapse");
  foundationHtml = context.__elements.get("#colorFoundationContent").innerHTML;
  assert(foundationHtml.includes(`aria-expanded="false" aria-controls="${foundationPracticeId}"`) && foundationHtml.includes(">继续练习</button>"), "Collapsed foundation skill with progress should say Continue practice");

  const foundationActionCss = stylesSource.match(/\.foundation-practice \.foundation-step-action\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(/width:\s*80px;/.test(foundationActionCss) && /height:\s*44px;/.test(foundationActionCss) && /min-height:\s*44px;/.test(foundationActionCss), "Foundation Complete action should remain within the signed-off 72–88 by 44px size");
  const foundationMobileCss = stylesSource.slice(stylesSource.indexOf("@media (max-width: 599px)"), stylesSource.indexOf("@keyframes gentle-float"));
  assert(/\.foundation-practice li\s*\{[\s\S]*?grid-template-columns:\s*1fr;/.test(foundationMobileCss), "Narrow foundation steps should move actions below the main instruction");
  assert(/\.foundation-practice \.foundation-step-action,[\s\S]*?justify-self:\s*start;/.test(foundationMobileCss), "Narrow foundation actions should stay compact and left-aligned");
  assert(!/\.foundation-practice li\.is-complete\s*\{[\s\S]*?background/.test(stylesSource), "Completed foundation steps should not use a green full-row background");

  context.__planetTest.setColorMaterialSearch("R754");
  let materialsHtml = context.__elements.get("#colorMaterialsContent").innerHTML;
  assert(materialsHtml.includes("R754") && materialsHtml.includes("艳红"), "Color search should find a registered code");
  context.__planetTest.setColorMaterialSearch("绝对不存在");
  materialsHtml = context.__elements.get("#colorMaterialsContent").innerHTML;
  assert(materialsHtml.includes("未找到色号"), "Color search should use the exact empty result copy");
  const emptyRegisterResult = materialsHtml.match(/<p class="color-register-empty">([\s\S]*?)<\/p>/)?.[1] || "";
  assert(visibleText(emptyRegisterResult) === "未找到色号" && !materialsHtml.includes("没有匹配") && !materialsHtml.includes("请重试"), "Zero-result register state should contain only the signed-off copy");

  context.__planetTest.renderColorChoiceLesson();
  courseStepHtml = context.__elements.get("#artLessonSections").innerHTML;
  const allColorStudentText = visibleText([
    context.__elements.get("#colorWorkChoiceContent").innerHTML,
    context.__elements.get("#colorFoundationContent").innerHTML,
    context.__elements.get("#colorGalleryContent").innerHTML,
    context.__elements.get("#colorMaterialsContent").innerHTML,
    context.__elements.get("#artLessonHeader").innerHTML,
    courseStepHtml
  ].join(" "));
  ["Today", "今日", "每日", "Day", "Revision", "预计", "分钟", "孩子", "小朋友", "宝宝", "color-choice-"].forEach((forbidden) => {
    assert(!allColorStudentText.includes(forbidden), `Color Planet student pages should omit ${forbidden}`);
  });
}

{
  const colorFetchMap = {
    "./data/color-planet/color-planet-daily-five-courses.json": colorPlanetCatalog,
    "./data/color-planet/color-card-register-120.json": colorCardRegister
  };
  const context = makeContext({}, { now: Date.now() }, { fetchMap: colorFetchMap });
  const loadingPromise = context.__planetTest.loadColorPlanetData();
  assert(context.__planetTest.getColorPlanetDataStatus() === "loading", "Color data request should synchronously enter an explicit loading state");

  context.__planetTest.renderColorWorkChoice();
  context.__planetTest.renderColorFoundation();
  context.__planetTest.renderColorGallery();
  context.__planetTest.renderColorMaterials();
  context.__planetTest.renderArtLesson();
  const loadingHtml = [
    context.__elements.get("#colorWorkChoiceContent").innerHTML,
    context.__elements.get("#colorFoundationContent").innerHTML,
    context.__elements.get("#colorGalleryContent").innerHTML,
    context.__elements.get("#colorMaterialsContent").innerHTML,
    context.__elements.get("#artLessonHeader").innerHTML,
    context.__elements.get("#artLessonSections").innerHTML
  ].join(" ");
  assert((loadingHtml.match(/data-color-loading-skeleton=/g) || []).length >= 10, "Every new Color route should render a stable quiet skeleton while data is unresolved");
  assert((context.__elements.get("#colorWorkChoiceContent").innerHTML.match(/color-skeleton-card/g) || []).length === 0, "Reference upload should not depend on the legacy static-course loading state");
  assert((context.__elements.get("#artLessonSections").innerHTML.match(/color-skeleton-step-rail/g) || []).length === 1 && (context.__elements.get("#artLessonSections").innerHTML.match(/color-current-step color-skeleton-card/g) || []).length === 1, "Course loading state should reserve one step rail and one current-step surface");
  ["课程暂时无法打开", "重试", "预计", "分钟", "art-prep-grid", "颜色星球 / Color Planet"].forEach((forbidden) => {
    assert(!loadingHtml.includes(forbidden), `Loading Color routes must not flash error or legacy course content: ${forbidden}`);
  });
  assert(visibleText(context.__elements.get("#colorWorkChoiceContent").innerHTML).includes("拖入图片或点击选择"), "Reference upload should remain usable while the static course library loads");
  assert(visibleText(context.__elements.get("#colorWorkChoiceContent").innerHTML) === "拖入图片或点击选择 JPG、PNG、WebP、HEIC｜不超过10 MB", "Only the independent reference upload should appear on its page while Color data loads");

  await loadingPromise;
  assert(context.__planetTest.getColorPlanetDataStatus() === "ready", "Validated Color data should enter the explicit ready state");
  assert(context.__elements.get("#colorWorkChoiceContent").innerHTML.includes("拖入图片或点击选择") && !context.__elements.get("#colorWorkChoiceContent").innerHTML.includes("蹲蹲小狗"), "Ready state should not restore the removed five-course page");

  const failed = makeContext({}, { now: Date.now() }, {
    fetchMap: {
      "./data/color-planet/color-planet-daily-five-courses.json": { status: 500 },
      "./data/color-planet/color-card-register-120.json": { status: 500 }
    }
  });
  const failedPromise = failed.__planetTest.loadColorPlanetData();
  assert(failed.__planetTest.getColorPlanetDataStatus() === "loading", "Failed requests must still begin in loading rather than error");
  await failedPromise;
  assert(failed.__planetTest.getColorPlanetDataStatus() === "error", "Only an explicit request failure should enter the Color error state");
  failed.__planetTest.renderColorWorkChoice();
  failed.__planetTest.renderColorFoundation();
  failed.__planetTest.renderColorGallery();
  failed.__planetTest.renderColorMaterials();
  failed.__planetTest.renderArtLesson();
  [
    failed.__elements.get("#colorFoundationContent").innerHTML,
    failed.__elements.get("#colorGalleryContent").innerHTML,
    failed.__elements.get("#colorMaterialsContent").innerHTML,
    failed.__elements.get("#artLessonHeader").innerHTML
  ].forEach((html) => {
    assert(visibleText(html) === "课程暂时无法打开 重试", "Confirmed Color failures should use only the exact signed-off error copy");
  });
  const failedChoiceHtml = failed.__elements.get("#colorWorkChoiceContent").innerHTML;
  assert(failedChoiceHtml.includes("拖入图片或点击选择") && !failedChoiceHtml.includes("课程暂时无法打开"), "Static course failure must not affect the independent reference upload page");
  assert(failed.__elements.get("#artLessonSections").innerHTML === "", "Failed Color course should not retain a skeleton or legacy lesson body");

  const domReadyBody = source.slice(source.indexOf('document.addEventListener("DOMContentLoaded"'), source.indexOf("function bindGlobalKeyboardShortcuts"));
  assert(domReadyBody.indexOf("loadColorPlanetData();") < domReadyBody.indexOf("showView(getInitialView(), false)"), "Color loading must begin before the initial route render");
  assert(domReadyBody.indexOf("loadColorPlanetData();") < domReadyBody.indexOf("renderArtLesson();"), "Color loading state must be established before the first course render");
  const artLessonBody = source.slice(source.indexOf("function renderArtLesson()"), source.indexOf("function normalizeReadAloudConfig"));
  ["getLatestLearningPack", "art-prep-grid", "plannedMinutes", "预计"].forEach((legacy) => {
    assert(!artLessonBody.includes(legacy), `New Color course route must not retain the legacy render path: ${legacy}`);
  });
  const loadingCss = stylesSource.slice(stylesSource.indexOf(".color-loading-skeleton {"), stylesSource.indexOf(".color-choice-card {"));
  assert(/\.color-skeleton-image,[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/.test(loadingCss), "Color loading media should reserve the same 4:3 geometry as final images");
  assert(/\.color-skeleton-step-rail\s*\{[\s\S]*?repeat\(7,\s*minmax\(0,\s*1fr\)\)/.test(loadingCss), "Desktop course skeleton should reserve the final 7x2 step geometry");
  const loadingMobileCss = stylesSource.slice(stylesSource.indexOf("@media (max-width: 899px)"), stylesSource.indexOf("@media (max-width: 760px)"));
  assert(/\.color-skeleton-step-rail\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-wrap:\s*nowrap;/.test(loadingMobileCss), "Narrow course skeleton should reserve one quiet horizontal step rail");
}

{
  const context = makeContext();
  const plan23 = context.__planetTest.calculateA4PaperPlan(2 / 3);
  const recommended23 = plan23.variants.find((item) => item.id === "recommended");
  assert(recommended23.widthCm === 11 && recommended23.heightCm === 16.5, "2:3 reference should preserve the signed-off 11×16.5cm area");
  [1, 4 / 3, 10, 0.1].forEach((ratio) => {
    const plan = context.__planetTest.calculateA4PaperPlan(ratio);
    assert(plan.variants.length === 3, "Every aspect ratio should offer small, recommended and large A4 variants");
    plan.variants.forEach((variant) => {
      assert(variant.marginHorizontalCm >= 2 && variant.marginVerticalCm >= 2, `A4 safety margins must survive ratio ${ratio}`);
    });
  });

  const analysis = {
    schemaVersion: "helen-color-reference-analysis/1",
    imageHash: "a".repeat(64),
    titleZh: "蓝色小熊",
    aspectRatio: 2 / 3,
    lightingDirectionZh: "左上方",
    objects: [{ id: "bear", labelZh: "小熊", primitive: "ellipse", bbox: [100, 100, 600, 700], depth: 2 }],
    paletteTargets: [{ id: "blue", roleZh: "主体主色", targetColorZh: "蓝色", targetHex: "#4477AA", candidates: [{ code: "B028", nameZh: "宝蓝" }] }],
    overlays: { position: [], skeleton: [], occlusion: [], lineart: [], colorRegions: [] }
  };
  const steps = context.__planetTest.buildGeneratedColorSteps(analysis);
  assert(steps.length === 13 && steps.map((step) => step.order).join(",") === "1,2,3,4,5,6,7,8,9,10,11,12,13", "Reference courses must use the fixed 13-step order");
  const course = context.__planetTest.buildGeneratedColorCourse(analysis, { width: 1000, height: 1500, mimeType: "image/jpeg" });
  assert(course.steps.length === 13 && course.paperPlan.targetAreaCm2 === 181.5, "Generated course should combine the fixed steps with the A4 plan");
  assert(context.__planetTest.renderGeneratedOverlayPrimitive({ type: "path", d: "<script>" }, course, "lineart") === "", "Client overlay renderer must ignore unsafe SVG primitives");
  assert(context.__planetTest.renderGeneratedOverlayPrimitive({ type: "line", x1: 0, y1: 0, x2: 1000, y2: 1000 }, course, "lineart").includes("<line"), "Client overlay renderer should retain safe primitives");

  context.__planetTest.setColorReferenceSetting("modelTier", "terra");
  context.__planetTest.setColorReferenceSetting("reasoningEffort", "max");
  context.__planetTest.setColorReferenceSetting("modelTier", "sol");
  context.__planetTest.setColorReferenceSetting("reasoningEffort", "ultra");
  assert(context.__planetTest.state.colorPlanet.referenceSettings.modelTier === "terra" && context.__planetTest.state.colorPlanet.referenceSettings.reasoningEffort === "max", "Reference model settings must persist while rejecting non-whitelisted models and efforts");
  assert(context.__planetTest.formatColorReferenceError({ stage: "response_empty", requestId: "color-reference-test" }) === "模型没有返回分析内容，请重试。 错误编号：color-reference-test", "Empty provider responses should show an actionable redacted request ID");
  assert(context.__planetTest.formatColorReferenceError({ stage: "response_truncated", requestId: "color-reference-test" }).startsWith("参考图分析被模型截断"), "Truncated provider responses should be distinguishable from malformed JSON");
  assert(context.__planetTest.formatColorReferenceError({ stage: "model_unavailable", requestId: "color-reference-test" }).startsWith("当前模型不支持最高推理"), "Unsupported Max reasoning must not silently downgrade");
  assert(context.__planetTest.formatColorReferenceError({ stage: "course_write", requestId: "color-reference-test" }).includes("参考图仍保留"), "Course write failures should preserve the reference image for retry");
  assert(source.includes('<option value="max"') && source.includes('>最高（Max）</option>'), "Reference reasoning select should expose the 最高 Max effort");
  assert(source.includes('version: "v3.9.12"'), "Color reference release should publish as v3.9.12");
  assert(source.includes('"X-Client-Trace-Id": clientTraceId') && source.includes("deleteColorReferenceImage"), "Reference requests should carry a trace ID and roll back orphaned images");
  assert(/draft\.error \? "重新生成"/.test(source), "Reference analysis failures should leave an explicit retry action");
  assert(source.includes("analysisProfile: {") && !source.includes("gpt-5.6-luna"), "Frontend should send a chosen reasoning profile without embedding server model aliases");
  assert(/if \(existing\) \{\s*resetColorReferenceDraft\(\);\s*startColorCourse\(existing\.courseId\)/.test(source), "Selecting an existing reference image must clear the temporary loading state before opening the saved course");
  assert(stylesSource.includes(".color-reference-model-settings") && stylesSource.includes(".color-reference-figure"), "Reference upload and image overlay must have dedicated responsive styles");
  assert(source.includes('class="color-candidate-name"') && source.includes('class="color-candidate-check"'), "Palette names and selected checks need stable layout hooks");
  assert(/\.color-candidate-check\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?grid-row:\s*1 \/ span 2;/.test(stylesSource), "Palette checks should stay in a fixed right-hand column without changing button height");
  assert(/\.color-reference-actions > label\s*\{\s*margin:\s*0;/.test(stylesSource), "Change-image and generate actions should share the same vertical center");
}

{
  const context = makeContext();
  const button = context.__planetTest.renderReadAloudButton("test:prompt", { policy: "full", spokenTextZh: "请听题" });
  const row = context.__planetTest.renderPromptRow("<h3>词语复习</h3>", button);
  assert(row.includes('<div class="prompt-text"><h3>词语复习</h3><button'), "Read aloud button should be inside prompt text after title text");
  assert(!row.includes("<span></span>"), "Prompt row without button must not create placeholder spans");
  const noButtonRow = context.__planetTest.renderPromptRow("<h3>没有朗读</h3>", "");
  assert(noButtonRow === '<div class="prompt-row "><div class="prompt-text"><h3>没有朗读</h3></div></div>', "Prompt row without button should contain only prompt text");
  const promptRowCss = stylesSource.match(/\.prompt-row\s*\{[\s\S]*?\}/)?.[0] || "";
  const readButtonCss = stylesSource.match(/\.read-aloud-icon\s*\{[\s\S]*?\}/)?.[0] || "";
  const promptTextElementCss = stylesSource.match(/\.prompt-text h3,\s*\.prompt-text p,\s*\.prompt-text strong\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(!/grid-template-columns\s*:\s*minmax\(0,\s*1fr\)\s*40px/.test(promptRowCss), "Prompt row must not use right-side fixed 40px grid");
  assert(!/margin-left\s*:\s*auto/.test(readButtonCss), "Read aloud icon must not be pushed to the far right");
  assert(!/position\s*:\s*absolute/.test(readButtonCss), "Read aloud icon must not use absolute positioning");
  assert(!/justify-content\s*:\s*space-between/.test(promptRowCss), "Prompt row must not use space-between layout");
  assert(/margin-left\s*:\s*0\.25em/.test(readButtonCss), "Read aloud icon should sit close to the final character");
  assert(/display\s*:\s*inline/.test(promptTextElementCss), "Prompt text direct heading/paragraph/strong elements must be inline in prompt rows");
  assert(!/h3,\s*p,\s*strong\s*\{[\s\S]*display\s*:\s*inline/.test(stylesSource), "Inline text rule must stay scoped to prompt rows");
  const fixedWordsRow = context.__planetTest.renderPromptRow("<h3>题目词语</h3>", button);
  assert(fixedWordsRow.includes("<h3>题目词语</h3><button"), "Fixed-words title and speaker should share one inline context");
  const longPromptRow = context.__planetTest.renderPromptRow("<strong>根据三次记录，大树的影子发生了什么变化？他们还明白了什么？</strong>", button);
  assert(longPromptRow.includes("什么？</strong><button"), "Long prompt and speaker should stay in the same text flow");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const sections = context.__planetTest.getChineseLessonSections(parsed);
  const assessmentSectionHtml = context.__planetTest.renderChineseSection(parsed, sections[0], 0, progress);
  assert(!assessmentSectionHtml.includes("read-aloud-icon"), "Assessment-disabled Chinese section should not render a read aloud button");
  const readableSection = sections.find((section) => section.readAloud?.spokenTextZh);
  const chineseSectionHtml = context.__planetTest.renderChineseSection(parsed, readableSection, 2, progress);
  assert(new RegExp('<div class="prompt-text"><h3>[^<]+</h3><button class="read-aloud-icon"').test(chineseSectionHtml), "Chinese section title should keep speaker immediately after heading text");
  const questionSection = sections.find((section) => section.questions?.some((question) => question.readAloud?.spokenTextZh));
  const chineseQuestionHtml = context.__planetTest.renderChineseSection(parsed, questionSection, 5, progress);
  assert(new RegExp('<div class="prompt-text"><strong>[\\s\\S]+?</strong><button class="read-aloud-icon"').test(chineseQuestionHtml), "Chinese question prompt should keep speaker inside the prompt text flow");
  const englishStep = context.__planetTest.renderEnglishStep(parsed, context.__planetTest.getEnglishLessonSteps(parsed)[0], 0, "light", progress);
  assert(new RegExp('<div class="prompt-text"><h3>[^<]+</h3><button class="read-aloud-icon"').test(englishStep), "English step title should keep speaker inside the title flow");
  const artStep = context.__planetTest.renderArtStep(parsed, context.__planetTest.getArtLessonSteps(parsed).find((step) => step.instructionZh), 0, progress);
  assert(artStep.includes("<strong>教师朗读</strong>") && new RegExp('<div class="prompt-text"><p>[^<]+</p><button class="read-aloud-icon"').test(artStep), "Art teacher reading should keep speaker after the teacher text");
  const disabledButton = context.__planetTest.renderReadAloudButton("test:assessment", { policy: "disabled_during_assessment", spokenTextZh: "答案" }, { assessment: true, targetText: "答案" });
  assert(disabledButton === "", "Assessment-disabled read aloud policy should still suppress the button");
}

{
  const context = makeContext();
  const professionalPack = JSON.parse(JSON.stringify(day13Rev2Pack));
  professionalPack.packId = "2026-07-27-art-professional-protocol";
  professionalPack.art.toolProfile = {
    brandZh: "<b>掌握</b>",
    colorCount: 120,
    inkSystemZh: "直液式",
    tipTypeZh: "软头",
    mediumZh: "丙烯马克笔"
  };
  professionalPack.art.palette = [
    {
      id: "main_blue",
      colorCode: "B815",
      colorNameZh: "湖蓝",
      targetHueZh: "清澈中蓝",
      roleZh: "主体色",
      locationZh: "星球主体",
      verified: true
    },
    {
      id: "unconfirmed_light",
      colorCode: "",
      colorNameZh: "浅蓝",
      targetHueZh: "偏冷的浅蓝",
      roleZh: "过渡色",
      locationZh: "高光附近"
    },
    {
      id: "metal_gold",
      colorCode: "M01",
      colorNameZh: "金属金",
      targetHueZh: "暖金属色",
      roleZh: "点缀",
      locationZh: "星球环",
      finishZh: "金属色",
      colorCodeVerified: true
    }
  ];
  const sourceStep = professionalPack.art.steps[0];
  sourceStep.instructionZh = "";
  sourceStep.childActionZh = "";
  sourceStep.successCriteriaZh = "";
  sourceStep.completionCheckZh = "";
  sourceStep.commonMistakeZh = "";
  sourceStep.readAloud = null;
  sourceStep.narration = {};
  sourceStep.studentVisible = {
    taskZh: "<b>让孩子</b>先观察最大的形状，再指出主色区域。",
    materialsZh: ["HB 铅笔", "掌握软头丙烯马克笔"],
    completionStandardZh: "孩子能指出主体和高光的位置。",
    selfCheckZh: `孩子现在${"检查".repeat(200)}`,
    commonProblemsAndCorrectionsZh: [
      { problemZh: "只看细节", correctionZh: "退后一步，先确认大形。" },
      "<b>颜色超出轮廓时先停笔，再用同色整理边缘。</b>"
    ],
    teacherAudioZh: "让孩子先看大形，再看颜色位置。"
  };
  sourceStep.paletteRoles = [
    { paletteId: "main_blue", roleZh: "主体平涂", locationZh: "星球主体" },
    { paletteId: "unconfirmed_light" },
    { paletteId: "metal_gold" }
  ];
  sourceStep.parentOnly = {
    titleZh: "家长提示",
    notesZh: ["只在笔帽过紧时提供帮助。"]
  };
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(professionalPack));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const step = context.__planetTest.getArtLessonSteps(parsed)[0];
  const toolLabel = context.__planetTest.formatArtToolProfile(parsed.art.toolProfile);
  assert(toolLabel === "掌握 120色直液式软头丙烯马克笔", "Professional Art tool profile should render the exact verified marker specification");
  assert(step.studentVisible.taskZh.includes("请先观察") && !step.studentVisible.taskZh.includes("孩子"), "Student-facing task should use direct student language");
  assert(step.studentVisible.selfCheckZh.length <= 260 && !step.studentVisible.selfCheckZh.includes("孩子现在"), "Student-facing fields should be safely length-limited and avoid third-person phrasing");
  assert(!JSON.stringify(step.studentVisible).includes("<b>"), "Student-visible Art fields should strip embedded HTML");
  const paletteRows = context.__planetTest.getArtPaletteRows(parsed, step);
  const paletteHtml = context.__planetTest.renderArtPaletteRows(paletteRows);
  assert(paletteHtml.includes("B815") && paletteHtml.includes("主体平涂"), "Verified ordinary marker codes and step-specific responsibilities should render");
  assert(paletteHtml.includes("按实体色卡确认"), "A missing marker code must use the physical-card fallback instead of a guessed code");
  assert(paletteHtml.includes("M01") && paletteHtml.includes("金属金") && paletteHtml.includes("已核验") && paletteHtml.includes("金属色"), "Verified metallic marker data should render without being discarded");
  const html = context.__planetTest.renderArtStep(parsed, step, 0, progress);
  const requiredHeadings = ["任务", "材料与色号", "完成标准", "自查", "常见问题与修正", "教师朗读"];
  requiredHeadings.reduce((lastIndex, heading) => {
    const nextIndex = html.indexOf(`<strong>${heading}</strong>`);
    assert(nextIndex > lastIndex, `Art student card hierarchy should place ${heading} in the approved order`);
    return nextIndex;
  }, -1);
  ["孩子现在做什么", "孩子能", "让孩子", "做到什么算完成", "怎么检查", "最常见错误"].forEach((blocked) => {
    assert(!html.includes(blocked), `Art student view should not contain the blocked phrase: ${blocked}`);
  });
  assert(html.includes("<details class=\"parent-prompt-detail\">") && html.includes("只在笔帽过紧时提供帮助。"), "Parent-only Art guidance should remain in a collapsed parent detail");
  const legacyParsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  const legacyProgress = context.__planetTest.initializeCourseProgress(legacyParsed);
  const legacyHtml = context.__planetTest.getArtLessonSteps(legacyParsed).map((item, index) => context.__planetTest.renderArtStep(legacyParsed, item, index, legacyProgress)).join("");
  assert(context.__planetTest.getArtLessonSteps(legacyParsed).length === 14, "Legacy Color Planet must keep all 14 steps after the protocol upgrade");
  ["孩子现在做什么", "孩子能", "让孩子", "做到什么算完成", "怎么检查", "最常见错误"].forEach((blocked) => {
    assert(!legacyHtml.includes(blocked), `Legacy Art student view should also avoid the blocked phrase: ${blocked}`);
  });
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const sections = context.__planetTest.getChineseLessonSections(parsed);
  const expectedTitles = ["词语复习", "题目词语", "今日阅读", "固定休息", "词语积累", "阅读理解", "压缩复述", "小学情境", "阅读后测"];
  assert(sections.map((section) => section.title).join("|") === expectedTitles.join("|"), "Chinese section titles should match the approved four-character set");
  assert(sections.every((section) => /^\p{Script=Han}{4}$/u.test(section.title)), "Every approved Chinese section title should be exactly four Han characters");
  const pageHtml = sections.map((section, index) => context.__planetTest.renderChineseSection(parsed, section, index, progress)).join("");
  ["昨日词语复习", "四个固定读题词", "四格压缩复述", "一年级课堂情境", "小学情境练习"].forEach((oldTitle) => {
    assert(!pageHtml.includes(oldTitle), `Old Chinese title should not appear in rendered lesson: ${oldTitle}`);
  });
  const assertTermList = (sectionId, expectedCount) => {
    const section = sections.find((item) => item.id === sectionId);
    const html = context.__planetTest.renderChineseSection(parsed, section, sections.indexOf(section), progress);
    assert(html.includes('<ol class="chinese-term-list">'), `${sectionId} should render a semantic ordered vertical term list`);
    for (let index = 1; index <= expectedCount; index += 1) {
      assert(html.includes(`<span class="term-index">${index}</span>`), `${sectionId} should show term number ${index}`);
    }
    assert(!html.includes("course-chip-list"), `${sectionId} should not render as horizontal chips`);
  };
  assertTermList("review_words", 3);
  assertTermList("word_accumulation", 2);
  assertTermList("post_check", 9);
  const fourSection = sections.find((item) => item.id === "four_grid_retell");
  const fourHtml = context.__planetTest.renderChineseSection(parsed, fourSection, sections.indexOf(fourSection), progress);
  assert(fourHtml.includes('<div class="four-grid">') && (fourHtml.match(/class="four-grid-item"/g) || []).length === 4, "Four-grid retell should render four vertical items");
  [1, 2, 3, 4].forEach((index) => assert(fourHtml.includes(`<strong>${index}</strong>`), `Four-grid retell should show sequence ${index}`));
  assert(fourHtml.includes("four-grid-action"), "Four-grid item action buttons should use the compact left-aligned class");
  assert((fourHtml.match(/data-course-complete=/g) || []).length === 4 && (fourHtml.match(/data-course-result=/g) || []).length === 4, "Four-grid retell should expose four independent Confirm actions and one parent feedback group");
  assert((fourHtml.match(/>确认<\/button>/g) || []).length === 4, "Each four-grid step should use the concise Confirm label");
  for (let index = 0; index < 4; index += 1) context.__planetTest.completeCourseItem(`chinese:four_grid_retell:grid:${index}`);
  assert(progress.chinese.sections["chinese:four_grid_retell"].finishedAt, "Completing all four retell steps should automatically finish the parent section");
  assert(context.__planetTest.countCompletedChineseSections(parsed, progress.chinese.sections) === 1, "Nested confirmations must count as one of the nine top-level Chinese sections");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).progress === "1/8", "Chinese planet progress must exclude the rest state and nested confirmations");
  const fourGridCss = [...stylesSource.matchAll(/\.four-grid\s*\{[\s\S]*?\}/g)].map((match) => match[0]).find((rule) => /display\s*:\s*grid/.test(rule)) || "";
  const termListCss = stylesSource.match(/\.chinese-term-list\s*\{[\s\S]*?\}/)?.[0] || "";
  const fourGridItemCss = stylesSource.match(/\.four-grid > div\s*\{[\s\S]*?\}/)?.[0] || "";
  const fourActionCss = stylesSource.match(/\.four-grid-action\s*\{[\s\S]*?\}/)?.[0] || "";
  const chineseConfirmCss = stylesSource.match(/\.course-controls\.is-chinese-confirm \.course-timing-row\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(/grid-template-columns\s*:\s*minmax\(0,\s*1fr\)/.test(fourGridCss), "Four-grid retell should stay single-column on desktop");
  assert(/grid-template-columns\s*:\s*minmax\(0,\s*1fr\)/.test(termListCss), "Chinese term lists should stay single-column on desktop");
  assert(/justify-items\s*:\s*start/.test(fourGridItemCss) && /text-align\s*:\s*left/.test(fourGridItemCss), "Four-grid content should align to the left edge");
  assert(/justify-self\s*:\s*start/.test(fourActionCss) && /width\s*:\s*auto/.test(fourActionCss), "Four-grid buttons should be compact and left-aligned");
  assert(/justify-content\s*:\s*flex-start/.test(chineseConfirmCss), "Chinese confirm button should remain left-aligned");
  const responsiveCss = stylesSource.match(/@media \(max-width: 760px\)\s*\{[\s\S]*?\n\}/)?.[0] || "";
  assert(!/\.four-grid[\s\S]*grid-template-columns\s*:\s*repeat/.test(responsiveCss), "Mobile/iPad CSS should not turn four-grid into multiple columns");
  const termRules = [...stylesSource.matchAll(/\.chinese-term-list[^{]*\{[\s\S]*?\}/g)].map((match) => match[0]);
  assert(termRules.every((rule) => !/grid-template-columns\s*:\s*repeat/.test(rule)), "Term lists should not have any multi-column override");
}

{
  const context = makeContext();
  const spokenPack = JSON.parse(JSON.stringify(day15Pack));
  spokenPack.packId = "spoken-children-auto-parent-test";
  spokenPack.date = "2026-07-29";
  spokenPack.chinese.lesson.lessonId = "spoken-children-auto-parent-test";
  spokenPack.chinese.lesson.sections = [{
    id: "spoken_section",
    type: "comprehension",
    title: "口头回答",
    questions: [
      { prompt: "先发生了什么？", answerMode: "spoken", referenceAnswer: "先整理桌面。" },
      { prompt: "后来发生了什么？", answerMode: "spoken", referenceAnswer: "后来开始画画。" }
    ]
  }];
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(spokenPack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const html = context.__planetTest.renderChineseSection(parsed, parsed.chinese.lesson.sections[0], 0, progress);
  assert((html.match(/data-course-complete=/g) || []).length === 2, "Spoken subquestions should have individual confirmations without a duplicate section confirmation");
  context.__planetTest.completeCourseItem("chinese:spoken_section_0");
  assert(!progress.chinese.sections["chinese:spoken_section"].finishedAt, "A spoken parent section should wait for every subquestion");
  context.__planetTest.completeCourseItem("chinese:spoken_section_1");
  assert(progress.chinese.sections["chinese:spoken_section"].finishedAt && context.__planetTest.areChineseSectionsComplete(parsed, progress.chinese.sections), "All spoken subquestions should auto-finish their one parent section");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).progress === "1/1", "Spoken child records must not inflate top-level progress");
}


{
  const context = makeContext();
  const parsedDay13 = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  context.__planetTest.importLearningPack(parsedDay13, context.__planetTest.buildLearningPackPreview(parsedDay13), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  const day13Progress = context.__planetTest.initializeCourseProgress(parsedDay13);
  day13Progress.chinese.sections["chinese:reading"] = { finishedAt: "day13-reading-kept", result: "independent" };
  day13Progress.chinese.courseRecordingStatus = "saved";
  context.__planetTest.state.recordingClips = {
    "day13-clip": {
      clipId: "day13-clip",
      sessionId: day13Progress.chinese.sessionId,
      packId: parsedDay13.packId,
      planetId: "chinese",
      activityId: "chinese:course_recording",
      includeInFeedback: true,
      chunkCount: 2,
      status: "complete"
    }
  };
  const beforeDay13Progress = JSON.stringify(context.__planetTest.state.courseProgress[parsedDay13.packId]);

  const oldDay14Parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(oldDay14Pack));
  context.__planetTest.importLearningPack(oldDay14Parsed, context.__planetTest.buildLearningPackPreview(oldDay14Parsed), { select: true, markLatest: true, publishedAt: "2026-07-26T06:00:00+08:00" });
  const oldDay14Progress = context.__planetTest.initializeCourseProgress(oldDay14Parsed);
  oldDay14Progress.chinese.sections["chinese:reading"] = { finishedAt: "old-day14-reading-kept", result: "independent" };
  context.__planetTest.state.recordingClips["old-day14-clip"] = {
    clipId: "old-day14-clip",
    sessionId: oldDay14Progress.chinese.sessionId,
    packId: oldDay14Parsed.packId,
    planetId: "chinese",
    activityId: "chinese:course_recording",
    includeInFeedback: true,
    chunkCount: 1,
    status: "complete"
  };
  const beforeOldDay14Progress = JSON.stringify(context.__planetTest.state.courseProgress[oldDay14Parsed.packId]);
  const beforeAllRecordings = JSON.stringify(context.__planetTest.state.recordingClips);

  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  assert(preview.valid && preview.warnings.length === 0, "Day14 Revision E pack should validate without warnings");
  context.__planetTest.importLearningPack(parsed, preview, { select: true, markLatest: true, publishedAt: "2026-07-26T11:25:00+08:00" });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const readiness = context.__planetTest.getFullCourseReadiness(parsed);
  assert(readiness.ready, `Day14 Revision E full-course readiness should pass: ${readiness.missing.join(",")}`);
  assert(context.__planetTest.state.courseProgress[parsedDay13.packId] && JSON.stringify(context.__planetTest.state.courseProgress[parsedDay13.packId]) === beforeDay13Progress, "Importing Revision E must not change Day13 progress");
  assert(context.__planetTest.state.courseProgress[oldDay14Parsed.packId] && JSON.stringify(context.__planetTest.state.courseProgress[oldDay14Parsed.packId]) === beforeOldDay14Progress, "Importing Revision E must not delete or mutate old defective Day14 progress");
  assert(JSON.stringify(context.__planetTest.state.recordingClips) === beforeAllRecordings, "Importing Revision E must not change existing Day13 or old Day14 recording clips");
  assert(context.__planetTest.getLearningPackDates().join(",") === "2026-07-25,2026-07-26", "Manual Revision E import should keep Day13 and Day14 in this isolated context");
  assert(context.__planetTest.getPackIdForDate("2026-07-25") === parsedDay13.packId, "Date menu should still switch back to Day13 rev2");
  assert(context.__planetTest.getPackIdForDate("2026-07-26") === parsed.packId, "Date menu should resolve Revision E as latest for 2026-07-26");
  context.__planetTest.selectLearningPackDate("2026-07-25", false);
  assert(context.__planetTest.state.selectedLearningPackId === parsedDay13.packId, "Selecting Day13 should switch active pack away from Day14");
  context.__planetTest.selectLearningPackDate("2026-07-26", false);
  assert(context.__planetTest.state.selectedLearningPackId === parsed.packId, "Selecting Day14 should switch active pack back to Revision E");
  assert(builtinManifest.latestPackId === revisionAPack.packId && builtinManifest.latest?.includes("helen-learning-pack-2026-07-29-revision-a"), "Built-in manifest should point latest to Revision A");
  assert(builtinManifest.packs.some((item) => item.packId === day14Pack.packId), "Built-in manifest should keep Day14 Revision E archived");
  assert(builtinManifest.packs.some((item) => item.packId === day13Pack.packId) && builtinManifest.packs.some((item) => item.packId === day13Rev2Pack.packId), "Built-in manifest should keep both Day13 packs archived");
  assert(!builtinManifest.packs.some((item) => item.packId === oldDay14Pack.packId || item.packId === day14RevisionDPack.packId), "Built-in manifest should not expose withdrawn Day14 packs as duplicate date options");

  const sections = context.__planetTest.getChineseLessonSections(parsed);
  const expectedTitles = ["词语复习", "选词填空", "今日阅读", "词语积累", "阅读理解", "压缩复述", "固定休息", "小学情境", "阅读后测"];
  assert(sections.length === 9 && sections.map((section) => section.title).join("|") === expectedTitles.join("|"), "Revision E Chinese should follow the approved nine-section order");
  assert(parsed.packId === "2026-07-26-helen-day14-revision-e-open-books-art01", "Day14 should use the Revision E packId");
  assert(parsed.revision === "day14-chinese-revision-e-open-books-art01", "Day14 should use the Revision E revision marker");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).minutes === 29, "Day14 Revision E Chinese effective minutes should be 29");
  const pageHtml = sections.map((section, index) => context.__planetTest.renderChineseSection(parsed, section, index, progress)).join("");
  ["parentInstructionZh", "supportRulesZh", "stopRuleZh", "learningGoalZh", "referenceAnswer", "distractorRationale", "day13Evidence", "W1", "W2", "记录字段", "研发术语", "题目说", "先让孩子操作", "制作定位卡", "完成标准："].forEach((forbidden) => {
    assert(!pageHtml.includes(forbidden), `Revision E child page should not show parent/backend text: ${forbidden}`);
  });

  const review = sections.find((section) => section.id === "review_words");
  const reviewHtml = context.__planetTest.renderChineseSection(parsed, review, 0, progress);
  assert(review.items.map((item) => item.text).join(",") === "移动,另外,一共", "Revision E first section should show 移动、另外、一共");
  assert(reviewHtml.includes("说说它的意思") && reviewHtml.includes("用它说一句完整的话"), "Revision E first section should ask for meaning or sentence");
  assert(!reviewHtml.includes("纸片") && !reviewHtml.includes("三张") && !reviewHtml.includes("数量"), "Revision E first section should remove paper/action/counting tasks");

  const fill = sections.find((section) => section.id === "fill_blanks");
  assert(fill.title === "选词填空" && fill.questions.length === 3, "Revision E second section should be real three-item fill blanks");
  assert(fill.childInstructionZh.includes("备选词") && fill.childInstructionZh.includes("说明理由") && fill.childInstructionZh.includes("找出") && fill.childInstructionZh.includes("按顺序"), "Revision E fill blank should show word bank");
  assert(fill.questions[2].prompt === "你认为蓝夹子有什么作用？请______。", "Revision E third fill blank should use the final approved blue-clip wording");
  assert(fill.questions.map((question) => question.answerPosition).join("-") === "B-C-A", "Revision E fill blanks should keep approved answer letters B-C-A");
  const fillHtml = context.__planetTest.renderChineseSection(parsed, fill, 1, progress);
  const fillText = visibleText(fillHtml).replace(/\s+/g, "");
  ["1.请______", "2.请______", "3.你认为蓝夹子"].forEach((snippet) => assert(fillText.includes(snippet), `Revision E fill blanks should number sub-question: ${snippet}`));
  assert((fillHtml.match(/class="choice-letter"[^>]*><span[^>]*>A/g) || []).length >= 3 && /class="choice-letter"[^>]*><span[^>]*>B/.test(fillHtml) && /class="choice-letter"[^>]*><span[^>]*>C/.test(fillHtml), "Revision E fill blanks should render clickable A/B/C choices");

  const reading = sections.find((section) => section.id === "reading");
  assert(reading.textTitle === "贴歪的作品标签" && reading.paragraphs.length === 6, "Revision E reading should render the approved article title and six paragraphs");
  assert(reading.paragraphs.join("").includes("在准备贴标签的位置摆一张纸片") && reading.paragraphs.join("").includes("先定标准，再按路线检查"), "Revision E reading text should match the final approved article");

  const wordAccumulation = sections.find((section) => section.id === "word_accumulation");
  assert(wordAccumulation.questions.length === 3 && !wordAccumulation.items?.length, "Revision E word accumulation should be three context fill blanks, not W1/W2 activities");
  assert(wordAccumulation.questions.map((question) => question.answer).join("|") === "标准|核对|相配", "Revision E word accumulation answers should be 标准、核对、相配");
  assert(wordAccumulation.questions.map((question) => question.answerPosition).join("-") === "B-C-A", "Revision E word accumulation should preserve B-C-A answer letters");
  const wordHtml = context.__planetTest.renderChineseSection(parsed, wordAccumulation, 3, progress);
  const wordText = visibleText(wordHtml).replace(/\s+/g, "");
  assert(wordText.includes("把它作为共同的______") && wordText.includes("彼此______") && !wordText.includes("定位卡"), "Revision E word accumulation should show approved context blanks and remove location-card task");

  const comprehension = sections.find((section) => section.id === "comprehension");
  assert(comprehension.questions.length === 3, "Revision E reading comprehension should render all three questions");
  assert(comprehension.questions[0].options.length === 0 && comprehension.questions[1].options.length === 3 && comprehension.questions[2].options.length === 0, "Revision E comprehension should have oral, choice, oral");
  assert(comprehension.questions[1].answerPosition === "B", "Revision E comprehension choice answer should be B");
  const comprehensionHtml = context.__planetTest.renderChineseSection(parsed, comprehension, 4, progress);
  const comprehensionText = visibleText(comprehensionHtml).replace(/\s+/g, "");
  ["1.为什么她们既要走近", "2.她们为什么给检查过", "3.第八和第九张"].forEach((snippet) => assert(comprehensionText.includes(snippet), `Revision E comprehension should number question: ${snippet}`));

  const breakIndex = sections.findIndex((section) => section.id === "fixed_break");
  assert(breakIndex === 6 && sections[5].id === "four_grid_retell", "Revision E fixed break should sit after the sixth learning task");
  const revisionEBreakHtml = context.__planetTest.renderChineseSection(parsed, sections[breakIndex], breakIndex, progress);
  assert(revisionEBreakHtml.includes(">开始</button>") && revisionEBreakHtml.includes("准备休息"), "Revision E fixed break should use the compact rest entry state");
  assert(sections.find((section) => section.id === "school_scenario").title === "小学情境", "Revision E section 8 title should be 小学情境");

  const postHtml = context.__planetTest.renderChineseSection(parsed, sections.find((section) => section.id === "post_check"), 8, progress);
  const postText = visibleText(postHtml).replace(/\s+/g, "");
  ["移", "另", "共", "配", "签", "对", "移动", "相配", "核对"].forEach((item, index) => {
    assert(postText.includes(item), `Revision E post-check should render approved item: ${item}`);
    assert(postHtml.includes(`<span class="term-index">${index + 1}</span>`), `Revision E post-check should show sequence ${index + 1}`);
  });
  assert(!postHtml.includes("核（") && !postHtml.includes("卡（") && !postHtml.includes("签（qiān）") && !postHtml.includes("对（duì）"), "Revision E post-check should not show pinyin or isolated 核/卡");

  const objectiveQuestions = [...fill.questions, ...wordAccumulation.questions, comprehension.questions[1]];
  assert(objectiveQuestions.map((question) => question.answerPosition).join("-") === "B-C-A-B-C-A-B", "Revision E objective answer letters should not collapse to one position");
  objectiveQuestions.forEach((question, index) => {
    const order = context.__planetTest.getChineseQuestionOptionOrder(question, `revision_e_${index}`, {});
    const correctIndex = order.findIndex((option) => option === question.answer);
    assert(context.__planetTest.choiceLetter(correctIndex) === question.answerPosition, `Revision E ${question.id} answerPosition should match preserved option order`);
    assert(question.readAloud?.policy === "prompt_and_options" && question.readAloud.spokenTextZh.includes("A，") && question.readAloud.optionSpokenTexts.length === 3, `Revision E ${question.id} should keep complete prompt/options readAloud`);
  });
  const fillKey = "fill_blanks_0";
  context.__planetTest.selectCourseChoice({ dataset: { courseChoice: fillKey, choiceValue: "找出", choiceAnswer: "找出", choiceIndex: "1" } });
  let fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(fillProgress.pendingChoices?.[fillKey]?.selectedLetter === "B" && !fillProgress.choiceResults?.length && !fillProgress.attempts, "Revision E choices should remain pending before Confirm");
  ["fill_blanks_1", "fill_blanks_2"].forEach((key, idx) => {
    const answer = idx === 0 ? "按顺序" : "说明理由";
    context.__planetTest.selectCourseChoice({ dataset: { courseChoice: key, choiceValue: answer, choiceAnswer: answer, choiceIndex: idx === 0 ? "2" : "0" } });
  });
  fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(context.__planetTest.confirmChineseObjectiveSection("chinese:fill_blanks", fillProgress, progress), "Revision E fill blanks should confirm after all three choices are selected");
  fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(fillProgress.choiceResults.length === 3 && fillProgress.correctCount === 3 && fillProgress.attempts === 1, "Revision E fill blanks should grade once on confirm and store all choice results");

  const expectedAnchor = "Our teacher says, “Open your books. Let’s read together.”";
  const forbiddenAnchor = "We read, listen and learn together.";
  assert(parsed.english.anchorSentence === expectedAnchor && parsed.english.lesson.anchorSentence === expectedAnchor, "Day14 English anchor sentence should remain exact");
  assert(!JSON.stringify(parsed.english).includes(forbiddenAnchor), "Day14 English should not include the previously wrong next sentence");
  assert(JSON.stringify(parsed.english) === JSON.stringify(context.__planetTest.parseLearningPackInput(JSON.stringify(day14RevisionDPack)).english), "Revision E should not change the current Day14 English object");
  const englishSteps = context.__planetTest.getEnglishLessonSteps(parsed);
  assert(englishSteps.length === 7 && englishSteps.reduce((sum, step) => sum + step.minutesByMode.light, 0) === 15 && englishSteps.reduce((sum, step) => sum + step.minutesByMode.standard, 0) === 20, "Revision E should preserve seven English steps and 15/20 minute modes");

  const artSteps = context.__planetTest.getArtLessonSteps(parsed);
  assert(JSON.stringify(parsed.art) !== JSON.stringify(context.__planetTest.parseLearningPackInput(JSON.stringify(day14RevisionDPack)).art), "Revision E should carry the professional Color Planet update instead of the withdrawn generic art object");
  assert(parsed.art.lessonId === "art-01-color-planet-professional-v3" && artSteps.length === 14 && parsed.art.plannedMinutes === 52, "Revision E Color Planet should remain 14 steps and use the 52-minute professional lesson");
  assert(parsed.art.toolProfile?.brandZh === "掌握" && parsed.art.toolProfile?.colorCount === 120 && parsed.art.toolProfile?.tipTypeZh === "软头", "Revision E Color Planet should describe Helen's real 120-color soft-tip marker set");
  assert(parsed.art.palette.map((color) => color.colorCode).join(",") === "B815,G695,R787,B688,Y128,W01", "Revision E Color Planet should use the six verified swatch codes");
  assert(artSteps.every((step) => context.__planetTest.resolveArtImageAsset(parsed, step.imageAssetId).url), "Revision E art steps should all resolve real image URLs");
  assert(context.__planetTest.getArtStepLock(parsed, artSteps[6], progress).locked, "Revision E art step 7 should remain locked before the pencil draft gate");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).progress === "0/8", "Revision E Chinese progress should start at 0/8 learning sections");
  assert(context.__planetTest.getPlanetStatus("english", parsed).progress === "0/7", "Revision E English progress should start at 0/7");
  assert(context.__planetTest.getPlanetStatus("art", parsed).progress === "0/14", "Revision E art progress should start at 0/14");
}

{
  const context = makeContext();
  const day13Parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  const day14Parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(day13Parsed, context.__planetTest.buildLearningPackPreview(day13Parsed), { select: true, markLatest: false, publishedAt: "2026-07-25T12:20:00+08:00" });
  context.__planetTest.importLearningPack(day14Parsed, context.__planetTest.buildLearningPackPreview(day14Parsed), { select: true, markLatest: true, publishedAt: "2026-07-26T11:25:00+08:00" });
  const day13Progress = context.__planetTest.initializeCourseProgress(day13Parsed);
  const day14Progress = context.__planetTest.initializeCourseProgress(day14Parsed);
  day13Progress.chinese.sections["chinese:reading"] = { finishedAt: "day13-kept" };
  day14Progress.chinese.sections["chinese:reading"] = { finishedAt: "day14-kept" };
  context.__planetTest.state.recordingClips = {
    "day13-recording": { clipId: "day13-recording", packId: day13Parsed.packId, sessionId: day13Progress.chinese.sessionId, planetId: "chinese", chunkCount: 1 },
    "day14-recording": { clipId: "day14-recording", packId: day14Parsed.packId, sessionId: day14Progress.chinese.sessionId, planetId: "chinese", chunkCount: 1 }
  };
  const beforeDay13Progress = JSON.stringify(context.__planetTest.state.courseProgress[day13Parsed.packId]);
  const beforeDay14Progress = JSON.stringify(context.__planetTest.state.courseProgress[day14Parsed.packId]);
  const beforeRecordings = JSON.stringify(context.__planetTest.state.recordingClips);

  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  assert(preview.valid && preview.warnings.length === 0, "Day15 Revision B pack should validate without warnings");
  context.__planetTest.importLearningPack(parsed, preview, { select: true, markLatest: true, publishedAt: "2026-07-27T00:00:00+08:00" });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const readiness = context.__planetTest.getFullCourseReadiness(parsed);
  assert(readiness.ready, `Day15 Revision B full-course readiness should pass: ${readiness.missing.join(",")}`);
  assert(JSON.stringify(context.__planetTest.state.courseProgress[day13Parsed.packId]) === beforeDay13Progress, "Importing Day15 must not change Day13 progress");
  assert(JSON.stringify(context.__planetTest.state.courseProgress[day14Parsed.packId]) === beforeDay14Progress, "Importing Day15 must not change Day14 progress");
  assert(JSON.stringify(context.__planetTest.state.recordingClips) === beforeRecordings, "Importing Day15 must not change existing recordings");
  assert(context.__planetTest.getLearningPackDates().join(",") === "2026-07-25,2026-07-26,2026-07-27", "Date archive should keep Day13, Day14, and Day15");
  assert(context.__planetTest.getPackIdForDate("2026-07-26") === day14Pack.packId, "Date menu should still switch back to Day14 Revision E");
  assert(context.__planetTest.getPackIdForDate("2026-07-27") === parsed.packId, "Date menu should resolve Day15 Revision B as latest for 2026-07-27");
  context.__planetTest.selectLearningPackDate("2026-07-26", false);
  assert(context.__planetTest.state.selectedLearningPackId === day14Pack.packId, "Selecting Day14 should switch active pack away from Day15");
  context.__planetTest.selectLearningPackDate("2026-07-27", false);
  assert(context.__planetTest.state.selectedLearningPackId === parsed.packId, "Selecting Day15 should switch active pack back to Revision B");

  assert(parsed.packId === "2026-07-27-helen-day15-revision-b-water-table-art01", "Day15 should use a revision-specific packId");
  assert(parsed.revision === "day15-chinese-revision-b-hello-school-art01", "Day15 should use the Revision B revision marker");
  assert(parsed.contentPolicy.authority === "codex-course-designer" && parsed.contentPolicy.websiteMode === "render-only" && parsed.contentPolicy.allowModelGeneration === false, "Day15 final pack policy must be render-only and model generation disabled");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).minutes === 23, "Day15 Chinese effective minutes should be 23");

  const sections = context.__planetTest.getChineseLessonSections(parsed);
  const expectedTitles = ["词语复习", "选词填空", "今日阅读", "词语积累", "阅读理解", "压缩复述", "固定休息", "小学情境", "阅读后测"];
  assert(sections.length === 9 && sections.map((section) => section.title).join("|") === expectedTitles.join("|"), "Day15 Chinese should follow the approved nine-section order");
  const pageHtml = sections.map((section, index) => context.__planetTest.renderChineseSection(parsed, section, index, progress)).join("");
  ["parentInstructionZh", "supportRulesZh", "stopRuleZh", "learningGoalZh", "referenceAnswer", "distractorRationale", "记录字段", "研发术语"].forEach((forbidden) => {
    assert(!pageHtml.includes(forbidden), `Day15 child page should not show parent/backend text: ${forbidden}`);
  });

  const review = sections.find((section) => section.id === "review_words");
  assert(review.items.map((item) => item.text).join(",") === "标签,核对,相配", "Day15 first section should show 标签、核对、相配");
  const reviewHtml = context.__planetTest.renderChineseSection(parsed, review, 0, progress);
  assert(reviewHtml.includes("说说它的意思") && reviewHtml.includes("用它说一句完整的话"), "Day15 first section should ask for meaning or sentence");

  const fill = sections.find((section) => section.id === "fill_blanks");
  assert(fill.questions.length === 3 && fill.questions.map((question) => question.answerPosition).join("-") === "B-A-C", "Day15 fill blanks should keep approved B-A-C answers");
  assert(fill.childInstructionZh.includes("备选词") && fill.childInstructionZh.includes("先") && fill.childInstructionZh.includes("然后") && fill.childInstructionZh.includes("最后"), "Day15 fill blanks should show the approved word bank");
  const fillHtml = context.__planetTest.renderChineseSection(parsed, fill, 1, progress);
  const fillText = visibleText(fillHtml).replace(/\s+/g, "");
  ["1.小禾准备画画", "2.她画好小猫", "3.东西都收好"].forEach((snippet) => assert(fillText.includes(snippet), `Day15 fill blanks should number and render sub-question: ${snippet}`));
  assert((fillHtml.match(/class="choice-letter"[^>]*><span[^>]*>A/g) || []).length >= 3 && /class="choice-letter"[^>]*><span[^>]*>B/.test(fillHtml) && /class="choice-letter"[^>]*><span[^>]*>C/.test(fillHtml), "Day15 fill blanks should render clickable A/B/C choices");

  const reading = sections.find((section) => section.id === "reading");
  const readingText = reading.paragraphs.join("");
  assert(reading.textTitle === "桌边的一小片水" && reading.paragraphs.length === 4, "Day15 reading should render the approved title and four paragraphs");
  assert((readingText.match(/[\u4e00-\u9fff]/g) || []).length === 160, "Day15 article should contain 160 Chinese characters");
  assert(readingText.includes("安安看见桌边有一小片水") && readingText.includes("问题才算真的解决"), "Day15 reading text should match the approved water story");

  const wordAccumulation = sections.find((section) => section.id === "word_accumulation");
  assert(wordAccumulation.questions.length === 2 && wordAccumulation.questions.map((question) => question.answer).join("|") === "轻轻|过了一会儿", "Day15 word accumulation should use the approved context blanks");
  assert(wordAccumulation.questions.map((question) => question.answerPosition).join("-") === "C-A", "Day15 word accumulation should preserve C-A answer letters");
  const wordHtml = context.__planetTest.renderChineseSection(parsed, wordAccumulation, 3, progress);
  const wordText = visibleText(wordHtml).replace(/\s+/g, "");
  assert(wordText.includes("安安______推了一下水杯") && wordText.includes("纸还是干的") && !wordText.includes("定位卡"), "Day15 word accumulation should not include Day14 location-card work");

  const comprehension = sections.find((section) => section.id === "comprehension");
  assert(comprehension.questions.length === 3, "Day15 reading comprehension should render all three questions");
  assert(comprehension.questions[0].options.length === 0 && comprehension.questions[1].options.length === 3 && comprehension.questions[2].options.length === 0, "Day15 comprehension should have oral, choice, oral");
  assert(comprehension.questions[1].answerPosition === "B", "Day15 comprehension choice answer should be B");

  const breakIndex = sections.findIndex((section) => section.id === "fixed_break");
  assert(breakIndex === 6 && sections[5].id === "four_grid_retell", "Day15 fixed break should sit after the sixth learning task");
  const day15BreakHtml = context.__planetTest.renderChineseSection(parsed, sections[breakIndex], breakIndex, progress);
  assert(day15BreakHtml.includes(">开始</button>") && day15BreakHtml.includes("准备休息"), "Day15 fixed break should use the compact rest entry state");
  assert(sections.find((section) => section.id === "school_scenario").title === "小学情境", "Day15 section 8 title should be 小学情境");

  const post = sections.find((section) => section.id === "post_check");
  assert(post.characters.join(",") === "标,配,签,杯,推,流" && post.words.join(",") === "标签,核对,杯盖", "Day15 post-check should contain exactly six characters and three words");
  const postHtml = context.__planetTest.renderChineseSection(parsed, post, 8, progress);
  const postText = visibleText(postHtml).replace(/\s+/g, "");
  ["标", "配", "签", "杯", "推", "流", "标签", "核对", "杯盖"].forEach((item, index) => {
    assert(postText.includes(item), `Day15 post-check should render approved item: ${item}`);
    assert(postHtml.includes(`<span class="term-index">${index + 1}</span>`), `Day15 post-check should show sequence ${index + 1}`);
  });

  const objectiveQuestions = [...fill.questions, ...wordAccumulation.questions, comprehension.questions[1]];
  assert(objectiveQuestions.map((question) => question.answerPosition).join("-") === "B-A-C-C-A-B", "Day15 objective answer letters should match B-A-C-C-A-B");
  objectiveQuestions.forEach((question, index) => {
    const order = context.__planetTest.getChineseQuestionOptionOrder(question, `day15_${index}`, {});
    const correctIndex = order.findIndex((option) => option === question.answer);
    assert(context.__planetTest.choiceLetter(correctIndex) === question.answerPosition, `Day15 ${question.id} answerPosition should match preserved option order`);
    assert(question.readAloud?.policy === "prompt_and_options" && question.readAloud.spokenTextZh.includes("A，") && question.readAloud.optionSpokenTexts.length === 3, `Day15 ${question.id} should keep complete prompt/options readAloud`);
  });
  const fillKey = "fill_blanks_0";
  context.__planetTest.selectCourseChoice({ dataset: { courseChoice: fillKey, choiceValue: "先", choiceAnswer: "先", choiceIndex: "1" } });
  let fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(fillProgress.pendingChoices?.[fillKey]?.selectedLetter === "B" && !fillProgress.choiceResults?.length && !fillProgress.attempts, "Day15 choices should remain pending before Confirm");
  context.__planetTest.selectCourseChoice({ dataset: { courseChoice: "fill_blanks_1", choiceValue: "然后", choiceAnswer: "然后", choiceIndex: "0" } });
  context.__planetTest.selectCourseChoice({ dataset: { courseChoice: "fill_blanks_2", choiceValue: "最后", choiceAnswer: "最后", choiceIndex: "2" } });
  fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(context.__planetTest.confirmChineseObjectiveSection("chinese:fill_blanks", fillProgress, progress), "Day15 fill blanks should confirm after all three choices are selected");
  fillProgress = progress.chinese.sections["chinese:fill_blanks"];
  assert(fillProgress.choiceResults.length === 3 && fillProgress.correctCount === 3 && fillProgress.attempts === 1, "Day15 fill blanks should grade once on confirm and store all choice results");

  const parsedDay14ForComparison = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  assert(JSON.stringify(parsed.english) === JSON.stringify(parsedDay14ForComparison.english), "Day15 should preserve the current approved English pack object");
  assert(JSON.stringify(parsed.art) === JSON.stringify(parsedDay14ForComparison.art), "Day15 should preserve the current approved Color Planet object");
  const artSteps = context.__planetTest.getArtLessonSteps(parsed);
  assert(artSteps.length === 14 && parsed.art.plannedMinutes === 52, "Day15 Color Planet should remain 14 steps and use the 52-minute professional lesson");
  assert(artSteps.every((step) => context.__planetTest.resolveArtImageAsset(parsed, step.imageAssetId).url), "Day15 art steps should all resolve real image URLs");
  assert(context.__planetTest.getPlanetStatus("chinese", parsed).progress === "0/8", "Day15 Chinese progress should start at 0/8 learning sections");
  assert(context.__planetTest.getPlanetStatus("english", parsed).progress === "0/7", "Day15 English pack progress should start at 0/7");
  assert(context.__planetTest.getPlanetStatus("art", parsed).progress === "0/14", "Day15 art progress should start at 0/14");
}

{
  const fetchMap = {
    "./data/learning-packs/manifest.json": legacyBuiltinManifest,
    "data/learning-packs/manifest.json": legacyBuiltinManifest,
    "./data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json": day15Pack,
    "data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json": day15Pack,
    "./data/learning-packs/helen-learning-pack-2026-07-26-day14-revision-e.json": day14Pack,
    "data/learning-packs/helen-learning-pack-2026-07-26-day14-revision-e.json": day14Pack,
    "./data/learning-packs/helen-learning-pack-2026-07-25-day13-rev2.json": day13Rev2Pack,
    "data/learning-packs/helen-learning-pack-2026-07-25-day13-rev2.json": day13Rev2Pack,
    "./data/learning-packs/helen-learning-pack-2026-07-25-day13.json": day13Pack,
    "data/learning-packs/helen-learning-pack-2026-07-25-day13.json": day13Pack
  };
  const seedClock = { now: Date.parse("2026-07-26T00:10:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const staleRev2 = JSON.parse(JSON.stringify(day13Rev2Pack));
  staleRev2.art = JSON.parse(JSON.stringify(day13Pack.art));
  const staleParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(staleRev2));
  seedContext.__planetTest.importLearningPack(staleParsed, seedContext.__planetTest.buildLearningPackPreview(staleParsed), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  const staleProgress = seedContext.__planetTest.initializeCourseProgress(staleParsed);
  staleProgress.chinese.sections["chinese:reading"] = { finishedAt: "old-progress-kept", result: "independent" };
  seedContext.__planetTest.state.recordingClips = {
    "old-recording": {
      clipId: "old-recording",
      sessionId: staleProgress.chinese.sessionId,
      packId: staleParsed.packId,
      planetId: "chinese",
      activityId: "chinese:course_recording",
      includeInFeedback: true,
      chunkCount: 2,
      status: "complete"
    }
  };
  seedContext.__planetTest.saveState();
  const beforeProgress = JSON.stringify(seedContext.__planetTest.state.courseProgress[day13Rev2Pack.packId]);
  const beforeRecording = JSON.stringify(seedContext.__planetTest.state.recordingClips);
  assert(seedContext.__planetTest.getArtLessonSteps(staleParsed).length === 6, "Seed should mimic an old same-pack Day13 with only the old art steps");

  const upgraded = makeContext(seedContext.__store, seedClock, { fetchMap });
  await upgraded.__planetTest.loadBuiltinLearningPack();
  const refreshedRev2 = upgraded.__planetTest.state.learningPacks[day13Rev2Pack.packId].data;
  assert(upgraded.__planetTest.getArtLessonSteps(refreshedRev2).length === 14, "Builtin full refresh should replace stale same-pack Day13 data with rev2 14-step art");
  assert(upgraded.__planetTest.getArtLessonSteps(refreshedRev2).every((step) => step.imageAssetId !== "daily_pack"), "Refreshed Day13 rev2 should not keep stale daily_pack image ids");
  assert(upgraded.__planetTest.state.learningPacks[day14Pack.packId] && upgraded.__planetTest.state.learningPacks[day15Pack.packId], "Day14 and Day15 should be imported into local history during startup");
  assert(upgraded.__planetTest.state.selectedLearningPackId === day15Pack.packId, "Automatic built-in users should move to the new Day15 latest");
  assert(upgraded.__planetTest.state.learningPackSelectionSource === "auto" && upgraded.__planetTest.state.lastAutoSelectedBuiltinPackId === day15Pack.packId, "Automatic selection policy should record the new latest");
  assert(upgraded.__planetTest.getPackIdForDate("2026-07-25") === day13Rev2Pack.packId, "Date menu should resolve Day13 to refreshed rev2");
  assert(upgraded.__planetTest.getPackIdForDate("2026-07-26") === day14Pack.packId, "Date menu should expose Day14 as history");
  assert(upgraded.__planetTest.getPackIdForDate("2026-07-27") === day15Pack.packId, "Date menu should expose Day15 as the next day");
  assert(upgraded.__planetTest.getLearningPackDates().join(",") === "2026-07-25,2026-07-26,2026-07-27", "Manifest full load should archive Day13, Day14, and Day15 dates");
  assert(JSON.stringify(upgraded.__planetTest.state.courseProgress[day13Rev2Pack.packId]) === beforeProgress, "Refreshing same-pack data must not overwrite Day13 progress");
  assert(JSON.stringify(upgraded.__planetTest.state.recordingClips) === beforeRecording, "Refreshing same-pack data must not overwrite Day13 recordings");
  assert(upgraded.__planetTest.getCourseProgress().packId === upgraded.__planetTest.state.selectedLearningPackId, "No-arg getCourseProgress should follow the selected pack, not a different latest pack");
  const day14ArtHtml = upgraded.__planetTest.getArtLessonSteps(upgraded.__planetTest.getSelectedLearningPack()).map((step, index) => upgraded.__planetTest.renderArtStep(upgraded.__planetTest.getSelectedLearningPack(), step, index, upgraded.__planetTest.getCourseProgress())).join("");
  assert(!day14ArtHtml.includes("缺少 daily_pack") && !day14ArtHtml.includes("学习包未提供步骤图"), "Upgraded selected art should render real manifest images instead of stale missing-image text");

  upgraded.__planetTest.selectLearningPackDate("2026-07-25", false);
  assert(upgraded.__planetTest.state.selectedLearningPackId === day13Rev2Pack.packId && upgraded.__planetTest.state.learningPackSelectionSource === "manual", "Manual Day13 date selection should be recorded");
  upgraded.__planetTest.saveState();
  const manualReload = makeContext(upgraded.__store, seedClock, { fetchMap });
  await manualReload.__planetTest.loadBuiltinLearningPack();
  assert(manualReload.__planetTest.state.selectedLearningPackId === day13Rev2Pack.packId, "Manual historical date should remain selected after a fresh builtin refresh");
  assert(manualReload.__planetTest.getArtLessonSteps(manualReload.__planetTest.getSelectedLearningPack()).length === 14, "Manual Day13 selection should still use refreshed rev2 content");
  assert(manualReload.__planetTest.getCourseProgress().packId === day13Rev2Pack.packId, "Manual historical selection should keep progress and content on the same pack");
}

{
  assert(builtinBundle.version === makeContext().__planetTest.APP_METADATA.version, "Built-in JS bundle version should match app metadata");
  assert(builtinBundle.manifest.latestPackId === revisionAPack.packId, "Built-in JS bundle should carry the current manifest latest");
  assert([day13Pack.packId, day13Rev2Pack.packId, day14Pack.packId, day15Pack.packId, revisionAPack.packId].every((packId) => builtinBundle.packs[packId]), "Built-in JS bundle should contain all official archived packs");
  assert(!builtinBundle.packs[oldDay14Pack.packId], "Built-in JS bundle should not expose the withdrawn old Day14 pack");
  assert(!builtinBundle.packs[day14RevisionDPack.packId], "Built-in JS bundle should not expose the withdrawn Revision D pack");
  const seedClock = { now: Date.parse("2026-07-26T00:30:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const staleRev2 = JSON.parse(JSON.stringify(day13Rev2Pack));
  staleRev2.art = JSON.parse(JSON.stringify(day13Pack.art));
  const staleParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(staleRev2));
  seedContext.__planetTest.importLearningPack(staleParsed, seedContext.__planetTest.buildLearningPackPreview(staleParsed), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  const staleProgress = seedContext.__planetTest.initializeCourseProgress(staleParsed);
  staleProgress.art.steps["art:old_step"] = { finishedAt: "old-art-progress-kept", result: "independent" };
  seedContext.__planetTest.state.recordingClips = {
    "file-old-recording": {
      clipId: "file-old-recording",
      sessionId: staleProgress.chinese.sessionId,
      packId: staleParsed.packId,
      planetId: "chinese",
      activityId: "chinese:course_recording",
      includeInFeedback: true,
      chunkCount: 1,
      status: "complete"
    }
  };
  seedContext.__planetTest.saveState();
  const beforeProgress = JSON.stringify(seedContext.__planetTest.state.courseProgress[day13Rev2Pack.packId]);
  const beforeRecording = JSON.stringify(seedContext.__planetTest.state.recordingClips);
  const fileContext = makeContext(seedContext.__store, seedClock, {
    builtinBundle: legacyBuiltinBundle,
    location: {
      protocol: "file:",
      origin: "null",
      pathname: "/Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html",
      href: "file:///Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html#art-planet",
      hash: "#art-planet"
    }
  });
  await fileContext.__planetTest.loadBuiltinLearningPack();
  const selectedPack = fileContext.__planetTest.getSelectedLearningPack();
  assert(fileContext.__planetTest.state.builtinLearningPackLoad?.ok === true && fileContext.__planetTest.state.builtinLearningPackLoad.stage === "file_bundle", `file:// startup should load built-in packs from the JS bundle: ${JSON.stringify(fileContext.__planetTest.state.builtinLearningPackLoad)}`);
  assert(fileContext.__planetTest.state.selectedLearningPackId === day15Pack.packId, "file:// automatic users should upgrade from stale Day13 to Day15 latest");
  assert(selectedPack.packId === day15Pack.packId && selectedPack.revision === "day15-chinese-revision-b-hello-school-art01", "file:// selected course should be Day15 Revision B, not stale Day13 or old Day14");
  assert(fileContext.__planetTest.getPlanetStatus("art", selectedPack).progress === "0/14", "file:// selected art card should show Day15 0/14");
  assert(fileContext.__planetTest.state.learningPacks[day13Rev2Pack.packId], "file:// startup should retain refreshed Day13 rev2 in local history");
  assert(fileContext.__planetTest.getArtLessonSteps(fileContext.__planetTest.state.learningPacks[day13Rev2Pack.packId].data).length === 14, "file:// bundle should refresh stale same-pack Day13 rev2 data to 14 steps");
  assert(JSON.stringify(fileContext.__planetTest.state.courseProgress[day13Rev2Pack.packId]) === beforeProgress, "file:// bundle refresh must preserve existing Day13 progress");
  assert(JSON.stringify(fileContext.__planetTest.state.recordingClips) === beforeRecording, "file:// bundle refresh must preserve existing recordings");
  assert(fileContext.__planetTest.getCourseProgress().packId === fileContext.__planetTest.state.selectedLearningPackId, "file:// selected content and no-arg progress should use the same packId");
  const selectedArtSteps = fileContext.__planetTest.getArtLessonSteps(selectedPack);
  const selectedArtAssets = selectedArtSteps.map((step) => fileContext.__planetTest.resolveArtImageAsset(selectedPack, step.imageAssetId));
  assert(selectedArtSteps.length === 14 && selectedArtAssets.length === 14, "file:// Day15 art should expose 14 steps and 14 image assets");
  assert(selectedArtAssets.every((asset) => asset?.url && !asset.url.includes("daily_pack")), "file:// Day15 art image URLs must not use stale daily_pack placeholders");
  for (const asset of selectedArtAssets) {
    assert(fs.existsSync(new URL(`./${asset.url}`, import.meta.url)), `Art asset file should exist for file:// bundle path: ${asset.url}`);
  }
  const day14ArtHtml = selectedArtSteps.map((step, index) => fileContext.__planetTest.renderArtStep(selectedPack, step, index, fileContext.__planetTest.getCourseProgress())).join("");
  assert((day14ArtHtml.match(/<img src=/g) || []).length === 14, "file:// rendered Day15 art should contain 14 img tags");
  assert(!day14ArtHtml.includes("学习包未提供步骤图") && !day14ArtHtml.includes("步骤图文件暂未到位"), `file:// rendered Day15 art should not show stale missing-image copy: noAsset=${day14ArtHtml.includes("学习包未提供步骤图")} missing=${day14ArtHtml.includes("步骤图文件暂未到位")}`);

  fileContext.__planetTest.selectLearningPackDate("2026-07-25", false);
  fileContext.__planetTest.saveState();
  const manualFileReload = makeContext(fileContext.__store, seedClock, {
    builtinBundle: legacyBuiltinBundle,
    location: {
      protocol: "file:",
      origin: "null",
      pathname: "/Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html",
      href: "file:///Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html#art-planet?date=2026-07-25",
      hash: "#art-planet?date=2026-07-25"
    }
  });
  await manualFileReload.__planetTest.loadBuiltinLearningPack();
  assert(manualFileReload.__planetTest.state.selectedLearningPackId === day13Rev2Pack.packId, "file:// manual historical Day13 selection should be preserved across refresh");
  assert(manualFileReload.__planetTest.getArtLessonSteps(manualFileReload.__planetTest.getSelectedLearningPack()).length === 14, "file:// manual historical Day13 should still render refreshed 14-step rev2 content");
}

{
  const seedClock = { now: Date.parse("2026-07-26T00:35:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const staleParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  seedContext.__planetTest.importLearningPack(staleParsed, seedContext.__planetTest.buildLearningPackPreview(staleParsed), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  seedContext.__planetTest.initializeCourseProgress(staleParsed);
  seedContext.__planetTest.saveState();
  const failedFile = makeContext(seedContext.__store, seedClock, {
    location: {
      protocol: "file:",
      origin: "null",
      pathname: "/Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html",
      href: "file:///Users/jackie/Documents/Codex/2026-07-02/wo-ji/outputs/hanzi-memory-app/index.html#art-planet",
      hash: "#art-planet"
    }
  });
  await failedFile.__planetTest.loadBuiltinLearningPack();
  assert(failedFile.__planetTest.state.builtinLearningPackLoad?.ok === false && failedFile.__planetTest.state.builtinLearningPackLoad.stage === "file_bundle_unavailable", "file:// should show a real failure only when the JS bundle is unavailable");
  const notice = failedFile.__planetTest.renderBuiltinPackLoadNotice(failedFile.__planetTest.getSelectedLearningPack());
  assert(notice.includes("课程更新失败") && notice.includes("请刷新页面重试") && !notice.includes("file_bundle_unavailable") && !notice.includes(failedFile.__planetTest.getSelectedLearningPack().packId), "Family-facing failure notice should stay useful without exposing internal stage or pack IDs");
}

{
  const seedClock = { now: Date.parse("2026-07-26T00:40:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const staleParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  seedContext.__planetTest.importLearningPack(staleParsed, seedContext.__planetTest.buildLearningPackPreview(staleParsed), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  seedContext.__planetTest.initializeCourseProgress(staleParsed);
  seedContext.__planetTest.saveState();
  const fallbackContext = makeContext(seedContext.__store, seedClock, {
    builtinBundle: legacyBuiltinBundle,
    fetchMap: {
      "./data/learning-packs/manifest.json": { status: 503, error: "temporary unavailable" },
      "data/learning-packs/manifest.json": { status: 503, error: "temporary unavailable" }
    },
    failMissingFetch: true
  });
  await fallbackContext.__planetTest.loadBuiltinLearningPack();
  assert(fallbackContext.__planetTest.state.builtinLearningPackLoad?.ok === true && fallbackContext.__planetTest.state.builtinLearningPackLoad.stage === "bundle_fallback", "HTTP fetch failure should fall back to the built-in JS bundle");
  assert(fallbackContext.__planetTest.state.selectedLearningPackId === day15Pack.packId, "HTTP bundle fallback should still select Day15 latest for automatic users");
  assert(fallbackContext.__planetTest.getArtLessonSteps(fallbackContext.__planetTest.getSelectedLearningPack()).length === 14, "HTTP bundle fallback should render the current 14-step art lesson");
}

{
  const seedClock = { now: Date.parse("2026-07-26T00:20:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const staleParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  seedContext.__planetTest.importLearningPack(staleParsed, seedContext.__planetTest.buildLearningPackPreview(staleParsed), { select: true, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00" });
  seedContext.__planetTest.initializeCourseProgress(staleParsed);
  seedContext.__planetTest.saveState();
  const failingManifest = JSON.parse(JSON.stringify(builtinManifest));
  const fetchMap = {
    "./data/learning-packs/manifest.json": failingManifest,
    "data/learning-packs/manifest.json": failingManifest,
    "./data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json": { status: 503, error: "unavailable" },
    "data/learning-packs/helen-learning-pack-2026-07-27-day15-revision-b.json": { status: 503, error: "unavailable" }
  };
  const failed = makeContext(seedContext.__store, seedClock, { fetchMap, failMissingFetch: true });
  await failed.__planetTest.loadBuiltinLearningPack();
  assert(failed.__planetTest.state.builtinLearningPackLoad?.ok === false, "Builtin pack request failure should be recorded");
  const notice = failed.__planetTest.renderBuiltinPackLoadNotice(failed.__planetTest.getSelectedLearningPack());
  assert(notice.includes("课程更新失败") && notice.includes("当前课程仍可继续") && !notice.includes("2026-") && !notice.includes(day13Rev2Pack.packId) && !notice.includes("load_error"), "Student failure notice should preserve access without exposing internal date identifiers");
  assert(!notice.includes("今日课程已准备好"), "Failure state must not masquerade as a ready course");
}

{
  const context = makeContext();
  const familyTitleB = context.__planetTest.familyFacingPackTitle(day15Pack.title);
  const familyTitleE = context.__planetTest.familyFacingPackTitle(day14Pack.title);
  assert(familyTitleB === "Helen Day 15｜桌边的一小片水、Hello School与颜色星球续课", "Day15 family title should hide Revision B");
  assert(familyTitleE === "Helen Day 14｜贴歪的作品标签、Hello School与颜色星球续课", "Day14 family title should hide Revision E");
  assert(context.__planetTest.getStudentCourseTitle(day15Pack, "chinese") === "桌边的一小片水", "Student Chinese title should remove Day and Revision prefixes");
  assert(context.__planetTest.getStudentCourseTitle(day14Pack, "chinese") === "贴歪的作品标签", "Student Chinese title should show only the content title");
  assert(!/Day|Revision|2026-/.test(context.__planetTest.getStudentCourseTitle(day15Pack, "chinese")), "Student course title should not expose date metadata");
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  context.__planetTest.state.builtinLearningPackLoad = { ok: true };
  const notice = context.__planetTest.renderBuiltinPackLoadNotice(parsed);
  assert(notice === "", "Stable student course state should not render a redundant ready notice");
}

{
  const seedClock = { now: Date.parse("2026-07-27T01:00:00.000Z") };
  const seedContext = makeContext({}, seedClock);
  const day13Parsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  const day14OldParsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day14RevisionDPack));
  const day14Parsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  const day15Parsed = seedContext.__planetTest.parseLearningPackInput(JSON.stringify(day15Pack));
  seedContext.__planetTest.importLearningPack(day13Parsed, seedContext.__planetTest.buildLearningPackPreview(day13Parsed), { select: true, markLatest: false, publishedAt: "2026-07-25T12:20:00+08:00" });
  seedContext.__planetTest.importLearningPack(day14OldParsed, seedContext.__planetTest.buildLearningPackPreview(day14OldParsed), { select: false, markLatest: false, publishedAt: "2026-07-26T09:00:00+08:00" });
  seedContext.__planetTest.importLearningPack(day14Parsed, seedContext.__planetTest.buildLearningPackPreview(day14Parsed), { select: true, markLatest: false, publishedAt: "2026-07-26T11:25:00+08:00" });
  seedContext.__planetTest.importLearningPack(day15Parsed, seedContext.__planetTest.buildLearningPackPreview(day15Parsed), { select: true, markLatest: true, publishedAt: "2026-07-27T00:00:00+08:00" });
  const seededSequence = seedContext.__planetTest.getLearningCourseSequence("chinese");
  assert(seededSequence.length === 3, "Same-course Chinese revisions should collapse to one sequence item");
  assert(seededSequence.map((item) => item.packId).join(",") === [day13Parsed.packId, day14Parsed.packId, day15Parsed.packId].join(","), "Chinese sequence should keep final revisions in publication order");
  const seededArtSequence = seedContext.__planetTest.getLearningCourseSequence("art");
  assert(seededArtSequence.length === 1 && seededArtSequence[0].packId === day15Parsed.packId, "Existing Color Planet revisions should remain one compatible course sequence item");
  const day13Progress = seedContext.__planetTest.initializeCourseProgress(day13Parsed);
  const day14Progress = seedContext.__planetTest.initializeCourseProgress(day14Parsed);
  const day15Progress = seedContext.__planetTest.initializeCourseProgress(day15Parsed);
  day13Progress.chinese.sections["chinese:legacy"] = { finishedAt: "day13-kept" };
  day14Progress.chinese.sections["chinese:revision_e"] = { finishedAt: "day14-kept" };
  day15Progress.chinese.sections["chinese:revision_b"] = { finishedAt: "day15-kept" };
  seedContext.__planetTest.state.recordingClips = {
    "day13-recording": { clipId: "day13-recording", packId: day13Rev2Pack.packId, sessionId: day13Progress.chinese.sessionId, planetId: "chinese", chunkCount: 1 },
    "day14-recording": { clipId: "day14-recording", packId: day14Pack.packId, sessionId: day14Progress.chinese.sessionId, planetId: "chinese", chunkCount: 1 },
    "day15-recording": { clipId: "day15-recording", packId: day15Pack.packId, sessionId: day15Progress.chinese.sessionId, planetId: "chinese", chunkCount: 1 }
  };
  seedContext.__planetTest.saveState();
  const beforeRecording = JSON.stringify(seedContext.__planetTest.state.recordingClips);
  const context = makeContext(seedContext.__store, seedClock, {
    builtinBundle: legacyBuiltinBundle,
    location: {
      protocol: "http:",
      origin: "http://127.0.0.1:4173",
      pathname: "/",
      href: "http://127.0.0.1:4173/#today-chinese?date=2026-07-27",
      hash: "#today-chinese?date=2026-07-27"
    }
  });
  await context.__planetTest.loadBuiltinLearningPack();
  context.__planetTest.bindNavigation();
  context.__planetTest.showView("today-chinese", false);
  const clickCourse = (dataset) => {
    const target = {
      dataset,
      closest: (selector) => {
        if (selector.includes("[data-course-pack]") && dataset.coursePack) return target;
        if (selector.includes("[data-course-sequence-nav]") && dataset.courseSequenceNav) return target;
        if (selector.includes("[data-go-view]") && dataset.goView) return target;
        return null;
      }
    };
    context.__dispatchDocumentEvent("click", { target, preventDefault: () => {} });
  };
  const headerHtml = () => context.__elements.get("#chineseLessonHeader")?.innerHTML || "";
  assert(context.__planetTest.state.selectedLearningPackId === day15Pack.packId, "Route date 2026-07-27 should initially select Day15 Revision B");
  assert(context.location.hash === "#chinese-course", "Legacy date route should be rewritten to the date-free Chinese course route");
  assert(headerHtml().includes("桌边的一小片水"), "Initial real page render should show Day15 title");
  assert(!/Day|Revision|2026-|今日|每日|Today|日期/.test(visibleText(headerHtml())), "Student Chinese course header should hide date-driven labels");
  clickCourse({ coursePack: day14Pack.packId, courseKind: "chinese" });
  assert(context.__planetTest.state.selectedLearningPackId === day14Pack.packId, "Selecting the prior course should open Day14 final Revision E");
  assert(context.location.hash === "#chinese-course", "Course selection should keep a date-free hash");
  assert(visibleText(headerHtml()).replace(/\s+/g, "").includes("贴歪的作品标签"), "Prior-course selection should render the correct Chinese content title");
  assert(context.__planetTest.getCourseProgress().packId === day14Pack.packId, "Day14 content and default course progress should use the same packId");
  clickCourse({ courseSequenceNav: "prev", courseKind: "chinese" });
  assert(context.__planetTest.state.selectedLearningPackId === day13Rev2Pack.packId, "Previous course should follow publication sequence");
  assert(headerHtml().includes("大树的影子有多长"), "Previous course should render Day13 content without the Day prefix");
  clickCourse({ goView: "chinese-course" });
  assert(context.__planetTest.state.selectedLearningPackId === day15Pack.packId && context.location.hash === "#chinese-course", "Primary Chinese entry should open the latest released course");
  assert(headerHtml().includes("桌边的一小片水"), "Primary Chinese entry should render the latest Day15 title");
  clickCourse({ courseSequenceNav: "prev", courseKind: "chinese" });
  assert(context.__planetTest.state.selectedLearningPackId === day14Pack.packId, "Previous course from latest should open Day14 final revision");
  clickCourse({ courseSequenceNav: "latest", courseKind: "chinese" });
  assert(context.__planetTest.state.selectedLearningPackId === day15Pack.packId && context.location.hash === "#chinese-course", "Latest course should return to the highest published sequence");
  clickCourse({ courseSequenceNav: "prev", courseKind: "chinese" });
  clickCourse({ courseSequenceNav: "next", courseKind: "chinese" });
  assert(context.__planetTest.state.selectedLearningPackId === day15Pack.packId, "Next course should return from Day14 to Day15");
  assert(context.__planetTest.getCourseProgress().packId === day15Pack.packId, "After sequence navigation, selected content and progress should stay aligned");
  assert(context.__planetTest.state.courseProgress[day13Rev2Pack.packId]?.chinese?.sections?.["chinese:legacy"]?.finishedAt === "day13-kept", "Course switching must preserve existing Day13 progress fields");
  assert(context.__planetTest.state.courseProgress[day14Pack.packId]?.chinese?.sections?.["chinese:revision_e"]?.finishedAt === "day14-kept", "Course switching must preserve existing Day14 progress fields");
  assert(context.__planetTest.state.courseProgress[day15Pack.packId]?.chinese?.sections?.["chinese:revision_b"]?.finishedAt === "day15-kept", "Course switching must preserve existing Day15 progress fields");
  assert(JSON.stringify(context.__planetTest.state.recordingClips) === beforeRecording, "Course switching must not delete or mutate recordings");
  const switcher = context.__planetTest.renderCourseSequenceSwitcher("chinese");
  assert(switcher.includes("← 上一课") && switcher.includes("最新课程") && switcher.includes("下一课 →"), "Chinese switcher should use course sequence controls");
  assert(switcher.includes("<select data-course-pack-select") && !switcher.includes("<details"), "Chinese course history should use one native select instead of a button list");
  assert((switcher.match(/<option /g) || []).length === context.__planetTest.getLearningCourseSequence("chinese").length, "Course select should contain every historical Chinese course");
  const courseSelectCss = stylesSource.match(/\.course-pack-select-label select,\s*\.english-lesson-select-label select\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(/height\s*:\s*48px/.test(courseSelectCss) && /border-radius\s*:\s*14px/.test(courseSelectCss) && /font\s*:\s*inherit/.test(courseSelectCss), "Chinese and English course selects should share the signed-off 48px control style");
  assert(/\.date-switcher > \.compact-button\s*\{[\s\S]*?min-height:\s*48px/.test(stylesSource), "Course navigation buttons should share the select height");
  assert(/\.course-pack-select-label\s*\{[\s\S]*?align-self:\s*center;[\s\S]*?min-height:\s*48px;[\s\S]*?margin:\s*0/.test(stylesSource), "Chinese course select should remove the inherited label margin and center with its navigation buttons");
  assert(!/2026-|前一天|后一天|今天|Today|Day|Revision|日期/.test(visibleText(switcher)), "Course switcher should not expose calendar labels");
  context.__dispatchDocumentEvent("change", {
    target: {
      value: day14Pack.packId,
      dataset: { courseKind: "chinese" },
      matches: (selector) => selector === "[data-course-pack-select]"
    }
  });
  assert(context.__planetTest.state.selectedLearningPackId === day14Pack.packId, "Changing the native course select should switch course content and progress");
}

{
  const context = makeContext();
  const objectivePack = JSON.parse(JSON.stringify(day13Rev2Pack));
  objectivePack.packId = "2026-07-25-helen-day13-choice-flow-test";
  objectivePack.title = "Choice Flow Test";
  objectivePack.chinese.lesson.sections = [{
    id: "objective_gate",
    type: "comprehension",
    title: "客观题确认",
    plannedMinutes: 5,
    parentInstructionZh: "先选，再确认。",
    readAloud: { policy: "instruction_only", spokenTextZh: "请先选，再确认。" },
    questions: [
      { prompt: "天空是什么颜色？", options: ["蓝色", "绿色"], answer: "蓝色", readAloud: { policy: "prompt_and_options", spokenTextZh: "天空是什么颜色？" } },
      { prompt: "大树后来怎样了？", options: ["变矮", "变高", "不见了"], answer: "变高", readAloud: { policy: "prompt_and_options", spokenTextZh: "大树后来怎样了？" } },
      { prompt: "测量前应该先做什么？", options: ["统一步长", "直接猜", "换题目", "马上休息"], answer: "统一步长", readAloud: { policy: "prompt_and_options", spokenTextZh: "测量前应该先做什么？" } }
    ]
  }];
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(objectivePack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed), { select: true, markLatest: true });
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const section = context.__planetTest.getChineseLessonSections(parsed)[0];
  const sectionKey = "chinese:objective_gate";
  let item = progress.chinese.sections[sectionKey];
  const q0Key = "objective_gate_0";
  const q1Key = "objective_gate_1";
  const q2Key = "objective_gate_2";
  const html2 = context.__planetTest.renderCourseQuestion(section.questions[0], q0Key, item);
  const html3 = context.__planetTest.renderCourseQuestion(section.questions[1], q1Key, item);
  const html4 = context.__planetTest.renderCourseQuestion(section.questions[2], q2Key, item);
  assert(/class="choice-letter"[^>]*><span[^>]*>A/.test(html2) && /class="choice-letter"[^>]*><span[^>]*>B/.test(html2) && !/class="choice-letter"[^>]*><span[^>]*>C/.test(html2), "Two-option Chinese question should show A/B only");
  assert(/class="choice-letter"[^>]*><span[^>]*>A/.test(html3) && /class="choice-letter"[^>]*><span[^>]*>B/.test(html3) && /class="choice-letter"[^>]*><span[^>]*>C/.test(html3), "Three-option Chinese question should show A/B/C");
  assert(/class="choice-letter"[^>]*><span[^>]*>D/.test(html4), "Four-option Chinese question should show A/B/C/D");
  const choiceLetterCss = stylesSource.match(/\.course-choice-button \.choice-letter\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(choiceLetterCss, "Choice letter centering should be fixed through the shared course-choice-button selector");
  assert(/inline-size\s*:\s*44px/.test(choiceLetterCss) && /block-size\s*:\s*44px/.test(choiceLetterCss), "Choice letter control should expose a 44px touch target");
  assert(/min-inline-size\s*:\s*44px/.test(choiceLetterCss) && /min-block-size\s*:\s*44px/.test(choiceLetterCss), "Choice letter touch target should not collapse on mobile");
  assert(/display\s*:\s*inline-flex/.test(choiceLetterCss) && /align-items\s*:\s*center/.test(choiceLetterCss) && /justify-content\s*:\s*center/.test(choiceLetterCss), "Choice letter should use flex centering on both axes");
  assert(/flex-shrink\s*:\s*0/.test(choiceLetterCss) && /flex\s*:\s*0 0 44px/.test(choiceLetterCss), "Choice letter touch target should not shrink inside option rows");
  assert(/margin-top\s*:\s*0/.test(choiceLetterCss) && /padding\s*:\s*0/.test(choiceLetterCss), "Choice letter should reset generic button span spacing");
  assert(/font-size\s*:\s*15px/.test(choiceLetterCss) && /font-weight\s*:\s*var\(--weight-emphasis\)/.test(choiceLetterCss) && /line-height\s*:\s*1/.test(choiceLetterCss) && /opacity\s*:\s*1/.test(choiceLetterCss), "Choice letter should reset generic button span font and opacity using the visual hierarchy token");
  const choiceLetterVisualCss = stylesSource.match(/\.course-choice-button \.choice-letter > span\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(/inline-size\s*:\s*28px/.test(choiceLetterVisualCss) && /block-size\s*:\s*28px/.test(choiceLetterVisualCss), "Choice letter should keep a compact 28px visual circle inside the 44px touch target");
  assert(!/rw1|iw1|cq1|objective_gate|data-course-choice/.test(stylesSource), "Choice letter fix should not target a single question or data attribute");
  const q1Order = context.__planetTest.getChineseQuestionOptionOrder(section.questions[1], q1Key, item);
  const selectValue = (key, value) => context.__planetTest.selectCourseChoice({ dataset: { courseChoice: key, choiceValue: value } });
  selectValue(q1Key, q1Order[1]);
  item = progress.chinese.sections[sectionKey];
  assert(item.pendingChoices[q1Key].selected === q1Order[1] && item.pendingChoices[q1Key].selectedLetter === "B", "Clicking B should store a pending B choice");
  assert(!item.choiceResults?.length && !item.attempts && !item.result, "Selecting an option must not grade or increment attempts");
  let selectedHtml = context.__planetTest.renderCourseQuestion(section.questions[1], q1Key, item);
  assert(/course-choice-button selected"[^>]*>[\s\S]*class="choice-letter"[^>]*><span[^>]*>B<\/span><\/button>/.test(selectedHtml), "Pending B choice should render blue selected state");
  selectValue(q1Key, q1Order[2]);
  item = progress.chinese.sections[sectionKey];
  assert(item.pendingChoices[q1Key].selected === q1Order[2] && item.pendingChoices[q1Key].selectedLetter === "C", "Changing to C should move the pending choice");
  selectedHtml = context.__planetTest.renderCourseQuestion(section.questions[1], q1Key, item);
  assert((selectedHtml.match(/course-choice-button selected/g) || []).length === 1 && /course-choice-button selected"[^>]*>[\s\S]*class="choice-letter"[^>]*><span[^>]*>C<\/span><\/button>/.test(selectedHtml), "Only C should remain selected after changing from B");
  context.__planetTest.completeCourseItem(sectionKey);
  item = progress.chinese.sections[sectionKey];
  assert(!item.finishedAt && item.confirmationMessage === "请先完成第1题", "Confirming with a missing objective question should be blocked");
  assert(!item.attempts && !item.choiceResults?.length, "Blocked confirmation must not grade or increment attempts");
  const q0Order = context.__planetTest.getChineseQuestionOptionOrder(section.questions[0], q0Key, item);
  const q2Order = context.__planetTest.getChineseQuestionOptionOrder(section.questions[2], q2Key, item);
  selectValue(q0Key, section.questions[0].answer);
  const q1Wrong = q1Order.find((option) => option !== section.questions[1].answer);
  selectValue(q1Key, q1Wrong);
  selectValue(q2Key, section.questions[2].answer);
  item = progress.chinese.sections[sectionKey];
  const orderBeforeConfirm = {
    [q0Key]: [...item.pendingChoices[q0Key].optionOrder],
    [q1Key]: [...item.pendingChoices[q1Key].optionOrder],
    [q2Key]: [...item.pendingChoices[q2Key].optionOrder]
  };
  context.__planetTest.completeCourseItem(sectionKey);
  item = progress.chinese.sections[sectionKey];
  assert(item.finishedAt && item.attempts === 1, "A full confirmation should finish the section and increment attempts once");
  assert(item.choiceResults.length === 3 && item.correctCount === 2 && item.totalCount === 3 && item.allCorrect === false, "Confirmation should store aggregate choice score");
  const wrongResult = item.choiceResults.find((entry) => entry.questionKey === q1Key);
  assert(wrongResult && wrongResult.correct === false && wrongResult.selected === q1Wrong && wrongResult.answer === section.questions[1].answer, "Wrong answer should be recorded after confirmation");
  assert(wrongResult.selectedLetter && wrongResult.correctLetter && wrongResult.selectedAt && wrongResult.confirmedAt, "Choice result should include letters and timestamps");
  assert(JSON.stringify(wrongResult.optionOrder) === JSON.stringify(orderBeforeConfirm[q1Key]), "Wrong answer option order should remain stable after confirmation");
  const confirmedHtml = context.__planetTest.renderCourseQuestion(section.questions[1], q1Key, item);
  assert(confirmedHtml.includes("再想想") && JSON.stringify(context.__planetTest.getChineseQuestionOptionOrder(section.questions[1], q1Key, item)) === JSON.stringify(orderBeforeConfirm[q1Key]), "Confirmed wrong question should show feedback without moving options");
  const correctLetters = new Set(item.choiceResults.map((entry) => entry.correctLetter));
  assert(correctLetters.size >= 2, "Correct answer letters should vary across a group, not stay fixed to one letter");
  const feedback = context.__planetTest.buildFeedbackPackage("chinese").payload;
  const feedbackResults = feedback.chinese.choiceResults.filter((entry) => entry.activityId === sectionKey);
  assert(feedbackResults.length === 3 && feedbackResults.every((entry) => entry.selectedLetter && entry.correctLetter && Array.isArray(entry.optionOrder)), "Chinese feedback should export confirmed choice result fields");
  const reload = makeContext(context.__store);
  const reloadedProgress = reload.__planetTest.getCourseProgress(parsed.packId);
  const reloadedItem = reloadedProgress.chinese.sections[sectionKey];
  assert(JSON.stringify(reloadedItem.choiceResults[1].optionOrder) === JSON.stringify(orderBeforeConfirm[q1Key]), "Reloaded progress should preserve confirmed option order");
  const chineseControls = context.__planetTest.renderCourseItemControls(sectionKey, item);
  const englishControls = context.__planetTest.renderCourseItemControls("english:test", {});
  assert(chineseControls.includes("确认") && !chineseControls.includes("完成本环节") && chineseControls.includes("is-chinese-confirm"), "Chinese objective section button should be compact Confirm");
  assert(englishControls.includes(">完成</button>") && !englishControls.includes("完成本环节") && !englishControls.includes("Done"), "English course controls should use one concise action label");
  const confirmCss = stylesSource.match(/\.course-controls\.is-chinese-confirm \.course-timing-row\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(/justify-content\s*:\s*flex-start/.test(confirmCss), "Chinese confirm button should be left-aligned");
  const readText = context.__planetTest.renderCourseQuestion(section.questions[1], q1Key, item).match(/data-read-text="([^"]+)"/)?.[1] || "";
  assert(readText.includes("A，") && readText.includes("B，") && readText.indexOf("A，") < readText.indexOf("B，"), "Read aloud text should follow displayed A/B/C option order");
  assert(q0Order.length === 2 && q2Order.length === 4, "Choice order helper should preserve 2-option and 4-option questions");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  assert(preview.valid && preview.warnings.length === 0, "Color Planet revised built-in pack should validate without warnings");
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const steps = context.__planetTest.getArtLessonSteps(parsed);
  assert(parsed.packId === "2026-07-25-helen-day13-en-next-art01-rev2", "Revised art lesson must use a new packId");
  assert(parsed.revision === "color-planet-lesson-01-v2-14-step", "Revised art lesson should keep revision metadata");
  assert(builtinManifest.packs.some((item) => item.packId === parsed.packId && item.path?.includes("day13-rev2")), "Built-in manifest should keep the revised Day13 pack archived");
  assert(builtinManifest.packs.some((item) => item.packId === day13Pack.packId) && builtinManifest.packs.some((item) => item.packId === parsed.packId), "Built-in manifest should archive both old and revised packs");
  assert(parsed.art.plannedMinutes === 52, "Revised art lesson should be 52 minutes");
  assert(steps.length === 14, "Revised art lesson should render exactly 14 steps");
  const publishedVersion = context.__planetTest.APP_METADATA.version;
  const cacheVersions = [...indexSource.matchAll(/\?v=(v[\d.]+)/g)].map((match) => match[1]);
  assert(cacheVersions.length >= 5 && cacheVersions.every((version) => version === publishedVersion), "All page assets should use the app metadata version for cache-busting");
  assert(builtinBundle.version === publishedVersion, "Built-in learning-pack bundle should match app metadata version");
  assert(indexSource.includes("<em>Learning Planet</em>") && !indexSource.includes("Learning Planet · beta"), "Student-facing brand should not expose a beta/version label");
  assert(indexSource.includes(`class="brand-mark" src="./assets/brand/learning-planet-star-page.svg?v=${publishedVersion}" alt="" width="44" height="44"`), "Header should use the decorative Star Page brand asset without a duplicate accessible name");
  const topNavSource = indexSource.slice(indexSource.indexOf('<nav class="nav"'), indexSource.indexOf("</nav>") + 6);
  assert(visibleText(topNavSource) === "星球首页 中文星球 字母星球 颜色星球 家长观察站", "Student top navigation should show only the five signed-off Chinese labels");
  ["Home", "Chinese", "Letters", "Colors", "Observatory", "<span"].forEach((forbidden) => {
    assert(!topNavSource.includes(forbidden), `Student top navigation should omit visible English sublabels: ${forbidden}`);
  });
  assert(topNavSource.includes('aria-label="主要导航"') && !topNavSource.includes("Primary Navigation"), "Top navigation accessible name should stay concise without repeating visible English");
  const phoneTopbarCss = stylesSource.slice(stylesSource.lastIndexOf("@media (max-width: 620px)"));
  assert(/\.nav\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\);[\s\S]*?overflow:\s*visible;/.test(phoneTopbarCss), "390/360px navigation should remain one five-column row without internal overflow");
  assert(/\.nav a\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?padding:\s*0 3px;[\s\S]*?font-size:\s*11px;[\s\S]*?white-space:\s*nowrap;/.test(phoneTopbarCss), "390/360px navigation labels should fit compactly without wrapping into two rows");
  assert(indexSource.indexOf(`builtin-learning-packs.js?v=${publishedVersion}`) < indexSource.indexOf(`app.js?v=${publishedVersion}`), "Built-in pack bundle should load before app.js for file:// startup");
  assert(indexSource.indexOf(`hello-school-32-lesson-library.js?v=${publishedVersion}`) < indexSource.indexOf(`app.js?v=${publishedVersion}`), "English lesson library bundle should load before app.js for file:// startup");
  const englishSelectLabelCss = stylesSource.match(/\.english-lesson-select-label\s*\{[\s\S]*?\}/)?.[0] || "";
  assert(/grid-template-columns:\s*auto minmax\(0,\s*1fr\)/.test(englishSelectLabelCss) && /min-width\s*:\s*0/.test(englishSelectLabelCss) && /max-width\s*:\s*100%/.test(englishSelectLabelCss) && /margin:\s*0/.test(englishSelectLabelCss), "Story lesson selector should reuse the compact two-column layout without inherited label offset and shrink within a phone viewport");
  assert(/\.course-pack-select-label select,\s*\.english-lesson-select-label select/.test(stylesSource), "Chinese and English course selects should use one shared visual rule");
  const finalCourseResponsiveCss = stylesSource.slice(stylesSource.lastIndexOf("@media (max-width: 1100px)"));
  assert(/\.course-topline,\s*\.art-step-layout\s*\{[\s\S]*?grid-template-columns\s*:\s*minmax\(0,\s*1fr\)/.test(finalCourseResponsiveCss), "Course title and mode controls should stack after the base grid rule on tablet and phone sizes");
  assert(context.__planetTest.getPlanetStatus("art", parsed).progress === "0/14", "Art planet progress should start at 0/14");
  assert(!parsed.art.warmup, "Revised art lesson must not add warmup as a 15th step");
  const oldStepIds = new Set(day13Pack.art.steps.map((step) => step.id));
  assert(steps.every((step) => !oldStepIds.has(step.id)), "Old 6-step art lesson must not be mixed into the revised 14-step lesson");
  const artAssets = parsed.art.assetManifest.assets.filter((asset) => asset.mime === "image/webp");
  const assetNames = artAssets.map((asset) => asset.fileName);
  assert(artAssets.length === 14, "Revised art lesson should declare 14 webp image assets");
  assert(new Set(assetNames).size === 14, "Each art step must use a unique image filename");
  for (const fileName of assetNames) {
    const assetPath = new URL(`./assets/art/color-planet-lesson-01/${fileName}`, import.meta.url);
    const stat = fs.statSync(assetPath);
    assert(stat.isFile() && stat.size > 0, `Art asset should exist and be non-empty: ${fileName}`);
  }
  for (const step of steps) {
    assert(step.childActionZh && step.parentPromptZh && step.successCriteriaZh && step.completionCheckZh && step.commonMistakeZh, `Art step ${step.id} should preserve teaching fields`);
    assert(step.imageAssetId && step.narration?.textZh && step.readAloud?.spokenTextZh, `Art step ${step.id} should preserve image and narration/readAloud fields`);
  }
  const sixth = steps[5];
  const seventh = steps[6];
  assert(sixth.id === "check_and_erase_draft" && sixth.hardGate?.id === "pencil_draft_approved", "Step 6 should carry the pencil draft hard gate");
  assert(context.__planetTest.getArtStepLock(parsed, seventh, progress).locked, "Step 7 should be locked before step 6 is complete");
  const lockedHtml = context.__planetTest.renderArtStep(parsed, seventh, 6, progress);
  assert(lockedHtml.includes("is-locked") && lockedHtml.includes("完成边距、比例和遮挡检查后") && lockedHtml.includes("disabled"), "Locked step should show a real disabled state");
  context.__planetTest.completeCourseItem(`art:${seventh.id}`);
  assert(!progress.art.steps[`art:${seventh.id}`]?.finishedAt, "Business logic should block completing a locked step");
  context.__planetTest.completeCourseItem(`art:${sixth.id}`);
  assert(!context.__planetTest.getArtStepLock(parsed, seventh, progress).locked, "Step 7 should unlock after step 6 is complete");
  await context.__planetTest.resetCourseSession("art");
  assert(!context.__planetTest.getArtStepLock(parsed, seventh, progress).locked, "Resetting the timer must preserve the completed pencil draft gate");
  const asset = context.__planetTest.resolveArtImageAsset(parsed, "art01_step07_outline");
  assert(asset.url === "assets/art/color-planet-lesson-01/art01-step07-outline.webp", "Art image asset should resolve through assetManifest and fixed asset directory");
  const allArtHtml = steps.map((step, index) => context.__planetTest.renderArtStep(parsed, step, index, progress)).join("");
  const imageSrcs = [...allArtHtml.matchAll(/<img src="([^"]+)"/g)].map((match) => match[1]);
  const expectedSrcs = steps.map((step) => context.__planetTest.resolveArtImageAsset(parsed, step.imageAssetId).url);
  assert(imageSrcs.length === 14, "Revised art lesson should render 14 img elements");
  assert(new Set(imageSrcs).size === 14, "Each rendered art image src should be unique");
  assert(expectedSrcs.every((src) => imageSrcs.includes(src)), "Rendered art image srcs should match the asset manifest");
  assert(!allArtHtml.includes('loading="lazy"'), "Art step images must not use native lazy loading");
  assert((allArtHtml.match(/loading="eager"/g) || []).length >= 14, "Art step images should use eager loading");
  assert(lockedHtml.includes("<img ") && lockedHtml.includes("第7步图片正在加载"), "Locked steps should still render and load their step image");
  const fourthHtml = context.__planetTest.renderArtStep(parsed, steps[3], 3, progress);
  const fourteenthHtml = context.__planetTest.renderArtStep(parsed, steps[13], 13, progress);
  assert(fourthHtml.includes("第4步图片加载失败") && fourthHtml.includes("重新加载图片"), "Step 4 should have its own image failure retry UI");
  assert(fourteenthHtml.includes("第14步图片加载失败") && fourteenthHtml.includes("重新加载图片"), "Step 14 should have its own image failure retry UI");
  const createImageFrame = (baseUrl) => {
    const classes = new Set(["art-image-loading"]);
    const loadingLabel = { hidden: false, setAttribute: (name) => { if (name === "hidden") loadingLabel.hidden = true; }, removeAttribute: (name) => { if (name === "hidden") loadingLabel.hidden = false; } };
    const fallback = { hidden: true };
    const preview = { hidden: false, dataset: { artImageOpen: baseUrl } };
    let image;
    const frame = {
      dataset: { artImageBaseUrl: baseUrl },
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name)
      },
      querySelector: (selector) => {
        if (selector === "[data-art-image-loading-label]") return loadingLabel;
        if (selector === ".art-image-fallback") return fallback;
        if (selector === ".art-image-preview") return preview;
        if (selector === "img") return image;
        return null;
      }
    };
    image = {
      hidden: false,
      src: baseUrl,
      matches: (selector) => selector === ".art-image-frame img",
      closest: (selector) => selector === "[data-art-image-frame]" ? frame : null
    };
    const retryButton = { closest: (selector) => selector === "[data-art-image-frame]" ? frame : null };
    return { frame, image, fallback, preview, loadingLabel, retryButton };
  };
  const fourthFrame = createImageFrame(imageSrcs[3]);
  const fourteenthFrame = createImageFrame(imageSrcs[13]);
  context.__planetTest.handleArtImageError({ target: fourthFrame.image });
  context.__planetTest.handleArtImageError({ target: fourteenthFrame.image });
  assert(fourthFrame.fallback.hidden === false && fourteenthFrame.fallback.hidden === false, "Image error should reveal independent retry UI for failed steps");
  const fourthBeforeRetry = fourthFrame.image.src;
  const fourteenthBeforeRetry = fourteenthFrame.image.src;
  context.__planetTest.retryArtImage(fourthFrame.retryButton);
  assert(fourthFrame.image.src.startsWith(`${fourthBeforeRetry}?retry=`), "Retry should cache-bust only the failed target image");
  assert(fourteenthFrame.image.src === fourteenthBeforeRetry, "Retrying one image must not change another failed image URL");
  const fourthAfterRetry = fourthFrame.image.src;
  context.__planetTest.retryArtImage(fourthFrame.retryButton);
  assert(fourthFrame.image.src === fourthAfterRetry, "Retry should not loop with repeated automatic URL changes");
  const imageHtml = context.__planetTest.renderArtStep(parsed, steps[0], 0, progress);
  assert(imageHtml.includes("<img") && imageHtml.includes("assets/art/color-planet-lesson-01/art01-step01-finished-reference.webp"), "Art step should render a real img src, not the raw asset id");
  assert(!imageHtml.includes("onerror="), "Art image fallback should not rely on inline event scripts");
  const missingHtml = context.__planetTest.renderArtStep(parsed, { ...steps[0], imageAssetId: "missing_asset" }, 0, progress);
  assert(missingHtml.includes("步骤图文件暂未到位") && !missingHtml.includes("步骤图：missing_asset"), "Missing art asset should show a safe missing-image state");
  context.__planetTest.openArtImageLightbox(asset.url, "勾线步骤图");
  assert(context.__appendedNodes.at(-1)?.innerHTML.includes("勾线步骤图"), "Art image lightbox should open with the selected image");
  context.__planetTest.closeArtImageLightbox();
  assert(!context.__appendedNodes.some((node) => node.dataset?.artLightbox === "true"), "Art image lightbox should close cleanly");
}

{
  const context = makeContext();
  const oldPack = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  const rev2Pack = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Rev2Pack));
  context.__planetTest.importLearningPack(oldPack, context.__planetTest.buildLearningPackPreview(oldPack), { select: true, markLatest: true, publishedAt: "2026-07-25T00:00:00+08:00" });
  const oldProgress = context.__planetTest.initializeCourseProgress(oldPack);
  oldProgress.art.steps["art:prepare_paper"] = { finishedAt: "old-progress-kept", result: "independent" };
  context.__planetTest.saveState();
  const shouldSelectRev2 = context.__planetTest.shouldAutoSelectBuiltinRevision(oldPack, rev2Pack);
  context.__planetTest.importLearningPack(rev2Pack, context.__planetTest.buildLearningPackPreview(rev2Pack), { select: shouldSelectRev2, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00", builtinLatest: true });
  context.__planetTest.initializeCourseProgress(rev2Pack);
  assert(context.__planetTest.state.selectedLearningPackId === rev2Pack.packId, "Builtin latest should auto-select a new same-date revision");
  assert(context.__planetTest.state.learningPacks[oldPack.packId], "Old Day13 pack should remain archived after rev2 loads");
  assert(context.__planetTest.state.courseProgress[oldPack.packId].art.steps["art:prepare_paper"].finishedAt === "old-progress-kept", "Old Day13 progress should remain untouched after rev2 loads");
  assert(context.__planetTest.getPackIdForDate("2026-07-25") === rev2Pack.packId, "Date menu should resolve 2026-07-25 to the latest formal revision");
  assert(context.__planetTest.getPackArchiveEntriesForDate("2026-07-25").map((entry) => entry.packId).join(",").startsWith(rev2Pack.packId), "Same-date archive entries should be ordered latest first");

  const previousDay = JSON.parse(JSON.stringify(day13Pack));
  previousDay.packId = "2026-07-24-helen-day12-history";
  previousDay.date = "2026-07-24";
  previousDay.title = "Helen Day 12｜历史课程";
  const historyPack = context.__planetTest.parseLearningPackInput(JSON.stringify(previousDay));
  context.__planetTest.importLearningPack(historyPack, context.__planetTest.buildLearningPackPreview(historyPack), { select: true, markLatest: false, publishedAt: "2026-07-24T08:00:00+08:00" });
  assert(context.__planetTest.state.selectedLearningPackId === historyPack.packId, "Selecting another history date should work before builtin refresh");
  const shouldForceBack = context.__planetTest.shouldAutoSelectBuiltinRevision(historyPack, rev2Pack);
  context.__planetTest.importLearningPack(rev2Pack, context.__planetTest.buildLearningPackPreview(rev2Pack), { select: shouldForceBack, markLatest: true, publishedAt: "2026-07-25T12:20:00+08:00", builtinLatest: true });
  assert(context.__planetTest.state.selectedLearningPackId === historyPack.packId, "Builtin latest refresh must not force a user-selected different date back to today");
}

{
  ["null", "missing", "object"].forEach((mode) => {
    const context = makeContext();
    const candidate = JSON.parse(JSON.stringify(day13Pack));
    const sections = candidate.chinese.lesson.sections;
    sections.forEach((section) => {
      if (mode === "null") section.readAloud = null;
      if (mode === "missing") delete section.readAloud;
      if (mode === "object") section.readAloud = { policy: "instruction_only", spokenTextZh: section.parentInstructionZh || section.title || "" };
      section.questions?.forEach((question) => {
        if (mode === "null") question.readAloud = null;
        if (mode === "missing") delete question.readAloud;
        if (mode === "object") question.readAloud = { policy: "prompt_only", spokenTextZh: question.prompt || "" };
      });
    });
    const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(candidate));
    const preview = context.__planetTest.buildLearningPackPreview(parsed);
    context.__planetTest.importLearningPack(parsed, preview);
    const progress = context.__planetTest.initializeCourseProgress(parsed);
    const lessonSections = context.__planetTest.getChineseLessonSections(parsed);
    assert(lessonSections.length === 9, `Day13 Chinese lesson should render 9 sections for readAloud ${mode}`);
    const html = lessonSections.map((section, index) => context.__planetTest.renderChineseSection(parsed, section, index, progress)).join("");
    assert((html.match(/course-card/g) || []).length >= 9, `Chinese lesson cards should render for readAloud ${mode}`);
    assert(context.__planetTest.normalizeReadAloudConfig(mode === "null" ? null : undefined).policy === "instruction_only", `Read aloud ${mode} should use safe default`);
  });
}

{
  const context = makeContext();
  const rootFromRect = (rect) => ({ getBoundingClientRect: () => rect });
  assert(context.__planetTest.shouldShowCourseFloatingTimer(rootFromRect({ top: 421, bottom: 467 }), 900) === false, "Floating timer must hide while original control is visible");
  assert(context.__planetTest.shouldShowCourseFloatingTimer(rootFromRect({ top: -120, bottom: 0 }), 900) === true, "Floating timer should show after original control leaves above viewport");
  assert(context.__planetTest.shouldShowCourseFloatingTimer(rootFromRect({ top: 901, bottom: 950 }), 900) === true, "Floating timer should show after original control leaves below viewport");
  assert(context.__planetTest.shouldShowCourseFloatingTimer(rootFromRect({ top: 10, bottom: 56 }), 900) === false, "Floating timer should hide again when original control returns");
}

{
  const clock = { now: Date.parse("2026-07-25T07:50:00.000Z") };
  const context = makeContext({}, clock);
  context.__planetTest.importColorPlanetData(colorPlanetCatalog, colorCardRegister, { source: "timer_state_test" });
  const courseId = "color-choice-003-reading-cat";
  assert(context.__planetTest.selectColorCourse(courseId), "Color timer test course should be selectable");
  assert(context.__planetTest.startColorCourse(courseId), "Color timer test course should start");
  const progress = context.__planetTest.getColorCourseProgress(courseId);
  const side = progress.art;
  const courseStartedAt = side.startedAt;
  assert(courseStartedAt && side.timerStartedAt === "", "Starting a Color course should set course startedAt without starting its timer");
  assert(context.__planetTest.getCourseToolbarModel("art", side).started === false, "A started Color course should still show an unstarted timer");
  assert(context.__planetTest.getCourseTimerState("art").started === false, "Floating Color timer state should remain unstarted before timer click");
  assert(context.__planetTest.renderCourseToolbarControls("art", side).includes('data-course-session-start="art"'), "Color toolbar should render a clickable Timer control before timer start");

  const firstStepKey = `art:${context.__planetTest.getColorCourseById(courseId).steps[0].id}`;
  side.steps[firstStepKey] = { finishedAt: "done", result: "independent" };
  await context.__planetTest.startCourseSession("art");
  assert(side.timerStartedAt && side.isRunning, "Starting the Color timer should set timerStartedAt and run");
  assert(context.__planetTest.getCourseToolbarModel("art", side).running, "Color toolbar should show the running timer state");
  clock.now += 3000;
  context.__planetTest.pauseCourse("art");
  const pausedElapsed = context.__planetTest.getCourseElapsed(side);
  clock.now += 5000;
  assert(context.__planetTest.getCourseElapsed(side) === pausedElapsed, "Paused Color timer should remain stable");
  const pausedStatus = side.sessionStatus;
  await context.__planetTest.resetCourseSession("art");
  assert(side.timerStartedAt === "" && context.__planetTest.getCourseElapsed(side) === 0, "Color timer reset should clear only timer start and elapsed state");
  assert(side.startedAt === courseStartedAt && side.sessionStatus === pausedStatus, "Color timer reset should preserve course start and session status");
  assert(side.steps[firstStepKey].finishedAt === "done", "Color timer reset should preserve step progress");
  assert(context.__planetTest.getInProgressColorCourse()?.courseId === courseId, "Color course should remain locked as in progress after timer reset");
  assert(context.__planetTest.getCourseToolbarModel("art", side).started === false, "Color toolbar should return to the clickable Timer state after reset");
  assert(context.__planetTest.renderCourseToolbarControls("art", side).includes('data-course-session-start="art"'), "Reset Color toolbar should render a clickable Timer control");
}

{
  const clock = { now: Date.parse("2026-07-25T07:55:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  for (const kind of ["chinese", "english", "art"]) {
    const side = progress[kind];
    const map = side.sections || side.steps;
    const markerKey = `${kind}:timer-separation-marker`;
    side.startedAt = "2026-07-25T07:54:00.000Z";
    side.finishedAt = "";
    side.sessionStatus = "in_progress";
    side.timerStartedAt = "";
    side.accumulatedMs = 0;
    side.elapsedMs = 0;
    side.isRunning = false;
    side.runningSince = null;
    map[markerKey] = { finishedAt: "done", elapsedMs: 60000, result: "independent" };
    assert(context.__planetTest.getCourseToolbarModel(kind, side).started === false, `${kind} course start and activity time must not imply timer start`);
    assert(context.__planetTest.getCourseTimerState(kind).started === false, `${kind} floating timer should remain unstarted without timer evidence`);
    assert(context.__planetTest.renderCourseToolbarControls(kind, side).includes(`data-course-session-start="${kind}"`), `${kind} toolbar should expose clickable Timer`);
    await context.__planetTest.startCourseSession(kind);
    assert(side.timerStartedAt && side.isRunning, `${kind} timer should start independently`);
    const courseStartedAt = side.startedAt;
    const sessionStatus = side.sessionStatus;
    await context.__planetTest.resetCourseSession(kind);
    assert(side.timerStartedAt === "" && context.__planetTest.getCourseElapsed(side) === 0, `${kind} timer reset should return to zero`);
    assert(side.startedAt === courseStartedAt && side.sessionStatus === sessionStatus, `${kind} timer reset should preserve course state`);
    assert(map[markerKey].finishedAt === "done" && map[markerKey].elapsedMs === 60000, `${kind} timer reset should preserve activity progress`);
    assert(context.__planetTest.getCourseToolbarModel(kind, side).started === false, `${kind} toolbar should return to clickable Timer after reset`);
  }
}

{
  const clock = { now: Date.parse("2026-07-25T07:58:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.startedAt = "2026-07-25T07:57:00.000Z";
  progress.chinese.sections["chinese:legacy-step"] = { finishedAt: "done", elapsedMs: 90000 };
  delete progress.chinese.timerStartedAt;
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const side = restored.__planetTest.getCourseProgress(parsed.packId).chinese;
  assert(side.startedAt && side.timerStartedAt === "", "Legacy course data with only startedAt should not be migrated to timer-started");
  assert(restored.__planetTest.getCourseToolbarModel("chinese", side).started === false, "Legacy activity elapsed time must not start the course toolbar timer");
  assert(restored.__planetTest.getCourseElapsed(side) === 0, "Course timer elapsed should not fall back to activity elapsed time");
}

{
  const clock = { now: Date.parse("2026-07-25T07:59:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.startedAt = "2026-07-25T07:57:30.000Z";
  progress.chinese.accumulatedMs = 4500;
  progress.chinese.elapsedMs = 4500;
  delete progress.chinese.timerStartedAt;
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const side = restored.__planetTest.getCourseProgress(parsed.packId).chinese;
  assert(side.timerStartedAt === side.startedAt, "Legacy accumulated timer data should migrate to an independent timerStartedAt");
  assert(restored.__planetTest.getCourseToolbarModel("chinese", side).started === true, "Legacy accumulated timer data should remain visibly started");
  assert(restored.__planetTest.getCourseElapsed(side) === 4500, "Legacy accumulated timer duration should be preserved");
}

{
  const clock = { now: Date.parse("2026-07-25T08:00:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseSession("chinese");
  clock.now += 2000;
  assert(context.__planetTest.formatElapsed(context.__planetTest.getCourseElapsed(progress.chinese)) === "0:02", "Course timer should show about 0:02 after two seconds");
  context.__planetTest.pauseCourse("chinese");
  const paused = context.__planetTest.getCourseElapsed(progress.chinese);
  clock.now += 5000;
  assert(context.__planetTest.getCourseElapsed(progress.chinese) === paused, "Paused course timer should not keep growing");
  await context.__planetTest.startCourseSession("chinese");
  clock.now += 3000;
  assert(context.__planetTest.formatElapsed(context.__planetTest.getCourseElapsed(progress.chinese)) === "0:05", "Resumed course timer should continue from accumulated time");
  assert(context.__planetTest.formatElapsed(3661000) === "1:01:01", "Toolbar timer should switch to h:mm:ss after one hour");
  const restored = makeContext(context.__store, clock);
  const restoredChinese = restored.__planetTest.getCourseProgress(parsed.packId).chinese;
  assert(restoredChinese.isRunning === false, "Running course timer should pause after refresh");
  assert(restored.__planetTest.formatElapsed(restored.__planetTest.getCourseElapsed(restoredChinese)) === "0:05", "Running course timer should recover only trusted elapsed time after refresh");
}

{
  const clock = { now: Date.parse("2026-07-25T08:10:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.isRunning = true;
  progress.chinese.runningSince = clock.now - 86 * 60 * 1000;
  progress.chinese.accumulatedMs = 0;
  delete progress.chinese.lastHeartbeatAt;
  delete progress.chinese.timerModelVersion;
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const side = restored.__planetTest.getCourseProgress(parsed.packId).chinese;
  assert(side.isRunning === false, "Legacy running timer without heartbeat should pause on startup");
  assert(side.timerStartedAt, "Legacy running timer should migrate to timerStartedAt");
  assert(restored.__planetTest.getCourseElapsed(side) === 0, "Legacy 86-minute closed-page gap must not be counted");
}

{
  const clock = { now: Date.parse("2026-07-25T08:15:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.timerModelVersion = 2;
  progress.chinese.isRunning = true;
  progress.chinese.runningSince = clock.now - 20000;
  progress.chinese.lastHeartbeatAt = clock.now - 7000;
  progress.chinese.accumulatedMs = 1000;
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const side = restored.__planetTest.getCourseProgress(parsed.packId).chinese;
  assert(side.isRunning === false, "Heartbeat recovery should pause after app restore");
  assert(side.timerStartedAt, "Trusted running timer recovery should retain timer-started state");
  assert(restored.__planetTest.getCourseElapsed(side) === 21000, "Heartbeat recovery should add only trusted elapsed time");
}

{
  const clock = { now: Date.parse("2026-07-25T08:20:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseSession("chinese");
  clock.now += 7000;
  context.__planetTest.persistCourseTimerHeartbeat(true);
  clock.now += 3000;
  context.__planetTest.pauseAllRunningCourseTimers("pagehide", { skipRecording: true });
  const paused = context.__planetTest.getCourseElapsed(progress.chinese);
  clock.now += 60000;
  assert(progress.chinese.isRunning === false, "Pagehide should pause running course timer");
  assert(context.__planetTest.getCourseElapsed(progress.chinese) === paused, "Hidden/pagehide time should not keep growing");
}

{
  const clock = { now: Date.parse("2026-07-25T08:25:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseSession("chinese");
  clock.now += 4000;
  await context.__planetTest.startCourseSession("english");
  assert(progress.chinese.isRunning === false, "Starting English should pause Chinese timer");
  assert(progress.english.isRunning === true, "Starting English should run English timer");
  assert(context.__planetTest.formatElapsed(context.__planetTest.getCourseElapsed(progress.chinese)) === "0:04", "Chinese elapsed should be preserved when switching planets");
}

{
  const clock = { now: Date.parse("2026-07-25T08:28:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseSession("chinese");
  await context.__planetTest.startCourseSession("english");
  progress.chinese.sections["chinese:reading"] = { finishedAt: "done", result: "independent" };
  progress.chinese.readingAnnotations = { reading: { sectionId: "reading", characters: { 影: { character: "影", status: "unknown" } } } };
  progress.chinese.childEase = 3;
  progress.english.steps["english:blocks"] = { finishedAt: "done" };
  progress.english.blockAnswers = { "english:blocks": [0, 1] };
  progress.art.steps["art:warmup"] = { finishedAt: "done" };
  context.__planetTest.saveState();
  const englishSnapshot = JSON.stringify(progress.english);
  const artSnapshot = JSON.stringify(progress.art);
  const oldSession = progress.chinese.sessionId;
  const courseStartedAt = progress.chinese.startedAt;
  const sessionStatus = progress.chinese.sessionStatus;
  await context.__planetTest.resetCourseSession("chinese");
  assert(progress.chinese.sessionId === oldSession, "Timer reset must preserve the Chinese session");
  assert(context.__planetTest.getCourseElapsed(progress.chinese) === 0 && progress.chinese.timerStartedAt === "", "Reset Chinese should return only its timer to the unstarted state");
  assert(progress.chinese.startedAt === courseStartedAt && progress.chinese.sessionStatus === sessionStatus, "Reset Chinese timer should preserve course start and status");
  assert(progress.chinese.sections["chinese:reading"].finishedAt === "done", "Timer reset must preserve Chinese section completion");
  assert(progress.chinese.readingAnnotations.reading.characters.影.status === "unknown", "Timer reset must preserve reading annotations");
  assert(JSON.stringify(progress.english) === englishSnapshot, "Reset Chinese must not change English progress");
  assert(JSON.stringify(progress.art) === artSnapshot, "Reset Chinese must not change Art progress");
}

{
  const clock = { now: Date.parse("2026-07-25T08:29:00.000Z") };
  const context = makeContext({}, clock, { cancelConfirm: true });
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.english.steps["english:blocks"] = { finishedAt: "done" };
  await context.__planetTest.startCourseSession("english");
  const courseStartedAt = progress.english.startedAt;
  await context.__planetTest.resetCourseSession("english");
  assert(progress.english.timerStartedAt === "" && context.__planetTest.getCourseElapsed(progress.english) === 0, "Timer reset should not depend on a confirmation dialog");
  assert(progress.english.startedAt === courseStartedAt && progress.english.steps["english:blocks"].finishedAt === "done", "Dialog-free timer reset should preserve English course progress");
}

{
  const clock = { now: Date.parse("2026-07-25T08:29:30.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.english.steps["english:blocks"] = { finishedAt: "done" };
  progress.english.blockAnswers = { "english:blocks": [0, 1, 2] };
  progress.english.selectedMode = "standard";
  progress.art.steps["art:step-1"] = { finishedAt: "done" };
  progress.art.artworkFileName = "old-art.jpg";
  const chineseSnapshot = JSON.stringify(progress.chinese);
  await context.__planetTest.resetCourseSession("english");
  assert(progress.english.selectedMode === "standard", "Reset English should preserve selected mode preference");
  assert(progress.english.steps["english:blocks"].finishedAt === "done", "Timer reset must preserve English step completion");
  assert(progress.english.blockAnswers["english:blocks"].join(",") === "0,1,2", "Timer reset must preserve English block answers");
  assert(JSON.stringify(progress.chinese) === chineseSnapshot, "Reset English must not change Chinese progress");
  await context.__planetTest.resetCourseSession("art");
  assert(progress.art.steps["art:step-1"].finishedAt === "done", "Timer reset must preserve Art step completion");
  assert(progress.art.artworkFileName === "old-art.jpg", "Timer reset must preserve artwork file state");
}

{
  const clock = { now: Date.parse("2026-07-25T08:30:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const startHtml = context.__planetTest.renderChineseSection(parsed, context.__planetTest.getChineseLessonSections(parsed)[0], 0, progress)
    + context.__planetTest.renderCourseStartSettings?.("chinese", progress.chinese, context.__planetTest.getChineseLessonSections(parsed));
  assert(!source.includes("这次不录") && !source.includes("口语记录"), "UI source should not contain old recording terms");
  const toolbarHtml = context.__planetTest.renderCourseStartSettings("chinese", progress.chinese, context.__planetTest.getChineseLessonSections(parsed));
  assert((toolbarHtml.match(/<button/g) || []).length === 4, "Course toolbar should expose exactly four controls");
  assert(!visibleText(toolbarHtml).includes("录音"), "Course toolbar must not show visible recording text");
  assert(toolbarHtml.includes('data-course-recording-action="toggle"') && toolbarHtml.includes('aria-label="开始录音"'), "Recording dot should remain accessible without visible text");
  assert(toolbarHtml.includes('aria-label="计时"'), "Unstarted timer should use the concise Timer accessible label");
  const toolbarOrder = (html) => [...html.matchAll(/<button class="([^"]+)"/g)].map((match) => match[1].split(" ")[0]).join(",");
  const toolbarByCourse = ["chinese", "english", "art"].map((kind) => context.__planetTest.renderCourseStartSettings(kind, progress[kind], []));
  assert(toolbarByCourse.every((html) => (html.match(/<button/g) || []).length === 4), "All three planets should use the same four-control toolbar");
  assert(new Set(toolbarByCourse.map(toolbarOrder)).size === 1, "All three planets should keep timer, pause, reset and recording in the same DOM order");
  const toolbarCss = stylesSource.slice(stylesSource.indexOf(".course-toolbar {"), stylesSource.indexOf(".app-stage-list {"));
  assert(/height:\s*52px/.test(toolbarCss) && /gap:\s*4px/.test(toolbarCss) && /padding:\s*4px/.test(toolbarCss), "Toolbar should be a fixed 52px row with 4px gaps");
  assert(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.92\)/.test(toolbarCss), "Toolbar should use the specified translucent white surface");
  assert(/\.course-toolbar button\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;[\s\S]*?place-items:\s*center/.test(toolbarCss), "Every toolbar control should be 44x44 and centered");
  assert(/\.course-toolbar-time\s*\{[\s\S]*?width:\s*72px\s*!important;[\s\S]*?min-width:\s*72px\s*!important;[\s\S]*?flex:\s*0 0 72px\s*!important;[\s\S]*?font-size:\s*14px;[\s\S]*?font-variant-numeric:\s*tabular-nums/.test(toolbarCss), "Timer should reserve a 72px tabular-number area at 14px");
  assert(/\.course-toolbar button:focus-visible\s*\{[\s\S]*?outline:\s*3px solid[\s\S]*?outline-offset:\s*2px/.test(toolbarCss), "Toolbar focus ring should be 3px with a 2px offset");
  assert(/\.course-toolbar-record::before\s*\{[\s\S]*?width:\s*12px;[\s\S]*?height:\s*12px/.test(toolbarCss), "Idle recording dot should be 12px");
  assert(/\.course-toolbar-record::before\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?top:\s*50%;[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translate\(-50%,\s*-50%\)/.test(toolbarCss), "Recording states should share the exact button center");
  assert(/\.course-toolbar-record\.is-recording::before\s*\{[\s\S]*?width:\s*16px;[\s\S]*?height:\s*16px/.test(toolbarCss), "Active recording dot should grow to 16px");
  assert(/\.course-toolbar-record span\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;[\s\S]*?display:\s*grid;[\s\S]*?place-items:\s*center/.test(toolbarCss), "Saved recording check should use the same centered overlay");
  const resetCss = toolbarCss.match(/\.course-toolbar-reset span\s*\{([\s\S]*?)\}/)?.[1] || "";
  assert(!/margin-bottom/.test(resetCss) && /margin:\s*0\s*!important/.test(resetCss), "Reset icon should not inherit a bottom margin");
  assert(/@media \(min-width:\s*621px\) and \(max-width:\s*1024px\)/.test(toolbarCss) && /@media \(max-width:\s*620px\)/.test(toolbarCss), "Floating toolbar should include stable tablet and phone layouts");
  assert(!startHtml.includes("这次不录") && !startHtml.includes("口语记录"), "Rendered recording panel should not use old terms");
  assert(context.__micRequests() === 0, "Rendering and starting timer should not request microphone");
  progress.chinese.timerStartedAt = "2026-07-25T07:24:06.000Z";
  progress.chinese.accumulatedMs = 3924000;
  progress.chinese.elapsedMs = 3924000;
  const longTimerHtml = context.__planetTest.renderCourseStartSettings("chinese", progress.chinese, []);
  assert(longTimerHtml.includes(">1:05:24</button>"), "Toolbar should display 1:05:24 without shortening it");
  assert(longTimerHtml.includes('aria-label="已计时 1小时5分钟24秒"'), "Started timer should expose a readable duration");
  progress.chinese.timerStartedAt = "";
  progress.chinese.accumulatedMs = 0;
  progress.chinese.elapsedMs = 0;
  await context.__planetTest.startCourseSession("chinese");
  assert(context.__micRequests() === 0, "Start learning should not request microphone");
  await context.__planetTest.startCourseRecording("chinese");
  await settleAsyncWrites();
  assert(context.__micRequests() === 1, "Start recording should request microphone once");
  assert(progress.chinese.isRunning, "Starting recording should also start course timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "recording", "Recording should enter recording state");
  assert(context.__planetTest.renderCourseStartSettings("chinese", progress.chinese, []).includes('aria-label="停止并保存录音"'), "Active recording dot should identify the complete stop-and-save action");
  await context.__planetTest.handleCourseRecordingAction({ dataset: { courseRecordingAction: "toggle", courseRecordingKind: "chinese" } });
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "saved", "Second recording-dot click should stop and save");
  await context.__planetTest.startCourseRecording("chinese");
  await settleAsyncWrites();
  assert(context.__fakeChunks.size > 0, "Recording should write chunks to IndexedDB");
  context.__planetTest.pauseCourse("chinese");
  assert(!progress.chinese.isRunning, "Pausing course should pause timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "paused", "Pausing course should pause active recording");
  await context.__planetTest.startCourseSession("chinese");
  assert(progress.chinese.isRunning, "Continuing course should resume timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "recording", "Continuing course should resume recording");
  await context.__planetTest.saveCourseRecording("chinese");
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "saved", "Saving should enter saved state");
  const blob = await context.__planetTest.buildCourseRecordingBlob("chinese");
  assert(blob && blob.size > 0, "Saved course recording should produce a playable Blob");
  progress.chinese.sections["chinese:reading"] = { finishedAt: "done" };
  await context.__planetTest.deleteCourseRecording("chinese");
  assert(context.__planetTest.getCourseRecordingClips("chinese").length === 0, "Delete should remove only current course recording clips");
  assert(progress.chinese.sections["chinese:reading"].finishedAt === "done", "Deleting recording must not change learning progress");
}

{
  const clock = { now: Date.parse("2026-07-25T08:40:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const oldSession = progress.chinese.sessionId;
  await context.__planetTest.startCourseRecording("chinese");
  await settleAsyncWrites();
  await context.__planetTest.saveCourseRecording("chinese");
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingClips("chinese").length > 0, "Saved recording should be current before reset");
  await context.__planetTest.resetCourseSession("chinese");
  assert(Object.values(context.__planetTest.state.recordingClips || {}).some((clip) => clip.sessionId === oldSession), "Reset should keep old recording in library");
  assert(context.__planetTest.getCourseRecordingClips("chinese").length > 0, "Timer reset must keep the current session recording available");
}

{
  const clock = { now: Date.parse("2026-07-25T08:45:00.000Z") };
  const context = makeContext({}, clock, { deferMic: true });
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const startPromise = context.__planetTest.startCourseRecording("chinese");
  await Promise.resolve();
  await Promise.resolve();
  assert(progress.chinese.isRunning, "Pending recording permission should start the course timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "requesting", "Pending microphone permission should show requesting state");
  const requestingHtml = context.__planetTest.renderCourseStartSettings("chinese", progress.chinese, context.__planetTest.getChineseLessonSections(parsed));
  assert(!visibleText(requestingHtml).includes("录音") && requestingHtml.includes("is-requesting") && requestingHtml.includes("disabled"), "Requesting state should stay compact and disable repeat start");
  const duplicateStart = context.__planetTest.startCourseRecording("chinese");
  await Promise.resolve();
  assert(context.__micRequests() === 1, "Duplicate pending start should not call getUserMedia twice");
  context.__resolveMic();
  await startPromise;
  await duplicateStart;
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "recording", "Resolved microphone permission should enter recording");
}

{
  const clock = { now: Date.parse("2026-07-25T08:50:00.000Z") };
  const context = makeContext({}, clock, { deferMic: true });
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  const startPromise = context.__planetTest.startCourseRecording("chinese");
  await Promise.resolve();
  context.__rejectMic();
  await startPromise;
  assert(progress.chinese.isRunning, "Rejected microphone permission should not stop course timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "unavailable", "Rejected microphone permission should show unavailable state");
  const deniedHtml = context.__planetTest.renderCourseStartSettings("chinese", progress.chinese, []);
  assert((deniedHtml.match(/麦克风未授权/g) || []).length === 1, "Permission denial should show only the short microphone hint once");
  assert(!visibleText(deniedHtml).includes("录音"), "Permission denial must not add visible recording labels or instruction blocks");
}

{
  const clock = { now: Date.parse("2026-07-25T08:55:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.courseRecordingStatus = "requesting";
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const restoredProgress = restored.__planetTest.getCourseProgress(parsed.packId);
  assert(restored.__planetTest.getCourseRecordingUiState("chinese", restoredProgress.chinese) === "idle", "Stale requesting state without chunks should reset to idle after refresh");
}

{
  const clock = { now: Date.parse("2026-07-25T09:00:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseRecording("chinese");
  await waitForPersistedRecordingChunk(context, "chinese");
  context.__planetTest.getCourseProgress(parsed.packId).chinese.courseRecordingStatus = "recording";
  context.__planetTest.saveState();
  const restored = makeContext(context.__store, clock);
  const restoredProgress = restored.__planetTest.getCourseProgress(parsed.packId);
  const restoredState = restored.__planetTest.getCourseRecordingUiState("chinese", restoredProgress.chinese);
  assert(restoredState === "interrupted", `Stale recording with persisted chunks should become interrupted after refresh, got ${restoredState}`);
}

{
  const clock = { now: Date.parse("2026-07-25T09:00:00.000Z") };
  const context = makeContext({}, clock);
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseRecording("chinese");
  await settleAsyncWrites();
  context.__planetTest.interruptActiveRecording("pagehide");
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "interrupted", "Pagehide should mark recording interrupted");
  const interruptedClips = context.__planetTest.getCourseRecordingClips("chinese");
  assert(interruptedClips.length === 1 && interruptedClips[0].chunkCount > 0, "Interrupted recording should keep persisted chunks");
  await context.__planetTest.startCourseRecording("chinese", { append: true });
  await settleAsyncWrites();
  assert(context.__planetTest.getCourseRecordingClips("chinese").some((clip) => clip.segmentIndex === 1), "Continuing after interruption should append a new segment");
}

{
  const clock = { now: Date.parse("2026-07-25T09:30:00.000Z") };
  const context = makeContext({}, clock, { rejectMic: true });
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(day13Pack));
  context.__planetTest.importLearningPack(parsed, context.__planetTest.buildLearningPackPreview(parsed));
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  await context.__planetTest.startCourseRecording("chinese");
  assert(progress.chinese.isRunning, "Permission denial should not stop course timer");
  assert(context.__planetTest.getCourseRecordingUiState("chinese") === "unavailable", "Permission denial should show recording unavailable");
}

{
  const context = makeContext();
  const day12 = { ...pack, packId: "2026-07-24-helen-day12-fixture", date: "2026-07-24", title: "Helen Day 12 fixture" };
  const day13 = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const parsedDay12 = context.__planetTest.parseLearningPackInput(JSON.stringify(day12));
  context.__planetTest.importLearningPack(parsedDay12, context.__planetTest.buildLearningPackPreview(parsedDay12));
  const progressDay12 = context.__planetTest.initializeCourseProgress(parsedDay12);
  progressDay12.chinese.sections["chinese:reading"] = { finishedAt: "2026-07-24T09:00:00.000Z", result: "independent" };
  context.__planetTest.importLearningPack(day13, context.__planetTest.buildLearningPackPreview(day13));
  context.__planetTest.initializeCourseProgress(day13);
  assert(context.__planetTest.getLearningPackDates().join(",") === "2026-07-24,2026-07-25", "Archive should keep versioned dates");
  assert(context.__planetTest.getPackIdForDate("2026-07-24") === parsedDay12.packId, "Date lookup should find historical pack");
  context.__planetTest.selectLearningPackDate("2026-07-24", false);
  assert(context.__planetTest.state.selectedLearningPackId === parsedDay12.packId, "Selecting a prior date should switch active pack");
  assert(context.__planetTest.state.courseProgress[parsedDay12.packId].chinese.sections["chinese:reading"].finishedAt, "Historical progress should remain isolated");
  assert(context.__planetTest.state.courseProgress[day13.packId].chinese.sections["chinese:reading"]?.finishedAt !== "2026-07-24T09:00:00.000Z", "Latest pack progress should not overwrite prior date");
}

{
  const context = makeContext();
  const englishOnly = { ...pack, packId: "2026-07-25-english-only", chinese: { characters: [], words: [] }, art: null };
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(englishOnly));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  context.__planetTest.initializeCourseProgress(parsed);
  assert(context.__planetTest.getPlanetStatus("english", parsed).hasCourse, "English-only pack should enable English planet");
  assert(!context.__planetTest.getPlanetStatus("art", parsed).hasCourse, "English-only pack should not fabricate art course");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.sections["chinese:reading"] = { startedAt: "2026-07-25T08:00:00.000Z", finishedAt: "2026-07-25T08:08:00.000Z", elapsedMs: 480000, result: "independent" };
  const feedback = context.__planetTest.buildFeedbackPackage("chinese").payload;
  assert(feedback.course === "chinese", "Chinese feedback should be single-course");
  assert(feedback.sessionStatus === "in_progress", "Half-finished Chinese feedback should be partial/in_progress");
  assert(feedback.completionRatio > 0 && feedback.completionRatio < 1, "Partial feedback should include completion ratio");
  assert(feedback.pendingActivityIds.includes("comprehension"), "Pending activities should be listed, not marked wrong");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  Object.keys(progress.english.steps).forEach((key) => {
    progress.english.steps[key] = { startedAt: "2026-07-25T09:00:00.000Z", finishedAt: "2026-07-25T09:02:00.000Z", elapsedMs: 120000, result: "independent" };
  });
  progress.english.finishedAt = "2026-07-25T09:20:00.000Z";
  const englishFeedback = context.__planetTest.buildFeedbackPackage("english").payload;
  const artFeedback = context.__planetTest.buildFeedbackPackage("art").payload;
  assert(englishFeedback.sessionStatus === "completed", "English can complete independently");
  assert(artFeedback.sessionStatus === "not_started", "Art not started should not block English");
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.reportMode === "current_snapshot", "Parent-facing feedback should be a current snapshot");
  assert(snapshot.planets.english.status === "completed", "Snapshot should include completed English");
  assert(snapshot.planets.chinese.status === "not_started", "Snapshot should include untouched scheduled Chinese as not_started");
  assert(snapshot.planets.art.status === "not_started", "Snapshot should include untouched scheduled Art as not_started");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.art.steps["art:shape"] = { startedAt: "2026-07-25T10:00:00.000Z", hintLevelUsed: 1, audioFallbackUsed: true, result: "prompted" };
  const artFeedback = context.__planetTest.buildFeedbackPackage("art").payload;
  assert(artFeedback.art.audioFallbackUsed, "Art audio fallback should be recorded");
  assert(artFeedback.pendingActivityIds.includes("color"), "Unfinished art step should remain pending");
}

{
  const context = makeContext();
  const englishOnly = { ...pack, packId: "2026-07-25-english-only-snapshot", chinese: { characters: [], words: [] }, art: null };
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(englishOnly));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  context.__planetTest.initializeCourseProgress(parsed);
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.planets.english.status === "not_started", "Scheduled but untouched English should be not_started");
  assert(snapshot.planets.chinese.status === "not_scheduled", "Missing Chinese course should be not_scheduled");
  assert(snapshot.planets.art.status === "not_scheduled", "Missing Art course should be not_scheduled");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  context.__planetTest.initializeCourseProgress(parsed);
  context.__planetTest.recordReadAloudUse("chinese:reading", { voiceSource: "device_tts" });
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.planets.chinese.interactions.some((item) => item.readAloudUsed && item.voiceSource === "device_tts"), "Read-aloud usage should enter the global snapshot");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  progress.chinese.readingAnnotations = {
    reading: {
      sectionId: "reading",
      characters: {
        "影": { character: "影", status: "unknown", paragraphIndexes: [0, 1], firstMarkedAt: "2026-07-25T08:00:00.000Z" },
        "长": { character: "长", status: "unsure", paragraphIndexes: [0], firstMarkedAt: "2026-07-25T08:01:00.000Z" }
      }
    }
  };
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.planets.chinese.readingAnnotations.unknownCharacters.includes("影"), "Unknown reading annotations should enter snapshot");
  assert(snapshot.planets.chinese.readingAnnotations.unsureCharacters.includes("长"), "Unsure reading annotations should enter snapshot");
}

{
  const context = makeContext();
  const parsed = context.__planetTest.parseLearningPackInput(JSON.stringify(pack));
  const preview = context.__planetTest.buildLearningPackPreview(parsed);
  context.__planetTest.importLearningPack(parsed, preview);
  const progress = context.__planetTest.initializeCourseProgress(parsed);
  context.__planetTest.state.recordingClips = {
    "clip/unsafe": {
      clipId: "clip/unsafe",
      sessionId: progress.english.sessionId,
      packId: parsed.packId,
      planetId: "english",
      courseId: "daily-english",
      lessonId: "lesson",
      activityId: "english:dialogue_exit",
      takeNumber: 1,
      startedAt: "2026-07-25T10:00:00.000Z",
      endedAt: "2026-07-25T10:00:12.000Z",
      duration: 12,
      mimeType: "audio/webm;codecs=opus",
      size: 1234,
      status: "complete",
      chunkCount: 2,
      includeInFeedback: true,
      category: "dialogue"
    }
  };
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.attachmentsExpected.audio.length === 1, "Snapshot should list audio attachments");
  assert(snapshot.planets.english.recordingSummary.clipCount === 1, "English recording summary should include clip count");
  assert(snapshot.planets.english.recordings[0].fileName.endsWith(".webm"), "Recording manifest should provide safe audio file name");
  assert(!JSON.stringify(snapshot).includes("base64"), "Feedback snapshot must not embed audio as base64");
}

{
  const context = makeContext({}, { now: Date.parse("2026-07-26T10:00:00.000Z") }, { englishLibraryBundle });
  const library = context.__planetTest.normalizeEnglishLessonLibrary(helloSchoolLibrary);
  context.__planetTest.importEnglishLessonLibrary(library, { source: "test" });
  assert(context.__planetTest.getEnglishLessonLibrary().lessons.length === 32, "Hello School library should contain 32 lessons");
  assert(context.__planetTest.getSelectedEnglishLibraryLesson().lessonId === "hello-school-lesson-26", "Default selected English lesson should be lesson 26");
  assert(context.__planetTest.getSelectedEnglishLibraryLesson().anchorSentence === "Our teacher says, “Open your books. Let’s read together.”", "Lesson 26 anchor sentence should be exact");
  const seedStatuses = library.lessons.map((lesson) => lesson.progressSeedStatus);
  assert(seedStatuses.slice(0, 25).every((status) => status === "history_learned_unverified"), "Lessons 1-25 should be history_learned_unverified");
  assert(seedStatuses[25] === "current_confirmed", "Lesson 26 should be current_confirmed");
  assert(seedStatuses.slice(26).every((status) => status === "future_not_started"), "Lessons 27-32 should be future_not_started");
  library.lessons.forEach((lesson) => {
    const steps = lesson.lesson.steps;
    assert(steps.length === 7, `${lesson.lessonId} should expose seven steps`);
    assert(steps.map((step) => step.id).join(",") === "retrieval,blind_listening,meaning_and_text,echo,blocks,phonics,dialogue_exit", `${lesson.lessonId} should keep the stable seven-step order`);
    assert(lesson.lesson.minutesByMode.light >= 16 && lesson.lesson.minutesByMode.light <= 19, `${lesson.lessonId} light minutes should be 16-19`);
    assert(lesson.lesson.minutesByMode.standard >= 20 && lesson.lesson.minutesByMode.standard <= 22, `${lesson.lessonId} standard minutes should be 20-22`);
  });
  const activePack = context.__planetTest.getActiveEnglishPack();
  assert(activePack.packId === "english-library:hello-school-story3-complete-32:hello-school-lesson-26", "English library should use a stable virtual packId per lesson");
  assert(activePack.english.lesson.allowedModes.join(",") === "light,standard", "English library pack should expose light and standard modes only");
  assert(context.__planetTest.getEnglishLessonSteps(activePack).length === 7, "Virtual English pack should render seven steps");
  assert(context.__planetTest.getActivePackForCourse("chinese") !== activePack, "Chinese active pack should not become the English virtual pack");
}

{
  const preservedProgress = {
    version: 2,
    currentLibraryVersion: 6,
    words: {
      playground: { itemId: "playground", seenCount: 4, masteryCount: 3 },
      object: { itemId: "object", seenCount: 1, masteryCount: 0 }
    },
    recentlyShownIds: ["playground"],
    dailyStats: {},
    settings: { scope: "all" }
  };
  const library = JSON.parse(JSON.stringify(helloSchoolLibrary));
  library.lessons[0].wordFocus.push({ text: "[object Object]", meaningZh: "invalid" }, { text: { nested: true }, meaningZh: "invalid" });
  const context = makeContext({ "english-word-recognition-progress-v2": JSON.stringify(preservedProgress) }, { now: Date.parse("2026-07-26T10:05:00.000Z") }, { englishLibraryBundle });
  context.__planetTest.importEnglishLessonLibrary(library, { source: "word_focus_test" });
  const dynamicWords = context.__planetTest.getDynamicEnglishWordsFromPacks();
  const wordTexts = dynamicWords.map((word) => word.text);
  ["playground", "run", "jump", "skip", "we"].forEach((word) => {
    assert(wordTexts.includes(word), `English recognition should include ${word} from the lesson library`);
  });
  assert(dynamicWords.find((word) => word.text === "playground")?.meaningZh === "操场", "Lesson-library meanings should be preserved");
  assert(!dynamicWords.some((word) => typeof word.text !== "string" || word.text === "[object Object]" || word.id === "object"), "Lesson-library objects must never render as object text");
  const activeWords = context.__planetTest.getActiveEnglishPack().english.words;
  assert(activeWords.every((word) => typeof word.text === "string" && word.text !== "[object Object]" && word.id !== "object"), "Virtual lesson packs should filter invalid focus words");
  const sourceLabel = context.__planetTest.getEnglishSourceLabel({ sources: ["english_library:lesson-1", "english_library:lesson-2"] });
  assert(sourceLabel === "Hello, School!" && !sourceLabel.includes("english_library:"), "Lesson-library source labels should be friendly and deduplicated");
  const savedProgress = JSON.parse(context.__store["english-word-recognition-progress-v2"]);
  assert(savedProgress.words.playground.seenCount === 4 && savedProgress.words.playground.masteryCount === 3, "Valid English recognition progress should survive library refresh");
  assert(savedProgress.words.object.seenCount === 1, "Legacy object progress should remain stored without being rendered");
}

{
  const context = makeContext({}, { now: Date.parse("2026-07-26T10:10:00.000Z") }, { englishLibraryBundle });
  const parsedDay14 = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(parsedDay14, context.__planetTest.buildLearningPackPreview(parsedDay14), { select: true, markLatest: true });
  context.__planetTest.initializeCourseProgress(parsedDay14);
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "test" });
  const selectedBefore = context.__planetTest.state.selectedLearningPackId;
  const englishPack = context.__planetTest.getActiveEnglishPack();
  const englishProgress = context.__planetTest.getCourseProgress(englishPack.packId);
  context.__planetTest.renderEnglishLesson();
  const headerHtml = context.__elements.get("#englishLessonHeader").innerHTML;
  const listeningHtml = context.__elements.get("#englishListeningZone").innerHTML;
  const stepHtml = context.__elements.get("#englishLessonSteps").innerHTML;
  const pageHtml = `${headerHtml}${listeningHtml}${stepHtml}`;
  const visibleHeaderText = headerHtml.replace(/<[^>]+>/g, " ");
  assert(headerHtml.includes("课程选择") && headerHtml.includes("第26课") && headerHtml.includes("← 上一课") && headerHtml.includes("下一课 →"), "English page should expose previous/next/direct lesson selection");
  assert(headerHtml.includes("<h1>Our teacher says, “Open your books. Let’s read together.”</h1>"), "English page should use the current sentence as its single title");
  assert(!headerHtml.includes("当前定位") && !headerHtml.includes("正在查看") && !headerHtml.includes("当前学习定位") && !headerHtml.includes("预计"), "English header should omit internal location and planning metadata");
  assert(!visibleHeaderText.includes("英语课程库：") && !visibleHeaderText.includes("hello-school-story3-complete-32") && !visibleHeaderText.includes(parsedDay14.packId), "English page should not visibly show raw library ids or the shared Day14 pack id");
  assert(!pageHtml.includes("家长说") && !pageHtml.includes("结束标准") && !pageHtml.includes("查看参考"), "English child page should not render parent-only scaffolds");
  assert(!pageHtml.includes("先回想上一句") && !pageHtml.includes("What does our teacher say?"), "English child page should not leak parent prompts from Revision library");
  assert(pageHtml.includes("老师开始带大家读书") && pageHtml.includes("先用积木拼回原句"), "English child page should render childVisible instructions");
  assert(context.__planetTest.state.selectedLearningPackId === selectedBefore, "Rendering/selecting English lesson must not change selected Chinese date pack");
  assert(!Object.values(englishProgress.english.steps).some((item) => item.finishedAt), "Opening an English lesson must not mark steps complete");
}

{
  const context = makeContext({}, { now: Date.parse("2026-07-26T10:20:00.000Z") }, { englishLibraryBundle });
  const parsedDay14 = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(parsedDay14, context.__planetTest.buildLearningPackPreview(parsedDay14), { select: true, markLatest: true });
  context.__planetTest.initializeCourseProgress(parsedDay14);
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "test" });
  assert(context.__planetTest.selectRelativeEnglishLesson("next"), "Next English lesson should be selectable");
  assert(context.__planetTest.getSelectedEnglishLibraryLesson().lessonId === "hello-school-lesson-27", "Next should move from lesson 26 to lesson 27");
  assert(context.__planetTest.getActiveEnglishPack().english.anchorSentence === "We read, listen and learn together.", "Lesson 27 should be available as future_not_started but not forced as current");
  let headerHtml = context.__elements.get("#englishLessonHeader").innerHTML;
  let visibleHeaderText = headerHtml.replace(/<[^>]+>/g, " ");
  assert(headerHtml.includes("<h1>We read, listen and learn together.</h1>"), "After switching to lesson 27, the sentence title should update");
  assert(!headerHtml.includes("正在查看") && !headerHtml.includes("当前学习定位"), "Lesson 27 should not expose redundant viewing metadata");
  assert(!visibleHeaderText.includes("英语课程库：") && !visibleHeaderText.includes("hello-school-lesson-27") && !visibleHeaderText.includes(parsedDay14.packId), "Lesson 27 metadata should not visibly expose raw ids or the Day14 pack id");
  const lesson27Progress = context.__planetTest.getActiveProgressForCourse("english");
  assert(!Object.values(lesson27Progress.english.steps).some((item) => item.finishedAt), "Switching to lesson 27 should not complete it");
  assert(context.__planetTest.selectEnglishLibraryLesson("hello-school-lesson-26"), "Direct selector should return to lesson 26");
  headerHtml = context.__elements.get("#englishLessonHeader").innerHTML;
  visibleHeaderText = headerHtml.replace(/<[^>]+>/g, " ");
  assert(headerHtml.includes("<h1>Our teacher says, “Open your books. Let’s read together.”</h1>"), "Returning to lesson 26 should update the sentence title");
  assert(context.__planetTest.selectRelativeEnglishLesson("prev"), "Previous English lesson should be selectable");
  assert(context.__planetTest.getSelectedEnglishLibraryLesson().lessonId === "hello-school-lesson-25", "Previous should move to lesson 25");
  assert(context.__planetTest.selectRelativeEnglishLesson("current"), "Current shortcut should return to lesson 26");
  const lesson26Pack = context.__planetTest.getActiveEnglishPack();
  const beforeDayProgress = JSON.stringify(context.__planetTest.state.courseProgress[parsedDay14.packId]);
  context.__planetTest.completeCourseItem("english:blocks");
  context.__planetTest.completeCourseItem("english:blocks");
  const item = context.__planetTest.getCourseProgress(lesson26Pack.packId).english.steps["english:blocks"];
  assert(item.finishedAt && item.attempts === 2 && item.attemptHistory.length === 2, "Relearning an English step should append attempts instead of overwriting");
  assert(item.attemptHistory.every((attempt) => attempt.lessonId === "hello-school-lesson-26"), "English attempt history should keep the lesson id");
  assert(JSON.stringify(context.__planetTest.state.courseProgress[parsedDay14.packId]) === beforeDayProgress, "English attempts must not mutate Day14 Chinese/date pack progress");
}

{
  const context = makeContext({}, { now: Date.parse("2026-07-26T10:30:00.000Z") }, { englishLibraryBundle });
  const parsedDay14 = context.__planetTest.parseLearningPackInput(JSON.stringify(day14Pack));
  context.__planetTest.importLearningPack(parsedDay14, context.__planetTest.buildLearningPackPreview(parsedDay14), { select: true, markLatest: true });
  context.__planetTest.initializeCourseProgress(parsedDay14);
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "test" });
  context.__planetTest.completeEnglishAppStage("english:app_stage");
  context.__planetTest.completeCourseItem("english:blocks");
  const feedback = context.__planetTest.buildFeedbackPackage("english").payload;
  assert(feedback.packId === "english-library:hello-school-story3-complete-32:hello-school-lesson-26", "Single English feedback should use the English virtual pack");
  assert(feedback.english.lessonLibrary.lessons.length === 32, "English feedback should include all 32 Story 3 lesson statuses");
  const lesson26 = feedback.english.lessonLibrary.lessons.find((lesson) => lesson.lessonId === "hello-school-lesson-26");
  const lesson27 = feedback.english.lessonLibrary.lessons.find((lesson) => lesson.lessonId === "hello-school-lesson-27");
  assert(lesson26.status === "partial" && lesson26.stepCompletion.completed === 5, "Feedback should mark attempted lesson 26 as partial with completed steps");
  assert(lesson26.attempts.length >= 5, "Feedback should include per-step English attempt history");
  assert(lesson27.status === "not_started" && lesson27.progressSeedStatus === "future_not_started", "Feedback should keep future lesson seed separate from actual status");
  const snapshot = context.__planetTest.buildFeedbackPackage().payload;
  assert(snapshot.activeLearningContext.activePackIdsByPlanet.english[0] === feedback.packId, "Current snapshot should point English to the virtual library pack");
  assert(snapshot.activeLearningContext.activePackIdsByPlanet.chinese[0] === parsedDay14.packId, "Current snapshot should keep Chinese on the selected Day pack");
}

// Adaptive English daily-course regression: variable activity counts, no
// anchor sentence, separate from the historical Story 3 library, and atomic
// rejection of unknown activity types.
{
  const context = makeContext({}, { now: Date.parse("2026-08-02T02:00:00.000Z") }, { englishLibraryBundle });
  context.__planetTest.importEnglishLessonLibrary(helloSchoolLibrary, { source: "adaptive_test" });
  const makeAdaptive = (packId, lessonId, titleZh) => ({
    schemaVersion: "helen-learning-pack/2",
    packId,
    date: "2026-08-02",
    title: `英语可变日课 · ${titleZh}`,
    loadMode: "standard",
    contentPolicy: { authority: "codex-course-designer", websiteMode: "render-only", allowModelGeneration: false },
    sharedPlan: { defaultEnglishMode: "light", plannedEnglishMinutes: 18 },
    chinese: { characters: [], words: [], confusedPairs: [], lesson: null },
    english: {
      courseArchitectureVersion: "letter-planet-adaptive/1",
      lessonId,
      contentVersion: 1,
      dailyMission: { titleZh, primarySkill: "spoken_transfer", secondarySkills: ["listening"] },
      sourceLearningReference: { relationship: "delayed", externalTool: "每日英语听力", materialIds: ["story-3:28"] },
      sourceMaterialIds: ["story-3:28", "story-1:03"],
      evidenceTargetIds: ["function:request"],
      // Use non-diagnostic route labels here so this fixture exercises the
      // variable activity list below instead of the published six-question
      // D01/D02 diagnostic generators.
      diagnostic: { routeDay: packId === "adaptive-pack-1" ? "X01" : "X02", baselineOrRetest: "baseline", strengths: [], reviewQueue: [], nextRecommendation: "" },
      durationByMode: { lightMinutes: 10, standardMinutes: 18 },
      activities: [
        { activityId: "retrieve", activityType: "select", titleZh: "先回想", childVisible: { instructionZh: "选出最合适的回应。", options: [{ id: "a", label: "Open your book.", value: "open" }, { id: "b", label: "Close the door.", value: "close" }] }, interaction: { options: [] }, hintPolicy: { levels: ["先听清楚动作词。", "这句话是在请求对方做什么？"] }, plannedMinutesByMode: { light: 3, standard: 4 }, evidenceTargetIds: ["function:request"] },
        { activityId: "transfer", activityType: "guided_write", titleZh: "换个场景说", childVisible: { instructionZh: "写下一句新的表达。" }, plannedMinutesByMode: { light: 4, standard: 6 } },
        { activityId: "optional_dialogue", activityType: "dialogue", titleZh: "完成对话", standardOnly: true, childVisible: { instructionZh: "完成两轮对话。", dialogue: [{ speaker: "A", text: "Open your books." }] }, plannedMinutesByMode: { light: 4, standard: 6 }, parentOnly: { notesZh: "仅供观察，不进入学生题面。" } }
      ],
      words: [], pattern: { blocks: [] }
    },
    art: null
  });
  const first = context.__planetTest.parseLearningPackInput(JSON.stringify(makeAdaptive("adaptive-pack-1", "adaptive-lesson-1", "听懂后换个场景表达")));
  assert(context.__planetTest.isAdaptiveEnglishPack(first), "Adaptive pack should be recognized after validation");
  assert(!first.english.anchorSentence, "Adaptive pack may omit anchorSentence");
  const preview = context.__planetTest.buildLearningPackPreview(first);
  context.__planetTest.importLearningPack(first, preview, { select: true, markLatest: true });
  const second = context.__planetTest.parseLearningPackInput(JSON.stringify(makeAdaptive("adaptive-pack-2", "adaptive-lesson-2", "听辨与回应")));
  context.__planetTest.importLearningPack(second, context.__planetTest.buildLearningPackPreview(second), { select: false, markLatest: true });
  assert(context.__planetTest.state.englishCourseSource === "adaptive", "Importing an adaptive pack should select adaptive English source");
  assert(context.__planetTest.getLearningCourseSequence("english").length === 2, "Adaptive courses should form their own selectable sequence");
  const homeState = context.__planetTest.getPlanetHomeState("english");
  assert(["听懂后换个场景表达", "听辨与回应"].includes(homeState.title) && homeState.route === "letter-course", "Letter Planet home should prioritize the latest adaptive course instead of fixed Story 3");
  const lightSteps = context.__planetTest.getEnglishLessonSteps(first, "light");
  assert(lightSteps.length === 2 && lightSteps.map((step) => step.number).join(",") === "1,2", "Light mode should omit standard-only activity and renumber visible activities");
  context.__planetTest.state.selectedLearningPackId = first.packId;
  context.__planetTest.state.selectedEnglishDiagnosticPackId = first.packId;
  context.__planetTest.state.englishCourseSource = "adaptive";
  context.__planetTest.initializeCourseProgress(first);
  context.__planetTest.state.courseProgress[first.packId].english.selectedMode = "light";
  context.__planetTest.renderEnglishLesson();
  const adaptivePage = `${context.__elements.get("#englishLessonHeader").innerHTML}${context.__elements.get("#englishLessonSteps").innerHTML}`;
  assert(adaptivePage.includes("听懂后换个场景表达") && (adaptivePage.match(/class="adaptive-progress-node/g) || []).length === 2, "Adaptive page should use dailyMission title and actual activity progress");
  assert((visibleText(adaptivePage).match(/完成课程/g) || []).length === 0, "Non-final adaptive activity should not show a duplicate completion action");
  assert(adaptivePage.includes("历史课程"), "Adaptive page should expose a low-distraction route back to the historical Story 3 library");
  assert(adaptivePage.includes("课程列表") && adaptivePage.includes("X01｜听懂后换个场景表达"), "Adaptive course selector should expose a short visible label and compact route-day option names");
  assert((adaptivePage.match(/data-course-sequence-nav=/g) || []).length === 2 && adaptivePage.includes("adaptive-course-select-label"), "Adaptive desktop switcher should keep previous, selector, next, and history as four sibling controls");
  assert(/\.english-adaptive-switcher\s*\{[\s\S]*?grid-template-columns:\s*auto minmax\(180px, 1fr\) auto auto;[\s\S]*?align-items:\s*center;/.test(stylesSource), "Adaptive desktop navigation should reserve four explicit columns on one baseline");
  assert(!/\.adaptive-history-link\s*\{[\s\S]*?margin-top:\s*-6px/.test(stylesSource), "Adaptive history link should not use a vertical offset hack");
  assert(/\.date-switcher\.english-adaptive-switcher[\s\S]*grid-template-columns:\s*repeat\(2/.test(stylesSource), "Adaptive mobile navigation should use an explicit two-column grid at 375px and 390px");
  assert(/\.date-switcher\.english-adaptive-switcher > \.adaptive-course-select-label[\s\S]*grid-row:\s*1/.test(stylesSource) && /\.date-switcher\.english-adaptive-switcher > \[data-course-sequence-nav="prev"\][\s\S]*grid-row:\s*2/.test(stylesSource) && /\.date-switcher\.english-adaptive-switcher > \[data-english-history-library\][\s\S]*grid-column:\s*1 \/ -1/.test(stylesSource), "Adaptive mobile navigation should keep selector on row one, previous/next on row two, and history on a full-width row three");
  context.__planetTest.setAdaptiveEnglishActivity(1);
  const finalAdaptivePage = `${context.__elements.get("#englishLessonHeader").innerHTML}${context.__elements.get("#englishLessonSteps").innerHTML}`;
  assert((visibleText(finalAdaptivePage).match(/完成课程/g) || []).length === 1, "Final adaptive activity should expose one completion action");
  assert(!visibleText(adaptivePage).includes("仅供观察") && !visibleText(adaptivePage).includes("adaptive-pack-1") && !visibleText(adaptivePage).includes("家长轻松度"), "Student adaptive page must not expose parent scaffolding, source internals, or pack IDs");
  assert(adaptivePage.includes("查看提示") && adaptivePage.includes('hidden>先听清楚动作词'), "Adaptive hints should start collapsed with a low-emphasis control");
  context.__planetTest.revealAdaptiveEnglishHint("english:retrieve");
  assert(context.__planetTest.state.courseProgress[first.packId].english.steps["english:retrieve"].hintLevelUsed === 1, "Adaptive hint reveal should record the first hint level");
  context.__planetTest.selectAdaptiveEnglishOption({ dataset: { englishAdaptiveOption: "english:retrieve", adaptiveOptionValue: "open", adaptiveMulti: "false" } });
  assert(context.__planetTest.state.courseProgress[first.packId].english.steps["english:retrieve"].adaptiveAnswer === "open", "Adaptive option selection should persist");
  context.__planetTest.updateAdaptiveWritingAnswer({ dataset: { adaptiveWriting: "english:transfer" }, value: "Please open the book." });
  assert(context.__planetTest.state.courseProgress[first.packId].english.steps["english:transfer"].adaptiveAnswer === "Please open the book.", "Guided writing should persist without rerendering the textarea");
  context.__planetTest.completeCourseItem("english:retrieve");
  const feedback = context.__planetTest.buildFeedbackPackage("english").payload;
  assert(feedback.english.adaptive.lessonId === "adaptive-lesson-1" && feedback.english.adaptive.activityCount === 2, "Adaptive feedback should include lesson identity and mode-visible activity count");
  assert(feedback.english.lessonLibrary === null, "Adaptive feedback must not be labeled as Story 3 library feedback");
  const beforePacks = JSON.stringify(context.__planetTest.state.learningPacks);
  const invalid = makeAdaptive("adaptive-invalid", "adaptive-invalid", "坏类型");
  invalid.english.activities[0].activityType = "unknown_type";
  let rejected = false;
  try { context.__planetTest.parseLearningPackInput(JSON.stringify(invalid)); } catch (error) { rejected = /不支持/.test(String(error.message)); }
  assert(rejected, "Unknown adaptive activity type should be rejected before import");
  assert(JSON.stringify(context.__planetTest.state.learningPacks) === beforePacks, "Rejected adaptive pack must not write any course data");
  assert(context.__planetTest.openEnglishHistoryLibrary(), "Historical library switch should be reachable from adaptive course");
  assert(context.__planetTest.state.englishCourseSource === "library" && !context.__planetTest.isAdaptiveEnglishPack(context.__planetTest.getActiveEnglishPack()), "Switching to history should restore the existing Story 3 course without changing adaptive packs");
  context.__planetTest.renderEnglishLesson();
  const historyPage = context.__elements.get("#englishLessonHeader").innerHTML;
  assert(historyPage.includes("data-english-adaptive-home") && historyPage.includes("今日任务"), "Historical library should expose a clear route back to today's adaptive task");
  const latestAdaptiveId = context.__planetTest.getLearningCourseSequence("english").at(-1).packId;
  context.__planetTest.initializeCourseProgress(context.__planetTest.state.learningPacks[latestAdaptiveId].data);
  context.__planetTest.state.courseProgress[latestAdaptiveId].english.currentActivityIndex = 1;
  assert(context.__planetTest.openEnglishAdaptiveHome(), "Today's adaptive task switch should be reachable from the historical library");
  assert(context.__planetTest.state.englishCourseSource === "adaptive" && context.__planetTest.state.selectedLearningPackId === latestAdaptiveId, "Today's adaptive switch should select the latest adaptive course and retain its progress");
}

console.log(JSON.stringify({ ok: true, version: makeContext().__planetTest.APP_METADATA.version }, null, 2));
