"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cashTendered: number) => Promise<void>;
  submitting: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  submitting,
}: CheckoutModalProps) {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const [cashTendered, setCashTendered] = useState("");
  const [error, setError] = useState("");

  const cash = Number(cashTendered);
  const hasValidCash = Number.isFinite(cash) && cash >= 0;
  const change = hasValidCash ? cash - total : 0;
  const sufficient = hasValidCash && cash >= total;

  function close() {
    setCashTendered("");
    setError("");
    onClose();
  }

  async function handleConfirm() {
    if (!sufficient) {
      setError("Cash tendered is less than the total.");
      return;
    }
    setError("");
    await onConfirm(cash);
    setCashTendered("");
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title="Checkout" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-3 py-2 text-slate-800">{item.name}</td>
                  <td className="px-3 py-2 text-slate-500">{item.quantity}</td>
                  <td className="px-3 py-2 text-right font-medium text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="font-medium text-slate-600">Total</span>
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>

        <Input
          label="Cash Tendered (GHS)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={cashTendered}
          onChange={(e) => setCashTendered(e.target.value)}
          autoFocus
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
          <span className="font-medium text-emerald-700">Change due</span>
          <span className="text-lg font-bold text-emerald-700">
            {formatCurrency(change)}
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={close} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            disabled={submitting || !hasValidCash}
          >
            {submitting ? "Processing..." : "Confirm Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}