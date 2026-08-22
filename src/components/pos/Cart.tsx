"use client";

import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface CartProps {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="font-semibold text-slate-900">Current Sale</h3>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            Tap a product to add it to the sale.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.productId} className="py-3">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-300 transition-colors hover:text-red-500"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.productId)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {formatCurrency(item.price)} each
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
        <Button
          className="w-full py-3 text-base"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}