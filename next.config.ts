import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  turbopack: { root: process.cwd() },
  images: { deviceSizes: [640, 820, 1080, 1230, 1640], imageSizes: [320, 480] },
  async headers() {
    return [{
      source: '/images/optimized/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    }];
  },
};
export default config;
