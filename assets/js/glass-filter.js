/* ============================================================
   Liquid Glass SVG Filter Injector
   .section::after 等で filter: url(#glass-distortion) を使うため、
   ページ表示時に SVG フィルターを body に注入する。
   liquid-glass を使うページでは必ず読み込む。
   ============================================================ */

(function () {
  function inject() {
    if (document.getElementById('glass-distortion')) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;pointer-events:none;overflow:hidden;');
    svg.innerHTML = `
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="5" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77"/>
      </filter>
    `;
    const host = document.body || document.documentElement;
    host.insertBefore(svg, host.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
