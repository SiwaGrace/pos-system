"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}