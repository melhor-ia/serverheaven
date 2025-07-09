import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5001/server-heaven-c6fb1/us-central1/api/:path*",
      },
    ];
  },
};

export default nextConfig;
