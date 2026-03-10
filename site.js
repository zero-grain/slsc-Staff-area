(function () {
  const data = window.SITE_DATA;
  if (!data) return;

  const pageId = document.body.dataset.page || location.pathname.split("/").pop().replace(".html", "") || "index";
  const page = data.pages[pageId] || data.pages.index;

  document.title = page.title ? `${page.title} | 員工專區` : "員工專區";
  document.body.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <img src="Administrative Chu.png" alt="行管處 Logo">
        <div class="brand-title">
          <strong>員工專區</strong>
          <span>SLSC Staff Area</span>
        </div>
      </div>
      <p class="nav-label">Navigation</p>
      <nav class="nav-list" aria-label="頁面導覽"></nav>
      <div class="sidebar-footer">
        新增專區時，優先修改 <strong>site-data.js</strong>。
        <br>
        側欄、首頁與總覽表會一起同步。
      </div>
    </aside>
    <div class="sidebar-backdrop" aria-hidden="true"></div>
    <main class="main">
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">選單</button>
      <div id="page-root"></div>
    </main>
  `;
  document.body.appendChild(shell);

  const navRoot = shell.querySelector(".nav-list");
  navRoot.id = "main-nav";
  data.nav.forEach((item) => {
    const link = document.createElement("a");
    link.className = `nav-link${item.id === pageId ? " active" : ""}`;
    link.href = item.href;
    link.innerHTML = `${escapeHtml(item.label)}<small>${escapeHtml(item.note || "")}</small>`;
    navRoot.appendChild(link);
  });

  shell.querySelector("#page-root").appendChild(renderPage(page, data));

  const toggle = shell.querySelector(".menu-toggle");
  const backdrop = shell.querySelector(".sidebar-backdrop");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  backdrop.addEventListener("click", closeNav);
  navRoot.addEventListener("click", () => {
    if (window.innerWidth <= 980) closeNav();
  });

  function renderPage(currentPage, siteData) {
    const wrap = document.createElement("div");
    wrap.className = "content-stack";

    const hero = document.createElement("section");
    hero.className = "hero";
    hero.innerHTML = `
      <div class="page-head">
        <div class="page-head-copy">
          <p class="eyebrow">Staff Portal</p>
          <h1 class="page-title">${escapeHtml(currentPage.title || "員工專區")}</h1>
          <p class="page-subtitle">${escapeHtml(currentPage.subtitle || "")}</p>
          ${currentPage.intro ? `<p class="page-subtitle">${escapeHtml(currentPage.intro)}</p>` : ""}
          <div class="hero-actions"></div>
        </div>
      </div>
    `;
    wrap.appendChild(hero);

    const actions = hero.querySelector(".hero-actions");
    (currentPage.actions || []).forEach((action) => {
      const anchor = document.createElement("a");
      anchor.className = `button-link${action.primary ? " primary" : ""}`;
      anchor.href = action.href;
      anchor.textContent = action.label;
      if (action.href.startsWith("http")) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      actions.appendChild(anchor);
    });
    if (!actions.childElementCount) actions.remove();

    if (currentPage.type === "home") {
      wrap.appendChild(renderFeaturedPanel(currentPage, siteData));
    } else if (currentPage.type === "links") {
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

  function renderFeaturedPanel(currentPage, siteData) {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `
      <h2 class="panel-title">常用專區</h2>
      <p class="panel-subtitle">首頁用卡片快速帶你進到常用頁面。</p>
      <div class="card-grid"></div>
    `;
    const grid = panel.querySelector(".card-grid");

    (currentPage.featured || []).forEach((id) => {
      const current = siteData.pages[id];
      const nav = siteData.nav.find((item) => item.id === id);
      if (!current || !nav) return;
      grid.appendChild(
        createCard({
          title: nav.label,
          description: current.subtitle,
          href: nav.href,
          tag: current.links ? `${current.links.length} 個項目` : "頁面"
        })
      );
    });
    return panel;
  }

  function renderLinksPanel(currentPage) {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `
      <h2 class="panel-title">資源列表</h2>
      <p class="panel-subtitle">下列卡片與總覽表都使用同一份資料生成。</p>
      <div class="card-grid"></div>
    `;

    const grid = panel.querySelector(".card-grid");
    if (!currentPage.links?.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "目前尚未新增連結。後續只要在 site-data.js 的對應頁面補上 links，即可自動顯示。";
      grid.replaceWith(empty);
      return panel;
    }

    currentPage.links.forEach((item) => {
      grid.appendChild(
        createCard({
          title: item.title,
          description: item.description || "點擊後會開啟外部資源。",
          href: item.href,
          external: true,
          tag: item.tag || "連結"
        })
      );
    });

    return panel;
  }

  function renderNotesPanel(title, notes) {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `<h2 class="panel-title">${escapeHtml(title)}</h2><ul class="note-list"></ul>`;
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
    panel.className = "panel";
    panel.innerHTML = `<h2 class="panel-title">${escapeHtml(title)}</h2><div class="link-stack"></div>`;
    const stack = panel.querySelector(".link-stack");
    items.forEach((item) => {
      const link = document.createElement("a");
      link.className = "inline-link";
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = item.title;
      stack.appendChild(link);
    });
    return panel;
  }

  function renderHtmlPanel(html, title) {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `<h2 class="panel-title">${escapeHtml(title)}</h2>${html}`;
    return panel;
  }

  function renderOverviewPanel(siteData) {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `
      <h2 class="panel-title">資源總覽</h2>
      <p class="panel-subtitle">所有專區摘要一覽。之後新增或調整資料時，這裡會跟著更新。</p>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>類別</th>
              <th>專區頁面</th>
              <th>資源連結</th>
              <th>補充說明</th>
              <th>常見問題</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;

    const tbody = panel.querySelector("tbody");
    siteData.nav
      .filter((item) => !["index", "staff_area", "gp01"].includes(item.id))
      .forEach((item) => {
        const current = siteData.pages[item.id];
        const row = document.createElement("tr");
        const resourceLinks = (current.links || [])
          .map((link) => `<a class="table-card" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`)
          .join("");
        const notes = (current.notes || []).map((note) => `<div>${escapeHtml(note)}</div>`).join("") || "—";
        const faq = (current.faq || [])
          .map((link) => `<a class="inline-link" href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`)
          .join("<br>") || "—";

        row.innerHTML = `
          <td>${escapeHtml(item.label)}</td>
          <td><a class="inline-link" href="${escapeAttr(item.href)}">${escapeHtml(current.title)}</a></td>
          <td>${resourceLinks || "—"}</td>
          <td>${notes}</td>
          <td>${faq}</td>
        `;
        tbody.appendChild(row);
      });

    return panel;
  }

  function createCard({ title, description, href, external, tag }) {
    const anchor = document.createElement("a");
    anchor.className = "resource-card";
    anchor.href = href;
    if (external || href.startsWith("http")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    anchor.innerHTML = `
      <div class="resource-tag">${escapeHtml(tag || "連結")}</div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description || "")}</p>
      <div class="resource-meta"><span>立即前往</span><span aria-hidden="true">→</span></div>
    `;
    return anchor;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
