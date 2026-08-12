import { etag } from "./api-contract";
import { isDemoMode, requireDatabaseConfig } from "./runtime-mode";
import { withPrisma, type PrismaLike, type SqlRow } from "./prisma";

export type CatalogFilters = {
  q?: string;
  category?: string;
  region?: string;
  district?: string;
  producer?: string;
  processing?: string;
  packSize?: string;
  minPriceMinor?: string;
  maxPriceMinor?: string;
  originStatus?: string;
  inStock?: boolean;
  codAvailable?: boolean;
  rating?: string;
  sort?: "featured" | "popular" | "newest" | "price_asc" | "price_desc";
  limit?: number;
  after?: string;
};

export type PublicCatalogProduct = {
  id: string;
  slug: string;
  productCode: string;
  nameBn: string;
  nameEn: string;
  shortDescriptionBn: string | null;
  shortDescriptionEn: string | null;
  category: { slug: string; nameBn: string; nameEn: string };
  region: string | null;
  district: string | null;
  producer: string | null;
  verification: { origin: string; processing: string; claims: string };
  fromPrice: { amountMinor: string; currency: string } | null;
  available: boolean;
  availableQuantity: string;
  rating: number | null;
  reviewCount: number;
  featured: boolean;
  media: Array<{ url: string; altBn: string | null; altEn: string | null }>;
};

export type PublicProductDetail = PublicCatalogProduct & {
  descriptionBn: string | null;
  descriptionEn: string | null;
  storageInstructions: string | null;
  shelfLifeDays: number | null;
  ingredients: Array<{ name: string; isAllergen: boolean }>;
  variants: Array<{
    id: string;
    sku: string;
    barcode: string | null;
    label: string;
    unit: string;
    netQuantity: string;
    price: { amountMinor: string; compareAtAmountMinor: string | null; currency: string; validFrom: string; validUntil: string | null } | null;
    available: boolean;
    availableQuantity: string;
  }>;
  claims: Array<{ textBn: string | null; textEn: string | null; riskLevel: string }>;
  provenance: Array<{ location: string; division: string | null; district: string | null; status: string }>;
  reviews: { average: number | null; count: number };
  related: PublicCatalogProduct[];
  bundles: Array<{ id: string; code: string; nameBn: string; nameEn: string; fixedPriceMinor: string | null }>;
};

type CatalogRow = SqlRow & {
  id: string;
  slug: string;
  product_code: string;
  name_bn: string;
  name_en: string;
  short_description_bn: string | null;
  short_description_en: string | null;
  description_bn?: string | null;
  description_en?: string | null;
  storage_instructions?: string | null;
  shelf_life_days?: number | null;
  category_slug: string;
  category_name_bn: string;
  category_name_en: string;
  region: string | null;
  district: string | null;
  producer_name: string | null;
  origin_status: string;
  processing_status: string;
  claims_status: string;
  from_price_minor: string | bigint | number | null;
  from_currency: string | null;
  available_quantity: string | number | null;
  rating: string | number | null;
  review_count: string | number | null;
  featured: boolean;
  updated_at?: string | Date;
};

type VariantRow = SqlRow & {
  id: string;
  sku: string;
  barcode: string | null;
  label: string;
  unit: string;
  net_quantity: string | number;
  amount_minor: string | bigint | number | null;
  compare_at_amount_minor: string | bigint | number | null;
  currency: string | null;
  valid_from: string | Date | null;
  valid_until: string | Date | null;
  available_quantity: string | number | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asMinor(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return typeof value === "bigint" ? value.toString() : String(value);
}

function asIso(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return value instanceof Date ? value.toISOString() : new Date(String(value)).toISOString();
}

function escapeCursor(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeCursor(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return null;
  }
}

function publicMedia(rows: SqlRow[]): Array<{ url: string; altBn: string | null; altEn: string | null }> {
  return rows.map((row) => ({
    url: String(row.storage_key),
    altBn: asString(row.alt_bn),
    altEn: asString(row.alt_en),
  }));
}

function mapCatalogRow(row: CatalogRow, media: SqlRow[] = []): PublicCatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    productCode: row.product_code,
    nameBn: row.name_bn,
    nameEn: row.name_en,
    shortDescriptionBn: row.short_description_bn ?? null,
    shortDescriptionEn: row.short_description_en ?? null,
    category: { slug: row.category_slug, nameBn: row.category_name_bn, nameEn: row.category_name_en },
    region: row.region ?? null,
    district: row.district ?? null,
    producer: row.producer_name ?? null,
    verification: { origin: row.origin_status, processing: row.processing_status, claims: row.claims_status },
    fromPrice: row.from_price_minor == null ? null : { amountMinor: asMinor(row.from_price_minor) as string, currency: row.from_currency ?? "BDT" },
    available: (asNumber(row.available_quantity) ?? 0) > 0,
    availableQuantity: asString(row.available_quantity) ?? "0",
    rating: asNumber(row.rating),
    reviewCount: Math.max(0, Math.trunc(asNumber(row.review_count) ?? 0)),
    featured: Boolean(row.featured),
    media: publicMedia(media),
  };
}

