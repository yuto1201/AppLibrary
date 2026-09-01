"use client";

import { useState } from "react";
import { useSiteState } from "@/lib/state";
import { profile, posts } from "@/lib/site-data";
import { IconSun, IconMoon, IconMenu, IconClose } from "./icons";

export function Nav() {
  const { prefs, setPrefs, t } = useSiteState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasPosts = posts.length > 0;

  return (
    <nav className={`nav${mobileOpen ? " is-open" : ""}`} aria-label={t.a11y_primary_nav}>
      <div className="nav-inner glass">
        <div className="nav-brand">{profile.name}</div>
        <div className="nav-links" id="primary-nav">
          <a href="#apps" onClick={() => setMobileOpen(false)}>{t.nav.apps}</a>
          {hasPosts && <a href="#posts" onClick={() => setMobileOpen(false)}>{t.nav.posts}</a>}
          <a href="#contact" onClick={() => setMobileOpen(false)}>{t.nav.contact}</a>
        </div>
        <div className="nav-tools">
          <button
            className="icon-btn"
            type="button"
            title={t.a11y_language}
            aria-label={t.a11y_switch_language}
            onClick={() => setPrefs({ lang: prefs.lang === "ja" ? "en" : "ja" })}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>{prefs.lang === "ja" ? "EN" : "JA"}</span>
          </button>
          <button
            className="icon-btn"
            type="button"
            title={t.a11y_theme}
            aria-label={prefs.theme === "dark" ? t.a11y_switch_light : t.a11y_switch_dark}
            onClick={() => setPrefs({ theme: prefs.theme === "dark" ? "light" : "dark" })}
          >
            {prefs.theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          <button
            className="icon-btn nav-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="primary-nav"
            aria-label={mobileOpen ? t.a11y_close_menu : t.a11y_open_menu}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
