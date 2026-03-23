import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ลบ output: 'export' ออกเพื่อให้ Vercel รันแบบ Full-stack (Serverless) ได้สมบูรณ์
  images: {
    // บน Vercel เราสามารถเอา unoptimized: true ออกได้ถ้าต้องการใช้ระบบปรับแต่งรูปของ Vercel
    // แต่เพื่อความประหยัดโควต้าในตอนแรก จะเปิดไว้ก่อนก็ได้ครับ
    unoptimized: true, 
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatar.vercel.sh" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
