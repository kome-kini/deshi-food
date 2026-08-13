# DESHIJAAT deployment guide

DESHIJAAT has two deliberately separate deployment modes:

1. **Sites experience demo** — fast visual storytelling and representative
   dashboards. It must not accept real payments, expose real customer data, or
   describe synthetic provenance/analytics as verified.
2. **Production commerce platform** — Next.js server routes backed by
   Supabase/PostgreSQL and Prisma, private object storage, provider webhooks,
   background jobs, and server-enforced RBAC.

The current repository's Sites/Vinext setup can publish the first mode. The
Prisma schema, API contract, and analytics blueprint are the handoff for the
second mode.

## 1. Sites demo deployment

Use the repository's existing Sites configuration and package manager.

```bash
npm ci
npm run build
```

Publish through the Sites hosting workflow after the build passes. Keep the
demo safe:

- label invented catalog, revenue, orders, customers, experiments, suppliers,
  trace records, and recommendations as demo/synthetic;
- do not connect a Stripe live key, a real Supabase service role, customer
  messaging, or courier booking to the public demo;
- do not collect payment PINs, OTPs, card numbers, identity documents, or real
  addresses;
- keep account/admin interactions read-only or use disposable demo state;
- show `Pending verification` whenever evidence is absent;
- ensure the demo's admin route is not presented as a secure production control
  center simply because it is visually hidden from storefront navigation.

If the demo needs durable Sites-owned records later, use the hosting platform's
managed persistence bindings. Do not point browser code directly at the
production Supabase database.

## 2. Production topology

```text
Browser / mobile web
        |
        v
Next.js server and API routes
  |       |         |          |
  |       |         |          +--> Email/SMS/push adapters
  |       |         +-------------> Stripe/payment and courier adapters
  |       +-----------------------> Private object storage (evidence/media)
  +-------------------------------> Supabase PostgreSQL via Prisma
                                          |
                                          +--> scheduled analytics workers
                                          +--> backups / PITR / read replicas
```

The browser receives only the public Supabase URL/anonymous key when a supported
client-auth flow needs them. Catalog, checkout, admin, analytics, and evidence
reads still pass through the server API. The database is not a public catalog
API.

For the simplest initial rollout, deploy Next.js on a Node-compatible runtime.
If production runs on Cloudflare Workers, use a supported Prisma driver adapter
or Prisma Accelerate/Hyperdrive-compatible pooling; do not ship the native
Prisma binary engine to an incompatible Worker runtime. Test transactions,
prepared statements, and connection reuse against the chosen pooler.

## 3. Runtime and package baseline

- Node.js 22 LTS or the version supported by the chosen host.
- PostgreSQL 16+ through Supabase.
- Matching pinned `prisma` and `@prisma/client` versions.
- A migration-capable direct database connection available only to CI/release
  jobs.
- A pooled runtime connection with a conservative per-instance connection
  limit.

The supplied schema uses the Prisma 6 datasource URL syntax and validates with
Prisma 6.19. If the application standardizes on Prisma 7+, move connection URLs
to the version's `prisma.config.ts` flow and use the required driver adapter;
keep the model and PostgreSQL constraints unchanged. Do not mix major versions
between the CLI and generated client.

## 4. Environment variables

Create separate values for local, preview, staging, and production. No preview
deployment should share the production database, storage bucket, webhook
endpoint, or messaging account.

### Required application values

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Browser-safe | Canonical HTTPS origin |
| `DATABASE_URL` | Server only | Pooled runtime PostgreSQL URL |
| `DIRECT_URL` | Release jobs only | Direct PostgreSQL URL for migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Supabase project URL for supported auth flows |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe | Public anonymous key; RLS still mandatory |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged server operation when strictly needed |
| `SUPABASE_JWKS_URL` | Server only | Verify Supabase JWTs using current signing keys |
| `SESSION_COOKIE_SECRET` | Server only | Encrypt/sign app session cookies if used |
| `TOKEN_HASH_SECRET` | Server only | Keyed hash for trace, anonymous, recipient, and IP tokens |
| `FIELD_ENCRYPTION_KEY` | Server/KMS only | Envelope encryption for required sensitive fields |
| `ANALYTICS_HASH_SALT` | Server only | Environment-specific privacy hash salt |
| `CRON_SECRET` | Worker only | Authenticate scheduled internal jobs |

