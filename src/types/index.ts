export type Role = "ADMIN" | "CASHIER";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  total: number;
  createdAt: string;
  cashierId: string | null;
  cashier: { id: string; name: string; email: string; role: Role } | null;
  items: SaleItem[];
}

export interface SaleListItem {
  id: string;
  total: number;
  createdAt: string;
  cashierId: string | null;
  cashier: { id: string; name: string; email: string; role: Role } | null;
  items: { id: string; quantity: number }[];
}