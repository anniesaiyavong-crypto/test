import type { MockupTemplate } from "@/types";

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    category: "T-Shirt",
    overlayBox: { x: 0.3, y: 0.18, width: 0.4, height: 0.38 },
    aspectRatio: 1,
  },
  {
    category: "Hoodie",
    overlayBox: { x: 0.32, y: 0.2, width: 0.36, height: 0.32 },
    aspectRatio: 1,
  },
  {
    category: "Mug",
    overlayBox: { x: 0.22, y: 0.25, width: 0.56, height: 0.5 },
    aspectRatio: 16 / 9,
  },
  {
    category: "Phone Case",
    overlayBox: { x: 0.2, y: 0.14, width: 0.6, height: 0.72 },
    aspectRatio: 9 / 16,
  },
  {
    category: "Pillow Case",
    overlayBox: { x: 0.15, y: 0.15, width: 0.7, height: 0.7 },
    aspectRatio: 1,
  },
  {
    category: "Tote Bag",
    overlayBox: { x: 0.25, y: 0.2, width: 0.5, height: 0.55 },
    aspectRatio: 1,
  },
];

/** ข้อมูล Production Cost โดยประมาณ (USD) ตาม Category */
export const PRODUCTION_COSTS: Record<string, number> = {
  "T-Shirt": 8.5,
  Hoodie: 18.0,
  Mug: 5.5,
  "Phone Case": 6.0,
  "Pillow Case": 9.0,
  "Tote Bag": 7.0,
};

/** Platform Fee เป็น % ของราคาขาย (Fixed Platform Policy) */
export const PLATFORM_FEE_PERCENT = 10;
