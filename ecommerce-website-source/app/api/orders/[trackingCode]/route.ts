import { ensureRuntimeSchema, getD1, requestIdentity } from "@/db/runtime";

export async function GET(request: Request, { params }: { params: Promise<{ trackingCode: string }> }) {
  try {
    const { trackingCode } = await params; const code = trackingCode.trim().toUpperCase();
    if (!/^DJ-2026-\d{4}$/.test(code)) return Response.json({ error: "Record not found" }, { status: 404 });
    const db = getD1(); await ensureRuntimeSchema(db);
    const identity = requestIdentity(request);
    const order = await db.prepare("SELECT tracking_code, customer_key, status, total_paisa, destination, created_at FROM orders WHERE tracking_code = ?").bind(code).first<{ tracking_code: string; customer_key: string; status: string; total_paisa: number; destination: string; created_at: string }>();
    if (!order) return Response.json({ error: "Record not found" }, { status: 404 });
    const isPublicSyntheticDemo = code === "DJ-2026-1048" && order.customer_key === "synthetic-customer";
    if (!isPublicSyntheticDemo && order.customer_key !== identity.customerKey) return Response.json({ error: "Record not found" }, { status: 404 });
    const items = await db.prepare("SELECT product_name_snapshot, quantity FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE orders.tracking_code = ?").bind(code).all<{ product_name_snapshot: string; quantity: number }>();
    const confirmed = true; const packed = ["packed", "in_transit", "delivered"].includes(order.status) || code === "DJ-2026-1048"; const moving = ["in_transit", "delivered"].includes(order.status); const delivered = order.status === "delivered";
    return Response.json({ order: { trackingCode: order.tracking_code, status: order.status === "in_transit" ? "In transit" : order.status[0].toUpperCase() + order.status.slice(1), total: order.total_paisa / 100, placedAt: new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(order.created_at)), destination: order.destination, eta: delivered ? "Delivered" : "১৩ আগস্ট • demo estimate", items: (items.results as { product_name_snapshot: string; quantity: number }[]).map((item) => ({ name: item.product_name_snapshot, quantity: item.quantity })), timeline: [{ label: "অর্ডার নিশ্চিত", detail: "Server-validated staging order created", complete: confirmed }, { label: "ব্যাচ বরাদ্দ ও প্যাকিং", detail: "Actual order item → batch snapshot recorded", complete: packed }, { label: "Courier-এ হস্তান্তর", detail: "Demo Dhaka fulfilment event", complete: moving }, { label: "ডেলিভারি", detail: delivered ? "Collected / settled" : "Customer confirmation pending", complete: delivered }] }, synthetic: true });
  } catch { return Response.json({ error: "Tracking unavailable" }, { status: 500 }); }
}
