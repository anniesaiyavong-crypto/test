"use client";

import { FeedCard } from "./FeedCard";
import { MOCK_FEED_ITEMS } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Search, Info } from "lucide-react";
import { useState } from "react";

export function ProductFeed() {
  const t = useTranslations("Feed");
  const [searchQuery, setSearchQuery] = useState("");

  const COL_SPAN: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
  };

  const ROW_SPAN: Record<number, string> = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
  };

  const filteredItems = MOCK_FEED_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Input Section */}
      <div className="w-full max-w-2xl mx-auto px-1">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black rounded-none focus:outline-none focus:ring-0 placeholder:text-gray-400 font-bold uppercase text-xs tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-1">
        <button className="px-4 py-2 text-[10px] font-black text-white bg-black border-2 border-black rounded-none uppercase tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(38,38,38,0.4)]">
          {t('trending')}
        </button>
        <button className="px-4 py-2 text-[10px] font-black text-black bg-white border-2 border-black rounded-none uppercase tracking-widest transition-all hover:bg-gray-50">
          {t('newArrivals')}
        </button>
      </div>

      {/* Focused 3-Column Bento Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 grid-flow-dense gap-4 auto-rows-[140px] md:auto-rows-[180px]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative group",
                COL_SPAN[item.colSpan || 1],
                ROW_SPAN[item.rowSpan || 1]
              )}
            >
              <FeedCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border-2 border-dashed border-gray-200">
          <Info className="mb-4 text-gray-300" size={48} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {t('noResults', { query: searchQuery })}
          </p>
        </div>
      )}
    </div>
  );
}
