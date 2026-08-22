"use client";

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate, shortId } from "@/lib/utils";
import type { Sale } from "@/types";

interface SalesTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
}

export default function SalesTable({ sales, onView }: SalesTableProps) {
  return (
    <Table>
      <TableHead>
        <TableHeaderCell>Sale ID</TableHeaderCell>
        <TableHeaderCell>Date / Time</TableHeaderCell>
        <TableHeaderCell>Items</TableHeaderCell>
        <TableHeaderCell>Total</TableHeaderCell>
        <TableHeaderCell>Cashier</TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableHead>
      <tbody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-mono font-medium text-slate-900">
              #{shortId(sale.id)}
            </TableCell>
            <TableCell>{formatDate(sale.createdAt)}</TableCell>
            <TableCell>
              {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
            </TableCell>
            <TableCell className="font-semibold text-slate-900">
              {formatCurrency(sale.total)}
            </TableCell>
            <TableCell>{sale.cashier?.name ?? "—"}</TableCell>
            <TableCell>
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={() => onView(sale)}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {sales.length === 0 && (
          <TableRow>
            <TableCell className="py-10 text-center text-slate-400">
              No sales recorded.
            </TableCell>
          </TableRow>
        )}
      </tbody>
    </Table>
  );
}