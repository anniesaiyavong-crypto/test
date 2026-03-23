"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Upload, User, LogOut, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Common");

  const NAV_ITEMS = [
    { href: "/", label: t("explore"), icon: Search },
    { href: "/designs/upload", label: t("uploadDesign"), icon: Upload },
    { href: "/dashboard", label: t("profile"), icon: User },
    { href: "/designs", label: t("myDesigns"), icon: ImageIcon }, 
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#262626] text-white fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-black text-sm">SS</span>
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide">Creator Studio</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Print on Demand</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
          © 2026 SS Platform
        </div>
      </div>
    </aside>
  );
}
