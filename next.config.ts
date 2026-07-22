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
      // 취업정보 moved from 뉴스및공지사항 to 입학·진로 to remove the duplicate listing.
      { source: "/news/jobs", destination: "/admissions/jobs", permanent: false },
      { source: "/news/jobs/:id", destination: "/admissions/jobs/:id", permanent: false },
      { source: "/en/news/jobs", destination: "/en/admissions/jobs", permanent: false },
      { source: "/en/news/jobs/:id", destination: "/en/admissions/jobs/:id", permanent: false },
      // 연구실 소개 자료 및 영상 moved from /graduate to /labs.
      { source: "/graduate/lab-media", destination: "/labs/media", permanent: false },
      { source: "/en/graduate/lab-media", destination: "/en/labs/media", permanent: false },
    ];
  },
};

export default nextConfig;
