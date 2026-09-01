"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { i18n, type Lang } from "./site-data";

const STORAGE_KEY = "applibrary_state";

export const ACCENTS = ["#0A84FF", "#FF3B30", "#34C759", "#AF52DE", "#FF9500", "#5856D6"] as const;

export type Prefs = {
  theme: "light" | "dark";
  accent: string;
  layout: "mosaic" | "grid" | "list";
  density: "tight" | "relaxed" | "spacious";
  font: "sans" | "serif" | "mono";
  lang: Lang;
};

const DEFAULTS: Prefs = {
  theme: "dark",
  accent: "#0A84FF",
  layout: "mosaic",
  density: "relaxed",
  font: "sans",
  lang: "ja",
};

/**
 * localStorage は React の外にある状態なので useSyncExternalStore で購読する。
 * サーバーでは DEFAULTS を返し、hydration 後に保存値へ切り替わる。
 * useEffect + setState では cascading render になり React 19 の lint にも反する。
 */
const listeners = new Set<() => void>();

/** getSnapshot は同一参照を返す必要があるためキャッシュする。 */
let snapshot: Prefs | null = null;

function readStorage(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    // localStorage が使えない環境では既定値で動かす。
  }
  return DEFAULTS;
}

function getSnapshot(): Prefs {
  snapshot ??= readStorage();
  return snapshot;
}

function getServerSnapshot(): Prefs {
  return DEFAULTS;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** <html> の data-* 属性へ反映する。初回描画前の適用は layout.tsx のインラインスクリプトが担う。 */
function applyToDocument(prefs: Prefs) {
  const html = document.documentElement;
  html.lang = prefs.lang;
  html.setAttribute("data-theme", prefs.theme);
  html.setAttribute("data-layout", prefs.layout);
  html.setAttribute("data-density", prefs.density);
  html.setAttribute("data-font", prefs.font);
  html.style.setProperty("--accent", prefs.accent);
}

function writePrefs(patch: Partial<Prefs>) {
  const next = { ...getSnapshot(), ...patch };
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 保存できなくても操作自体は継続させる。
  }
  applyToDocument(next);
  for (const listener of listeners) listener();
}

type Ctx = {
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  t: (typeof i18n)[Lang];
};

const SiteStateContext = createContext<Ctx | null>(null);

export function SiteStateProvider({ children }: { children: React.ReactNode }) {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setPrefs = useCallback((patch: Partial<Prefs>) => writePrefs(patch), []);

  // 保存値が無い初回訪問では layout.tsx のインラインスクリプトが属性を付けないため、
  // ここで必ず既定値を <html> へ反映する。旧 main.js の init 時 applyState() と同じ役割。
  useEffect(() => {
    applyToDocument(prefs);
  }, [prefs]);
  const value = useMemo<Ctx>(() => ({ prefs, setPrefs, t: i18n[prefs.lang] }), [prefs, setPrefs]);

  return <SiteStateContext.Provider value={value}>{children}</SiteStateContext.Provider>;
}

export function useSiteState(): Ctx {
  const ctx = useContext(SiteStateContext);
  if (!ctx) throw new Error("useSiteState は SiteStateProvider の内側でのみ使える");
  return ctx;
}
