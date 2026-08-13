-- Import the IP3 supplier catalogue as unpublished drafts and attach the
-- supplied public product photographs. Run only after Prisma migrations and
-- hardening.sql. This script is idempotent and never publishes a product,
-- creates a price, or asserts provenance/verification claims.

BEGIN;

CREATE TEMP TABLE ip3_catalog_import (
  product_code varchar(40) PRIMARY KEY,
  slug varchar(180) NOT NULL UNIQUE,
  name_bn varchar(200) NOT NULL,
  name_en varchar(200) NOT NULL,
  category_slug varchar(160) NOT NULL,
  category_bn varchar(180) NOT NULL,
  category_en varchar(180) NOT NULL,
  storage_key varchar(500) NOT NULL
) ON COMMIT DROP;

INSERT INTO ip3_catalog_import (
  product_code, slug, name_bn, name_en, category_slug, category_bn,
  category_en, storage_key
)
VALUES
  ('SOA-DRAFT-001', 'dheki-pounded-red-rice-ganjiya-1', 'ঢেঁকি ছাঁটা লাল চাল (গাঞ্জিয়া)', 'Dheki-Pounded Red Rice (Ganjiya)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/dheki-red-rice-ganjiya.jpg'),
  ('SOA-DRAFT-002', 'dheki-pounded-red-rice-aus-bri-2', 'ঢেঁকি ছাঁটা লাল চাল (আউস-ব্রি)', 'Dheki-Pounded Red Rice (Aus-BRI)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/dheki-red-rice-aus-bri.jpg'),
  ('SOA-DRAFT-003', 'dheki-pounded-brown-rice-katari-br28-3', 'ঢেঁকি ছাঁটা ব্রাউন চাল (কাটারী/২৮)', 'Dheki-Pounded Brown Rice (Katari/BR28)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/dheki-brown-rice-katari-br28.webp'),
  ('SOA-DRAFT-004', 'dheki-pounded-rice-flour-4', 'ঢেঁকি ছাঁটা চালের গুড়া', 'Dheki-Pounded Rice Flour', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/dheki-rice-flour.jpg'),
  ('SOA-DRAFT-005', 'dheki-pounded-barley-sattu-5', 'ঢেঁকি ছাঁটা যবের ছাতু', 'Dheki-Pounded Barley Sattu', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/dheki-barley-sattu.jpg'),
  ('SOA-DRAFT-006', 'soyaliks-mixed-sattu-6', 'সোয়ালিক্স (মিক্সড ছাতু)', 'Soyaliks Mixed Sattu', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/soyaliks-mixed-sattu.jpg'),
  ('SOA-DRAFT-007', 'black-rice-7', 'ব্ল্যাক রাইস', 'Black Rice', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/black-rice.png'),
  ('SOA-DRAFT-008', 'kaun-rice-foxtail-millet-8', 'কাউনের চাল', 'Kaun Rice (Foxtail Millet)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/kaun-rice.jpg'),
  ('SOA-DRAFT-009', 'wooden-ghani-mustard-oil-9', 'কাঠের ঘানির সরিষার তেল', 'Wooden-Ghani Mustard Oil', 'oil-ghee', 'তেল ও ঘি', 'Oil & ghee', '/media/products/wooden-ghani-mustard-oil.jpg'),
  ('SOA-DRAFT-010', 'red-whole-wheat-flour-10', 'লাল আটা', 'Red Whole-Wheat Flour', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/red-whole-wheat-flour.webp'),
  ('SOA-DRAFT-011', 'barley-flour-11', 'যবের আটা', 'Barley Flour', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/barley-flour.jpg'),
  ('SOA-DRAFT-012', 'red-sugar-12', 'লাল চিনি', 'Red Sugar', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/red-sugar.jpg'),
  ('SOA-DRAFT-013', 'red-flattened-rice-chira-13', 'লাল চিড়া', 'Red Flattened Rice (Chira)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/red-flattened-rice.jpg'),
  ('SOA-DRAFT-014', 'hand-roasted-puffed-rice-red-white-14', 'হাতে ভাজা মুড়ি (লাল/সাদা)', 'Hand-Roasted Puffed Rice (Red/White)', 'rice-grains', 'চাল ও শস্য', 'Rice & grains', '/media/products/hand-roasted-puffed-rice.jpg'),
  ('SOA-DRAFT-015', 'himalayan-pink-salt-15', 'হিমালয়ান পিংক সল্ট', 'Himalayan Pink Salt', 'spices', 'মসলা', 'Spices', '/media/products/himalayan-pink-salt.jpg'),
  ('SOA-DRAFT-016', 'ghee-16', 'ঘি', 'Ghee', 'oil-ghee', 'তেল ও ঘি', 'Oil & ghee', '/media/products/ghee.jpg'),
  ('SOA-DRAFT-017', 'mustard-flower-honey-17', 'মধু (সরিষা)', 'Mustard Flower Honey', 'honey-sweets', 'মধু ও মিষ্টি', 'Honey & sweets', '/media/products/mustard-flower-honey.jpg'),
  ('SOA-DRAFT-018', 'litchi-flower-honey-18', 'মধু (লিচু)', 'Litchi Flower Honey', 'honey-sweets', 'মধু ও মিষ্টি', 'Honey & sweets', '/media/products/litchi-flower-honey.jpg'),
  ('SOA-DRAFT-019', 'black-seed-flower-honey-19', 'মধু (কালোজিরা)', 'Black-Seed Flower Honey', 'honey-sweets', 'মধু ও মিষ্টি', 'Honey & sweets', '/media/products/black-seed-flower-honey.jpg'),
  ('SOA-DRAFT-020', 'sundarban-honey-20', 'মধু (সুন্দরবন)', 'Sundarban Honey', 'honey-sweets', 'মধু ও মিষ্টি', 'Honey & sweets', '/media/products/sundarban-honey.avif'),
  ('SOA-DRAFT-021', 'flaxseed-21', 'তিসি', 'Flaxseed', 'seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', '/media/products/flaxseed.jpg'),
  ('SOA-DRAFT-022', 'sesame-22', 'তিল', 'Sesame', 'seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', '/media/products/sesame.jpg'),
  ('SOA-DRAFT-023', 'black-seed-nigella-23', 'কালোজিরা', 'Black Seed (Nigella)', 'seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', '/media/products/black-seed.jpg'),
  ('SOA-DRAFT-024', 'chia-seed-24', 'চিয়া সীড', 'Chia Seed', 'seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', '/media/products/chia-seed.jpg'),
  ('SOA-DRAFT-025', 'moringa-powder-25', 'মরিঙ্গা পাউডার', 'Moringa Powder', 'seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', '/media/products/moringa-powder.jpg'),
  ('SOA-DRAFT-026', 'combo-pack-talbina-26', 'কম্বোপ্যাক: তালবিনা', 'Combo Pack: Talbina', 'combo-packs', 'কম্বো প্যাক', 'Combo packs', '/media/products/combo-pack-talbina.jpg'),
  ('SOA-DRAFT-027', 'mashkalai-black-gram-powder-27', 'মাসকালাইয়ের গুড়া', 'Mashkalai (Black Gram) Powder', 'flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', '/media/products/mashkalai-powder.jpg'),
  ('SOA-DRAFT-028', 'dheki-pounded-mixed-spice-powder-28', 'ঢেঁকি ছাঁটা মসলা গুড়া', 'Dheki-Pounded Mixed Spice Powder', 'spices', 'মসলা', 'Spices', '/media/products/dheki-mixed-spice-powder.jpg'),
  ('SOA-DRAFT-029', 'turmeric-powder-29', 'হলুদের গুড়া', 'Turmeric Powder', 'spices', 'মসলা', 'Spices', '/media/products/turmeric-powder.jpg'),
  ('SOA-DRAFT-030', 'chili-powder-30', 'মরিচের গুড়া', 'Chili Powder', 'spices', 'মসলা', 'Spices', '/media/products/chili-powder.jpg');

INSERT INTO categories (id, slug, name_bn, name_en, sort_order, status)
SELECT gen_random_uuid(), source.category_slug, source.category_bn,
       source.category_en, source.sort_order, 'DRAFT'
FROM (
  VALUES
    ('rice-grains', 'চাল ও শস্য', 'Rice & grains', 10),
    ('spices', 'মসলা', 'Spices', 20),
    ('oil-ghee', 'তেল ও ঘি', 'Oil & ghee', 30),
    ('honey-sweets', 'মধু ও মিষ্টি', 'Honey & sweets', 40),
    ('flour-sattu', 'ময়দা ও ছাতু', 'Flour & sattu', 50),
    ('seeds-powders', 'বীজ ও গুঁড়া', 'Seeds & powders', 60),
    ('combo-packs', 'কম্বো প্যাক', 'Combo packs', 70)
) AS source(category_slug, category_bn, category_en, sort_order)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  id, category_id, slug, product_code, name_bn, name_en,
  short_description_en, description_en, status, publish_approved,
  featured, subscription_eligible, created_at, updated_at
)
SELECT
  gen_random_uuid(), categories.id, source.slug, source.product_code,
  source.name_bn, source.name_en,
  'Supplier catalogue draft. Pending verification.',
  'Pack, price, source, processing, ingredients, label, and evidence remain pending verification.',
  'DRAFT', false, false, false, now(), now()
FROM ip3_catalog_import source
JOIN categories ON categories.slug = source.category_slug
ON CONFLICT (slug) DO UPDATE
SET category_id = EXCLUDED.category_id,
    product_code = EXCLUDED.product_code,
    name_bn = EXCLUDED.name_bn,
    name_en = EXCLUDED.name_en,
    short_description_en = EXCLUDED.short_description_en,
    description_en = EXCLUDED.description_en,
    updated_at = now()
WHERE products.status = 'DRAFT' AND products.publish_approved = false;

UPDATE product_media media
SET is_primary = false
FROM products product
JOIN ip3_catalog_import source ON source.slug = product.slug
WHERE media.product_id = product.id
  AND media.storage_key <> source.storage_key
  AND product.status = 'DRAFT'
  AND product.publish_approved = false;

UPDATE product_media media
SET alt_bn = source.name_bn,
    alt_en = source.name_en,
    sort_order = 0,
    is_primary = true
FROM products product
JOIN ip3_catalog_import source ON source.slug = product.slug
WHERE media.product_id = product.id
  AND media.storage_key = source.storage_key;

INSERT INTO product_media (
  id, product_id, type, storage_key, alt_bn, alt_en, sort_order, is_primary
)
SELECT
  gen_random_uuid(), product.id, 'IMAGE', source.storage_key,
  source.name_bn, source.name_en, 0, true
FROM ip3_catalog_import source
JOIN products product ON product.slug = source.slug
WHERE NOT EXISTS (
  SELECT 1 FROM product_media media
  WHERE media.product_id = product.id
    AND media.storage_key = source.storage_key
);

COMMIT;
