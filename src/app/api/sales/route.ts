import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (session.user.role === "CASHIER") {
    where.cashierId = session.user.id;
  }

  const gte = from ? new Date(`${from}T00:00:00`) : undefined;
  const lte = to ? new Date(`${to}T23:59:59.999`) : undefined;
  if (gte || lte) {
    where.createdAt = {
      ...(gte ? { gte } : {}),
      ...(lte ? { lte } : {}),
    };
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      cashier: { select: { id: true, name: true, email: true, role: true } },
      items: { select: { id: true, quantity: true } },
    },
  });

  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    items?: { productId: string; quantity: number }[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const items = rawItems.map((item) => ({
    productId: String(item.productId),
    quantity: Number(item.quantity),
  }));

  const invalid = items.some(
    (item) =>
      !item.productId ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0,
  );
  if (invalid) {
    return NextResponse.json(
      { error: "Invalid cart items" },
      { status: 400 },
    );
  }

  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      let total = 0;
      const saleItems: { productId: string; name: string; price: number; quantity: number }[] =
        [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        total += product.price * item.quantity;
        saleItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const sale = await tx.sale.create({
        data: {
          total,
          cashierId: session.user.id,
          items: { create: saleItems },
        },
        include: {
          cashier: { select: { id: true, name: true, email: true, role: true } },
          items: true,
        },
      });

      return sale;
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process sale";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}