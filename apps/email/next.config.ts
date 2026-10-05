import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/inbox", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // the mailbox must never be shown inside another site's frame
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // links opened from an email must not reveal the mailbox URL they came from
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
