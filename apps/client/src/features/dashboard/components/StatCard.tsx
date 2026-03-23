"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorVariant = "black" | "gray" | "green";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: ColorVariant;
}

const COLOR_MAP: Record<ColorVariant, { bg: string; icon: string; text: string }> = {
  black: { bg: "bg-gray-100", icon: "text-black", text: "text-black" },
  gray: { bg: "bg-gray-50", icon: "text-gray-500", text: "text-gray-600" },
  green: { bg: "bg-gray-100", icon: "text-black", text: "text-black" },
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-none p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className={cn("w-10 h-10 rounded-none border-2 border-black flex items-center justify-center mb-4 transition-transform group-hover:scale-110", colors.bg)}>
        <Icon size={20} className={colors.icon} />
      </div>
      <p className="text-2xl font-black text-gray-900 tabular-nums leading-none tracking-tight">{value}</p>
      <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-[0.1em]">{label}</p>
    </motion.div>
  );
}