### Payment and fulfilment values

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser-safe | Stripe Elements/Checkout public key |
| `STRIPE_SECRET_KEY` | Server only | Stripe API credential |
| `STRIPE_WEBHOOK_SECRET` | Server only | Stripe raw-body signature verification |
| `PAYMENT_MODE` | Server only | Must be `test` until go-live approval |
| `BKASH_*`, `NAGAD_*`, `ROCKET_*` | Server only | Future adapter credentials, never placeholders in live mode |
| `COURIER_*` | Server only | Courier API/webhook credentials |

### Storage and messaging values

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `MEDIA_BUCKET` | Server only | Public-approved product media bucket |
| `EVIDENCE_BUCKET` | Server only | Private compliance evidence bucket |
| `STORAGE_SIGNING_SECRET` | Server only | Short-lived upload/download signatures |
| `EMAIL_PROVIDER_API_KEY` | Server only | Transactional/consented marketing email |
| `SMS_PROVIDER_API_KEY` | Server only | Transactional/consented SMS |
| `PUSH_PROVIDER_KEY` | Server only | Optional push channel |

Use the host's secret store. Never commit `.env`, log values, print them during
build, expose service/payment keys with a `NEXT_PUBLIC_` prefix, or reuse the
same hashing/encryption secret across environments.

## 5. Supabase/PostgreSQL provisioning

1. Create separate Supabase projects for staging and production in an approved
   region with the required data-residency and latency profile.
2. Enable point-in-time recovery and set backup retention before accepting
   orders.
3. Enable the PostgreSQL `citext` extension used for case-insensitive email and
   coupon uniqueness.
4. Create a migration role, a least-privilege runtime role, and an analytics
   worker role. Do not run the web application as the database owner.
5. Configure runtime pooling. Reserve direct connections for migrations and
   controlled maintenance.
6. Keep all application tables inaccessible to anonymous/authenticated
   Supabase client roles unless an explicit, reviewed RLS policy requires
   otherwise. Server APIs still perform object-level authorization.
7. Use private buckets for supplier documents, lab reports, certificates, and
   label evidence. Serve only short-lived signed URLs after permission checks.

Example extension bootstrap (run once as an authorized migration role):

```sql
CREATE EXTENSION IF NOT EXISTS citext;
```

## 6. Prisma migration flow

Install matching client/CLI versions in the production application, then:

```bash
npx prisma format --schema prisma/schema.prisma
npx prisma validate --schema prisma/schema.prisma
npx prisma migrate dev --name deshijaat_initial --schema prisma/schema.prisma
```

Inspect the generated SQL. Add or invoke the PostgreSQL checks and partial
indexes in `prisma/hardening.sql` from the same reviewed migration. In CI and
production, never use `db push`:

```bash
npx prisma migrate deploy --schema prisma/schema.prisma
psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f prisma/hardening.sql
npx prisma generate --schema prisma/schema.prisma
```

Migration rules:

- back up and rehearse against a production-sized staging copy;
- use expand/backfill/contract for destructive or large changes;
- create large indexes concurrently in a non-transactional operational
  migration when needed;
- set statement/lock timeouts and monitor long locks;
- never delete or rewrite inventory movements, captured order snapshots,
  audit events, or payment/webhook identity during a routine migration;
- ensure every rollback plan preserves payment, order, and stock truth.

### Synthetic seed data

`prisma/seed.sql` is explicitly invented and non-production. It includes
unpublished products, pending evidence, invalid-domain customer emails, and a
critical `synthetic_seed_marker` data-quality issue.

