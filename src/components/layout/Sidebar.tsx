"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Role } from "@/types";

interface SidebarProps {
  role: Role;
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/pos", label: "POS", icon: "🛒" },
  { href: "/sales", label: "Sales History", icon: "📋" },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const items = [
    ...links,
    ...(role === "ADMIN"
      ? [{ href: "/products", label: "Products", icon: "📦" }]
      : []),
  ];

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col bg-[#1a1a2e] text-slate-300">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
          T
        </span>
        <div>
          <p className="text-base font-bold text-white">TillFlow</p>
          <p className="text-xs text-slate-400">Point of Sale</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="text-base">⎋</span>
          Logout
        </button>
      </div>
    </aside>
  );
}