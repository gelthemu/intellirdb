/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/api/:path+",
        destination: "/",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.100:3000",
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
