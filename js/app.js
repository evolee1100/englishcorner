(function () {
  const LEVELS = window.LEVELS;
  const S = window.Store;
  const app = document.getElementById("app");
  const COLORS = {
    coral: ["var(--coral-1)", "var(--coral-2)"],
    amber: ["var(--amber-1)", "var(--amber-2)"],
    green: ["var(--green-1)", "var(--green-2)"],
    blue: ["var(--blue-1)", "var(--blue-2)"],
    purple: ["var(--purple-1)", "var(--purple-2)"],
    teal: ["var(--teal-1)", "var(--teal-2)"],
    rose: ["var(--rose-1)", "var(--rose-2)"],
    lime: ["var(--lime-1)", "var(--lime-2)"]
  };
  const DIALOGS = window.DIALOGS || [];
  // 排序最簡單（字都給你，只要排順序），中翻英要自己拼，聽寫最難
  const MODES = { tiles: "排序", translate: "中翻英", dictation: "聽寫", speak: "跟讀" };
  const MODE_ICON = { tiles: "🧩", translate: "⌨️", dictation: "🎧", speak: "🎤" };
  // 闖關只開放排序和打字：語音辨識的誤差不該扣命
  const STAGE_MODES = ["tiles", "translate"];
  const PRAISE = ["太棒了！", "完全正確！", "漂亮！", "Nice!", "Great job!", "就是這樣！", "Perfect!"];

  // ---------- 繁簡轉換 ----------
  let cnConv = null;
  function z(s) {
    if (S.prefs.script !== "cn") return s;
    if (!cnConv && window.OpenCC) cnConv = window.OpenCC.Converter({ from: "tw", to: "cn" });
    return cnConv ? cnConv(s) : s;
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ez = s => esc(z(s));

  // ---------- 發音（Web Speech API） ----------
  // 美式／英式：依 S.prefs.accent 挑語音；裝置沒有該口音時退回任一英文語音並記下來
  const ACCENTS = {
    us: { lang: "en-US", re: /^en[-_]US/i, prefer: ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Microsoft Guy", "Ava", "Allison", "Alex"] },
    uk: { lang: "en-GB", re: /^en[-_]GB/i, prefer: ["Daniel", "Google UK English Female", "Google UK English Male", "Microsoft Sonia", "Microsoft Libby", "Microsoft Ryan", "Serena", "Kate", "Arthur"] }
  };
  let voice = null;
  let voiceFallback = false;
  function pickVoice() {
    const a = ACCENTS[S.prefs.accent] || ACCENTS.us;
    const all = speechSynthesis.getVoices();
    const vs = all.filter(v => a.re.test(v.lang));
    voice = a.prefer.map(n => vs.find(v => v.name.includes(n))).find(Boolean) || vs[0] || null;
    voiceFallback = !voice && all.length > 0;
    if (!voice) voice = all.find(v => /^en[-_]/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, rate = 1, onEnd) {
    if (!("speechSynthesis" in window)) { toast(z("這個瀏覽器不支援發音")); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang || (ACCENTS[S.prefs.accent] || ACCENTS.us).lang;
    if (voice) u.voice = voice;
    u.rate = rate;
    if (onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
  }

  // ---------- 開口說：語音辨識（Chrome / Safari）＋錄下自己的聲音 ----------
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canListen = !!SR;
  // iOS 同時開語音辨識和錄音容易互搶麥克風，所以 iOS 上不錄音
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const canRecord = !isIOS && !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  let rec = null, recorder = null, recStream = null;
  function finishListening() { try { rec?.stop(); } catch {} }
  function stopListening() {
    try { rec?.abort(); } catch {}
    rec = null;
    try { if (recorder?.state === "recording") recorder.stop(); } catch {}
  }
  // 聽使用者說一句話：onInterim 即時顯示，onDone 收到最後結果，onRecording 拿到錄音網址
  function listen(target, onInterim, onDone, onRecording) {
    stopListening();
    const r = new SR();
    rec = r;
    r.lang = (ACCENTS[S.prefs.accent] || ACCENTS.us).lang;
    r.interimResults = true;
    r.maxAlternatives = 3;
    r.continuous = false;
    const finals = [];
    let error = "";
    r.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finals.push([...res].map(a => a.transcript));
        else interim += res[0].transcript;
      }
      onInterim((finals.map(f => f[0]).join(" ") + " " + interim).trim());
    };
    r.onerror = e => { error = e.error; };
    r.onend = () => {
      if (rec !== r) return;
      rec = null;
      try { if (recorder?.state === "recording") recorder.stop(); } catch {}
      // 每段取辨識器給的幾個候選，挑最接近目標句的組合
      let heard = "";
      for (let j = 0; j < 3; j++) {
        const cand = finals.map(f => f[j] || f[0]).join(" ").trim();
        if (cand && (!heard || scoreSpeech(target, cand).score > scoreSpeech(target, heard).score)) heard = cand;
      }
      onDone(heard, error);
    };
    try { r.start(); } catch { onDone("", "start-failed"); return; }
    if (canRecord && onRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        if (rec !== r) { stream.getTracks().forEach(t => t.stop()); return; }
        recStream = stream;
        const chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          if (chunks.length) onRecording(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })));
        };
        recorder.start();
      }).catch(() => {});
    }
  }
  const listenError = err => ({
    "not-allowed": "請允許瀏覽器使用麥克風（網址列左邊的設定）",
    "service-not-allowed": "請允許瀏覽器使用麥克風",
    "no-speech": "沒有聽到聲音，按 🎤 再說一次",
    "audio-capture": "找不到麥克風",
    "network": "語音辨識需要網路連線"
  }[err] || "沒有聽清楚，按 🎤 再說一次");
  let myAudio = null;
  function playRecording(url) { if (!url) return; myAudio?.pause(); myAudio = new Audio(url); myAudio.play(); }

  // 數字統一拼成英文字（辨識器常把 nine 寫成 9）
  const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const numWord = n => n < 20 ? ONES[n] : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "") : n < 1000 ? ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWord(n % 100) : "") : String(n);
  const speechToks = s => norm(s).replace(/\b\d+\b/g, d => numWord(+d)).trim().split(" ").filter(Boolean);
  // 逐字比對說出來的話：回傳每個目標字有沒有被念到，以及念到的比例
  function scoreSpeech(target, heard) {
    const words = target.split(/\s+/);
    const flat = [], owner = [];
    words.forEach((w, i) => speechToks(w).forEach(t => { flat.push(t); owner.push(i); }));
    const keep = lcsKeep(flat, speechToks(heard));
    const wordOk = words.map((_, i) => owner.every((o, k) => o !== i || keep.has(k)));
    return { wordOk, score: flat.length ? keep.size / flat.length : 0 };
  }
  const PASS_SCORE = 0.8;

  // ---------- 答案比對 ----------
  function norm(s) {
    return " " + s.toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not")
      .replace(/\bwon't\b/g, "will not").replace(/\bshan't\b/g, "shall not")
      .replace(/n't\b/g, " not").replace(/'re\b/g, " are").replace(/'m\b/g, " am")
      .replace(/'ll\b/g, " will").replace(/'ve\b/g, " have").replace(/'d\b/g, " would")
      .replace(/'s\b/g, " is")
      .replace(/\bok\b/g, "okay")
      .replace(/[-–—]/g, " ")
      .replace(/[^a-z0-9' ]+/g, " ")
      .replace(/\s+/g, " ").trim() + " ";
  }
  const core = w => w.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "");
  const wordKey = w => core(w).toLowerCase().replace(/[’‘`´]/g, "'");
  function isCorrect(input, item) {
    const n = norm(input);
    return [item.en, ...(item.alt || [])].some(a => norm(a) === n);
  }
  function targetTokens(en) {
    return en.split(/\s+/).map(w => {
      const c = core(w);
      return { core: c, trail: w.slice(w.indexOf(c) + c.length) };
    });
  }

  // ---------- 小工具 ----------
  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }
  const findTopic = id => {
    for (const lv of LEVELS) for (const tp of lv.topics) if (tp.id === id) return { lv, tp };
    return null;
  };
  const allTopics = LEVELS.flatMap(lv => lv.topics.map(tp => tp.id));
  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const lvStyle = lv => `--lc1:${COLORS[lv.color][0]};--lc2:${COLORS[lv.color][1]}`;

  // ---------- 首頁 ----------
  function renderHome() {
    stopTimer();
    const st = S.stats();
    const greet = new Date().getHours() < 12 ? "早安" : new Date().getHours() < 18 ? "午安" : "晚安";
    app.innerHTML = `
      <section class="hero">
        <h1 class="zh">${ez(greet)}！<br><span class="rainbow">${ez("今天打幾句英文？")}</span></h1>
        <p class="zh">${ez("看中文，把英文排出來或打出來，答對就念給你聽。覺得難就先用 🧩 排序，再挑戰 ⌨️ 中翻英。")}</p>
      </section>
      <section class="stats">
        <div class="stat" ><div class="n">${st.today}</div><div class="l zh">${ez("今日練習句數")}</div></div>
        <div class="stat" ><div class="n">${st.streak} 🔥</div><div class="l zh">${ez("連續天數")}</div></div>
        <div class="stat" ><div class="n">${st.totalDone}</div><div class="l zh">${ez("已掌握句子")}</div></div>
      </section>
      <section class="stage-entry">
        <button class="stage-card" data-goto="#/c">
          <span class="stage-trophy">🏆</span>
          <span class="dlg-text"><b class="zh">${ez("闖關挑戰")}</b><small class="zh">${ez(`${STAGES.length} 關 · 每關 10 句 · 3 條命`)}</small></span>
          <span class="stage-stars">⭐ ${S.totalStars()} / ${STAGES.length * 3}</span>
        </button>
      </section>
      ${DIALOGS.length ? `
      <section class="dialogs-sec">
        <h2 class="sec-title zh">💬 ${ez("對話練習")}<small>Conversation</small></h2>
        <p class="sec-desc zh">${ez(canListen ? "對方說一句，你用英文把回答說出來（也可以改成用選的）。說錯會告訴你為什麼。" : "對方說一句，你選出最恰當的回答。選錯會告訴你為什麼。")}</p>
        <div class="dlg-grid">
          ${DIALOGS.map(d => `
            <button class="dlg-card" data-dlg="${esc(d.id)}">
              <span class="dlg-emoji">${d.emoji || "💬"}</span>
              <span class="dlg-text"><b class="zh">${ez(d.title)}</b><small>${esc(d.en)}</small></span>
              ${S.state.progress["dlg-" + d.id]?.dialog?.done.length ? `<span class="dlg-done">✓</span>` : ""}
            </button>`).join("")}
        </div>
      </section>` : ""}
      <section class="levels">
        ${LEVELS.map(lv => {
          const total = lv.topics.reduce((n, t) => n + t.items.length, 0);
          const done = lv.topics.reduce((n, t) => n + S.doneCount(t.id), 0);
          return `
          <article class="level" style="${lvStyle(lv)}">
            <div class="level-head">
              <div class="level-badge">${lv.badge ? `<b class="badge-word">${esc(lv.badge)}</b>` : `LEVEL<b>${lv.id}</b>`}</div>
              <div>
                <h2 class="level-title zh">${ez(lv.name)}<small>${esc(lv.en)}</small></h2>
                <p class="level-desc zh">${ez(lv.desc)}</p>
              </div>
              <div class="level-pct">${Math.round(done / total * 100)}%<span>${done}/${total}</span></div>
            </div>
            <div class="topics">
              ${lv.topics.map(tp => {
                const d = S.doneCount(tp.id);
                return `
                <div class="topic">
                  <h3 class="zh">${ez(tp.name)}<small>${esc(tp.en)}</small></h3>
                  <div class="bar"><i style="width:${d / tp.items.length * 100}%"></i></div>
                  <div class="topic-meta zh"><span>${d}/${tp.items.length} ${ez("句")}</span><span>${d === tp.items.length ? "🏆 " + ez("已完成") : ""}</span></div>
                  <div class="topic-btns">
                    ${Object.entries(MODES).map(([k, v], i) => `<button class="btn ${i ? "ghost" : ""} zh" data-go="${tp.id}/${k}">${MODE_ICON[k]} ${ez(v)}</button>`).join("")}
                  </div>
                </div>`;
              }).join("")}
            </div>
          </article>`;
        }).join("")}
      </section>
      <p class="foot">English Corner v${esc(window.EC_CONFIG?.version || "")} · ${ez(S.cloudEnabled ? (S.user ? "進度已同步到雲端" : "登入後可跨裝置同步進度") : "進度儲存在這台裝置")}</p>`;
    app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { location.hash = "#/p/" + b.dataset.go; });
    app.querySelectorAll("[data-dlg]").forEach(b => b.onclick = () => { location.hash = "#/d/" + b.dataset.dlg; });
    app.querySelectorAll("[data-goto]").forEach(b => b.onclick = () => { location.hash = b.dataset.goto; });
  }

  // ---------- 闖關：Level 0 → 5 的句子由短到長排好，每 10 句一關 ----------
  const STAGES = (() => {
    const out = [];
    for (const lv of LEVELS) {
      if (lv.badge) continue;
      const items = lv.topics.flatMap(tp => tp.items.map((it, idx) => ({ ...it, src: { tid: tp.id, idx } })));
      const sorted = items.map((it, i) => ({ it, i, n: it.en.split(/\s+/).length }))
        .sort((a, b) => a.n - b.n || a.i - b.i).map(x => x.it);
      for (let k = 0; k < sorted.length; k += 10) out.push({ lv, items: sorted.slice(k, k + 10) });
    }
    return out.map((s, i) => ({ ...s, n: i + 1 }));
  })();
  const stageOpen = n => n === 1 || S.getStars(n - 1) > 0;
  const starStr = n => "★".repeat(n) + "☆".repeat(3 - n);

  function renderStageMap() {
    stopTimer();
    const mode = STAGE_MODES.includes(S.prefs.stageMode) ? S.prefs.stageMode : "tiles";
    const groups = [];
    for (const s of STAGES) {
      const g = groups[groups.length - 1];
      if (g && g.lv === s.lv) g.stages.push(s); else groups.push({ lv: s.lv, stages: [s] });
    }
    app.innerHTML = `
      <section class="stagemap">
        <div class="pbar">
          <button class="back zh" id="back">← ${ez("首頁")}</button>
          <div class="ptitle zh">🏆 ${ez("闖關挑戰")}<small>⭐ ${S.totalStars()} / ${STAGES.length * 3}</small></div>
          <div class="spacer"></div>
          <div class="seg zh">${STAGE_MODES.map(k => `<button data-smode="${k}" class="${k === mode ? "on" : ""}">${MODE_ICON[k]} ${ez(MODES[k])}</button>`).join("")}</div>
        </div>
        <p class="sec-desc zh">${ez("每關 10 句、3 條命：答錯或看答案扣一條命。剩幾條命就拿幾顆星，拿到星星才會開下一關。")}</p>
        ${groups.map(g => `
          <div class="stage-group" style="${lvStyle(g.lv)}">
            <h3 class="zh">LEVEL ${g.lv.id} · ${ez(g.lv.name)}</h3>
            <div class="stage-grid">
              ${g.stages.map(s => {
                const open = stageOpen(s.n), st = S.getStars(s.n);
                return `<button class="stage-btn ${open ? "" : "locked"} ${st ? "cleared" : ""}" data-stage="${s.n}" ${open ? "" : "disabled"}>
                  <b>${open ? s.n : "🔒"}</b><span class="stars">${open ? starStr(st) : ""}</span></button>`;
              }).join("")}
            </div>
          </div>`).join("")}
      </section>`;
    document.getElementById("back").onclick = () => { location.hash = "#/"; };
    app.querySelectorAll("[data-smode]").forEach(b => b.onclick = () => { S.prefs.stageMode = b.dataset.smode; S.savePrefs(); renderStageMap(); });
    app.querySelectorAll("[data-stage]").forEach(b => b.onclick = () => { location.hash = `#/c/${b.dataset.stage}/${mode}`; });
  }

  function startStage(n, mode) {
    const st = STAGES[n - 1];
    if (!st || !stageOpen(n) || !STAGE_MODES.includes(mode)) { location.hash = "#/c"; return; }
    P = {
      lv: st.lv, tp: { id: "stage-" + n, name: `第 ${n} 關`, en: `Stage ${n}`, items: st.items }, mode,
      idx: 0, input: "", status: "typing", attempts: 0, revealed: false, hint: false, feedback: "", marks: [],
      session: { firstTry: 0, finished: 0, start: Date.now() },
      challenge: { n, lives: 3 }
    };
    if (mode === "tiles") resetTiles();
    startClock();
    renderPractice();
  }
  // 闖關扣命；命用完就結束這關。回傳 true 代表這關已經結束
  function loseLife() {
    if (!P.challenge) return false;
    P.challenge.lives--;
    if (P.challenge.lives > 0) return false;
    renderStageResult(false);
    return true;
  }
  function renderStageResult(win) {
    stopTimer();
    speechSynthesis?.cancel();
    const { n, lives } = P.challenge;
    const stars = win ? lives : 0;
    if (win) S.setStars(n, stars);
    const nextOpen = win && STAGES[n];
    app.innerHTML = `
      <section class="practice" style="${lvStyle(P.lv)}">
        <div class="stage done-card" id="done-card">
          <div class="big">${win ? "🏆" : "💔"}</div>
          <h2 class="zh">${ez(win ? `第 ${n} 關過關！` : `第 ${n} 關挑戰失敗`)}</h2>
          ${win ? `<div class="result-stars">${starStr(stars)}</div>` : ""}
          <p class="zh" style="color:var(--muted)">${ez(win
            ? (stars === 3 ? "零失誤，完美過關！" : "過關了！想拿滿三顆星可以再挑戰一次。")
            : (P.mode === "translate" ? "三條命用完了。可以先換成 🧩 排序 模式熟悉這些句子。" : "三條命用完了，再試一次！"))}</p>
          <div class="done-actions zh">
            ${nextOpen ? `<button class="btn lg" id="nextstage">➡️ ${ez("下一關")}</button>` : ""}
            <button class="btn lg ${nextOpen ? "ghost" : ""}" id="again">🔁 ${ez(win ? "再挑戰一次" : "再試一次")}</button>
            <button class="btn lg ghost" id="map">🗺 ${ez("關卡地圖")}</button>
          </div>
        </div>
      </section>`;
    document.getElementById("again").onclick = () => startStage(n, P.mode);
    document.getElementById("map").onclick = () => { location.hash = "#/c"; };
    if (nextOpen) document.getElementById("nextstage").onclick = () => { location.hash = `#/c/${n + 1}/${P.mode}`; };
  }

  // ---------- 練習頁 ----------
  let P = null; // 目前練習狀態
  let timer = null;
  function stopTimer() { clearInterval(timer); timer = null; }

  function startPractice(topicId, mode) {
    const found = findTopic(topicId);
    if (!found) { location.hash = "#/"; return; }
    const saved = S.getTopic(topicId, mode);
    P = {
      ...found, mode,
      idx: saved.pos < found.tp.items.length ? saved.pos : 0,
      input: "", status: "typing", attempts: 0, revealed: false, hint: false, feedback: "", marks: [],
      session: { firstTry: 0, finished: 0, start: Date.now() }
    };
    if (mode === "tiles") resetTiles();
    if (mode === "speak") resetSay();
    startClock();
    renderPractice();
    if (mode === "dictation") setTimeout(() => speak(item().en), 350);
  }
  function startClock() {
    stopTimer();
    timer = setInterval(() => {
      const el = document.getElementById("clock");
      if (el && P) el.textContent = fmtTime(Math.floor((Date.now() - P.session.start) / 1000));
    }, 1000);
  }
  const item = () => P.tp.items[P.idx];

  // ---------- 排序模式：把標準答案的字打散成字卡 ----------
  const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function resetTiles() {
    const words = item().en.split(/\s+/).map(core).filter(Boolean);
    let bank = words.map((w, id) => ({ id, w }));
    // 打散到跟原本順序不一樣（只有一個字時沒得換）
    for (let k = 0; k < 10 && words.length > 1; k++) {
      bank = shuffle(bank);
      if (!bank.every((t, i) => t.id === i)) break;
    }
    P.words = words; P.bank = bank; P.placed = []; P.tileMarks = null;
  }
  function renderTiles() {
    const w = id => P.words[id];
    const placed = P.placed.length
      ? P.placed.map((id, i) => `<button class="tile placed ${P.tileMarks ? (P.tileMarks[i] ? "right" : "wrong") : ""}" data-placed="${i}">${esc(w(id))}</button>`).join("")
      : `<span class="tile-empty zh">${ez("點下面的英文字，排成正確的句子")}</span>`;
    const bank = P.bank.map(t => P.placed.includes(t.id)
      ? `<span class="tile used">${esc(t.w)}</span>`
      : `<button class="tile" data-tile="${t.id}">${esc(t.w)}</button>`).join("");
    return `<div class="tile-answer" id="tile-answer">${placed}</div><div class="tile-bank">${bank}</div>`;
  }
  function checkTiles() {
    const it = item();
    const built = P.placed.map(id => P.words[id]);
    P.input = built.join(" ");
    if (built.length === P.words.length && isCorrect(P.input, it)) { succeed(it); return; }
    P.attempts++;
    if (loseLife()) return;
    P.tileMarks = built.map((x, i) => wordKey(x) === wordKey(P.words[i]));
    if (P.attempts >= 3) P.revealed = true;
    renderPractice();
    const stage = document.getElementById("stage");
    stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake");
    toast(z(P.revealed ? "看參考答案，照著排一次" : "紅色的位置不對，點它拿回來重排"));
  }

  function renderPractice() {
    const { lv, tp, mode } = P;
    const it = item();
    const dict = mode === "dictation";
    const tiles = mode === "tiles";
    const say = mode === "speak";
    const ch = P.challenge;
    // 闖關的虛擬主題不寫進進度；進度點用「已經答過幾句」表示
    const doneSet = ch ? new Set([...Array(P.idx).keys()]) : new Set(S.getTopic(tp.id, mode).done);
    app.innerHTML = `
      <section class="practice" style="${lvStyle(lv)}">
        <div class="pbar">
          <button class="back zh" id="back">← ${ez("首頁")}</button>
          <div class="ptitle zh">${ch ? "🏆" : lv.badge ? esc(lv.badge) : "L" + lv.id} · ${ez(tp.name)}<small>${esc(tp.en)}</small></div>
          <div class="spacer"></div>
          <span class="pill">${P.idx + 1}/${tp.items.length}</span>
          <span class="pill">⏱ <span id="clock">${fmtTime(Math.floor((Date.now() - P.session.start) / 1000))}</span></span>
          <div class="seg zh">
            ${Object.entries(MODES).filter(([k]) => !ch || STAGE_MODES.includes(k)).map(([k, v]) => `<button data-mode="${k}" class="${k === mode ? "on" : ""}">${ez(v)}</button>`).join("")}
          </div>
          ${ch ? `<span class="pill lives" title="${ez("剩下的命")}">${"❤️".repeat(ch.lives)}${"🤍".repeat(3 - ch.lives)}</span>` : ""}
          <div class="seg zh" title="${ez("發音口音")}">
            <button data-accent="us" class="${S.prefs.accent !== "uk" ? "on" : ""}">🇺🇸 ${ez("美式")}</button>
            <button data-accent="uk" class="${S.prefs.accent === "uk" ? "on" : ""}">🇬🇧 ${ez("英式")}</button>
          </div>
          <label class="toggle zh"><input type="checkbox" id="auto" ${S.prefs.autoSpeak ? "checked" : ""}>${ez("答對朗讀")}</label>
        </div>
        <div class="progress-dots">${tp.items.map((_, i) => `<i class="${doneSet.has(i) ? "done" : i === P.idx ? "cur" : ""}"></i>`).join("")}</div>

        <div class="stage" id="stage">
          <div class="typing-area" style="position:relative">
            ${dict && P.status !== "success"
              ? `<button class="listen-big" id="listen-big" aria-label="播放">🔊</button>
                 <div class="prompt-sub zh">${ez("聽發音，打出你聽到的英文")}</div>`
              : `<p class="prompt-zh zh">${ez(it.zh)}</p>
                 <div class="prompt-sub zh">${ez(dict ? "聽寫完成" : tiles ? "把英文字排成正確的順序" : say ? "先聽一遍，再按 🎤 跟著說" : "請用英文打出來")}</div>`}
            ${say && P.status !== "success" ? renderSay() : tiles && P.status !== "success" ? renderTiles() : `<div class="slots" id="slots"></div>`}
            ${P.status !== "success" && !tiles && !say ? `<input class="typing-input" id="typing" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="輸入英文">` : ""}
          </div>
          ${P.feedback && P.status !== "success" ? `<div class="feedback-box zh">⚠️ ${ez(P.feedback)}</div>` : ""}
          ${P.revealed && P.status !== "success" ? `<div class="answer-reveal"><small class="zh">${ez("參考答案（照著打一遍）")}</small>${esc(it.en)}</div>`
            : P.hint && P.status !== "success" ? `<div class="answer-reveal hint-box"><small class="zh">${ez("提示：每個字的首字母")}</small>${esc(maskHint(it.en))}${it.note ? `<div class="grammar-note zh">📘 ${ez(it.note)}</div>` : ""}</div>` : ""}
          ${P.status === "success" ? renderResult(it) : ""}
          <div class="tools zh">
            <button class="tool" data-act="play">🔊 ${ez("發音")} <kbd>Tab</kbd></button>
            <button class="tool" data-act="slow">🐢 ${ez("慢速")} <kbd>⇧Tab</kbd></button>
            ${P.status === "success"
              ? `<button class="tool" data-act="next">➡️ ${ez("下一句")} <kbd>Enter</kbd></button>`
              : `${tiles ? `<button class="tool" data-act="clear">↩️ ${ez("清除")} <kbd>⌫</kbd></button>` : ""}
                 ${say ? "" : `<button class="tool" data-act="reveal">👀 ${ez(ch ? "看答案（扣 ❤️）" : "看答案")} <kbd>Esc</kbd></button>`}
                 ${ch ? "" : `<button class="tool" data-act="skip">⏭ ${ez("略過")}</button>`}`}
          </div>
          <div class="hint zh">${ez(say
            ? "先按 🔊 聽（念不順就用 🐢 慢速），再按 🎤 把整句念出來。念對八成以上的字就過關；紅色的字點一下可以聽它的發音。"
            : tiles
            ? "依中文意思點英文字排成句子，點上面排好的字可以拿回來。全部排完會自動檢查。"
            : "單字之間按空白鍵，點字或用 ← → 移動游標修改，打完按 Enter 檢查。大小寫和標點不影響對錯；I'm 和 I am 算一樣，但要注意 I'm = I am，不等於 I。")}</div>
        </div>
      </section>`;
    bindPractice();
    renderSlots();
  }

  function resetSay() { P.say = { listening: false, heard: "", wordOk: null, score: null, url: null }; }
  function renderSay() {
    const it = item();
    const s = P.say || {};
    const words = it.en.split(/\s+/);
    if (!canListen) return `
      <div class="say-target">${words.map(w => `<button class="say-word" data-word="${esc(core(w))}">${esc(w)}</button>`).join("")}</div>
      <div class="feedback-box zh">⚠️ ${ez("這個瀏覽器不支援語音辨識（請用 Chrome 或 Safari）。可以先聽 🔊 跟著大聲念，念完自己按「我念完了」。")}</div>
      <div class="mic-row"><button class="btn" data-act="selfok">✓ ${ez("我念完了")}</button></div>`;
    return `
      <div class="say-target">${words.map((w, i) => `<button class="say-word ${s.wordOk ? (s.wordOk[i] ? "right" : "wrong") : ""}" data-word="${esc(core(w))}">${esc(w)}</button>`).join("")}</div>
      <div class="mic-row">
        <button class="mic ${s.listening ? "on" : ""}" id="mic" aria-label="${ez(s.listening ? "停止" : "開始說")}">${s.listening ? "■" : "🎤"}</button>
      </div>
      <div class="heard zh" id="heard">${s.listening ? ez("聆聽中…請把整句念出來") + (s.heard ? `<b>${esc(s.heard)}</b>` : "") : s.heard ? `${ez("辨識到：")}<b>${esc(s.heard)}</b>` : ez("按 🎤 開始說")}</div>
      ${s.score != null ? `<div class="say-score zh ${s.score >= PASS_SCORE ? "ok" : ""}">${ez("念對")} ${Math.round(s.score * 100)}%（${ez("需要 80%")}）</div>` : ""}
      ${s.url ? `<div class="mic-row"><button class="tool" data-act="playme">▶️ ${ez("聽我的錄音")}</button><button class="tool" data-act="play">🔊 ${ez("聽標準發音")}</button></div>` : ""}`;
  }
  function startSay() {
    const it = item();
    if (P.say.listening) { finishListening(); return; }
    speechSynthesis?.cancel();
    Object.assign(P.say, { listening: true, heard: "", wordOk: null, score: null });
    renderPractice();
    listen(it.en,
      interim => { if (!P?.say?.listening) return; P.say.heard = interim; const h = document.getElementById("heard"); if (h) h.innerHTML = `${ez("聆聽中…請把整句念出來")}<b>${esc(interim)}</b>`; },
      (heard, err) => {
        if (!P || P.mode !== "speak" || item() !== it) return;
        P.say.listening = false;
        if (!heard) { P.say.heard = ""; renderPractice(); toast(z(listenError(err))); return; }
        const sc = scoreSpeech(it.en, heard);
        Object.assign(P.say, { heard, wordOk: sc.wordOk, score: sc.score });
        P.input = heard;
        if (sc.score >= PASS_SCORE) { succeed(it); return; }
        P.attempts++;
        renderPractice();
        toast(z("紅色的字沒聽清楚，點它聽發音，再按 🎤 試一次"));
      },
      url => { if (P?.say) { P.say.url = url; if (P.mode === "speak") renderPractice(); } });
  }

  function renderResult(it) {
    const typedOther = P.mode !== "speak" && P.input.trim() && norm(P.input) !== norm(it.en);
    const sayInfo = P.mode === "speak" && P.say?.heard
      ? `<div class="std zh">🎤 ${ez("辨識到：")}<b>${esc(P.say.heard)}</b>（${Math.round(P.say.score * 100)}%）${P.say.url ? ` <button class="tool inline" data-act="playme">▶️ ${ez("聽我的錄音")}</button>` : ""}</div>` : "";
    return `
      <div class="result">
        <div class="praise zh">✨ ${ez(PRAISE[Math.floor(Math.random() * PRAISE.length)])}</div>
        <div class="en-words">${it.en.split(/\s+/).map(w => `<button data-word="${esc(core(w))}">${esc(w)}</button>`).join("")}</div>
        ${typedOther ? `<div class="std zh">${ez("你的說法也對！標準答案：")}<b>${esc(it.en)}</b></div>` : ""}
        ${sayInfo}
        ${it.note ? `<div class="grammar-note zh">📘 ${ez(it.note)}</div>` : ""}
        ${(it.alt || []).length ? `<div class="std zh">${ez("其他說法：")}${it.alt.map(esc).join(" ／ ")}</div>` : ""}
      </div>`;
  }

  function renderSlots() {
    const box = document.getElementById("slots");
    if (!box) return;
    if (P.status === "success") { box.innerHTML = ""; return; }
    const target = targetTokens(item().en);
    const typed = P.input.split(" ");
    // 游標在第幾個字、字裡的第幾個字母
    const caret = Math.min(P.caret ?? P.input.length, P.input.length);
    const before = P.input.slice(0, caret);
    const active = before.split(" ").length - 1;
    const offset = caret - (before.lastIndexOf(" ") + 1);
    const focused = document.activeElement?.id === "typing";
    const n = Math.max(target.length, typed.length);
    let html = "";
    for (let i = 0; i < n; i++) {
      const t = target[i];
      const w = typed[i] ?? "";
      const cls = ["slot"];
      if (!t) cls.push("extra");
      const showCaret = i === active && focused;
      if (showCaret) cls.push("active");
      if (w) cls.push("filled");
      const m = P.marks[i];
      if (m && m.text === w && w) cls.push(m.ok ? "right" : "wrong");
      const len = t ? t.core.length : Math.max(w.length, 1);
      const punct = t?.trail && !/[^A-Za-z0-9']$/.test(w) ? `<span class="punct">${esc(t.trail)}</span>` : "";
      const text = showCaret ? esc(w.slice(0, offset)) + '<i class="caret"></i>' + esc(w.slice(offset)) : esc(w);
      html += `<span class="wgroup"><span class="${cls.join(" ")}" data-i="${i}" style="--len:${len}">${text}</span>${punct}</span>`;
    }
    box.innerHTML = html;
  }

  function bindPractice() {
    document.getElementById("back").onclick = () => { stopListening(); location.hash = P.challenge ? "#/c" : "#/"; };
    app.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => {
      if (b.dataset.mode === P.mode) return;
      stopListening();
      if (P.challenge) { S.prefs.stageMode = b.dataset.mode; S.savePrefs(); location.hash = `#/c/${P.challenge.n}/${b.dataset.mode}`; }
      else location.hash = `#/p/${P.tp.id}/${b.dataset.mode}`;
    });
    const mic = document.getElementById("mic");
    if (mic) mic.onclick = startSay;
    document.getElementById("auto").onchange = e => { S.prefs.autoSpeak = e.target.checked; S.savePrefs(); };
    app.querySelectorAll("[data-accent]").forEach(b => b.onclick = () => {
      S.prefs.accent = b.dataset.accent;
      S.savePrefs();
      pickVoice();
      app.querySelectorAll("[data-accent]").forEach(x => x.classList.toggle("on", x === b));
      if (voiceFallback) toast(z(S.prefs.accent === "uk" ? "這台裝置沒有英式語音，會用其他英文語音代替" : "這台裝置沒有美式語音，會用其他英文語音代替"));
      speak(item().en);
      focusInput();
    });
    app.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act(b.dataset.act));
    app.querySelectorAll("[data-word]").forEach(b => b.onclick = () => {
      b.classList.add("speaking");
      speak(b.dataset.word, .85, () => b.classList.remove("speaking"));
    });
    app.querySelectorAll("[data-tile]").forEach(b => b.onclick = () => {
      P.placed.push(+b.dataset.tile);
      P.tileMarks = null;
      if (P.placed.length === P.words.length) checkTiles(); else renderPractice();
    });
    app.querySelectorAll("[data-placed]").forEach(b => b.onclick = () => {
      P.placed.splice(+b.dataset.placed, 1);
      P.tileMarks = null;
      renderPractice();
    });
    const big = document.getElementById("listen-big");
    if (big) big.onclick = e => { e.stopPropagation(); speak(item().en); focusInput(); };

    const stage = document.getElementById("stage");
    const input = document.getElementById("typing");
    if (input) {
      input.value = P.input;
      const tidy = str => str.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
      // 游標位置改變時更新畫面上的游標；不支援選取一段文字（看不到選取範圍）
      const syncCaret = () => {
        if (input.selectionStart !== input.selectionEnd) input.setSelectionRange(input.selectionEnd, input.selectionEnd);
        if (P.caret !== input.selectionEnd) { P.caret = input.selectionEnd; renderSlots(); }
      };
      input.oninput = () => {
        // 連續空白壓成一個、不允許開頭空白，並保住游標位置
        const pos = input.selectionStart;
        const v = tidy(input.value);
        if (v !== input.value) {
          const p = tidy(input.value.slice(0, pos)).length;
          input.value = v;
          input.setSelectionRange(p, p);
        }
        P.input = v;
        P.caret = input.selectionEnd;
        renderSlots();
      };
      input.onkeydown = e => { onKey(e); setTimeout(syncCaret, 0); };
      input.onkeyup = input.onselect = syncCaret;
      // 輸入框是透明的，點擊時依座標找出點到哪個字、哪個字母，把游標放過去
      input.onclick = e => {
        const pos = caretFromPoint(e.clientX, e.clientY);
        input.setSelectionRange(pos, pos);
        syncCaret();
      };
      input.onfocus = () => { stage.classList.add("focus"); renderSlots(); };
      input.onblur = () => { stage.classList.remove("focus"); renderSlots(); };
      focusInput();
    }
  }
  // 依螢幕座標換算成輸入字串中的游標位置；點在格子外就放到最後
  function caretFromPoint(x, y) {
    const typed = P.input.split(" ");
    const slots = [...document.querySelectorAll("#slots .slot")];
    let best = null, bestD = Infinity;
    for (const el of slots) {
      const r = el.getBoundingClientRect();
      const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
      const d = dy * 1000 + dx; // 先比同一行，再比左右距離
      if (d < bestD) { bestD = d; best = el; }
    }
    if (!best || bestD > 40000) return P.input.length;
    const i = +best.dataset.i;
    if (i >= typed.length) return P.input.length;
    const start = typed.slice(0, i).join(" ").length + (i ? 1 : 0);
    // 量每個字母的位置，點在字母中線左邊就放在它前面
    let offset = 0;
    const range = document.createRange();
    for (const node of best.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      for (let k = 0; k < node.length; k++) {
        range.setStart(node, k); range.setEnd(node, k + 1);
        const r = range.getBoundingClientRect();
        if (x > r.left + r.width / 2) offset++;
      }
    }
    return start + Math.min(offset, typed[i].length);
  }

  function focusInput() {
    const input = document.getElementById("typing");
    if (input) { input.focus({ preventScroll: true }); const l = input.value.length; input.setSelectionRange(l, l); P.caret = l; }
  }

  function onKey(e) {
    if (e.isComposing) return;
    // 答對後 input 會被移除，若讓事件冒泡到 document，同一個 Enter 會直接跳下一句
    if (["Enter", "Tab", "Escape"].includes(e.key)) e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); act(P.status === "success" ? "next" : "check"); }
    else if (e.key === "Tab") { e.preventDefault(); act(e.shiftKey ? "slow" : "play"); }
    else if (e.key === "Escape") { e.preventDefault(); act("reveal"); }
  }
  // 答對後 input 已移除，用全域鍵盤處理
  document.addEventListener("keydown", e => {
    if (!P || !location.hash.startsWith("#/p/") || document.activeElement?.id === "typing") return;
    if (!document.getElementById("modal").hidden) return;
    if (document.getElementById("done-card")) {
      if (e.key === "Enter") { e.preventDefault(); document.getElementById("again")?.click(); }
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); act(P.status === "success" ? "next" : "check"); }
    else if (e.key === "Tab") { e.preventDefault(); act(e.shiftKey ? "slow" : "play"); }
    else if (e.key === "Escape" && P.status !== "success") { e.preventDefault(); act("reveal"); }
    else if (e.key === "Backspace" && P.mode === "tiles" && P.status !== "success" && P.placed.length) {
      e.preventDefault(); P.placed.pop(); P.tileMarks = null; renderPractice();
    }
  });

  function act(a) {
    const it = item();
    if (a === "play") { speak(it.en); focusInput(); }
    else if (a === "slow") { speak(it.en, .65); focusInput(); }
    else if (a === "reveal") {
      if (P.revealed || P.mode === "speak") return;
      if (loseLife()) return;
      P.revealed = true; renderPractice();
    }
    else if (a === "skip") { if (!P.challenge) next(); }
    else if (a === "playme") { playRecording(P.say?.url); }
    else if (a === "selfok") { P.input = it.en; succeed(it); }
    else if (a === "next") { next(); }
    else if (a === "clear") { P.placed = []; P.tileMarks = null; renderPractice(); }
    else if (a === "check") {
      if (P.mode !== "tiles") check();
      else if (P.placed.length) checkTiles();
    }
  }

  function check() {
    const it = item();
    if (!P.input.trim()) { focusInput(); return; }
    P.attempts++;
    if (isCorrect(P.input, it)) { succeed(it); return; }
    if (loseLife()) return;
    // 逐字標示對錯：用最長共同子序列對齊，多打或漏打一個字不會讓後面全部變紅
    // 先把縮寫展開（I'm → i am）再比，這樣 I am 和 I'm 會被當成一樣
    const toks = str => norm(str).trim().split(" ").filter(Boolean);
    const target = toks(it.en);
    const typed = P.input.trim().split(" ");
    const flat = [], owner = [];
    typed.forEach((w, i) => toks(w).forEach(t => { flat.push(t); owner.push(i); }));
    const keep = lcsKeep(flat, target);
    P.marks = typed.map((w, i) => ({ text: w, ok: owner.some((o, k) => o === i) && owner.every((o, k) => o !== i || keep.has(k)) }));
    P.feedback = extraBeFeedback(flat, owner, typed, it);
    if (P.attempts >= 2) P.hint = true;
    renderPractice();
    const stage = document.getElementById("stage");
    stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake");
    if (P.attempts >= 3 && !P.revealed) {
      P.revealed = true;
      renderPractice();
      toast(z("錯了三次，先看答案照著打一遍"));
    } else if (P.feedback) {
      toast(z("多了一個 be 動詞，看下面的說明"));
    } else if (flat.length !== target.length) {
      toast(z(flat.length > target.length ? "你多打了字，紅色的字可能不需要" : "你少打了字，再想想漏了什麼"));
    } else {
      toast(z(P.hint ? "看提示的首字母再試一次" : "紅色的字不對，再想想"));
    }
    focusInput();
  }

  function succeed(it) {
    P.status = "success";
    if (P.attempts <= 1 && !P.revealed) P.session.firstTry++;
    P.session.finished++;
    if (P.challenge) S.markDone(it.src.tid, P.mode, it.src.idx);
    else { S.markDone(P.tp.id, P.mode, P.idx); S.setPos(P.tp.id, P.mode, P.idx + 1); }
    renderPractice();
    document.getElementById("stage").classList.add("success");
    if (S.prefs.autoSpeak || P.mode === "dictation") speak(it.en);
  }

  // 常見錯誤：把 I'm 當成 I（I'm start work…）。拿掉某一個 be 動詞後若完全正確，就明確指出來
  const BE = new Set(["am", "is", "are", "was", "were"]);
  function extraBeFeedback(flat, owner, typed, it) {
    const answers = [it.en, ...(it.alt || [])].map(a => norm(a).trim());
    for (let k = 0; k < flat.length; k++) {
      if (!BE.has(flat[k])) continue;
      if (!answers.includes(flat.filter((_, j) => j !== k).join(" "))) continue;
      const raw = typed[owner[k]];
      const contracted = /'/.test(raw);
      const verb = flat[k + 1] || "";
      return contracted
        ? `「${raw}」= ${norm(raw).trim().replace(/^i /, "I ")}。這句已經有動詞 ${verb}，不需要 ${flat[k]}，所以不能用「${raw}」。`
        : `這句已經有動詞 ${verb}，不需要 ${flat[k]}，把它拿掉就對了。`;
    }
    return "";
  }

  // 回傳 a 中屬於 a、b 最長共同子序列的索引
  function lcsKeep(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const keep = new Set();
    for (let i = 0, j = 0; i < a.length && j < b.length;) {
      if (a[i] === b[j]) { keep.add(i); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return keep;
  }

  // 提示：每個字只留首字母，例如 I l___ i_ T_____.
  const maskHint = en => en.split(/\s+/).map(w => {
    let first = true;
    return w.replace(/[A-Za-z]/g, c => { if (first) { first = false; return c; } return "_"; });
  }).join(" ");

  function next() {
    speechSynthesis?.cancel();
    stopListening();
    if (P.idx + 1 >= P.tp.items.length) {
      if (P.challenge) { renderStageResult(true); return; }
      S.setPos(P.tp.id, P.mode, 0);
      renderDone();
      return;
    }
    if (P.status !== "success" && !P.challenge) S.setPos(P.tp.id, P.mode, P.idx + 1);
    Object.assign(P, { idx: P.idx + 1, input: "", status: "typing", attempts: 0, revealed: false, hint: false, feedback: "", marks: [] });
    if (P.mode === "tiles") resetTiles();
    if (P.mode === "speak") resetSay();
    renderPractice();
    if (P.mode === "dictation") setTimeout(() => speak(item().en), 250);
  }

  function renderDone() {
    stopTimer();
    const { lv, tp, mode, session } = P;
    const secs = Math.floor((Date.now() - session.start) / 1000);
    const acc = session.finished ? Math.round(session.firstTry / session.finished * 100) : 0;
    const nextId = allTopics[allTopics.indexOf(tp.id) + 1];
    const other = { tiles: "translate", translate: "speak", speak: "dictation", dictation: "translate" }[mode];
    app.innerHTML = `
      <section class="practice" style="${lvStyle(lv)}">
        <div class="stage done-card" id="done-card">
          <div class="big">🎉</div>
          <h2 class="zh">${ez(tp.name)} ${ez("完成！")}</h2>
          <p class="zh" style="color:var(--muted)">${ez(MODES[mode])} · ${lv.badge ? esc(lv.badge) : "Level " + lv.id}</p>
          <div class="done-grid">
            <div><b>${session.finished}</b><span class="zh">${ez("完成句數")}</span></div>
            <div><b>${acc}%</b><span class="zh">${ez("一次就對")}</span></div>
            <div><b>${fmtTime(secs)}</b><span class="zh">${ez("用時")}</span></div>
          </div>
          <div class="done-actions zh">
            <button class="btn lg" id="again">🔁 ${ez("再練一次")}</button>
            <button class="btn lg" id="other">${MODE_ICON[other]} ${ez("換" + MODES[other] + "模式")}</button>
            ${nextId ? `<button class="btn lg ghost" id="nexttopic">➡️ ${ez("下一個主題")}</button>` : ""}
            <button class="btn lg ghost" id="home">🏠 ${ez("回首頁")}</button>
          </div>
        </div>
      </section>`;
    document.getElementById("again").onclick = () => startPractice(tp.id, mode);
    document.getElementById("other").onclick = () => { location.hash = `#/p/${tp.id}/${other}`; };
    document.getElementById("home").onclick = () => { location.hash = "#/"; };
    if (nextId) document.getElementById("nexttopic").onclick = () => { location.hash = `#/p/${nextId}/${mode}`; };
  }

  // ---------- 對話練習 ----------
  let C = null; // 目前對話狀態
  function startDialog(id) {
    const dlg = DIALOGS.find(d => d.id === id);
    if (!dlg) { location.hash = "#/"; return; }
    stopTimer();
    C = { dlg, step: 0, log: [], mistakes: 0, wrong: new Set(), order: [], waiting: false, say: {}, showOpts: false, misses: 0 };
    advanceDialog();
  }
  // 把對方接下來說的話都放進對話紀錄，停在輪到你的地方
  function advanceDialog() {
    const lines = C.dlg.lines;
    const said = [];
    while (C.step < lines.length && lines[C.step].who === "them") {
      C.log.push(lines[C.step]);
      said.push(lines[C.step].en);
      C.step++;
    }
    C.wrong = new Set();
    C.waiting = false;
    C.say = { listening: false, heard: "", msg: "" };
    C.showOpts = false;
    C.misses = 0;
    C.order = C.step < lines.length ? shuffle(lines[C.step].options.map((_, i) => i)) : [];
    if (C.step >= lines.length) S.markDone("dlg-" + C.dlg.id, "dialog", 0);
    renderDialog();
    if (said.length) speak(said.join(" "));
  }
  function chooseOption(i) {
    if (C.waiting) return;
    const line = C.dlg.lines[C.step];
    const opt = line.options[i];
    if (!opt.ok) {
      if (!C.wrong.has(i)) C.mistakes++;
      C.wrong.add(i);
      renderDialog();
      toast(z("這個不太好，看看說明再選一次"));
      return;
    }
    acceptReply(i, "");
  }
  // 你的回答被接受：放進對話紀錄。用點的就念標準發音給你聽；用說的就直接讓對方接話
  function acceptReply(i, heard) {
    const line = C.dlg.lines[C.step];
    const opt = line.options[i];
    C.log.push({ who: "you", en: opt.en, zh: line.zh, heard });
    C.step++;
    C.waiting = true;
    renderDialog();
    let done = false;
    const go = () => { if (done || !C) return; done = true; advanceDialog(); };
    if (heard) { setTimeout(go, 900); return; }
    // 語音不支援或沒觸發 onend 時用時間保底
    speak(opt.en, 1, go);
    setTimeout(go, 800 + opt.en.split(/\s+/).length * 450);
  }
  // 用說的回答：把聽到的話跟三個選項比，最像哪一句就當作你說了哪一句
  const answerBySpeech = () => canListen && S.prefs.dialogMode !== "choose";
  function startDialogSay() {
    const line = C.dlg.lines[C.step];
    if (C.say.listening) { finishListening(); return; }
    speechSynthesis?.cancel();
    C.say = { listening: true, heard: "", msg: "" };
    renderDialog();
    const okI = line.options.findIndex(o => o.ok);
    listen(line.options[okI].en,
      interim => { if (!C?.say.listening) return; C.say.heard = interim; const h = document.getElementById("dlg-heard"); if (h) h.innerHTML = `${ez("聆聽中…")}<b>${esc(interim)}</b>`; },
      (heard, err) => {
        if (!C || C.dlg.lines[C.step] !== line) return;
        C.say.listening = false;
        C.say.heard = heard;
        if (!heard) { C.say.msg = z(listenError(err)); renderDialog(); return; }
        const scores = line.options.map(o => scoreSpeech(o.en, heard).score);
        const best = scores.indexOf(Math.max(...scores));
        if (scores[okI] >= 0.7 && scores[okI] >= scores[best]) { acceptReply(okI, heard); return; }
        if (best !== okI && scores[best] >= 0.7) {
          if (!C.wrong.has(best)) C.mistakes++;
          C.wrong.add(best);
          C.showOpts = true;
          C.say.msg = z(`你說的比較像「${line.options[best].en}」：${line.options[best].why || ""}`);
        } else {
          C.misses++;
          if (C.misses >= 2) C.showOpts = true;
          C.say.msg = z(`跟恰當的回答還差一些（念對 ${Math.round(scores[okI] * 100)}%）。`) + z(C.misses >= 2 ? "看下面的選項，挑一句最恰當的念出來。" : "再說一次，或按「給我提示」。");
        }
        renderDialog();
      });
  }
  function renderDialog() {
    const { dlg } = C;
    const lines = dlg.lines;
    const finished = C.step >= lines.length;
    const turn = finished ? null : lines[C.step];
    const showZh = S.prefs.dialogZh !== false;
    const idx = DIALOGS.indexOf(dlg);
    const nextDlg = DIALOGS[idx + 1];
    app.innerHTML = `
      <section class="practice dialog" style="--lc1:var(--teal-1);--lc2:var(--teal-2)">
        <div class="pbar">
          <button class="back zh" id="back">← ${ez("首頁")}</button>
          <div class="ptitle zh">💬 ${ez(dlg.title)}<small>${esc(dlg.en)}</small></div>
          <div class="spacer"></div>
          <div class="seg zh">
            <button data-accent="us" class="${S.prefs.accent !== "uk" ? "on" : ""}">🇺🇸 ${ez("美式")}</button>
            <button data-accent="uk" class="${S.prefs.accent === "uk" ? "on" : ""}">🇬🇧 ${ez("英式")}</button>
          </div>
          ${canListen ? `<div class="seg zh">
            <button data-dmode="speak" class="${answerBySpeech() ? "on" : ""}">🎤 ${ez("用說的")}</button>
            <button data-dmode="choose" class="${answerBySpeech() ? "" : "on"}">👆 ${ez("用選的")}</button>
          </div>` : ""}
          <label class="toggle zh"><input type="checkbox" id="dlg-zh" ${showZh ? "checked" : ""}>${ez("顯示中文")}</label>
        </div>
        <div class="stage chat" id="stage">
          <div class="situation zh">📍 ${ez(dlg.situation)}</div>
          <div class="chat-log">
            ${C.log.map((l, k) => l.who === "them" ? `
              <div class="bubble-row them">
                <div class="bubble them">
                  <b class="who">${esc(l.name)}</b>
                  <span class="en">${esc(l.en)}</span>
                  <button class="say" data-say="${k}" aria-label="播放">🔊</button>
                  ${showZh ? `<small class="zh">${ez(l.zh)}</small>` : ""}
                </div>
              </div>` : `
              <div class="bubble-row you">
                <div class="bubble you"><span class="en">${esc(l.en)}</span><button class="say" data-say="${k}" aria-label="播放">🔊</button>${l.heard ? `<small class="heard-small">🎤 ${esc(l.heard)}</small>` : ""}</div>
              </div>`).join("")}
          </div>
          ${turn && !C.waiting && answerBySpeech() ? `
            <div class="your-turn">
              <div class="turn-prompt zh">🗣 ${ez("輪到你，用英文說：")}${ez(turn.zh)}</div>
              <div class="mic-row"><button class="mic ${C.say.listening ? "on" : ""}" id="dlg-mic" aria-label="${ez(C.say.listening ? "停止" : "開始說")}">${C.say.listening ? "■" : "🎤"}</button></div>
              <div class="heard zh" id="dlg-heard">${C.say.listening ? ez("聆聽中…") + (C.say.heard ? `<b>${esc(C.say.heard)}</b>` : "") : C.say.heard ? `${ez("辨識到：")}<b>${esc(C.say.heard)}</b>` : ez("按 🎤 把你的回答說出來")}</div>
              ${C.say.msg ? `<div class="feedback-box zh">💡 ${esc(C.say.msg)}</div>` : ""}
              ${C.showOpts ? `
                <div class="options">
                  ${C.order.map((i, n) => {
                    const o = turn.options[i];
                    const bad = C.wrong.has(i);
                    return `<div class="opt read ${bad ? "bad" : ""}"><span class="opt-n">${n + 1}</span><span class="opt-en">${esc(o.en)}</span>
                      <button class="say" data-opt-say="${i}" aria-label="播放">🔊</button>
                      ${bad ? `<small class="why zh">✗ ${ez(o.why || "")}</small>` : ""}</div>`;
                  }).join("")}
                </div>
                <div class="hint zh">${ez("挑一句最恰當的，按 🎤 念出來。不確定怎麼念就按 🔊 聽一次。")}</div>`
              : `<div class="mic-row"><button class="tool" id="dlg-show">👀 ${ez("給我提示（顯示選項）")}</button></div>`}
            </div>` : ""}
          ${turn && !C.waiting && !answerBySpeech() ? `
            <div class="your-turn">
              <div class="turn-prompt zh">🗣 ${ez("輪到你：")}${ez(turn.zh)}</div>
              <div class="options">
                ${C.order.map((i, n) => {
                  const o = turn.options[i];
                  const bad = C.wrong.has(i);
                  return `<button class="opt ${bad ? "bad" : ""}" data-opt="${i}" ${bad ? "disabled" : ""}>
                    <span class="opt-n">${n + 1}</span><span class="opt-en">${esc(o.en)}</span>
                    ${bad ? `<small class="why zh">✗ ${ez(o.why || "")}</small>` : ""}
                  </button>`;
                }).join("")}
              </div>
              <div class="hint zh">${ez("點選項或按 1、2、3 選擇")}</div>
            </div>` : ""}
          ${finished ? `
            <div class="done-card dlg-done-card" id="done-card">
              <div class="big">🎉</div>
              <h2 class="zh">${ez("對話完成！")}</h2>
              <p class="zh" style="color:var(--muted)">${C.mistakes ? ez(`選錯 ${C.mistakes} 次，再練一次會更熟`) : ez("全部一次就選對，太厲害了！")}</p>
              <div class="done-actions zh">
                <button class="btn lg" id="again">🔁 ${ez("再練一次")}</button>
                ${nextDlg ? `<button class="btn lg" id="nextdlg">➡️ ${ez("下一個對話")}</button>` : ""}
                <button class="btn lg ghost" id="home">🏠 ${ez("回首頁")}</button>
              </div>
            </div>` : ""}
        </div>
      </section>`;
    document.getElementById("back").onclick = () => { stopListening(); location.hash = "#/"; };
    document.getElementById("dlg-zh").onchange = e => { S.prefs.dialogZh = e.target.checked; S.savePrefs(); renderDialog(); };
    app.querySelectorAll("[data-accent]").forEach(b => b.onclick = () => {
      S.prefs.accent = b.dataset.accent; S.savePrefs(); pickVoice();
      if (voiceFallback) toast(z(S.prefs.accent === "uk" ? "這台裝置沒有英式語音，會用其他英文語音代替" : "這台裝置沒有美式語音，會用其他英文語音代替"));
      renderDialog();
      const last = C.log[C.log.length - 1];
      if (last) speak(last.en);
    });
    app.querySelectorAll("[data-say]").forEach(b => b.onclick = () => speak(C.log[+b.dataset.say].en));
    app.querySelectorAll("[data-opt]").forEach(b => b.onclick = () => chooseOption(+b.dataset.opt));
    app.querySelectorAll("[data-dmode]").forEach(b => b.onclick = () => { stopListening(); S.prefs.dialogMode = b.dataset.dmode; S.savePrefs(); C.say = { listening: false, heard: "", msg: "" }; renderDialog(); });
    app.querySelectorAll("[data-opt-say]").forEach(b => b.onclick = () => speak(turn.options[+b.dataset.optSay].en));
    const dmic = document.getElementById("dlg-mic");
    if (dmic) dmic.onclick = startDialogSay;
    const dshow = document.getElementById("dlg-show");
    if (dshow) dshow.onclick = () => { C.showOpts = true; renderDialog(); };
    if (finished) {
      document.getElementById("again").onclick = () => startDialog(dlg.id);
      document.getElementById("home").onclick = () => { location.hash = "#/"; };
      if (nextDlg) document.getElementById("nextdlg").onclick = () => { location.hash = "#/d/" + nextDlg.id; };
    }
    // 對話往下長，捲到最新的地方
    requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
  }
  document.addEventListener("keydown", e => {
    if (!C || !location.hash.startsWith("#/d/") || !document.getElementById("modal").hidden) return;
    const n = +e.key;
    if (!answerBySpeech() && n >= 1 && n <= C.order.length && C.step < C.dlg.lines.length && !C.waiting) {
      const i = C.order[n - 1];
      if (!C.wrong.has(i)) { e.preventDefault(); chooseOption(i); }
    }
  });

  // ---------- 帳號 / Modal ----------
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  function openModal(html) { modalBody.innerHTML = html; modal.hidden = false; }
  function closeModal() { modal.hidden = true; focusInput(); }
  modal.addEventListener("click", e => { if (e.target === modal || e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) { e.stopPropagation(); closeModal(); } }, true);

  function openAccount() {
    if (!S.cloudEnabled) {
      openModal(`<h2 class="zh">${ez("雲端同步尚未啟用")}</h2>
        <p class="zh">${ez("目前進度儲存在這台裝置的瀏覽器。網站管理者在 js/config.js 填入 Supabase 設定後，就能用 Email 登入並跨裝置同步。")}</p>
        <button class="btn zh" data-close>${ez("知道了")}</button>`);
      return;
    }
    if (S.user) {
      openModal(`<h2 class="zh">${ez("我的帳號")}</h2>
        <p class="zh">${ez("已登入：")}<b>${esc(S.user.email)}</b><br>${ez("練習進度會自動同步到雲端。")}</p>
        <button class="btn zh" id="sync-now">☁️ ${ez("立即同步")}</button>
        <div style="height:10px"></div>
        <button class="btn ghost zh" id="logout">${ez("登出")}</button>`);
      document.getElementById("sync-now").onclick = async () => { await S.syncNow(); toast(z("已同步")); closeModal(); };
      document.getElementById("logout").onclick = async () => { await S.signOut(); toast(z("已登出")); closeModal(); };
      return;
    }
    openModal(`<h2 class="zh" id="modal-title">${ez("登入同步進度")}</h2>
      <p class="zh">${ez("輸入 Email，我們會寄一封登入連結給你，點連結就完成登入，不用密碼。")}</p>
      <form id="login-form">
        <input class="field" type="email" id="email" required placeholder="you@example.com" autocomplete="email">
        <button class="btn zh" type="submit" id="send">✉️ ${ez("寄送登入連結")}</button>
      </form>
      <p class="note zh">${ez("登入前在這台裝置的進度，登入後會自動合併到你的帳號。")}</p>`);
    const form = document.getElementById("login-form");
    document.getElementById("email").focus();
    form.onsubmit = async e => {
      e.preventDefault();
      const btn = document.getElementById("send");
      btn.disabled = true; btn.textContent = z("寄送中…");
      const { error } = await S.sendMagicLink(document.getElementById("email").value.trim());
      if (error) {
        btn.disabled = false; btn.textContent = z("重新寄送");
        toast(z("寄送失敗：") + error.message);
        return;
      }
      modalBody.innerHTML = `<h2 class="zh">📬 ${ez("請收信")}</h2>
        <p class="zh">${ez("登入連結已寄出，請到信箱點連結（可能在垃圾郵件匣）。用同一個瀏覽器開啟連結最順。")}</p>
        <button class="btn zh" data-close>${ez("好")}</button>`;
    };
  }

  const accBtn = document.getElementById("btn-account");
  function updateAccountBtn() {
    accBtn.classList.toggle("on", !!S.user);
    accBtn.textContent = S.user ? "☁️ " + (S.user.email || "").split("@")[0] : z("登入同步");
  }
  accBtn.onclick = openAccount;

  const scriptBtn = document.getElementById("btn-script");
  function updateScriptBtn() {
    scriptBtn.textContent = S.prefs.script === "cn" ? "简" : "繁";
    document.documentElement.lang = S.prefs.script === "cn" ? "zh-Hans" : "zh-Hant";
  }
  scriptBtn.onclick = () => {
    S.prefs.script = S.prefs.script === "cn" ? "tw" : "cn";
    S.savePrefs();
    updateScriptBtn(); updateAccountBtn();
    if (P && location.hash.startsWith("#/p/") && document.getElementById("done-card")) renderDone();
    else if (C && location.hash.startsWith("#/d/")) renderDialog();
    else route(true);
    toast(S.prefs.script === "cn" ? "已切换为简体中文" : "已切換為繁體中文");
  };

  // 深淺色：預設淺色，按一下切到相反的那個並記住
  const themeBtn = document.getElementById("btn-theme");
  const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => S.prefs.theme === "dark" || (S.prefs.theme !== "light" && darkMq.matches);
  function updateThemeBtn() {
    if (S.prefs.theme === "light" || S.prefs.theme === "dark") document.documentElement.dataset.theme = S.prefs.theme;
    else delete document.documentElement.dataset.theme;
    themeBtn.textContent = isDark() ? "☀️" : "🌙";
    themeBtn.title = z(isDark() ? "切換成淺色" : "切換成深色");
  }
  themeBtn.onclick = () => {
    S.prefs.theme = isDark() ? "light" : "dark";
    S.savePrefs();
    updateThemeBtn();
    focusInput();
  };
  // 舊版 Safari（14 以前）只有 addListener
  if (darkMq.addEventListener) darkMq.addEventListener("change", updateThemeBtn); else darkMq.addListener?.(updateThemeBtn);

  // ---------- 路由 ----------
  function route(keepPractice) {
    stopListening();
    const m = location.hash.match(/^#\/p\/([\w-]+)\/(tiles|translate|dictation|speak)$/);
    const d = location.hash.match(/^#\/d\/([\w-]+)$/);
    const cs = location.hash.match(/^#\/c\/(\d+)\/(\w+)$/);
    if (location.hash === "#/c") {
      P = null; C = null;
      renderStageMap();
    } else if (cs) {
      C = null;
      if (keepPractice && P?.challenge?.n === +cs[1] && P.mode === cs[2]) renderPractice();
      else startStage(+cs[1], cs[2]);
    } else if (m) {
      C = null;
      if (keepPractice && P && P.tp.id === m[1] && P.mode === m[2]) renderPractice();
      else startPractice(m[1], m[2]);
    } else if (d) {
      P = null;
      if (keepPractice && C && C.dlg.id === d[1]) renderDialog();
      else startDialog(d[1]);
    } else {
      P = null; C = null;
      speechSynthesis?.cancel();
      renderHome();
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", () => route(false));
  S.onChange(() => { if (!/^#\/[pdc]/.test(location.hash)) renderHome(); });

  updateScriptBtn();
  updateThemeBtn();
  updateAccountBtn();
  route(false);
  S.initAuth(() => {
    updateAccountBtn();
    // 從 Email 連結回來時網址會帶 token，清掉以免殘留
    if (/access_token|error_description/.test(location.hash)) history.replaceState(null, "", location.pathname);
    if (!/^#\/[pdc]/.test(location.hash)) renderHome();
  });
})();
