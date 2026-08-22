import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sale = await prisma.sale.findUnique({
    where: { id: params.id },
    include: {
      cashier: { select: { id: true, name: true, email: true, role: true } },
      items: true,
    },
  });

  if (!sale) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.user.role === "CASHIER" && sale.cashierId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(sale);
}