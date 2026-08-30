"use client";

import { useMemo, useState } from "react";
import type { App } from "@/data/schema";
import { apps, usedCategories, usedPlatforms } from "@/data/registry";
import { useSiteState } from "@/lib/state";
import { allCategoryLabel, allPlatformLabel } from "@/lib/site-data";
import { AppCard } from "./AppCard";
import { AppModal } from "./AppModal";
import { IconSearch } from "./icons";

const ALL = "__all__";

export function AppsSection() {
  const { prefs, t } = useSiteState();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [modalApp, setModalApp] = useState<App | null>(null);

  const platforms = useMemo(() => usedPlatforms(), []);
  const categories = useMemo(
    () => [...usedCategories()].sort((a, b) => a.localeCompare(b, prefs.lang)),
    [prefs.lang],
  );

  const query = search.trim().toLowerCase();
  const hasFilters = query !== "" || platform !== ALL || category !== ALL;

  const filtered = apps.filter((app) => {
    if (platform !== ALL && !app.platforms.includes(platform as App["platforms"][number])) return false;
    if (category !== ALL && app.category !== category) return false;
    if (!query) return true;
    return [app.name, app.tagline, app.description, app.category, ...app.platforms]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  function clearFilters() {
    setSearch("");
    setPlatform(ALL);
    setCategory(ALL);
  }

  return (
    <section className="section" id="apps">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t.section_apps}</h2>
          <div className="section-sub">{t.section_apps_sub}</div>
        </div>
      </div>

      <div className="controls">
        <div className="search">
          <IconSearch />
          <input
            id="search-input"
            type="text"
            placeholder={t.search_placeholder}
            value={search}
            autoComplete="off"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* プラットフォーム軸。iOS 限定から複数プラットフォームへ広げたため新設した。 */}
        <div className="chips" role="group" aria-label={t.filter_platform}>
          <button type="button" className={`chip${platform === ALL ? " active" : ""}`} onClick={() => setPlatform(ALL)}>
            {allPlatformLabel[prefs.lang]}
          </button>
          {platforms.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip${platform === name ? " active" : ""}`}
              onClick={() => setPlatform(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label={t.filter_category}>
          <button type="button" className={`chip${category === ALL ? " active" : ""}`} onClick={() => setCategory(ALL)}>
            {allCategoryLabel[prefs.lang]}
          </button>
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip${category === name ? " active" : ""}`}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {hasFilters && filtered.length > 0 && (
          <div className="filter-actions">
            <span className="filter-state">{t.active_filters}</span>
            <button className="clear-filters" type="button" onClick={clearFilters}>{t.clear_filters}</button>
          </div>
        )}
      </div>

      <div className="mosaic" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-title">{t.empty_title}</div>
            <div>{t.empty_sub}</div>
            {hasFilters && (
              <button className="clear-filters empty-clear" type="button" onClick={clearFilters}>
                {t.clear_filters}
              </button>
            )}
          </div>
        ) : (
          filtered.map((app, index) => (
            <AppCard key={app.slug} app={app} index={index} onOpen={setModalApp} />
          ))
        )}
      </div>

      {modalApp && <AppModal app={modalApp} onClose={() => setModalApp(null)} />}
    </section>
  );
}
