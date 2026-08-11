(function () {
  const data = window.SITE_DATA;
  if (!data) return;

  const pageId = document.body.dataset.page || location.pathname.split("/").pop().replace(".html", "") || "index";
  const page = data.pages[pageId] || data.pages.index;
  const groupMarks = {
    工作台: "01",
    行管處專區: "02",
    人事權益: "03",
    教育訓練: "04",
    文件資源: "05",
    資訊專區: "06",
    服務處專區: "07"
  };

  document.title = page.title ? `${page.title} | 員工專區` : "員工專區";
  document.body.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "workspace-shell";
  shell.innerHTML = `
    <aside class="workspace-sidebar">
      <a class="workspace-brand" href="index.html" aria-label="回到員工專區首頁">
        <img src="slsc-logo.png" alt="社團法人中華民國士林靈糧堂協會 Logo">
        <span><strong>員工專區</strong><small>SLSC WORKSPACE</small></span>
      </a>
      <nav class="workspace-nav" id="main-nav" aria-label="頁面導覽"></nav>
      <footer class="workspace-footer">
        <span>員工專區 5.0</span>
        <small>Copyright © 2026 slsc-Staff-are<br>All rights reserved. 隱私權政策</small>
      </footer>
    </aside>
    <button class="nav-backdrop" type="button" aria-label="關閉選單"></button>
    <main class="workspace-main">
      <header class="workspace-topbar">
        <div class="topbar-context">
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">選單</button>
          <span class="status-dot" aria-hidden="true"></span>
          <span>內部資源工作台</span>
        </div>
        <div class="topbar-actions">
          <button class="search-toggle" type="button" aria-expanded="false" aria-controls="site-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/></svg>
            <span>搜尋</span><kbd>/</kbd>
          </button>
        </div>
      </header>
      <div id="page-root"></div>
    </main>
    <div class="search-layer" id="site-search" hidden>
      <button class="search-backdrop" type="button" aria-label="關閉搜尋"></button>
      <section class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div class="search-head">
          <div>
            <p class="section-kicker">QUICK SEARCH</p>
            <h2 id="search-title">搜尋所有資源</h2>
          </div>
          <button class="search-close" type="button" aria-label="關閉搜尋">關閉</button>
        </div>
        <label class="search-field">
          <span class="sr-only">輸入專區或資源名稱</span>
          <input type="search" autocomplete="off" placeholder="輸入專區、平台或文件名稱…">
        </label>
        <div class="search-results" aria-live="polite"></div>
      </section>
    </div>
  `;
  document.body.appendChild(shell);

  renderNavigation(shell.querySelector(".workspace-nav"), data.nav, pageId);
  shell.querySelector("#page-root").appendChild(renderPage(page, data));
  setupNavigation(shell);
  setupSearch(shell, data);

  function renderNavigation(root, navigation, activeId) {
    const groups = groupItems(navigation);
    groups.forEach(([groupName, items]) => {
      const section = document.createElement("section");
      section.className = "nav-group";
      section.innerHTML = `
        <p class="nav-group-title"><span>${escapeHtml(groupMarks[groupName] || "")}</span>${escapeHtml(groupName)}</p>
        <div class="nav-group-links"></div>
      `;
      const links = section.querySelector(".nav-group-links");
      items.forEach((item) => {
        const link = document.createElement("a");
        link.className = `nav-link${item.id === activeId ? " active" : ""}`;
        link.href = item.href;
        link.innerHTML = `<span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.note || "")}</small>`;
        links.appendChild(link);
      });
      root.appendChild(section);
    });
  }

  function setupNavigation(root) {
    const toggle = root.querySelector(".menu-toggle");
    const backdrop = root.querySelector(".nav-backdrop");
    const nav = root.querySelector(".workspace-nav");
    const activeLink = nav.querySelector(".nav-link.active");
    const scrollStorageKey = "slsc-workspace-nav-scroll";
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    backdrop.addEventListener("click", closeNav);
    nav.addEventListener("click", (event) => {
      if (event.target.closest(".nav-link")) saveNavScroll();
      if (window.innerWidth <= 980) closeNav();
    });
    nav.addEventListener("scroll", saveNavScroll, { passive: true });

    requestAnimationFrame(() => {
      const savedPosition = readNavScroll();
      if (savedPosition !== null) {
        nav.scrollTop = savedPosition;
      }
      if (activeLink) revealActiveLink(nav, activeLink);
    });

    function saveNavScroll() {
      try {
        sessionStorage.setItem(scrollStorageKey, String(nav.scrollTop));
      } catch (_) {
        // The active-item fallback below still works when storage is unavailable.
      }
    }

    function readNavScroll() {
      try {
        const value = sessionStorage.getItem(scrollStorageKey);
        const position = value === null ? null : Number(value);
        return Number.isFinite(position) ? position : null;
      } catch (_) {
        return null;
      }
    }
  }

  function revealActiveLink(nav, activeLink) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    if (linkRect.top < navRect.top) {
      nav.scrollTop -= navRect.top - linkRect.top + 12;
    } else if (linkRect.bottom > navRect.bottom) {
      nav.scrollTop += linkRect.bottom - navRect.bottom + 12;
    }
  }

  function renderPage(currentPage, siteData) {
    if (currentPage.type === "home") return renderHome(currentPage, siteData);

    const wrap = document.createElement("div");
    wrap.className = "page-layout";
    wrap.appendChild(renderPageHeader(currentPage));

    if (currentPage.type === "links") {
      wrap.appendChild(renderLinksPanel(currentPage));
      if (currentPage.notes?.length) wrap.appendChild(renderNotesPanel("補充說明", currentPage.notes));
      if (currentPage.faq?.length) wrap.appendChild(renderLinkListPanel("常見問題", currentPage.faq));
    } else if (currentPage.type === "html") {
      wrap.appendChild(renderHtmlPanel(currentPage.html, "內容"));
    } else if (currentPage.type === "overview") {
      wrap.appendChild(renderOverviewPanel(siteData));
      if (currentPage.extraHtml) wrap.appendChild(renderHtmlPanel(currentPage.extraHtml, "職務代理表"));
    }
    return wrap;
  }

  function renderHome(currentPage, siteData) {
    const wrap = document.createElement("div");
    wrap.className = "dashboard-layout";

    const hero = document.createElement("section");
    hero.className = "workspace-hero";
    hero.innerHTML = `
      <div class="hero-copy">
        <p class="section-kicker">SLSC STAFF WORKSPACE</p>
        <h1>${escapeHtml(currentPage.title || "員工專區")}</h1>
        <p>${escapeHtml(currentPage.subtitle || "集中管理日常工作需要的系統、文件與作業資訊。")}</p>
      </div>
      <div class="hero-actions"></div>
    `;
    const heroActions = hero.querySelector(".hero-actions");
    (currentPage.actions || []).forEach((action) => heroActions.appendChild(createActionLink(action, action.primary)));
    wrap.appendChild(hero);

    const quickSection = document.createElement("section");
    quickSection.className = "dashboard-section";
    quickSection.innerHTML = `
      <div class="section-heading">
        <div><p class="section-kicker">QUICK ACCESS</p><h2>常用入口</h2></div>
        <span>${currentPage.featured?.length || 0} 個專區</span>
      </div>
      <div class="quick-grid"></div>
    `;
    const quickGrid = quickSection.querySelector(".quick-grid");
    (currentPage.featured || []).forEach((id, index) => {
      const current = siteData.pages[id];
      const nav = siteData.nav.find((item) => item.id === id);
      if (!current || !nav) return;
      const link = document.createElement("a");
      link.className = "quick-entry";
      link.href = nav.href;
      link.innerHTML = `
        <span class="quick-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="quick-copy"><strong>${escapeHtml(nav.label)}</strong><small>${escapeHtml(nav.note || current.subtitle || "查看專區")}</small></span>
        <span class="quick-arrow" aria-hidden="true">→</span>
      `;
      quickGrid.appendChild(link);
    });
    wrap.appendChild(quickSection);
    return wrap;
  }

  function renderPageHeader(currentPage) {
    const header = document.createElement("header");
    header.className = "page-header";
    header.innerHTML = `
      <div class="page-heading-copy">
        <p class="breadcrumb"><a href="index.html">員工工作台</a><span>/</span>${escapeHtml(currentPage.title || "專區")}</p>
        <h1>${escapeHtml(currentPage.title || "員工專區")}</h1>
        ${currentPage.subtitle ? `<p>${escapeHtml(currentPage.subtitle)}</p>` : ""}
      </div>
      <div class="page-actions"></div>
    `;
    const actions = header.querySelector(".page-actions");
    (currentPage.actions || []).forEach((action) => actions.appendChild(createActionLink(action, action.primary)));
    if (!actions.childElementCount) actions.remove();
    return header;
  }

  function createActionLink(action, primary) {
    const link = document.createElement("a");
    link.className = `button-link${primary ? " primary" : ""}`;
    link.href = action.href;
    link.textContent = action.label;
    if (isExternal(action.href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function renderLinksPanel(currentPage) {
    const panel = document.createElement("section");
    panel.className = "content-panel";
    panel.innerHTML = `
      <div class="section-heading compact">
        <div><p class="section-kicker">RESOURCES</p><h2>資源列表</h2></div>
        <span>${currentPage.links?.length || 0} 個項目</span>
      </div>
      <div class="resource-list"></div>
    `;
    const list = panel.querySelector(".resource-list");
    if (!currentPage.links?.length) {
      list.innerHTML = '<div class="empty-state">目前尚未新增連結。</div>';
      return panel;
    }
    currentPage.links.forEach((item) => list.appendChild(createResourceRow(item)));
    return panel;
  }

  function createResourceRow(item) {
    const row = document.createElement(item.actions?.length ? "article" : "a");
    row.className = `resource-row${item.actions?.length ? " has-actions" : ""}`;
    if (!item.actions?.length) {
      row.href = item.href;
      if (isExternal(item.href)) {
        row.target = "_blank";
        row.rel = "noopener noreferrer";
      }
    }
    row.innerHTML = `
      <span class="resource-type" aria-hidden="true">${escapeHtml(getTypeMark(item.tag))}</span>
      <span class="resource-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.description || item.tag || "資源連結")}</small>
      </span>
      <span class="resource-controls"></span>
    `;
    const controls = row.querySelector(".resource-controls");
    if (item.actions?.length) {
      item.actions.forEach((action, index) => {
        const link = createActionLink(action, index === 0);
        link.classList.add("resource-action");
        controls.appendChild(link);
      });
    } else {
      controls.innerHTML = `<span class="open-label">開啟</span><span class="open-arrow" aria-hidden="true">${isExternal(item.href) ? "↗" : "→"}</span>`;
    }
    return row;
  }

  function renderNotesPanel(title, notes) {
    const panel = document.createElement("section");
    panel.className = "content-panel info-panel";
    panel.innerHTML = `<div class="section-heading compact"><div><p class="section-kicker">NOTES</p><h2>${escapeHtml(title)}</h2></div></div><ul class="note-list"></ul>`;
    const list = panel.querySelector(".note-list");
    notes.forEach((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      list.appendChild(item);
    });
    return panel;
  }

  function renderLinkListPanel(title, items) {
    const panel = document.createElement("section");
    panel.className = "content-panel info-panel";
    panel.innerHTML = `<div class="section-heading compact"><div><p class="section-kicker">HELP</p><h2>${escapeHtml(title)}</h2></div></div><div class="link-stack"></div>`;
    const stack = panel.querySelector(".link-stack");
    items.forEach((item) => {
      const link = document.createElement("a");
      link.className = "inline-link";
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span>${escapeHtml(item.title)}</span><span aria-hidden="true">↗</span>`;
      stack.appendChild(link);
    });
    return panel;
  }

  function renderHtmlPanel(html, title) {
    const panel = document.createElement("section");
    panel.className = "content-panel";
    panel.innerHTML = `<div class="section-heading compact"><div><p class="section-kicker">DETAILS</p><h2>${escapeHtml(title)}</h2></div></div>${html}`;
    return panel;
  }

  function renderOverviewPanel(siteData) {
    const items = siteData.nav.filter((item) => !["index", "staff_area", "gp01"].includes(item.id));
    const panel = document.createElement("section");
    panel.className = "content-panel";
    panel.innerHTML = `
      <div class="section-heading compact"><div><p class="section-kicker">ALL RESOURCES</p><h2>資源總覽</h2></div><span>${items.length} 個專區</span></div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>類別</th><th>專區頁面</th><th>資源連結</th><th>補充說明</th><th>常見問題</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
    `;
    const tbody = panel.querySelector("tbody");
    items.forEach((item) => {
      const current = siteData.pages[item.id];
      const row = document.createElement("tr");
      const resourceLinks = (current.links || []).map((link) => {
        if (link.actions?.length) {
          const actions = link.actions.map((action) => `<a class="table-card" href="${escapeAttr(action.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(action.label)}</a>`).join("");
          return `<div class="table-group"><strong>${escapeHtml(link.title)}</strong><div>${actions}</div></div>`;
        }
        return `<a class="table-card" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`;
      }).join("");
      const notes = (current.notes || []).map((note) => `<div>${escapeHtml(note)}</div>`).join("") || "—";
      const faq = (current.faq || []).map((link) => `<a class="table-link" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`).join("<br>") || "—";
      row.innerHTML = `
        <td><span class="table-category">${escapeHtml(item.group || "其他")}</span></td>
        <td><a class="table-link" href="${escapeAttr(item.href)}">${escapeHtml(current.title)}</a></td>
        <td>${resourceLinks || "—"}</td><td>${notes}</td><td>${faq}</td>
      `;
      tbody.appendChild(row);
    });
    return panel;
  }

  function setupSearch(root, siteData) {
    const layer = root.querySelector(".search-layer");
    const toggleButton = root.querySelector(".search-toggle");
    const input = root.querySelector(".search-field input");
    const results = root.querySelector(".search-results");
    const closeButtons = root.querySelectorAll(".search-close, .search-backdrop");
    const searchItems = buildSearchIndex(siteData);

    const renderResults = (query) => {
      const keyword = query.trim().toLocaleLowerCase("zh-TW");
      results.innerHTML = "";
      if (!keyword) {
        results.innerHTML = '<p class="search-hint">輸入關鍵字即可搜尋所有專區與資源。</p>';
        return;
      }
      const matches = searchItems
        .filter((item) => item.searchText.includes(keyword))
        .sort((a, b) => Number(b.title.toLocaleLowerCase("zh-TW").startsWith(keyword)) - Number(a.title.toLocaleLowerCase("zh-TW").startsWith(keyword)))
        .slice(0, 12);
      if (!matches.length) {
        results.innerHTML = `<p class="search-hint">找不到「${escapeHtml(query.trim())}」的相關結果。</p>`;
        return;
      }
      matches.forEach((item) => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = item.href;
        if (isExternal(item.href)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        link.innerHTML = `<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.context)}</small></span><span aria-hidden="true">${isExternal(item.href) ? "↗" : "→"}</span>`;
        results.appendChild(link);
      });
    };

    const openSearch = () => {
      layer.hidden = false;
      document.body.classList.add("search-open");
      toggleButton.setAttribute("aria-expanded", "true");
      renderResults(input.value);
      requestAnimationFrame(() => input.focus());
    };
    const closeSearch = () => {
      layer.hidden = true;
      document.body.classList.remove("search-open");
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.focus();
    };
    toggleButton.addEventListener("click", openSearch);
    closeButtons.forEach((button) => button.addEventListener("click", closeSearch));
    input.addEventListener("input", () => renderResults(input.value));
    results.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeSearch();
    });
    document.addEventListener("keydown", (event) => {
      const isTyping = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if ((event.key === "/" && !isTyping) || (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey))) {
        event.preventDefault();
        openSearch();
      } else if (event.key === "Escape" && !layer.hidden) {
        closeSearch();
      }
    });
  }

  function buildSearchIndex(siteData) {
    const items = [];
    siteData.nav.forEach((navItem) => {
      const currentPage = siteData.pages[navItem.id];
      if (!currentPage) return;
      items.push(createSearchItem(navItem.label, navItem.href, navItem.group || "專區", [navItem.note, currentPage.title, currentPage.subtitle]));
      (currentPage.links || []).forEach((link) => {
        if (link.actions?.length) {
          link.actions.forEach((action) => items.push(createSearchItem(action.label, action.href, `${navItem.label} · ${link.title}`, [link.tag, link.description])));
        } else if (link.href) {
          items.push(createSearchItem(link.title, link.href, navItem.label, [link.tag, link.description]));
        }
      });
      (currentPage.faq || []).forEach((faq) => items.push(createSearchItem(faq.title, faq.href, `${navItem.label} · 常見問題`, [])));
    });
    return items;
  }

  function createSearchItem(title, href, context, keywords) {
    return { title, href, context, searchText: [title, context, ...keywords].filter(Boolean).join(" ").toLocaleLowerCase("zh-TW") };
  }

  function groupItems(items) {
    const groups = new Map();
    items.forEach((item) => {
      const group = item.group || "服務處專區";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    });
    return Array.from(groups.entries());
  }

  function getTypeMark(tag) {
    const value = tag || "";
    if (value.includes("系統") || value.includes("平台")) return "系";
    if (value.includes("雲端") || value.includes("共享")) return "雲";
    if (value.includes("表") || value.includes("試算")) return "表";
    if (value.includes("下載") || value.includes("工具")) return "具";
    if (value.includes("文件") || value.includes("說明")) return "文";
    return "連";
  }

  function isExternal(href) {
    return String(href || "").startsWith("http");
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
