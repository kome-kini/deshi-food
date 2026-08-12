-- ============================================================================
-- DESHIJAAT SYNTHETIC ANALYTICS SEED — NON-PRODUCTION / NOT REAL CUSTOMERS
-- ============================================================================
-- All identities, suppliers, provenance, orders, reviews, campaign performance,
-- and analytics below are invented test fixtures. They must never be presented
-- as verified evidence, real demand, real reviews, or financial statements.
-- Product publishing remains blocked and provenance remains PENDING.
-- Amounts are BDT minor units (poisha): 18000 = ৳180.00.
-- Run only after applying the Prisma schema to a disposable local/test database.

BEGIN;

-- Roles and least-privilege permissions.
INSERT INTO roles (id, key, name, description, scope, is_system)
VALUES
  ('00000000-0000-4000-8100-000000000001', 'customer', 'Customer', 'Synthetic storefront customer role', 'CUSTOMER', true),
  ('00000000-0000-4000-8100-000000000002', 'admin_analyst', 'Admin analyst', 'Read analytics without commerce mutation', 'ADMIN', true),
  ('00000000-0000-4000-8100-000000000003', 'compliance_reviewer', 'Compliance reviewer', 'Review evidence and claims', 'OPERATIONS', true)
ON CONFLICT DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('00000000-0000-4000-8110-000000000001', 'storefront.account.read', 'Read own account'),
  ('00000000-0000-4000-8110-000000000002', 'storefront.order.create', 'Create own order'),
  ('00000000-0000-4000-8110-000000000003', 'admin.analytics.read', 'Read aggregate analytics'),
  ('00000000-0000-4000-8110-000000000004', 'admin.claim.review', 'Review claim evidence')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
VALUES
  ('00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8110-000000000001'),
  ('00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8110-000000000002'),
  ('00000000-0000-4000-8100-000000000002', '00000000-0000-4000-8110-000000000003'),
  ('00000000-0000-4000-8100-000000000003', '00000000-0000-4000-8110-000000000004')
ON CONFLICT DO NOTHING;

