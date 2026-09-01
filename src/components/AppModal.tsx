"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { App } from "@/data/schema";
import { useSiteState } from "@/lib/state";
import { statusLabel } from "@/lib/labels";
import { AppIcon } from "./AppCard";
import { IconApple, IconArrowNE } from "./icons";

export function AppModal({ app, onClose }: { app: App; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 開いている間は背面をスクロールさせず、閉じたら必ず戻す。
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Esc で閉じ、Tab を modal 内で循環させる（フォーカストラップ）。
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const { prefs, t } = useSiteState();
  const releaseLabel = app.releaseDate
    ? new Intl.DateTimeFormat(prefs.lang === "ja" ? "ja-JP" : "en-US", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(`${app.releaseDate}T00:00:00Z`))
    : String(app.year);
  const styleVars = { "--card-color": app.color, "--card-accent": app.accent } as React.CSSProperties;

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div
        className="modal glass"
        role="dialog"
        aria-modal="true"
        aria-label={app.name}
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close" ref={closeRef}>
          ×
        </button>
        <div className="modal-header" lang="ja">
          <div className="app-icon" style={styleVars}><AppIcon app={app} /></div>
          <div className="modal-meta">
            <div className="app-category" style={styleVars}>{app.category}</div>
            <h2>{app.name}</h2>
            <p className="modal-tagline">{app.tagline}</p>
          </div>
        </div>

        <div className="modal-stats">
          <div>
            <div className="stat-label">{t.stat_version}</div>
            <div className="stat-value">{app.version}</div>
          </div>
          <div>
            <div className="stat-label">{t.stat_status}</div>
            <div className="stat-value">{statusLabel(app.status, t)}</div>
          </div>
          <div>
            <div className="stat-label">{t.stat_release}</div>
            <div className="stat-value">{releaseLabel}</div>
          </div>
          <div>
            <div className="stat-label">{t.stat_price}</div>
            <div className="stat-value" lang="ja">{app.price}</div>
          </div>
        </div>

        <p className="modal-description" lang="ja">{app.description}</p>

        {app.features.length > 0 && (
          <div className="feature-list" lang="ja">
            {app.features.map((feature) => (
              <span className="feature-tag" key={feature.title}>{feature.title}</span>
            ))}
          </div>
        )}

        <div className="modal-actions">
          {app.appStoreUrl ? (
            <a className="badge-btn" href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
              <IconApple />
              <span className="badge-btn-stack">
                <span className="badge-btn-small">{t.modal_dl_small}</span>
                <span className="badge-btn-large">{t.modal_dl_large}</span>
              </span>
            </a>
          ) : (
            <span className="badge-btn" aria-disabled="true">
              <IconApple />
              <span className="badge-btn-stack">
                <span className="badge-btn-small">{t.modal_dl_small}</span>
                <span className="badge-btn-large">{t.modal_dl_unavailable}</span>
              </span>
            </span>
          )}
          <Link className="visit-btn" href={`/apps/${app.slug}/`}>
            <span>{t.modal_visit_site}</span>
            <IconArrowNE />
          </Link>
        </div>
      </div>
    </div>
  );
}
