# DESHIJAAT API contract

This document defines the production HTTP boundary for the DESHIJAAT storefront,
customer account, control center, and analytics service. The current Sites build
may use representative local data; these contracts describe the database-backed
implementation.

Base path: `/api/v1`

## Conventions

- JSON request and response bodies use `camelCase`; PostgreSQL remains
  `snake_case` through Prisma mappings.
- Every monetary value is an integer number of BDT minor units (poisha). Because
  the database uses `BigInt`, JSON returns money as a decimal string, for example
  `{ "amountMinor": "18000", "currency": "BDT" }` for ৳180.00.
- Quantities are decimal strings, for example `"1.000"`, so weighted goods do
  not lose precision.
- Timestamps are UTC ISO 8601. Local presentation uses `Asia/Dhaka`.
- Collection endpoints use cursor pagination:
  `?limit=24&after=<opaqueCursor>`. `limit` defaults to 24 and is capped at 100.
- Successful single-resource responses use `{ "data": ... }`; collections use
  `{ "data": [...], "page": { "nextCursor": null, "hasMore": false } }`.
- Errors use stable machine codes:

```json
{
  "error": {
    "code": "INSUFFICIENT_INVENTORY",
    "message": "The requested quantity is no longer available.",
    "requestId": "req_01...",
    "details": { "availableQuantity": "2.000" }
  }
}
```

- Write responses include an `ETag`; administrative updates accept
  `If-Match` to prevent lost updates.
- `POST` endpoints that create orders, payments, refunds, inventory movements,
  messages, or imports require `Idempotency-Key`. Reusing a key with a different
  request body returns `409 IDEMPOTENCY_CONFLICT`.

## Authentication and authorization

Public catalog reads do not require authentication. Account and cart ownership
use a verified Supabase/Auth.js-style server session. The API derives `userId`
and roles from that session; it never accepts an acting user ID from the client.

Admin routes require server-side RBAC permissions. Representative grants are:

| Permission | Purpose |
| --- | --- |
| `admin.catalog.write` | Products, variants, prices, categories |
| `admin.inventory.write` | Receipts, reservations, movements |
| `admin.compliance.review` | Evidence, claims, holds, recalls |
| `admin.orders.write` | Orders and fulfilment |
| `admin.refunds.write` | Return and refund decisions |
| `admin.marketing.write` | Promotions, campaigns, messages |
| `admin.analytics.read` | Aggregate dashboards |
| `admin.analytics.export` | Approved privacy-screened exports |
| `admin.users.manage` | Roles and access; super-admin only |

Admin users should have MFA. Sensitive actions require a recent-auth check and
an audit reason. UI visibility is never treated as authorization.

## Storefront catalog and provenance

### `GET /catalog/products`

Returns only `ACTIVE` products with `publishApproved=true`, an active variant,
and a current sell price. Supported filters:

`q`, `category`, `region`, `district`, `producer`, `processing`, `packSize`,
`minPriceMinor`, `maxPriceMinor`, `originStatus`, `inStock`, `codAvailable`,
`rating`, and `sort=featured|popular|newest|price_asc|price_desc`.

Filters for origin, processing, certification, halal, organic, purity, or other
trust claims return a product only when the corresponding evidence is approved
and current. Missing evidence is returned as `PENDING`; it is never inferred.

```json
{
  "data": [{
    "id": "uuid",
    "slug": "kalijira-aromatic-rice",
    "nameBn": "কালিজিরা সুগন্ধি চাল",
    "nameEn": "Kalijira Aromatic Rice",
    "verification": {
      "origin": "PENDING",
      "processing": "PENDING",
      "claims": "PENDING_REVIEW"
    },
    "fromPrice": { "amountMinor": "18000", "currency": "BDT" },
    "available": true
  }],
  "page": { "nextCursor": null, "hasMore": false }
}
```

### `GET /catalog/products/{slug}`

Returns bilingual content, media, ingredients/allergens, variants, current
prices, truthful stock state, evidence-backed claims, public provenance, review
summary, related products, and eligible bundles. Internal supplier IDs, evidence
storage keys, costs, private batch IDs, and warehouse counts are excluded.

### `GET /catalog/search/suggestions?q={term}`

Returns safe product/category/region suggestions. Raw search text is not logged
until analytics consent is available; stored search analytics are normalized and
hashed, with only allowlisted safe display terms retained.

### `GET /trace/{publicToken}`

Looks up an opaque public trace token and returns allowlisted batch events,
public recall status, and the explicit verification state for source,
processing, lab reports, and certification. A not-found token returns `404`
without exposing internal identifiers or suggesting a near match.

## Cart, discounts, and checkout

### `POST /carts`

Creates an authenticated cart or an anonymous cart bound to an `HttpOnly`,
`Secure`, `SameSite=Lax` opaque cookie.