INSERT INTO users (
  id, email, phone_e164, display_name, preferred_locale, status,
  email_verified_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8200-000000000001', 'synthetic.admin@example.invalid', NULL, '[SYNTHETIC] Admin Analyst', 'en-BD', 'ACTIVE', '2026-06-01T08:00:00Z', '2026-06-01T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8200-000000000002', 'synthetic.customer.a@example.invalid', '+8801700000001', '[SYNTHETIC] Customer A', 'bn-BD', 'ACTIVE', '2026-06-10T08:00:00Z', '2026-06-10T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8200-000000000003', 'synthetic.customer.b@example.invalid', '+8801700000002', '[SYNTHETIC] Customer B', 'bn-BD', 'ACTIVE', '2026-07-03T08:00:00Z', '2026-07-03T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8200-000000000004', 'synthetic.customer.c@example.invalid', '+8801700000003', '[SYNTHETIC] Customer C', 'bn-BD', 'ACTIVE', '2026-08-01T08:00:00Z', '2026-08-01T08:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO user_identities (id, user_id, provider, provider_subject, created_at, last_used_at)
VALUES
  ('00000000-0000-4000-8210-000000000001', '00000000-0000-4000-8200-000000000001', 'synthetic_seed', 'synthetic-admin', '2026-06-01T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8210-000000000002', '00000000-0000-4000-8200-000000000002', 'synthetic_seed', 'synthetic-customer-a', '2026-06-10T08:00:00Z', '2026-08-11T10:00:00Z'),
  ('00000000-0000-4000-8210-000000000003', '00000000-0000-4000-8200-000000000003', 'synthetic_seed', 'synthetic-customer-b', '2026-07-03T08:00:00Z', '2026-08-10T11:00:00Z'),
  ('00000000-0000-4000-8210-000000000004', '00000000-0000-4000-8200-000000000004', 'synthetic_seed', 'synthetic-customer-c', '2026-08-01T08:00:00Z', '2026-08-10T12:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, granted_at)
VALUES
  ('00000000-0000-4000-8200-000000000001', '00000000-0000-4000-8100-000000000002', '2026-06-01T08:00:00Z'),
  ('00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8100-000000000001', '2026-06-10T08:00:00Z'),
  ('00000000-0000-4000-8200-000000000003', '00000000-0000-4000-8100-000000000001', '2026-07-03T08:00:00Z'),
  ('00000000-0000-4000-8200-000000000004', '00000000-0000-4000-8100-000000000001', '2026-08-01T08:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO customer_profiles (
  id, user_id, customer_number, first_order_at, last_order_at, total_orders,
  lifetime_revenue_minor, lifetime_gross_profit_minor, acquisition_cost_minor,
  created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8220-000000000001', '00000000-0000-4000-8200-000000000002', 'SYN-CUST-0001', '2026-07-29T09:00:00Z', '2026-08-09T10:00:00Z', 2, 96500, 25000, 18000, '2026-06-10T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8220-000000000002', '00000000-0000-4000-8200-000000000003', 'SYN-CUST-0002', '2026-08-10T11:00:00Z', '2026-08-10T11:00:00Z', 1, 43200, 11200, 12000, '2026-07-03T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8220-000000000003', '00000000-0000-4000-8200-000000000004', 'SYN-CUST-0003', NULL, NULL, 0, 0, 0, 15000, '2026-08-01T08:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Catalog records are synthetic and deliberately unpublished.
INSERT INTO categories (id, slug, name_bn, name_en, sort_order, status)
VALUES
  ('00000000-0000-4000-8300-000000000001', 'rice-and-grains', 'চাল ও শস্য', 'Rice & Grains', 10, 'ACTIVE'),
  ('00000000-0000-4000-8300-000000000002', 'oil-and-ghee', 'তেল ও ঘি', 'Oil & Ghee', 20, 'ACTIVE'),
  ('00000000-0000-4000-8300-000000000003', 'spices', 'মসলা', 'Spices', 30, 'ACTIVE'),
  ('00000000-0000-4000-8300-000000000004', 'honey-and-sweets', 'মধু ও মিষ্টি', 'Honey & Sweets', 40, 'ACTIVE')
ON CONFLICT DO NOTHING;

INSERT INTO producers (id, code, name, story_en, verification_status, status, created_at, updated_at)
VALUES
  ('00000000-0000-4000-8310-000000000001', 'SYN-PROD-RICE', '[SYNTHETIC] Farmer Collective A', 'Invented fixture; no real producer or origin claim.', 'PENDING', 'DRAFT', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8310-000000000002', 'SYN-PROD-OIL', '[SYNTHETIC] Oil Mill A', 'Invented fixture; no real producer or processing claim.', 'PENDING', 'DRAFT', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8310-000000000003', 'SYN-PROD-SPICE', '[SYNTHETIC] Spice Maker A', 'Invented fixture.', 'PENDING', 'DRAFT', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO suppliers (id, code, legal_name, display_name, verification_status, status, created_at, updated_at)
VALUES
  ('00000000-0000-4000-8320-000000000001', 'SYN-SUP-001', '[SYNTHETIC] Supplier Legal Name', '[SYNTHETIC] Pantry Supplier', 'PENDING', 'DRAFT', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO processors (id, code, name, verification_status, status)
VALUES
  ('00000000-0000-4000-8330-000000000001', 'SYN-PROC-001', '[SYNTHETIC] Processor A', 'PENDING', 'DRAFT')
ON CONFLICT DO NOTHING;

INSERT INTO source_locations (
  id, code, name_bn, name_en, country_code, division, district, upazila,
  verification_status
)
VALUES
  ('00000000-0000-4000-8340-000000000001', 'SYN-BD-DHA-TAN', 'টাঙ্গাইল — কৃত্রিম নমুনা', '[SYNTHETIC] Tangail', 'BD', 'Dhaka', 'Tangail', NULL, 'PENDING'),
  ('00000000-0000-4000-8340-000000000002', 'SYN-BD-RAN-GAI', 'গাইবান্ধা — কৃত্রিম নমুনা', '[SYNTHETIC] Gaibandha', 'BD', 'Rangpur', 'Gaibandha', NULL, 'PENDING'),
  ('00000000-0000-4000-8340-000000000003', 'SYN-BD-KHU-JAS', 'যশোর — কৃত্রিম নমুনা', '[SYNTHETIC] Jashore', 'BD', 'Khulna', 'Jashore', NULL, 'PENDING'),
  ('00000000-0000-4000-8340-000000000004', 'SYN-BD-DHA-CITY', 'ঢাকা — কৃত্রিম নমুনা', '[SYNTHETIC] Dhaka', 'BD', 'Dhaka', 'Dhaka', NULL, 'PENDING')
ON CONFLICT DO NOTHING;

INSERT INTO facilities (id, processor_id, source_location_id, code, name, verification_status)
VALUES
  ('00000000-0000-4000-8350-000000000001', '00000000-0000-4000-8330-000000000001', '00000000-0000-4000-8340-000000000004', 'SYN-FAC-001', '[SYNTHETIC] Processing Facility', 'PENDING')
ON CONFLICT DO NOTHING;

INSERT INTO products (
  id, category_id, producer_id, supplier_id, processor_id, slug, product_code,
  name_bn, name_en, short_description_en, description_en, status,
  publish_approved, featured, subscription_eligible, seo_title, seo_description,
  created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8400-000000000001', '00000000-0000-4000-8300-000000000001', '00000000-0000-4000-8310-000000000001', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8330-000000000001', 'synthetic-kalijira-aromatic-rice', 'SYN-RICE-001', 'কালিজিরা সুগন্ধি চাল — কৃত্রিম নমুনা', '[SYNTHETIC] Kalijira Aromatic Rice', 'Invented analytics fixture; provenance pending.', 'No real origin, producer, certification, purity, or quality claim is made.', 'DRAFT', false, false, true, '[SYNTHETIC] Kalijira rice', 'Synthetic fixture. Pending verification.', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8400-000000000002', '00000000-0000-4000-8300-000000000002', '00000000-0000-4000-8310-000000000002', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8330-000000000001', 'synthetic-mustard-oil', 'SYN-OIL-001', 'সরিষার তেল — কৃত্রিম নমুনা', '[SYNTHETIC] Mustard Oil', 'Invented analytics fixture; processing evidence pending.', 'No cold-pressed, pure, organic, chemical-free, or health claim is approved.', 'DRAFT', false, false, true, '[SYNTHETIC] Mustard oil', 'Synthetic fixture. Pending verification.', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8400-000000000003', '00000000-0000-4000-8300-000000000003', '00000000-0000-4000-8310-000000000003', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8330-000000000001', 'synthetic-turmeric-powder', 'SYN-SPICE-001', 'হলুদ গুঁড়া — কৃত্রিম নমুনা', '[SYNTHETIC] Turmeric Powder', 'Invented analytics fixture.', 'No medicinal or purity claim is approved.', 'DRAFT', false, false, true, '[SYNTHETIC] Turmeric powder', 'Synthetic fixture. Pending verification.', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8400-000000000004', '00000000-0000-4000-8300-000000000004', NULL, '00000000-0000-4000-8320-000000000001', NULL, 'synthetic-honey', 'SYN-HONEY-001', 'মধু — কৃত্রিম নমুনা', '[SYNTHETIC] Honey', 'Claim-safety fixture.', 'No purity, floral-source, organic, natural, or therapeutic claim is approved.', 'DRAFT', false, false, false, '[SYNTHETIC] Honey', 'Synthetic fixture. Pending verification.', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, name, sort_order, is_allergen)
VALUES
  ('00000000-0000-4000-8400-000000000001', 'Rice', 1, false),
  ('00000000-0000-4000-8400-000000000002', 'Mustard seed', 1, true),
  ('00000000-0000-4000-8400-000000000003', 'Turmeric', 1, false),
  ('00000000-0000-4000-8400-000000000004', 'Honey', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sources (id, product_id, source_location_id, status, is_primary)
VALUES
  ('00000000-0000-4000-8410-000000000001', '00000000-0000-4000-8400-000000000001', '00000000-0000-4000-8340-000000000002', 'PENDING', true),
  ('00000000-0000-4000-8410-000000000002', '00000000-0000-4000-8400-000000000002', '00000000-0000-4000-8340-000000000001', 'PENDING', true),
  ('00000000-0000-4000-8410-000000000003', '00000000-0000-4000-8400-000000000003', '00000000-0000-4000-8340-000000000003', 'PENDING', true)
ON CONFLICT DO NOTHING;

INSERT INTO product_claims (
  id, product_id, claim_text_en, risk_level, status, review_notes, created_at
)
VALUES
  ('00000000-0000-4000-8420-000000000001', '00000000-0000-4000-8400-000000000002', 'Cold pressed', 'MEDIUM', 'PENDING_REVIEW', 'Synthetic fixture: processing record is absent, so this cannot be published.', '2026-08-01T00:00:00Z'),
  ('00000000-0000-4000-8420-000000000002', '00000000-0000-4000-8400-000000000004', 'Pure organic honey with health benefits', 'PROHIBITED', 'REJECTED', 'Synthetic fixture: unsupported purity, organic, and therapeutic wording is prohibited.', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (
  id, product_id, sku, label, unit, net_quantity, tax_rate,
  low_stock_threshold, reorder_point, reorder_quantity, status, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8400-000000000001', 'SYN-RICE-001-1K', '1 kg', 'kg', 1, 0, 10, 15, 40, 'ACTIVE', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8500-000000000002', '00000000-0000-4000-8400-000000000001', 'SYN-RICE-001-5K', '5 kg', 'kg', 5, 0, 5, 8, 20, 'ACTIVE', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8500-000000000003', '00000000-0000-4000-8400-000000000002', 'SYN-OIL-001-1L', '1 L', 'L', 1, 0, 8, 12, 30, 'ACTIVE', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8500-000000000004', '00000000-0000-4000-8400-000000000003', 'SYN-SPICE-001-250G', '250 g', 'g', 250, 0, 12, 18, 40, 'ACTIVE', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8500-000000000005', '00000000-0000-4000-8400-000000000004', 'SYN-HONEY-001-500G', '500 g', 'g', 500, 0, 6, 10, 24, 'ACTIVE', '2026-06-01T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO product_prices (
  id, variant_id, type, currency, amount_minor, compare_at_amount_minor,
  cost_amount_minor, valid_from, created_at
)
VALUES
  ('00000000-0000-4000-8510-000000000001', '00000000-0000-4000-8500-000000000001', 'REGULAR', 'BDT', 18000, 20000, 11500, '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z'),
  ('00000000-0000-4000-8510-000000000002', '00000000-0000-4000-8500-000000000002', 'REGULAR', 'BDT', 84000, NULL, 56000, '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z'),
  ('00000000-0000-4000-8510-000000000003', '00000000-0000-4000-8500-000000000003', 'REGULAR', 'BDT', 26000, 29000, 17000, '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z'),
  ('00000000-0000-4000-8510-000000000004', '00000000-0000-4000-8500-000000000004', 'REGULAR', 'BDT', 9500, 11000, 6500, '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z'),
  ('00000000-0000-4000-8510-000000000005', '00000000-0000-4000-8500-000000000005', 'REGULAR', 'BDT', 48000, NULL, 32000, '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Batch-aware warehouse inventory. Trace tokens are stored only as SHA-256 fixtures.
INSERT INTO warehouses (id, source_location_id, code, name, status)
VALUES
  ('00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8340-000000000004', 'SYN-DHK-01', '[SYNTHETIC] Dhaka Fulfilment', 'ACTIVE')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_batches (
  id, variant_id, supplier_id, producer_id, processor_id, facility_id,
  source_location_id, batch_code, public_trace_token_hash, status,
  origin_verification_status, processing_verification_status, production_date,
  packaged_date, best_before_date, received_at, released_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8610-000000000001', '00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8310-000000000001', '00000000-0000-4000-8330-000000000001', '00000000-0000-4000-8350-000000000001', '00000000-0000-4000-8340-000000000002', 'SYN-BATCH-RICE-001', repeat('1', 64), 'RELEASED', 'PENDING', 'PENDING', '2026-08-02', '2026-08-04', '2027-02-04', '2026-08-05T08:00:00Z', '2026-08-05T12:00:00Z', '2026-08-05T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8610-000000000002', '00000000-0000-4000-8500-000000000003', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8310-000000000002', '00000000-0000-4000-8330-000000000001', '00000000-0000-4000-8350-000000000001', '00000000-0000-4000-8340-000000000001', 'SYN-BATCH-OIL-001', repeat('2', 64), 'RELEASED', 'PENDING', 'PENDING', '2026-08-03', '2026-08-04', '2027-02-04', '2026-08-05T08:00:00Z', '2026-08-05T12:00:00Z', '2026-08-05T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8610-000000000003', '00000000-0000-4000-8500-000000000004', '00000000-0000-4000-8320-000000000001', '00000000-0000-4000-8310-000000000003', '00000000-0000-4000-8330-000000000001', '00000000-0000-4000-8350-000000000001', '00000000-0000-4000-8340-000000000003', 'SYN-BATCH-SPICE-001', repeat('3', 64), 'RELEASED', 'PENDING', 'PENDING', '2026-08-05', '2026-08-06', '2027-02-06', '2026-08-07T08:00:00Z', '2026-08-07T12:00:00Z', '2026-08-07T08:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8610-000000000004', '00000000-0000-4000-8500-000000000005', '00000000-0000-4000-8320-000000000001', NULL, NULL, NULL, NULL, 'SYN-BATCH-HONEY-001', repeat('4', 64), 'QUARANTINED', 'PENDING', 'PENDING', NULL, NULL, NULL, '2026-08-05T08:00:00Z', '2026-08-06T08:00:00Z', '2026-08-05T08:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_levels (
  id, warehouse_id, batch_id, variant_id, quantity_on_hand, quantity_reserved,
  quantity_available, quantity_on_hold, quantity_damaged, updated_at
)
VALUES
  ('00000000-0000-4000-8620-000000000001', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000001', '00000000-0000-4000-8500-000000000001', 42, 4, 38, 0, 0, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8620-000000000002', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000002', '00000000-0000-4000-8500-000000000003', 11, 3, 8, 0, 0, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8620-000000000003', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000003', '00000000-0000-4000-8500-000000000004', 9, 1, 8, 0, 0, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8620-000000000004', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000004', '00000000-0000-4000-8500-000000000005', 19, 0, 0, 19, 0, '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_movements (
  id, variant_id, to_warehouse_id, to_batch_id, type, quantity, unit_cost_minor,
  reference_type, reference_id, reason, correlation_id, occurred_at
)
VALUES
  ('00000000-0000-4000-8630-000000000001', '00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000001', 'RECEIPT', 50, 11500, 'synthetic_seed', 'SYN-BATCH-RICE-001', 'Synthetic receipt', '00000000-0000-4000-8639-000000000001', '2026-08-05T08:00:00Z'),
  ('00000000-0000-4000-8630-000000000002', '00000000-0000-4000-8500-000000000003', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000002', 'RECEIPT', 15, 17000, 'synthetic_seed', 'SYN-BATCH-OIL-001', 'Synthetic receipt', '00000000-0000-4000-8639-000000000002', '2026-08-05T08:00:00Z'),
  ('00000000-0000-4000-8630-000000000003', '00000000-0000-4000-8500-000000000004', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000003', 'RECEIPT', 12, 6500, 'synthetic_seed', 'SYN-BATCH-SPICE-001', 'Synthetic receipt', '00000000-0000-4000-8639-000000000003', '2026-08-07T08:00:00Z'),
  ('00000000-0000-4000-8630-000000000004', '00000000-0000-4000-8500-000000000005', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000004', 'RECEIPT', 20, 32000, 'synthetic_seed', 'SYN-BATCH-HONEY-001', 'Synthetic receipt', '00000000-0000-4000-8639-000000000004', '2026-08-05T08:00:00Z'),
  ('00000000-0000-4000-8630-000000000005', '00000000-0000-4000-8500-000000000005', '00000000-0000-4000-8600-000000000001', '00000000-0000-4000-8610-000000000004', 'HOLD', 19, 32000, 'compliance', 'SYN-BATCH-HONEY-001', 'Synthetic claim/evidence quarantine', '00000000-0000-4000-8639-000000000005', '2026-08-11T09:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_holds (
  id, batch_id, warehouse_id, quantity, reason, status, created_by_id, created_at
)
VALUES
  ('00000000-0000-4000-8640-000000000001', '00000000-0000-4000-8610-000000000004', '00000000-0000-4000-8600-000000000001', 19, 'SYNTHETIC: unsupported honey claims and missing provenance evidence', 'ACTIVE', '00000000-0000-4000-8200-000000000001', '2026-08-11T09:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO trace_events (id, batch_id, event_type, public_visible, occurred_at, location_label, details, created_at)
VALUES
  ('00000000-0000-4000-8650-000000000001', '00000000-0000-4000-8610-000000000001', 'RECEIVED', false, '2026-08-05T08:00:00Z', '[SYNTHETIC] Dhaka', '{"synthetic":true,"verification":"PENDING"}'::jsonb, '2026-08-05T08:00:00Z'),
  ('00000000-0000-4000-8650-000000000002', '00000000-0000-4000-8610-000000000004', 'QUARANTINED', false, '2026-08-11T09:00:00Z', '[SYNTHETIC] Dhaka', '{"synthetic":true,"reason":"claims_and_evidence_review"}'::jsonb, '2026-08-11T09:00:00Z')
ON CONFLICT DO NOTHING;

-- Synthetic carts, orders and fulfilment provide coherent analytics fixtures.
INSERT INTO carts (
  id, user_id, status, currency, subtotal_minor, discount_minor, delivery_minor,
  tax_minor, total_minor, last_activity_at, checkout_started_at, abandoned_at,
  created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8700-000000000001', '00000000-0000-4000-8200-000000000004', 'ABANDONED', 'BDT', 44000, 0, 7000, 0, 51000, '2026-08-10T12:12:00Z', '2026-08-10T12:10:00Z', '2026-08-10T13:00:00Z', '2026-08-10T12:00:00Z', '2026-08-10T13:00:00Z'),
  ('00000000-0000-4000-8700-000000000002', '00000000-0000-4000-8200-000000000002', 'CONVERTED', 'BDT', 62000, 0, 0, 0, 62000, '2026-08-09T10:00:00Z', '2026-08-09T09:55:00Z', NULL, '2026-08-09T09:40:00Z', '2026-08-09T10:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO cart_items (id, cart_id, variant_id, quantity, unit_price_minor, unit_cost_minor, discount_minor, added_at, updated_at)
VALUES
  ('00000000-0000-4000-8710-000000000001', '00000000-0000-4000-8700-000000000001', '00000000-0000-4000-8500-000000000001', 1, 18000, 11500, 0, '2026-08-10T12:00:00Z', '2026-08-10T12:00:00Z'),
  ('00000000-0000-4000-8710-000000000002', '00000000-0000-4000-8700-000000000001', '00000000-0000-4000-8500-000000000003', 1, 26000, 17000, 0, '2026-08-10T12:02:00Z', '2026-08-10T12:02:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO orders (
  id, order_number, user_id, source_cart_id, status, fulfillment_status, currency,
  subtotal_minor, discount_minor, delivery_minor, tax_minor, total_minor,
  cost_of_goods_minor, gross_profit_minor, customer_email_snapshot,
  customer_phone_snapshot, delivery_address_snapshot, placed_at, confirmed_at,
  completed_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8720-000000000001', 'SYN-ORD-1048', '00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8700-000000000002', 'FULFILLED', 'DELIVERED', 'BDT', 62000, 0, 0, 0, 62000, 40000, 22000, 'synthetic.customer.a@example.invalid', '+8801700000001', '{"synthetic":true,"city":"Dhaka","district":"Dhaka","countryCode":"BD"}'::jsonb, '2026-08-09T10:00:00Z', '2026-08-09T10:05:00Z', '2026-08-11T15:00:00Z', '2026-08-09T10:00:00Z', '2026-08-11T15:00:00Z'),
  ('00000000-0000-4000-8720-000000000002', 'SYN-ORD-1012', '00000000-0000-4000-8200-000000000002', NULL, 'FULFILLED', 'DELIVERED', 'BDT', 37000, 0, 7000, 0, 44000, 24500, 12500, 'synthetic.customer.a@example.invalid', '+8801700000001', '{"synthetic":true,"city":"Dhaka","district":"Dhaka","countryCode":"BD"}'::jsonb, '2026-07-29T09:00:00Z', '2026-07-29T09:05:00Z', '2026-07-31T14:00:00Z', '2026-07-29T09:00:00Z', '2026-07-31T14:00:00Z'),
  ('00000000-0000-4000-8720-000000000003', 'SYN-ORD-1055', '00000000-0000-4000-8200-000000000003', NULL, 'FULFILLED', 'DELIVERED', 'BDT', 48000, 4800, 0, 0, 43200, 32000, 11200, 'synthetic.customer.b@example.invalid', '+8801700000002', '{"synthetic":true,"city":"Khulna","district":"Khulna","countryCode":"BD"}'::jsonb, '2026-08-10T11:00:00Z', '2026-08-10T11:05:00Z', '2026-08-12T10:00:00Z', '2026-08-10T11:00:00Z', '2026-08-12T10:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (
  id, order_id, variant_id, sku_snapshot, name_bn_snapshot, name_en_snapshot,
  quantity, unit_price_minor, unit_cost_minor, discount_minor, tax_minor,
  line_total_minor, returned_quantity, refunded_minor
)
VALUES
  ('00000000-0000-4000-8730-000000000001', '00000000-0000-4000-8720-000000000001', '00000000-0000-4000-8500-000000000001', 'SYN-RICE-001-1K', 'কালিজিরা চাল — কৃত্রিম', '[SYNTHETIC] Kalijira Rice', 2, 18000, 11500, 0, 0, 36000, 0, 0),
  ('00000000-0000-4000-8730-000000000002', '00000000-0000-4000-8720-000000000001', '00000000-0000-4000-8500-000000000003', 'SYN-OIL-001-1L', 'সরিষার তেল — কৃত্রিম', '[SYNTHETIC] Mustard Oil', 1, 26000, 17000, 0, 0, 26000, 0, 0),
  ('00000000-0000-4000-8730-000000000003', '00000000-0000-4000-8720-000000000002', '00000000-0000-4000-8500-000000000001', 'SYN-RICE-001-1K', 'কালিজিরা চাল — কৃত্রিম', '[SYNTHETIC] Kalijira Rice', 1, 18000, 11500, 0, 0, 18000, 0, 0),
  ('00000000-0000-4000-8730-000000000004', '00000000-0000-4000-8720-000000000002', '00000000-0000-4000-8500-000000000004', 'SYN-SPICE-001-250G', 'হলুদ গুঁড়া — কৃত্রিম', '[SYNTHETIC] Turmeric Powder', 2, 9500, 6500, 0, 0, 19000, 1, 9500),
  ('00000000-0000-4000-8730-000000000005', '00000000-0000-4000-8720-000000000003', '00000000-0000-4000-8500-000000000005', 'SYN-HONEY-001-500G', 'মধু — কৃত্রিম', '[SYNTHETIC] Honey', 1, 48000, 32000, 4800, 0, 43200, 0, 0)
ON CONFLICT DO NOTHING;

INSERT INTO order_batch_allocations (order_item_id, batch_id, quantity)
VALUES
  ('00000000-0000-4000-8730-000000000001', '00000000-0000-4000-8610-000000000001', 2),
  ('00000000-0000-4000-8730-000000000002', '00000000-0000-4000-8610-000000000002', 1),
  ('00000000-0000-4000-8730-000000000003', '00000000-0000-4000-8610-000000000001', 1),
  ('00000000-0000-4000-8730-000000000004', '00000000-0000-4000-8610-000000000003', 2),
  ('00000000-0000-4000-8730-000000000005', '00000000-0000-4000-8610-000000000004', 1)
ON CONFLICT DO NOTHING;

INSERT INTO payments (
  id, order_id, provider, status, currency, amount_minor, provider_reference,
  provider_payment_method, idempotency_key, captured_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8740-000000000001', '00000000-0000-4000-8720-000000000001', 'COD', 'CAPTURED', 'BDT', 62000, 'SYN-PAY-1048', 'cash_on_delivery', 'synthetic-payment-1048', '2026-08-11T15:00:00Z', '2026-08-09T10:00:00Z', '2026-08-11T15:00:00Z'),
  ('00000000-0000-4000-8740-000000000002', '00000000-0000-4000-8720-000000000002', 'COD', 'PARTIALLY_REFUNDED', 'BDT', 44000, 'SYN-PAY-1012', 'cash_on_delivery', 'synthetic-payment-1012', '2026-07-31T14:00:00Z', '2026-07-29T09:00:00Z', '2026-08-10T15:00:00Z'),
  ('00000000-0000-4000-8740-000000000003', '00000000-0000-4000-8720-000000000003', 'COD', 'CAPTURED', 'BDT', 43200, 'SYN-PAY-1055', 'cash_on_delivery', 'synthetic-payment-1055', '2026-08-12T10:00:00Z', '2026-08-10T11:00:00Z', '2026-08-12T10:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO shipments (
  id, order_id, shipment_number, provider, provider_reference, tracking_number,
  status, delivery_fee_minor, shipped_at, delivered_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8750-000000000001', '00000000-0000-4000-8720-000000000001', 'SYN-SHIP-1048', 'synthetic_courier', 'SYN-COURIER-1048', 'SYN-TRACK-1048', 'DELIVERED', 0, '2026-08-10T08:00:00Z', '2026-08-11T15:00:00Z', '2026-08-09T10:05:00Z', '2026-08-11T15:00:00Z'),
  ('00000000-0000-4000-8750-000000000002', '00000000-0000-4000-8720-000000000002', 'SYN-SHIP-1012', 'synthetic_courier', 'SYN-COURIER-1012', 'SYN-TRACK-1012', 'DELIVERED', 7000, '2026-07-30T08:00:00Z', '2026-07-31T14:00:00Z', '2026-07-29T09:05:00Z', '2026-07-31T14:00:00Z'),
  ('00000000-0000-4000-8750-000000000003', '00000000-0000-4000-8720-000000000003', 'SYN-SHIP-1055', 'synthetic_courier', 'SYN-COURIER-1055', 'SYN-TRACK-1055', 'DELIVERED', 0, '2026-08-11T08:00:00Z', '2026-08-12T10:00:00Z', '2026-08-10T11:05:00Z', '2026-08-12T10:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO return_requests (
  id, order_id, return_number, status, reason_code, customer_notes,
  resolution_notes, requested_at, resolved_at
)
VALUES
  ('00000000-0000-4000-8760-000000000001', '00000000-0000-4000-8720-000000000002', 'SYN-RET-1012', 'RESOLVED', 'DAMAGED_PACKAGE', 'Synthetic damaged-package fixture.', 'Synthetic partial refund approved after review.', '2026-08-09T16:00:00Z', '2026-08-10T15:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO return_items (
  id, return_request_id, order_item_id, batch_id, quantity, disposition,
  condition_notes
)
VALUES
  ('00000000-0000-4000-8761-000000000001', '00000000-0000-4000-8760-000000000001', '00000000-0000-4000-8730-000000000004', '00000000-0000-4000-8610-000000000003', 1, 'DISPOSED', 'Synthetic food-safe disposal; not returned to sellable stock.')
ON CONFLICT DO NOTHING;

INSERT INTO refunds (
  id, order_id, payment_id, return_request_id, status, amount_minor, currency,
  reason, provider_reference, requested_at, completed_at
)
VALUES
  ('00000000-0000-4000-8762-000000000001', '00000000-0000-4000-8720-000000000002', '00000000-0000-4000-8740-000000000002', '00000000-0000-4000-8760-000000000001', 'SUCCEEDED', 9500, 'BDT', 'Synthetic damaged-package partial refund', 'SYN-REFUND-1012', '2026-08-10T14:45:00Z', '2026-08-10T15:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO refund_items (refund_id, order_item_id, amount_minor, quantity)
VALUES
  ('00000000-0000-4000-8762-000000000001', '00000000-0000-4000-8730-000000000004', 9500, 1)
ON CONFLICT DO NOTHING;

INSERT INTO complaints (
  id, order_id, order_item_id, batch_id, category, severity, description,
  status, created_at, resolved_at
)
VALUES
  ('00000000-0000-4000-8763-000000000001', '00000000-0000-4000-8720-000000000002', '00000000-0000-4000-8730-000000000004', '00000000-0000-4000-8610-000000000003', 'DAMAGED_PACKAGE', 'WARNING', 'Synthetic complaint fixture; not a real customer report.', 'RESOLVED', '2026-08-09T16:00:00Z', '2026-08-10T15:00:00Z')
ON CONFLICT DO NOTHING;

-- Past synthetic promotion prevents an accidentally live coupon.
INSERT INTO promotions (
  id, code, name, description, type, status, percentage, starts_at, ends_at,
  created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8800-000000000001', 'SYN-DESHI10', '[SYNTHETIC] DESHI10 experiment', 'Synthetic historical discount fixture', 'PERCENTAGE', 'ENDED', 0.10, '2026-08-01T00:00:00Z', '2026-08-11T23:59:59Z', '2026-07-20T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO coupons (id, promotion_id, code, status, usage_limit_total, usage_limit_per_customer, starts_at, ends_at, created_at)
VALUES
  ('00000000-0000-4000-8810-000000000001', '00000000-0000-4000-8800-000000000001', 'SYNTHETIC-DESHI10', 'EXPIRED', 100, 1, '2026-08-01T00:00:00Z', '2026-08-11T23:59:59Z', '2026-07-20T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO coupon_redemptions (id, coupon_id, order_id, user_id, discount_applied_minor, redeemed_at)
VALUES
  ('00000000-0000-4000-8820-000000000001', '00000000-0000-4000-8810-000000000001', '00000000-0000-4000-8720-000000000003', '00000000-0000-4000-8200-000000000003', 4800, '2026-08-10T11:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO order_discounts (id, order_id, promotion_id, coupon_code, target, amount_minor)
VALUES
  ('00000000-0000-4000-8830-000000000001', '00000000-0000-4000-8720-000000000003', '00000000-0000-4000-8800-000000000001', 'SYNTHETIC-DESHI10', 'ORDER', 4800)
ON CONFLICT DO NOTHING;

INSERT INTO bundles (id, code, name_bn, name_en, status, fixed_price_minor, starts_at, ends_at, created_at)
VALUES
  ('00000000-0000-4000-8840-000000000001', 'SYN-PANTRY-TRIO', 'কৃত্রিম প্যান্ট্রি কম্বো', '[SYNTHETIC] Pantry Trio', 'DRAFT', 48500, '2026-08-01T00:00:00Z', '2026-08-31T23:59:59Z', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO bundle_items (bundle_id, product_id, variant_id, quantity, sort_order)
VALUES
  ('00000000-0000-4000-8840-000000000001', '00000000-0000-4000-8400-000000000001', '00000000-0000-4000-8500-000000000001', 1, 1),
  ('00000000-0000-4000-8840-000000000001', '00000000-0000-4000-8400-000000000002', '00000000-0000-4000-8500-000000000003', 1, 2),
  ('00000000-0000-4000-8840-000000000001', '00000000-0000-4000-8400-000000000003', '00000000-0000-4000-8500-000000000004', 1, 3)
ON CONFLICT DO NOTHING;

-- Marketing, attribution, messaging and abandoned-cart recovery.
INSERT INTO campaigns (
  id, code, name, channel, status, objective, utm_source, utm_medium,
  utm_campaign, planned_budget_minor, starts_at, ends_at, created_at, updated_at
)
VALUES
  ('00000000-0000-4000-8900-000000000001', 'SYN-FB-HERITAGE-01', '[SYNTHETIC] Heritage awareness', 'FACEBOOK', 'ARCHIVED', 'Synthetic acquisition test', 'facebook', 'paid_social', 'synthetic_heritage_01', 1000000, '2026-08-01T00:00:00Z', '2026-08-11T23:59:59Z', '2026-07-25T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8900-000000000002', 'SYN-EMAIL-CART-01', '[SYNTHETIC] Cart recovery', 'EMAIL', 'ARCHIVED', 'Synthetic cart recovery test', 'email', 'owned', 'synthetic_cart_recovery', 50000, '2026-08-01T00:00:00Z', '2026-08-11T23:59:59Z', '2026-07-25T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO campaign_spend (id, campaign_id, date, spend_minor, impressions, clicks, source_ref)
VALUES
  ('00000000-0000-4000-8910-000000000001', '00000000-0000-4000-8900-000000000001', '2026-08-09', 125000, 18000, 630, 'synthetic-import-20260809'),
  ('00000000-0000-4000-8910-000000000002', '00000000-0000-4000-8900-000000000001', '2026-08-10', 140000, 19500, 690, 'synthetic-import-20260810'),
  ('00000000-0000-4000-8910-000000000003', '00000000-0000-4000-8900-000000000002', '2026-08-10', 5000, 120, 18, 'synthetic-email-20260810')
ON CONFLICT DO NOTHING;

INSERT INTO marketing_consents (id, user_id, channel, status, source, policy_version, captured_at, withdrawn_at)
VALUES
  ('00000000-0000-4000-8920-000000000001', '00000000-0000-4000-8200-000000000002', 'EMAIL', 'OPTED_IN', 'synthetic_checkout', 'synthetic-v1', '2026-07-29T09:00:00Z', NULL),
  ('00000000-0000-4000-8920-000000000002', '00000000-0000-4000-8200-000000000003', 'SMS', 'OPTED_OUT', 'synthetic_account', 'synthetic-v1', '2026-08-10T11:00:00Z', '2026-08-10T11:01:00Z'),
  ('00000000-0000-4000-8920-000000000003', '00000000-0000-4000-8200-000000000004', 'EMAIL', 'OPTED_IN', 'synthetic_checkout', 'synthetic-v1', '2026-08-10T12:10:00Z', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO analytics_sessions (
  id, user_id, anonymous_id_hash, started_at, ended_at, landing_path,
  device_type, browser_family, district, consent_analytics
)
VALUES
  ('00000000-0000-4000-8930-000000000001', '00000000-0000-4000-8200-000000000002', repeat('a', 64), '2026-08-09T09:35:00Z', '2026-08-09T10:02:00Z', '/collections/heritage', 'mobile', 'Chrome', 'Dhaka', true),
  ('00000000-0000-4000-8930-000000000002', '00000000-0000-4000-8200-000000000003', repeat('b', 64), '2026-08-10T10:45:00Z', '2026-08-10T11:02:00Z', '/products/synthetic-honey', 'mobile', 'Chrome', 'Khulna', true),
  ('00000000-0000-4000-8930-000000000003', '00000000-0000-4000-8200-000000000004', repeat('c', 64), '2026-08-10T11:58:00Z', '2026-08-10T12:12:00Z', '/products/synthetic-mustard-oil', 'desktop', 'Firefox', 'Dhaka', true)
ON CONFLICT DO NOTHING;

INSERT INTO marketing_touchpoints (
  id, user_id, analytics_session_id, campaign_id, order_id, channel, source,
  medium, campaign_name, landing_path, occurred_at
)
VALUES
  ('00000000-0000-4000-8940-000000000001', '00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8930-000000000001', '00000000-0000-4000-8900-000000000001', '00000000-0000-4000-8720-000000000001', 'FACEBOOK', 'facebook', 'paid_social', 'synthetic_heritage_01', '/collections/heritage', '2026-08-09T09:35:00Z'),
  ('00000000-0000-4000-8940-000000000002', '00000000-0000-4000-8200-000000000003', '00000000-0000-4000-8930-000000000002', NULL, '00000000-0000-4000-8720-000000000003', 'ORGANIC_SEARCH', 'google', 'organic', NULL, '/products/synthetic-honey', '2026-08-10T10:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO attribution_credits (
  id, order_id, campaign_id, touchpoint_id, model, model_version, credit_fraction,
  revenue_minor, gross_profit_minor, calculated_at
)
VALUES
  ('00000000-0000-4000-8950-000000000001', '00000000-0000-4000-8720-000000000001', '00000000-0000-4000-8900-000000000001', '00000000-0000-4000-8940-000000000001', 'LAST_TOUCH', 'synthetic-v1', 1.0, 62000, 22000, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8950-000000000002', '00000000-0000-4000-8720-000000000003', NULL, '00000000-0000-4000-8940-000000000002', 'LAST_TOUCH', 'synthetic-v1', 1.0, 43200, 11200, '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO message_deliveries (
  id, user_id, campaign_id, channel, template_key, recipient_hash,
  provider_message_id, status, sent_at, delivered_at, opened_at, clicked_at,
  created_at
)
VALUES
  ('00000000-0000-4000-8960-000000000001', '00000000-0000-4000-8200-000000000004', '00000000-0000-4000-8900-000000000002', 'EMAIL', 'synthetic_cart_recovery_1', repeat('d', 64), 'SYN-MSG-0001', 'CLICKED', '2026-08-10T14:00:00Z', '2026-08-10T14:00:03Z', '2026-08-10T14:20:00Z', '2026-08-10T14:23:00Z', '2026-08-10T13:55:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO audience_segments (id, key, name, description, definition, definition_version, active, created_at, updated_at)
VALUES
  ('00000000-0000-4000-8970-000000000001', 'synthetic-cart-abandoners-24h', '[SYNTHETIC] Cart abandoners 24h', 'Consent-aware synthetic segment', '{"synthetic":true,"cartStatus":"ABANDONED","hours":24}'::jsonb, 'synthetic-v1', true, '2026-08-10T13:00:00Z', '2026-08-10T13:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO audience_memberships (segment_id, user_id, score, entered_at, expires_at)
VALUES
  ('00000000-0000-4000-8970-000000000001', '00000000-0000-4000-8200-000000000004', 0.91, '2026-08-10T13:00:00Z', '2026-08-12T13:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO retargeting_lists (id, segment_id, name, channel, status, generated_at, expires_at)
VALUES
  ('00000000-0000-4000-8980-000000000001', '00000000-0000-4000-8970-000000000001', '[SYNTHETIC] Consent-safe email recovery', 'EMAIL', 'DRAFT', '2026-08-10T13:05:00Z', '2026-08-12T13:05:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO retargeting_list_members (list_id, user_id, consent_status, eligible_at)
VALUES
  ('00000000-0000-4000-8980-000000000001', '00000000-0000-4000-8200-000000000004', 'OPTED_IN', '2026-08-10T13:05:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO recovery_attempts (
  id, cart_id, user_id, campaign_id, message_delivery_id, channel,
  attempt_number, sent_at
)
VALUES
  ('00000000-0000-4000-8990-000000000001', '00000000-0000-4000-8700-000000000001', '00000000-0000-4000-8200-000000000004', '00000000-0000-4000-8900-000000000002', '00000000-0000-4000-8960-000000000001', 'EMAIL', 1, '2026-08-10T14:00:00Z')
ON CONFLICT DO NOTHING;

-- Privacy-aware event fixtures: no raw IP, search PII, OTP, PIN, or card data.
INSERT INTO analytics_events (
  id, session_id, user_id, product_id, variant_id, order_id, campaign_id,
  event_name, event_version, occurred_at, properties, idempotency_key
)
VALUES
  ('00000000-0000-4000-8a00-000000000001', '00000000-0000-4000-8930-000000000001', '00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8400-000000000001', '00000000-0000-4000-8500-000000000001', NULL, '00000000-0000-4000-8900-000000000001', 'product_viewed', 1, '2026-08-09T09:40:00Z', '{"synthetic":true,"surface":"pdp"}'::jsonb, 'syn-event-0001'),
  ('00000000-0000-4000-8a00-000000000002', '00000000-0000-4000-8930-000000000001', '00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8400-000000000001', '00000000-0000-4000-8500-000000000001', NULL, '00000000-0000-4000-8900-000000000001', 'added_to_cart', 1, '2026-08-09T09:45:00Z', '{"synthetic":true,"quantity":2}'::jsonb, 'syn-event-0002'),
  ('00000000-0000-4000-8a00-000000000003', '00000000-0000-4000-8930-000000000001', '00000000-0000-4000-8200-000000000002', NULL, NULL, '00000000-0000-4000-8720-000000000001', '00000000-0000-4000-8900-000000000001', 'purchase_completed', 1, '2026-08-09T10:00:00Z', '{"synthetic":true,"totalMinor":62000,"currency":"BDT"}'::jsonb, 'syn-event-0003'),
  ('00000000-0000-4000-8a00-000000000004', '00000000-0000-4000-8930-000000000003', '00000000-0000-4000-8200-000000000004', '00000000-0000-4000-8400-000000000002', '00000000-0000-4000-8500-000000000003', NULL, NULL, 'checkout_abandoned', 1, '2026-08-10T13:00:00Z', '{"synthetic":true,"step":"payment"}'::jsonb, 'syn-event-0004'),
  ('00000000-0000-4000-8a00-000000000005', '00000000-0000-4000-8930-000000000002', '00000000-0000-4000-8200-000000000003', '00000000-0000-4000-8400-000000000004', NULL, NULL, NULL, 'trace_viewed', 1, '2026-08-10T10:50:00Z', '{"synthetic":true,"verification":"PENDING"}'::jsonb, 'syn-event-0005')
ON CONFLICT DO NOTHING;

-- Curated metric tables drive the requested dashboards. Every row is synthetic.
INSERT INTO daily_product_metrics (
  id, product_id, date, views, add_to_carts, units_ordered, units_returned,
  net_revenue_minor, cost_of_goods_minor, gross_profit_minor, discount_minor,
  refund_minor, average_inventory_qty, inventory_turnover, return_rate,
  refund_rate, trace_scans, trace_conversions, low_stock_minutes,
  calculation_version, calculated_at
)
VALUES
  ('00000000-0000-4000-8b00-000000000001', '00000000-0000-4000-8400-000000000001', '2026-08-09', 320, 46, 2, 0, 36000, 23000, 13000, 0, 0, 44, 0.045455, 0, 0, 38, 4, 0, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b00-000000000002', '00000000-0000-4000-8400-000000000002', '2026-08-09', 290, 41, 1, 0, 26000, 17000, 9000, 0, 0, 12, 0.083333, 0, 0, 44, 5, 180, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b00-000000000003', '00000000-0000-4000-8400-000000000003', '2026-08-10', 160, 23, 2, 1, 9500, 13000, -3500, 0, 9500, 10, 0.200000, 0.500000, 0.500000, 17, 2, 240, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b00-000000000004', '00000000-0000-4000-8400-000000000004', '2026-08-10', 210, 29, 1, 0, 43200, 32000, 11200, 4800, 0, 19, 0.052632, 0, 0, 86, 7, 1440, 'synthetic-v1', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO daily_business_metrics (
  id, date, period, currency, gross_revenue_minor, net_revenue_minor,
  cost_of_goods_minor, gross_profit_minor, operating_cost_minor,
  net_profit_minor, orders, customers, new_customers, repeat_customers,
  average_order_value_minor, acquisition_cost_minor,
  estimated_lifetime_value_minor, repeat_purchase_rate,
  funnel_conversion_rate, calculation_version, calculated_at
)
VALUES
  ('00000000-0000-4000-8b10-000000000001', '2026-08-09', 'DAY', 'BDT', 62000, 62000, 40000, 22000, 8500, 13500, 1, 1, 0, 1, 62000, 125000, 165000, 1.0, 0.038, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b10-000000000002', '2026-08-10', 'DAY', 'BDT', 48000, 33700, 32000, 1700, 9000, -7300, 1, 1, 1, 0, 33700, 140000, 130000, 0.0, 0.032, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b10-000000000003', '2026-08-11', 'DAY', 'BDT', 0, 0, 0, 0, 7000, -7000, 0, 0, 0, 0, 0, 5000, 147500, 0.0, 0.0, 'synthetic-v1', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO daily_channel_metrics (
  id, campaign_id, date, channel, spend_minor, attributed_revenue_minor,
  attributed_gross_profit_minor, impressions, clicks, sessions, conversions,
  new_customers, roi, roas, calculation_version
)
VALUES
  ('00000000-0000-4000-8b20-000000000001', '00000000-0000-4000-8900-000000000001', '2026-08-09', 'FACEBOOK', 125000, 62000, 22000, 18000, 630, 410, 1, 0, -0.824, 0.496, 'synthetic-v1'),
  ('00000000-0000-4000-8b20-000000000002', '00000000-0000-4000-8900-000000000001', '2026-08-10', 'FACEBOOK', 140000, 0, 0, 19500, 690, 450, 0, 0, -1.0, 0.0, 'synthetic-v1'),
  ('00000000-0000-4000-8b20-000000000003', '00000000-0000-4000-8900-000000000002', '2026-08-10', 'EMAIL', 5000, 0, 0, 120, 18, 12, 0, 0, -1.0, 0.0, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO funnel_snapshots (
  id, date, segment_key, sessions, product_views, add_to_carts,
  checkout_starts, purchases, cart_abandons, checkout_abandons,
  conversion_rate, calculation_version
)
VALUES
  ('00000000-0000-4000-8b30-000000000001', '2026-08-09', 'all', 520, 410, 92, 36, 20, 56, 16, 0.038462, 'synthetic-v1'),
  ('00000000-0000-4000-8b30-000000000002', '2026-08-10', 'all', 610, 475, 108, 41, 19, 67, 22, 0.031148, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO search_term_daily_metrics (
  id, date, normalized_term_hash, safe_display_term, searches,
  zero_result_searches, result_clicks, purchases, revenue_minor,
  calculation_version
)
VALUES
  ('00000000-0000-4000-8b40-000000000001', '2026-08-10', repeat('e', 64), 'সরিষার তেল', 84, 0, 39, 4, 104000, 'synthetic-v1'),
  ('00000000-0000-4000-8b40-000000000002', '2026-08-10', repeat('f', 64), '[SYNTHETIC zero-result term]', 22, 22, 0, 0, 0, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO promotion_daily_metrics (
  id, promotion_id, date, eligible_orders, redeemed_orders, redemption_rate,
  discount_minor, incremental_revenue_minor, incremental_profit_minor,
  baseline_units, promoted_units, discount_depth, estimated_elasticity,
  calculation_version
)
VALUES
  ('00000000-0000-4000-8b50-000000000001', '00000000-0000-4000-8800-000000000001', '2026-08-10', 16, 1, 0.0625, 4800, 7200, 1800, 12, 13, 0.10, 0.833333, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO bundle_daily_metrics (
  id, bundle_id, date, views, add_to_carts, orders, units, revenue_minor,
  gross_profit_minor, attach_rate, calculation_version
)
VALUES
  ('00000000-0000-4000-8b60-000000000001', '00000000-0000-4000-8840-000000000001', '2026-08-10', 96, 14, 3, 3, 145500, 40500, 0.157895, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO customer_rfm_snapshots (
  id, user_id, snapshot_date, recency_days, frequency_orders,
  monetary_value_minor, recency_score, frequency_score, monetary_score,
  segment_key, predicted_clv_minor, churn_risk, calculation_version
)
VALUES
  ('00000000-0000-4000-8b70-000000000001', '00000000-0000-4000-8200-000000000002', '2026-08-12', 3, 2, 96500, 5, 4, 5, 'LOYAL', 165000, 0.12, 'synthetic-v1'),
  ('00000000-0000-4000-8b70-000000000002', '00000000-0000-4000-8200-000000000003', '2026-08-12', 2, 1, 43200, 5, 2, 3, 'NEW_CUSTOMER', 130000, 0.28, 'synthetic-v1'),
  ('00000000-0000-4000-8b70-000000000003', '00000000-0000-4000-8200-000000000004', '2026-08-12', 999, 0, 0, 1, 1, 1, 'PROSPECT', 70000, 0.65, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO cohorts (
  id, key, name, cohort_type, start_date, end_date, definition,
  calculation_version
)
VALUES
  ('00000000-0000-4000-8b80-000000000001', 'synthetic-2026-07-first-order', '[SYNTHETIC] July 2026 first order', 'FIRST_ORDER_MONTH', '2026-07-01', '2026-07-31', '{"synthetic":true,"firstOrderMonth":"2026-07"}'::jsonb, 'synthetic-v1')
ON CONFLICT DO NOTHING;

INSERT INTO cohort_members (cohort_id, user_id, joined_at)
VALUES
  ('00000000-0000-4000-8b80-000000000001', '00000000-0000-4000-8200-000000000002', '2026-07-29')
ON CONFLICT DO NOTHING;

INSERT INTO cohort_retention (
  id, cohort_id, period_number, period_unit, eligible_members,
  retained_members, retention_rate, revenue_minor, calculated_at
)
VALUES
  ('00000000-0000-4000-8b90-000000000001', '00000000-0000-4000-8b80-000000000001', 0, 'MONTH', 1, 1, 1.0, 44000, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8b90-000000000002', '00000000-0000-4000-8b80-000000000001', 1, 'MONTH', 1, 1, 1.0, 62000, '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO sales_forecasts (
  id, product_id, forecast_date, horizon, predicted_units,
  predicted_revenue_minor, lower_bound_units, upper_bound_units,
  model_name, model_version, inputs_as_of, generated_at
)
VALUES
  ('00000000-0000-4000-8ba0-000000000001', '00000000-0000-4000-8400-000000000002', '2026-08-13', 'WEEK', 24, 624000, 18, 31, 'synthetic-seasonal-naive', 'synthetic-v1', '2026-08-12T00:00:00Z', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8ba0-000000000002', '00000000-0000-4000-8400-000000000003', '2026-08-13', 'WEEK', 32, 304000, 23, 42, 'synthetic-seasonal-naive', 'synthetic-v1', '2026-08-12T00:00:00Z', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO recommendations (
  id, product_id, variant_id, type, status, priority, title, rationale,
  confidence, expected_impact_minor, recommended_quantity, evidence,
  model_name, model_version, generated_at, expires_at
)
VALUES
  ('00000000-0000-4000-8bb0-000000000001', '00000000-0000-4000-8400-000000000002', '00000000-0000-4000-8500-000000000003', 'RESTOCK', 'OPEN', 90, '[SYNTHETIC] Restock mustard oil fixture', 'Available quantity is at the synthetic reorder threshold; human review is required.', 0.81, 72000, 30, '{"synthetic":true,"available":8,"reorderPoint":12,"forecastUnits":24}'::jsonb, 'synthetic-rules-plus-forecast', 'synthetic-v1', '2026-08-12T00:00:00Z', '2026-08-19T00:00:00Z'),
  ('00000000-0000-4000-8bb0-000000000002', '00000000-0000-4000-8400-000000000004', '00000000-0000-4000-8500-000000000005', 'PROMOTE_PRODUCT', 'DISMISSED', 10, '[SYNTHETIC] Promotion blocked by compliance', 'Do not promote while provenance and claim review remain pending.', 0.99, NULL, NULL, '{"synthetic":true,"blockedBy":["origin_pending","prohibited_claim"]}'::jsonb, 'synthetic-compliance-guard', 'synthetic-v1', '2026-08-12T00:00:00Z', '2026-08-19T00:00:00Z')
ON CONFLICT DO NOTHING;

-- A/B testing results are synthetic and intentionally underpowered.
INSERT INTO experiments (
  id, key, name, hypothesis, status, assignment_unit, primary_metric,
  guardrail_metrics, audience_rules, starts_at, ends_at, created_at
)
VALUES
  ('00000000-0000-4000-8c00-000000000001', 'synthetic-pdp-story-layout', '[SYNTHETIC] PDP story layout', 'A provenance-first layout may improve add-to-cart rate.', 'COMPLETED', 'SESSION', 'add_to_cart_rate', ARRAY['refund_rate','page_speed_p75'], '{"synthetic":true}'::jsonb, '2026-08-01T00:00:00Z', '2026-08-11T23:59:59Z', '2026-07-25T00:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO experiment_variants (id, experiment_id, key, name, allocation, is_control, payload)
VALUES
  ('00000000-0000-4000-8c10-000000000001', '00000000-0000-4000-8c00-000000000001', 'control', 'Control', 0.5, true, '{"synthetic":true,"layout":"control"}'::jsonb),
  ('00000000-0000-4000-8c10-000000000002', '00000000-0000-4000-8c00-000000000001', 'provenance_first', 'Provenance first', 0.5, false, '{"synthetic":true,"layout":"provenance_first"}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO experiment_assignments (
  id, experiment_id, experiment_variant_id, user_id, assignment_unit_hash,
  assigned_at
)
VALUES
  ('00000000-0000-4000-8c20-000000000001', '00000000-0000-4000-8c00-000000000001', '00000000-0000-4000-8c10-000000000001', '00000000-0000-4000-8200-000000000002', repeat('6', 64), '2026-08-09T09:35:00Z'),
  ('00000000-0000-4000-8c20-000000000002', '00000000-0000-4000-8c00-000000000001', '00000000-0000-4000-8c10-000000000002', '00000000-0000-4000-8200-000000000003', repeat('7', 64), '2026-08-10T10:45:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO experiment_metric_results (
  id, experiment_id, variant_key, metric_key, sample_size, value,
  uplift_vs_control, confidence_interval_low, confidence_interval_high,
  p_value, statistically_significant, calculation_version, calculated_at
)
VALUES
  ('00000000-0000-4000-8c30-000000000001', '00000000-0000-4000-8c00-000000000001', 'control', 'add_to_cart_rate', 520, 0.17692308, 0, NULL, NULL, NULL, NULL, 'synthetic-v1', '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8c30-000000000002', '00000000-0000-4000-8c00-000000000001', 'provenance_first', 'add_to_cart_rate', 505, 0.19009901, 0.074475, -0.012, 0.161, 0.214, false, 'synthetic-v1', '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Operational safeguards and data-quality fixtures.
INSERT INTO webhook_events (
  id, provider, provider_event_id, event_type, status, payload_sha256,
  safe_payload, signature_verified_at, received_at, processed_at, attempts
)
VALUES
  ('00000000-0000-4000-8d00-000000000001', 'synthetic_payment', 'syn_evt_0001', 'payment.captured', 'PROCESSED', repeat('9', 64), '{"synthetic":true,"event":"payment.captured","amountMinor":62000}'::jsonb, '2026-08-11T15:00:01Z', '2026-08-11T15:00:00Z', '2026-08-11T15:00:02Z', 1)
ON CONFLICT DO NOTHING;

INSERT INTO idempotency_keys (
  id, scope, key, request_hash, response_status, response_body, resource_type,
  resource_id, locked_at, completed_at, expires_at
)
VALUES
  ('00000000-0000-4000-8d10-000000000001', 'checkout.place_order', 'synthetic-order-1048', repeat('8', 64), 201, '{"synthetic":true,"orderNumber":"SYN-ORD-1048"}'::jsonb, 'order', '00000000-0000-4000-8720-000000000001', '2026-08-09T10:00:00Z', '2026-08-09T10:00:01Z', '2026-08-10T10:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO audit_logs (
  id, actor_user_id, action, entity_type, entity_id, before, after, reason,
  correlation_id, occurred_at
)
VALUES
  ('00000000-0000-4000-8d20-000000000001', '00000000-0000-4000-8200-000000000001', 'HOLD', 'InventoryBatch', '00000000-0000-4000-8610-000000000004', '{"status":"RELEASED","synthetic":true}'::jsonb, '{"status":"QUARANTINED","synthetic":true}'::jsonb, 'Synthetic compliance guard', '00000000-0000-4000-8d29-000000000001', '2026-08-11T09:00:00Z')
ON CONFLICT DO NOTHING;

INSERT INTO data_quality_issues (
  id, rule_key, entity_type, entity_id, field_path, severity, status, message,
  evidence, detected_at
)
VALUES
  ('00000000-0000-4000-8d30-000000000001', 'synthetic_seed_marker', 'dataset', 'deshijaat-synthetic-seed', NULL, 'CRITICAL', 'OPEN', 'This database contains invented seed fixtures and must not be treated as production truth.', '{"synthetic":true,"productionUse":false}'::jsonb, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8d30-000000000002', 'origin_evidence_required', 'Product', '00000000-0000-4000-8400-000000000001', 'sources[0].status', 'ERROR', 'OPEN', 'Origin remains pending; do not publish a geographic claim.', '{"synthetic":true,"status":"PENDING"}'::jsonb, '2026-08-12T00:00:00Z'),
  ('00000000-0000-4000-8d30-000000000003', 'prohibited_claim_detected', 'ProductClaim', '00000000-0000-4000-8420-000000000002', 'claimTextEn', 'CRITICAL', 'ACKNOWLEDGED', 'Unsupported purity, organic, and therapeutic wording is blocked.', '{"synthetic":true,"claimStatus":"REJECTED"}'::jsonb, '2026-08-12T00:00:00Z')
ON CONFLICT DO NOTHING;

COMMIT;

-- End of synthetic non-production fixtures.
