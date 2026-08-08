/**
 * 实战演练 · 语法批改引擎
 * 默认：纯前端规则引擎（离线、隐私、秒回），覆盖外企新人最常见错误。
 * 可选：window.EC_AI 配置后启用 AI 精修（见 aiCorrect，无 key 时自动跳过）。
 *
 * check(text) -> { score, issues[], corrected, note }
 */
const Grammar = (() => {
  const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
  // 以元音字母开头、但发辅音 -> 用 a（如 user / university / European）
  const A_EXCEPTIONS = new Set(['user', 'university', 'european', 'one', 'unicorn', 'useful', 'unit', 'uniform', 'unique']);
  // 以辅音字母开头、但发元音 -> 用 an（如 hour / honest / honor）
  const AN_EXCEPTIONS = new Set(['hour', 'honest', 'honor', 'hourly']);

  const TYPO = {
    recieve: 'receive', definately: 'definitely', separete: 'separate', occured: 'occurred',
    enviroment: 'environment', alot: 'a lot', accomodate: 'accommodate', wich: 'which',
    teh: 'the', becuase: 'because', neccessary: 'necessary', publlic: 'public',
    calender: 'calendar', thier: 'their', wierd: 'weird', foriegn: 'foreign',
    adress: 'address', acheive: 'achieve', beleive: 'believe', concious: 'conscious',
    embrass: 'embarrass', governement: 'government', liason: 'liaison', milennium: 'millennium'
  };

  // 第三人称单数现在时需要加 -s 的常用动词
  const THIRD = ['go', 'like', 'want', 'need', 'make', 'take', 'play', 'work', 'speak',
    'know', 'think', 'use', 'help', 'meet', 'send', 'call', 'get', 'give', 'see', 'try',
    'find', 'ask', 'start', 'show', 'watch', 'read', 'write', 'do', 'have', 'come', 'become', 'keep'];
  const MODALS = new Set(['will', 'would', 'can', 'could', 'should', 'must', 'may', 'might', 'shall']);

  function clean(word) {
    return word.toLowerCase().replace(/^[^a-z]+/, '').replace(/[^a-z].*$/, '');
  }

  function check(text) {
    const raw = (text || '').trim();
    const issues = [];
    if (!raw) {
      return { score: 0, issues: [{ type: 'empty', sev: 'info', msg: '还没有作答哦，先写一句试试～' }], corrected: '', note: NOTE };
    }

    const words = raw.toLowerCase().match(/[a-z']+/g) || [];
    const lower = ' ' + raw.toLowerCase() + ' ';

    // 1) a / an 搭配
    for (let i = 0; i < words.length - 1; i++) {
      const art = words[i];
      if (art !== 'a' && art !== 'an') continue;
      const w = clean(words[i + 1]);
      if (!w) continue;
      const startsVowel = VOWELS.has(w[0]);
      const needsAn = (startsVowel && !AN_EXCEPTIONS.has(w)) || A_EXCEPTIONS.has(w);
      const needsA = (!startsVowel && !A_EXCEPTIONS.has(w)) || AN_EXCEPTIONS.has(w);
      if (art === 'a' && needsAn) issues.push({ type: 'article', sev: 'grammar', msg: `"a ${w}" 前应改用 "an ${w}"（元音发音前用 an）` });
      if (art === 'an' && needsA) issues.push({ type: 'article', sev: 'grammar', msg: `"an ${w}" 前应改用 "a ${w}"（辅音发音前用 a）` });
    }

    // 2) be 动词主谓一致
    const bePairs = [
      [/(\b|^)(i|we|you|they)\s+(is|was)\b/gi, { i: 'am', we: 'are', you: 'are', they: 'are' }, { is: 'am', was: 'were' }],
      [/(\b|^)(he|she|it)\s+(are|were)\b/gi, { he: 'is', she: 'is', it: 'is' }, { are: 'is', were: 'were' }]
    ];
    bePairs.forEach(([re, subj, verb]) => {
      let m;
      while ((m = re.exec(raw))) {
        const s = m[2].toLowerCase(), v = m[3].toLowerCase();
        if (verb[v]) issues.push({ type: 'agreement', sev: 'grammar', msg: `"${m[2]} ${v}" 主谓不一致，应为 "${m[2]} ${verb[v]}"` });
      }
    });
    if (/\bi\s+are\b/i.test(raw)) issues.push({ type: 'agreement', sev: 'grammar', msg: '"I are" 应为 "I am"' });

    // 3) don't / doesn't
    if (/\b(he|she|it)\s+don'?t\b/i.test(raw)) issues.push({ type: 'agreement', sev: 'grammar', msg: '第三人称单数否定用 "doesn\'t"（不是 don\'t）' });
    if (/\b(i|we|you|they)\s+doesn'?t\b/i.test(raw)) issues.push({ type: 'agreement', sev: 'grammar', msg: '"doesn\'t" 用于 he/she/it；这里用 "don\'t"' });

    // 4) 第三人称单数缺 -s
    const re3 = /(\b|^)(he|she|it)\s+((?:not|never)\s+)?((?:am|is|are|was|were|will|would|can|could|should|must|may|might|has|have|had|does|did)\s+)?([a-z]+)/gi;
    let m3;
    while ((m3 = re3.exec(raw))) {
      if (m3[4] && m3[4].trim()) continue; // 前面有助动词，动词用原形是对的
      const verb = m3[5].toLowerCase();
      if (!THIRD.includes(verb)) continue;
      if (/(?:s|es|x|ch|sh|z)$/.test(verb)) continue;
      let fixed;
      if (verb === 'have') fixed = 'has';
      else if (verb === 'do') fixed = 'does';
      else fixed = /(s|sh|ch|x|o|z)$/.test(verb) ? verb + 'es' : verb + 's';
      issues.push({ type: 'agreement', sev: 'grammar', msg: `"${m3[2]} ${verb}" 第三人称单数现在时应加 -s：${m3[2]} ${fixed}` });
    }

    // 5) 拼写错误
    words.forEach(w => { if (TYPO[w]) issues.push({ type: 'spelling', sev: 'spelling', msg: `"${w}" 拼写疑似有误，应为 "${TYPO[w]}"` }); });

    // 6) 易混词（仅对高概率误用做温和提示，不强行改）
    if (/\byour\s+(a|an|the|going|doing|working|coming|ready|welcome|right|wrong|the)\b/i.test(raw))
      issues.push({ type: 'confusable', sev: 'style', msg: '注意 "your / you\'re"：这里很可能是 "you\'re"（you are）。' });
    if (/\bits\s+(a|an|the|going|doing|working|coming|my|our|not)\b/i.test(raw))
      issues.push({ type: 'confusable', sev: 'style', msg: '注意 "its / it\'s"：这里很可能是 "it\'s"（it is）。' });

    // 7) 大小写：句首应大写
    if (/^[a-z]/.test(raw)) issues.push({ type: 'case', sev: 'style', msg: '英文句子首字母应大写。' });

    // 8) 标点：结尾应有句号 / 问号 / 感叹号
    if (!/[.!?]$/.test(raw)) issues.push({ type: 'punct', sev: 'style', msg: '句子结尾建议加上句号 "."。' });

    // 9) "我" 必须大写 I
    if (/\b(^|\s)i(\s|[.,!?]|$)/.test(raw)) issues.push({ type: 'case', sev: 'style', msg: '英文里 "我" 永远大写：用 "I" 而不是 "i"。' });

    // 10) 时态提示：含过去时间词但像现在时
    const pastWord = /\b(yesterday|last\s+(week|month|year|quarter|monday|tuesday|wednesday|thursday|friday)|ago)\b/i.test(raw);
    if (pastWord && !/\b(was|were|did|finished|completed|shared|sent|made|took|went|came|got|gave|saw|met|wrapped)\b/i.test(raw)) {
      issues.push({ type: 'tense', sev: 'style', msg: '句中有 yesterday / last week 等过去时间，考虑用过去时（如 finished / was）。' });
    }

    // ---- 评分 ----
    let score = 100;
    issues.forEach(it => {
      if (it.sev === 'grammar') score -= 12;
      else if (it.sev === 'spelling') score -= 8;
      else if (it.sev === 'style') score -= 5;
      else if (it.sev === 'info') score -= 0;
    });
    score = Math.max(40, Math.min(100, score));
    if (issues.length === 0) score = 100;

    return { score, issues, corrected: bestEffort(raw), note: NOTE };
  }

  // 机器初步润色（仅供参考）
  function bestEffort(t) {
    let s = t.replace(/(^|\s)i(\s|[.,!?]|$)/g, '$1I$2');
    s = s.replace(/\b(recieve|definately|separete|occured|enviroment|alot|accomodate|wich|teh|becuase|neccessary|publlic|calender|thier|wierd|foriegn|adress|acheive|beleive|concious|embrass|governement|liason|milennium)\b/gi, m => TYPO[m.toLowerCase()] || m);
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/[.!?]$/.test(s)) s += '.';
    return s;
  }

  const NOTE = '规则引擎仅覆盖常见错误（单复数 / 时态 / a·an / 主谓一致 / 拼写 / 易混词），不替代老师或 AI 精修。对照下方范例自查更稳妥。';

  /**
   * 可选 AI 精修（需 window.EC_AI = { endpoint, apiKey, model }）。
   * 无配置时返回 null，调用方自动回退规则引擎。
   */
  async function aiCorrect(text, sample) {
    const cfg = window.EC_AI;
    if (!cfg || !cfg.apiKey || !cfg.endpoint) return null;
    try {
      const r = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.apiKey },
        body: JSON.stringify({
          model: cfg.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an English tutor for Chinese professionals. Given a sample answer and the user answer, return strict JSON: {"issues":[{"msg":"简短中文说明"}],"corrected":"润色后的英文","comment":"一句话鼓励"}. Do not add anything else.' },
            { role: 'user', content: `Sample answer: ${sample}\nUser answer: ${text}` }
          ]
        })
      });
      const j = await r.json();
      const c = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if (!c) return null;
      return JSON.parse(c);
    } catch (e) { return null; }
  }

  return { check, aiCorrect, NOTE };
})();

if (typeof window !== 'undefined') window.Grammar = Grammar;
