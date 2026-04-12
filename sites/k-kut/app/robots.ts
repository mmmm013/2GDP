import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://k-kut.com/sitemap.xml",
    host: "https://k-kut.com",
  };
}
