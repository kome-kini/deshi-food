# Analytics metric blueprint

This blueprint keeps dashboard numbers reproducible. Curated metric rows include
`calculationVersion` and `calculatedAt`; recalculation writes a new version or
replaces only the affected partition inside a transaction. All monetary values
are BDT minor units.

## Shared rules

- Use `Payment.status=CAPTURED` and exclude cancelled/test/synthetic orders from
  production revenue.
- Use the order's `placedAt` for demand and payment capture/refund time for cash
  reporting. Label the time basis in every chart.
- Exclude VAT/tax from net revenue when it is collected on behalf of government.
  Delivery revenue/cost is reported separately and included in net profit only.
- Late returns, refunds, attribution, and courier events trigger bounded
  restatement of historical partitions.
- All dashboard date boundaries use `Asia/Dhaka`; stored timestamps remain UTC.
- A zero denominator returns `null` in the API, not zero or infinity.
- Forecasts, elasticity, attribution, CLV, and recommendations are estimates and
  show their model/version and confidence information.
- Synthetic seed rows are selected only in demo/test environments and must be
  visibly labelled.

## Product analysis

| Metric | Definition |
| --- | --- |
| Best-selling products | Rank by fulfilled net units and net item revenue; expose both rankings |
| Contribution margin | Item net revenue − item COGS − allocated variable fulfilment/payment cost |
| Gross margin rate | Gross profit ÷ net item revenue |
| Low-stock alert | Available quantity ≤ reorder point, enriched with forecast demand and supplier lead time |
| Return rate | Returned units ÷ fulfilled units for the eligible return window |
| Refund rate | Refunded item amount ÷ captured item net revenue |
| Inventory turnover | COGS over period ÷ average inventory cost; quantity turnover is reported separately |
| Days of cover | Available quantity ÷ forecast average daily units |
| Bundle attach rate | Orders containing the bundle ÷ eligible orders viewing/containing a bundle anchor; label denominator |
| Trace conversion | Purchases within the attribution window after trace view ÷ unique trace-view sessions |

Do not call `compareAtAmountMinor` a discount unless it was a genuine prior
price and meets the approved pricing policy. Low-stock messages derive from the
same authoritative stock transaction used by checkout.

## Business analysis

| Metric | Definition |
| --- | --- |
| Gross revenue | Item gross amount before discounts/refunds, excluding cancelled orders |
| Net revenue | Gross revenue − item/order discounts − refunds, with tax treatment stated |
| Gross profit | Net revenue − COGS |
| Net profit | Gross profit + net delivery income − payment fees − marketing spend − allocated operating costs |
| Average order value | Net order revenue ÷ captured orders |
| Customer acquisition cost | Attributable acquisition spend ÷ newly acquired customers; show blended and paid CAC |
| Historical customer value | Cumulative customer gross profit after refunds |
| Predicted CLV | Modelled future contribution margin; never mix with historical value without a label |
| Repeat purchase rate | Customers with a subsequent captured order ÷ eligible first-time customers |
| Funnel conversion | Captured purchase sessions ÷ consented eligible sessions |
| Sales forecast | Predicted units and revenue with lower/upper bounds for the stated horizon |

Revenue can be grouped by day/week/month using Dhaka-local calendar boundaries.
The data model stores gross profit separately from net profit so dashboards do
not mislabel one as the other.

## Marketing and promotion analysis

| Metric | Definition |
| --- | --- |
| Coupon redemption rate | Redeemed eligible orders ÷ eligible orders; a second chart may use redemptions ÷ issued codes |
| Discount effectiveness | Incremental gross profit after discount and campaign cost versus a stated baseline/control |
| Discount elasticity | Percentage change in units ÷ percentage change in effective price; show sample and uncertainty |
| Channel ROAS | Attributed revenue ÷ spend |
| Channel ROI | (Attributed gross profit − spend) ÷ spend |
| Email/SMS delivery rate | Delivered ÷ sent, excluding provider-suppressed destinations as labelled |
| Open/click rate | Unique opens/clicks ÷ delivered; privacy-limited opens are marked approximate |
| Message conversion | Attributed captured orders ÷ delivered messages within the configured window |
| Abandoned-cart recovery | Recovered carts or revenue ÷ eligible contacted abandoned carts/revenue |
| Promotion attribution | Credits by explicit first/last/linear/position/data-driven model; totals per order sum to 1 |
| Experiment uplift | Variant primary-metric change versus control with sample, interval, and guardrail status |

Negative incremental profit is shown as negative. A campaign with zero spend has
`null` ROI/ROAS. Attribution does not imply causality; experiments are the
preferred causal evidence where feasible.

## RFM segmentation

RFM is calculated on captured, non-test orders as of `snapshotDate`:

- Recency: whole days since the latest captured order.
- Frequency: count of distinct captured orders in the configured lookback.
- Monetary: net customer revenue or contribution margin; the chosen basis is
  embedded in `calculationVersion`.
- Scores: quintiles from 1–5, with score 5 representing best recency/frequency/
  monetary value. Ties use deterministic boundaries.

Suggested labels include `CHAMPION`, `LOYAL`, `POTENTIAL_LOYALIST`,
`NEW_CUSTOMER`, `AT_RISK`, `HIBERNATING`, and `PROSPECT`. Labels guide analysis,
not eligibility for harmful or discriminatory treatment. Promotion targeting
also requires channel consent and compliance suppression checks.

## Cohort retention

The default commerce cohort is the Dhaka-local calendar month of first captured
order. Period 0 is the cohort's acquisition period. A member is retained in a
later period when they place at least one captured, non-refunded order in that
period. Report both customer retention and net revenue retention. Customers do
not move between first-order cohorts after late event restatement unless their
first valid order changes.

## Recommended jobs

| Schedule | Job |
| --- | --- |
| Every 5 minutes | Expire reservations; detect newly abandoned carts |
| Hourly | Aggregate events, messaging outcomes, low stock, batch exposure |
| Nightly | Product/business/channel metrics, RFM, cohort retention, recommendations |
| Weekly | Forecast refresh, discount elasticity, CLV and attribution model comparison |
| On demand | Experiment analysis, recall exposure, audited exports, historical backfill |

Each job uses a lease/idempotency key, watermarks source timestamps, records row
counts and duration, and opens a `DataQualityIssue` on invariant failure.

## Data-quality invariants

- Sum of order item totals plus delivery/tax minus order discounts equals order
  total.
- Refund totals never exceed captured payment or corresponding line total.
- Attribution credit fractions for an order/model sum to 1 within tolerance.
- Inventory available is non-negative and reconciles to on-hand less reserved,
  held, and damaged quantities.
- Coupon redemptions respect time, total, and per-customer limits.
- Experiment allocations sum to 1 and assignment does not change after exposure.
- Published provenance/claim filters have current approved evidence.
- Retargeting members have current opt-in consent and are absent from suppression
  lists at send time.
- Production metric queries exclude synthetic/test markers.
