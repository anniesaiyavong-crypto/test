"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
  onClear: () => void;
}

export function UploadZone({ onFileSelect, previewUrl, onClear }: UploadZoneProps) {
  const t = useTranslations("Designs");
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (previewUrl) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-2xl overflow-hidden border-2 border-black"
        >
          <Image src={previewUrl} alt="Design preview" fill className="object-contain" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
        isDragActive
          ? "border-black bg-gray-100"
          : "border-gray-300 bg-gray-50 hover:border-black hover:bg-gray-100"
      )}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ scale: isDragActive ? 1.1 : 1 }}
        className="flex flex-col items-center gap-3 text-center px-6"
      >
        <div className={cn("p-4 rounded-2xl", isDragActive ? "bg-black" : "bg-gray-100")}>
          {isDragActive ? (
            <ImageIcon size={28} className="text-white" />
          ) : (
            <Upload size={28} className="text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-bold text-gray-700 text-sm">
            {isDragActive ? t('dropHereActive') : t('dropHere')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{t('uploadLimit')}</p>
        </div>
        <span className="text-xs font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-colors">
          {t('browseFiles')}
        </span>
      </motion.div>
    </div>
  );
}
