# TillFlow — Point of Sale

A production-ready, simple Point of Sale (POS) web application built for small shops in Ghana/Africa. It replaces the paper-and-calculator workflow with a clean digital system that any shop owner can use daily on a tablet, laptop, or phone.

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 14 (App Router) + TypeScript    |
| Styling      | Tailwind CSS                            |
| Database     | PostgreSQL + Prisma ORM                 |
| Auth         | NextAuth.js (credentials provider)      |
| State        | Zustand (cart state only)               |
| PDF/Receipts | react-to-pdf                            |
| Payments     | Paystack-ready (env vars only, no wiring) |

## Features

- **Authentication** — Email + password login, bcrypt-hashed passwords, two roles (ADMIN / CASHIER), protected dashboard routes.
- **Dashboard** — Stat cards for today's sales, today's transactions, all-time revenue, and low-stock alerts.
- **Products (Admin only)** — Add / edit / delete products. Low-stock rows highlighted amber, out-of-stock rows red.
- **POS / Checkout** — Searchable product grid, tap-to-add cart, quantity controls, checkout modal with cash tendered and automatic change, printable receipt.
- **Sales History** — Full sales list with date-range filter, role-based visibility, and a detail/receipt view.
- **Responsive** — Works on tablets and mobile at the counter.

## Getting Started

> **Prerequisites:** Node.js 20+, a running PostgreSQL instance (local or hosted).

### Step 1 — Clone and install

```bash
git clone <your-repo-url> tillflow
cd tillflow
npm install
```

### Step 2 — Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"
NEXTAUTH_SECRET="a-long-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret with: `openssl rand -base64 32`

### Step 3 — Set up the database

```bash
npx prisma migrate dev --name init   # creates tables
npx prisma db seed                    # loads demo users + products
```

### Step 4 — Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in.

## Demo Logins

| Role    | Email            | Password   |
| ------- | ---------------- | ---------- |
| Admin   | admin@shop.com   | admin123   |
| Cashier | cashier@shop.com | cashier123 |

## Useful Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # start production server
npm run lint         # eslint
npx prisma studio    # browse the database
npx prisma db seed   # re-seed demo data
```

## API Overview

| Method | Endpoint            | Access     | Purpose                              |
| ------ | ------------------- | ---------- | ------------------------------------ |
| GET    | `/api/products`     | Any user   | List all products                    |
| POST   | `/api/products`     | Admin      | Create a product                     |
| GET    | `/api/products/[id]`| Any user   | Get one product                      |
| PUT    | `/api/products/[id]`| Admin      | Update a product                     |
| DELETE | `/api/products/[id]`| Admin      | Delete a product                     |
| GET    | `/api/sales`        | Any user   | List sales (role + date filtered)    |
| POST   | `/api/sales`        | Any user   | Create sale + reduce stock (atomic)  |
| GET    | `/api/sales/[id]`   | Any user   | Get one sale with full details       |

**Checkout is atomic.** `POST /api/sales` runs a Prisma transaction: it validates stock, creates the sale + sale items, and decrements stock in one step. If anything fails, nothing is saved.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # login page
│   ├── (dashboard)/           # protected area
│   │   ├── layout.tsx         # sidebar + topbar shell
│   │   ├── dashboard/         # stats + low stock
│   │   ├── products/          # admin CRUD
│   │   ├── pos/               # product grid + cart + checkout
│   │   └── sales/             # sales history + receipts
│   ├── api/                   # products + sales REST routes
│   └── layout.tsx
├── components/
│   ├── ui/                    # Button, Input, Modal, Badge, Table, Toaster
│   ├── products/              # ProductTable, ProductForm, ProductCard
│   ├── pos/                   # ProductGrid, Cart, CheckoutModal
│   ├── sales/                 # SalesTable, ReceiptModal
│   └── layout/                # Sidebar, Topbar
├── lib/                       # prisma, auth, utils
├── store/                     # Zustand cart + toast stores
└── types/                     # shared TypeScript types
```

## Not Included (by design)

Barcode scanning, receipt printer hardware, multi-branch, analytics charts, offline/PWA, mobile app, email notifications, CSV export, and real payment integration. Paystack env vars are staged in `.env.example` for future use.

## License

Private / internal use.
