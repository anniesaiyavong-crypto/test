export type DesignStatus = "active" | "draft";
export type DesignCategory = "T-Shirt" | "Hoodie" | "Pillow Case" | "Mug" | "Tote Bag" | "Phone Case";

export interface Design {
  id: string;
  title: string;
  imageUrl: string;
  category: DesignCategory;
  status: DesignStatus;
  basePrice: number;
  creatorFeePercent: number;
  ordersCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface StatsSummary {
  totalDesigns: number;
  totalEarnings: number;
  monthlyViews: number;
  pendingOrders: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface MockupTemplate {
  category: DesignCategory;
  /** Overlay area on the template image (0.0 - 1.0 relative to template dimensions) */
  overlayBox: { x: number; y: number; width: number; height: number };
  aspectRatio: number; // width / height for the crop lock
}

export interface ProfitBreakdown {
  salePrice: number;
  productionCost: number;
  platformFeePercent: number;
  creatorFeePercent: number;
  creatorEarnings: number;
  platformEarnings: number;
  productionCostActual: number;
}
