"use client";

import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <button
      onClick={() => onAdd(product)}
      disabled={outOfStock}
      className={`group flex flex-col rounded-xl border p-4 text-left shadow-sm transition-all ${
        outOfStock
          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md active:scale-95"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold ${
            lowStock ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {product.name.charAt(0).toUpperCase()}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            outOfStock
              ? "bg-red-100 text-red-700"
              : lowStock
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {outOfStock ? "Out of stock" : `${product.stock} left`}
        </span>
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-900">
        {product.name}
      </p>
      <p className="mt-2 text-sm font-bold text-indigo-600">
        {formatCurrency(product.price)}
      </p>
    </button>
  );
}