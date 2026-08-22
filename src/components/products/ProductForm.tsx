"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Product } from "@/types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: Product | null;
  onSubmit: (data: {
    name: string;
    price: number;
    stock: number;
    barcode: string;
  }) => Promise<void>;
}

const emptyForm = { name: "", price: "", stock: "", barcode: "" };

export default function ProductForm({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          name: initial.name,
          price: String(initial.price),
          stock: String(initial.stock),
          barcode: initial.barcode ?? "",
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      next.price = "Enter a valid price";
    }
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      next.stock = "Enter a valid stock number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        barcode: form.barcode.trim(),
      });
      setForm(emptyForm);
      onClose();
    } catch {
      // error toast handled by parent
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? "Edit Product" : "Add Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          placeholder="e.g. Cocoa Powder 500g"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (GHS) *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            error={errors.price}
          />
          <Input
            label="Stock *"
            type="number"
            step="1"
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            error={errors.stock}
          />
        </div>
        <Input
          label="Barcode"
          placeholder="Optional"
          value={form.barcode}
          onChange={(e) => handleChange("barcode", e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initial ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}