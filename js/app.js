/* AILab — application shell, routing, lesson engine and labs */
(function () {
  "use strict";

  const R = window.AIRender;
  const DATA = window.AILAB;
  const TRACKS = DATA.tracks;
  const MODULES = DATA.modules;
  const LESSONS = DATA.lessons;
  const PRACTICE = DATA.practice;
  const CHEATS = DATA.cheatsheets;

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const esc = R.esc;
  const pad = R.pad;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const normalize = (text) => String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

  const ICON = {
    play: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5 15 10l-8 5.5z" fill="currentColor" stroke="none"/></svg>`,
    pause: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11M13 4.5v11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    replay: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4.5 3.7V7H8"/></svg>`,
    prev: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6"/></svg>`,
    next: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4 6 6-6 6"/></svg>`,
    arrow: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>`,
    full: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3H3v4M13 3h4v4M7 17H3v-4M13 17h4v-4"/></svg>`,
    check: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10.5 4 4 8-9"/></svg>`,
    bulb: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9ZM8 16.5h4"/></svg>`,
    copy: `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="2"/><path d="M13 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1"/></svg>`,
    code: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 6-4 4 4 4M13 6l4 4-4 4M11.5 3.5l-3 13"/></svg>`,
    memory: `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="4" width="12" height="12" rx="3"/><path d="M7 2.5v3M11 2.5v3M14.5 7h3M14.5 11h3M7 17.5v-3M11 17.5v-3M2.5 7h3M2.5 11h3"/></svg>`,
    practice: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.7l5.4-.8z"/></svg>`,
    book: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h5.5A2.5 2.5 0 0 1 11 7v9a2.5 2.5 0 0 0-2.5-2H3zM17 4.5h-3.5A2.5 2.5 0 0 0 11 7v9a2.5 2.5 0 0 1 2.5-2H17z"/></svg>`,
    lab: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 2v5.2L3.4 15a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L12 7.2V2M6 2h8M6.5 11h7"/></svg>`,
    tree: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="4" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="15" cy="15" r="2"/><path d="M9 5.7 6 13M11 5.7l3 7.3"/></svg>`,
    cube: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.6 17 6.5v7L10 17.4 3 13.5v-7L10 2.6Z"/><path d="M10 10.1 17 6.5M10 10.1v7.3M10 10.1 3 6.5"/></svg>`,
    close: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16"/></svg>`
  };
  const icon = (name, cls) => `<span class="ui-icon${cls ? " " + cls : ""}">${ICON[name] || ""}</span>`;

  const trackById = {};
  TRACKS.forEach((t) => { trackById[t.id] = t; });
  const moduleById = {};
  MODULES.forEach((m) => { moduleById[m.id] = m; });

  const lessonOrder = [];
  TRACKS.forEach((track) => {
    track.modules.forEach((moduleId) => {
      const mod = moduleById[moduleId];
      if (!mod) return;
      mod.lessons.forEach((id) => {
        if (LESSONS[id]) lessonOrder.push(id);
      });
    });
  });
  const lessonPos = {};
  lessonOrder.forEach((id, index) => { lessonPos[id] = index; });

  const state = {
    track: "ai",
    route: { name: "home" },
    lesson: { id: null, step: 1, playing: false, speed: 1, timer: null },
    practice: { id: null, answered: null },
    search: { open: false, selected: 0, results: [] }
  };

  const PROGRESS_KEY = "ailab-progress-v1";
  const THEME_KEY = "ailab-theme";
  const SPEED_KEY = "ailab-speed";
  let progress = loadProgress();

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return {
        visited: raw.visited && typeof raw.visited === "object" ? raw.visited : {},
        completed: raw.completed && typeof raw.completed === "object" ? raw.completed : {},
        practice: raw.practice && typeof raw.practice === "object" ? raw.practice : {},
        track: raw.track === "ml" ? "ml" : "ai"
      };
    } catch (err) {
      return { visited: {}, completed: {}, practice: {}, track: "ai" };
    }
  }
  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (err) { /* storage may be unavailable */ }
  }
  function isDone(id) {
    const lesson = LESSONS[id];
    if (!lesson) return false;
    return Boolean(progress.completed[id]) || Number(progress.visited[id] || 0) >= lesson.steps.length;
  }
  function trackLessons(trackId) {
    const track = trackById[trackId];
    if (!track) return [];
    return track.modules.flatMap((moduleId) => {
      const mod = moduleById[moduleId];
      return mod ? mod.lessons.map((id) => LESSONS[id]).filter(Boolean) : [];
    });
  }
  function trackDone(trackId) {
    return trackLessons(trackId).filter((lesson) => isDone(lesson.id)).length;
  }
  function totalDone() {
    return Object.keys(LESSONS).filter(isDone).length;
  }
  function totalSteps() {
    return Object.values(LESSONS).reduce((sum, lesson) => sum + (lesson.steps ? lesson.steps.length : 0), 0);
  }
  function lessonNumber(id) {
    const lesson = LESSONS[id];
    if (!lesson) return 0;
    return trackLessons(lesson.track).findIndex((item) => item.id === id) + 1;
  }
  function nextLessonOf(id) {
    const lesson = LESSONS[id];
    if (!lesson) return null;
    const list = trackLessons(lesson.track);
    return list[list.findIndex((item) => item.id === id) + 1] || null;
  }
  function firstLessonOf(trackId) {
    return trackLessons(trackId)[0] || null;
  }
  function practiceForLesson(lesson) {
    if (!lesson) return null;
    if (lesson.practiceId) return PRACTICE.find((item) => item.id === lesson.practiceId) || null;
    return PRACTICE.find((item) => item.lesson === lesson.id) || null;
  }

  function markVisited(id, step) {
    const lesson = LESSONS[id];
    if (!lesson) return;
    const current = Number(progress.visited[id] || 0);
    if (step > current) progress.visited[id] = step;
    if (step >= lesson.steps.length) progress.completed[id] = true;
    saveProgress();
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (err) { /* ignore */ }
    document.body.dataset.theme = saved === "dark" ? "dark" : "light";
  }
  function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
  }
  function initSpeed() {
    try {
      const saved = Number(localStorage.getItem(SPEED_KEY));
      if ([1, 1.5, 2].includes(saved)) state.lesson.speed = saved;
    } catch (err) { /* ignore */ }
  }
  function saveSpeed() {
    try { localStorage.setItem(SPEED_KEY, String(state.lesson.speed)); } catch (err) { /* ignore */ }
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("is-on"), 1800);
  }

  function updateChrome() {
    const done = totalDone();
    const total = Object.keys(LESSONS).length || DATA.meta.totalLessons;
    const p = total ? done / total : 0;
    const ring = $("#ringFill");
    if (ring) ring.style.strokeDashoffset = String(91.1 * (1 - p));
    const text = $("#globalProgressText");
    if (text) text.textContent = `${done}/${total}`;
    const track = trackById[state.track];
    if (track) {
      const trackList = trackLessons(track.id);
      const trackCount = trackDone(track.id);
      const fill = $("#sidebarProgressFill");
      if (fill) fill.style.width = `${trackList.length ? trackCount / trackList.length * 100 : 0}%`;
      const st = $("#sidebarProgressText");
      if (st) st.textContent = `${trackCount}/${trackList.length} bài`;
      const title = $("#sidebarTitle");
      if (title) title.textContent = track.short;
    }
    $$(".track-switch [data-track]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.track === state.track);
      button.setAttribute("aria-pressed", button.dataset.track === state.track ? "true" : "false");
    });
    const learnLink = $('.mode-link[data-mode="learn"]');
    const firstLesson = firstLessonOf(state.track);
    if (learnLink && firstLesson) learnLink.setAttribute("href", `#/learn/${firstLesson.id}/1`);
  }

  function renderSidebar() {
    const track = trackById[state.track];
    if (!track) return;
    const nav = $("#sidebarNav");
    if (!nav) return;
    nav.innerHTML = track.modules.map((moduleId) => {
      const mod = moduleById[moduleId];
      if (!mod) return "";
      const lessons = mod.lessons.map((id) => LESSONS[id]).filter(Boolean);
      return `<div class="side-module">
        <div class="side-module-head">
          <span class="side-module-num">${esc(mod.num)}</span>
          <span>${esc(mod.title)}</span>
        </div>
        ${lessons.map((lesson) => {
          const active = state.lesson.id === lesson.id;
          const done = isDone(lesson.id);
          return `<a class="side-lesson${active ? " is-active" : ""}${done ? " is-done" : ""}" href="#/learn/${lesson.id}/1">
            <span class="side-lesson-num">${done ? "✓" : pad(lessonNumber(lesson.id))}</span>
            <span class="side-lesson-body">
              <span class="side-lesson-title">${esc(lesson.shortTitle || lesson.title)}</span>
              <span class="side-lesson-meta">${lesson.steps.length} bước · ${esc(lesson.duration || "10 phút")}</span>
            </span>
          </a>`;
        }).join("")}
      </div>`;
    }).join("");
    updateChrome();
  }

  function syncSidebarActive() {
    $$("#sidebarNav .side-lesson").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const id = href.split("/")[2];
      a.classList.toggle("is-active", id === state.lesson.id);
      a.classList.toggle("is-done", isDone(id));
      const num = $(".side-lesson-num", a);
      if (num) num.textContent = isDone(id) ? "✓" : pad(lessonNumber(id));
    });
    updateChrome();
  }

  function openSidebar() {
    const sidebar = $("#sidebar");
    const scrim = $("#sidebarScrim");
    if (sidebar) sidebar.classList.add("is-open");
    if (scrim) scrim.hidden = false;
    document.body.classList.add("has-sidebar");
  }
  function closeSidebar() {
    const sidebar = $("#sidebar");
    const scrim = $("#sidebarScrim");
    if (sidebar) sidebar.classList.remove("is-open");
    if (scrim) scrim.hidden = true;
    document.body.classList.remove("has-sidebar");
  }

  function selectTrack(id, opts) {
    if (!trackById[id]) return;
    state.track = id;
    progress.track = id;
    saveProgress();
    renderSidebar();
    updateChrome();
    if (opts && opts.goHome) {
      if (location.hash !== "#/") {
        location.hash = "#/";
      } else {
        renderHome();
        requestAnimationFrame(() => {
          const target = $("#trackPath");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { name: "home" };
    if (parts[0] === "learn" && parts[1]) return { name: "lesson", id: parts[1], step: Number(parts[2]) || 1 };
    if (parts[0] === "practice" && parts[1]) return { name: "practice-detail", id: parts[1] };
    if (parts[0] === "practice") return { name: "practice" };
    if (parts[0] === "cheatsheets") return { name: "cheatsheets" };
    if (parts[0] === "lab") return { name: "lab" };
    return { name: "home" };
  }

  function navigate(hash) {
    if (location.hash === hash) {
      onRoute();
      return;
    }
    location.hash = hash;
  }

  function onRoute() {
    const route = parseRoute();
    state.route = route;
    closeSidebar();
    setModeNav(route.name);
    if (route.name === "lesson") {
      const lesson = LESSONS[route.id];
      if (!lesson) {
        renderMissing();
        return;
      }
      if (state.track !== lesson.track) {
        state.track = lesson.track;
        progress.track = lesson.track;
        saveProgress();
        renderSidebar();
      }
      document.body.dataset.view = "lesson";
      if (state.lesson.id === lesson.id && $("#stageCard")) {
        applyStep(lesson, route.step, { updateHash: false, initial: false });
      } else {
        renderLesson(lesson, route.step);
      }
      updateChrome();
      return;
    }
    stopPlayer();
    document.body.dataset.view = route.name;
    if (route.name === "practice") renderPracticeList();
    else if (route.name === "practice-detail") renderPracticeDetail(route.id);
    else if (route.name === "cheatsheets") renderCheatsheets();
    else if (route.name === "lab") { location.replace("#/"); return; }
    else renderHome();
    updateChrome();
  }

  function setModeNav(name) {
    const mode = name === "lesson" ? "learn" : name === "practice-detail" ? "practice" : name;
    $$(".mode-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.mode === mode);
    });
  }

  function renderMissing() {
    view.innerHTML = `<div class="home"><div class="missing-box">
      <div class="eyebrow">KHÔNG TÌM THẤY</div>
      <h1>Bài học này chưa tồn tại</h1>
      <p>Đường dẫn có thể đã cũ. Quay về lộ trình để chọn bài khác.</p>
      <a class="btn btn-primary" href="#/">Về lộ trình</a>
    </div></div>`;
  }

  const view = $("#view");

  /* ----------------------------------------------------------
     Home
     ---------------------------------------------------------- */
  function renderHome() {
    document.title = "AILab — Trí tuệ nhân tạo nhìn thấy từng bước";
    document.body.dataset.view = "home";
    const track = trackById[state.track] || TRACKS[0];
    const first = firstLessonOf(track.id);
    const totalPractice = PRACTICE.length || 14;
    const steps = totalSteps();
    view.innerHTML = `<div class="home">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">PHÒNG LAB TRÍ TUỆ NHÂN TẠO</div>
          <h1>Trí tuệ<br><span class="hl">nhân tạo</span><br>nhìn thấy từng bước.</h1>
          <p class="hero-sub">Không chỉ nghe định nghĩa. Mỗi bài là một <strong>quá trình suy luận được chạy chậm lại</strong>: biên giới tìm kiếm mở rộng, cây trò chơi lan giá trị, niềm tin cập nhật theo bằng chứng và trọng số mạng nơ-ron đổi sau mỗi lần đo lỗi.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-action="start-track" data-track="${track.id}">${first ? `Bắt đầu ${esc(track.short)}` : "Xem lộ trình"} ${icon("arrow")}</button>
            <a class="btn btn-ghost" href="#/practice">${icon("practice")} Thử một tình huống</a>
          </div>
          <div class="hero-note">${icon("check")} Mô phỏng chạy trong trình duyệt. Tiến độ lưu trên máy bạn.</div>
          <div class="hero-stats">
            <div class="hero-stat"><b>14</b><span>bài học</span></div>
            <div class="hero-stat"><b>${steps}+</b><span>bước mô phỏng</span></div>
            <div class="hero-stat"><b>${totalPractice}</b><span>tình huống</span></div>
            <div class="hero-stat"><b>2</b><span>lộ trình</span></div>
          </div>
        </div>
        <div class="hero-visual cp-hero">
          <div class="hv-bar">
            <span class="hv-dot"></span><span class="hv-dot"></span><span class="hv-dot"></span>
            <span class="hv-url">astar.py</span>
            <span class="hv-live"><span class="dot"></span> SUY LUẬN</span>
          </div>
          <div class="cp-hero-code">${R.codeHTML(`frontier = [(0, S)]
while frontier:
    f, u = pop_min(frontier)
    if u == G:
        return u
    for v, w in edges(u):
        push(v, g(u) + w + h(v))`, 3, [], { compact: true })}</div>
          <div class="cp-hero-mem">
            <div class="cp-hero-mem-head"><span>FRONTIER</span><span class="dot"></span></div>
            <div class="cp-hero-var"><span>B</span><b>f = 7</b><small>g 2 + h 5</small></div>
            <div class="cp-hero-var is-hot"><span>D</span><b>f = 7</b><small>g 4 + h 3</small></div>
            <div class="cp-hero-var"><span>A</span><b>f = 8</b><small>g 1 + h 7</small></div>
          </div>
          <div class="hv-chip hv-chip-a"><b>f = g + h</b><span>ưu tiên của A*</span></div>
          <div class="hv-chip hv-chip-b"><b>S → B → D → G</b><span>tuyến chi phí 7</span></div>
          <div class="hv-chip hv-chip-c"><b>4 nút</b><span>mở rộng thay vì 6</span></div>
        </div>
      </section>

      <section class="section track-section">
        <div class="section-head">
          <div>
            <div class="eyebrow">HAI LỘ TRÌNH, MỘT CÁCH NHÌN</div>
            <h2>Từ tác tử tìm đường đến mô hình ngôn ngữ</h2>
            <p>Chọn lộ trình để mở danh sách bài. Cả hai dùng chung sân khấu từng bước, tình huống luyện tập và cheatsheet.</p>
          </div>
        </div>
        <div class="track-cards">
          ${TRACKS.map((t) => {
            const list = trackLessons(t.id);
            const done = trackDone(t.id);
            return `<button class="track-card tone-${t.tone}${t.id === state.track ? " is-active" : ""}" type="button" data-action="select-track" data-track="${t.id}">
              <span class="track-card-kicker">${esc(t.kicker)}</span>
              <strong>${esc(t.name)}</strong>
              <span class="track-card-blurb">${esc(t.blurb)}</span>
              <span class="track-card-foot"><span>${list.length} bài · ${done} đã học</span><span class="track-card-cta">Mở lộ trình ${icon("arrow")}</span></span>
            </button>`;
          }).join("")}
        </div>
      </section>

      <section class="section" id="trackPath">
        <div class="section-head">
          <div>
            <div class="eyebrow">${esc(track.kicker)} · ${esc(track.short)}</div>
            <h2>${esc(track.name)}</h2>
            <p>${esc(track.outcome)}</p>
          </div>
          <a class="section-link" href="#/practice">Luyện tập ${icon("arrow")}</a>
        </div>
        <div class="outline-grid">
          ${track.modules.map((moduleId) => outlineModuleHTML(moduleById[moduleId])).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">BA CÁCH HỌC</div>
            <h2>Đọc ít hơn, nhìn quá trình nhiều hơn</h2>
          </div>
        </div>
        <div class="mode-grid">
          <a class="mode-card" href="${first ? `#/learn/${first.id}/1` : "#/"}" style="--mc:var(--blue);--mc-soft:var(--blue-soft)"><span class="mode-icon">${icon("tree")}</span><h3>Sân khấu từng bước</h3><p>Đồ thị, cây trò chơi và bảng số cập nhật theo từng bước suy luận.</p><span class="mode-arrow">Vào bài học ${icon("arrow")}</span></a>
          <a class="mode-card" href="#/practice" style="--mc:var(--coral);--mc-soft:var(--coral-soft)"><span class="mode-icon">${icon("practice")}</span><h3>Luyện tập</h3><p>Tình huống thật: chọn thuật toán, đọc kết quả, phát hiện thiên lệch.</p><span class="mode-arrow">Bắt đầu luyện ${icon("arrow")}</span></a>
          <a class="mode-card" href="#/cheatsheets" style="--mc:var(--green);--mc-soft:var(--green-soft)"><span class="mode-icon">${icon("book")}</span><h3>Cheatsheets</h3><p>Tìm kiếm, trò chơi, xác suất, học máy và LLM trong một trang.</p><span class="mode-arrow">Tra nhanh ${icon("arrow")}</span></a>
        </div>
      </section>

      <section class="lab-promo">
        <div>
          <div class="eyebrow">CÁCH AILAB DẠY</div>
          <h2>Mỗi khái niệm đi kèm<br>một quyết định cụ thể.</h2>
          <p>Không dừng ở công thức: mỗi bài cho thấy dữ liệu vào, lựa chọn ở từng bước và vì sao phương án đó tốt hơn. Đó là cách đọc được cả thuật toán lẫn giới hạn của nó.</p>
          <a class="btn btn-lime" href="#/learn/agents/1">Bắt đầu bài 1 ${icon("arrow")}</a>
        </div>
        <div class="lab-promo-visual">
          <div class="mini-bars">${[36, 58, 44, 88, 62, 76, 52, 94].map((h, i) => `<span style="--h:${h}%;--i:${i}" class="${i === 7 ? "is-hot" : ""}"></span>`).join("")}</div>
          <div class="mini-code">frontier.push(v)<br>&nbsp;&nbsp;if g &lt; best[v]:<br>&nbsp;&nbsp;&nbsp;&nbsp;best[v] = g</div>
        </div>
      </section>
    </div>`;
  }

  function outlineModuleHTML(mod) {
    if (!mod) return "";
    const lessons = mod.lessons.map((id) => LESSONS[id]).filter(Boolean);
    if (!lessons.length) return "";
    return `<div class="outline-module" style="--mc:var(--blue);--mc-soft:var(--blue-soft)">
      <div class="outline-module-head">
        <span class="outline-module-num">${esc(mod.num)}</span>
        <h3>${esc(mod.title)}</h3>
        <span>${lessons.length} bài</span>
      </div>
      ${lessons.map((lesson) => `<a class="outline-lesson${isDone(lesson.id) ? " is-done" : ""}" href="#/learn/${lesson.id}/1">
        <span class="outline-lesson-num">${isDone(lesson.id) ? "✓" : pad(lessonNumber(lesson.id))}</span>
        <span class="outline-lesson-title">${esc(lesson.shortTitle || lesson.title)}</span>
        <span class="outline-lesson-meta">${lesson.steps.length} bước</span>
      </a>`).join("")}
    </div>`;
  }

  /* ----------------------------------------------------------
     Lesson engine
     ---------------------------------------------------------- */
  function stepCode(lesson, step) {
    return (step && step.code) || lesson.code || "";
  }
  function stepScene(lesson, step) {
    if (step && step.visual) return step.visual;
    return lesson.visual || { kind: "vars", items: [] };
  }
  function codeLineCount(code) {
    return String(code || "").split("\n").length;
  }
  function sceneMetric(scene) {
    if (!scene) return "—";
    const kind = scene.kind;
    if (kind === "array") return `${(scene.values || []).length} ô`;
    if (kind === "list") return `${(scene.nodes || []).length} node`;
    if (kind === "tree") return `${(scene.nodes || []).length} node`;
    if (kind === "graph") return `${(scene.nodes || []).length} đỉnh`;
    if (kind === "recursion") return `${(scene.frames || []).length} frame`;
    if (kind === "stack") return `${(scene.items || []).length} phần tử`;
    if (kind === "queue") return `${(scene.items || []).length} phần tử`;
    if (kind === "memory") return `${(scene.stack || []).length + (scene.heap || []).length} ô`;
    if (kind === "vars") return `${(scene.items || []).length} biến`;
    if (kind === "table") return `${(scene.rows || []).length} dòng`;
    if (kind === "flow") return `${(scene.steps || []).length} bước`;
    if (kind === "complexity") return "tăng trưởng";
    return "—";
  }
  function outputMetric(step) {
    const lines = String((step && step.output) || "").trim().split("\n").filter(Boolean);
    if (!lines.length) return "—";
    const last = lines[lines.length - 1];
    return last.length > 22 ? `${last.slice(0, 21)}…` : last;
  }
  function metricsHTML(lesson, step, scene) {
    const line = step.line || 1;
    const code = stepCode(lesson, step);
    const watch = step.watch || [];
    return `<div class="stage-metrics">
      <div class="metric" style="--metric-color:var(--blue)"><div class="metric-label">Dòng giả mã</div><div class="metric-value">${pad(line)} <small>/ ${pad(codeLineCount(code))}</small></div></div>
      <div class="metric" style="--metric-color:var(--violet)"><div class="metric-label">Trạng thái đang xem</div><div class="metric-value">${watch.length || 0}</div></div>
      <div class="metric" style="--metric-color:var(--coral)"><div class="metric-label">Cấu trúc trực quan</div><div class="metric-value">${esc(sceneMetric(scene))}</div></div>
      <div class="metric" style="--metric-color:var(--green)"><div class="metric-label">stdout</div><div class="metric-value is-text">${esc(outputMetric(step))}</div></div>
    </div>`;
  }
  function traceHTML(step) {
    const watch = step.watch || [];
    return `<div class="trace-strip" id="traceStrip">
      <span class="trace-line">DÒNG ${pad(step.line || 1)}</span>
      <div class="watch-list">
        ${watch.length ? watch.map((v) => `<span class="watch-chip${v.changed ? " is-changed" : ""}"><b>${esc(v.name)}</b><span>${esc(v.value)}</span>${v.type ? `<small>${esc(v.type)}</small>` : ""}</span>`).join("") : `<span class="watch-empty">Chưa có biến trong phạm vi này</span>`}
      </div>
    </div>`;
  }
  function consoleHTML(step) {
    return `<div class="console-wrap" id="consoleWrap">
      <div class="console-head"><span>stdout</span><span>MÔ PHỎNG · không chạy mã thật</span></div>
      <pre class="console">${step.output ? esc(step.output) : "<span class=\"console-empty\">chưa có output</span>"}</pre>
    </div>`;
  }
  function stageHTML(lesson, step) {
    const code = stepCode(lesson, step);
    const scene = stepScene(lesson, step);
    const file = lesson.file || `${lesson.id}.py`;
    const life = lesson.life || { title: "Một tình huống đời thường", text: "Mỗi khái niệm đều có một phiên bản quen thuộc ngoài đời." };
    const isoOn = !!(window.AIStage && window.AIStage.on());
    return `<div class="stage-card" id="stageCard">
      <div class="stage-top">
        <div class="stage-title"><span class="live-dot"></span><span>CODE STAGE</span><span>${esc(file)} · ${codeLineCount(code)} dòng</span></div>
        <div class="stage-actions">
          <button class="stage-icon-btn scene-mode-btn${isoOn ? " is-on" : ""}" type="button" data-action="toggle-scene3d" aria-pressed="${isoOn}" title="Bật / tắt sơ đồ isometric">${icon("cube")}<span>${isoOn ? "3D" : "2D"}</span></button>
          <button class="stage-icon-btn" type="button" data-action="copy-code" title="Copy code">${icon("copy")}<span>Copy</span></button>
          <button class="stage-icon-btn" type="button" data-action="fullscreen" title="Xem toàn màn hình">${icon("full")}<span>Toàn màn hình</span></button>
        </div>
      </div>
      <div class="stage-life">
        <span class="stage-life-icon">${ICON[life.icon] ? icon(life.icon) : icon("bulb")}</span>
        <div class="stage-life-copy"><b>GÓC ĐỜI THƯỜNG · ${esc(life.title)}</b><p>${esc(life.text)}</p></div>
      </div>
      ${metricsHTML(lesson, step, scene)}
      <div class="stage-workbench">
        <div class="code-panel">
          <div class="code-panel-head"><span class="code-file">${esc(file)}</span><span class="code-lang">PYTHON</span></div>
          <div class="code-scroll" id="codeScroll">${R.codeHTML(code, step.line || 1, step.mark || [])}</div>
        </div>
        <div class="scene-panel">
          <div class="scene-panel-head">
            <span>TRẠNG THÁI &amp; DỮ LIỆU</span>
            <span class="scene-head-right"><span id="sceneKind">${esc(scene.kind || "vars").toUpperCase()}</span><button class="scene-zoom" type="button" data-action="zoom-scene" title="Phóng to sơ đồ" aria-label="Phóng to sơ đồ">${icon("full")}</button></span>
          </div>
          <div class="scene-wrap" id="sceneWrap">${R.renderScene(scene)}</div>
        </div>
      </div>
      ${traceHTML(step)}
      ${consoleHTML(step)}
      <div class="stage-legend">
        <div class="legend">
          <span class="legend-item"><i class="legend-swatch" style="--sw:var(--blue)"></i>Dòng giả mã</span>
          <span class="legend-item"><i class="legend-swatch" style="--sw:var(--coral)"></i>Giá trị vừa đổi</span>
          <span class="legend-item"><i class="legend-swatch" style="--sw:var(--green)"></i>Đã xử lý</span>
        </div>
        <span class="stage-hint">← → bước · Space phát · R phát lại · chạm khối để ghim · kéo ngang để nghiêng</span>
      </div>
      <div class="stage-player">
        <div class="player-bar">
          <button class="play-btn" id="playBtn" type="button" data-action="toggle-play" aria-label="Phát tự động các bước">${icon("play")}</button>
          <button class="player-mini" type="button" data-action="replay" title="Phát lại">${icon("replay")}</button>
          <button class="player-mini" type="button" data-action="prev-step" aria-label="Bước trước">${icon("prev")}</button>
          <div class="player-progress"><div class="player-fill" id="playerFill"></div></div>
          <span class="player-step-text" id="playerStepText">BƯỚC 01 / ${pad(lesson.steps.length)}</span>
          <span class="player-pct" id="playerPct">0%</span>
          <button class="player-mini" type="button" data-action="next-step" aria-label="Bước sau">${icon("next")}</button>
          <button class="speed-btn" type="button" data-action="cycle-speed" title="Tốc độ phát">${state.lesson.speed}×</button>
        </div>
        <div class="timeline" id="timeline">
          ${lesson.steps.map((s, i) => `<button class="tl-step${i === 0 ? " is-active" : ""}" type="button" data-step="${i + 1}" title="Bước ${i + 1}: ${esc(s.title)}">
            <span class="tl-step-bar"><span></span></span>
            <span class="tl-step-label">${pad(i + 1)} · ${esc(s.short || s.title)}</span>
          </button>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function stepPanelHTML(lesson, index) {
    const step = lesson.steps[index - 1];
    const isFirst = index === 1;
    const isLast = index === lesson.steps.length;
    const toneClass = step.tone === "warn" ? " type-warn" : step.tone === "final" ? " type-final" : "";
    const practice = practiceForLesson(lesson);
    const next = nextLessonOf(lesson.id);
    const nextHref = practice ? `#/practice/${practice.id}` : next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = practice ? "Luyện tình huống" : next ? `Sang bài: ${next.shortTitle || next.title}` : "Luyện tập";
    const note = step.note ? `<div class="callout"><div class="callout-head">${icon("bulb")} Điểm cần nhớ</div><p>${step.note}</p></div>` : "";
    const changes = step.changes && step.changes.length ? `<div class="step-section">
      <div class="step-section-title">Điều gì thay đổi</div>
      <div class="change-list">${step.changes.map((c) => `<div class="change-item">${icon("check")}<span>${esc(c)}</span></div>`).join("")}</div>
    </div>` : "";
    const complete = isLast ? `<div class="complete-banner">
      <h4>Bạn đã đi hết bài</h4>
      <p>Tiến độ đã được lưu. Làm một tình huống luyện tập để kiểm tra lại.</p>
      <a class="btn btn-sm btn-lime" href="${nextHref}">${nextLabel} ${icon("arrow")}</a>
    </div>` : "";
    return `<div class="step-panel-scroll">
      <div class="step-meta"><span class="step-counter">BƯỚC ${pad(index)} / ${pad(lesson.steps.length)}</span><span class="step-type${toneClass}">${esc(step.type || "BÀI HỌC")}</span></div>
      <h2 class="step-title">${esc(step.title)}</h2>
      <div class="step-body">${step.body}</div>
      ${note}
      ${changes}
      <div class="learn-box">
        <div class="step-section-title">Sau bài này, bạn nắm được</div>
        <div class="learn-list">${(lesson.learn || []).map((item) => `<div class="learn-item">${esc(item)}</div>`).join("")}</div>
      </div>
      ${complete}
    </div>
    <div class="step-nav">
      <button class="btn btn-ghost" type="button" data-action="prev-step" ${isFirst ? "disabled" : ""}>${icon("prev")} Trước</button>
      <button class="btn btn-primary" type="button" data-action="next-step" ${isLast ? "disabled" : ""}>Tiếp ${icon("next")}</button>
    </div>
    <div class="kbd-hints"><span><kbd>←</kbd><kbd>→</kbd> chuyển bước</span><span><kbd>Space</kbd> phát</span><span><kbd>R</kbd> lại</span></div>`;
  }

  function renderLesson(lesson, requestedStep) {
    stopPlayer();
    state.lesson.id = lesson.id;
    state.lesson.step = clamp(Number(requestedStep) || 1, 1, lesson.steps.length);
    state.lesson.playing = false;
    document.title = `${lesson.title} — AILab`;
    document.body.dataset.view = "lesson";
    const track = trackById[lesson.track];
    const mod = moduleById[lesson.module];
    const index = state.lesson.step;
    const step = lesson.steps[index - 1];
    const next = nextLessonOf(lesson.id);
    const practice = practiceForLesson(lesson);
    const nextHref = practice ? `#/practice/${practice.id}` : next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = practice ? "Luyện tập" : next ? "Bài tiếp" : "Luyện tập";
    view.innerHTML = `<div class="lesson-page">
      <div class="lesson-head">
        <div>
          <div class="lesson-breadcrumb"><a href="#/">AILab</a><span class="sep">/</span><span>${esc(track.short)}</span><span class="sep">/</span><span>${esc(mod.title)}</span><span class="sep">/</span><span>${esc(lesson.shortTitle || lesson.title)}</span></div>
          <h1 class="lesson-title">${esc(lesson.title)}</h1>
          <p class="lesson-sub">${esc(lesson.subtitle || lesson.blurb)}</p>
          <div class="lesson-badges">
            <span class="pill pill-blue">${esc(mod.num)} · ${esc(mod.title)}</span>
            <span class="pill">${esc(lesson.level || "Cơ bản")}</span>
            <span class="pill">${esc(lesson.duration || "10 phút")}</span>
            <span class="pill">${lesson.steps.length} bước</span>
            <span class="pill">${esc(lesson.track === "ai" ? "AI" : "ML")}</span>
          </div>
        </div>
        <div class="lesson-head-right">
          <a class="btn btn-ghost btn-sm" href="#/">Về lộ trình</a>
          <a class="btn btn-primary btn-sm" href="${nextHref}">${nextLabel} ${icon("arrow")}</a>
        </div>
      </div>
      <div class="lesson-layout">
        <div class="lesson-main">
          ${stageHTML(lesson, step)}
        </div>
        <aside class="step-panel" id="stepPanel">${stepPanelHTML(lesson, index)}</aside>
      </div>
    </div>`;
    renderSidebar();
    applyStep(lesson, index, { initial: true });
  }

  function applyStep(lesson, requested, opts) {
    const index = clamp(Number(requested) || 1, 1, lesson.steps.length);
    state.lesson.id = lesson.id;
    state.lesson.step = index;
    const step = lesson.steps[index - 1];
    const code = stepCode(lesson, step);
    const scene = stepScene(lesson, step);
    const codeScroll = $("#codeScroll");
    if (codeScroll) {
      const top = codeScroll.scrollTop;
      codeScroll.innerHTML = R.codeHTML(code, step.line || 1, step.mark || []);
      codeScroll.scrollTop = top;
    }
    const sceneWrap = $("#sceneWrap");
    if (sceneWrap) {
      sceneWrap.innerHTML = R.renderScene(scene);
      const kind = $("#sceneKind");
      if (kind) kind.textContent = String(scene.kind || "vars").toUpperCase();
    }
    const metrics = $(".stage-metrics");
    if (metrics) metrics.outerHTML = metricsHTML(lesson, step, scene);
    const trace = $("#traceStrip");
    if (trace) trace.outerHTML = traceHTML(step);
    const consoleEl = $("#consoleWrap");
    if (consoleEl) consoleEl.outerHTML = consoleHTML(step);
    const panel = $("#stepPanel");
    if (panel) panel.innerHTML = stepPanelHTML(lesson, index);
    $$(".tl-step").forEach((el, i) => {
      el.classList.toggle("is-active", i === index - 1);
      el.classList.toggle("is-done", i < index - 1);
    });
    const fill = $("#playerFill");
    if (fill) fill.style.width = `${(index / lesson.steps.length) * 100}%`;
    const stepText = $("#playerStepText");
    if (stepText) stepText.textContent = `BƯỚC ${pad(index)} / ${pad(lesson.steps.length)}`;
    const pct = $("#playerPct");
    if (pct) pct.textContent = `${Math.round(index / lesson.steps.length * 100)}%`;
    const speedBtn = $(".speed-btn");
    if (speedBtn) speedBtn.textContent = `${state.lesson.speed}×`;
    markVisited(lesson.id, index);
    syncSidebarActive();
    if (!opts || opts.initial !== true) {
      const line = $(".code-line.is-active");
      if (line && codeScroll) {
        const top = line.offsetTop - codeScroll.clientHeight / 2 + line.offsetHeight / 2;
        codeScroll.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
    if (state.lesson.playing) restartAutoTimer();
  }

  function goToStep(index) {
    const lesson = LESSONS[state.lesson.id];
    if (!lesson) return;
    const target = clamp(index, 1, lesson.steps.length);
    const hash = `#/learn/${lesson.id}/${target}`;
    if (location.hash === hash) {
      applyStep(lesson, target);
    } else {
      location.hash = hash;
    }
  }

  function setPausedUI() {
    const btn = $("#playBtn");
    if (!btn) return;
    btn.innerHTML = icon(state.lesson.playing ? "pause" : "play");
    btn.setAttribute("aria-label", state.lesson.playing ? "Tạm dừng" : "Phát tự động các bước");
  }
  function stopPlayer() {
    if (state.lesson.timer) clearTimeout(state.lesson.timer);
    state.lesson.timer = null;
    state.lesson.playing = false;
    setPausedUI();
  }
  function restartAutoTimer() {
    if (state.lesson.timer) clearTimeout(state.lesson.timer);
    state.lesson.timer = null;
    if (!state.lesson.playing) return;
    const lesson = LESSONS[state.lesson.id];
    if (!lesson) return;
    state.lesson.timer = setTimeout(() => {
      if (state.lesson.step >= lesson.steps.length) {
        stopPlayer();
        return;
      }
      goToStep(state.lesson.step + 1);
    }, (DATA.meta.autoplayMs || 7200) / state.lesson.speed);
  }
  function togglePlayer() {
    const lesson = LESSONS[state.lesson.id];
    if (!lesson) return;
    if (state.lesson.playing) {
      stopPlayer();
      return;
    }
    if (state.lesson.step >= lesson.steps.length) goToStep(1);
    state.lesson.playing = true;
    setPausedUI();
    restartAutoTimer();
  }
  function replayLesson() {
    stopPlayer();
    goToStep(1);
  }
  function cycleSpeed() {
    const options = [1, 1.5, 2];
    const at = options.indexOf(state.lesson.speed);
    state.lesson.speed = options[(at + 1) % options.length];
    saveSpeed();
    const btn = $(".speed-btn");
    if (btn) btn.textContent = `${state.lesson.speed}×`;
    if (state.lesson.playing) restartAutoTimer();
  }
  function toggleFullscreen() {
    const card = $("#stageCard");
    if (!card) return;
    if (!document.fullscreenElement) {
      if (card.requestFullscreen) card.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
  function copyCode() {
    const lesson = LESSONS[state.lesson.id];
    if (!lesson) return;
    const step = lesson.steps[state.lesson.step - 1];
    const code = stepCode(lesson, step);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => toast("Đã copy code")).catch(() => toast("Không copy được"));
    } else {
      toast("Trình duyệt không hỗ trợ copy");
    }
  }

  /* ----------------------------------------------------------
     Practice
     ---------------------------------------------------------- */
  function renderPracticeList() {
    document.title = "Luyện tập — AILab";
    document.body.dataset.view = "practice";
    const answered = Object.keys(progress.practice || {}).length;
    view.innerHTML = `<div class="mode-page">
      <div class="mode-head">
        <div>
          <div class="eyebrow">TÌNH HUỐNG THỰC TẾ</div>
          <h1>Đọc tình huống, chọn cách làm</h1>
          <p>Mỗi tình huống có một sơ đồ nhỏ để bạn nhìn thấy dữ liệu trước khi trả lời. Đúng sai đều có lời giải thích ngay.</p>
        </div>
        <div class="mode-head-right"><span class="pill pill-green">${answered}/${PRACTICE.length} đã làm</span></div>
      </div>
      ${TRACKS.map((track) => {
        const list = PRACTICE.filter((p) => p.track === track.id);
        if (!list.length) return "";
        return `<section class="practice-track">
          <div class="section-head compact">
            <div><div class="eyebrow">${esc(track.kicker)}</div><h2>${esc(track.short)}</h2></div>
            <span class="pill">${list.length} tình huống</span>
          </div>
          <div class="practice-grid">${list.map(practiceCardHTML).join("")}</div>
        </section>`;
      }).join("")}
    </div>`;
  }

  function practiceCardHTML(p) {
    const saved = progress.practice[p.id];
    const stateLabel = saved ? (saved.correct ? `<span class="pill pill-green">Đã đúng</span>` : `<span class="pill pill-yellow">Đã thử</span>`) : "";
    return `<a class="practice-card" href="#/practice/${p.id}">
      <div class="pc-top"><span class="pc-kicker">${esc(p.track === "ai" ? "AI NỀN TẢNG" : "HỌC MÁY")}</span>${stateLabel}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.context)}</p>
      <div class="pc-scene">${R.renderScene(p.visual, { compact: true })}</div>
      <div class="pc-foot"><span>${esc(p.skill || "Đọc hiểu")}</span><span>Làm bài ${icon("arrow")}</span></div>
    </a>`;
  }

  function renderPracticeDetail(id) {
    const p = PRACTICE.find((item) => item.id === id);
    if (!p) {
      renderMissing();
      return;
    }
    state.practice.id = id;
    const saved = progress.practice[id];
    state.practice.answered = saved ? saved.selected : null;
    document.title = `${p.title} — Luyện tập AILab`;
    document.body.dataset.view = "practice-detail";
    const track = trackById[p.track];
    const list = PRACTICE.filter((item) => item.track === p.track);
    const at = list.findIndex((item) => item.id === id);
    const next = list[at + 1] || list[0];
    const lesson = p.lesson ? LESSONS[p.lesson] : null;
    const correct = saved ? saved.correct : null;
    view.innerHTML = `<div class="mode-page">
      <div class="practice-layout">
        <div class="practice-main">
          <div class="practice-card is-detail">
            <div class="pc-top"><span class="pc-kicker">${esc(track.short)} · TÌNH HUỐNG ${pad(at + 1)}</span><span class="pill">${esc(p.skill || "Đọc hiểu")}</span></div>
            <h1>${esc(p.title)}</h1>
            <p class="practice-context">${esc(p.context)}</p>
            <div class="practice-scene">${R.renderScene(p.visual)}</div>
            <div class="practice-question"><span>CHỌN ĐÁP ÁN</span><h2>${esc(p.question)}</h2></div>
            <div class="option-list" id="optionList">
              ${p.options.map((option, i) => {
                const isAnswer = i === p.answer;
                const picked = saved && saved.selected === i;
                const cls = saved ? (isAnswer ? " is-correct" : picked ? " is-wrong" : " is-muted") : "";
                return `<button class="option-btn${cls}" type="button" data-action="answer-practice" data-option="${i}" ${saved ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span></button>`;
              }).join("")}
            </div>
            <div class="practice-result${saved ? " is-visible" : ""}" id="practiceResult">
              <div class="result-mark ${correct ? "is-ok" : "is-bad"}">${correct ? icon("check") : "!"}</div>
              <div><b>${correct ? "Chính xác" : "Chưa đúng"}</b><p>${esc(p.explain)}</p></div>
            </div>
            <div class="practice-actions">
              ${lesson ? `<a class="btn btn-ghost" href="#/learn/${lesson.id}/1">${icon("code")} Ôn lại bài</a>` : ""}
              <a class="btn btn-primary" href="#/practice/${next.id}">Tình huống tiếp ${icon("arrow")}</a>
            </div>
          </div>
        </div>
        <aside class="practice-side">
          <div class="side-card">
            <h3>TIẾN ĐỘ LUYỆN TẬP</h3>
            <div class="practice-progress">${list.map((item) => `<span class="${progress.practice[item.id] ? (progress.practice[item.id].correct ? "is-ok" : "is-try") : ""}${item.id === id ? " is-current" : ""}"></span>`).join("")}</div>
            <p style="margin-top:10px">${Object.keys(progress.practice).length}/${PRACTICE.length} tình huống đã trả lời.</p>
          </div>
          <div class="side-card">
            <h3>TRONG LỘ TRÌNH NÀY</h3>
            <div class="side-practice-list">${list.map((item) => `<a class="${item.id === id ? "is-active" : ""}" href="#/practice/${item.id}"><span>${pad(list.indexOf(item) + 1)}</span>${esc(item.title)}</a>`).join("")}</div>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function answerPractice(optionIndex) {
    const p = PRACTICE.find((item) => item.id === state.practice.id);
    if (!p || progress.practice[p.id]) return;
    const correct = Number(optionIndex) === Number(p.answer);
    progress.practice[p.id] = { selected: Number(optionIndex), correct };
    saveProgress();
    renderPracticeDetail(p.id);
    toast(correct ? "Chính xác" : "Đã ghi nhận, xem lời giải nhé");
  }

  /* ----------------------------------------------------------
     Cheatsheets
     ---------------------------------------------------------- */
  function cheatCodeHTML(code) {
    return String(code || "").split("\n").map((line) => R.highlightLine(line)).join("\n");
  }
  function renderCheatsheets() {
    document.title = "Cheatsheets — AILab";
    document.body.dataset.view = "cheatsheets";
    view.innerHTML = `<div class="mode-page">
      <div class="mode-head">
        <div>
          <div class="eyebrow">TRA NHANH</div>
          <h1>Giả mã và mẫu nhanh</h1>
          <p>Những mảnh giả mã nhỏ, đúng ngay khi cần: tìm kiếm, trò chơi, xác suất, học máy và LLM.</p>
        </div>
        <div class="mode-head-right"><span class="pill">${CHEATS.length} thẻ</span></div>
      </div>
      ${TRACKS.map((track) => {
        const cards = CHEATS.filter((card) => card.track === track.id);
        if (!cards.length) return "";
        return `<section class="cheat-track">
          <div class="section-head compact"><div><div class="eyebrow">${esc(track.kicker)}</div><h2>${esc(track.short)}</h2></div><span class="pill">${cards.length} thẻ</span></div>
          <div class="cheat-grid">${cards.map(cheatCardHTML).join("")}</div>
        </section>`;
      }).join("")}
    </div>`;
  }
  function cheatCardHTML(card) {
    return `<article class="cheat-card">
      <div class="cheat-card-head"><span class="cheat-icon" style="--cc:var(--${card.tone || "blue"});--cc-soft:var(--${card.tone || "blue"}-soft)">${icon(card.icon || "book")}</span><div><h3>${esc(card.title)}</h3><p>${esc(card.subtitle || "")}</p></div></div>
      ${(card.items || []).map((item) => `<div class="cheat-item">
        <div class="cheat-label">${esc(item.label)}</div>
        ${item.code ? `<pre class="cheat-code"><code>${cheatCodeHTML(item.code)}</code></pre>` : ""}
        ${item.note ? `<p>${esc(item.note)}</p>` : ""}
      </div>`).join("")}
    </article>`;
  }

  /* ----------------------------------------------------------
     Search
     ---------------------------------------------------------- */
  let searchIndex = null;
  function buildSearchIndex() {
    if (searchIndex) return searchIndex;
    searchIndex = [];
    lessonOrder.forEach((id) => {
      const lesson = LESSONS[id];
      if (!lesson) return;
      const track = trackById[lesson.track];
      searchIndex.push({
        type: "Bài học",
        title: lesson.title,
        sub: `${track.short} · ${lesson.shortTitle || ""}`,
        href: `#/learn/${id}/1`,
        text: normalize([lesson.title, lesson.shortTitle, lesson.subtitle, lesson.blurb, (lesson.tags || []).join(" "), (lesson.learn || []).join(" ")].join(" "))
      });
    });
    PRACTICE.forEach((p) => {
      searchIndex.push({
        type: "Luyện tập",
        title: p.title,
        sub: p.track === "ai" ? "AI nền tảng" : "Học máy",
        href: `#/practice/${p.id}`,
        text: normalize([p.title, p.context, p.question, (p.options || []).join(" ")].join(" "))
      });
    });
    CHEATS.forEach((card) => {
      searchIndex.push({
        type: "Cheatsheet",
        title: card.title,
        sub: card.track === "ai" ? "AI nền tảng" : "Học máy",
        href: "#/cheatsheets",
        text: normalize([card.title, card.subtitle, (card.items || []).map((item) => `${item.label} ${item.code} ${item.note || ""}`).join(" ")].join(" "))
      });
    });
    return searchIndex;
  }
  function searchResultsFor(query) {
    const q = normalize(query).trim();
    const index = buildSearchIndex();
    if (!q) return index.slice(0, 7);
    return index
      .map((item) => {
        const title = normalize(item.title);
        const text = item.text;
        let score = 0;
        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 60;
        else if (title.includes(q)) score += 40;
        if (text.includes(q)) score += 15;
        const words = q.split(/\s+/).filter(Boolean);
        score += words.reduce((sum, word) => sum + (text.includes(word) ? 4 : 0), 0);
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }
  function openSearch() {
    const modal = $("#searchModal");
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("has-modal");
    state.search.open = true;
    state.search.selected = 0;
    const input = $("#searchInput");
    if (input) {
      input.value = "";
      input.focus();
    }
    renderSearchResults("");
  }
  function closeSearch() {
    const modal = $("#searchModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("has-modal");
    state.search.open = false;
  }
  function renderSearchResults(query) {
    const results = searchResultsFor(query);
    state.search.results = results;
    state.search.selected = clamp(state.search.selected, 0, Math.max(0, results.length - 1));
    const box = $("#searchResults");
    if (!box) return;
    if (!results.length) {
      box.innerHTML = `<div class="search-empty">Không tìm thấy kết quả cho “${esc(query)}”.</div>`;
      return;
    }
    box.innerHTML = `<div class="search-group-label">${query ? "KẾT QUẢ" : "GỢI Ý"}</div>
      ${results.map((item, i) => `<a class="search-result${i === state.search.selected ? " is-selected" : ""}" href="${item.href}" data-index="${i}">
        <span class="search-result-type">${esc(item.type)}</span>
        <span class="search-result-body"><b>${esc(item.title)}</b><small>${esc(item.sub || "")}</small></span>
        <span class="search-result-arrow">${icon("arrow")}</span>
      </a>`).join("")}`;
  }
  function moveSearch(delta) {
    const results = state.search.results;
    if (!results.length) return;
    state.search.selected = (state.search.selected + delta + results.length) % results.length;
    renderSearchResults($("#searchInput") ? $("#searchInput").value : "");
  }
  function activateSearch() {
    const item = state.search.results[state.search.selected];
    if (!item) return;
    closeSearch();
    navigate(item.href);
  }

  /* ----------------------------------------------------------
     Events
     ---------------------------------------------------------- */
  function handleAction(action, el) {
    if (action === "start-track") {
      const id = el.dataset.track;
      selectTrack(id, { goHome: false });
      const first = firstLessonOf(id);
      navigate(first ? `#/learn/${first.id}/1` : "#/");
      return;
    }
    if (action === "select-track") {
      selectTrack(el.dataset.track, { goHome: true });
      return;
    }
    if (action === "toggle-play") { togglePlayer(); return; }
    if (action === "replay") { replayLesson(); return; }
    if (action === "prev-step") { goToStep(state.lesson.step - 1); return; }
    if (action === "next-step") { goToStep(state.lesson.step + 1); return; }
    if (action === "cycle-speed") { cycleSpeed(); return; }
    if (action === "copy-code") { copyCode(); return; }
    if (action === "fullscreen") { toggleFullscreen(); return; }
    if (action === "toggle-scene3d") {
      if (!window.AIStage) return;
      const next = window.AIStage.toggle();
      el.classList.toggle("is-on", next);
      el.setAttribute("aria-pressed", String(next));
      const label = el.querySelector("span:not(.ui-icon)");
      if (label) label.textContent = next ? "3D" : "2D";
      const lesson = LESSONS[state.lesson.id];
      if (lesson) applyStep(lesson, state.lesson.step);
      toast(next ? "Sơ đồ isometric đã bật" : "Đã chuyển về sơ đồ phẳng");
      return;
    }
    if (action === "zoom-scene") {
      const panel = document.querySelector(".scene-panel");
      if (!panel) return;
      if (!document.fullscreenElement) {
        if (panel.requestFullscreen) panel.requestFullscreen().catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }
    if (action === "answer-practice") { answerPractice(el.dataset.option); return; }
  }

  function bindEvents() {
    view.addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      if (action && ["start-track", "select-track", "toggle-play", "replay", "prev-step", "next-step", "cycle-speed", "copy-code", "fullscreen", "toggle-scene3d", "zoom-scene", "answer-practice"].includes(action)) {
        event.preventDefault();
        handleAction(action, actionEl);
      }
    });

    const searchBtn = $("#searchBtn");
    if (searchBtn) searchBtn.addEventListener("click", openSearch);
    const themeBtn = $("#themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
    const menuBtn = $("#menuBtn");
    if (menuBtn) menuBtn.addEventListener("click", () => {
      if ($("#sidebar") && $("#sidebar").classList.contains("is-open")) closeSidebar();
      else openSidebar();
    });
    const scrim = $("#sidebarScrim");
    if (scrim) scrim.addEventListener("click", closeSidebar);
    const resetBtn = $("#resetProgressBtn");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (!window.confirm("Xoá toàn bộ tiến độ học và luyện tập trên trình duyệt này?")) return;
      progress = { visited: {}, completed: {}, practice: {}, track: state.track };
      saveProgress();
      renderSidebar();
      updateChrome();
      onRoute();
      toast("Đã đặt lại tiến độ");
    });
    $$("#trackSwitch [data-track]").forEach((button) => {
      button.addEventListener("click", () => selectTrack(button.dataset.track, { goHome: true }));
    });

    const modal = $("#searchModal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-close-search]")) closeSearch();
        const result = event.target.closest(".search-result");
        if (result) {
          event.preventDefault();
          closeSearch();
          navigate(result.getAttribute("href"));
        }
      });
    }
    const input = $("#searchInput");
    if (input) {
      input.addEventListener("input", () => {
        state.search.selected = 0;
        renderSearchResults(input.value);
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); moveSearch(1); }
        else if (event.key === "ArrowUp") { event.preventDefault(); moveSearch(-1); }
        else if (event.key === "Enter") { event.preventDefault(); activateSearch(); }
        else if (event.key === "Escape") { event.preventDefault(); closeSearch(); }
      });
    }

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        state.search.open ? closeSearch() : openSearch();
        return;
      }
      if (event.key === "Escape") {
        if (state.search.open) closeSearch();
        else if ($("#sidebar") && $("#sidebar").classList.contains("is-open")) closeSidebar();
        return;
      }
      if (state.search.open) return;
      const tag = (event.target && event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;
      if (state.route.name !== "lesson") return;
      if (event.key === "ArrowLeft") { event.preventDefault(); goToStep(state.lesson.step - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); goToStep(state.lesson.step + 1); }
      if (event.code === "Space") { event.preventDefault(); togglePlayer(); }
      if (event.key.toLowerCase() === "r") { event.preventDefault(); replayLesson(); }
    });

    window.addEventListener("hashchange", onRoute);
  }

  function init() {
    initTheme();
    initSpeed();
    state.track = trackById[progress.track] ? progress.track : "cpp";
    renderSidebar();
    bindEvents();
    onRoute();
    updateChrome();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { /* fonts loaded */ });
    }
  }

  init();
})();
