/* ============================================================
   AppLibrary トップページ — レンダラー＆インタラクション
   依存: window.APP_REGISTRY (apps/registry.js)
        window.SITE_DATA   (assets/js/site-data.js)
   方針: バニラ JS / ビルド不要 / DOM は innerHTML + イベント委譲
   ============================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'applibrary_state';
  const ACCENTS = ['#0A84FF', '#FF3B30', '#34C759', '#AF52DE', '#FF9500', '#5856D6'];
  const DEFAULTS = {
    theme: 'dark',
    accent: '#0A84FF',
    layout: 'mosaic',
    density: 'relaxed',
    font: 'sans',
    lang: 'ja',
  };

  let state = loadState();
  let search = '';
  let activeCat = 0;
  let modalApp = null;
  let tweaksOpen = false;
  let revealObserver = null;
  let mobileNavOpen = false;
  let previouslyFocused = null;
  let composing = false;
  const isDev = (function () {
    try { return new URLSearchParams(location.search).has('dev'); } catch (_) { return false; }
  })();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return Object.assign({}, DEFAULTS, saved);
    } catch (_) {}
    return Object.assign({}, DEFAULTS);
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }
  function applyState() {
    const html = document.documentElement;
    html.setAttribute('data-theme',   state.theme);
    html.setAttribute('data-layout',  state.layout);
    html.setAttribute('data-density', state.density);
    html.setAttribute('data-font',    state.font);
    html.style.setProperty('--accent', state.accent);
  }
  function setState(patch) {
    state = Object.assign({}, state, patch);
    applyState();
    saveState();
    render();
  }

  // ────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
  function attr(s) { return esc(s).replace(/\n/g, ' '); }
  function t() { return window.SITE_DATA.i18n[state.lang]; }
  function statusLabel(status) {
    const T = t();
    if (status === 'alpha')   return T.status_alpha;
    if (status === 'beta')    return T.status_beta;
    if (status === 'release') return T.status_release;
    return '';
  }
  function appIconHTML(app) {
    if (app.icon) {
      const src = `./apps/${esc(app.slug)}/${esc(app.icon)}`;
      const fallback = esc(app.iconGlyph || app.name.slice(0, 1));
      return `<img src="${src}" alt="" loading="lazy"
                   onerror="this.outerHTML='${fallback.replace(/'/g, "\\'")}'">`;
    }
    return esc(app.iconGlyph || app.name.slice(0, 1));
  }

  // 文字分割: 1 行のテキストを <span class="hero-letter" style="--i:N"> 群に変換。
  // サロゲートペア対応のため Array.from を使う。スペースは &nbsp; に置換。
  // baseIndex は連番の開始値（複数行で letter index を通し番号にしたいときに使う）。
  function splitToLetters(text, baseIndex) {
    if (text == null) return { html: '', count: 0 };
    var chars = Array.from(String(text));
    var html = chars.map(function (ch, i) {
      var safe = ch === ' ' ? '&nbsp;' : esc(ch);
      return '<span class="hero-letter" style="--i:' + (baseIndex + i) + '">' + safe + '</span>';
    }).join('');
    return { html: html, count: chars.length };
  }

  // ────────────────────────────────────────────────────────────
  // SVG icons (inline)
  // ────────────────────────────────────────────────────────────
  const ICON_SEARCH = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
  const ICON_SUN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
  const ICON_MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>`;
  const ICON_SLIDER = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="21" y2="21"/><line x1="4" x2="20" y1="10" y2="10"/><line x1="12" x2="12" y1="21" y2="14"/><line x1="12" x2="12" y1="10" y2="3"/><line x1="4" x2="20" y1="14" y2="14"/><line x1="8" x2="8" y1="14" y2="21"/><line x1="16" x2="16" y1="3" y2="10"/></svg>`;
  const ICON_APPLE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.2 9.9.9 1.2 1.9 2.5 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4.7-1 1.3-2.1 1.7-3.3-1.6-.6-2.9-2.4-3.1-4.3ZM14.7 5.1c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.6.8-1.2 2-1.1 3.2 1.1.1 2.2-.6 3-1.5Z"/></svg>`;
  const ICON_ARROW_NE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`;
  const ICON_ARROW_DOWN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;
  const ICON_MENU = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>`;
  const ICON_CLOSE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  // ────────────────────────────────────────────────────────────
  // Section renderers
  // ────────────────────────────────────────────────────────────
  function renderNav() {
    const T = t();
    const profile = window.SITE_DATA.profile;
    const themeIcon = state.theme === 'dark' ? ICON_SUN : ICON_MOON;
    const langLabel = state.lang === 'ja' ? 'EN' : 'JA';
    const hasPosts = (window.SITE_DATA.posts || []).length > 0;
    const navOpenClass = mobileNavOpen ? ' is-open' : '';
    const navToggleIcon = mobileNavOpen ? ICON_CLOSE : ICON_MENU;
    return `
      <nav class="nav${navOpenClass}" aria-label="Primary">
        <div class="nav-inner glass">
          <div class="nav-brand">${esc(profile.name)}</div>
          <div class="nav-links" id="primary-nav">
            <a href="#apps" data-action="close-mobile-nav">${esc(T.nav.apps)}</a>
            ${hasPosts ? `<a href="#posts" data-action="close-mobile-nav">${esc(T.nav.posts)}</a>` : ''}
            <a href="#contact" data-action="close-mobile-nav">${esc(T.nav.contact)}</a>
          </div>
          <div class="nav-tools">
            <button class="icon-btn" data-action="toggle-lang" title="Language" aria-label="${attr(state.lang === 'ja' ? 'Switch to English' : '日本語に切替')}">
              <span style="font-size:12px;font-weight:600;">${esc(langLabel)}</span>
            </button>
            <button class="icon-btn" data-action="toggle-theme" title="Theme" aria-label="${attr(state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')}">${themeIcon}</button>
            ${isDev ? `<button class="icon-btn" data-action="toggle-tweaks" title="Tweaks (dev)" aria-label="Open tweaks panel">${ICON_SLIDER}</button>` : ''}
            <button class="icon-btn nav-toggle" data-action="toggle-mobile-nav" aria-expanded="${mobileNavOpen ? 'true' : 'false'}" aria-controls="primary-nav" aria-label="${attr(mobileNavOpen ? 'Close menu' : 'Open menu')}">${navToggleIcon}</button>
          </div>
        </div>
      </nav>
    `;
  }

  function renderHero() {
    const T = t();
    const profile = window.SITE_DATA.profile;
    const total = (window.APP_REGISTRY || []).length;

    const lineA = splitToLetters(T.hero_h1_a, 0);
    const lineB = splitToLetters(T.hero_h1_b, lineA.count);
    const ariaLabel = (T.hero_h1_a || '') + (T.hero_h1_b || '');

    return `
      <section class="hero">
        <div class="hero-eyebrow reveal">${esc(T.hero_eyebrow)} · ${esc(profile.tagline)}</div>
        <h1 class="hero-h1 reveal" style="transition-delay:80ms;" aria-label="${attr(ariaLabel)}">
          <span class="hero-line" aria-hidden="true">${lineA.html}</span>
          <span class="hero-line accent" aria-hidden="true">${lineB.html}</span>
        </h1>
        <p class="hero-bio reveal" style="transition-delay:160ms;">${esc(profile.bio)}</p>
        <div class="hero-meta reveal" style="transition-delay:240ms;">
          <span>📍 ${esc(profile.location)}</span>
          <span>● ${total} ${esc(T.hero_meta_apps)}</span>
          <span>● Swift · SwiftUI</span>
        </div>
        <div class="hero-cta-wrap reveal" style="transition-delay:320ms;">
          <a class="cta-btn" href="#apps">
            <span>${esc(T.hero_cta)}</span>
            ${ICON_ARROW_DOWN}
          </a>
        </div>
      </section>
    `;
  }

  function visibleCategories() {
    const labels = window.SITE_DATA.allCategoryLabel || { ja: 'すべて', en: 'All' };
    const allLabel = labels[state.lang] || labels.ja || 'All';
    const used = new Set();
    (window.APP_REGISTRY || []).forEach((a) => { if (a.category) used.add(a.category); });
    return [allLabel, ...Array.from(used).sort((a, b) => a.localeCompare(b, state.lang))];
  }

  function renderApps() {
    const T = t();
    const cats = visibleCategories();
    const all = window.APP_REGISTRY || [];
    const q = search.trim().toLowerCase();
    const catName = cats[activeCat];
    const filtered = all.filter((app) => {
      if (activeCat > 0 && app.category !== catName) return false;
      if (!q) return true;
      const hay = [app.name, app.tagline, app.description, app.category].join(' ').toLowerCase();
      return hay.includes(q);
    });

    const cardsHTML = filtered.length === 0
      ? `<div class="empty">
           <div class="empty-title">${esc(T.empty_title)}</div>
           <div>${esc(T.empty_sub)}</div>
         </div>`
      : filtered.map((app, i) => renderAppCard(app, i)).join('');

    const chipsHTML = cats.map((c, i) => `
      <button class="chip${i === activeCat ? ' active' : ''}" data-action="set-cat" data-cat="${i}">
        ${esc(c)}
      </button>
    `).join('');

    return `
      <section class="section" id="apps">
        <div class="section-head">
          <div>
            <h2 class="section-title">${esc(T.section_apps)}</h2>
            <div class="section-sub">${esc(T.section_apps_sub)}</div>
          </div>
        </div>
        <div class="controls">
          <div class="search">
            ${ICON_SEARCH}
            <input id="search-input" type="text"
                   placeholder="${attr(T.search_placeholder)}"
                   value="${attr(search)}"
                   autocomplete="off">
          </div>
          <div class="chips">${chipsHTML}</div>
        </div>
        <div class="mosaic">${cardsHTML}</div>
      </section>
    `;
  }

  function renderAppCard(app, i) {
    const styleVars = `--card-color:${esc(app.color || 'rgba(255,255,255,0.4)')};` +
                      `--card-accent:${esc(app.accent || 'rgba(255,255,255,0.2)')};` +
                      `transition-delay:${Math.min(i * 40, 200)}ms;`;
    const ratingHTML = (app.rating != null)
      ? `<span class="app-rating">
           <span class="star">★</span> ${Number(app.rating).toFixed(1)}
           ${app.reviews != null ? `<span style="opacity:.5;">(${esc(app.reviews)})</span>` : ''}
         </span>`
      : `<span class="app-status">${esc(statusLabel(app.status))}</span>`;
    const priceHTML = app.price ? `<span>${esc(app.price)}</span>` : '<span>iOS</span>';
    const featured = app.featured ? ' featured' : '';
    const introHref = app.introUrl ? attr(app.introUrl) : '';
    const directLinkLabel = state.lang === 'ja' ? `${app.name} の個別ページへ` : `Open ${app.name} site`;
    return `
      <article class="app-card glass reveal${featured}" style="${styleVars}"
               role="button" tabindex="0"
               data-action="open-modal" data-slug="${attr(app.slug)}"
               aria-label="${attr(app.name + ' — ' + (app.tagline || ''))}">
        <div class="bg-shape"></div>
        <div class="app-icon">${appIconHTML(app)}</div>
        <div class="app-body">
          ${app.category ? `<div class="app-category">${esc(app.category)}</div>` : ''}
          <h3 class="app-name">${esc(app.name)}</h3>
          <p class="app-tagline">${esc(app.tagline || '')}</p>
          <div class="app-footer">
            ${ratingHTML}
            ${priceHTML}
          </div>
        </div>
        ${introHref ? `<a class="app-card-direct" href="${introHref}"
                          data-stop-card aria-label="${attr(directLinkLabel)}"
                          title="${attr(directLinkLabel)}">${ICON_ARROW_NE}</a>` : ''}
      </article>
    `;
  }

  function renderPosts() {
    const T = t();
    const posts = window.SITE_DATA.posts || [];
    if (posts.length === 0) return '';
    return `
      <section class="section" id="posts">
        <div class="section-head">
          <div>
            <h2 class="section-title">${esc(T.section_posts)}</h2>
            <div class="section-sub">${esc(T.section_posts_sub)}</div>
          </div>
        </div>
        <div class="posts">
          ${posts.map((p, i) => `
            <article class="post glass reveal" style="transition-delay:${i * 60}ms;">
              <div class="post-date">${esc(p.date)}</div>
              <h3 class="post-title">${esc(p.title)}</h3>
              <p class="post-excerpt">${esc(p.excerpt)}</p>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderContact() {
    const T = t();
    const allSocial = window.SITE_DATA.social || [];
    // url が空 / `#` のエントリは未公開とみなして描画しない（プレースホルダー隠し）
    const social = allSocial.filter((s) => s.url && s.url !== '#');
    if (social.length === 0) {
      return `
        <section class="section" id="contact">
          <div class="contact glass reveal">
            <h2>${esc(T.contact_h)}</h2>
            <p>${esc(T.contact_p)}</p>
          </div>
        </section>
      `;
    }
    return `
      <section class="section" id="contact">
        <div class="contact glass reveal">
          <h2>${esc(T.contact_h)}</h2>
          <p>${esc(T.contact_p)}</p>
          <div class="socials">
            ${social.map((s) => `
              <a class="social-link" href="${attr(s.url)}"
                 ${/^https?:/.test(s.url) ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <strong>${esc(s.label)}</strong>
                <span class="social-handle">${esc(s.handle)}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const T = t();
    const profile = window.SITE_DATA.profile;
    const firstApp = (window.APP_REGISTRY || [])[0];
    const privacyHref = firstApp ? firstApp.privacyUrl : '#';
    return `
      <footer class="footer">
        <div>${esc(T.footer_copyright)}</div>
        <div>
          <a href="${attr(privacyHref)}">${esc(T.privacy)}</a>
          &nbsp;·&nbsp;
          ${esc(profile.name)}
        </div>
      </footer>
    `;
  }

  // ────────────────────────────────────────────────────────────
  // Modal
  // ────────────────────────────────────────────────────────────
  function renderModal() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    if (!modalApp) {
      root.innerHTML = '';
      document.body.style.overflow = '';
      return;
    }
    const T = t();
    const app = modalApp;
    const releaseLabel = app.releaseDate || (app.year ? String(app.year) : T.tba);
    const dlAvailable = !!app.appStoreUrl;
    const dlSmall = T.modal_dl_small;
    const dlLarge = dlAvailable ? T.modal_dl_large : T.modal_dl_unavailable;
    const visitHref = app.introUrl || `./apps/${app.slug}/index.html`;
    const styleVars = `--card-color:${esc(app.color || 'rgba(255,255,255,0.4)')};` +
                      `--card-accent:${esc(app.accent || 'rgba(255,255,255,0.2)')};`;
    root.innerHTML = `
      <div class="modal-backdrop open" data-action="close-modal">
        <div class="modal glass" role="dialog" aria-modal="true">
          <button class="modal-close" data-action="close-modal" aria-label="Close">×</button>
          <div class="modal-header">
            <div class="app-icon" style="${styleVars}">${appIconHTML(app)}</div>
            <div class="modal-meta">
              ${app.category ? `<div class="app-category" style="${styleVars}">${esc(app.category)}</div>` : ''}
              <h2>${esc(app.name)}</h2>
              <p class="modal-tagline">${esc(app.tagline || '')}</p>
            </div>
          </div>

          <div class="modal-stats">
            <div>
              <div class="stat-label">${esc(T.stat_version)}</div>
              <div class="stat-value">${esc(app.version || T.stat_unset)}</div>
            </div>
            <div>
              <div class="stat-label">${esc(T.stat_status)}</div>
              <div class="stat-value">${esc(statusLabel(app.status) || T.stat_unset)}</div>
            </div>
            <div>
              <div class="stat-label">${esc(T.stat_release)}</div>
              <div class="stat-value">${esc(releaseLabel)}</div>
            </div>
            <div>
              <div class="stat-label">${esc(T.stat_price)}</div>
              <div class="stat-value">${esc(app.price || T.stat_unset)}</div>
            </div>
          </div>

          ${app.description ? `<p class="modal-description">${esc(app.description)}</p>` : ''}

          ${(app.features && app.features.length)
            ? `<div class="feature-list">
                 ${app.features.map((f) => `<span class="feature-tag">${esc(f)}</span>`).join('')}
               </div>`
            : ''}

          <div class="modal-actions">
            <a class="badge-btn" ${dlAvailable
                  ? `href="${attr(app.appStoreUrl)}" target="_blank" rel="noopener noreferrer"`
                  : 'href="#" aria-disabled="true" onclick="return false;"'}>
              ${ICON_APPLE}
              <span class="badge-btn-stack">
                <span class="badge-btn-small">${esc(dlSmall)}</span>
                <span class="badge-btn-large">${esc(dlLarge)}</span>
              </span>
            </a>
            <a class="visit-btn" href="${attr(visitHref)}">
              <span>${esc(T.modal_visit_site)}</span>
              ${ICON_ARROW_NE}
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.style.overflow = 'hidden';
  }

  function openModal(app) {
    previouslyFocused = document.activeElement;
    modalApp = app;
    renderModal();
    requestAnimationFrame(() => {
      const modal = document.querySelector('#modal-root .modal');
      if (!modal) return;
      const close = modal.querySelector('.modal-close');
      if (close) close.focus();
    });
  }
  function closeModal() {
    const restoreTo = previouslyFocused;
    previouslyFocused = null;
    modalApp = null;
    renderModal();
    if (restoreTo && typeof restoreTo.focus === 'function') {
      try { restoreTo.focus(); } catch (_) {}
    }
  }

  // フォーカストラップ: modal が開いているとき Tab を modal 内で循環させる
  function trapFocus(ev) {
    if (!modalApp) return;
    const modal = document.querySelector('#modal-root .modal');
    if (!modal) return;
    const focusable = Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => el.getAttribute('aria-disabled') !== 'true' && el.offsetParent !== null);
    if (focusable.length === 0) { ev.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (ev.shiftKey) {
      if (active === first || !modal.contains(active)) { ev.preventDefault(); last.focus(); }
    } else {
      if (active === last || !modal.contains(active)) { ev.preventDefault(); first.focus(); }
    }
  }

  // ────────────────────────────────────────────────────────────
  // Tweaks panel
  // ────────────────────────────────────────────────────────────
  function renderTweaks() {
    const root = document.getElementById('tweaks-root');
    if (!root) return;
    const T = t();
    const opt = (label, value, key) => `
      <button class="tweak-opt${state[key] === value ? ' active' : ''}"
              data-action="tweak" data-key="${key}" data-value="${attr(value)}">
        ${esc(label)}
      </button>
    `;
    root.innerHTML = `
      <aside class="tweaks-panel glass${tweaksOpen ? ' visible' : ''}" aria-hidden="${tweaksOpen ? 'false' : 'true'}">
        <h3>${esc(T.tweaks_title)}</h3>
        <div class="tweak-row">
          <label>${esc(T.tweak_theme)}</label>
          <div class="tweak-options">
            ${opt(T.opt_light, 'light', 'theme')}
            ${opt(T.opt_dark,  'dark',  'theme')}
          </div>
        </div>
        <div class="tweak-row">
          <label>${esc(T.tweak_accent)}</label>
          <div class="color-swatches">
            ${ACCENTS.map((c) => `
              <button class="color-swatch${state.accent === c ? ' active' : ''}"
                      style="background:${esc(c)};"
                      data-action="tweak" data-key="accent" data-value="${attr(c)}"
                      aria-label="Accent ${attr(c)}"></button>
            `).join('')}
          </div>
        </div>
        <div class="tweak-row">
          <label>${esc(T.tweak_layout)}</label>
          <div class="tweak-options">
            ${opt(T.opt_mosaic, 'mosaic', 'layout')}
            ${opt(T.opt_grid,   'grid',   'layout')}
            ${opt(T.opt_list,   'list',   'layout')}
          </div>
        </div>
        <div class="tweak-row">
          <label>${esc(T.tweak_density)}</label>
          <div class="tweak-options">
            ${opt(T.opt_tight,    'tight',    'density')}
            ${opt(T.opt_relaxed,  'relaxed',  'density')}
            ${opt(T.opt_spacious, 'spacious', 'density')}
          </div>
        </div>
        <div class="tweak-row">
          <label>${esc(T.tweak_font)}</label>
          <div class="tweak-options">
            ${opt(T.opt_sans,  'sans',  'font')}
            ${opt(T.opt_serif, 'serif', 'font')}
            ${opt(T.opt_mono,  'mono',  'font')}
          </div>
        </div>
      </aside>
    `;
  }

  // ────────────────────────────────────────────────────────────
  // Reveal on scroll
  // ────────────────────────────────────────────────────────────
  function setupReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  }

  // ────────────────────────────────────────────────────────────
  // Render orchestration
  // ────────────────────────────────────────────────────────────
  function render() {
    const root = document.getElementById('root');
    if (!root) return;
    root.innerHTML =
      renderNav() +
      renderHero() +
      renderApps() +
      renderPosts() +
      renderContact() +
      renderFooter();
    renderModal();
    renderTweaks();
    setupReveal();
    // restore search focus if user is typing
    const input = document.getElementById('search-input');
    if (input && document.activeElement !== input && search) {
      // do nothing — search value persisted via re-render
    }
  }

  // ────────────────────────────────────────────────────────────
  // Event delegation
  // ────────────────────────────────────────────────────────────
  function rerenderApps() {
    const sectionEl = document.getElementById('apps');
    if (!sectionEl) return;
    sectionEl.outerHTML = renderApps();
    setupReveal();
    const input = document.getElementById('search-input');
    if (input) {
      input.focus();
      const len = input.value.length;
      try { input.setSelectionRange(len, len); } catch (_) {}
    }
  }

  function bindEvents() {
    document.addEventListener('click', (ev) => {
      // 直行リンク（カード内 <a>）はカードクリックを発火させない
      if (ev.target.closest('[data-stop-card]')) {
        return;
      }
      const target = ev.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      switch (action) {
        case 'toggle-lang':
          setState({ lang: state.lang === 'ja' ? 'en' : 'ja' });
          break;
        case 'toggle-theme':
          setState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
          break;
        case 'toggle-tweaks':
          tweaksOpen = !tweaksOpen;
          renderTweaks();
          break;
        case 'toggle-mobile-nav':
          mobileNavOpen = !mobileNavOpen;
          render();
          break;
        case 'close-mobile-nav':
          if (mobileNavOpen) {
            mobileNavOpen = false;
            render();
          }
          break;
        case 'set-cat': {
          const next = Number(target.dataset.cat || 0);
          if (next === activeCat) return;
          activeCat = next;
          render();
          break;
        }
        case 'open-modal': {
          const slug = target.dataset.slug;
          const app = (window.APP_REGISTRY || []).find((a) => a.slug === slug);
          if (app) openModal(app);
          break;
        }
        case 'close-modal':
          if (target.classList.contains('modal-close') || target.classList.contains('modal-backdrop')) {
            closeModal();
          }
          break;
        case 'tweak': {
          const key = target.dataset.key;
          const value = target.dataset.value;
          if (!key) return;
          setState({ [key]: value });
          break;
        }
        default:
          break;
      }
    });

    // app-card は <article role="button"> なのでキーボード活性化を自前で
    document.addEventListener('keydown', (ev) => {
      if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('app-card')) {
        ev.preventDefault();
        ev.target.click();
      }
    });

    // IME 入力対応: 変換中は再描画しない
    document.addEventListener('compositionstart', (ev) => {
      if (ev.target && ev.target.id === 'search-input') composing = true;
    });
    document.addEventListener('compositionend', (ev) => {
      if (ev.target && ev.target.id === 'search-input') {
        composing = false;
        search = ev.target.value;
        rerenderApps();
      }
    });

    // 検索 input — composing 中はスキップ
    document.addEventListener('input', (ev) => {
      if (ev.target && ev.target.id === 'search-input' && !composing) {
        search = ev.target.value;
        rerenderApps();
      }
    });

    // Esc / Tab トラップ
    document.addEventListener('keydown', (ev) => {
      if (modalApp && ev.key === 'Escape') {
        closeModal();
        return;
      }
      if (modalApp && ev.key === 'Tab') {
        trapFocus(ev);
      }
    });
  }

  // ────────────────────────────────────────────────────────────
  // Boot
  // ────────────────────────────────────────────────────────────
  function init() {
    if (!window.APP_REGISTRY || !window.SITE_DATA) {
      console.error('[AppLibrary] APP_REGISTRY or SITE_DATA not loaded.');
      return;
    }
    applyState();
    render();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
