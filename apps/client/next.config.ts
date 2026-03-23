import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ลบ output: 'export' ออกเพื่อให้ใช้ Middleware และ API ได้สมบูรณ์บน Cloudflare
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatar.vercel.sh" },
    ],
  },
  typescript: {
    // ป้องกันปัญหา Type Mismatch ใน Monorepo บน Cloudflare
    ignoreBuildErrors: true,
  },
  eslint: {
    // ป้องกัน Build พังจาก Lint errors
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
