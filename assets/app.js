(function () {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const storageKey = "dev-talk-archive-theme";

  function getInitialTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {
      // Some browsers restrict storage for pages opened directly from disk.
    }
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "切换浅色模式" : "切换深色模式",
      );
    }
  }

  applyTheme(getInitialTheme());

  themeToggle?.addEventListener("click", function () {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Theme switching still works when persistence is unavailable.
    }
    applyTheme(nextTheme);
  });

  setupReportNavigation();

  const grid = document.querySelector("#talk-grid");
  if (!grid || !Array.isArray(window.TALKS)) return;

  const talks = window.TALKS;
  const searchInput = document.querySelector("#search-input");
  const gameFilter = document.querySelector("#game-filter");
  const topicFilter = document.querySelector("#topic-filter");
  const statusFilter = document.querySelector("#status-filter");
  const resultSummary = document.querySelector("#result-summary");
  const activeFilters = document.querySelector("#active-filters");
  const emptyState = document.querySelector("#empty-state");
  const resetButton = document.querySelector("#reset-filters");

  const state = {
    query: "",
    game: "all",
    topic: "all",
    status: "all",
  };

  populateSelect(gameFilter, uniqueValues(talks.map((talk) => talk.game)));
  populateSelect(topicFilter, uniqueValues(talks.flatMap((talk) => talk.topics)));
  updateStats(talks);
  render();

  searchInput.addEventListener("input", function (event) {
    state.query = event.target.value.trim().toLocaleLowerCase("zh-CN");
    render();
  });

  gameFilter.addEventListener("change", function (event) {
    state.game = event.target.value;
    render();
  });

  topicFilter.addEventListener("change", function (event) {
    state.topic = event.target.value;
    render();
  });

  statusFilter.addEventListener("change", function (event) {
    state.status = event.target.value;
    render();
  });

  resetButton.addEventListener("click", resetFilters);
  activeFilters.addEventListener("click", function (event) {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const filter = button.dataset.filter;
    state[filter] = filter === "query" ? "" : "all";
    syncControls();
    render();
  });

  function render() {
    const filtered = talks.filter(matchesFilters);
    grid.replaceChildren(...filtered.map(createCard));
    grid.hidden = filtered.length === 0;
    emptyState.hidden = filtered.length !== 0;
    resultSummary.textContent = `显示 ${filtered.length} / ${talks.length} 项`;
    renderActiveFilters();
  }

  function matchesFilters(talk) {
    const haystack = [
      talk.title,
      talk.originalTitle,
      talk.speaker,
      talk.role,
      talk.game,
      talk.year,
      talk.summary,
      ...talk.topics,
    ]
      .join(" ")
      .toLocaleLowerCase("zh-CN");

    return (
      (!state.query || haystack.includes(state.query)) &&
      (state.game === "all" || talk.game === state.game) &&
      (state.topic === "all" || talk.topics.includes(state.topic)) &&
      (state.status === "all" || talk.status === state.status)
    );
  }

  function createCard(talk) {
    const article = document.createElement("article");
    article.className = "talk-card";
    article.dataset.status = talk.status;

    const visual = document.createElement("div");
    visual.className = "card-visual";
    visual.innerHTML = `
      <span class="visual-game">${escapeHtml(talk.game)}</span>
      <span class="visual-year">${escapeHtml(String(talk.year))}</span>
    `;

    const content = document.createElement("div");
    content.className = "card-content";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `
      <span class="status-badge">${talk.status === "report" ? "完整报告" : "候选分享"}</span>
      <span class="completeness-badge">资料完整度：${escapeHtml(talk.completeness)}</span>
    `;

    const title = document.createElement("h3");
    title.textContent = talk.title;

    const speaker = document.createElement("p");
    speaker.className = "speaker-line";
    speaker.textContent = `${talk.speaker} · ${talk.role}`;

    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = talk.summary;

    const tags = document.createElement("div");
    tags.className = "tag-list";
    tags.innerHTML = talk.topics
      .slice(0, 4)
      .map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`)
      .join("");

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const sourceType = document.createElement("span");
    sourceType.textContent = talk.sourceType;
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = talk.href;
    link.textContent = talk.status === "report" ? "阅读报告 →" : "查看原始资料 ↗";
    if (talk.status !== "report") {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    footer.append(sourceType, link);

    content.append(meta, title, speaker, summary, tags, footer);
    article.append(visual, content);
    return article;
  }

  function renderActiveFilters() {
    const chips = [];
    if (state.query) chips.push(["query", `搜索：${searchInput.value.trim()}`]);
    if (state.game !== "all") chips.push(["game", `游戏：${state.game}`]);
    if (state.topic !== "all") chips.push(["topic", `主题：${state.topic}`]);
    if (state.status !== "all") {
      chips.push(["status", `状态：${state.status === "report" ? "完整报告" : "候选分享"}`]);
    }
    activeFilters.innerHTML = chips
      .map(
        ([filter, label]) =>
          `<button class="filter-chip" type="button" data-filter="${filter}">${escapeHtml(label)}</button>`,
      )
      .join("");
  }

  function resetFilters() {
    state.query = "";
    state.game = "all";
    state.topic = "all";
    state.status = "all";
    syncControls();
    render();
  }

  function syncControls() {
    searchInput.value = state.query;
    gameFilter.value = state.game;
    topicFilter.value = state.topic;
    statusFilter.value = state.status;
  }
})();

function populateSelect(select, values) {
  values.forEach(function (value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort(function (a, b) {
    return a.localeCompare(b, "zh-CN");
  });
}

function updateStats(talks) {
  const reportCount = talks.filter((talk) => talk.status === "report").length;
  const candidateCount = talks.filter((talk) => talk.status === "candidate").length;
  const speakerCount = new Set(talks.map((talk) => talk.speaker)).size;
  setText("#report-count", reportCount);
  setText("#candidate-count", candidateCount);
  setText("#speaker-count", speakerCount);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = String(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setupReportNavigation() {
  const toc = document.querySelector(".report-toc");
  if (!toc) return;

  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    function (entries) {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${visible.target.id}`,
        );
      });
    },
    { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.25, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
