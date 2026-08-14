import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@reduxjs/toolkit", "react-redux"],
  },
};

export default nextConfig;

