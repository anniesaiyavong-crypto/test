"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";

const SVG_VIEWBOX = 639.84;
const LAYOUT_SIZE = 1333;
const SHIRT_OUTLINE_D = "m 204.16203,572.3057 237.65908,-2.47293 -5.50108,-257.85701 26.21687,20.07151 58.52952,-43.71129 -67.4502,-111.21106 -62.14735,-35.83137 c -34.03055,71.56295 -99.96184,82.66689 -137.03145,-1.48678 l -55.06038,25.67171 -77.65941,119.19011 58.23217,46.3875 28.49659,-25.12657 z";

// --- Calibration Factors (Adjust these to align the mask with the mockup) ---
const CALIBRATED_SCALE = 1.22; // Scale multiplier (User: 1.4, Calibrated: 1.6)
const TOP_OFFSET_RATIO = 0.56; // Vertical center ratio (User: 0.6, Calibrated: 0.63)
const LEFT_OFFSET_RATIO = 0; // Horizontal shift (+ is right, - is left)
// ----------------------------------------------------------------------------

export function useDesigner() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const getRectMask = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return null;
    const boxWidth = c.width * 0.40;
    const boxHeight = c.height * 0.67;

    return new fabric.Rect({
      width: boxWidth,
      height: boxHeight,
      originX: "center",
      originY: "center",
      left: c.width / 2,
      top: c.height * 0.64,
      rx: 12,
      ry: 12,
      absolutePositioned: true,
      fill: 'transparent',
      stroke: 'transparent',
      selectable: false,
      evented: false,
    });
  }, []);

  const createShirtMask = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return null;

    const baseScale = LAYOUT_SIZE / SVG_VIEWBOX;
    const responsiveScale = c.width / LAYOUT_SIZE;
    const finalScale = baseScale * responsiveScale * CALIBRATED_SCALE;

    return new fabric.Path(SHIRT_OUTLINE_D, {
      originX: 'center',
      originY: 'center',
      left: (c.width / 2) + (c.width * LEFT_OFFSET_RATIO),
      top: c.height * TOP_OFFSET_RATIO,
      scaleX: finalScale,
      scaleY: finalScale,
      fill: 'transparent',
      stroke: 'transparent',
      selectable: false,
      evented: false,
      absolutePositioned: true,
    });
  }, []);

  const initCanvas = useCallback((el: HTMLCanvasElement) => {
    if (!containerRef.current) return;

    const canvas = new fabric.Canvas(el, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      preserveObjectStacking: true,
      selection: false,
      allowTouchScrolling: true,
    });

    canvasRef.current = canvas;

    if (containerRef.current) {
      containerRef.current.style.touchAction = "none";
    }

    // Performance optimizations for active objects
    // Interaction state handling
    const checkAndSetInteracting = (target: any, value: boolean) => {
      if (target && target.layerType === 'sticker') {
        setIsInteracting(value);
      }
    };

    canvas.on('mouse:down', (e) => {
      checkAndSetInteracting(e.target, true);
    });

    canvas.on('object:moving', (e) => {
      if (e.target) {
        e.target.set('objectCaching', false);
        checkAndSetInteracting(e.target, true);
      }
    });

    canvas.on('object:scaling', (e) => {
      if (e.target) {
        e.target.set('objectCaching', false);
        checkAndSetInteracting(e.target, true);
      }
    });

    canvas.on('object:rotating', (e) => {
      checkAndSetInteracting(e.target, true);
    });

    canvas.on('mouse:up', (e: any) => {
      if (e.target) {
        e.target.set('objectCaching', true);
        canvasRef.current?.renderAll();
      }
      setIsInteracting(false);
    });

    canvas.on('selection:cleared', () => {
      setIsInteracting(false);
    });

    // Enforce size limits for stickers
    canvas.on('object:scaling', (e) => {
      const obj = e.target;
      if (!obj || (obj as any).layerType !== 'sticker') return;

      const c = canvasRef.current;
      if (!c) return;

      const maxWidth = c.width * 0.3; // 10% of canvas width limit
      if (obj.getScaledWidth() > maxWidth) {
        const scale = maxWidth / obj.width;
        obj.set({
          scaleX: scale,
          scaleY: scale
        });
      }
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && canvasRef.current) {
        const { width, height } = entries[0].contentRect;
        const c = canvasRef.current;
        c.setDimensions({ width, height });

        c.getObjects().forEach((obj) => {
          const type = (obj as any).layerType || 'main';
          const clipMask = type === 'main' ? getRectMask() : createShirtMask();
          obj.set({ clipPath: clipMask || undefined });
        });

        c.renderAll();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [getRectMask, createShirtMask]);

  const addImage = useCallback((url: string, type: 'main' | 'sticker' = 'main') => {
    return new Promise<void>((resolve, reject) => {
      if (!canvasRef.current) {
        reject(new Error("Canvas not initialized"));
        return;
      }

      const isExternal = url.startsWith('http') && !url.startsWith('blob:');
      const options = isExternal ? { crossOrigin: "anonymous" as const } : {};

      fabric.FabricImage.fromURL(url, options)
        .then((img) => {
          const clipMask = type === 'main' ? getRectMask() : createShirtMask();

          img.set({
            originX: "center",
            originY: "center",
            clipPath: clipMask || undefined,
            layerType: type // Standard set for Fabric.js
          } as any);

          const canvasWidth = canvasRef.current?.width || 500;
          const targetWidth = type === 'sticker' ? canvasWidth * 0.15 : canvasWidth * 0.3; // 7% initial size for stickers
          img.scaleToWidth(targetWidth);

          canvasRef.current!.add(img);
          canvasRef.current!.centerObject(img);

          if (type === 'main') {
            img.set({ top: (canvasRef.current?.height || 500) * 0.45 });
          }

          canvasRef.current!.setActiveObject(img);
          canvasRef.current!.renderAll();
          resolve();
        })
        .catch((err) => {
          console.error("Failed to load image:", err);
          reject(err);
        });
    });
  }, [getRectMask, createShirtMask]);


  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.clear();
    canvasRef.current.renderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    if (!canvasRef.current) return;
    const activeObjects = canvasRef.current.getActiveObjects();
    canvasRef.current.remove(...activeObjects);
    canvasRef.current.discardActiveObject();
    canvasRef.current.renderAll();
  }, []);

  const flipObject = useCallback(() => {
    if (!canvasRef.current) return;
    const active = canvasRef.current.getActiveObject();
    if (active) {
      active.set("flipX", !active.flipX);
      canvasRef.current.renderAll();
    }
  }, []);

  const rotateObject = useCallback(() => {
    if (!canvasRef.current) return;
    const active = canvasRef.current.getActiveObject();
    if (active) {
      const currentAngle = active.angle || 0;
      active.set("angle", (currentAngle + 45) % 360);
      canvasRef.current.renderAll();
    }
  }, []);

  const getCanvasData = useCallback((): string | null => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL({
      format: "png",
      multiplier: 2, // High res
    });
  }, []);

  const getNormalizedDesignData = useCallback(() => {
    if (!canvasRef.current) return [];

    const canvas = canvasRef.current;
    if (!canvas.width || !canvas.height) return [];

    return canvas.getObjects().map((obj) => {
      const center = obj.getCenterPoint();
      return {
        type: obj.type,
        layerType: (obj as any).layerType || 'main',
        src: (obj as any).getSrc ? (obj as any).getSrc() : null,
        ratioX: center.x / canvas.width,
        ratioY: center.y / canvas.height,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        ratioWidth: ((obj.width || 0) * (obj.scaleX || 1)) / canvas.width,
        ratioHeight: ((obj.height || 0) * (obj.scaleY || 1)) / canvas.height,
        angle: obj.angle || 0,
        flipX: obj.flipX || false,
        originX: obj.originX,
        originY: obj.originY,
      };
    });
  }, []);

  const exportState = useCallback(() => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toObject(['layerType']);
  }, []);

  const importState = useCallback(async (state: any) => {
    if (!canvasRef.current || !state) return;
    await canvasRef.current.loadFromJSON(state);
    canvasRef.current.renderAll();
  }, []);

  const centerObjectH = useCallback(() => {
    if (!canvasRef.current) return;
    const active = canvasRef.current.getActiveObject();
    if (active) {
      canvasRef.current.centerObjectH(active);
      canvasRef.current.renderAll();
    }
  }, []);

  const bringForward = useCallback(() => {
    if (!canvasRef.current) return;
    const active = canvasRef.current.getActiveObject();
    if (active) {
      canvasRef.current.bringObjectForward(active);
      canvasRef.current.renderAll();
    }
  }, []);

  const sendBackwards = useCallback(() => {
    if (!canvasRef.current) return;
    const active = canvasRef.current.getActiveObject();
    if (active) {
      canvasRef.current.sendObjectBackwards(active);
      canvasRef.current.renderAll();
    }
  }, []);

  const designer = useMemo(() => ({
    initCanvas,
    containerRef,
    addImage,
    clearCanvas,
    deleteSelected,
    flipObject,
    rotateObject,
    centerObjectH,
    bringForward,
    sendBackwards,
    getCanvasData,
    getNormalizedDesignData,
    exportState,
    importState,
    isInteracting,
    canvas: canvasRef.current
  }), [
    initCanvas,
    addImage,
    clearCanvas,
    deleteSelected,
    flipObject,
    rotateObject,
    centerObjectH,
    bringForward,
    sendBackwards,
    getCanvasData,
    getNormalizedDesignData,
    exportState,
    importState,
    isInteracting
  ]);

  return designer;
}
