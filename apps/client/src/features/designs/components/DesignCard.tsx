"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShoppingBag, Eye } from "lucide-react";
import type { Design } from "@/types";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

interface DesignCardProps {
  design: Design;
}

const STATUS_STYLES = {
  active: "bg-black text-white",
  draft: "bg-gray-100 text-gray-500",
};

export function DesignCard({ design }: DesignCardProps) {
  const t = useTranslations("Designs");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-none overflow-hidden border-2 border-black group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={design.imageUrl}
          alt={design.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={cn(
            "absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            STATUS_STYLES[design.status]
          )}
        >
          {design.status}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm truncate">{design.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{design.category}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-black text-sm text-gray-900">
            {formatCurrency(design.basePrice)}
          </span>
          <span className="text-[10px] font-bold text-gray-900 border-2 border-black px-2 py-0.5 rounded-none uppercase tracking-tighter">
            {design.creatorFeePercent}% {t('fee')}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <ShoppingBag size={11} /> {design.ordersCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatNumber(design.viewsCount)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
