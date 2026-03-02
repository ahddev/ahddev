import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/youtube",
        destination: "https://www.youtube.com/@ahddev",
        permanent: false,
      },
      {
        source: "/instagram",
        destination: "https://www.instagram.com/realahd/",
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
    ];
  },
};

export default nextConfig;
