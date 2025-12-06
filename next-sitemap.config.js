/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 1.0,
  exclude: ["/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: "/api/*",
      },
    ],
    additionalSitemaps: [process.env.NEXT_PUBLIC_SITE_URL + "/sitemap.xml"],
  },
};