### `GET /carts/{cartId}`

Returns the owner-visible cart, price freshness, reservation expiry, totals,
delivery threshold, and eligible recommendations.

### `POST /carts/{cartId}/items`

```json
{
  "variantId": "uuid",
  "quantity": "1.000"
}
```

The server resolves the current price and stock; client-submitted amounts are
ignored. `PATCH /carts/{cartId}/items/{itemId}` changes quantity and `DELETE`
removes it. Quantity validation uses inventory reservations with expiry.

### `POST /carts/{cartId}/coupon`

```json
{ "code": "WELCOME5" }
```

The response explains eligibility and recalculated totals. Coupon limits,
audience rules, time windows, stacking rules, and historical use are checked
inside the same transaction. `DELETE /carts/{cartId}/coupon` removes it.

### `POST /checkout/quote`

Validates address serviceability, inventory, price, coupon, taxes, delivery
method, and payment-method availability. A quote has a short expiry and is not
an order.

```json
{
  "cartId": "uuid",
  "deliveryAddressId": "uuid",
  "deliveryMethod": "standard",
  "paymentProvider": "COD"
}
```

### `POST /checkout/orders`

Requires `Idempotency-Key`. In one database transaction it revalidates the
quote, locks the required inventory rows, converts reservations, snapshots
product/price/address values, creates the order, and starts the payment adapter.

```json
{
  "quoteId": "opaque",
  "acceptedTermsVersion": "2026-08",
  "marketingConsent": { "email": false, "sms": false }
}
```

For Stripe, the response may include a short-lived client secret. For COD it
returns the placed order. The endpoint never accepts PINs, OTPs, CVVs, or raw
card data.

## Customer accounts

| Method and path | Contract |
| --- | --- |
| `GET /account/me` | Profile, preferences, consent status, account summary |
| `PATCH /account/me` | Update display preferences; does not change roles |
| `GET /account/addresses` | List own addresses |
| `POST /account/addresses` | Validate and add an address |
| `PATCH /account/addresses/{id}` | Update an owned address |
| `DELETE /account/addresses/{id}` | Delete an unused owned address |
| `GET /account/orders` | Paginated own order history |
| `GET /account/orders/{orderNumber}` | Own order, items, payments, shipment timeline |
| `POST /account/orders/{orderNumber}/reorder` | Creates a new cart using current prices/stock |
| `GET /account/wishlists` | Own lists and items |
| `POST /account/wishlists/{id}/items` | Add a product to an owned list |
| `DELETE /account/wishlists/{id}/items/{productId}` | Remove an item |
| `POST /account/orders/{orderNumber}/returns` | Request eligible food-safe return/complaint review |
| `GET /account/returns/{returnNumber}` | Own return decision and refund state |
| `POST /account/products/{productId}/reviews` | Review an eligible fulfilled order item |
| `POST /account/products/{productId}/questions` | Submit a moderated product question |
| `PUT /account/consents/{channel}` | Opt in/out with policy version and timestamp |
| `DELETE /account` | Starts verified privacy deletion workflow |

Review verification comes from a fulfilled `OrderItem`; a boolean supplied by
the browser is ignored. Review/Q&A moderation blocks medical, therapeutic, and
unsupported trust claims from becoming product evidence.

## Order tracking, returns, and refunds

### `GET /account/orders/{orderNumber}/tracking`

Authenticated owner endpoint returning shipment status, estimated delivery,
and public courier events. A guest flow, if enabled, must use a signed,
short-lived token plus a second factor such as destination phone suffix; order
number alone is insufficient.

### `POST /account/orders/{orderNumber}/returns`

```json
{
  "reasonCode": "DAMAGED_PACKAGE",
  "notes": "Package arrived damaged.",
  "items": [{ "orderItemId": "uuid", "quantity": "1.000" }]
}
```

Food safety complaints preserve order-item-to-batch linkage and may trigger a
compliance hold. The API makes no refund promise until policy and evidence are
reviewed.

## Admin catalog, supply, and compliance

