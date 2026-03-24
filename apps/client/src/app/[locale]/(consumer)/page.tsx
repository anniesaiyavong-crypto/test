"use client";

export const runtime = 'edge';

import { ProductFeed } from "@/features/feed/components/ProductFeed";

export default function HomePage() {
  return (
    <div className="max-w-full lg:px-4">
      {/* Discovery Feed Section */}
      <section>
        <ProductFeed />
      </section>
    </div>
  );
}
