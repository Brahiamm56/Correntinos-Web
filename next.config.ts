import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "csbreqyjrgvafvzlxsqm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
