import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
