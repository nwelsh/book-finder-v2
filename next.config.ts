import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/book-finder-v2",
  assetPrefix: "/book-finder-v2/",
};

export default nextConfig;