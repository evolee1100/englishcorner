// 進度儲存：先存 localStorage（離線可用），登入後與 Supabase 的 ec_progress 表雙向合併。
(function () {
  const KEY = "ec_state_v1";
  const PREF_KEY = "ec_prefs_v1";

  const empty = () => ({ progress: {}, daily: {}, updatedAt: 0 });
  // progress[topicId][mode] = { done: [句子索引], pos: 下次從第幾句開始 }
  // daily["2026-10-24"] = 當天答對句數

  function readJSON(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* 無痕模式等情況：只保留在記憶體 */ }
  }

  let state = Object.assign(empty(), readJSON(KEY, {}));
  const prefs = Object.assign({ script: "tw", autoSpeak: true, mode: "translate", theme: "auto" }, readJSON(PREF_KEY, {}));
  const listeners = new Set();

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  function topicMode(topicId, mode) {
    state.progress[topicId] ??= {};
    state.progress[topicId][mode] ??= { done: [], pos: 0 };
    return state.progress[topicId][mode];
  }

  function save() {
    state.updatedAt = Date.now();
    writeJSON(KEY, state);
    listeners.forEach(fn => fn());
    scheduleSync();
  }

  // 兩份進度取聯集：完成句取聯集、每日數取較大值、續練位置取較大值
  function merge(a, b) {
    const out = empty();
    for (const src of [a, b]) {
      for (const [tid, modes] of Object.entries(src.progress || {})) {
        for (const [mode, v] of Object.entries(modes)) {
          out.progress[tid] ??= {};
          const cur = out.progress[tid][mode] ??= { done: [], pos: 0 };
          cur.done = [...new Set([...cur.done, ...(v.done || [])])].sort((x, y) => x - y);
          cur.pos = Math.max(cur.pos, v.pos || 0);
        }
      }
      for (const [d, n] of Object.entries(src.daily || {})) out.daily[d] = Math.max(out.daily[d] || 0, n);
    }
    out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return out;
  }

  // ---------- Supabase ----------
  const cfg = window.EC_CONFIG || {};
  const sb = (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase)
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
    : null;
  let user = null;
  let syncTimer = null;
  let syncing = false;

  function scheduleSync() {
    if (!sb || !user) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(push, 1500);
  }

  async function push() {
    if (!sb || !user || syncing) return;
    syncing = true;
    const { error } = await sb.from("ec_progress").upsert({ user_id: user.id, data: state, updated_at: new Date().toISOString() });
    syncing = false;
    if (error) console.warn("[sync] push failed", error.message);
  }

  async function pullAndMerge() {
    if (!sb || !user) return;
    const { data, error } = await sb.from("ec_progress").select("data").eq("user_id", user.id).maybeSingle();
    if (error) { console.warn("[sync] pull failed", error.message); return; }
    state = merge(state, data?.data || empty());
    writeJSON(KEY, state);
    listeners.forEach(fn => fn());
    await push();
  }

  async function initAuth(onChange) {
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    user = data.session?.user || null;
    if (user) await pullAndMerge();
    onChange(user);
    sb.auth.onAuthStateChange((_evt, session) => {
      const next = session?.user || null;
      const changed = next?.id !== user?.id;
      user = next;
      if (changed && user) pullAndMerge();
      onChange(user);
    });
  }

  window.Store = {
    get state() { return state; },
    prefs,
    savePrefs() { writeJSON(PREF_KEY, prefs); },
    onChange(fn) { listeners.add(fn); },
    today,

    getTopic(topicId, mode) { return topicMode(topicId, mode); },
    doneCount(topicId) {
      // 主題完成數：兩種模式任一完成都算
      const p = state.progress[topicId] || {};
      const s = new Set([...(p.translate?.done || []), ...(p.dictation?.done || [])]);
      return s.size;
    },
    markDone(topicId, mode, index) {
      const t = topicMode(topicId, mode);
      if (!t.done.includes(index)) t.done.push(index);
      const d = today();
      state.daily[d] = (state.daily[d] || 0) + 1;
      save();
    },
    setPos(topicId, mode, pos) { topicMode(topicId, mode).pos = pos; save(); },
    resetTopic(topicId, mode) { state.progress[topicId] && delete state.progress[topicId][mode]; save(); },

    stats() {
      const totalDone = Object.keys(state.progress).reduce((n, tid) => n + this.doneCount(tid), 0);
      let streak = 0;
      const d = new Date();
      // 今天還沒練不打斷連續紀錄，從昨天開始算
      if (!state.daily[today()]) d.setDate(d.getDate() - 1);
      for (;;) {
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (!state.daily[k]) break;
        streak++; d.setDate(d.getDate() - 1);
      }
      return { today: state.daily[today()] || 0, streak, totalDone };
    },

    // 帳號
    cloudEnabled: !!sb,
    get user() { return user; },
    initAuth,
    async sendMagicLink(email) {
      const redirect = location.origin + location.pathname;
      return sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
    },
    async signOut() { await push(); await sb.auth.signOut(); },
    syncNow: push
  };
})();
