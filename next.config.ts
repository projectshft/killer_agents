import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack for better compatibility with Prisma/SQLite
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  // Add empty turbopack config to silence the warning when using webpack
  turbopack: {},
};

export default nextConfig;
