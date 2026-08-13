import { ensureRuntimeSchema, getD1, getOpenCart, readCart, requestIdentity, withIdentityCookie } from "@/db/runtime";
import { getProduct } from "@/lib/data";

export async function GET(request: Request) {
  const identity = requestIdentity(request);
  try { const db = getD1(); await ensureRuntimeSchema(db); return withIdentityCookie(await readCart(db, identity.customerKey), identity); }
  catch { return withIdentityCookie({ items: [], count: 0, subtotal: 0, warning: "Database preview unavailable" }, identity); }
}

export async function POST(request: Request) {
  const identity = requestIdentity(request);
  try {
    const payload = await request.json() as { slug?: string; quantityDelta?: number };
    const product = payload.slug ? getProduct(payload.slug) : null;
    const delta = Math.max(1, Math.min(20, Math.floor(payload.quantityDelta ?? 1)));
    if (!product) return withIdentityCookie({ error: "Valid product slug required" }, identity, 400);
    const db = getD1(); await ensureRuntimeSchema(db); const cart = await getOpenCart(db, identity.customerKey);
    const current = await db.prepare("SELECT quantity FROM cart_items WHERE cart_id = ? AND product_slug = ?").bind(cart.id, product.slug).first<{ quantity: number }>();
    const quantity = Math.min(product.stock, (current?.quantity ?? 0) + delta);
    await db.prepare("INSERT INTO cart_items (id, cart_id, product_slug, quantity, unit_price_paisa) VALUES (?, ?, ?, ?, ?) ON CONFLICT(cart_id, product_slug) DO UPDATE SET quantity = excluded.quantity, unit_price_paisa = excluded.unit_price_paisa, updated_at = CURRENT_TIMESTAMP")
      .bind(crypto.randomUUID(), cart.id, product.slug, quantity, product.price * 100).run();
    return withIdentityCookie(await readCart(db, identity.customerKey), identity);
  } catch { return withIdentityCookie({ error: "Cart update failed" }, identity, 500); }
}

export async function PATCH(request: Request) {
  const identity = requestIdentity(request);
  try {
    const payload = await request.json() as { slug?: string; quantity?: number };
    const product = payload.slug ? getProduct(payload.slug) : null;
    if (!product || !Number.isFinite(payload.quantity)) return withIdentityCookie({ error: "Valid slug and quantity required" }, identity, 400);
    const db = getD1(); await ensureRuntimeSchema(db); const cart = await getOpenCart(db, identity.customerKey);
    const quantity = Math.max(0, Math.min(product.stock, Math.floor(payload.quantity ?? 0)));
    if (quantity === 0) await db.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_slug = ?").bind(cart.id, product.slug).run();
    else await db.prepare("UPDATE cart_items SET quantity = ?, unit_price_paisa = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ? AND product_slug = ?").bind(quantity, product.price * 100, cart.id, product.slug).run();
    return withIdentityCookie(await readCart(db, identity.customerKey), identity);
  } catch { return withIdentityCookie({ error: "Cart update failed" }, identity, 500); }
}

export async function DELETE(request: Request) {
  const identity = requestIdentity(request);
  try {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return withIdentityCookie({ error: "slug required" }, identity, 400);
    const db = getD1(); await ensureRuntimeSchema(db); const cart = await getOpenCart(db, identity.customerKey);
    await db.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_slug = ?").bind(cart.id, slug).run();
    return withIdentityCookie(await readCart(db, identity.customerKey), identity);
  } catch { return withIdentityCookie({ error: "Cart update failed" }, identity, 500); }
}
