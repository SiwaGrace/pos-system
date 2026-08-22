import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, todayStart } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const LOW_STOCK_THRESHOLD = 5;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const startOfToday = todayStart();
  const saleScope =
    session.user.role === "CASHIER" ? { cashierId: session.user.id } : {};

  const [todaySalesAgg, todayCount, allTimeAgg, lowStockProducts] =
    await Promise.all([
      prisma.sale.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfToday }, ...saleScope },
      }),
      prisma.sale.count({
        where: { createdAt: { gte: startOfToday }, ...saleScope },
      }),
      prisma.sale.aggregate({ _sum: { total: true }, where: saleScope }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { stock: "asc" },
      }),
    ]);

  const todayTotal = todaySalesAgg._sum.total ?? 0;
  const allTimeTotal = allTimeAgg._sum.total ?? 0;

  const stats = [
    {
      label: "Sales Today",
      value: formatCurrency(todayTotal),
      sub: "Revenue today",
      color: "bg-indigo-500",
    },
    {
      label: "Transactions Today",
      value: String(todayCount),
      sub: "Completed sales",
      color: "bg-emerald-500",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(allTimeTotal),
      sub: "All time",
      color: "bg-sky-500",
    },
    {
      label: "Low Stock Items",
      value: String(lowStockProducts.length),
      sub: `At or below ${LOW_STOCK_THRESHOLD}`,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 h-1 w-10 rounded-full ${stat.color}`} />
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Low Stock Alerts</h2>
          <Badge color="amber">{lowStockProducts.length} items</Badge>
        </div>
        {lowStockProducts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            All products have sufficient stock. 
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {lowStockProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900">
                    {product.name}
                  </span>
                  {product.stock === 0 && <Badge color="red">Out of stock</Badge>}
                </div>
                <Badge color={product.stock === 0 ? "red" : "amber"}>
                  {product.stock === 0 ? "Sold out" : `${product.stock} left`}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}