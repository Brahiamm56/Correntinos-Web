import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Include all breakpoints up to 4K so the hero image is served at full resolution
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
