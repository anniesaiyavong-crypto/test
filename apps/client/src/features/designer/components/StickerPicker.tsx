"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { X, Upload, Sticker, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { useDesigner } from "../hooks/useDesigner";

interface StickerPickerProps {
  designer: ReturnType<typeof useDesigner>;
  onClose: () => void;
}

export function StickerPicker({ designer, onClose }: StickerPickerProps) {
  const t = useTranslations("Designer");
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [presetStickers, setPresetStickers] = useState<string[]>([]);
  const [fetchingPresets, setFetchingPresets] = useState(true);

  useEffect(() => {
    fetch("/assets/stickers.json")
      .then((res) => res.json())
      .then((data: { stickers: string[] }) => setPresetStickers(data.stickers))
      .catch(() => setPresetStickers([]))
      .finally(() => setFetchingPresets(false));
  }, []);

  const handleSelectSticker = async (url: string) => {
    setLoading(url);
    try {
      await designer.addImage(url, 'sticker');
      onClose();
    } catch (err) {
      console.error("Failed to add sticker:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleUploadSticker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    await handleSelectSticker(url);
    e.target.value = "";
  };

  return (
    <div className="absolute top-16 left-4 md:left-6 z-50 w-72 bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sticker size={16} className="text-gray-700" />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-700">
            {t("stickers")}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Upload custom sticker */}
      <label className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 border-2 border-dashed border-gray-300 rounded-[14px] cursor-pointer hover:border-black hover:bg-gray-50 transition-all text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black">
        <Upload size={14} />
        {t("uploadSticker")}
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          accept="image/png,image/svg+xml,image/gif,image/webp"
          onChange={handleUploadSticker}
        />
      </label>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
          {t("presets")}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Preset Grid */}
      {fetchingPresets ? (
        <div className="flex items-center justify-center py-6 text-gray-300">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : presetStickers.length === 0 ? (
        <p className="text-center text-[10px] text-gray-400 py-4">No preset stickers found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {presetStickers.map((url) => (
            <button
              key={url}
              onClick={() => handleSelectSticker(url)}
              disabled={loading === url}
              className={cn(
                "aspect-square bg-gray-50 rounded-[12px] flex items-center justify-center p-2 border-2 border-transparent hover:border-black hover:bg-white transition-all active:scale-95",
                loading === url && "opacity-50 cursor-wait"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="sticker"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