const baseSelect = `
  SELECT p.id, p.slug, p.product_code, p.name_bn, p.name_en,
    p.short_description_bn, p.short_description_en, p.description_bn,
    p.description_en, p.storage_instructions, p.shelf_life_days, p.featured,
    p.status, p.publish_approved,
    c.slug AS category_slug, c.name_bn AS category_name_bn, c.name_en AS category_name_en,
    (SELECT string_agg(DISTINCT sl.division, ', ' ORDER BY sl.division)
      FROM product_sources ps JOIN source_locations sl ON sl.id = ps.source_location_id
      WHERE ps.product_id = p.id AND sl.division IS NOT NULL) AS region,
    (SELECT string_agg(DISTINCT sl.district, ', ' ORDER BY sl.district)
      FROM product_sources ps JOIN source_locations sl ON sl.id = ps.source_location_id
      WHERE ps.product_id = p.id AND sl.district IS NOT NULL) AS district,
    (SELECT COALESCE(pr.name, NULL) FROM producers pr WHERE pr.id = p.producer_id) AS producer_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM product_sources ps JOIN source_locations sl ON sl.id = ps.source_location_id
      JOIN evidence_documents ed ON ed.id = ps.evidence_document_id
      WHERE ps.product_id = p.id AND ps.status = 'VERIFIED' AND sl.verification_status = 'VERIFIED'
        AND ed.verification_status = 'VERIFIED' AND (ed.expires_at IS NULL OR ed.expires_at > now())
    ) THEN 'VERIFIED' ELSE 'PENDING' END AS origin_status,
    CASE WHEN EXISTS (
      SELECT 1 FROM inventory_batches ib JOIN product_variants pv2 ON pv2.id = ib.variant_id
      WHERE pv2.product_id = p.id AND ib.processing_verification_status = 'VERIFIED'
    ) THEN 'VERIFIED' ELSE 'PENDING' END AS processing_status,
    CASE WHEN EXISTS (SELECT 1 FROM product_claims pc WHERE pc.product_id = p.id AND pc.status = 'PENDING_REVIEW') THEN 'PENDING_REVIEW'
      WHEN EXISTS (SELECT 1 FROM product_claims pc JOIN claim_evidence ce ON ce.claim_id = pc.id JOIN evidence_documents ced ON ced.id = ce.evidence_document_id WHERE pc.product_id = p.id AND pc.status = 'APPROVED' AND ced.verification_status = 'VERIFIED' AND (ced.expires_at IS NULL OR ced.expires_at > now())) THEN 'APPROVED'
      WHEN EXISTS (SELECT 1 FROM product_claims pc WHERE pc.product_id = p.id AND pc.status NOT IN ('WITHDRAWN','REJECTED')) THEN 'PENDING_REVIEW'
      ELSE 'PENDING' END AS claims_status,
    (SELECT MIN(active_price.amount_minor) FROM (
      SELECT DISTINCT ON (pv.id) pp.amount_minor
      FROM product_variants pv JOIN product_prices pp ON pp.variant_id = pv.id
      WHERE pv.product_id = p.id AND pv.status = 'ACTIVE' AND pp.currency = 'BDT'
        AND pp.valid_from <= now() AND (pp.valid_until IS NULL OR pp.valid_until > now())
        AND pp.type IN ('SALE','REGULAR')
      ORDER BY pv.id, CASE WHEN pp.type = 'SALE' THEN 0 ELSE 1 END, pp.valid_from DESC
    ) active_price) AS from_price_minor,
    'BDT' AS from_currency,
    (SELECT COALESCE(SUM(il.quantity_available), 0)
      FROM inventory_levels il JOIN inventory_batches ib ON ib.id = il.batch_id
      JOIN product_variants pv3 ON pv3.id = il.variant_id
      WHERE pv3.product_id = p.id AND ib.status = 'RELEASED') AS available_quantity,
    (SELECT AVG(prv.rating)::numeric FROM product_reviews prv
      WHERE prv.product_id = p.id AND prv.moderation_status = 'PUBLISHED' AND prv.published_at IS NOT NULL) AS rating,
    (SELECT COUNT(*) FROM product_reviews prv2
      WHERE prv2.product_id = p.id AND prv2.moderation_status = 'PUBLISHED' AND prv2.published_at IS NOT NULL) AS review_count,
    p.updated_at
  FROM products p JOIN categories c ON c.id = p.category_id
`;

function addParam(values: unknown[], value: unknown): string {
  values.push(value);
  return `$${values.length}`;
}

