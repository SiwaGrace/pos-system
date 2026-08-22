"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SalesTable from "@/components/sales/SalesTable";
import ReceiptModal from "@/components/sales/ReceiptModal";
import { toast } from "@/store/toastStore";
import type { Sale } from "@/types";

export default function SalesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [viewing, setViewing] = useState<Sale | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const loadSales = useCallback(async (fromDate?: string, toDate?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);
      const query = params.toString();
      const res = await fetch(`/api/sales${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error();
      const data: Sale[] = await res.json();
      setSales(data);
    } catch {
      toast.error("Could not load sales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadSales();
  }, [status, loadSales]);

  function handleFilter() {
    loadSales(from || undefined, to || undefined);
  }

  function handleClear() {
    setFrom("");
    setTo("");
    loadSales();
  }

  async function handleView(sale: Sale) {
    setViewLoading(true);
    try {
      const res = await fetch(`/api/sales/${sale.id}`);
      if (!res.ok) throw new Error();
      const full: Sale = await res.json();
      setViewing(full);
    } catch {
      toast.error("Could not load sale details");
    } finally {
      setViewLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="w-40">
          <Input
            label="From"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Input
            label="To"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pb-0.5">
          <Button onClick={handleFilter}>Filter</Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          {sales.length} transaction{sales.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading sales...</p>
      ) : (
        <SalesTable sales={sales} onView={handleView} />
      )}

      {viewLoading && (
        <p className="py-4 text-center text-sm text-slate-500">
          Loading sale details...
        </p>
      )}

      <ReceiptModal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        sale={viewing}
      />
    </div>
  );
}