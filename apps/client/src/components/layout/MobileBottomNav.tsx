"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations("Common");

  const NAV_ITEMS = [
    { href: "/", label: t("explore"), icon: Search },
    { href: "/designs/upload", label: t("uploadDesign"), icon: Upload },
    { href: "/dashboard", label: t("profile"), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#262626] pb-[env(safe-area-inset-bottom)] border-t-2 border-black shadow-[0_-4px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center justify-center h-16 gap-1"
              >
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "text-white/50"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider transition-colors",
                    isActive ? "text-white" : "text-white/50"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
