import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/content-core"],
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
