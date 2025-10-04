import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable specific rules that are blocking the build
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail builds on TypeScript errors during development
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
