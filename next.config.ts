import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/api/:path+",
        destination: "/",
        permanent: true,
      },
    ];
  },
  env: {
    SITE_VERSION: pkg.version,
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.103:3000",
    "http://192.168.1.103:3000",
  ],
  images: {
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
