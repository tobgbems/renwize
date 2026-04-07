/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const base = "https://renwize.com";
  const paths = [
    "/",
    "/auth",
    "/auth/forgot-password",
    "/pricing",
    "/privacy",
    "/terms",
  ];
  const now = new Date();
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
