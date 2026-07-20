export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/portail", "/pointage", "/espace-client"],
    },
    sitemap: "https://jmtd.fr/sitemap.xml",
  };
}
