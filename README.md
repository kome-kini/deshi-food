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
npm run dev
```

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
