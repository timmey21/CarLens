import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/CarLens",
  assetPrefix: "/CarLens/",
  trailingSlash: true,
};

export default nextConfig;
