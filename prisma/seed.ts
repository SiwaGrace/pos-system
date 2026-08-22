import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const cashierPassword = await bcrypt.hash("cashier123", 10);

  await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: {
      name: "Shop Admin",
      email: "admin@shop.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "cashier@shop.com" },
    update: {},
    create: {
      name: "Jane Cashier",
      email: "cashier@shop.com",
      password: cashierPassword,
      role: "CASHIER",
    },
  });

  const products = [
    { name: "Cocoa Powder 500g", price: 25.5, stock: 40, barcode: "1001" },
    { name: "Rolled Oats 1kg", price: 32, stock: 3, barcode: "1002" },
    { name: "Granulated Sugar 1kg", price: 12, stock: 60, barcode: "1003" },
    { name: "Cooking Oil 2L", price: 45, stock: 24, barcode: "1004" },
    { name: "Tomato Paste 400g", price: 18, stock: 0, barcode: "1005" },
    { name: "Long Grain Rice 5kg", price: 120, stock: 15, barcode: "1006" },
    { name: "Evaporated Milk 400g", price: 15.75, stock: 55, barcode: "1007" },
    { name: "Instant Coffee 100g", price: 38.25, stock: 2, barcode: "1008" },
  ];

  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.product.deleteMany({});

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seeding complete.");
  console.log("Admin:  admin@shop.com / admin123");
  console.log("Cashier: cashier@shop.com / cashier123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });