"use client";

import { usePDF } from "react-to-pdf";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Sale } from "@/types";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  cashTendered?: number;
  change?: number;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  sale,
  cashTendered,
  change,
}: ReceiptModalProps) {
  const { toPDF, targetRef } = usePDF({
    filename: sale ? `receipt-${sale.id.slice(-6)}.pdf` : "receipt.pdf",
  });

  if (!sale) return null;

  const displayChange =
    typeof change === "number" ? change : Math.max(sale.total - (cashTendered ?? 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt" maxWidth="max-w-sm">
      <div className="space-y-4">
        <div
          ref={targetRef}
          className="rounded-lg border border-slate-200 bg-white p-5 font-mono text-sm text-slate-800"
        >
          <div className="mb-3 border-b border-dashed border-slate-300 pb-3 text-center">
            <p className="text-base font-bold text-slate-900">TillFlow Store</p>
            <p className="text-xs text-slate-500">123 Market Street, Accra</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDate(sale.createdAt)}
            </p>
            <p className="text-xs text-slate-400">Receipt #{sale.id.slice(-6).toUpperCase()}</p>
          </div>

          <table className="w-full text-xs">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-slate-200">
              {sale.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 border-t border-dashed border-slate-300 pt-3">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">{formatCurrency(sale.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash</span>
              <span>{formatCurrency(cashTendered ?? sale.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span>{formatCurrency(displayChange)}</span>
            </div>
          </div>

          <p className="mt-4 border-t border-dashed border-slate-300 pt-3 text-center text-xs text-slate-500">
            Thank you for shopping with us!
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => toPDF()}>Print / Save PDF</Button>
        </div>
      </div>
    </Modal>
  );
}