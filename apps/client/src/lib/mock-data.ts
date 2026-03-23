import type { Design, StatsSummary, RevenueDataPoint } from "@/types";

export const MOCK_DESIGNS: Design[] = [
  {
    id: "1",
    title: "Neon Abstract Waves",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    category: "T-Shirt",
    status: "active",
    basePrice: 29.99,
    creatorFeePercent: 15,
    ordersCount: 42,
    viewsCount: 1240,
    createdAt: "2026-02-10",
  },
  {
    id: "2",
    title: "Cozy Mountain Peaks",
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    category: "Pillow Case",
    status: "active",
    basePrice: 24.99,
    creatorFeePercent: 12,
    ordersCount: 28,
    viewsCount: 870,
    createdAt: "2026-02-15",
  },
  {
    id: "3",
    title: "Minimalist Line Art",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    category: "T-Shirt",
    status: "active",
    basePrice: 27.99,
    creatorFeePercent: 18,
    ordersCount: 65,
    viewsCount: 3200,
    createdAt: "2026-01-28",
  },
];

export const MOCK_STATS: StatsSummary = {
  totalDesigns: 3,
  totalEarnings: 1284.50,
  monthlyViews: 6070,
  pendingOrders: 5,
};

export const MOCK_REVENUE: RevenueDataPoint[] = [
  { date: "Jan", revenue: 120 },
  { date: "Feb", revenue: 340 },
  { date: "Mar", revenue: 280 },
  { date: "Apr", revenue: 520 },
  { date: "May", revenue: 410 },
  { date: "Jun", revenue: 680 },
  { date: "Jul", revenue: 590 },
  { date: "Aug", revenue: 820 },
  { date: "Sep", revenue: 740 },
  { date: "Oct", revenue: 960 },
  { date: "Nov", revenue: 1100 },
  { date: "Dec", revenue: 1284 },
];

export const DESIGN_CATEGORIES = [
  "T-Shirt", "Hoodie", "Pillow Case", "Mug", "Tote Bag", "Phone Case"
] as const;

export interface FeedItem {
  id: string;
  title: string;
  price: number;
  image: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2 | 3;
}

const BASE_ITEMS = [
  { title: "A", price: 45, image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format", colSpan: 2, rowSpan: 2 },
  { title: "B", price: 55, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "C", price: 38, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format", colSpan: 1, rowSpan: 2 },
  { title: "D", price: 42, image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "E", price: 60, image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "F", price: 35, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format", colSpan: 2, rowSpan: 1 },
  { title: "G", price: 29, image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format", colSpan: 1, rowSpan: 2 },
  { title: "H", price: 65, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format", colSpan: 2, rowSpan: 2 },
  { title: "I", price: 70, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "J", price: 40, image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "K", price: 48, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format", colSpan: 1, rowSpan: 3 },
  { title: "L", price: 52, image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "M", price: 33, image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format", colSpan: 2, rowSpan: 1 },
  { title: "N", price: 25, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format", colSpan: 1, rowSpan: 1 },
  { title: "O", price: 44, image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format", colSpan: 1, rowSpan: 2 },
];

export const MOCK_FEED_ITEMS: FeedItem[] = Array.from({ length: 50 }, (_, i) => {
  const base = BASE_ITEMS[i % BASE_ITEMS.length];
  return {
    ...base,
    id: `f${i + 1}`,
    title: `${base.title}-${i + 1}`,
    colSpan: base.colSpan as 1 | 2,
    rowSpan: base.rowSpan as 1 | 2 | 3,
  };
});