function catalogWhere(filters: CatalogFilters, values: unknown[]): string {
  const clauses = ["p.status = 'ACTIVE'", "p.publish_approved = true", "c.status = 'ACTIVE'", `EXISTS (
    SELECT 1 FROM product_variants pv_gate JOIN product_prices pp_gate ON pp_gate.variant_id = pv_gate.id
    WHERE pv_gate.product_id = p.id AND pv_gate.status = 'ACTIVE' AND pp_gate.currency = 'BDT'
      AND pp_gate.valid_from <= now() AND (pp_gate.valid_until IS NULL OR pp_gate.valid_until > now())
      AND pp_gate.type IN ('SALE','REGULAR')
  )`];
  if (filters.q) {
    const term = `%${filters.q.trim()}%`;
    const param = addParam(values, term);
    clauses.push(`(p.name_bn ILIKE ${param} OR p.name_en ILIKE ${param} OR p.product_code ILIKE ${param}
      OR c.name_bn ILIKE ${param} OR c.name_en ILIKE ${param}
      OR EXISTS (SELECT 1 FROM product_variants qv WHERE qv.product_id = p.id AND qv.sku ILIKE ${param})
      OR EXISTS (SELECT 1 FROM product_sources qps JOIN source_locations qsl ON qsl.id = qps.source_location_id
        WHERE qps.product_id = p.id AND (qsl.name_bn ILIKE ${param} OR qsl.name_en ILIKE ${param} OR qsl.district ILIKE ${param} OR qsl.division ILIKE ${param}))
      OR EXISTS (SELECT 1 FROM inventory_batches qib JOIN product_variants qpv ON qpv.id = qib.variant_id
        WHERE qpv.product_id = p.id AND qib.batch_code ILIKE ${param}))`);
  }
  if (filters.category) {
    const param = addParam(values, filters.category);
    clauses.push(`(c.slug = ${param} OR c.name_bn = ${param} OR c.name_en = ${param})`);
  }
  if (filters.region) {
    const param = addParam(values, filters.region);
    clauses.push(`EXISTS (SELECT 1 FROM product_sources rps JOIN source_locations rsl ON rsl.id = rps.source_location_id
      WHERE rps.product_id = p.id AND (rsl.division = ${param} OR rsl.name_bn = ${param} OR rsl.name_en = ${param}))`);
  }
  if (filters.district) {
    const param = addParam(values, filters.district);
    clauses.push(`EXISTS (SELECT 1 FROM product_sources dps JOIN source_locations dsl ON dsl.id = dps.source_location_id
      WHERE dps.product_id = p.id AND (dsl.district = ${param} OR dsl.name_bn = ${param} OR dsl.name_en = ${param}))`);
  }
  if (filters.producer) {
    const param = addParam(values, filters.producer);
    clauses.push(`EXISTS (SELECT 1 FROM producers pr WHERE pr.id = p.producer_id AND (pr.code = ${param} OR pr.name ILIKE ${param}))`);
  }
  if (filters.processing) {
    const param = addParam(values, filters.processing);
    clauses.push(`EXISTS (SELECT 1 FROM inventory_batches pib JOIN product_variants piv ON piv.id = pib.variant_id
      WHERE piv.product_id = p.id AND pib.processing_verification_status = ${param})`);
  }
  if (filters.packSize) {
    const param = addParam(values, `%${filters.packSize}%`);
    clauses.push(`EXISTS (SELECT 1 FROM product_variants psv WHERE psv.product_id = p.id AND psv.status = 'ACTIVE' AND (psv.label ILIKE ${param} OR psv.net_quantity::text ILIKE ${param}))`);
  }
  if (filters.minPriceMinor) clauses.push(`(SELECT MIN(ppm.amount_minor) FROM product_variants pvm JOIN product_prices ppm ON ppm.variant_id = pvm.id WHERE pvm.product_id = p.id AND ppm.valid_from <= now() AND (ppm.valid_until IS NULL OR ppm.valid_until > now()) AND ppm.type IN ('SALE','REGULAR')) >= ${addParam(values, filters.minPriceMinor)}::bigint`);
  if (filters.maxPriceMinor) clauses.push(`(SELECT MIN(ppx.amount_minor) FROM product_variants pvx JOIN product_prices ppx ON ppx.variant_id = pvx.id WHERE pvx.product_id = p.id AND ppx.valid_from <= now() AND (ppx.valid_until IS NULL OR ppx.valid_until > now()) AND ppx.type IN ('SALE','REGULAR')) <= ${addParam(values, filters.maxPriceMinor)}::bigint`);
  if (filters.originStatus) {
    const param = addParam(values, filters.originStatus);
    clauses.push(`(CASE WHEN EXISTS (SELECT 1 FROM product_sources ops JOIN source_locations osl ON osl.id = ops.source_location_id JOIN evidence_documents oed ON oed.id = ops.evidence_document_id WHERE ops.product_id = p.id AND ops.status = 'VERIFIED' AND osl.verification_status = 'VERIFIED' AND oed.verification_status = 'VERIFIED' AND (oed.expires_at IS NULL OR oed.expires_at > now())) THEN 'VERIFIED' ELSE 'PENDING' END) = ${param}`);
  }
  if (filters.inStock === true) clauses.push(`(SELECT COALESCE(SUM(ili.quantity_available), 0) FROM inventory_levels ili JOIN inventory_batches ibi ON ibi.id = ili.batch_id JOIN product_variants pvi ON pvi.id = ili.variant_id WHERE pvi.product_id = p.id AND ibi.status = 'RELEASED') > 0`);
  if (filters.inStock === false) clauses.push(`(SELECT COALESCE(SUM(ilo.quantity_available), 0) FROM inventory_levels ilo JOIN inventory_batches ibo ON ibo.id = ilo.batch_id JOIN product_variants pvo ON pvo.id = ilo.variant_id WHERE pvo.product_id = p.id AND ibo.status = 'RELEASED') <= 0`);
  if (filters.rating) clauses.push(`COALESCE((SELECT AVG(prr.rating) FROM product_reviews prr WHERE prr.product_id = p.id AND prr.moderation_status = 'PUBLISHED'), 0) >= ${addParam(values, filters.rating)}::numeric`);
  // COD serviceability is resolved from the delivery address during checkout;
  // the catalog has no product-level COD field, so this filter is accepted but
  // intentionally does not manufacture availability.
  return `WHERE ${clauses.join(" AND ")}`;
}

function orderBy(sort: CatalogFilters["sort"]): string {
  switch (sort) {
    case "popular": return "ORDER BY review_count DESC NULLS LAST, p.updated_at DESC, p.id";
    case "newest": return "ORDER BY p.created_at DESC, p.id";
    case "price_asc": return "ORDER BY from_price_minor ASC NULLS LAST, p.id";
    case "price_desc": return "ORDER BY from_price_minor DESC NULLS LAST, p.id";
    default: return "ORDER BY p.featured DESC, review_count DESC NULLS LAST, p.updated_at DESC, p.id";
  }
}

async function listDb(filters: CatalogFilters): Promise<{ items: PublicCatalogProduct[]; nextCursor: string | null; hasMore: boolean }> {
  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 100);
  const values: unknown[] = [];
  const where = catalogWhere(filters, values);
  const cursor = decodeCursor(filters.after);
  if (cursor) {
    addParam(values, cursor);
    // Cursor pagination is stable on updated_at/id. The cursor is created from
    // those values and never includes a user-controlled SQL fragment.
    const [cursorDate, cursorId] = cursor.split("|");
    if (!cursorDate || !cursorId) throw new Error("Invalid catalog cursor");
    values.splice(values.length - 1, 1, cursorDate, cursorId);
    const dateParam = `$${values.length - 1}`;
    const idParam = `$${values.length}`;
    const cursorClause = ` AND (p.updated_at < ${dateParam}::timestamptz OR (p.updated_at = ${dateParam}::timestamptz AND p.id < ${idParam}::uuid))`;
    const query = `${baseSelect}${where}${cursorClause} ${orderBy(filters.sort)} LIMIT ${limit + 1}`;
    const rows = await withPrisma((db) => db.$queryRawUnsafe<CatalogRow>(query, ...values));
    return hydrateList(rows, limit);
  }
  values.push(limit + 1);
  const query = `${baseSelect}${where} ${orderBy(filters.sort)} LIMIT $${values.length}`;
  const rows = await withPrisma((db) => db.$queryRawUnsafe<CatalogRow>(query, ...values));
  return hydrateList(rows, limit);
}

async function hydrateList(rows: CatalogRow[], limit: number): Promise<{ items: PublicCatalogProduct[]; nextCursor: string | null; hasMore: boolean }> {
  const hasMore = rows.length > limit;
  const visible = rows.slice(0, limit);
  const items = await Promise.all(visible.map(async (row) => {
    const media = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(
      `SELECT storage_key, alt_bn, alt_en FROM product_media WHERE product_id = $1 AND type = 'IMAGE' ORDER BY is_primary DESC, sort_order, id LIMIT 8`, row.id,
    ));
    return mapCatalogRow(row, media);
  }));
  const last = visible.at(-1);
  const nextCursor = hasMore && last?.updated_at ? escapeCursor(`${asIso(last.updated_at)}|${last.id}`) : null;
  return { items, nextCursor, hasMore };
}

