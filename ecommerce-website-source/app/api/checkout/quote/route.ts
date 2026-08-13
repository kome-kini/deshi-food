import { ensureRuntimeSchema, getD1, readCart, requestIdentity, withIdentityCookie } from "@/db/runtime";

export async function POST(request: Request) {
  const identity = requestIdentity(request);
  try {
    const payload = await request.json().catch(() => ({})) as { coupon?: string; delivery?: string };
    const db = getD1(); await ensureRuntimeSchema(db); const cart = await readCart(db, identity.customerKey);
    if (!cart.items.length) return withIdentityCookie({ error: "Cart is empty" }, identity, 400);
    const delivery = cart.subtotal >= 1499 ? 0 : payload.delivery === "express" ? 140 : 80;
    const code = (payload.coupon ?? "").trim().toUpperCase();
    const discount = code === "DESHI10" ? Math.min(Math.round(cart.subtotal * 0.1), 300) : code ? 0 : 0;
    return withIdentityCookie({ quote: { subtotal: cart.subtotal, delivery, discount, total: cart.subtotal + delivery - discount, coupon: code, couponStatus: code === "DESHI10" ? "accepted" : code ? "rejected" : "none", expiresInSeconds: 600 }, synthetic: true }, identity);
  } catch { return withIdentityCookie({ error: "Quote unavailable" }, identity, 500); }
}
