(function () {
  const LEVELS = window.LEVELS;
  const S = window.Store;
  const app = document.getElementById("app");
  const COLORS = {
    coral: ["var(--coral-1)", "var(--coral-2)"],
    amber: ["var(--amber-1)", "var(--amber-2)"],
    green: ["var(--green-1)", "var(--green-2)"],
    blue: ["var(--blue-1)", "var(--blue-2)"],
    purple: ["var(--purple-1)", "var(--purple-2)"]
  };
  const MODES = { translate: "中翻英", dictation: "聽寫" };
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
  let voice = null;
  function pickVoice() {
    const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
    const prefer = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Alex", "Karen", "Daniel"];
    voice = prefer.map(n => vs.find(v => v.name.includes(n))).find(Boolean)
      || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, rate = 1, onEnd) {
    if (!("speechSynthesis" in window)) { toast(z("這個瀏覽器不支援發音")); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang || "en-US";
    if (voice) u.voice = voice;
    u.rate = rate;
    if (onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
  }

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
        <p class="zh">${ez("看中文、打出英文，打對就念給你聽。也可以切換聽寫，只聽聲音打出來。")}</p>
      </section>
      <section class="stats">
        <div class="stat" ><div class="n">${st.today}</div><div class="l zh">${ez("今日練習句數")}</div></div>
        <div class="stat" ><div class="n">${st.streak} 🔥</div><div class="l zh">${ez("連續天數")}</div></div>
        <div class="stat" ><div class="n">${st.totalDone}</div><div class="l zh">${ez("已掌握句子")}</div></div>
      </section>
      <section class="levels">
        ${LEVELS.map(lv => {
          const total = lv.topics.reduce((n, t) => n + t.items.length, 0);
          const done = lv.topics.reduce((n, t) => n + S.doneCount(t.id), 0);
          return `
          <article class="level" style="${lvStyle(lv)}">
            <div class="level-head">
              <div class="level-badge">LEVEL<b>${lv.id}</b></div>
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
                    <button class="btn zh" data-go="${tp.id}/translate">⌨️ ${ez("中翻英")}</button>
                    <button class="btn ghost zh" data-go="${tp.id}/dictation">🎧 ${ez("聽寫")}</button>
                  </div>
                </div>`;
              }).join("")}
            </div>
          </article>`;
        }).join("")}
      </section>
      <p class="foot">English Corner v${esc(window.EC_CONFIG?.version || "")} · ${ez(S.cloudEnabled ? (S.user ? "進度已同步到雲端" : "登入後可跨裝置同步進度") : "進度儲存在這台裝置")}</p>`;
    app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { location.hash = "#/p/" + b.dataset.go; });
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
      input: "", status: "typing", attempts: 0, revealed: false, marks: [],
      session: { firstTry: 0, finished: 0, start: Date.now() }
    };
    stopTimer();
    timer = setInterval(() => {
      const el = document.getElementById("clock");
      if (el) el.textContent = fmtTime(Math.floor((Date.now() - P.session.start) / 1000));
    }, 1000);
    renderPractice();
    if (mode === "dictation") setTimeout(() => speak(item().en), 350);
  }
  const item = () => P.tp.items[P.idx];

  function renderPractice() {
    const { lv, tp, mode } = P;
    const it = item();
    const dict = mode === "dictation";
    const doneSet = new Set(S.getTopic(tp.id, mode).done);
    app.innerHTML = `
      <section class="practice" style="${lvStyle(lv)}">
        <div class="pbar">
          <button class="back zh" id="back">← ${ez("首頁")}</button>
          <div class="ptitle zh">L${lv.id} · ${ez(tp.name)}<small>${esc(tp.en)}</small></div>
          <div class="spacer"></div>
          <span class="pill">${P.idx + 1}/${tp.items.length}</span>
          <span class="pill">⏱ <span id="clock">${fmtTime(Math.floor((Date.now() - P.session.start) / 1000))}</span></span>
          <div class="seg zh">
            ${Object.entries(MODES).map(([k, v]) => `<button data-mode="${k}" class="${k === mode ? "on" : ""}">${ez(v)}</button>`).join("")}
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
                 <div class="prompt-sub zh">${ez(dict ? "聽寫完成" : "請用英文打出來")}</div>`}
            <div class="slots" id="slots"></div>
            ${P.status !== "success" ? `<input class="typing-input" id="typing" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="輸入英文">` : ""}
          </div>
          ${P.revealed && P.status !== "success" ? `<div class="answer-reveal"><small class="zh">${ez("參考答案（照著打一遍）")}</small>${esc(it.en)}</div>` : ""}
          ${P.status === "success" ? renderResult(it) : ""}
          <div class="tools zh">
            <button class="tool" data-act="play">🔊 ${ez("發音")} <kbd>Tab</kbd></button>
            <button class="tool" data-act="slow">🐢 ${ez("慢速")} <kbd>⇧Tab</kbd></button>
            ${P.status === "success"
              ? `<button class="tool" data-act="next">➡️ ${ez("下一句")} <kbd>Enter</kbd></button>`
              : `<button class="tool" data-act="reveal">👀 ${ez("看答案")} <kbd>Esc</kbd></button>
                 <button class="tool" data-act="skip">⏭ ${ez("略過")}</button>`}
          </div>
          <div class="hint zh">${ez("單字之間按空白鍵，打完按 Enter 檢查。大小寫、標點、縮寫（I'm / I am）都不影響對錯。")}</div>
        </div>
      </section>`;
    bindPractice();
    renderSlots();
  }

  function renderResult(it) {
    const typedOther = P.input.trim() && norm(P.input) !== norm(it.en);
    return `
      <div class="result">
        <div class="praise zh">✨ ${ez(PRAISE[Math.floor(Math.random() * PRAISE.length)])}</div>
        <div class="en-words">${it.en.split(/\s+/).map(w => `<button data-word="${esc(core(w))}">${esc(w)}</button>`).join("")}</div>
        ${typedOther ? `<div class="std zh">${ez("你的說法也對！標準答案：")}<b>${esc(it.en)}</b></div>` : ""}
        ${(it.alt || []).length ? `<div class="std zh">${ez("其他說法：")}${it.alt.map(esc).join(" ／ ")}</div>` : ""}
      </div>`;
  }

  function renderSlots() {
    const box = document.getElementById("slots");
    if (!box) return;
    if (P.status === "success") { box.innerHTML = ""; return; }
    const target = targetTokens(item().en);
    const typed = P.input.split(" ");
    const active = typed.length - 1;
    const n = Math.max(target.length, typed.length);
    let html = "";
    for (let i = 0; i < n; i++) {
      const t = target[i];
      const w = typed[i] ?? "";
      const cls = ["slot"];
      if (!t) cls.push("extra");
      if (i === active && document.activeElement?.id === "typing") cls.push("active");
      if (w) cls.push("filled");
      const m = P.marks[i];
      if (m && m.text === w && w) cls.push(m.ok ? "right" : "wrong");
      const len = t ? t.core.length : Math.max(w.length, 1);
      const punct = t?.trail && !/[^A-Za-z0-9']$/.test(w) ? `<span class="punct">${esc(t.trail)}</span>` : "";
      html += `<span class="wgroup"><span class="${cls.join(" ")}" style="--len:${len}">${esc(w)}</span>${punct}</span>`;
    }
    box.innerHTML = html;
  }

  function bindPractice() {
    document.getElementById("back").onclick = () => { location.hash = "#/"; };
    app.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => {
      if (b.dataset.mode !== P.mode) location.hash = `#/p/${P.tp.id}/${b.dataset.mode}`;
    });
    document.getElementById("auto").onchange = e => { S.prefs.autoSpeak = e.target.checked; S.savePrefs(); };
    app.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act(b.dataset.act));
    app.querySelectorAll("[data-word]").forEach(b => b.onclick = () => {
      b.classList.add("speaking");
      speak(b.dataset.word, .85, () => b.classList.remove("speaking"));
    });
    const big = document.getElementById("listen-big");
    if (big) big.onclick = e => { e.stopPropagation(); speak(item().en); focusInput(); };

    const stage = document.getElementById("stage");
    const input = document.getElementById("typing");
    if (input) {
      input.value = P.input;
      input.oninput = () => {
        // 連續空白壓成一個、不允許開頭空白
        const v = input.value.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
        if (v !== input.value) input.value = v;
        P.input = v;
        renderSlots();
      };
      input.onkeydown = onKey;
      // 畫面上看不到游標位置，所以游標永遠固定在最後
      const toEnd = () => { const l = input.value.length; if (input.selectionStart !== l || input.selectionEnd !== l) input.setSelectionRange(l, l); };
      input.onclick = input.onselect = input.onkeyup = toEnd;
      input.onfocus = () => { stage.classList.add("focus"); renderSlots(); };
      input.onblur = () => { stage.classList.remove("focus"); renderSlots(); };
      focusInput();
    }
  }
  function focusInput() {
    const input = document.getElementById("typing");
    if (input) { input.focus({ preventScroll: true }); const l = input.value.length; input.setSelectionRange(l, l); }
  }

  function onKey(e) {
    if (e.isComposing) return;
    // 答對後 input 會被移除，若讓事件冒泡到 document，同一個 Enter 會直接跳下一句
    if (["Enter", "Tab", "Escape"].includes(e.key)) e.stopPropagation();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) { e.preventDefault(); return; }
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
  });

  function act(a) {
    const it = item();
    if (a === "play") { speak(it.en); focusInput(); }
    else if (a === "slow") { speak(it.en, .65); focusInput(); }
    else if (a === "reveal") { P.revealed = true; renderPractice(); }
    else if (a === "skip") { next(); }
    else if (a === "next") { next(); }
    else if (a === "check") check();
  }

  function check() {
    const it = item();
    if (!P.input.trim()) { focusInput(); return; }
    P.attempts++;
    if (isCorrect(P.input, it)) {
      P.status = "success";
      if (P.attempts === 1 && !P.revealed) P.session.firstTry++;
      P.session.finished++;
      S.markDone(P.tp.id, P.mode, P.idx);
      S.setPos(P.tp.id, P.mode, P.idx + 1);
      renderPractice();
      document.getElementById("stage").classList.add("success");
      if (S.prefs.autoSpeak || P.mode === "dictation") speak(it.en);
      return;
    }
    // 逐字標示對錯
    const target = targetTokens(it.en);
    P.marks = P.input.split(" ").map((w, i) => ({ text: w, ok: !!target[i] && wordKey(w) === wordKey(target[i].core) }));
    renderSlots();
    const stage = document.getElementById("stage");
    stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake");
    if (P.attempts >= 3 && !P.revealed) {
      P.revealed = true;
      renderPractice();
      toast(z("錯了三次，先看答案照著打一遍"));
    } else {
      toast(z("紅色的字再檢查一下"));
    }
    focusInput();
  }

  function next() {
    speechSynthesis?.cancel();
    if (P.idx + 1 >= P.tp.items.length) {
      S.setPos(P.tp.id, P.mode, 0);
      renderDone();
      return;
    }
    if (P.status !== "success") S.setPos(P.tp.id, P.mode, P.idx + 1);
    Object.assign(P, { idx: P.idx + 1, input: "", status: "typing", attempts: 0, revealed: false, marks: [] });
    renderPractice();
    if (P.mode === "dictation") setTimeout(() => speak(item().en), 250);
  }

  function renderDone() {
    stopTimer();
    const { lv, tp, mode, session } = P;
    const secs = Math.floor((Date.now() - session.start) / 1000);
    const acc = session.finished ? Math.round(session.firstTry / session.finished * 100) : 0;
    const nextId = allTopics[allTopics.indexOf(tp.id) + 1];
    const other = mode === "translate" ? "dictation" : "translate";
    app.innerHTML = `
      <section class="practice" style="${lvStyle(lv)}">
        <div class="stage done-card" id="done-card">
          <div class="big">🎉</div>
          <h2 class="zh">${ez(tp.name)} ${ez("完成！")}</h2>
          <p class="zh" style="color:var(--muted)">${ez(MODES[mode])} · Level ${lv.id}</p>
          <div class="done-grid">
            <div><b>${session.finished}</b><span class="zh">${ez("完成句數")}</span></div>
            <div><b>${acc}%</b><span class="zh">${ez("一次就對")}</span></div>
            <div><b>${fmtTime(secs)}</b><span class="zh">${ez("用時")}</span></div>
          </div>
          <div class="done-actions zh">
            <button class="btn lg" id="again">🔁 ${ez("再練一次")}</button>
            <button class="btn lg" id="other">${other === "dictation" ? "🎧" : "⌨️"} ${ez("換" + MODES[other] + "模式")}</button>
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
    else route(true);
    toast(S.prefs.script === "cn" ? "已切换为简体中文" : "已切換為繁體中文");
  };

  // 深淺色：預設跟系統，按一下切到相反的那個並記住
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
  darkMq.addEventListener("change", updateThemeBtn);

  // ---------- 路由 ----------
  function route(keepPractice) {
    const m = location.hash.match(/^#\/p\/([\w-]+)\/(translate|dictation)$/);
    if (m) {
      if (keepPractice && P && P.tp.id === m[1] && P.mode === m[2]) renderPractice();
      else startPractice(m[1], m[2]);
    } else {
      P = null;
      renderHome();
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", () => route(false));
  S.onChange(() => { if (!location.hash.startsWith("#/p/")) renderHome(); });

  updateScriptBtn();
  updateThemeBtn();
  updateAccountBtn();
  route(false);
  S.initAuth(() => {
    updateAccountBtn();
    // 從 Email 連結回來時網址會帶 token，清掉以免殘留
    if (/access_token|error_description/.test(location.hash)) history.replaceState(null, "", location.pathname);
    if (!location.hash.startsWith("#/p/")) renderHome();
  });
})();
