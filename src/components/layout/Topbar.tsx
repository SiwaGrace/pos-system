"use client";

import { usePathname } from "next/navigation";
import Badge from "@/components/ui/Badge";

interface TopbarProps {
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
}

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pos": "Point of Sale",
  "/sales": "Sales History",
  "/products": "Products",
};

export default function Topbar({ name, email, role }: TopbarProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "TillFlow";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-500">{email}</p>
        </div>
        <Badge color={role === "ADMIN" ? "indigo" : "slate"}>{role}</Badge>
      </div>
    </header>
  );
}