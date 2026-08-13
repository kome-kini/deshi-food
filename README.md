# DESHIJAAT

A cinematic Bangladesh-first food commerce experience with batch-aware
traceability, a durable staging cart/order flow, and a comprehensive business
analytics control room. The public experience is Bangla-first; all included
catalog, provenance, customer, order, and analytics values are clearly marked
synthetic demo data.

## Quick start

Requires Node.js 22.13 or newer.

```bash
npm install
npm run db:generate
npm run dev
```

## Clean installation and deployment

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the environment file and fill in provider credentials only when enabling those integrations:

   ```bash
   cp .env.example .env.local
   ```

3. Generate the database migration artifacts:

   ```bash
   npm run db:generate
   ```

   The runnable demo uses local catalogue data. For PostgreSQL/Supabase, apply
   `prisma migrate deploy` and `prisma/hardening.sql` as described in
   `DEPLOYMENT.md`. Never run `prisma/seed.sql` outside a disposable test
   database.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Build for production and run the verification suite:

   ```bash
   npm run lint
   npm run build
   node --test tests/rendered-html.test.mjs
   npm run start
   ```

6. Deploy the Cloudflare Sites build using the project workflow in `DEPLOYMENT.md` (or your CI provider's equivalent). Never commit `.env.local` or provider secrets.

## IP3 catalogue photographs

The 30 supplied product photographs live in `public/media/products`; the seven
category photographs live in `public/media/categories`. Demo catalogue items
reference their designated image directly.

After PostgreSQL migrations and hardening are applied, import the same 30
products as unpublished database drafts and attach their primary media records:

```powershell
psql $env:DIRECT_URL -v ON_ERROR_STOP=1 -f prisma/import-ip3-catalog.sql
```

The import is idempotent. It does not create prices, variants, inventory,
verification decisions, provenance claims, or published products. Complete
those records and approvals in the admin workflow before publishing.

## Product surfaces

- `/` cinematic storefront and regional storytelling
- `/catalog` search, category/region filters, and product discovery
- `/products/[slug]` product detail, claim-safe provenance and public batch trace
- `/cart`, `/checkout`, `/track`, `/account` staging customer journey
- `/admin` product, sales, customer, growth, experiment, cohort, RFM, recovery,
  attribution, and explainable recommendation analytics
- `db/` + `drizzle/` Sites D1 persistence for the deployed staging experience
- `prisma/` production PostgreSQL/Supabase schema, hardening, and seed handoff
- `docs/API.md`, `docs/ANALYTICS.md`, and `DEPLOYMENT.md`

## Validation

```bash
npm run build
node --test tests/rendered-html.test.mjs
npm run db:generate
```

The staging checkout never captures money. Production payment, courier,
inventory reservation, public authentication, evidence storage, and messaging
integrations must follow the provider-adapter and webhook guidance in
`DEPLOYMENT.md`.
