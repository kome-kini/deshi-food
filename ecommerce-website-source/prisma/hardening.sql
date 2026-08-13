-- PostgreSQL constraints Prisma cannot currently express directly.
-- Apply after the generated migration and before accepting traffic.

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.add_check(
  target_table regclass,
  constraint_name text,
  expression_sql text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = target_table AND conname = constraint_name
  ) THEN
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I CHECK (%s)',
      target_table,
      constraint_name,
      expression_sql
    );
  END IF;
END;
$$;

SELECT pg_temp.add_check('product_variants', 'product_variants_positive_net_quantity', 'net_quantity > 0');
SELECT pg_temp.add_check('product_variants', 'product_variants_nonnegative_stock_controls', 'low_stock_threshold >= 0 AND reorder_point >= 0 AND reorder_quantity >= 0');
SELECT pg_temp.add_check('product_variants', 'product_variants_valid_tax_rate', 'tax_rate >= 0 AND tax_rate <= 1');

SELECT pg_temp.add_check('product_prices', 'product_prices_bdt_only', 'currency = ''BDT''');
SELECT pg_temp.add_check('product_prices', 'product_prices_nonnegative_money', 'amount_minor >= 0 AND (compare_at_amount_minor IS NULL OR compare_at_amount_minor >= 0) AND (cost_amount_minor IS NULL OR cost_amount_minor >= 0)');
SELECT pg_temp.add_check('product_prices', 'product_prices_valid_window', 'valid_until IS NULL OR valid_until > valid_from');

SELECT pg_temp.add_check('inventory_batches', 'inventory_batches_date_order', 'best_before_date IS NULL OR packaged_date IS NULL OR best_before_date >= packaged_date');
SELECT pg_temp.add_check('inventory_levels', 'inventory_levels_nonnegative', 'quantity_on_hand >= 0 AND quantity_reserved >= 0 AND quantity_available >= 0 AND quantity_on_hold >= 0 AND quantity_damaged >= 0');
SELECT pg_temp.add_check('inventory_levels', 'inventory_levels_reconcile', 'quantity_available = quantity_on_hand - quantity_reserved - quantity_on_hold - quantity_damaged');
SELECT pg_temp.add_check('inventory_movements', 'inventory_movements_positive_quantity', 'quantity > 0');
SELECT pg_temp.add_check('inventory_movements', 'inventory_movements_has_location', 'from_warehouse_id IS NOT NULL OR to_warehouse_id IS NOT NULL');
SELECT pg_temp.add_check('stock_reservations', 'stock_reservations_positive_quantity', 'quantity > 0');
SELECT pg_temp.add_check('stock_reservations', 'stock_reservations_one_owner', 'num_nonnulls(cart_item_id, order_item_id) = 1');
SELECT pg_temp.add_check('inventory_holds', 'inventory_holds_positive_quantity', 'quantity > 0');

SELECT pg_temp.add_check('carts', 'carts_bdt_only', 'currency = ''BDT''');
SELECT pg_temp.add_check('carts', 'carts_nonnegative_money', 'subtotal_minor >= 0 AND discount_minor >= 0 AND delivery_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0');
SELECT pg_temp.add_check('cart_items', 'cart_items_positive_quantity', 'quantity > 0');
SELECT pg_temp.add_check('cart_items', 'cart_items_nonnegative_money', 'unit_price_minor >= 0 AND (unit_cost_minor IS NULL OR unit_cost_minor >= 0) AND discount_minor >= 0');

SELECT pg_temp.add_check('orders', 'orders_bdt_only', 'currency = ''BDT''');
SELECT pg_temp.add_check('orders', 'orders_nonnegative_money', 'subtotal_minor >= 0 AND discount_minor >= 0 AND delivery_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0 AND cost_of_goods_minor >= 0');
SELECT pg_temp.add_check('order_items', 'order_items_positive_quantity', 'quantity > 0 AND returned_quantity >= 0 AND returned_quantity <= quantity');
SELECT pg_temp.add_check('order_items', 'order_items_nonnegative_money', 'unit_price_minor >= 0 AND unit_cost_minor >= 0 AND discount_minor >= 0 AND tax_minor >= 0 AND line_total_minor >= 0 AND refunded_minor >= 0 AND refunded_minor <= line_total_minor');
SELECT pg_temp.add_check('order_batch_allocations', 'order_batch_allocations_positive_quantity', 'quantity > 0');

SELECT pg_temp.add_check('payments', 'payments_bdt_only', 'currency = ''BDT''');
SELECT pg_temp.add_check('payments', 'payments_nonnegative_amount', 'amount_minor >= 0');
SELECT pg_temp.add_check('shipment_items', 'shipment_items_positive_quantity', 'quantity > 0');
SELECT pg_temp.add_check('return_items', 'return_items_positive_quantity', 'quantity > 0');
SELECT pg_temp.add_check('refunds', 'refunds_bdt_only', 'currency = ''BDT''');
SELECT pg_temp.add_check('refunds', 'refunds_positive_amount', 'amount_minor > 0');
SELECT pg_temp.add_check('refund_items', 'refund_items_valid_values', 'amount_minor > 0 AND (quantity IS NULL OR quantity > 0)');

