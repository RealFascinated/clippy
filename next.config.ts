import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    reactCompiler: true,
  },
  env: {
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME ?? "Clippy",
    NEXT_PUBLIC_WEBSITE_DESCRIPTION:
      process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION ??
      "Open Source ShareX Uploader.",
    NEXT_PUBLIC_WEBSITE_LOGO:
      process.env.NEXT_PUBLIC_WEBSITE_LOGO ?? "/logo.png",
    NEXT_PUBLIC_WEBSITE_URL:
      process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    NEXT_PUBLIC_ALLOW_REGISTRATIONS: (
      process.env.NEXT_PUBLIC_ALLOW_REGISTRATIONS === "true"
    ).toString(),
  },
};

export default nextConfig;
