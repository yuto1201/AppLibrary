import { apps } from "@/data/registry";

export default function HomePage() {
  return (
    <main>
      <h1>AppLibrary</h1>
      <ul>
        {apps.map((app) => (
          <li key={app.slug}>
            {app.name} — {app.tagline} ({app.platforms.join(" / ")})
          </li>
        ))}
      </ul>
    </main>
  );
}
