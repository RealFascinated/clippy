import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    reactCompiler: true,
  },
  images: {
    unoptimized: true, // Always use unoptimized images
  },
};

export default nextConfig;
