/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 1.0,
  exclude: ["/api/*"],
  additionalPaths: async () => {
    return [
      {
        loc: "/intellirdb",
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
    ];
  },
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

export default config;
