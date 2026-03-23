"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft, Save, Loader2, Upload, Trash2, Plus, MousePointer2, X, Sticker } from "lucide-react";

import { CanvasEditor } from "@/features/designer/components/CanvasEditor";
import { useDesigner } from "@/features/designer/hooks/useDesigner";
import { StickerPicker } from "@/features/designer/components/StickerPicker";

export default function UploadPage() {
  const t = useTranslations("Designer");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [designer, setDesigner] = useState<ReturnType<typeof useDesigner> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasArtwork, setHasArtwork] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMockup, setShowMockup] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mockupAssetsLoaded, setMockupAssetsLoaded] = useState({ bottom: false, top: false });
  const isMockupReady = mockupAssetsLoaded.bottom && mockupAssetsLoaded.top;

  const onDesignerInit = useCallback((d: ReturnType<typeof useDesigner>) => {
    setDesigner(d);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && designer) {
      setIsUploading(true);
      setUploadProgress(10);

      const url = URL.createObjectURL(file);

      // Simulate progress for local loading
      let prog = 10;
      const interval = setInterval(() => {
        prog += Math.random() * 30;
        if (prog >= 90) {
          clearInterval(interval);
          setUploadProgress(90);
        } else {
          setUploadProgress(prog);
        }
      }, 100);

      try {
        await designer.addImage(url, 'main');
        clearInterval(interval);
        setUploadProgress(100);
        setHasArtwork(true);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        alert(t('uploadFailed'));
      } finally {
        e.target.value = '';
      }
    }
  };

  const onPublish = async () => {
    // Get the high-res transparent artwork from Canvas
    const canvasScreenshot = designer?.getCanvasData();
    if (canvasScreenshot) {
      setPreviewUrl(canvasScreenshot);
      setShowMockup(true);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-screen pb-20 flex flex-col gap-6 p-0 md:p-6 lg:p-0 overflow-x-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/designs"
            className="flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors pr-2"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{tCommon('newDesign')}</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">{t('editorSubtitle')}</p>
          </div>
        </div>

        <motion.button
          onClick={onPublish}
          disabled={isSubmitting}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 shadow-lg shadow-black/10"
          title={t('publishDesign')}
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin text-white/50" />
          ) : (
            <Upload size={18} />
          )}
        </motion.button>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Editor (Now taking full width) */}
        <div className="w-full bg-white rounded-[32px] p-1 md:p-6 border-2 border-gray-200 flex flex-col relative min-w-0 min-h-[400px] lg:min-h-[750px] lg:max-h-[720px]">
          {/* Floating Action Buttons - Top Right: Add Image */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
            <label className="cursor-pointer w-9 h-9 bg-gray-100/80 backdrop-blur-sm active:bg-gray-200 active:scale-95 rounded-xl flex items-center justify-center text-gray-900 transition-all shadow-sm" title={t('addImage')}>
              <Plus size={18} />
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Floating Action Buttons - Top Left: Stickers */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
            <button
              onClick={() => setShowStickerPicker((prev) => !prev)}
              className="cursor-pointer w-9 h-9 bg-gray-100/80 backdrop-blur-sm active:bg-gray-200 active:scale-95 rounded-xl flex items-center justify-center text-gray-900 transition-all shadow-sm"
              title={t('stickers')}
            >
              <Sticker size={18} />
            </button>

            {/* Sticker Picker Panel */}
            {showStickerPicker && designer && (
              <StickerPicker
                designer={designer}
                onClose={() => setShowStickerPicker(false)}
              />
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mx-6 mb-2">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                {t('uploading', { progress: Math.round(uploadProgress) })}
              </p>
            </div>
          )}

          <div className="flex-1 relative overflow-hidden flex flex-col">
            <CanvasEditor
              onInit={onDesignerInit}
              onPublish={onPublish}
              isSubmitting={isSubmitting}
              hasArtwork={hasArtwork}
            />
          </div>
        </div>
      </div>

      {/* Mockup Modal */}
      {showMockup && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold">{t('designMockupTitle')}</h3>
              <button
                onClick={() => {
                  setShowMockup(false);
                  setMockupAssetsLoaded({ bottom: false, top: false });
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                title={tCommon('close')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mockup Content */}
            <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              {/* Overlay Loader */}
              {!isMockupReady && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tCommon('loading')}</p>
                </div>
              )}

              {/* Layer 1: Base Hanger Shirt (Bottom) */}
              <img
                src="/assets/mockups/white-tshirt-hanger.png"
                alt={t('overlayShirt')}
                onLoad={() => setMockupAssetsLoaded(prev => ({ ...prev, bottom: true }))}
                className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-300 ${mockupAssetsLoaded.bottom ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: 'scale(0.7715)' }}
              />

              {/* Layer 2: Your Design Overlay (Middle) */}
              {isMockupReady && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={previewUrl}
                  alt={t('overlayDesign')}
                  className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none mix-blend-multiply"
                  style={{
                    transformOrigin: "50% 64%",
                    transform: 'scale(0.7715) translate(0.5%, -7.5%) scale(0.79)'
                  }}
                />
              )}

              {/* Layer 3: Texture & Shadow Overlay (Top) - Sandwich Method */}
              <img
                src="/assets/mockups/overlay.png"
                alt={t('overlayTexture')}
                onLoad={() => setMockupAssetsLoaded(prev => ({ ...prev, top: true }))}
                className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none opacity-20 mix-blend-multiply transition-opacity duration-300 ${mockupAssetsLoaded.top ? 'opacity-20' : 'opacity-0'}`}
                style={{
                  transform: 'scale(0.7715)',
                  filter: 'brightness(1.1)'
                }}
              />
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
