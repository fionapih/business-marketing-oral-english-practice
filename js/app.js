/**
 * 外企英语学习舱 — 应用主逻辑（第二阶段：真实语料接入）
 */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const App = {
    view: 'today',
    moduleId: 'm1',
    sceneId: null,
    mode: 'terms',
    sceneDialogueDay: null,
    calRef: new Date(),
    challenge: null
  };

  const MODULE_EMOJI = {
    meeting:'🗓️', chart:'📈', handshake:'🤝', compass:'🧭', star:'✨', pen:'✍️',
    rocket:'🚀', radar:'📡', shield:'🛡️', globe:'🌏', wallet:'💰', trophy:'🏆'
  };
  const MODE_EMOJI = { terms:'📚', patterns:'💬', dialogue:'🎧', practice:'🎯' };

  /* =======================================================
     发音（Web Speech API，真人录音缺失时的兜底）
     ======================================================= */
  // 通篇朗读（情景对话子场景）状态
  let scenarioPlayToken = 0;
  let scenarioPlayBtn = null;

  function speak(text, evt) {
    // 用户主动点单句发音 → 停止正在进行的通篇朗读
    if (scenarioPlayBtn) {
      scenarioPlayToken++;
      scenarioPlayBtn.classList.remove('playing');
      scenarioPlayBtn.textContent = '🔊 听通篇场景对话';
      scenarioPlayBtn = null;
      const s = $('#dlgPlayAllState'); if (s) s.textContent = '';
      $$('.dlg-turn-card').forEach(c => c.classList.remove('playing'));
    }
    if (!text || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = Store.state.settings.accent === 'uk' ? 'en-GB' : 'en-US';
      u.rate = 0.92; u.pitch = 1;
      speechSynthesis.speak(u);
      if (evt && evt.currentTarget) {
        const b = evt.currentTarget;
        b.classList.add('blink');
        setTimeout(() => b.classList.remove('blink'), 600);
      }
    } catch (e) { /* 静默 */ }
  }

  /* =======================================================
     进度
     ======================================================= */
  function sceneProgress(sceneId) {
    const total = Store.sceneTotal(sceneId) || 0;
    const learned = Store.sceneLearned(sceneId);
    return { learned, total, pct: total ? Math.round(learned / total * 100) : 0 };
  }
  function moduleProgress(mod) {
    let done = 0;
    mod.scenes.forEach(s => { if (sceneProgress(s.id).pct >= 100) done++; });
    return { done, total: mod.scenes.length, pct: Math.round(done / mod.scenes.length * 100) };
  }
  function overallScenesDone() {
    let n = 0;
    CURRICULUM.forEach(m => m.scenes.forEach(s => { if (sceneProgress(s.id).pct >= 100) n++; }));
    return n;
  }

  /* =======================================================
     卡片模板
     ======================================================= */
  function termPitfallHTML(cardId) {
    const pf = (typeof TERM_PITFALLS !== 'undefined' && TERM_PITFALLS[cardId]) || null;
    if (!pf) return '';
    const points = pf.points.map(p => `<div class="tp-row">· ${escapeHTML(p)}</div>`).join('');
    return `
      <div class="tp-card">
        <div class="tp-head">
          <span class="tp-warn">⚠️ 易错避坑提示</span>
          <span class="tp-title">${escapeHTML(pf.title)}</span>
        </div>
        ${points}
        <div class="tp-tip">💡 ${escapeHTML(pf.tip)}</div>
      </div>`;
  }

  function cardHTML(card, opts = {}) {
    const lv = Store.getLevel(card.id);
    const fav = Store.isFav(card.id);
    const roleLine = card.role ? `<span class="c-role">${escapeHTML(card.role)}</span>` : '';
    const note = Store.getNote(card.id)
      ? `<div class="c-note">📝 ${escapeHTML(Store.getNote(card.id))}</div>` : '';
    const pitfall = card.mode === 'terms' ? termPitfallHTML(card.id) : '';
    return `
      <div class="item-card ${lv ? 'lv-'+lv : ''}" data-card="${card.id}">
        <div class="c-top">
          <div class="c-en">${roleLine}${escapeHTML(card.en)}</div>
          <button class="c-act speak" data-act="speak" data-card="${card.id}" title="发音">🔊</button>
        </div>
        <div class="c-zh">${escapeHTML(card.zh || '')}</div>
        ${note}
        ${pitfall}
        <div class="c-actions">
          <button class="c-act fav ${fav ? 'on' : ''}" data-act="fav" data-card="${card.id}" title="收藏">${fav ? '⭐' : '☆'}</button>
          <button class="c-act note" data-act="note" data-card="${card.id}" title="笔记">📝</button>
          <span class="c-mastery">
            <button class="pill ${lv==='known'?'sel':''}" data-act="lv" data-lv="known" data-card="${card.id}">已学会</button>
            <button class="pill ${lv==='fuzzy'?'sel':''}" data-act="lv" data-lv="fuzzy" data-card="${card.id}">模糊</button>
            <button class="pill ${lv==='unknown'?'sel':''}" data-act="lv" data-lv="unknown" data-card="${card.id}">不知道</button>
          </span>
        </div>
      </div>`;
  }

  /* =======================================================
     影子跟读 + 评分（Web Speech API，含降级）
     ======================================================= */
  const escapeAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 逐词比对：识别文本与原句重叠比例 → 分数
  function scoreUtterance(target, heard) {
    const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
    const t = norm(target), h = norm(heard);
    if (!h.length) return { score: 0, missed: t };
    const hset = new Set(h);
    const matched = t.filter(w => hset.has(w));
    return { score: Math.round(matched.length / t.length * 100), missed: t.filter(w => !hset.has(w)) };
  }
  function scoreBadgeHTML(score) {
    const color = score >= 90 ? '#5fa97e' : score >= 70 ? '#caa24f' : '#cf8a8a';
    return `<div class="score-badge" style="background:${color}">${score} 分</div>`;
  }
  function showScore(el, score, missed, heard) {
    const miss = missed.length ? '漏读：' + missed.slice(0, 6).join(', ') : '完美跟读！';
    el.innerHTML = scoreBadgeHTML(score) + `<div class="score-detail">你说：<i>${escapeHTML(heard)}</i><br>${escapeHTML(miss)}</div>`;
  }
  function refreshDlgScored() {
    const dlg = Store.getDailyDialogue();
    if (!dlg) return;
    const scored = Object.keys(dlg.scores || {}).length;
    const el = $('#dlgScored'); if (el) el.textContent = scored;
    const ov = $('#dlgOverall');
    if (ov) ov.textContent = scored ? `本次跟读平均 ${Math.round(Object.values(dlg.scores).reduce((a, b) => a + b, 0) / scored)} 分` : '';
  }
  function finishTurn(turnEl, score) {
    const i = +turnEl.dataset.i;
    if (score != null) Store.markDialogueScore(i, score);
    turnEl.classList.add('scored');
    refreshDlgScored();
  }

  // 浏览器不支持语音识别 → 用 MediaRecorder 录音，回放对比（无自动分）
  async function shadowFallback(turnEl, en) {
    const scoreEl = $('.dlg-score', turnEl);
    const cardId = turnEl.dataset.card;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      scoreEl.innerHTML = '<span class="dlg-err">当前浏览器不支持自动评分与录音，请反复点🔊听原音跟读对比 🙏</span>';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks, { type: 'audio/webm' }));
        scoreEl.innerHTML = '<div class="score-badge muted">已录音</div>' +
          `<div class="score-detail">原音 <button class="mini" data-act="dlg-play" data-en="${escapeAttr(en)}">🔊 再听</button> · 我的 <audio controls src="${url}"></audio></div>` +
          '<div class="score-detail">对比原音，自评跟读质量吧～</div>';
        stream.getTracks().forEach(t => t.stop());
        if (cardId) Store.markShadowScore(cardId, -1);
        else finishTurn(turnEl, null);
      };
      speak(en);
      scoreEl.innerHTML = '<span class="dlg-listen">🔴 录音中（4 秒）…请跟读</span>';
      mr.start();
      setTimeout(() => { try { mr.stop(); } catch (e) {} }, 4200);
    } catch (e) {
      scoreEl.innerHTML = '<span class="dlg-err">麦克风不可用，请反复点🔊听原音跟读</span>';
    }
  }

  function doShadow(turnEl, en) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const scoreEl = $('.dlg-score', turnEl);
    const cardId = turnEl.dataset.card;
    const words = (en.match(/[A-Za-z']+/g) || []).length;
    const hold = Math.max(900, words * 330 + 500); // 原音播放时长估算
    if (!SR) { shadowFallback(turnEl, en); return; }
    speak(en);
    scoreEl.innerHTML = '<span class="dlg-listen">🎧 听原音中…稍后请跟读</span>';
    const recog = new SR();
    recog.lang = Store.state.settings.accent === 'uk' ? 'en-GB' : 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    let done = false;
    recog.onresult = ev => {
      done = true;
      const heard = ev.results[0][0].transcript;
      const { score, missed } = scoreUtterance(en, heard);
      showScore(scoreEl, score, missed, heard);
      if (cardId) {
        Store.markShadowScore(cardId, score);
        renderScene(); // 刷新评分徽章与进度
      } else {
        finishTurn(turnEl, score);
      }
    };
    recog.onerror = () => { done = true; scoreEl.innerHTML = '<span class="dlg-err">识别出错，可重试或点🎙️用录音对比</span>'; };
    recog.onend = () => { if (!done) scoreEl.innerHTML = '<span class="dlg-err">没捕捉到声音，再点一次🎙️跟读</span>'; };
    setTimeout(() => { try { recog.start(); scoreEl.innerHTML = '<span class="dlg-listen">🎙️ 请跟读这句话…</span>'; } catch (e) {} }, hold);
  }

  function onDlgFinish() {
    const dlg = Store.getDailyDialogue();
    if (!dlg) return;
    const total = dlg.turns.length;
    const scored = Object.keys(dlg.scores || {}).length;
    if (scored === 0) { toast('先点几句 🎙️ 跟读再完成吧～'); return; }
    Store.markDialogueDone();
    const avg = Math.round(Object.values(dlg.scores).reduce((a, b) => a + b, 0) / scored);
    toast(`今日对话完成！跟读 ${scored}/${total} 句，平均 ${avg} 分 💪`);
    afterTodayChange();
    renderDialogue();
  }

  function wireCard(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    // 对话区操作（无 data-card）
    if (act === 'dlg-play')   { speak(btn.dataset.en, e); return; }
    if (act === 'dlg-shadow') { doShadow(btn.closest('.dlg-turn') || btn.closest('.dlg-turn-card'), btn.dataset.en); return; }
    if (act === 'dlg-play-all') { toggleScenarioPlay(btn); return; }
    if (act === 'dlg-finish') { onDlgFinish(); return; }

    // 实战演练动作
    if (act === 'practice-sample')    { togglePracticeSample(btn.dataset.qid); return; }
    if (act === 'practice-sample-play'){ speak(btn.dataset.en, e); return; }
    if (act === 'practice-hint')      { togglePracticeHint(btn); return; }
    if (act === 'practice-mic')       { practiceMic(btn.dataset.qid); return; }
    if (act === 'practice-check')     { practiceCheck(btn.dataset.qid); return; }

    const id = btn.dataset.card;
    if (!id) return;
    const card = Store.getCard(id);
    if (act === 'speak') { speak(card.en, e); return; }
    if (act === 'fav') {
      const added = Store.toggleFav(card);
      btn.classList.toggle('on', added);
      btn.textContent = added ? '⭐' : '☆';
      toast(added ? '已收藏 ⭐' : '已取消收藏');
      return;
    }
    if (act === 'note') {
      const cur = Store.getNote(id);
      const v = prompt('给这条加个笔记（留空则删除）：', cur || '');
      if (v === null) return;
      Store.setNote(id, v.trim());
      toast(v.trim() ? '笔记已保存' : '笔记已清除');
      renderCardNote(btn, id);
      return;
    }
    if (act === 'lv') {
      const lv = btn.dataset.lv;
      if (App.view === 'today') {
        Store.markTaskDone(id, lv);
        markCardDone(btn, lv);
        afterTodayChange();
      } else {
        Store.setLevel(id, lv);
        markCardDone(btn, lv);
        renderNav();
        renderModuleProgressIfNeeded();
      }
      return;
    }
  }
  function markCardDone(btn, lv) {
    const card = btn.closest('.item-card');
    if (!card) return;
    card.classList.remove('lv-known','lv-fuzzy','lv-unknown');
    card.classList.add('lv-' + lv);
    $$('.pill', card).forEach(p => p.classList.toggle('sel', p.dataset.lv === lv));
  }
  function renderCardNote(btn, id) {
    const card = btn.closest('.item-card');
    const old = $('.c-note', card);
    const txt = Store.getNote(id);
    if (old) old.remove();
    if (txt) card.insertAdjacentHTML('beforeend', `<div class="c-note">📝 ${escapeHTML(txt)}</div>`);
  }
  function renderModuleProgressIfNeeded() {
    if (App.view === 'module') renderModule();
  }

  /* =======================================================
     左侧导航
     ======================================================= */
  function renderNav() {
    const wrap = $('#navModules');
    wrap.innerHTML = CURRICULUM.map(m => {
      const p = moduleProgress(m);
      return `
        <button class="mod-item tone-${m.tone} ${m.id === App.moduleId && (App.view === 'module' || App.view === 'scene') ? 'is-active' : ''}" data-mod="${m.id}">
          <div class="mod-top">
            <span class="mod-badge">${m.month}月</span>
            <span class="mod-name">${m.title}</span>
            <span class="mod-count">${p.done}/${p.total}</span>
          </div>
          <div class="mod-bar"><i style="width:${p.pct}%"></i></div>
        </button>`;
    }).join('');
    $$('.mod-item', wrap).forEach(el => el.addEventListener('click', () => {
      App.moduleId = el.dataset.mod; go('module'); closeSidebar();
    }));
    $('#navSceneTotal').textContent = `${overallScenesDone()}/${TOTAL_SCENES}`;
  }

  /* =======================================================
     今日任务
     ======================================================= */
  function renderToday() {
    const pack = Store.buildTodayPack();
    const total = Store.totalToday();
    const done = Store.todayDoneCount();

    $('#statDone').textContent     = `${done}/${total}`;
    $('#statMastered').textContent = Store.masteredCount();
    $('#statQuiz').textContent     = Store.todayRecord().quiz || 0;
    $('#statStreak').textContent   = Store.streak();
    $('#streakDays').textContent   = Store.streak();
    $('#quickTodayBadge').textContent = `${done}/${total}`;

    const sceneDone = overallScenesDone();
    const pct = Math.round(sceneDone / TOTAL_SCENES * 100);
    $('#progSceneText').textContent = `${sceneDone} / ${TOTAL_SCENES}`;
    $('#progItemText').textContent  = `${Object.keys(Store.state.mastery).length} 条`;
    $('#progPct').textContent       = pct;
    $('#progBar').style.width       = pct + '%';

    $('#monthDots').innerHTML = CURRICULUM.map(m => {
      const p = moduleProgress(m);
      return `<div class="mdot ${p.pct >= 100 ? 'on' : ''}" data-mod="${m.id}" title="${m.month}月 · ${m.title}（${p.done}/${p.total}）">${m.month}</div>`;
    }).join('');
    $$('#monthDots .mdot').forEach(d => d.addEventListener('click', () => { App.moduleId = d.dataset.mod; go('module'); }));

    $('#wordCount').textContent = pack.wordIds.length;
    renderWords();
    renderDialogue();

    const unlocked = done >= total;
    const ce = $('#btnChallenge');
    ce.disabled = !unlocked;
    ce.textContent = unlocked ? '开始挑战' : '完成今日任务后解锁';
  }

  /* 今日单词（15 个，含真实例句） */
  function renderWords() {
    const pack = Store.buildTodayPack();
    const list = $('#wordList');
    if (!pack.wordIds.length) {
      list.innerHTML = `<div class="empty-hint dashed"><div class="empty-emoji">🫧</div><h4>暂无单词</h4><p>换个模块学点新场景吧～</p></div>`;
      return;
    }
    list.innerHTML = pack.wordIds.map(id => wordCardHTML(Store.getCard(id))).join('');
  }

  function wordCardHTML(card) {
    const lv = Store.getLevel(card.id);
    const fav = Store.isFav(card.id);
    const ex = Store.exampleFor(card.id);
    const exHTML = ex
      ? `<div class="w-ex"><div class="w-ex-en">“${escapeHTML(ex.en)}”</div><div class="w-ex-zh">${escapeHTML(ex.zh || '')}</div></div>`
      : '<div class="w-ex w-ex-none">（暂无匹配例句，可到对应场景学例句）</div>';
    const note = Store.getNote(card.id)
      ? `<div class="c-note">📝 ${escapeHTML(Store.getNote(card.id))}</div>` : '';
    return `
      <div class="item-card word-card ${lv ? 'lv-' + lv : ''}" data-card="${card.id}">
        <div class="c-top">
          <div class="w-word">${escapeHTML(card.en)}</div>
          <button class="c-act speak" data-act="speak" data-card="${card.id}" title="发音">🔊</button>
        </div>
        <div class="w-def">${escapeHTML(card.zh || '')}</div>
        ${exHTML}
        ${note}
        <div class="c-actions">
          <button class="c-act fav ${fav ? 'on' : ''}" data-act="fav" data-card="${card.id}" title="收藏">${fav ? '⭐' : '☆'}</button>
          <button class="c-act note" data-act="note" data-card="${card.id}" title="笔记">📝</button>
          <span class="c-mastery">
            <button class="pill ${lv === 'known' ? 'sel' : ''}" data-act="lv" data-lv="known" data-card="${card.id}">已学会</button>
            <button class="pill ${lv === 'fuzzy' ? 'sel' : ''}" data-act="lv" data-lv="fuzzy" data-card="${card.id}">模糊</button>
            <button class="pill ${lv === 'unknown' ? 'sel' : ''}" data-act="lv" data-lv="unknown" data-card="${card.id}">不知道</button>
          </span>
        </div>
      </div>`;
  }

  /* 今日场景对话（影子跟读 + 评分） */
  function renderDialogue() {
    const dlg = Store.getDailyDialogue();
    const panel = $('#dialoguePanel');
    if (!dlg) { panel.innerHTML = '<div class="empty-hint slim">今日对话稍后生成</div>'; return; }
    const scene = CURRICULUM.flatMap(m => m.scenes).find(s => s.id === dlg.sceneId);
    const total = dlg.turns.length;
    const scored = Object.keys(dlg.scores || {}).length;
    const avg = scored ? Math.round(Object.values(dlg.scores).reduce((a, b) => a + b, 0) / scored) : 0;
    panel.innerHTML = `
      <div class="dlg-head">
        <div class="dlg-h-l">🎧 ${scene ? scene.title : '场景对话'}</div>
        <div class="dlg-h-r"><span id="dlgScored">${scored}</span>/${total} 句已跟读</div>
      </div>
      <div class="dlg-tip">💡 点每句 🎙️ 跟读：先听原音，再大声复述，系统自动打分。不支持评分的浏览器会自动转录音对比。</div>
      <div class="dlg-turns">
        ${dlg.turns.map((t, i) => `
          <div class="dlg-turn ${dlg.scores && dlg.scores[i] != null ? 'scored' : ''}" data-i="${i}">
            <div class="dlg-role">${escapeHTML(t.role || 'A')}</div>
            <div class="dlg-body">
              <div class="dlg-en">${escapeHTML(t.en)}</div>
              <div class="dlg-zh">${escapeHTML(t.zh || '')}</div>
              <div class="dlg-ctrls">
                <button class="c-act speak" data-act="dlg-play" data-en="${escapeAttr(t.en)}" title="听">🔊</button>
                <button class="c-act" data-act="dlg-shadow" data-en="${escapeAttr(t.en)}" title="跟读">🎙️</button>
              </div>
              <div class="dlg-score">${dlg.scores && dlg.scores[i] != null ? scoreBadgeHTML(dlg.scores[i]) + '<div class="score-detail">已完成跟读</div>' : ''}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="dlg-foot">
        <button class="btn-primary" data-act="dlg-finish" ${Store.dialogueDone() ? 'disabled' : ''}>${Store.dialogueDone() ? '今日对话已完成 ✓' : '完成今日对话'}</button>
        <span class="dlg-overall" id="dlgOverall">${scored ? `本次跟读平均 ${avg} 分` : ''}</span>
      </div>`;
  }

  function afterTodayChange() {
    const total = Store.totalToday();
    const done = Store.todayDoneCount();
    $('#statDone').textContent = `${done}/${total}`;
    $('#quickTodayBadge').textContent = `${done}/${total}`;
    $('#statMastered').textContent = Store.masteredCount();
    $('#progItemText').textContent = `${Object.keys(Store.state.mastery).length} 条`;
    const ce = $('#btnChallenge');
    if (done >= total) {
      ce.disabled = false; ce.textContent = '开始挑战';
      if (!Store.todayRecord().completed) { Store.checkin({ completed: true }); celebrate(); }
    } else {
      ce.disabled = true; ce.textContent = '完成今日任务后解锁';
    }
  }

  /* =======================================================
     模块详情（4 场景卡）
     ======================================================= */
  function renderModule() {
    const mod = CURRICULUM.find(m => m.id === App.moduleId);
    if (!mod) return;
    const p = moduleProgress(mod);

    $('#moduleHero').innerHTML = `
      <div class="mh-badge" style="background:${toneColor(mod.tone)}">
        <div><b>${mod.month}</b><span>MONTH</span></div>
      </div>
      <div class="mh-text">
        <h3>${MODULE_EMOJI[mod.icon] || '📘'} 第${mod.month}月 · ${mod.title}</h3>
        <p>${mod.subtitle}</p>
      </div>
      <div class="mh-meta"><b>${p.done}/${p.total}</b><span>场景已通关</span></div>`;

    $('#sceneGrid').innerHTML = mod.scenes.map((s, i) => {
      const sp = sceneProgress(s.id);
      const total = Store.sceneTotal(s.id);
      const known = Store.sceneKnown(s.id);
      return `
        <button class="scene-card" data-scene="${s.id}">
          <div class="sc-head">
            <span class="sc-idx">${i + 1}</span>
            <div>
              <div class="sc-title">${s.title}</div>
              <div class="sc-en">${s.en}</div>
            </div>
          </div>
          <p class="sc-desc">${s.desc}</p>
          <div class="sc-stats">
            <span>📚 ${total} 条</span>
            <span>✅ 已掌握 ${known}</span>
            <span>🎧 真人录音</span>
          </div>
          <div class="sc-foot">
            <div class="bar"><i style="width:${sp.pct}%"></i></div>
            <span class="sc-prog">${sp.total ? `${sp.learned}/${sp.total}` : '待解锁'}</span>
          </div>
        </button>`;
    }).join('');

    $$('#sceneGrid .scene-card').forEach(el =>
      el.addEventListener('click', () => { App.sceneId = el.dataset.scene; App.mode = 'terms'; App.sceneDialogueDay = null; go('scene'); })
    );

    $('#pitfallList').innerHTML = PITFALLS.map(p => `
      <div class="pf-card">
        <div class="pf-pair">${p.pair}</div>
        <div class="pf-row">· ${p.a}</div>
        <div class="pf-row">· ${p.b}</div>
        <div class="pf-tip">💡 ${p.tip}</div>
      </div>`).join('');

    const pq = modulePracticeQuestions(mod);
    const answered = pq.filter(q => Store.getPracticeAnswer(q.id)).length;
    $('#peCount').textContent = pq.length
      ? `${pq.length} 道情景问答 · 已作答 ${answered}/${pq.length} · 答完有范例对照与语法批改`
      : '该模块实战演练即将上线，先练其他月份吧～';
  }

  function toneColor(t) {
    return { blue:'#7FB3C4', teal:'#79B9AE', peach:'#E5A98F', mint:'#93C2A4', lilac:'#AFA8D2', cream:'#E3BE79' }[t] || '#7FB3C4';
  }

  /* =======================================================
     场景学习页（4 模式）
     ======================================================= */
  function renderScene() {
    const mod = CURRICULUM.find(m => m.id === App.moduleId);
    const sc  = mod?.scenes.find(s => s.id === App.sceneId);
    if (!sc) return;

    $('#sceneHero').innerHTML = `
      <h3>${sc.title}</h3>
      <div class="sh-en">${sc.en}</div>
      <p>${sc.desc}</p>
      <div class="sh-stats">📚 ${Store.sceneTotal(sc.id)} 条语料 · ✅ 已掌握 ${Store.sceneKnown(sc.id)}</div>`;

    $('#modeSwitch').innerHTML = STUDY_MODES.map(m => {
      const cnt = m.id === 'practice'
        ? ((typeof PRACTICE_QUESTIONS !== 'undefined' && PRACTICE_QUESTIONS[sc.id]) || []).length
        : (Store.getCard ? (window.CORPUS.filter(c => c.s === sc.id && c.mode === m.id).length) : 0);
      return `
      <button class="mode-btn ${m.id === App.mode ? 'is-active' : ''}" data-mode="${m.id}">
        <div class="mode-emoji">${MODE_EMOJI[m.id]}</div>
        <div class="mode-label">${m.label}</div>
        <div class="mode-count">${cnt}</div>
        <div class="mode-desc">${m.desc}</div>
      </button>`;
    }).join('');

    $$('#modeSwitch .mode-btn').forEach(el =>
      el.addEventListener('click', () => { App.mode = el.dataset.mode; if (App.mode !== 'dialogue') App.sceneDialogueDay = null; renderScene(); })
    );

    const body = $('#modeBody');

    if (App.mode === 'practice') {
      renderScenePractice(sc, body);
      return;
    }

    const cards = window.CORPUS.filter(c => c.s === sc.id && c.mode === App.mode);
    const m = STUDY_MODES.find(x => x.id === App.mode);
    if (!cards.length) {
      body.innerHTML = `<div class="empty-hint dashed"><div class="empty-emoji">${MODE_EMOJI[App.mode]}</div><h4>「${m.label}」暂无内容</h4></div>`;
      return;
    }

    if (App.mode === 'dialogue') {
      if (App.sceneDialogueDay == null) {
        renderDialogueScenesMap(sc, body);
      } else {
        renderDialogueSceneDetail(sc, body);
      }
      return;
    }

    body.innerHTML = `<div class="mode-intro">${MODE_EMOJI[App.mode]} 共 ${cards.length} 条 · 点 🔊 听发音，学完标记熟练度</div>` +
      cards.map(c => cardHTML(c)).join('');
  }

  /* 场景级实战演练 */
  function renderScenePractice(sc, body) {
    const qs = (typeof PRACTICE_QUESTIONS !== 'undefined' && PRACTICE_QUESTIONS[sc.id]) || [];
    const answered = qs.filter(q => Store.getPracticeAnswer(q.id)).length;
    if (!qs.length) {
      body.innerHTML = `<div class="empty-hint dashed"><div class="empty-emoji">🎯</div><h4>「实战演练」暂无内容</h4><p>该场景配套练习即将上线～</p></div>`;
      return;
    }
    body.innerHTML = `
      <div class="mode-intro">🎯 本场景共 ${qs.length} 道情景问答 · 已作答 ${answered}/${qs.length} · 先开口作答 → 看范例对照 → 点「批改语法」</div>
      <div class="practice-list">${qs.map((q, i) => practiceQuestionHTML(q, i, !!Store.getPracticeAnswer(q.id))).join('')}</div>`;
  }

  /* 场景对话 — 7 个子场景地图 */
  function renderDialogueScenesMap(sc, body) {
    const scenes = Store.dialogueSubScenes(sc.id);
    const totalTurns = scenes.reduce((n, d) => n + d.count, 0);
    const doneScenes = scenes.filter(s => Store.dialogueSubSceneProgress(sc.id, s.idx).pct >= 100).length;
    body.innerHTML = `
      <div class="mode-intro">💬 已把 ${totalTurns} 句对话拆成 ${scenes.length} 个子场景 · 完成 ${doneScenes}/${scenes.length} 个</div>
      <div class="dlg-days-grid">
        ${scenes.map(s => {
          const p = Store.dialogueSubSceneProgress(sc.id, s.idx);
          return `
          <button class="dlg-day-card ${p.pct >= 100 ? 'done' : ''}" data-dlg-day="${s.idx}">
            <div class="dd-top">
              <span class="dd-num">${s.idx}. ${escapeHTML(s.title)}</span>
              <span class="dd-pill">${p.known}/${p.total}</span>
            </div>
            <div class="dd-bar"><i style="width:${p.pct}%"></i></div>
            <div class="dd-preview">${escapeHTML(s.sub)}</div>
            <div class="dd-foot">${p.pct >= 100 ? '✅ 已完成' : `共 ${s.count} 句 · 点我开始 →`}</div>
          </button>`;
        }).join('')}
      </div>`;
    $$('.dlg-day-card', body).forEach(el => el.addEventListener('click', () => {
      App.sceneDialogueDay = +el.dataset.dlgDay;
      renderScene();
    }));
  }

  /* 场景对话 — 单个子场景详情（影子跟读 + 熟练度） */
  function renderDialogueSceneDetail(sc, body) {
    const scenes = Store.dialogueSubScenes(sc.id);
    const scn = scenes.find(s => s.idx === App.sceneDialogueDay);
    if (!scn) { App.sceneDialogueDay = null; renderScene(); return; }
    const p = Store.dialogueSubSceneProgress(sc.id, scn.idx);
    const scoredN = scn.cardIds.filter(id => Store.state.mastery[id]?.shadowScore != null).length;
    body.innerHTML = `
      <button class="back-link" id="btnBackDays">
        <svg viewBox="0 0 24 24"><path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        返回 ${scenes.length} 个子场景
      </button>
      <div class="dlg-day-head">
        <div>
          <h4>${sc.title} · ${scn.idx}. ${escapeHTML(scn.title)}</h4>
          <p>共 ${scn.count} 句 · 已跟读 ${scoredN}/${scn.count} · 已掌握 ${p.known}/${p.total}</p>
        </div>
        <div class="dlg-day-pct"><b>${p.pct}</b><small>%</small></div>
      </div>
      <div class="dlg-playall-bar">
        <button class="btn-play-all" data-act="dlg-play-all">🔊 听通篇场景对话</button>
        <span id="dlgPlayAllState" class="dlg-playall-state">先整体听一遍，再逐句 🎙️ 跟读打分</span>
      </div>
      <div class="dlg-day-turns">
        ${scn.turns.map((t, i) => dialogueTurnCard(t, i, scn)).join('')}
      </div>`;
    $('#btnBackDays').onclick = () => { App.sceneDialogueDay = null; renderScene(); };
  }

  function dialogueTurnCard(t, i, day) {
    const card = t.cardId ? Store.getCard(t.cardId) : null;
    const lv = card ? Store.getLevel(card.id) : null;
    const fav = card ? Store.isFav(card.id) : false;
    const scored = !!card && Store.state.mastery[card.id]?.shadowScore != null;
    const score = scored ? Store.state.mastery[card.id].shadowScore : null;
    return `
      <div class="item-card dlg-turn-card ${lv ? 'lv-' + lv : ''}" data-card="${card ? card.id : ''}">
        <div class="dlg-role">${escapeHTML(t.role || 'A')}</div>
        <div class="dlg-en">${escapeHTML(t.en)}</div>
        <div class="dlg-zh">${escapeHTML(t.zh || '')}</div>
        <div class="dlg-ctrls">
          <button class="c-act speak" data-act="speak" data-card="${card ? card.id : ''}" title="发音">🔊</button>
          <button class="c-act" data-act="dlg-shadow" data-en="${escapeAttr(t.en)}" data-i="${i}" title="跟读">🎙️</button>
          <button class="c-act fav ${fav ? 'on' : ''}" data-act="fav" data-card="${card ? card.id : ''}" title="收藏">${fav ? '⭐' : '☆'}</button>
          <button class="c-act note" data-act="note" data-card="${card ? card.id : ''}" title="笔记">📝</button>
        </div>
        <div class="dlg-score">${scored ? scoreBadgeHTML(score) + '<div class="score-detail">已完成跟读</div>' : ''}</div>
        <div class="c-actions" style="margin-top:10px;">
          <span class="c-mastery">
            <button class="pill ${lv==='known'?'sel':''}" data-act="lv" data-lv="known" data-card="${card ? card.id : ''}">已学会</button>
            <button class="pill ${lv==='fuzzy'?'sel':''}" data-act="lv" data-lv="fuzzy" data-card="${card ? card.id : ''}">模糊</button>
            <button class="pill ${lv==='unknown'?'sel':''}" data-act="lv" data-lv="unknown" data-card="${card ? card.id : ''}">不知道</button>
          </span>
        </div>
      </div>`;
  }

  /* 通篇朗读某个子场景的全部对话：顺序播放，可中途停止 */
  function toggleScenarioPlay(btn) {
    if (!('speechSynthesis' in window)) { toast('当前浏览器不支持语音朗读'); return; }
    // 正在播放 → 停止
    if (btn.classList.contains('playing')) {
      scenarioPlayToken++;
      speechSynthesis.cancel();
      btn.classList.remove('playing');
      btn.textContent = '🔊 听通篇场景对话';
      scenarioPlayBtn = null;
      const s = $('#dlgPlayAllState'); if (s) s.textContent = '';
      $$('.dlg-turn-card').forEach(c => c.classList.remove('playing'));
      return;
    }
    const scn = Store.dialogueSubScenes(App.sceneId).find(s => s.idx === App.sceneDialogueDay);
    if (!scn) return;
    const myToken = ++scenarioPlayToken;
    scenarioPlayBtn = btn;
    btn.classList.add('playing');
    btn.textContent = '⏹ 停止朗读';
    const turns = scn.turns;
    const cards = $$('.dlg-turn-card');
    let idx = 0;
    function playNext() {
      if (myToken !== scenarioPlayToken) return;            // 已停止 / 被单句发音打断
      if (idx >= turns.length) {
        btn.classList.remove('playing');
        btn.textContent = '🔊 听通篇场景对话';
        scenarioPlayBtn = null;
        const sf = $('#dlgPlayAllState'); if (sf) sf.textContent = '✅ 通篇朗读完成';
        cards.forEach(c => c.classList.remove('playing'));
        return;
      }
      const st = $('#dlgPlayAllState'); if (st) st.textContent = `🔊 正在朗读 ${idx + 1}/${turns.length}…`;
      cards.forEach((c, i) => c.classList.toggle('playing', i === idx));
      const u = new SpeechSynthesisUtterance(turns[idx].en);
      u.lang = Store.state.settings.accent === 'uk' ? 'en-GB' : 'en-US';
      u.rate = 0.92; u.pitch = 1;
      u.onend = () => { cards.forEach(c => c.classList.remove('playing')); idx++; setTimeout(playNext, 350); };
      u.onerror = () => { btn.classList.remove('playing'); btn.textContent = '🔊 听通篇场景对话'; scenarioPlayBtn = null; };
      speechSynthesis.speak(u);
    }
    playNext();
  }

  /* =======================================================
     实战演练（场景级 + 模块级汇总）
     ======================================================= */
  function sceneTitle(sid) {
    for (const m of CURRICULUM) {
      const sc = m.scenes.find(s => s.id === sid);
      if (sc) return sc.title;
    }
    return sid;
  }
  function practiceSceneId(qid) {
    // id 格式：m1s1-p1，前缀即场景 id
    return qid.split('-')[0];
  }
  function findPractice(qid) {
    const sid = practiceSceneId(qid);
    const arr = (typeof PRACTICE_QUESTIONS !== 'undefined' && PRACTICE_QUESTIONS[sid]) || [];
    return arr.find(x => x.id === qid) || null;
  }

  function modulePracticeQuestions(mod) {
    return mod.scenes.flatMap(s => (typeof PRACTICE_QUESTIONS !== 'undefined' && PRACTICE_QUESTIONS[s.id]) || []);
  }

  function renderPractice() {
    const mod = CURRICULUM.find(m => m.id === App.moduleId);
    const qs = modulePracticeQuestions(mod);
    $('#practiceHead').innerHTML = `<h3>🎯 ${mod.title} · 实战演练</h3>
      <p>共 ${qs.length} 道情景问答，覆盖 ${mod.scenes.length} 个场景。先开口作答 → 看范例对照 → 点「批改语法」。</p>`;
    if (!qs.length) {
      $('#practiceList').innerHTML = `<div class="empty-hint dashed"><div class="empty-emoji">🎯</div>
        <h4>该模块实战演练即将上线</h4><p>先练「1 月基础办公与会议协作」吧～</p></div>`;
      return;
    }
    $('#practiceList').innerHTML = qs.map((q, i) =>
      practiceQuestionHTML(q, i, !!Store.getPracticeAnswer(q.id), sceneTitle(practiceSceneId(q.id)))).join('');
  }

  function practiceQuestionHTML(q, idx, answered, sceneLabel = '') {
    const saved = Store.getPracticeAnswer(q.id);
    const tag = sceneLabel ? `${escapeHTML(sceneLabel)} · ` : '';
    return `
      <div class="practice-q" data-qid="${q.id}">
        <div class="pq-head">
          <span class="pq-num">${idx + 1}</span>
          <div class="pq-htext">
            <div class="pq-prompt">${escapeHTML(q.prompt)}</div>
            <div class="pq-tag">${tag}${answered ? '✅ 已作答' : '待作答'}</div>
          </div>
        </div>
        <div class="pq-context">📍 ${escapeHTML(q.context)}</div>
        <div class="pq-hint" id="hint-${q.id}" hidden>💡 ${escapeHTML(q.hint)}</div>
        <div class="pq-sample" id="sample-${q.id}" hidden>
          <div class="pq-sample-en">
            <button class="c-act speak" data-act="practice-sample-play" data-en="${escapeAttr(q.sampleEn)}" title="朗读">🔊</button>
            <span>${escapeHTML(q.sampleEn)}</span>
          </div>
          <div class="pq-sample-zh">${escapeHTML(q.sampleZh)}</div>
        </div>
        <textarea class="pq-textarea" id="ta-${q.id}" rows="3" placeholder="在这里用英文作答…">${escapeHTML(saved)}</textarea>
        <div class="pq-actions">
          <button class="btn-line sm" data-act="practice-hint" data-qid="${q.id}">💡 看提示</button>
          <button class="btn-line sm" data-act="practice-sample" data-qid="${q.id}">📖 看范例</button>
          <button class="btn-line sm" data-act="practice-mic" data-qid="${q.id}">🎙️ 语音输入</button>
          <button class="btn-primary sm" data-act="practice-check" data-qid="${q.id}">✅ 批改语法</button>
        </div>
        <div class="pq-feedback" id="fb-${q.id}"></div>
      </div>`;
  }

  function togglePracticeHint(btn) {
    const el = $('#hint-' + btn.dataset.qid);
    el.hidden = !el.hidden;
    btn.textContent = el.hidden ? '💡 看提示' : '🙈 收起提示';
  }
  function togglePracticeSample(qid) {
    const el = $('#sample-' + qid);
    el.hidden = !el.hidden;
    if (!el.hidden) {
      const q = findPractice(qid);
      if (q) speak(q.sampleEn);
    }
  }
  function practiceMic(qid) {
    const ta = $('#ta-' + qid);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast('当前浏览器不支持语音输入，直接打字即可'); return; }
    const rec = new SR();
    rec.lang = Store.state.settings.accent === 'uk' ? 'en-GB' : 'en-US';
    rec.interimResults = false; rec.maxAlternatives = 1;
    toast('🎙️ 请开始说…');
    rec.onresult = ev => {
      const t = ev.results[0][0].transcript;
      ta.value = (ta.value ? ta.value + ' ' : '') + t;
      ta.focus();
    };
    rec.onerror = () => toast('没听清，再点一次 🎙️');
    try { rec.start(); } catch (e) {}
  }

  async function practiceCheck(qid) {
    const ta = $('#ta-' + qid);
    const text = ta.value.trim();
    const fb = $('#fb-' + qid);
    if (!text) { fb.innerHTML = `<div class="pf-note">先写一句再批改哦～</div>`; return; }
    Store.savePracticeAnswer(qid, text);
    const q = findPractice(qid);
    const res = Grammar.check(text);
    let ai = null;
    if (window.EC_AI && window.EC_AI.apiKey) {
      try { ai = await Grammar.aiCorrect(text, q.sampleEn); } catch (e) { ai = null; }
    }
    renderFeedback(fb, res, ai, q);
    toast(res.score >= 90 ? '很棒，基本没问题！👍' : '已批改，看下方提示～');
  }

  function renderFeedback(fb, res, ai, q) {
    const sevLabel = s => ({ grammar: '语法', spelling: '拼写', style: '表达', info: '提示' }[s] || '提示');
    const issuesHTML = res.issues.length
      ? res.issues.map(it => `<div class="pf-issue ${it.sev}"><span class="pf-tag">${sevLabel(it.sev)}</span>${escapeHTML(it.msg)}</div>`).join('')
      : `<div class="pf-ok">✅ 没发现明显语法错误，继续保持！</div>`;
    const corrected = (ai && ai.corrected) ? ai.corrected : res.corrected;
    const correctedLabel = (ai && ai.corrected) ? 'AI 润色版' : '机器初步润色（仅供参考）';
    const comment = ai && ai.comment ? `<div class="pf-note">💬 ${escapeHTML(ai.comment)}</div>` : '';
    fb.innerHTML = `
      <div class="pf-score"><b>${res.score}</b><small>分</small>
        <span class="pf-score-note">${res.score >= 90 ? '表达流畅' : res.score >= 70 ? '有小问题，改完更地道' : '需要重点修正'}</span></div>
      <div class="pf-block">
        <div class="pf-block-title">🔍 批改意见</div>
        ${issuesHTML}
      </div>
      ${corrected ? `<div class="pf-block"><div class="pf-block-title">✏️ ${correctedLabel}</div>
        <div class="pf-corrected">${escapeHTML(corrected)}</div></div>` : ''}
      <div class="pf-block">
        <div class="pf-block-title">📖 对照范例</div>
        <div class="pf-sample-en"><button class="c-act speak" data-act="practice-sample-play" data-en="${escapeAttr(q.sampleEn)}">🔊</button> ${escapeHTML(q.sampleEn)}</div>
        <div class="pf-sample-zh">${escapeHTML(q.sampleZh)}</div>
      </div>
      ${comment}
      <div class="pf-note">${escapeHTML(res.note || Grammar.NOTE)}</div>`;
  }

  /* =======================================================
     成长复盘
     ======================================================= */
  function renderReview() { renderCalendar(); renderReflections(); renderFavs(); renderWeak(); }

  function renderCalendar() {
    const ref = App.calRef;
    const y = ref.getFullYear(), mo = ref.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days  = new Date(y, mo + 1, 0).getDate();
    const tKey  = Store.todayKey();
    const wd = ['日','一','二','三','四','五','六'];

    let cells = wd.map(d => `<div class="cal-wd">${d}</div>`).join('');
    for (let i = 0; i < first; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let d = 1; d <= days; d++) {
      const key = `${y}-${String(mo + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const rc = Store.state.checkins[key];
      cells += `<div class="cal-cell ${rc?.completed ? 'checked' : ''} ${key === tKey ? 'today' : ''}"
                     data-date="${key}" title="${rc ? `完成 ${rc.done||0} 条` : '未打卡'}">${d}</div>`;
    }

    $('#calendar').innerHTML = `
      <div class="cal-head">
        <button class="icon-btn" id="calPrev"><svg viewBox="0 0 24 24"><path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="cal-title">${y} 年 ${mo + 1} 月</div>
        <button class="icon-btn" id="calNext"><svg viewBox="0 0 24 24"><path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="cal-grid">${cells}</div>`;

    $('#calPrev').onclick = () => { App.calRef = new Date(y, mo - 1, 1); renderCalendar(); };
    $('#calNext').onclick = () => { App.calRef = new Date(y, mo + 1, 1); renderCalendar(); };
    $$('#calendar .cal-cell[data-date]').forEach(c => c.addEventListener('click', () => {
      const rc = Store.state.checkins[c.dataset.date];
      toast(rc ? `${c.dataset.date}：完成 ${rc.done || 0} 条，自测 ${rc.quiz || 0} 次` : `${c.dataset.date}：这天还没打卡`);
    }));
  }

  function renderReflections() {
    const list = Store.state.reflections.slice(0, 12);
    $('#reflectHistory').innerHTML = list.length
      ? list.map(r => `<div class="rh-item"><div class="rh-date">${r.date}</div>${escapeHTML(r.text)}</div>`).join('')
      : '';
  }

  function renderFavs(kw = '') {
    const arr = Store.state.favorites.filter(f =>
      !kw || (f.en + f.zh).toLowerCase().includes(kw.toLowerCase()));
    $('#favList').innerHTML = arr.length
      ? arr.map(f => `<div class="item-card" style="margin-bottom:9px">
            <div class="c-top"><div class="c-en">${escapeHTML(f.en)}</div></div>
            <div class="c-zh">${escapeHTML(f.zh || '')}</div>
          </div>`).join('')
      : `<div class="empty-hint slim">${kw ? '没有匹配的收藏' : '还没有收藏，学习时点 ⭐ 就能收进来'}</div>`;
  }

  function renderWeak() {
    const w = Store.weakItems().slice(0, 24);
    $('#weakList').innerHTML = w.length
      ? w.map(i => {
          const c = Store.getCard(i.id);
          const color = i.lv === 'unknown' ? '#C97A7A' : '#BE9744';
          return `<div class="rh-item"><span class="lv-tag" style="background:${color}">${i.lv === 'unknown' ? '不知道' : '模糊'}</span> ${c ? escapeHTML(c.en) : i.id}</div>`;
        }).join('')
      : `<div class="empty-hint slim">暂无标记为「模糊 / 不知道」的内容</div>`;
  }

  /* =======================================================
     抽查挑战
     ======================================================= */
  function startChallenge() {
    if (Store.todayDoneCount() < Store.totalToday()) { toast('先完成今日任务再来挑战吧～'); return; }
    const pool = window.CORPUS.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i+1))|0; [pool[i],pool[j]]=[pool[j],pool[i]]; }
    const items = pool.slice(0, 10);
    App.challenge = { items, idx: 0, reveal: false, rated: {} };
    renderChallenge();
    $('#challengeModal').classList.add('open');
  }
  function renderChallenge() {
    const ch = App.challenge; if (!ch) return;
    const it = ch.items[ch.idx];
    const rated = ch.rated[it.id];
    $('#challengeBody').innerHTML = `
      <div class="ch-progress">第 ${ch.idx+1} / ${ch.items.length} 题</div>
      <div class="ch-card">
        <div class="ch-en">${escapeHTML(it.en)}</div>
        ${ch.reveal ? `<div class="ch-zh">${escapeHTML(it.zh || '')}</div>` : '<div class="ch-zh dim">点「看答案」对照中文</div>'}
      </div>
      <div class="ch-actions">
        <button class="btn-line" id="chReveal">${ch.reveal ? '隐藏' : '看答案'}</button>
        <button class="pill ${rated==='known'?'sel':''}" data-r="known">✅ 会</button>
        <button class="pill ${rated==='fuzzy'?'sel':''}" data-r="fuzzy">🤔 模糊</button>
        <button class="pill ${rated==='unknown'?'sel':''}" data-r="unknown">❌ 不会</button>
      </div>`;
    $('#chReveal').onclick = () => { ch.reveal = !ch.reveal; renderChallenge(); };
    $$('#challengeBody [data-r]').forEach(b => b.onclick = () => {
      ch.rated[it.id] = b.dataset.r;
      Store.setLevel(it.id, b.dataset.r);
      renderChallenge();
    });
    const last = ch.idx === ch.items.length - 1;
    $('#chNext').textContent = last ? '完成' : '下一题 →';
  }
  function nextChallenge() {
    const ch = App.challenge;
    if (ch.idx < ch.items.length - 1) { ch.idx++; ch.reveal = false; renderChallenge(); }
    else {
      const nKnown = Object.values(ch.rated).filter(v => v === 'known').length;
      Store.markQuiz(1);
      $('#challengeModal').classList.remove('open');
      toast(`挑战完成！${ch.items.length} 题里 ${nKnown} 题脱口而出 💪`);
      App.challenge = null;
      renderToday(); renderNav();
    }
  }

  /* =======================================================
     视图切换
     ======================================================= */
  const TITLES = {
    today:  ['今日任务', '每天 15 个单词 + 1 段场景对话（影子跟读评分）'],
    module: ['', ''],
    scene:  ['', ''],
    practice: ['实战演练', '按问题作答，看范例，系统帮你批改语法'],
    review: ['成长复盘', '打卡日历 · 薄弱点 · 复盘笔记 · 收藏夹']
  };

  function go(view) {
    App.view = view;
    $$('.view').forEach(v => v.classList.add('is-hidden'));
    $(`#view-${view}`)?.classList.remove('is-hidden');
    $$('.quick-item').forEach(q => q.classList.toggle('is-active', q.dataset.view === view));

    if (view === 'today')  { renderToday();  setTitle(...TITLES.today); }
    if (view === 'review') { renderReview(); setTitle(...TITLES.review); }
    if (view === 'module') {
      renderModule();
      const mod = CURRICULUM.find(m => m.id === App.moduleId);
      setTitle(`第${mod.month}月 · ${mod.title}`, `${mod.scenes.length} 个核心场景 · ${mod.subtitle}`);
    }
    if (view === 'scene') {
      renderScene();
      const sc = CURRICULUM.find(m => m.id === App.moduleId)?.scenes.find(s => s.id === App.sceneId);
      setTitle(sc.title, sc.en);
    }
    if (view === 'practice') {
      renderPractice();
      const mod = CURRICULUM.find(m => m.id === App.moduleId);
      setTitle('实战演练', `${mod.title} · 按问题作答，看范例，系统批改语法`);
    }
    renderNav();
    $('#viewWrap').scrollTop = 0;
  }

  const setTitle = (t, s) => { $('#viewTitle').textContent = t; $('#viewSubtitle').textContent = s; };

  const openSidebar  = () => { $('#sidebar').classList.add('open');    $('#scrim').classList.add('show'); };
  const closeSidebar = () => { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); };

  /* =======================================================
     庆祝
     ======================================================= */
  function celebrate() {
    $('#celebrate').classList.add('open');
    confetti(); chime();
  }
  function confetti() {
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    const W = cv.width = cv.offsetWidth, H = cv.height = cv.offsetHeight;
    const colors = ['#6FA8B8','#EFC0AE','#EFD9A8','#A9CDB8','#C2BCDD','#FFFFFF'];
    const ps = Array.from({ length: 130 }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * H * .6,
      r: 4 + Math.random() * 6, c: colors[(Math.random() * colors.length) | 0],
      vy: 1.6 + Math.random() * 3, vx: -1.4 + Math.random() * 2.8,
      a: Math.random() * 6.28, va: -.12 + Math.random() * .24
    }));
    let t = 0;
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.5); ctx.restore();
      });
      if (++t < 260 && $('#celebrate').classList.contains('open')) requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, W, H);
    })();
  }
  function chime() {
    if (!Store.state.settings.sound) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t0 = ac.currentTime + i * 0.11;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.18, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
        o.connect(g); g.connect(ac.destination);
        o.start(t0); o.stop(t0 + 0.6);
      });
    } catch (e) { /* 静默 */ }
  }

  /* =======================================================
     工具
     ======================================================= */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* =======================================================
     事件绑定
     ======================================================= */
  function bind() {
    document.addEventListener('click', wireCard);
    $('#burger').onclick       = openSidebar;
    $('#sidebarClose').onclick = closeSidebar;
    $('#scrim').onclick        = closeSidebar;

    $$('.quick-item').forEach(q => q.addEventListener('click', () => { go(q.dataset.view); closeSidebar(); }));
    $('#btnGoToday').onclick    = () => go('today');
    $('#btnBackModule').onclick = () => go('module');
    $('#btnBackModule2').onclick = () => go('module');
    $('#btnGoPractice').onclick  = () => go('practice');

    $('#btnChallenge').onclick = startChallenge;
    $('#chClose').onclick = () => $('#challengeModal').classList.remove('open');
    $('#chNext').onclick = nextChallenge;
    $('#challengeModal').addEventListener('click', e => { if (e.target.id === 'challengeModal') e.currentTarget.classList.remove('open'); });

    $('#btnSettings').onclick      = () => $('#settingsDrawer').classList.add('open');
    $('#btnCloseSettings').onclick = () => $('#settingsDrawer').classList.remove('open');
    $('#settingsDrawer').addEventListener('click', e => {
      if (e.target.id === 'settingsDrawer') e.currentTarget.classList.remove('open');
    });
    $('#btnUpdate').onclick = async () => {
      if ('serviceWorker' in navigator) {
        const rs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(rs.map(r => r.update()));
      }
      toast('已检查更新，正在重新加载…');
      setTimeout(() => location.reload(true), 700);
    };
    $('#btnExport').onclick = () => { Store.exportJSON(); toast('数据已导出'); };
    $('#btnImport').onclick = () => $('#importFile').click();
    $('#importFile').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try { Store.importJSON(r.result); toast('导入成功，正在刷新…'); setTimeout(() => location.reload(), 800); }
        catch (err) { toast('导入失败：' + err.message); }
      };
      r.readAsText(f);
    };
    $('#btnClear').onclick = async () => {
      if (!confirm('确定清除本机全部学习数据并刷新？此操作不可恢复。')) return;
      Store.clearAll();
      if ('caches' in window) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); }
      location.reload();
    };
    $$('#accentSeg .seg-item').forEach(b => b.addEventListener('click', () => {
      $$('#accentSeg .seg-item').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      Store.state.settings.accent = b.dataset.accent; Store.save();
      toast(b.dataset.accent === 'us' ? '已切换为美式发音' : '已切换为英式发音');
    }));

    $('#btnSaveReflect').onclick = () => {
      const v = $('#reflectInput').value;
      if (!v.trim()) return toast('写一句再保存吧～');
      Store.addReflection(v); $('#reflectInput').value = '';
      renderReflections(); toast('复盘已保存');
    };
    $('#favSearch').oninput = e => renderFavs(e.target.value);

    $('#btnCelebrateOk').onclick   = () => $('#celebrate').classList.remove('open');
    $('#btnCelebrateMore').onclick = () => {
      $('#celebrate').classList.remove('open');
      toast('再开一组：直接去「今日任务」继续学 💪');
    };

    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
    $('#btnInstall').onclick = async () => {
      if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
      else toast('iPhone 请用 Safari：分享 → 添加到主屏幕');
    };

    document.addEventListener('store:saved', () => {
      const b = $('#syncBadge'); b.classList.add('flash');
      setTimeout(() => b.classList.remove('flash'), 400);
    });
  }

  /* =======================================================
     启动
     ======================================================= */
  function boot() {
    Store.initCorpus();
    const d = new Date();
    $('#todayDate').textContent = `${d.getMonth() + 1}月${d.getDate()}日 周${'日一二三四五六'[d.getDay()]}`;
    $('#appVersion').textContent = `v0.9.0 · 全 12 月双语内容校正（${Store.totalCards()} 条）`;
    bind();
    renderNav();
    go('today');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
  window.__EC = { App, go, celebrate, toast };
})();
