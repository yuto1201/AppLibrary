import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apps, getApp } from "@/data/registry";
import { html as sublogPrivacy } from "@/data/privacy/sublog";
import { html as caflogPrivacy } from "@/data/privacy/caflog";
import "@/styles/app-page.css";

/** アプリ固有の法務文書。registry からは生成できないため個別に持つ。 */
const PRIVACY: Record<string, string> = {
  sublog: sublogPrivacy,
  caflog: caflogPrivacy,
};

export function generateStaticParams() {
  return apps.filter((app) => PRIVACY[app.slug]).map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return { title: `プライバシーポリシー — ${app.name}`, robots: { index: true } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  const content = PRIVACY[slug];
  if (!app || !content) notFound();

  return (
    <>
      <main className="page" dangerouslySetInnerHTML={{ __html: content }} />
      <footer className="app-footer">
        <Link href={`/apps/${app.slug}/`}>← {app.name}</Link>
        <span> · </span>
        <Link href="/">AppLibrary</Link>
      </footer>
    </>
  );
}
