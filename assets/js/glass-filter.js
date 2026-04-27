/* ============================================================
   Liquid Glass SVG Filter Injector
   .glass / .section の ::before で filter: url(#glass-distortion) を使うため、
   表示時に SVG フィルターを body に注入する。
   liquid-glass を使うページでは必ず読み込む。
   ============================================================ */

(function () {
  function inject() {
    if (document.getElementById('glass-distortion')) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('style', 'position:absolute;width:0;height:0;pointer-events:none;overflow:hidden;');
    svg.innerHTML = `
      <defs>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="17" result="turbulence"/>
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5"/>
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0"/>
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5"/>
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap"/>
          <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lighting-color="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300"/>
          </feSpecularLighting>
          <feComposite in="specLight" in2="sourceAlpha" operator="in" result="specLight"/>
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="150" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
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
