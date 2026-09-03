import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enterprise Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },

  // API Versioning Rewrites (/api/v1/debts -> /api/debts)
  async rewrites() {
    return [
      {
        source: "/api/v1/debts",
        destination: "/api/debts",
      },
      {
        source: "/api/v1/debts/:id",
        destination: "/api/debts/:id",
      },
    ];
  },
};

export default nextConfig;
