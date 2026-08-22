"use client";

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function rowClasses(stock: number): string {
  if (stock === 0) return "bg-red-50 hover:bg-red-100";
  if (stock <= 5) return "bg-amber-50 hover:bg-amber-100";
  return "";
}

function stockBadge(stock: number) {
  if (stock === 0) return <Badge color="red">Out of stock</Badge>;
  if (stock <= 5) return <Badge color="amber">Low · {stock}</Badge>;
  return <Badge color="green">{stock}</Badge>;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHead>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Price</TableHeaderCell>
        <TableHeaderCell>Stock</TableHeaderCell>
        <TableHeaderCell>Barcode</TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableHead>
      <tbody>
        {products.map((product) => (
          <TableRow key={product.id} className={rowClasses(product.stock)}>
            <TableCell className="font-medium text-slate-900">
              {product.name}
            </TableCell>
            <TableCell>{formatCurrency(product.price)}</TableCell>
            <TableCell>{stockBadge(product.stock)}</TableCell>
            <TableCell className="text-slate-500">
              {product.barcode || "—"}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => onDelete(product)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell className="py-10 text-center text-slate-400">
              No products yet. Click “Add Product” to get started.
            </TableCell>
          </TableRow>
        )}
      </tbody>
    </Table>
  );
}