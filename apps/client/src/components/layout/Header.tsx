"use client";

import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Common");
  
  const PAGE_TITLES: Record<string, string> = {
    "/": t("explore"),
    "/dashboard": t("profile"),
    "/designs": t("myDesigns"),
    "/designs/upload": t("uploadDesign"),
  };

  const title = PAGE_TITLES[pathname] ?? "SS Platform";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b-2 border-black px-4 md:px-6 h-14 flex items-center">
      <h1 className="font-black text-black text-base uppercase tracking-widest">{title}</h1>
    </header>
  );
}