Only load it into a disposable local/test database:

```bash
psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f prisma/seed.sql
```

Production startup and release checks should fail when this query returns a row:

```sql
SELECT 1
FROM data_quality_issues
WHERE rule_key = 'synthetic_seed_marker'
  AND status IN ('OPEN', 'ACKNOWLEDGED');
```

Never copy seeded analytics, experiments, reviews, campaign ROI, supplier data,
traceability, or recommendations into production reports.

## 7. Authentication and RBAC

1. Configure verified email/phone flows and approved identity providers in
   Supabase Auth (or the selected server auth layer).
2. Validate JWT signatures, issuer, audience, expiry, and session revocation on
   the server. Do not trust role claims that the browser can edit.
3. Map the immutable provider subject through `UserIdentity`; do not key users
   by mutable email.
4. Assign `UserRole` only through a super-admin-controlled server action. Keep
   role/permission writes out of normal profile APIs.
5. Require MFA and recent authentication for staff, price publishing, evidence
   decisions, holds/recalls, refunds, exports, secrets, and role management.
6. Make account/admin pages dynamic and authorize every server action and API
   object. Hiding a button or route is not access control.
7. Hash stored sessions, rotate cookie/session secrets, set `HttpOnly`,
   `Secure`, and appropriate `SameSite`, and revoke sessions after sensitive
   account changes.

## 8. Checkout and inventory correctness

Checkout must be one server-owned transaction:

1. Load the cart and verify ownership.
2. Re-resolve active prices, promotions, delivery, and tax.
3. Lock inventory levels in deterministic variant/warehouse/batch order.
4. Reject held, quarantined, expired, recalled, depleted, or unverified blocked
   batches.
5. Confirm non-negative available quantity and valid reservations.
6. Create immutable order/item/address/price/cost snapshots.
7. Convert reservations and append inventory movements.
8. Create a payment attempt using the request idempotency key.
9. Commit before contacting asynchronous providers where an outbox/webhook
   state machine is required.

Use short reservation expiries and an idempotent sweeper. Never calculate stock
from client state or show urgency that is not backed by the same authoritative
inventory transaction.

## 9. Stripe-ready payment rollout

1. Start with Stripe test mode and a dedicated staging webhook endpoint.
2. Use hosted Checkout or Elements so DESHIJAAT never handles raw card numbers,
   CVVs, or PINs.
3. Create payment intents on the server from the authoritative order total and
   include only non-sensitive internal references in metadata.
4. Verify the webhook against the raw request body and timestamp. Insert the
   provider event ID before any side effect.
5. Mark a payment captured only from a verified webhook/provider API result,
   never from a browser redirect.
6. Make capture, refund, and cancellation idempotent. A timed-out request returns
   an unknown/pending state until reconciliation; it must not create a second
   order or refund.
7. Reconcile captured/refunded amounts daily and open a critical data-quality
   issue for any mismatch.
8. Complete business, legal, tax, refund-policy, and PCI-scope review before
   switching `PAYMENT_MODE=live`.

bKash, Nagad, Rocket, COD, and card gateways use the same internal adapter
contract and webhook/idempotency rules. Provider availability in the UI depends
on a configured and healthy adapter, not on a hardcoded button.

## 10. Evidence and claim publishing

Production publishing is gated independently for supplier, origin, processing,
label, claim, laboratory, certification, and batch status.

- Store evidence bytes privately; PostgreSQL stores metadata, SHA-256 digest,
  expiry, and review state.
- Malware-scan and MIME-validate uploads; ignore browser filenames for storage
  keys.
- Expired/revoked evidence automatically returns the related state to pending
  and triggers a publication review.
- Product filters and structured SEO data may expose a claim only while its
  explicit evidence decision is approved and current.
- Never infer or manufacture `organic`, `pure`, `natural`, `chemical-free`,
  halal, health-benefit, therapeutic, geographic-origin, laboratory, supplier,
  or processing claims.
