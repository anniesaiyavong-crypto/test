"use client";

import { motion } from "framer-motion";

export function FeedCard({ item }: { item: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full relative bg-gray-50/50 hover:bg-black/5 border-2 border-black transition-all duration-300 cursor-default"
    />
  );
}
