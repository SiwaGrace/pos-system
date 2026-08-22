"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import { toast } from "@/store/toastStore";
import type { Product } from "@/types";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadProducts();
    }
  }, [status, loadProducts]);

  async function handleSubmit(data: {
    name: string;
    price: number;
    stock: number;
    barcode: string;
  }) {
    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to save product");
    }
    toast.success(editing ? "Product updated" : "Product added");
    setEditing(null);
    await loadProducts();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted");
      setDeleting(null);
      await loadProducts();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (status === "loading") {
    return <p className="text-slate-500">Loading...</p>;
  }

  if (session?.user.role !== "ADMIN") {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-slate-500">
        <p className="text-lg font-medium">Access restricted</p>
        <p className="text-sm">Only administrators can manage products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>+ Add Product</Button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading products...</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditing(product);
            setFormOpen(true);
          }}
          onDelete={(product) => setDeleting(product)}
        />
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Product"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{deleting?.name}</span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}