- Moderate reviews/Q&A so customer anecdotes do not become medical evidence.
- A hold/recall overrides marketing, recommendations, availability, and public
  sale state.

## 11. Background jobs and analytics

Deploy workers or scheduled server jobs for:

- reservation expiry and abandoned-cart detection;
- consent/suppression checks and email/SMS/push queues;
- payment/courier webhook retry and reconciliation;
- low-stock, expiry, hold/recall exposure, and data-quality monitoring;
- product/business/channel/funnel/search aggregates;
- RFM, cohort retention, attribution, CLV, sales forecasts, elasticity, and
  recommendations;
- experiment metric calculation and guardrail monitoring.

Jobs use a database lease or idempotency key, source watermarks, bounded
lookback, and observable row counts. Late refunds/returns restate affected
partitions. Metric definitions live in `docs/ANALYTICS.md`.

AI-style recommendations remain decision support: record input evidence,
model/version, confidence, expected impact, and expiry. A human acceptance is
still separate from changing price, placing a purchase order, publishing a
claim, or sending a campaign.

## 12. Security and observability

- Enforce HTTPS/HSTS, restrictive CORS, CSP, CSRF protection for cookie writes,
  secure headers, request size limits, and endpoint-specific rate limits.
- Redact email, phone, address, trace token, cookies, authorization, provider
  payloads, and secrets from logs. Store keyed IP/recipient hashes only where a
  documented need exists.
- Send request IDs through API, Prisma transactions, provider calls, jobs,
  webhooks, and audit logs.
- Alert on payment mismatch, negative inventory, failed migrations/jobs,
  elevated checkout errors, webhook backlog, data-quality criticals, evidence
  expiry, recall exposure, and unexpected admin exports.
- Use an append-only audit sink or restricted audit role. The application role
  should not update/delete audit logs or inventory movements.
- Run dependency, secret, SAST, authorization, and migration checks in CI. Test
  object-level access using multiple customer and role fixtures.
- Define retention/deletion schedules for sessions, analytics events, message
  destinations, evidence, customer PII, orders, finance, and audit records with
  applicable Bangladeshi legal advice.

## 13. CI/CD stages

1. Install from lockfile and verify generated Prisma client is in sync.
2. Format/validate schema; create a disposable PostgreSQL database.
3. Apply migrations plus `prisma/hardening.sql` and execute the synthetic seed.
4. Run invariant, API, RBAC, checkout concurrency, idempotency, and webhook
   replay tests.
5. Build Next.js/Sites artifact and run accessibility/performance tests.
6. Deploy preview with preview-only database and provider test accounts.
7. Require approval for production migration, deploy, and traffic switch.
8. Run smoke tests: catalog, sign-in, cart quote, test-mode checkout health,
   admin authorization denial, webhook signature rejection, metrics freshness.
9. Monitor before completing rollout; rollback application traffic without
   reversing committed payment/order/stock facts.

## 14. Go-live checklist

- [ ] No synthetic seed marker or `.invalid` identities in production
- [ ] Database backup/PITR and restore drill verified
- [ ] RLS/direct grants and server object authorization reviewed
- [ ] Admin MFA and least-privilege roles tested
- [ ] Evidence buckets private; signed access and malware scan tested
- [ ] Catalog publication gates and prohibited-claim tests pass
- [ ] Inventory oversell/concurrency and reservation expiry tests pass
- [ ] Coupon limit, price-history, and discount-truth tests pass
- [ ] Payment/courier webhook signatures and replay idempotency pass
- [ ] Refund and reconciliation runbook approved
- [ ] Consent, suppression, unsubscribe, and retarget export controls pass
- [ ] Analytics definitions, timezone, exclusions, and freshness visible
- [ ] A/B results show uncertainty and do not auto-declare winners
- [ ] Recommendation actions require human authorization
- [ ] Accessibility, reduced-motion, mobile performance, and error states pass
- [ ] Incident, recall, data-breach, and disaster-recovery runbooks rehearsed
