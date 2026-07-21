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
      { source: "/contact", destination: "/about/directions", permanent: false },
      { source: "/en/contact", destination: "/en/about/directions", permanent: false },
      { source: "/news/:id(\\d+)", destination: "/news", permanent: false },
      { source: "/en/news/:id(\\d+)", destination: "/en/news", permanent: false },
    ];
  },
};

export default nextConfig;
