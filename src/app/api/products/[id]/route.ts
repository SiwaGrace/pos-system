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

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
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

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { name, price, stock, barcode },
  });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}