import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/csharp", destination: "https://cs.ahed.dev", permanent: true },
      {
        source: "/csharp/:path*",
        destination: "https://cs.ahed.dev/:path*",
        permanent: true,
      },
      {
        source: "/get-emails/:path*",
        destination: "https://email.ahed.dev",
        permanent: false,
      },
      {
        source: "/send-emails",
        destination: "https://email.ahed.dev",
        permanent: false,
      },
      {
        source: "/youtube",
        destination: "https://www.youtube.com/@ahddev",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/ahddev/",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://www.github.com/ahddev/",
        permanent: false,
      },
      {
        source: "/whatsapp",
        destination: "https://wa.me/963954649278",
        permanent: false,
      },
      {
        source: "/chat",
        destination: "https://wa.me/963954649278",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
