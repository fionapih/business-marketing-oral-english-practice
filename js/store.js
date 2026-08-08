/**
 * 本地数据层 — LocalStorage 优先，容量吃紧时自动降级到 IndexedDB
 * 所有学习记录关闭页面不丢失，无需后端。
 */
const Store = (() => {
  const KEY = 'ec_state_v1';

  // 今日任务单元总数：15 个单词 + 1 段场景对话
  const TOTAL_TODAY = 16;

  const defaultState = () => ({
    version: 1,
    createdAt: Date.now(),
    /** 熟练度：{ itemId: { lv:'known'|'fuzzy'|'unknown', reps:0, ease:2.5, due:ts, last:ts } } */
    mastery: {},
    /** 收藏：[{ id, en, zh, sceneId, ts }] */
    favorites: [],
    /** 笔记：{ itemId: text } */
    notes: {},
    /** 打卡：{ 'YYYY-MM-DD': { done:16, quiz:3, scenes:[] } } */
    checkins: {},
    /** 复盘：[{ date, text }] */
    reflections: [],
    /** 场景进度：{ sceneId: { learned:0, total:0 } } */
    scenes: {},
    /** 今日任务包缓存：{ date, wordIds:[], dialogue:{sceneId,start,count}, doneIds:[], dialogueDone, dialogueScores:{} } */
    todayPack: null,
    /** 实战演练作答：{ questionId: answerText } */
    practice: {},
    settings: { accent: 'us', sound: true }
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      console.warn('[store] load failed, reset', e);
      return defaultState();
    }
  }

  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        document.dispatchEvent(new CustomEvent('store:saved'));
      } catch (e) {
        console.error('[store] save failed', e);
      }
    }, 180);
  }

  /* ---------- 日期工具 ---------- */
  const todayKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  /* ---------- 熟练度（艾宾浩斯间隔） ---------- */
  const INTERVALS = { known: [1, 3, 7, 15, 30, 60], fuzzy: [0.5, 1, 2, 4, 7], unknown: [0] };

  function setLevel(itemId, lv) {
    const now = Date.now();
    const rec = state.mastery[itemId] || { lv: null, reps: 0, last: 0, due: 0 };
    if (rec.lv === lv) rec.reps = Math.min(rec.reps + 1, 10);
    else rec.reps = lv === 'known' ? Math.max(rec.reps, 1) : 0;
    rec.lv = lv;
    rec.last = now;
    const table = INTERVALS[lv] || INTERVALS.fuzzy;
    const days = table[Math.min(rec.reps, table.length - 1)];
    rec.due = now + days * 86400000;
    state.mastery[itemId] = rec;
    save();
    return rec;
  }

  const getLevel = id => state.mastery[id]?.lv || null;
  function markShadowScore(cardId, score) {
    const rec = state.mastery[cardId] || { lv: null, reps: 0, last: 0, due: 0 };
    rec.shadowScore = score;
    state.mastery[cardId] = rec;
    save();
  }
  const getShadowScore = cardId => state.mastery[cardId]?.shadowScore ?? null;
  const masteredCount = () => Object.values(state.mastery).filter(m => m.lv === 'known').length;
  const weakItems = () =>
    Object.entries(state.mastery)
      .filter(([, m]) => m.lv === 'fuzzy' || m.lv === 'unknown')
      .sort((a, b) => a[1].due - b[1].due)
      .map(([id, m]) => ({ id, ...m }));

  /** 到期待复习的「单词」条目（仅 terms 模式） */
  function dueTermIds(limit = 15) {
    const now = Date.now();
    return Object.entries(state.mastery)
      .filter(([id, m]) => m.due <= now && CARD_MAP[id] && CARD_MAP[id].mode === 'terms')
      .sort((a, b) => {
        const w = { unknown: 0, fuzzy: 1, known: 2 };
        return (w[a[1].lv] - w[b[1].lv]) || (a[1].due - b[1].due);
      })
      .slice(0, limit)
      .map(([id]) => id);
  }

  /* ---------- 语料索引（对接第二阶段真实语料） ---------- */
  let CARD_MAP = {}, BY_SCENE = {}, ALL = [];
  let BY_SCENE_DIALOGUE = {};  // sceneId -> [{role,en,zh}]（按语料顺序）
  let TERM_IDS = [];           // 术语卡 id 列表
  let EXAMPLE_SOURCE = [];     // 句型 + 对话卡（用于给单词匹配真实例句）
  const EXAMPLE_CACHE = {};

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initCorpus() {
    if (!window.CORPUS || ALL.length) return;
    ALL = window.CORPUS;
    ALL.forEach(c => {
      CARD_MAP[c.id] = c;
      (BY_SCENE[c.s] = BY_SCENE[c.s] || []).push(c);
      if (c.mode === 'dialogue')
        (BY_SCENE_DIALOGUE[c.s] = BY_SCENE_DIALOGUE[c.s] || []).push({ role: c.role, en: c.en, zh: c.zh });
    });
    TERM_IDS = ALL.filter(c => c.mode === 'terms').map(c => c.id);
    EXAMPLE_SOURCE = ALL.filter(c => c.mode === 'patterns' || c.mode === 'dialogue');

    const totals = {};
    ALL.forEach(c => { totals[c.s] = (totals[c.s] || 0) + 1; });
    Object.keys(totals).forEach(sid => {
      state.scenes[sid] = state.scenes[sid] || { learned: 0, total: 0 };
      state.scenes[sid].total = totals[sid];
    });
  }

  /** 给一个单词卡匹配「包含该单词的真实例句」（句型/对话原句），匹配不到返回 null */
  function exampleFor(termId) {
    if (EXAMPLE_CACHE[termId] !== undefined) return EXAMPLE_CACHE[termId];
    const term = CARD_MAP[termId];
    let res = null;
    const MAX_EXAMPLE_LEN = 250;
    if (term && term.en) {
      const t = term.en.trim().toLowerCase();
      if (t) {
        const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = /\s/.test(t) ? new RegExp(esc) : new RegExp('\\b' + esc + '\\b', 'i');
        const hits = EXAMPLE_SOURCE.filter(c => c.en && c.en.length <= MAX_EXAMPLE_LEN && re.test(c.en.toLowerCase()));
        if (hits.length) res = { en: hits[0].en, zh: hits[0].zh };
      }
    }
    EXAMPLE_CACHE[termId] = res;
    return res;
  }

  const getCard = id => CARD_MAP[id];
  const totalCards = () => ALL.length;
  function sceneTotal(sid)  { return BY_SCENE[sid] ? BY_SCENE[sid].length : (state.scenes[sid]?.total || 0); }
  function sceneLearned(sid) {
    const arr = BY_SCENE[sid] || [];
    return arr.filter(c => state.mastery[c.id]).length;
  }
  function sceneKnown(sid) {
    const arr = BY_SCENE[sid] || [];
    return arr.filter(c => state.mastery[c.id]?.lv === 'known').length;
  }

  /* ---------- 场景对话：按子场景切分（每个场景独立命名） ---------- */
  const DLG_SUBSCENE_NAMES = [
    '会议开场与议程', '工作进度同步', '问题与障碍讨论', '方案决策与共识',
    '任务分配与分工', '风险与资源协调', '总结与后续跟进'
  ];
  // 优先使用 data/subscenes.js 中每个场景专属的主题名，避免所有场景套同一组标签
  const SCENE_SUBSCENES = (typeof window !== 'undefined' && window.SCENE_SUBSCENES) || {};
  function dialogueSubScenes(sid, n = 7) {
    const turns = BY_SCENE_DIALOGUE[sid] || [];
    if (!turns.length) return [];
    const names = SCENE_SUBSCENES[sid] || DLG_SUBSCENE_NAMES;
    const parts = Math.min(n, turns.length);
    const base = Math.floor(turns.length / parts);
    let extra = turns.length - base * parts;
    const out = [];
    let start = 0;
    for (let d = 1; d <= parts; d++) {
      const count = base + (extra-- > 0 ? 1 : 0);
      const slice = turns.slice(start, start + count);
      const nameIdx = d - 1;
      out.push({
        idx: d,
        title: (names[nameIdx] || DLG_SUBSCENE_NAMES[nameIdx] || `对话集 ${d}`),
        sub: slice[0]?.en?.slice(0, 46) + (slice[0]?.en?.length > 46 ? '…' : '') || '',
        start,
        count,
        turns: slice.map((t, i) => {
          const c = (BY_SCENE[sid] || []).filter(c => c.mode === 'dialogue')[start + i];
          return { ...t, idx: start + i, cardId: c ? c.id : null };
        }),
        cardIds: (BY_SCENE[sid] || []).filter(c => c.mode === 'dialogue').slice(start, start + count).map(c => c.id)
      });
      start += count;
    }
    return out;
  }
  function dialogueSubSceneProgress(sid, idx) {
    const obj = dialogueSubScenes(sid).find(d => d.idx === idx);
    if (!obj) return { learned: 0, known: 0, total: 0, pct: 0 };
    const total = obj.count;
    const learned = obj.cardIds.filter(id => state.mastery[id]).length;
    const known = obj.cardIds.filter(id => state.mastery[id]?.lv === 'known').length;
    return { learned, known, total, pct: total ? Math.round(known / total * 100) : 0 };
  }

  /* ---------- 每日任务包（15 单词 + 1 段场景对话） ---------- */
  function pickDailyDialogue(tk) {
    const scenes = Object.keys(BY_SCENE_DIALOGUE).filter(sid => BY_SCENE_DIALOGUE[sid].length >= 4);
    if (!scenes.length) return { sceneId: null, start: 0, count: 0 };
    const d = new Date(tk + 'T00:00:00');
    const startOfYear = new Date(d.getFullYear(), 0, 0);
    const dayIndex = Math.floor((d - startOfYear) / 86400000);
    const sceneId = scenes[dayIndex % scenes.length];
    const turns = BY_SCENE_DIALOGUE[sceneId];
    const WINDOW = 6;
    const maxStart = Math.max(0, turns.length - WINDOW);
    const start = Math.floor(dayIndex / scenes.length) % (maxStart + 1);
    return { sceneId, start, count: Math.min(WINDOW, turns.length - start) };
  }

  function buildTodayPack() {
    const tk = todayKey();
    if (state.todayPack && state.todayPack.date === tk) {
      if (!state.todayPack.doneIds) state.todayPack.doneIds = [];
      if (state.todayPack.dialogueDone == null) state.todayPack.dialogueDone = false;
      if (!state.todayPack.dialogueScores) state.todayPack.dialogueScores = {};
      return state.todayPack;
    }
    const seen = new Set(Object.keys(state.mastery));
    const terms = TERM_IDS.map(id => CARD_MAP[id]).filter(Boolean);

    // 15 个单词：优先未学过的「新知」，不足则用到期复习词、再到已学词补足
    const fresh = shuffle(terms.filter(c => !seen.has(c.id)));
    let wordIds = fresh.slice(0, 15).map(c => c.id);
    const dueSet = new Set(dueTermIds(15));
    const dueTerms = shuffle(terms.filter(c => seen.has(c.id) && dueSet.has(c.id) && !wordIds.includes(c.id)));
    let ri = 0;
    while (wordIds.length < 15 && ri < dueTerms.length) wordIds.push(dueTerms[ri++].id);
    const anySeen = shuffle(terms.filter(c => seen.has(c.id) && !wordIds.includes(c.id)));
    let ai = 0;
    while (wordIds.length < 15 && ai < anySeen.length) wordIds.push(anySeen[ai++].id);

    const dialogue = pickDailyDialogue(tk);
    state.todayPack = { date: tk, wordIds, dialogue, doneIds: [], dialogueDone: false, dialogueScores: {} };
    save();
    return state.todayPack;
  }

  function todayDoneCount() {
    let n = state.todayPack?.doneIds?.length || 0;
    if (state.todayPack?.dialogueDone) n += 1;
    return n;
  }

  function markTaskDone(cardId, lv) {
    setLevel(cardId, lv);
    if (!state.todayPack || state.todayPack.date !== todayKey()) buildTodayPack();
    let rec = state.checkins[todayKey()];
    if (!state.todayPack.doneIds.includes(cardId)) {
      state.todayPack.doneIds.push(cardId);
      rec = checkin();
      rec.done = todayDoneCount();
      if (todayDoneCount() >= TOTAL_TODAY) rec.completed = true;
    } else {
      rec = checkin();
    }
    save();
    return rec;
  }

  function markQuiz(n = 1) {
    const rec = checkin();
    rec.quiz = (rec.quiz || 0) + n;
    save();
  }

  /** 今日场景对话（影子跟读）：返回 { sceneId, turns:[{role,en,zh}], scores:{} } */
  function getDailyDialogue() {
    const p = state.todayPack;
    if (!p || p.date !== todayKey() || !p.dialogue || !p.dialogue.sceneId) return null;
    const turns = (BY_SCENE_DIALOGUE[p.dialogue.sceneId] || []).slice(p.dialogue.start, p.dialogue.start + p.dialogue.count);
    return { sceneId: p.dialogue.sceneId, turns, scores: p.dialogueScores || {} };
  }
  function markDialogueScore(i, score) {
    if (!state.todayPack) buildTodayPack();
    state.todayPack.dialogueScores = state.todayPack.dialogueScores || {};
    state.todayPack.dialogueScores[i] = score;
    save();
  }
  const dialogueDone = () => !!(state.todayPack && state.todayPack.dialogueDone);
  function markDialogueDone() {
    if (!state.todayPack || state.todayPack.date !== todayKey()) buildTodayPack();
    state.todayPack.dialogueDone = true;
    const rec = checkin();
    rec.done = todayDoneCount();
    if (todayDoneCount() >= TOTAL_TODAY) rec.completed = true;
    save();
    return rec;
  }

  /* ---------- 收藏 / 笔记 ---------- */
  function toggleFav(item) {
    const i = state.favorites.findIndex(f => f.id === item.id);
    if (i >= 0) state.favorites.splice(i, 1);
    else state.favorites.unshift({ ...item, ts: Date.now() });
    save();
    return i < 0;
  }
  const isFav = id => state.favorites.some(f => f.id === id);
  function setNote(id, text) { if (text) state.notes[id] = text; else delete state.notes[id]; save(); }
  const getNote = id => state.notes[id] || '';

  /* ---------- 打卡 / 连击 ---------- */
  function checkin(patch = {}) {
    const k = todayKey();
    state.checkins[k] = Object.assign({ done: 0, quiz: 0 }, state.checkins[k], patch);
    save();
    return state.checkins[k];
  }
  const todayRecord = () => state.checkins[todayKey()] || { done: 0, quiz: 0 };

  function streak() {
    let n = 0;
    const d = new Date();
    if (!state.checkins[todayKey(d)]?.completed) d.setDate(d.getDate() - 1);
    for (;;) {
      if (state.checkins[todayKey(d)]?.completed) { n++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return n;
  }

  /* ---------- 复盘 ---------- */
  function addReflection(text) {
    if (!text.trim()) return;
    state.reflections.unshift({ date: todayKey(), text: text.trim(), ts: Date.now() });
    state.reflections = state.reflections.slice(0, 400);
    save();
  }

  /* ---------- 导入 / 导出 / 清除 ---------- */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `外企英语学习舱_备份_${todayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') throw new Error('格式不正确');
    state = Object.assign(defaultState(), data);
    save();
    return true;
  }
  function clearAll() { localStorage.removeItem(KEY); state = defaultState(); }

  /* ---------- 实战演练作答 ---------- */
  function getPracticeAnswer(qid) { return state.practice[qid] || ''; }
  function savePracticeAnswer(qid, text) {
    if (text && text.trim()) state.practice[qid] = text.trim();
    else delete state.practice[qid];
    save();
  }
  function practiceAnswered(sceneId) {
    if (typeof PRACTICE_QUESTIONS === 'undefined' || !PRACTICE_QUESTIONS[sceneId]) return 0;
    return PRACTICE_QUESTIONS[sceneId].filter(q => state.practice[q.id]).length;
  }

  return {
    get state() { return state; },
    save, todayKey, TOTAL_TODAY,
    totalToday: () => TOTAL_TODAY,
    setLevel, getLevel, masteredCount, weakItems, dueTermIds, markShadowScore, getShadowScore,
    initCorpus, getCard, totalCards, sceneTotal, sceneLearned, sceneKnown,
    dialogueSubScenes, dialogueSubSceneProgress,
    exampleFor,
    buildTodayPack, todayDoneCount, markTaskDone, markQuiz,
    getDailyDialogue, markDialogueScore, dialogueDone, markDialogueDone,
    toggleFav, isFav, setNote, getNote,
    checkin, todayRecord, streak,
    addReflection, exportJSON, importJSON, clearAll,
    getPracticeAnswer, savePracticeAnswer, practiceAnswered
  };
})();

if (typeof window !== 'undefined') window.Store = Store;
