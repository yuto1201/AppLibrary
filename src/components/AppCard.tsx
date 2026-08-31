"use client";

import Link from "next/link";
import type { App } from "@/data/schema";
import { useSiteState } from "@/lib/state";
import { statusLabel } from "@/lib/labels";
import { useReveal } from "@/lib/use-reveal";
import { IconArrowNE } from "./icons";

export function AppIcon({ app }: { app: App }) {
  if (!app.icon) return <>{app.iconGlyph}</>;
  return (
    // 静的出力のため next/image の最適化は使わない。素の img で十分軽い。
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/apps/${app.slug}/${app.icon}`} alt="" loading="lazy" />
  );
}

export function AppCard({ app, index, onOpen }: { app: App; index: number; onOpen: (app: App) => void }) {
  const { prefs, t } = useSiteState();
  const { ref: revealRef, className: revealClass } = useReveal<HTMLElement>();
  const directLabel = prefs.lang === "ja" ? `${app.name} の個別ページへ` : `Open ${app.name} site`;

  return (
    <article
      className={`app-card glass ${revealClass}${app.featured ? " featured" : ""}`}
      ref={revealRef}
      style={{
        "--card-color": app.color,
        "--card-accent": app.accent,
        transitionDelay: `${Math.min(index * 40, 200)}ms`,
      } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${app.name} — ${app.tagline}`}
      onClick={() => onOpen(app)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(app);
        }
      }}
    >
      <div className="bg-shape" />
      <div className="app-icon"><AppIcon app={app} /></div>
      <div className="app-body">
        <div className="app-category">{app.category}</div>
        <h3 className="app-name">{app.name}</h3>
        <p className="app-tagline">{app.tagline}</p>
        <div className="app-footer">
          <span className="app-status">{statusLabel(app.status, t)}</span>
          <span>{app.price}</span>
        </div>
      </div>
      <Link
        className="app-card-direct"
        href={`/apps/${app.slug}/`}
        aria-label={directLabel}
        title={directLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <IconArrowNE />
      </Link>
    </article>
  );
}