| Method and path | Required permission | Purpose |
| --- | --- | --- |
| `GET /admin/products` | `admin.catalog.read` | Search drafts and published products |
| `POST /admin/products` | `admin.catalog.write` | Create unpublished product |
| `PATCH /admin/products/{id}` | `admin.catalog.write` | Update bilingual content/SEO |
| `POST /admin/products/{id}/variants` | `admin.catalog.write` | Add SKU/pack variant |
| `POST /admin/variants/{id}/prices` | `admin.catalog.write` | Schedule regular/sale/cost price |
| `POST /admin/products/{id}/publish` | `admin.catalog.publish` | Publish only after gating checks |
| `GET /admin/producers` | `admin.supply.read` | Producer registry |
| `GET /admin/suppliers` | `admin.supply.read` | Supplier and verification status |
| `POST /admin/suppliers/{id}/verifications` | `admin.compliance.review` | Record evidence-backed decision |
| `POST /admin/evidence/presign` | `admin.compliance.write` | Create short-lived private upload URL |
| `POST /admin/products/{id}/claims` | `admin.compliance.write` | Submit isolated claim text for review |
| `POST /admin/claims/{id}/decision` | `admin.compliance.review` | Approve/reject with evidence and reason |
| `POST /admin/batches/{id}/holds` | `admin.compliance.review` | Hold quantity and append immutable movement |
| `POST /admin/batches/{id}/recalls` | `admin.compliance.recall` | Initiate recall and exposure analysis |

Publishing rejects any product with missing required label data, expired
evidence, unapproved claim text, an active hold/recall, no sellable variant, no
current price, or no available inventory. An approved claim does not implicitly
approve origin, lab, supplier, halal, organic, purity, or processing status.

## Admin inventory and commerce operations

| Method and path | Purpose |
| --- | --- |
| `GET /admin/inventory` | Batch/warehouse availability and low-stock state |
| `POST /admin/inventory/receipts` | Receive a supplier batch with evidence state |
| `POST /admin/inventory/movements` | Transfer/adjust using an append-only movement |
| `GET /admin/inventory/turnover` | Turnover by variant/category/date |
| `GET /admin/orders` | Filter by status, date, payment, shipment, district |
| `PATCH /admin/orders/{id}` | Valid state transition only |
| `POST /admin/orders/{id}/shipments` | Create fulfilment and tracking record |
| `POST /admin/returns/{id}/decision` | Approve/reject with reason and audit trail |
| `POST /admin/refunds` | Create provider refund; idempotency required |
| `GET /admin/batches/{id}/exposure` | Orders/customers/stock affected by batch |

Inventory changes are append-only movements plus transactionally maintained
levels. `quantityAvailable` is never accepted from the client. A negative
available balance, stale reservation, or batch mismatch returns `409`.

## Admin promotions and lifecycle marketing

| Method and path | Purpose |
| --- | --- |
| `GET /admin/promotions` | Promotion calendar and effectiveness |
| `POST /admin/promotions` | Create draft rules and bounded value |
| `POST /admin/promotions/{id}/coupons` | Create normalized coupon codes |
| `GET /admin/promotions/{id}/elasticity` | Baseline, lift, margin, elasticity confidence |
| `GET /admin/bundles` | Bundle composition and attach performance |
| `POST /admin/bundles` | Create draft product/variant bundle |
| `GET /admin/campaigns` | Spend, attribution, ROI/ROAS by channel |
| `POST /admin/campaigns` | Create campaign and UTM contract |
| `GET /admin/audiences` | Segment definitions and aggregate counts |
| `POST /admin/retargeting-lists` | Materialize consent-screened audience |
| `POST /admin/messages/send` | Queue approved email/SMS/push template |
| `GET /admin/abandoned-carts` | Eligible carts and recovery outcomes |

Retargeting exports default to aggregate counts. A contact-level export requires
`admin.marketing.export`, an audit reason, current channel consent, suppression
checks, a short expiry, and encrypted delivery. Opted-out contacts are never
included.

## Analytics ingestion

### `POST /analytics/events`

Accepts a batch of up to 50 versioned events. Events are allowlisted and
schema-validated; unknown properties are dropped. `eventId` provides
idempotency. Authentication is optional for anonymous sessions, but the server
uses an opaque cookie hash rather than raw device identifiers.

```json
{
  "events": [{
    "eventId": "01J...",
    "name": "product_viewed",
    "version": 1,
    "occurredAt": "2026-08-12T10:00:00Z",
    "properties": { "productId": "uuid", "surface": "pdp" }
  }]
}
```

Core event names are `search_submitted`, `search_zero_results`,
`product_viewed`, `trace_viewed`, `added_to_cart`, `cart_abandoned`,
`checkout_started`, `checkout_step_completed`, `checkout_abandoned`,
`purchase_completed`, `refund_completed`, `message_delivered`,
`message_opened`, and `message_clicked`.

Do not send email, phone, address, free-form customer messages, IP addresses,
payment values, OTP/PIN/card data, or unredacted search strings in properties.

## Analytics and recommendation reads

All endpoints accept `from`, `to`, `granularity=day|week|month`, and applicable
filters. The server caps ranges and queries curated metric tables rather than
running uncontrolled client-defined SQL.

