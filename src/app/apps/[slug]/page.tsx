import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apps, getApp } from "@/data/registry";
import "@/styles/app-page.css";

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return {
    title: `${app.name} — AppLibrary`,
    description: app.tagline,
    openGraph: { title: app.name, description: app.tagline },
  };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  return (
    <>
      <header className="hero">
        <nav className="hero-nav">
          <Link href="/" className="nav-back">← AppLibrary</Link>
        </nav>
        <div className="hero-inner">
          {app.icon && (
            // 静的出力のため素の img を使う。
            // eslint-disable-next-line @next/next/no-img-element
            <img className="hero-icon" src={`/apps/${app.slug}/${app.icon}`} alt={`${app.name} アイコン`} />
          )}
          <h1 className="hero-title">{app.name}</h1>
          <p className="hero-tagline">{app.tagline}</p>
          <p className="hero-desc">{app.description}</p>
          <div className="hero-meta-row">
            {app.platforms.map((platform) => (
              <span className="hero-badge" key={platform}>{platform}</span>
            ))}
          </div>
          <div className="hero-actions">
            {app.appStoreUrl && (
              <a className="btn btn-primary" href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
                App Store でダウンロード
              </a>
            )}
            {app.siteUrl && (
              <a className="btn btn-ghost" href={app.siteUrl} target="_blank" rel="noopener noreferrer">
                公式サイト
              </a>
            )}
            <a className="btn btn-ghost" href="#features">機能を見る</a>
          </div>
        </div>
      </header>

      <main className="page">
        <section id="features" className="features">
          <h2 className="section-title">Features</h2>
          <div className="feature-grid">
            {app.features.map((feature) => (
              <article className="feature-card" key={feature}>
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
        </section>

        {app.screenshots.length > 0 && (
          <section id="screenshots" className="screenshots">
            <h2 className="section-title">Screenshots</h2>
            <div className="shot-row">
              {app.screenshots.map((file, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={file}
                  src={`/apps/${app.slug}/screenshots/${file}`}
                  alt={`${app.name} スクリーンショット ${index + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <Link href={`/apps/${app.slug}/privacy/`}>プライバシーポリシー</Link>
        <span> · </span>
        <Link href="/">AppLibrary</Link>
      </footer>
    </>
  );
}
