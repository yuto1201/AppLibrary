"use client";

import { useSiteState } from "@/lib/state";
import { profile, posts } from "@/lib/site-data";
import { apps } from "@/data/registry";
import { useReveal } from "@/lib/use-reveal";
import { IconArrowDown } from "./icons";

/**
 * 1 行のテキストを 1 文字ずつ span へ分割する。
 * CSS 側が --i を遅延に使って文字送りアニメーションを行う。
 * サロゲートペア対応のため Array.from を使う。
 */
function Letters({ text, baseIndex }: { text: string; baseIndex: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={`${baseIndex + i}-${ch}`} className="hero-letter" style={{ "--i": baseIndex + i } as React.CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { t } = useSiteState();
  const latestPost = posts[0];
  const lineACount = Array.from(t.hero_h1_a).length;

  const { ref: eyebrowRef, className: eyebrowClass } = useReveal<HTMLDivElement>();
  const { ref: headingRef, className: headingClass } = useReveal<HTMLHeadingElement>();
  const { ref: bioRef, className: bioClass } = useReveal<HTMLParagraphElement>();
  const { ref: metaRef, className: metaClass } = useReveal<HTMLDivElement>();
  const { ref: ctaRef, className: ctaClass } = useReveal<HTMLDivElement>();

  return (
    <section className="hero">
      {/* 旧サイトは hero_eyebrow と profile.tagline が同値で "APP MAKER · APP MAKER" と重複表示されていた。 */}
      <div className={`hero-eyebrow ${eyebrowClass}`} ref={eyebrowRef}>{profile.tagline}</div>
      <h1
        className={`hero-h1 ${headingClass}`}
        ref={headingRef}
        style={{ transitionDelay: "80ms" }}
        aria-label={t.hero_h1_a + t.hero_h1_b}
      >
        <span className="hero-line" aria-hidden="true">
          <Letters text={t.hero_h1_a} baseIndex={0} />
        </span>
        <span className="hero-line accent" aria-hidden="true">
          <Letters text={t.hero_h1_b} baseIndex={lineACount} />
        </span>
      </h1>
      <p className={`hero-bio ${bioClass}`} ref={bioRef} style={{ transitionDelay: "160ms" }}>
        {profile.bio}
      </p>
      <div className={`hero-meta ${metaClass}`} ref={metaRef} style={{ transitionDelay: "240ms" }}>
        <span>📍 {profile.location}</span>
        <span>● {apps.length} {t.hero_meta_apps}</span>
        <span>● Swift · SwiftUI</span>
      </div>
      <div className={`hero-cta-wrap ${ctaClass}`} ref={ctaRef} style={{ transitionDelay: "320ms" }}>
        <a className="cta-btn" href="#apps">
          <span>{t.hero_cta}</span>
          <IconArrowDown />
        </a>
        {latestPost && (
          <a className="hero-note-link" href="#posts">
            <span className="hero-note-date">{latestPost.date}</span>
            <span>{latestPost.title}</span>
          </a>
        )}
      </div>
    </section>
  );
}
