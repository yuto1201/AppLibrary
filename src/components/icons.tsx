/** 旧 main.js のインライン SVG を React へ移したもの。形状は変更していない。 */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth={2} {...stroke} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export const IconApple = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.2 9.9.9 1.2 1.9 2.5 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4.7-1 1.3-2.1 1.7-3.3-1.6-.6-2.9-2.4-3.1-4.3ZM14.7 5.1c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.6.8-1.2 2-1.1 3.2 1.1.1 2.2-.6 3-1.5Z" />
  </svg>
);

export const IconArrowNE = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

export const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2} {...stroke} aria-hidden="true">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

export const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2} {...stroke} aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