function mapDemoProduct(product: Record<string, unknown>): PublicCatalogProduct {
  const price = Number(product.price ?? 0);
  const stock = Number(product.stock ?? 0);
  const provenance = product.provenance === "verified-demo" ? "VERIFIED" : "PENDING";
  return {
    id: String(product.slug),
    slug: String(product.slug),
    productCode: String(product.sku ?? product.slug),
    nameBn: String(product.nameBn ?? ""),
    nameEn: String(product.nameEn ?? ""),
    shortDescriptionBn: String(product.description ?? "") || null,
    shortDescriptionEn: String(product.description ?? "") || null,
    category: { slug: String(product.category ?? ""), nameBn: String(product.category ?? ""), nameEn: String(product.category ?? "") },
    region: String(product.region ?? "") || null,
    district: String(product.district ?? "") || null,
    producer: null,
    verification: { origin: provenance, processing: provenance, claims: provenance === "VERIFIED" ? "APPROVED" : "PENDING_REVIEW" },
    fromPrice: price > 0 ? { amountMinor: String(Math.round(price * 100)), currency: "BDT" } : null,
    available: stock > 0,
    availableQuantity: String(stock),
    rating: Number(product.rating ?? 0) || null,
    reviewCount: Number(product.reviews ?? 0),
    featured: Boolean(product.badge),
    media: product.image ? [{ url: String(product.image), altBn: String(product.nameBn ?? ""), altEn: String(product.nameEn ?? "") }] : [],
  };
}

async function demoProducts(): Promise<Record<string, unknown>[]> {
  const demoModule = await import("./data");
  return demoModule.products as unknown as Record<string, unknown>[];
}

async function demoList(filters: CatalogFilters): Promise<{ items: PublicCatalogProduct[]; nextCursor: string | null; hasMore: boolean }> {
  // Demo data is reachable only with an explicit DEMO_MODE=true deployment.
  const query = filters.q?.trim().toLocaleLowerCase("bn") ?? "";
  const all = (await demoProducts()).map(mapDemoProduct).filter((product) => {
    const searchable = `${product.nameBn} ${product.nameEn} ${product.productCode} ${product.category.nameBn} ${product.region ?? ""} ${product.district ?? ""}`.toLocaleLowerCase("bn");
    return (!query || searchable.includes(query)) && (!filters.category || product.category.nameBn === filters.category || product.category.slug === filters.category) && (!filters.region || product.region === filters.region) && (!filters.originStatus || product.verification.origin === filters.originStatus) && (filters.inStock === undefined || product.available === filters.inStock);
  });
  const sorted = [...all].sort((a, b) => filters.sort === "price_asc" ? Number(a.fromPrice?.amountMinor ?? 0) - Number(b.fromPrice?.amountMinor ?? 0) : filters.sort === "price_desc" ? Number(b.fromPrice?.amountMinor ?? 0) - Number(a.fromPrice?.amountMinor ?? 0) : b.reviewCount - a.reviewCount);
  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 100);
  return { items: sorted.slice(0, limit), nextCursor: null, hasMore: false };
}

export async function listCatalogProducts(filters: CatalogFilters): Promise<{ items: PublicCatalogProduct[]; nextCursor: string | null; hasMore: boolean; synthetic: boolean }> {
  if (isDemoMode()) return { ...(await demoList(filters)), synthetic: true };
  requireDatabaseConfig();
  return { ...(await listDb(filters)), synthetic: false };
}

