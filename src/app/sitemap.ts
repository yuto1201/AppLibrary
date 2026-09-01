import type { MetadataRoute } from "next";
import project from "../../config/project.json";
import { apps } from "@/data/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "privacy/",
    "terms/",
    ...apps.flatMap((app) => [`apps/${app.slug}/`, `apps/${app.slug}/privacy/`]),
  ];

  return paths.map((path) => ({ url: new URL(path, project.productionUrl).href }));
}
