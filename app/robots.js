/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://renwize.com/sitemap.xml",
    host: "https://renwize.com",
  };
}
