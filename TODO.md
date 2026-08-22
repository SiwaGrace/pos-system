# Future Plans (decided 2026-08-22)

## 1. Admin "Manage Users" page

Build when TillFlow is used by a real shop (demo/portfolio projects don't need it).

- Page: `/dashboard/users`, admin-only (`ADMIN` role check server-side via `getServerSession`, also guard API routes).
- Features:
  - List users (name, email, role, created date).
  - Create cashier account (name, email, password) - hash with `bcryptjs` exactly like `prisma/seed.ts`.
  - Reset a user's password.
  - Deactivate/delete a user (consider soft-delete so sale history keeps its `cashier` relation).
- Roles stay simple: `ADMIN` | `CASHIER` (see `prisma/schema.prisma` Role enum).

## 2. Multi-shop support (one deployment serving multiple shops)

Chosen approach: **shared database, row-level tenancy** (easiest, standard at this scale).

- New `Shop` model: id, name, createdAt.
- Add `shopId` FK to: `User`, `Product`, `Sale` (and anything tenant-specific later).
- Session/JWT carries `shopId`; every Prisma query is scoped with `where: { shopId }` from the session - never trust the client.
- Onboarding flow: sign-up creates a `Shop` + its first `ADMIN` user; that admin invites/creates cashiers (ties into the Manage Users page above).
- Unique fields become per-shop (e.g. barcode unique *per shop*): use `@@unique([shopId, barcode])`.
- Seeding: seed one demo shop containing the current demo data.
