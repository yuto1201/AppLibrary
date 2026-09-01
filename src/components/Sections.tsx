"use client";

import Link from "next/link";
import { useSiteState } from "@/lib/state";
import { posts, profile, social } from "@/lib/site-data";
import { useReveal } from "@/lib/use-reveal";
import type { Post } from "@/lib/site-data";

export function Posts() {
  const { t } = useSiteState();
  if (posts.length === 0) return null;

  return (
    <section className="section" id="posts">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t.section_posts}</h2>
          <div className="section-sub">{t.section_posts_sub}</div>
        </div>
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <PostCard post={post} index={index} key={post.date + post.title} />
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const { ref: revealRef, className: revealClass } = useReveal<HTMLElement>();
  return (
    <article className={`post glass ${revealClass}`} ref={revealRef} style={{ transitionDelay: `${index * 60}ms` }}>
      <div className="post-date">{post.date}</div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
    </article>
  );
}

export function Contact() {
  const { t } = useSiteState();
  const { ref: revealRef, className: revealClass } = useReveal<HTMLDivElement>();
  // url が空 / "#" のエントリは未公開とみなして描画しない。
  const visible = social.filter((entry) => entry.url && entry.url !== "#");

  return (
    <section className="section" id="contact">
      <div className={`contact glass ${revealClass}`} ref={revealRef}>
        <h2>{t.contact_h}</h2>
        <p>{t.contact_p}</p>
        {visible.length > 0 && (
          <div className="socials">
            {visible.map((entry) => (
              <a
                className="social-link"
                key={entry.label}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>{entry.label}</strong>
                <span className="social-handle">{entry.handle}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useSiteState();

  return (
    <footer className="footer">
      <div>{t.footer_copyright}</div>
      <div>
        <Link href="/privacy/">{t.privacy}</Link>
        &nbsp;·&nbsp;
        <Link href="/terms/">{t.terms}</Link>
        &nbsp;·&nbsp;
        {profile.name}
      </div>
    </footer>
  );
}
