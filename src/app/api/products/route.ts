import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);
  const barcode =
    typeof body.barcode === "string" && body.barcode.trim()
      ? body.barcode.trim()
      : null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Price must be a valid number" }, { status: 400 });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ error: "Stock must be a valid number" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, price, stock, barcode },
  });
  return NextResponse.json(product, { status: 201 });
}