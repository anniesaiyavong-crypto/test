"use client";

import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <h2 className="text-6xl md:text-8xl font-black text-black/5 tracking-tighter select-none">
          SOON
        </h2>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-black">
            Coming Soon
          </p>
        </div>
      </div>
      <div className="w-12 h-1 bg-black/10 rounded-full overflow-hidden">
        <div className="h-full bg-black w-1/3 animate-[loading_2s_ease-in-out_infinite]" />
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
