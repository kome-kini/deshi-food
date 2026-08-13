import { ensureRuntimeSchema, getD1, getOpenCart, readCart, requestIdentity, withIdentityCookie } from "@/db/runtime";

function safeText(value: unknown, max = 160) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function maskMobile(value: string) { return value.length >= 5 ? `${value.slice(0, 2)}•••••••${value.slice(-2)}` : "•••••••••••"; }

export async function GET(request: Request) {
  const identity = requestIdentity(request);
  try {
    const db = getD1(); await ensureRuntimeSchema(db);
    const result = await db.prepare("SELECT tracking_code, status, total_paisa, created_at FROM orders WHERE customer_key = ? ORDER BY created_at DESC LIMIT 20").bind(identity.customerKey).all<{ tracking_code: string; status: string; total_paisa: number; created_at: string }>();
    const orders = (result.results as { tracking_code: string; status: string; total_paisa: number; created_at: string }[]).map((order) => ({
      trackingCode: order.tracking_code,
      status: order.status === "in_transit" ? "In transit" : order.status[0].toUpperCase() + order.status.slice(1).replaceAll("_", " "),
      total: order.total_paisa / 100,
      placedAt: new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(order.created_at)),
    }));
    return withIdentityCookie({ orders, synthetic: true }, identity);
  } catch { return withIdentityCookie({ error: "Orders unavailable" }, identity, 500); }
}

export async function POST(request: Request) {
  const identity = requestIdentity(request);
  try {
    const payload = await request.json() as { contact?: { name?: string; mobile?: string; email?: string }; address?: { division?: string; district?: string; upazila?: string; area?: string; address?: string; landmark?: string }; delivery?: string; payment?: string; coupon?: string };
    const name = safeText(payload.contact?.name, 80); const mobile = safeText(payload.contact?.mobile, 20).replace(/\s/g, "");
    const district = safeText(payload.address?.district, 80); const upazila = safeText(payload.address?.upazila, 80); const address = safeText(payload.address?.address, 240);
    if (name.length < 2 || !/^01\d{9}$/.test(mobile) || !district || !upazila || address.length < 6) return withIdentityCookie({ error: "Valid contact and Bangladesh delivery address required" }, identity, 400);
    const allowedPayments = ["cod", "bkash", "nagad", "rocket", "card"]; const payment = allowedPayments.includes(payload.payment ?? "") ? payload.payment! : "cod";
    const deliveryMethod = payload.delivery === "express" ? "express" : "standard";
    const db = getD1(); await ensureRuntimeSchema(db); const cart = await readCart(db, identity.customerKey);
    if (!cart.items.length) return withIdentityCookie({ error: "Cart is empty" }, identity, 400);
    for (const line of cart.items) if (line.quantity > line.product.stock) return withIdentityCookie({ error: `${line.product.nameBn} has insufficient stock` }, identity, 409);
    const coupon = safeText(payload.coupon, 40).toUpperCase(); const discount = coupon === "DESHI10" ? Math.min(Math.round(cart.subtotal * .1), 300) : 0; const delivery = cart.subtotal >= 1499 ? 0 : deliveryMethod === "express" ? 140 : 80; const total = cart.subtotal + delivery - discount;
    const orderId = crypto.randomUUID(); const trackingCode = `DJ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`; const destination = [safeText(payload.address?.area), upazila, district, safeText(payload.address?.division)].filter(Boolean).join(", ");
    const statements = [db.prepare("INSERT INTO orders (id, tracking_code, customer_key, contact_name, contact_mobile_masked, destination, delivery_method, payment_method, payment_status, status, subtotal_paisa, discount_paisa, delivery_paisa, total_paisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'staging_not_captured', 'confirmed', ?, ?, ?, ?)").bind(orderId, trackingCode, identity.customerKey, name, maskMobile(mobile), destination, deliveryMethod, payment, cart.subtotal * 100, discount * 100, delivery * 100, total * 100)];
    for (const line of cart.items) statements.push(db.prepare("INSERT INTO order_items (id, order_id, product_slug, product_name_snapshot, sku_snapshot, batch_code_snapshot, quantity, unit_price_paisa, unit_landed_cost_paisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), orderId, line.product.slug, line.product.nameBn, line.product.sku, line.product.batchCode, line.quantity, line.product.price * 100, Math.round(line.product.price * .62) * 100));
    const openCart = await getOpenCart(db, identity.customerKey); statements.push(db.prepare("UPDATE carts SET status = 'checked_out', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(openCart.id)); await db.batch(statements);
    return withIdentityCookie({ order: { id: orderId, trackingCode, status: "confirmed", total, paymentStatus: "staging_not_captured" }, synthetic: true }, identity, 201);
  } catch (error) { return withIdentityCookie({ error: error instanceof Error ? error.message : "Order could not be created" }, identity, 500); }
}
