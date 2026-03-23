import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // เปิดใช้ Image Optimization ของ Vercel เพื่อให้รูปเล็กลงมากสำหรับเน็ตมือถือ
  images: {
    unoptimized: false, 
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatar.vercel.sh" },
    ],
    formats: ['image/avif', 'image/webp'], // ใช้ฟอร์แมตที่เล็กที่สุด
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // บีบอัดไฟล์ที่ส่งออกไปหาผู้ใช้
  compress: true,
};

export default withNextIntl(nextConfig);