async function detailDb(slug: string): Promise<PublicProductDetail | null> {
  const values: unknown[] = [slug];
  const rows = await withPrisma((db) => db.$queryRawUnsafe<CatalogRow>(`${baseSelect}${catalogWhere({ q: undefined }, values)} AND p.slug = $1 LIMIT 1`, ...values));
  const row = rows[0];
  if (!row) return null;
  const product = mapCatalogRow(row);
  const variants = await withPrisma((db) => db.$queryRawUnsafe<VariantRow>(`
    SELECT pv.id, pv.sku, pv.barcode, pv.label, pv.unit, pv.net_quantity,
      active_price.amount_minor, active_price.compare_at_amount_minor, active_price.currency,
      active_price.valid_from, active_price.valid_until,
      COALESCE((SELECT SUM(il.quantity_available) FROM inventory_levels il JOIN inventory_batches ib ON ib.id = il.batch_id WHERE il.variant_id = pv.id AND ib.status = 'RELEASED'), 0) AS available_quantity
    FROM product_variants pv
    LEFT JOIN LATERAL (
      SELECT pp.amount_minor, pp.compare_at_amount_minor, pp.currency, pp.valid_from, pp.valid_until
      FROM product_prices pp
      WHERE pp.variant_id = pv.id AND pp.currency = 'BDT' AND pp.valid_from <= now()
        AND (pp.valid_until IS NULL OR pp.valid_until > now()) AND pp.type IN ('SALE','REGULAR')
      ORDER BY CASE WHEN pp.type = 'SALE' THEN 0 ELSE 1 END, pp.valid_from DESC LIMIT 1
    ) active_price ON TRUE
    WHERE pv.product_id = $1 AND pv.status = 'ACTIVE' ORDER BY pv.net_quantity, pv.id
  `, row.id));
  const media = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT storage_key, alt_bn, alt_en FROM product_media WHERE product_id = $1 AND type = 'IMAGE' ORDER BY is_primary DESC, sort_order, id LIMIT 24`, row.id));
  const ingredients = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT name, is_allergen FROM product_ingredients WHERE product_id = $1 ORDER BY sort_order, name`, row.id));
  const claims = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`
    SELECT pc.claim_text_bn, pc.claim_text_en, pc.risk_level
    FROM product_claims pc
    WHERE pc.product_id = $1 AND pc.status = 'APPROVED'
      AND (pc.expires_at IS NULL OR pc.expires_at > now())
      AND EXISTS (SELECT 1 FROM claim_evidence ce JOIN evidence_documents ced ON ced.id = ce.evidence_document_id
        WHERE ce.claim_id = pc.id AND ced.verification_status = 'VERIFIED' AND (ced.expires_at IS NULL OR ced.expires_at > now()))
      AND NOT EXISTS (SELECT 1 FROM claim_evidence ce JOIN evidence_documents ed ON ed.id = ce.evidence_document_id
        WHERE ce.claim_id = pc.id AND (ed.verification_status <> 'VERIFIED' OR (ed.expires_at IS NOT NULL AND ed.expires_at <= now())))
    ORDER BY pc.created_at
  `, row.id));
  const provenance = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`
    SELECT sl.name_bn, sl.name_en, sl.division, sl.district, ps.status
    FROM product_sources ps JOIN source_locations sl ON sl.id = ps.source_location_id
    JOIN evidence_documents ped ON ped.id = ps.evidence_document_id
    WHERE ps.product_id = $1 AND ps.status = 'VERIFIED' AND sl.verification_status = 'VERIFIED'
      AND ped.verification_status = 'VERIFIED' AND (ped.expires_at IS NULL OR ped.expires_at > now())
    ORDER BY ps.is_primary DESC, sl.name_en
  `, row.id));
  const reviews = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT AVG(rating) AS average, COUNT(*) AS count FROM product_reviews WHERE product_id = $1 AND moderation_status = 'PUBLISHED' AND published_at IS NOT NULL`, row.id));
  const relatedRows = await withPrisma((db) => db.$queryRawUnsafe<CatalogRow>(`${baseSelect}${catalogWhere({ q: undefined }, [])} AND p.category_id = (SELECT category_id FROM products WHERE id = $1) AND p.id <> $1 ORDER BY p.featured DESC, p.updated_at DESC LIMIT 8`, row.id));
  const bundles = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`
    SELECT DISTINCT b.id, b.code, b.name_bn, b.name_en, b.fixed_price_minor
    FROM bundles b JOIN bundle_items bi ON bi.bundle_id = b.id
    WHERE bi.product_id = $1 AND b.status = 'ACTIVE' AND (b.starts_at IS NULL OR b.starts_at <= now()) AND (b.ends_at IS NULL OR b.ends_at > now())
    ORDER BY b.name_en
  `, row.id));
  const related = await Promise.all(relatedRows.map(async (relatedRow) => {
    const relatedMedia = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT storage_key, alt_bn, alt_en FROM product_media WHERE product_id = $1 AND type = 'IMAGE' ORDER BY is_primary DESC, sort_order, id LIMIT 1`, relatedRow.id));
    return mapCatalogRow(relatedRow, relatedMedia);
  }));
  return {
    ...product,
    descriptionBn: row.description_bn ?? null,
    descriptionEn: row.description_en ?? null,
    storageInstructions: row.storage_instructions ?? null,
    shelfLifeDays: row.shelf_life_days == null ? null : Number(row.shelf_life_days),
    media: publicMedia(media),
    ingredients: ingredients.map((item) => ({ name: String(item.name), isAllergen: Boolean(item.is_allergen) })),
    variants: variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      barcode: asString(variant.barcode),
      label: variant.label,
      unit: variant.unit,
      netQuantity: asString(variant.net_quantity) ?? "0",
      price: variant.amount_minor == null ? null : {
        amountMinor: asMinor(variant.amount_minor) as string,
        compareAtAmountMinor: asMinor(variant.compare_at_amount_minor),
        currency: variant.currency ?? "BDT",
        validFrom: asIso(variant.valid_from) as string,
        validUntil: asIso(variant.valid_until),
      },
      available: (asNumber(variant.available_quantity) ?? 0) > 0,
      availableQuantity: asString(variant.available_quantity) ?? "0",
    })),
    claims: claims.map((claim) => ({ textBn: asString(claim.claim_text_bn), textEn: asString(claim.claim_text_en), riskLevel: String(claim.risk_level) })),
    provenance: provenance.map((source) => ({ location: String(source.name_bn ?? source.name_en), division: asString(source.division), district: asString(source.district), status: String(source.status) })),
    reviews: { average: asNumber(reviews[0]?.average), count: Math.max(0, Math.trunc(asNumber(reviews[0]?.count) ?? 0)) },
    related,
    bundles: bundles.map((bundle) => ({ id: String(bundle.id), code: String(bundle.code), nameBn: String(bundle.name_bn), nameEn: String(bundle.name_en), fixedPriceMinor: asMinor(bundle.fixed_price_minor) })),
  };
}

export async function getPublicProduct(slug: string): Promise<{ data: PublicProductDetail | null; synthetic: boolean }> {
  if (isDemoMode()) {
    const product = (await demoProducts()).find((candidate) => String(candidate.slug) === slug);
    if (!product) return { data: null, synthetic: true };
    const summary = mapDemoProduct(product);
    const price = Number(product.price ?? 0);
    const detail: PublicProductDetail = {
      ...summary,
      descriptionBn: String(product.description ?? "") || null,
      descriptionEn: String(product.description ?? "") || null,
      storageInstructions: String(product.storage ?? "") || null,
      shelfLifeDays: null,
      ingredients: String(product.ingredients ?? "").split(",").map((name) => name.trim()).filter(Boolean).map((name) => ({ name, isAllergen: false })),
      variants: [{ id: `${slug}-demo-variant`, sku: String(product.sku ?? slug), barcode: null, label: String(product.pack ?? "Demo pack"), unit: String(product.pack ?? "unit"), netQuantity: "1", price: price > 0 ? { amountMinor: String(Math.round(price * 100)), compareAtAmountMinor: product.compareAt ? String(Math.round(Number(product.compareAt) * 100)) : null, currency: "BDT", validFrom: new Date(0).toISOString(), validUntil: null } : null, available: summary.available, availableQuantity: summary.availableQuantity }],
      claims: [],
      provenance: summary.region || summary.district ? [{ location: summary.district || summary.region || "Pending verification", division: summary.region, district: summary.district, status: summary.verification.origin }] : [],
      reviews: { average: summary.rating, count: summary.reviewCount },
      related: (await demoProducts()).filter((candidate) => String(candidate.slug) !== slug).slice(0, 4).map(mapDemoProduct),
      bundles: [],
    };
    return { data: detail, synthetic: true };
  }
  requireDatabaseConfig();
  return { data: await detailDb(slug), synthetic: false };
}

