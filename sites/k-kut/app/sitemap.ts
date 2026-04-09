import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://k-kut.com";
  const pages = ["/", "/invention", "/demo", "/pricing", "/privacy", "/terms"];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
