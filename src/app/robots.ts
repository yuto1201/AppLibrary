import type { MetadataRoute } from "next";
import project from "../../config/project.json";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("sitemap.xml", project.productionUrl).href,
  };
}