export async function getSearchSuggestions(term: string): Promise<{ products: Array<{ slug: string; nameBn: string; nameEn: string; category: string }>; categories: Array<{ slug: string; nameBn: string; nameEn: string }>; regions: Array<{ nameBn: string; nameEn: string; division: string | null }> }> {
  const query = term.trim();
  if (query.length < 2) return { products: [], categories: [], regions: [] };
  if (isDemoMode()) {
    const lowered = query.toLocaleLowerCase("bn");
    const products = (await demoProducts()).map(mapDemoProduct).filter((product) => `${product.nameBn} ${product.nameEn}`.toLocaleLowerCase("bn").includes(lowered)).slice(0, 8);
    return { products: products.map((product) => ({ slug: product.slug, nameBn: product.nameBn, nameEn: product.nameEn, category: product.category.nameEn })), categories: [], regions: [] };
  }
  requireDatabaseConfig();
  const like = `%${query}%`;
  return withPrisma(async (db) => {
    const products = await db.$queryRawUnsafe<SqlRow>(`
      SELECT p.slug, p.name_bn, p.name_en, c.name_en AS category
      FROM products p JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'ACTIVE' AND p.publish_approved = true AND (p.name_bn ILIKE $1 OR p.name_en ILIKE $1 OR p.product_code ILIKE $1)
      ORDER BY p.featured DESC, p.name_en LIMIT 8
    `, like);
    const categories = await db.$queryRawUnsafe<SqlRow>(`SELECT slug, name_bn, name_en FROM categories WHERE status = 'ACTIVE' AND (name_bn ILIKE $1 OR name_en ILIKE $1) ORDER BY sort_order, name_en LIMIT 6`, like);
    const regions = await db.$queryRawUnsafe<SqlRow>(`SELECT DISTINCT name_bn, name_en, division FROM source_locations WHERE verification_status = 'VERIFIED' AND (name_bn ILIKE $1 OR name_en ILIKE $1 OR division ILIKE $1) ORDER BY name_en LIMIT 6`, like);
    return {
      products: products.map((row) => ({ slug: String(row.slug), nameBn: String(row.name_bn), nameEn: String(row.name_en), category: String(row.category) })),
      categories: categories.map((row) => ({ slug: String(row.slug), nameBn: String(row.name_bn), nameEn: String(row.name_en) })),
      regions: regions.map((row) => ({ nameBn: String(row.name_bn), nameEn: String(row.name_en), division: asString(row.division) })),
    };
  });
}

export async function getTraceRecord(publicToken: string): Promise<Record<string, unknown> | null> {
  if (isDemoMode()) {
    const product = (await demoProducts()).find((candidate) => String(candidate.batchCode ?? "") === publicToken.trim());
    if (!product) return null;
    return { batchCode: String(product.batchCode), verification: { origin: product.provenance === "verified-demo" ? "VERIFIED" : "PENDING", processing: "PENDING", lab: "PENDING" }, source: { name: String(product.district ?? "Pending verification"), division: asString(product.region), district: asString(product.district) }, bestBeforeDate: null, recallStatus: "NONE", events: [{ type: "PUBLIC_RECORD", occurredAt: null, location: String(product.district ?? "Pending verification"), details: { summary: "Synthetic demo trace record" } }] };
  }
  requireDatabaseConfig();
  const token = publicToken.trim();
  if (!token || token.length > 256) return null;
  const secret = new TextEncoder().encode(process.env.TOKEN_HASH_SECRET as string);
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(token));
  const tokenHash = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return withPrisma(async (db) => {
    const batch = await db.$queryRawUnsafe<SqlRow>(`
      SELECT ib.id, ib.batch_code, ib.status, ib.origin_verification_status, ib.processing_verification_status,
        ib.best_before_date, sl.name_bn, sl.name_en, sl.division, sl.district,
        CASE WHEN EXISTS (SELECT 1 FROM lab_reports lr JOIN evidence_documents led ON led.id = lr.evidence_document_id
          WHERE lr.batch_id = ib.id AND lr.status = 'VERIFIED' AND led.verification_status = 'VERIFIED') THEN 'VERIFIED' ELSE 'PENDING' END AS lab_status,
        CASE WHEN EXISTS (SELECT 1 FROM inventory_batches ib2 JOIN recalls r ON r.batch_id = ib2.id WHERE ib2.id = ib.id AND r.status = 'ACTIVE') THEN 'ACTIVE' ELSE 'NONE' END AS recall_status
      FROM inventory_batches ib
      LEFT JOIN source_locations sl ON sl.id = ib.source_location_id
      WHERE ib.public_trace_token_hash = $1 LIMIT 1
    `, tokenHash);
    const row = batch[0];
    if (!row) return null;
    const events = await db.$queryRawUnsafe<SqlRow>(`SELECT event_type, occurred_at, location_label, details FROM trace_events WHERE batch_id = $1 AND public_visible = true ORDER BY occurred_at`, row.id);
    return {
      batchCode: String(row.batch_code),
      verification: { origin: String(row.origin_verification_status), processing: String(row.processing_verification_status), lab: String(row.lab_status) },
      source: row.name_bn || row.name_en ? { name: String(row.name_bn ?? row.name_en), division: asString(row.division), district: asString(row.district) } : null,
      bestBeforeDate: row.best_before_date ? String(row.best_before_date) : null,
      recallStatus: String(row.recall_status),
      events: events.map((event) => ({ type: String(event.event_type), occurredAt: asIso(event.occurred_at), location: asString(event.location_label), details: publicEventDetails(event.details) })),
    };
  });
}

function publicEventDetails(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const allowed = ["summary", "method", "facility", "status", "temperatureBand"];
  const result: Record<string, unknown> = {};
  for (const key of allowed) if (typeof input[key] === "string" || typeof input[key] === "number") result[key] = input[key];
  return Object.keys(result).length ? result : null;
}

export type AdminProduct = PublicCatalogProduct & {
  status: string;
  publishApproved: boolean;
  variants: Array<{ id: string; sku: string; label: string; unit: string; status: string }>;
};

