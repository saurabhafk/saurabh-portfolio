import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/content-core"],
  serverExternalPackages: ["gray-matter"],
  outputFileTracingIncludes: {
    "/api/chat": ["./data/chat-index.json"],
  },
};

export default nextConfig;
