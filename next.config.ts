import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Supabase Storage public objects — verified working with /_next/image on Vercel
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ydjzhldfwuqbtukenfbm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
