import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return [
      { source: "/academics", destination: "/undergraduate/graduation", permanent: false },
      { source: "/academics/:decade/:year", destination: "/undergraduate/graduation/:decade/:year", permanent: false },
      { source: "/en/academics", destination: "/en/undergraduate/graduation", permanent: false },
      { source: "/en/academics/:decade/:year", destination: "/en/undergraduate/graduation/:decade/:year", permanent: false },
    ];
  },
};

export default nextConfig;
