"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProductGrid from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import CheckoutModal from "@/components/pos/CheckoutModal";
import ReceiptModal from "@/components/sales/ReceiptModal";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/store/toastStore";
import type { Product, Sale } from "@/types";

export default function POSPage() {
  const { status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<{ cash: number; change: number }>({
    cash: 0,
    change: 0,
  });

  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error();
      const data: Product[] = await res.json();
      setProducts(data);
    } catch {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadProducts();
  }, [status, loadProducts]);

  async function handleConfirm(cash: number) {
    setSubmitting(true);
    try {
      const items = useCartStore.getState().items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const total = useCartStore.getState().total();

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error ?? "Failed to complete sale");
      }

      const sale: Sale = body;
      const change = Math.max(cash - total, 0);
      clearCart();
      setCheckoutOpen(false);
      setReceiptSale(sale);
      setReceiptMeta({ cash, change });
      toast.success("Sale completed successfully");
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete sale");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4 lg:flex-row">
      <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
        {loading ? (
          <p className="py-16 text-center text-slate-400">Loading products...</p>
        ) : (
          <ProductGrid
            products={products}
            onAdd={(product) => {
              addItem(product);
              toast.info(`${product.name} added to cart`);
            }}
          />
        )}
      </div>

      <div className="w-full lg:w-80 xl:w-96">
        <Cart onCheckout={() => setCheckoutOpen(true)} />
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleConfirm}
        submitting={submitting}
      />

      <ReceiptModal
        isOpen={!!receiptSale}
        onClose={() => setReceiptSale(null)}
        sale={receiptSale}
        cashTendered={receiptMeta.cash}
        change={receiptMeta.change}
      />
    </div>
  );
}