| Path | Includes |
| --- | --- |
| `GET /admin/analytics/overview` | Revenue, gross/net profit, orders, AOV, conversion, repeat rate, CAC, CLV |
| `GET /admin/analytics/products` | Best sellers, views, units, margin, return/refund rate, turnover, low stock |
| `GET /admin/analytics/inventory` | Available/held/damaged, days cover, ageing, expiry, turnover |
| `GET /admin/analytics/bundles` | Views, attach rate, orders, revenue, gross profit |
| `GET /admin/analytics/customers/rfm` | RFM segment counts, transitions, CLV and churn bands |
| `GET /admin/analytics/customers/cohorts` | First-order cohorts and period retention |
| `GET /admin/analytics/funnel` | Session → PDP → cart → checkout → purchase and abandonment |
| `GET /admin/analytics/promotions` | Coupon eligibility/use/redemption, incremental profit, elasticity |
| `GET /admin/analytics/channels` | Spend, attributed revenue/profit, CAC, ROI, ROAS |
| `GET /admin/analytics/messaging` | Sent/delivered/open/click/conversion/unsubscribe by channel |
| `GET /admin/analytics/attribution` | First/last/linear/position-model comparison |
| `GET /admin/analytics/experiments` | Variant samples, uplift, confidence intervals, guardrails |
| `GET /admin/analytics/forecast` | Unit/revenue forecast and bounds |
| `GET /admin/analytics/traceability` | Trace scans, conversions, complaints/batch, recall exposure, verification completion |
| `GET /admin/recommendations` | Explainable promotion/restock suggestions awaiting human review |

### `POST /admin/recommendations/{id}/decision`

```json
{
  "decision": "ACCEPTED",
  "reason": "Approved after supplier lead-time review."
}
```

Accepting a recommendation does not automatically change price, publish a
claim, place a purchase order, send a campaign, or release inventory. Those are
separate authorized actions with their own validation and audit records.

## Experiments

`POST /admin/experiments` creates a draft; `POST /{id}/start`, `/pause`, and
`/complete` enforce state transitions. Assignment is deterministic from a keyed
hash and is persisted before exposure. Results report sample size, metric value,
uplift, confidence interval, p-value where appropriate, and guardrail breaches.
The API labels underpowered results as inconclusive rather than choosing a
winner.

## Webhooks

Provider routes are outside the authenticated API namespace:

- `POST /webhooks/stripe`
- `POST /webhooks/courier/{provider}`
- `POST /webhooks/messaging/{provider}`
- future payment-adapter routes under `/webhooks/payments/{provider}`

The handler reads the raw body, verifies the provider signature and timestamp,
inserts `(provider, providerEventId)` before side effects, and processes with a
retryable state machine. Redirect/query parameters never mark payments paid.
Only a digest and allowlisted safe payload are retained; secrets and full raw
payloads are excluded from logs.

## Security and compliance requirements

1. Validate every request with a server schema and apply strict body/range
   limits. Parameterize all database access through Prisma or prepared SQL.
2. Authorize the object as well as the route: customers may access only their
   own cart, addresses, orders, returns, lists, and consents.
3. Keep Supabase service credentials, payment secrets, webhook secrets,
   encryption keys, and messaging keys server-only. Never prefix them with
   `NEXT_PUBLIC_`.
4. Do not store passwords, OTPs, PINs, CVVs, or raw card numbers in DESHIJAAT.
   Stripe-ready checkout stores only provider references and non-sensitive
   method labels.
5. Hash public trace tokens, anonymous IDs, recipient destinations, and IPs with
   environment-specific keyed salts. Encrypt necessary PII at rest and redact
   it from observability tools.
6. Use database transactions and row locks for checkout, reservation release,
   stock movement, coupon redemption, refund, and webhook processing.
7. Rate-limit authentication, coupon, trace, checkout, order-tracking, review,
   question, export, and webhook endpoints. Use CSRF protection for cookie-based
   writes and restrictive CORS.
8. Store immutable audit records for roles, prices, claims, verifications,
   inventory, holds/recalls, refunds, exports, campaigns, and recommendation
   decisions. Audit snapshots must be redacted.
9. Synthetic seed values are not real evidence, reviews, revenue, demand, or
   performance. Production startup should fail if the synthetic data-quality
   marker is present.
10. Never manufacture supplier verification, origin, processing, laboratory or
    certification status; reviews, urgency, stock, discounts, health claims, or
    therapeutic claims. Unknown means `PENDING` and remains unpublished.

## HTTP status summary

| Status | Meaning |
| --- | --- |
| `200/201/204` | Success |
| `400` | Malformed request |
| `401` | No valid session |
| `403` | Authenticated but not authorized |
| `404` | Resource absent or intentionally concealed |
| `409` | Stale update, stock/coupon conflict, duplicate idempotency key |
| `422` | Valid JSON but failed business rules |
| `429` | Rate limit exceeded |
| `500` | Internal error with opaque request ID |
| `503` | Dependency unavailable; no ambiguous payment/order success |
