"use client";

import { useEffect, useRef } from "react";
import { useDesigner } from "../hooks/useDesigner";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Trash2, Maximize, MousePointer2, FlipHorizontal, Save, Loader2, RotateCcw, Send, AlignCenter, RotateCw, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

interface CanvasEditorProps {
  onInit: (designer: ReturnType<typeof useDesigner>) => void;
  onPublish: () => void;
  isSubmitting: boolean;
  hasArtwork: boolean;
}

export function CanvasEditor({ onInit, onPublish, isSubmitting, hasArtwork }: CanvasEditorProps) {
  const t = useTranslations("Designer");
  const designer = useDesigner();
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let isPanning = false;
    let initialPinchDist = 0;
    let initialPinchScale = 1;
    let lastX = 0;
    let lastY = 0;

    const applyTransform = () => {
      if (el.children[0]) {
        (el.children[0] as HTMLElement).style.transform = `translate(${transformRef.current.x}px, ${transformRef.current.y}px) scale(${transformRef.current.scale})`;
        (el.children[0] as HTMLElement).style.transformOrigin = '0 0';
        (el.children[0] as HTMLElement).style.willChange = 'transform';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const el = wrapperRef.current;
      if (!el || !el.children[0]) return;

      const target = el.children[0] as HTMLElement;
      // Get the bounding rect of the actual scaled element, not the wrapper
      const rect = target.getBoundingClientRect();
      
      // Calculate mouse position relative to the element's top-left corner
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const oldScale = transformRef.current.scale;
      const newScale = oldScale * (0.999 ** e.deltaY);
      const finalScale = Math.min(Math.max(newScale, 0.5), 5);

      // The key formula: offset -= (mouseX / oldScale) * (finalScale - oldScale)
      // Since our mouseX/Y are calculated *with* the old scale applied (from getBoundingClientRect)
      // we need to divide by oldScale to get the "unscaled" position of the mouse relative to the element
      const unscaledMouseX = mouseX / oldScale;
      const unscaledMouseY = mouseY / oldScale;

      transformRef.current.x -= unscaledMouseX * (finalScale - oldScale);
      transformRef.current.y -= unscaledMouseY * (finalScale - oldScale);
      transformRef.current.scale = finalScale;

      applyTransform();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.altKey || e.button === 1) {
        isPanning = true;
        lastX = e.clientX;
        lastY = e.clientY;
        e.preventDefault();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isPanning) {
        transformRef.current.x += e.clientX - lastX;
        transformRef.current.y += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform();
        e.preventDefault();
      }
    };

    const handlePointerUp = () => {
      isPanning = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopImmediatePropagation(); // ป้องกันไม่ให้ Fabric.js จัดการ Event นี้ (ป้องกันรูปขยาย)
        const p1 = e.touches[0];
        const p2 = e.touches[1];
        initialPinchDist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
        initialPinchScale = transformRef.current.scale;

        isPanning = true;
        lastX = (p1.clientX + p2.clientX) / 2;
        lastY = (p1.clientY + p2.clientY) / 2;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const p1 = e.touches[0];
        const p2 = e.touches[1];

        const currentDist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
        const centerX = (p1.clientX + p2.clientX) / 2;
        const centerY = (p1.clientY + p2.clientY) / 2;

        const oldScale = transformRef.current.scale;
        let newScale = initialPinchScale * (currentDist / initialPinchDist);
        newScale = Math.min(Math.max(newScale, 0.5), 5);

        const ratio = newScale / oldScale;

        // Zoom-to-pinch-center formula for transformOrigin '0 0':
        // The pinch center in screen space stays fixed during scale.
        transformRef.current.x = centerX - (centerX - transformRef.current.x) * ratio;
        transformRef.current.y = centerY - (centerY - transformRef.current.y) * ratio;

        // Add pan from finger translation simultaneously
        transformRef.current.x += centerX - lastX;
        transformRef.current.y += centerY - lastY;
        transformRef.current.scale = newScale;

        lastX = centerX;
        lastY = centerY;

        applyTransform();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDist = 0;
        isPanning = false;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    el.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    el.addEventListener('touchend', handleTouchEnd, { capture: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      el.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
      el.removeEventListener('touchend', handleTouchEnd, { capture: true } as any);
    };
  }, []);

  useEffect(() => {
    if (canvasElementRef.current) {
      const cleanup = designer.initCanvas(canvasElementRef.current);
      onInit(designer);
      return cleanup;
    }
  }, [designer.initCanvas, onInit]);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full flex-1 pb-2 overflow-hidden items-center justify-center">
      {/* 0. Left Symmetrical Spacer (Desktop Only) */}
      <div className="hidden md:block w-[72px]" />

      {/* 1. Main Canvas Area */}
      <div
        ref={wrapperRef}
        className="flex-1 w-full flex items-center justify-center p-0 md:p-2 select-none no-drag canvas-container-wrapper relative overflow-hidden"
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="relative w-full max-w-[666px] aspect-square bg-transparent mx-auto no-drag">
          {/* Layer 0: Base Image (Bottom) */}
          <img
            src="/assets/mockups/canvas.png"
            alt="T-shirt Base"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none no-drag md:[transform:scale(1.21)]"
            style={{ transform: 'scale(1.265)' }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Layer 1: Design Area (Fabric.js Canvas) */}
          <div ref={designer.containerRef} className="absolute inset-0 z-10">
            <canvas ref={canvasElementRef} />
          </div>

          {/* Visual Safezone Bounding Box - Hides during interaction */}
          {!designer.isInteracting && (
            <div
              className={`absolute z-20 border-2 border-dashed border-gray-400/30 rounded-[12px] pointer-events-none transition-opacity duration-200`}
              style={{
                width: "40%",
                height: "67%",
                left: "50%",
                top: "64%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          <div className="absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-multiply" />
        </div>
      </div>

      {/* 2. Action Toolbar - Responsive Sidebar (Inside the Box) */}
      <div className="flex flex-col items-center shrink-0 w-[72px]">
        <div id="action-toolbar" className="bg-black text-white px-3 py-3 rounded-[24px] flex flex-row md:flex-col items-center gap-2 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={designer.deleteSelected}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-red-400"
            title={t('deleteSelected')}
          >
            <Trash2 size={18} />
          </button>

          <div className="w-px h-5 md:w-5 md:h-px bg-white/10" />

          <button
            type="button"
            onClick={designer.centerObjectH}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            title={t('alignCenter')}
          >
            <AlignCenter size={18} />
          </button>

          <button
            type="button"
            onClick={designer.flipObject}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            title={t('flipHorizontal')}
          >
            <FlipHorizontal size={18} />
          </button>

          <div className="w-px h-5 md:w-5 md:h-px bg-white/10" />

          <button
            type="button"
            onClick={designer.rotateObject}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            title={t('rotate45')}
          >
            <RotateCw size={18} />
          </button>

          <div className="w-px h-5 md:w-5 md:h-px bg-white/10" />

          <button
            type="button"
            onClick={designer.bringForward}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            title={t('layerUp')}
          >
            <ChevronUp size={18} />
          </button>

          <button
            type="button"
            onClick={designer.sendBackwards}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            title={t('layerDown')}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
