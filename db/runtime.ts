import { env } from "cloudflare:workers";
import { isAdminActor } from "@/lib/admin-auth";

let schemaReady: Promise<void> | null = null;

export function getD1(): D1Database {
  const bindings = env as unknown as { DB?: D1Database };
  if (!bindings.DB) throw new Error("Database binding unavailable");
  return bindings.DB;
}

export function ensureRuntimeSchema(db: D1Database) {
  if (!schemaReady) schemaReady = initialize(db).catch((error) => { schemaReady = null; throw error; });
  return schemaReady;
}

async function initialize(db: D1Database) {
  const { analyticsSeed } = await import("@/lib/data");
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS carts (id TEXT PRIMARY KEY NOT NULL, customer_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_carts_customer_status ON carts (customer_key, status)"),
    db.prepare("CREATE TABLE IF NOT EXISTS cart_items (id TEXT PRIMARY KEY NOT NULL, cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE, product_slug TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price_paisa INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items (cart_id, product_slug)"),
    db.prepare("CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY NOT NULL, tracking_code TEXT NOT NULL UNIQUE, customer_key TEXT NOT NULL, contact_name TEXT NOT NULL, contact_mobile_masked TEXT NOT NULL, destination TEXT NOT NULL, delivery_method TEXT NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT NOT NULL DEFAULT 'staging_not_captured', status TEXT NOT NULL DEFAULT 'confirmed', subtotal_paisa INTEGER NOT NULL, discount_paisa INTEGER NOT NULL DEFAULT 0, delivery_paisa INTEGER NOT NULL DEFAULT 0, total_paisa INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders (customer_key, created_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS order_items (id TEXT PRIMARY KEY NOT NULL, order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_slug TEXT NOT NULL, product_name_snapshot TEXT NOT NULL, sku_snapshot TEXT NOT NULL, batch_code_snapshot TEXT, quantity INTEGER NOT NULL, unit_price_paisa INTEGER NOT NULL, unit_landed_cost_paisa INTEGER)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id)"),
    db.prepare("CREATE TABLE IF NOT EXISTS analytics_snapshots (id TEXT PRIMARY KEY NOT NULL, snapshot_type TEXT NOT NULL, period_start TEXT NOT NULL, period_end TEXT NOT NULL, timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka', payload_json TEXT NOT NULL, is_synthetic INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_type_period ON analytics_snapshots (snapshot_type, period_end)"),
    db.prepare("CREATE TABLE IF NOT EXISTS recommendations (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, priority TEXT NOT NULL, title TEXT NOT NULL, reason TEXT NOT NULL, expected_impact TEXT NOT NULL, confidence INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'open', is_synthetic INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS recommendation_actions (id TEXT PRIMARY KEY NOT NULL, recommendation_id TEXT NOT NULL REFERENCES recommendations(id), actor_key TEXT NOT NULL, action TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_recommendation_actions_rec ON recommendation_actions (recommendation_id)"),
    db.prepare("CREATE TABLE IF NOT EXISTS events (event_id TEXT PRIMARY KEY NOT NULL, event_name TEXT NOT NULL, anonymous_id TEXT, session_id TEXT, user_key TEXT, entity_type TEXT, entity_id TEXT, properties_json TEXT NOT NULL DEFAULT '{}', occurred_at TEXT NOT NULL, received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_events_name_occurred ON events (event_name, occurred_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY NOT NULL, actor_key TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created ON audit_logs (actor_key, created_at)"),
  ]);

  const snapshot = await db.prepare("SELECT id FROM analytics_snapshots WHERE snapshot_type = ? LIMIT 1").bind("overview_30d").first<{ id: string }>();
  if (!snapshot) {
    await db.prepare("INSERT INTO analytics_snapshots (id, snapshot_type, period_start, period_end, timezone, payload_json, is_synthetic) VALUES (?, ?, ?, ?, ?, ?, 1)")
      .bind("snap-demo-2026-08-12", "overview_30d", "2026-07-14", "2026-08-12", "Asia/Dhaka", JSON.stringify(analyticsSeed)).run();
  }
  for (const recommendation of analyticsSeed.recommendations) {
    await db.prepare("INSERT OR IGNORE INTO recommendations (id, type, priority, title, reason, expected_impact, confidence, status, is_synthetic) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 1)")
      .bind(recommendation.id, recommendation.type, recommendation.priority, recommendation.title, recommendation.reason, recommendation.impact, recommendation.confidence).run();
  }
  const demoOrder = await db.prepare("SELECT id FROM orders WHERE tracking_code = ?").bind("DJ-2026-1048").first<{ id: string }>();
  if (!demoOrder) {
    await db.batch([
      db.prepare("INSERT INTO orders (id, tracking_code, customer_key, contact_name, contact_mobile_masked, destination, delivery_method, payment_method, payment_status, status, subtotal_paisa, discount_paisa, delivery_paisa, total_paisa, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind("ord-demo-1048", "DJ-2026-1048", "synthetic-customer", "Synthetic Customer", "01•••••••••", "Dhanmondi, Dhaka", "standard", "cod", "staging_not_captured", "in_transit", 167000, 0, 8000, 175000, "2026-08-09T09:20:00+06:00"),
      db.prepare("INSERT INTO order_items (id, order_id, product_slug, product_name_snapshot, sku_snapshot, batch_code_snapshot, quantity, unit_price_paisa, unit_landed_cost_paisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind("oi-demo-1", "ord-demo-1048", "kalijira-fragrant-rice", "কালিজিরা সুগন্ধি চাল", "DJ-RCE-KJ-1KG", "DJ-BATCH-241", 2, 59000, 38500),
      db.prepare("INSERT INTO order_items (id, order_id, product_slug, product_name_snapshot, sku_snapshot, batch_code_snapshot, quantity, unit_price_paisa, unit_landed_cost_paisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind("oi-demo-2", "ord-demo-1048", "chui-jhal-spice", "চুই ঝাল মসলা", "DJ-SPC-CHU-100", "DJ-BATCH-156", 1, 32000, 15300),
      db.prepare("INSERT INTO order_items (id, order_id, product_slug, product_name_snapshot, sku_snapshot, batch_code_snapshot, quantity, unit_price_paisa, unit_landed_cost_paisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind("oi-demo-3", "ord-demo-1048", "deshi-masoor-dal", "দেশি মসুর ডাল", "DJ-DAL-RJS-1KG", "DJ-BATCH-365", 1, 17000, 11800),
    ]);
  }
}

export function requestIdentity(request: Request) {
  const userKey = request.headers.get("oai-authenticated-user-id");
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieKey = cookieHeader.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("dj_cart_id="))?.slice("dj_cart_id=".length);
  const customerKey = userKey || cookieKey || crypto.randomUUID();
  return { customerKey, shouldSetCookie: !userKey && !cookieKey };
}

export function withIdentityCookie(body: unknown, identity: { customerKey: string; shouldSetCookie: boolean }, status = 200) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  if (identity.shouldSetCookie) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    headers.append("set-cookie", `dj_cart_id=${identity.customerKey}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`);
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export async function getOpenCart(db: D1Database, customerKey: string) {
  let cart = await db.prepare("SELECT id FROM carts WHERE customer_key = ? AND status = 'open' ORDER BY created_at DESC LIMIT 1").bind(customerKey).first<{ id: string }>();
  if (!cart) { cart = { id: crypto.randomUUID() }; await db.prepare("INSERT INTO carts (id, customer_key, status) VALUES (?, ?, 'open')").bind(cart.id, customerKey).run(); }
  return cart;
}

export async function readCart(db: D1Database, customerKey: string) {
  const { getProduct } = await import("@/lib/data");
  const cart = await getOpenCart(db, customerKey);
  const result = await db.prepare("SELECT product_slug, quantity FROM cart_items WHERE cart_id = ? AND quantity > 0 ORDER BY created_at").bind(cart.id).all<{ product_slug: string; quantity: number }>();
  const rows = result.results as { product_slug: string; quantity: number }[];
  const items = rows.flatMap((row) => { const product = getProduct(row.product_slug); return product ? [{ product, quantity: Math.min(product.stock, row.quantity) }] : []; });
  return { cartId: cart.id, items, count: items.reduce((sum, item) => sum + item.quantity, 0), subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) };
}

export function assertAdmin(request: Request) {
  const actor = request.headers.get("oai-authenticated-user-id");
  if (!actor && (process.env.NODE_ENV === "production" || process.env.DESHIJAAT_ADMIN_USER_IDS)) throw new Response("Unauthorized", { status: 401 });
  if (actor && !isAdminActor(actor)) throw new Response("Forbidden", { status: 403 });
  return actor || "local-development-owner";
}