export async function listAdminProducts(filters: { q?: string; status?: string; limit?: number; after?: string }): Promise<{ items: AdminProduct[]; nextCursor: string | null; hasMore: boolean }> {
  requireDatabaseConfig();
  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 100);
  const values: unknown[] = [];
  const clauses = ["1=1"];
  if (filters.q) { values.push(`%${filters.q}%`); clauses.push(`(p.name_bn ILIKE $${values.length} OR p.name_en ILIKE $${values.length} OR p.product_code ILIKE $${values.length} OR p.slug ILIKE $${values.length})`); }
  if (filters.status) { values.push(filters.status); clauses.push(`p.status = $${values.length}`); }
  const cursor = decodeCursor(filters.after);
  if (cursor) { const [date, id] = cursor.split("|"); if (!date || !id) throw new Error("Invalid admin cursor"); values.push(date, id); clauses.push(`(p.updated_at < $${values.length - 1}::timestamptz OR (p.updated_at = $${values.length - 1}::timestamptz AND p.id < $${values.length}::uuid))`); }
  values.push(limit + 1);
  const rows = await withPrisma((db) => db.$queryRawUnsafe<CatalogRow & { status: string; publish_approved: boolean }>(`
    ${baseSelect.replace("WHERE", "")}
    WHERE ${clauses.join(" AND ")} ORDER BY p.updated_at DESC, p.id DESC LIMIT $${values.length}
  `, ...values));
  const visible = rows.slice(0, limit);
  const items = await Promise.all(visible.map(async (row) => {
    const variants = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT id, sku, label, unit, status FROM product_variants WHERE product_id = $1 ORDER BY created_at`, row.id));
    return { ...mapCatalogRow(row), status: String((row as unknown as { status: string }).status), publishApproved: Boolean((row as unknown as { publish_approved: boolean }).publish_approved), variants: variants.map((variant) => ({ id: String(variant.id), sku: String(variant.sku), label: String(variant.label), unit: String(variant.unit), status: String(variant.status) })) };
  }));
  const hasMore = rows.length > limit;
  const last = visible.at(-1);
  return { items, hasMore, nextCursor: hasMore && last?.updated_at ? escapeCursor(`${asIso(last.updated_at)}|${last.id}`) : null };
}

export async function createAdminProduct(input: Record<string, unknown>, actor: string, request: Request): Promise<Record<string, unknown>> {
  requireDatabaseConfig();
  const required = ["categoryId", "slug", "productCode", "nameBn", "nameEn"];
  for (const field of required) if (typeof input[field] !== "string" || !String(input[field]).trim()) throw new Error(`Missing ${field}`);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  return withPrisma(async (db) => db.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`INSERT INTO products (id, category_id, slug, product_code, name_bn, name_en, short_description_bn, short_description_en, description_bn, description_en, storage_instructions, shelf_life_days, status, publish_approved, featured, subscription_eligible, seo_title, seo_description, seo_keywords, created_at, updated_at) VALUES ($1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'DRAFT',false,$13,$14,$15,$16,$17,$18,$18)`, id, input.categoryId, input.slug, input.productCode, input.nameBn, input.nameEn, input.shortDescriptionBn ?? null, input.shortDescriptionEn ?? null, input.descriptionBn ?? null, input.descriptionEn ?? null, input.storageInstructions ?? null, input.shelfLifeDays ?? null, Boolean(input.featured), Boolean(input.subscriptionEligible), input.seoTitle ?? null, input.seoDescription ?? null, Array.isArray(input.seoKeywords) ? input.seoKeywords : [], now);
    await audit(tx, actor, "CREATE", "product", id, null, { slug: input.slug }, request);
    return { id, slug: input.slug, status: "DRAFT", publishApproved: false };
  }));
}

export async function updateAdminProduct(id: string, input: Record<string, unknown>, actor: string, request: Request, ifMatch: string | null): Promise<Record<string, unknown> | null> {
  requireDatabaseConfig();
  const current = await withPrisma((db) => db.$queryRawUnsafe<SqlRow>(`SELECT id, updated_at, slug, publish_approved FROM products WHERE id = $1::uuid`, id));
  if (!current[0]) return null;
  if (ifMatch && ifMatch !== etag(asIso(current[0].updated_at) as string)) throw new Error("ETAG_MISMATCH");
  const fields: Array<[string, unknown]> = [];
  const allowed: Record<string, string> = { slug: "slug", productCode: "product_code", nameBn: "name_bn", nameEn: "name_en", shortDescriptionBn: "short_description_bn", shortDescriptionEn: "short_description_en", descriptionBn: "description_bn", descriptionEn: "description_en", storageInstructions: "storage_instructions", shelfLifeDays: "shelf_life_days", featured: "featured", subscriptionEligible: "subscription_eligible", seoTitle: "seo_title", seoDescription: "seo_description", seoKeywords: "seo_keywords" };
  for (const [key, column] of Object.entries(allowed)) if (Object.prototype.hasOwnProperty.call(input, key)) fields.push([column, input[key]]);
  if (!fields.length) throw new Error("No editable fields supplied");
  return withPrisma(async (db) => db.$transaction(async (tx) => {
    const assignments = fields.map(([column], index) => `${column} = $${index + 2}`).join(", ");
    await tx.$executeRawUnsafe(`UPDATE products SET ${assignments}, updated_at = now() WHERE id = $1::uuid`, id, ...fields.map(([, value]) => value));
    const after = await tx.$queryRawUnsafe<SqlRow>(`SELECT id, slug, status, publish_approved, updated_at FROM products WHERE id = $1::uuid`, id);
    await audit(tx, actor, "UPDATE", "product", id, current[0], after[0], request);
    return { ...(after[0] as Record<string, unknown>), etag: etag(asIso(after[0].updated_at) as string) };
  }));
}

export async function createAdminVariant(productId: string, input: Record<string, unknown>, actor: string, request: Request): Promise<Record<string, unknown>> {
  requireDatabaseConfig();
  for (const field of ["sku", "label", "unit", "netQuantity"]) if (typeof input[field] !== "string" && typeof input[field] !== "number") throw new Error(`Missing ${field}`);
  const id = crypto.randomUUID();
  return withPrisma(async (db) => db.$transaction(async (tx) => {
    const product = await tx.$queryRawUnsafe<SqlRow>(`SELECT id FROM products WHERE id = $1::uuid`, productId);
    if (!product[0]) throw new Error("PRODUCT_NOT_FOUND");
    await tx.$executeRawUnsafe(`INSERT INTO product_variants (id, product_id, sku, barcode, label, unit, net_quantity, tax_rate, low_stock_threshold, reorder_point, reorder_quantity, status, created_at, updated_at) VALUES ($1::uuid,$2::uuid,$3,$4,$5,$6,$7::numeric,0,$8::numeric,$9::numeric,$10::numeric,'DRAFT',now(),now())`, id, productId, input.sku, input.barcode ?? null, input.label, input.unit, input.netQuantity, input.lowStockThreshold ?? 0, input.reorderPoint ?? 0, input.reorderQuantity ?? 0);
    await audit(tx, actor, "CREATE", "product_variant", id, null, { productId, sku: input.sku }, request);
    return { id, productId, sku: input.sku, status: "DRAFT" };
  }));
}

export async function createAdminPrice(variantId: string, input: Record<string, unknown>, actor: string, request: Request): Promise<Record<string, unknown>> {
  requireDatabaseConfig();
  if (!["REGULAR", "SALE", "SUBSCRIPTION", "WHOLESALE"].includes(String(input.type))) throw new Error("Invalid price type");
  if (typeof input.amountMinor !== "string" && typeof input.amountMinor !== "number") throw new Error("Missing amountMinor");
  const id = crypto.randomUUID();
  return withPrisma(async (db) => db.$transaction(async (tx) => {
    const variant = await tx.$queryRawUnsafe<SqlRow>(`SELECT id FROM product_variants WHERE id = $1::uuid`, variantId);
    if (!variant[0]) throw new Error("VARIANT_NOT_FOUND");
    await tx.$executeRawUnsafe(`INSERT INTO product_prices (id, variant_id, promotion_id, type, currency, amount_minor, compare_at_amount_minor, cost_amount_minor, valid_from, valid_until, created_at) VALUES ($1::uuid,$2::uuid,$3::uuid,$4,'BDT',$5::bigint,$6::bigint,$7::bigint,$8::timestamptz,$9::timestamptz,now())`, id, variantId, input.promotionId ?? null, input.type, input.amountMinor, input.compareAtAmountMinor ?? null, input.costAmountMinor ?? null, input.validFrom ?? new Date().toISOString(), input.validUntil ?? null);
    await audit(tx, actor, "CREATE", "product_price", id, null, { variantId, type: input.type, amountMinor: String(input.amountMinor) }, request);
    return { id, variantId, type: input.type, amountMinor: String(input.amountMinor), currency: "BDT" };
  }));
}

export async function publishAdminProduct(productId: string, actor: string, request: Request): Promise<Record<string, unknown>> {
  requireDatabaseConfig();
  return withPrisma(async (db) => db.$transaction(async (tx) => {
    const checks = await tx.$queryRawUnsafe<SqlRow>(`
      SELECT p.id, p.name_bn, p.name_en, p.product_code, p.category_id,
        EXISTS (SELECT 1 FROM product_variants pv JOIN product_prices pp ON pp.variant_id = pv.id WHERE pv.product_id = p.id AND pv.status = 'ACTIVE' AND pp.currency = 'BDT' AND pp.valid_from <= now() AND (pp.valid_until IS NULL OR pp.valid_until > now()) AND pp.type IN ('SALE','REGULAR')) AS has_price,
        EXISTS (SELECT 1 FROM product_variants pv JOIN inventory_levels il ON il.variant_id = pv.id JOIN inventory_batches ib ON ib.id = il.batch_id WHERE pv.product_id = p.id AND pv.status = 'ACTIVE' AND ib.status = 'RELEASED' AND il.quantity_available > 0) AS has_inventory,
        EXISTS (SELECT 1 FROM product_claims pc WHERE pc.product_id = p.id AND pc.status NOT IN ('APPROVED','WITHDRAWN','REJECTED')) AS unapproved_claim,
        EXISTS (SELECT 1 FROM product_claims pc WHERE pc.product_id = p.id AND pc.status = 'APPROVED' AND (pc.expires_at IS NOT NULL AND pc.expires_at <= now())) AS expired_claim,
        EXISTS (SELECT 1 FROM inventory_batches ib JOIN product_variants pv ON pv.id = ib.variant_id WHERE pv.product_id = p.id AND (ib.status IN ('ON_HOLD','QUARANTINED','RECALLED') OR EXISTS (SELECT 1 FROM recalls r WHERE r.batch_id = ib.id AND r.status = 'ACTIVE'))) AS active_hold_or_recall
      FROM products p WHERE p.id = $1::uuid FOR UPDATE
    `, productId);
    const row = checks[0];
    if (!row) throw new Error("PRODUCT_NOT_FOUND");
    const failures: string[] = [];
    if (!row.name_bn || !row.name_en || !row.product_code || !row.category_id) failures.push("missing_label_data");
    if (!row.has_price) failures.push("no_current_price");
    if (!row.has_inventory) failures.push("no_available_inventory");
    if (row.unapproved_claim) failures.push("unapproved_claim");
    if (row.expired_claim) failures.push("expired_claim_evidence");
    if (row.active_hold_or_recall) failures.push("active_hold_or_recall");
    if (failures.length) {
      const error = new Error("PUBLISH_GATE_FAILED");
      (error as Error & { details?: string[] }).details = failures;
      throw error;
    }
    await tx.$executeRawUnsafe(`UPDATE products SET status = 'ACTIVE', publish_approved = true, updated_at = now() WHERE id = $1::uuid`, productId);
    await audit(tx, actor, "APPROVE", "product", productId, { publishApproved: false }, { publishApproved: true }, request);
    const after = await tx.$queryRawUnsafe<SqlRow>(`SELECT id, slug, status, publish_approved, updated_at FROM products WHERE id = $1::uuid`, productId);
    return { ...(after[0] as Record<string, unknown>), etag: etag(asIso(after[0].updated_at) as string) };
  }));
}

async function audit(tx: PrismaLike, actor: string, action: string, entityType: string, entityId: string, before: unknown, after: unknown, request: Request): Promise<void> {
  const actorUserId = await resolveActorUserId(tx, actor);
  await tx.$executeRawUnsafe(`INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, before, after, correlation_id, user_agent, occurred_at) VALUES ($1::uuid,$2::uuid,$3,$4,$5,$6::jsonb,$7::jsonb,$8::uuid,$9,now())`, crypto.randomUUID(), actorUserId, action, entityType, entityId, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, crypto.randomUUID(), request.headers.get("user-agent"));
}

async function resolveActorUserId(db: PrismaLike, actor: string): Promise<string | null> {
  if (!actor || actor === "local-development-owner") return null;
  const rows = await db.$queryRawUnsafe<SqlRow>(`SELECT u.id FROM users u JOIN user_identities ui ON ui.user_id = u.id WHERE ui.provider_subject = $1 ORDER BY ui.last_used_at DESC LIMIT 1`, actor);
  return rows[0]?.id ? String(rows[0].id) : null;
}
