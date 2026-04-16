/* ============================================================
   共通トップページのレンダリング
   apps/registry.js (window.APP_REGISTRY) を読んで app-grid を生成する。
   ============================================================ */

(function () {
  const STATUS_BADGE = {
    alpha:   { label: 'α 開発中',    cls: 'badge-warning' },
    beta:    { label: 'β テスト中',  cls: 'badge-primary' },
    release: { label: 'リリース済み', cls: 'badge-success' },
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function cardHTML(app) {
    const status = STATUS_BADGE[app.status];
    const href = app.introUrl || `./apps/${app.slug}/`;
    const iconSrc = app.icon ? `./apps/${app.slug}/${app.icon}` : null;
    return `
      <a class="app-card" href="${esc(href)}">
        <div class="app-card-thumb">
          ${iconSrc
            ? `<img src="${esc(iconSrc)}" alt="${esc(app.name)} アイコン" loading="lazy">`
            : `<div style="font-size:36px;font-weight:800;color:var(--glass-text-dim);">${esc(app.name.slice(0, 2))}</div>`}
        </div>
        <div class="app-card-body">
          <div class="app-card-name">${esc(app.name)}</div>
          <div class="app-card-desc">${esc(app.tagline || '')}</div>
          <div class="app-card-meta">
            ${app.platform ? `<span class="badge">${esc(app.platform)}</span>` : ''}
            ${status ? `<span class="badge ${status.cls}">${esc(status.label)}</span>` : ''}
          </div>
        </div>
      </a>
    `;
  }

  function render() {
    const grid = document.getElementById('app-grid');
    const empty = document.getElementById('empty-state');
    const apps = Array.isArray(window.APP_REGISTRY) ? window.APP_REGISTRY : [];

    if (!grid) return;

    if (apps.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    grid.innerHTML = apps.map(cardHTML).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