SELECT pg_temp.add_check('product_reviews', 'product_reviews_rating_range', 'rating BETWEEN 1 AND 5 AND (quality_rating IS NULL OR quality_rating BETWEEN 1 AND 5) AND (packaging_rating IS NULL OR packaging_rating BETWEEN 1 AND 5) AND (delivery_rating IS NULL OR delivery_rating BETWEEN 1 AND 5)');

SELECT pg_temp.add_check('promotions', 'promotions_percentage_range', 'percentage IS NULL OR (percentage > 0 AND percentage <= 1)');
SELECT pg_temp.add_check('promotions', 'promotions_nonnegative_money', '(amount_minor IS NULL OR amount_minor >= 0) AND (bundle_price_minor IS NULL OR bundle_price_minor >= 0) AND (max_discount_minor IS NULL OR max_discount_minor >= 0) AND (minimum_order_minor IS NULL OR minimum_order_minor >= 0)');
SELECT pg_temp.add_check('promotions', 'promotions_valid_window', 'ends_at IS NULL OR ends_at > starts_at');
SELECT pg_temp.add_check('coupons', 'coupons_positive_limits', '(usage_limit_total IS NULL OR usage_limit_total > 0) AND (usage_limit_per_customer IS NULL OR usage_limit_per_customer > 0)');
SELECT pg_temp.add_check('coupons', 'coupons_valid_window', 'ends_at IS NULL OR ends_at > starts_at');
SELECT pg_temp.add_check('coupon_redemptions', 'coupon_redemptions_nonnegative_discount', 'discount_applied_minor >= 0');
SELECT pg_temp.add_check('order_discounts', 'order_discounts_nonnegative_amount', 'amount_minor >= 0');
SELECT pg_temp.add_check('bundle_items', 'bundle_items_positive_quantity', 'quantity > 0');

SELECT pg_temp.add_check('campaign_spend', 'campaign_spend_nonnegative_values', 'spend_minor >= 0 AND impressions >= 0 AND clicks >= 0');
SELECT pg_temp.add_check('attribution_credits', 'attribution_credits_fraction_range', 'credit_fraction >= 0 AND credit_fraction <= 1');
SELECT pg_temp.add_check('attribution_credits', 'attribution_credits_nonnegative_revenue', 'revenue_minor >= 0');
SELECT pg_temp.add_check('recovery_attempts', 'recovery_attempts_positive_number', 'attempt_number > 0');

SELECT pg_temp.add_check('daily_product_metrics', 'daily_product_metrics_rate_range', 'return_rate BETWEEN 0 AND 1 AND refund_rate BETWEEN 0 AND 1');
SELECT pg_temp.add_check('daily_business_metrics', 'daily_business_metrics_rate_range', 'repeat_purchase_rate BETWEEN 0 AND 1 AND funnel_conversion_rate BETWEEN 0 AND 1');
SELECT pg_temp.add_check('promotion_daily_metrics', 'promotion_daily_metrics_rate_range', 'redemption_rate BETWEEN 0 AND 1 AND discount_depth BETWEEN 0 AND 1');
SELECT pg_temp.add_check('bundle_daily_metrics', 'bundle_daily_metrics_attach_rate_range', 'attach_rate BETWEEN 0 AND 1');
SELECT pg_temp.add_check('customer_rfm_snapshots', 'customer_rfm_snapshots_scores', 'recency_days >= 0 AND frequency_orders >= 0 AND recency_score BETWEEN 1 AND 5 AND frequency_score BETWEEN 1 AND 5 AND monetary_score BETWEEN 1 AND 5 AND (churn_risk IS NULL OR churn_risk BETWEEN 0 AND 1)');
SELECT pg_temp.add_check('cohort_retention', 'cohort_retention_valid_values', 'period_number >= 0 AND eligible_members >= 0 AND retained_members >= 0 AND retained_members <= eligible_members AND retention_rate BETWEEN 0 AND 1');
SELECT pg_temp.add_check('recommendations', 'recommendations_valid_values', 'priority BETWEEN 0 AND 100 AND (confidence IS NULL OR confidence BETWEEN 0 AND 1) AND (recommended_quantity IS NULL OR recommended_quantity > 0)');

SELECT pg_temp.add_check('experiment_variants', 'experiment_variants_allocation_range', 'allocation > 0 AND allocation <= 1');
SELECT pg_temp.add_check('experiment_metric_results', 'experiment_metric_results_valid_values', 'sample_size >= 0 AND (p_value IS NULL OR p_value BETWEEN 0 AND 1)');
SELECT pg_temp.add_check('idempotency_keys', 'idempotency_keys_valid_expiry', 'expires_at > locked_at');

CREATE UNIQUE INDEX IF NOT EXISTS product_prices_one_open_price_per_type
  ON product_prices (variant_id, type)
  WHERE valid_until IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS addresses_one_default_per_user
  ON addresses (user_id)
  WHERE is_default;

CREATE UNIQUE INDEX IF NOT EXISTS carts_one_open_cart_per_user
  ON carts (user_id)
  WHERE user_id IS NOT NULL AND status IN ('ACTIVE', 'CHECKOUT_STARTED');

CREATE INDEX IF NOT EXISTS inventory_levels_low_stock_lookup
  ON inventory_levels (variant_id, quantity_available);

CREATE INDEX IF NOT EXISTS inventory_batches_expiry_lookup
  ON inventory_batches (best_before_date)
  WHERE status IN ('RECEIVED', 'RELEASED', 'ON_HOLD', 'QUARANTINED');

COMMIT;
