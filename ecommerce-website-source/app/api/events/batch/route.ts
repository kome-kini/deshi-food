import { ensureRuntimeSchema, getD1, requestIdentity } from "@/db/runtime";

const allowedEvents = new Set(["page_view", "search_submitted", "search_result_clicked", "zero_result", "product_view", "trace_scan", "trace_view", "add_cart", "remove_cart", "begin_checkout", "coupon_applied", "coupon_rejected", "experiment_exposed"]);

export async function POST(request: Request) {
  try {
    const identity = requestIdentity(request); const payload = await request.json() as { events?: { eventId?: string; name?: string; anonymousId?: string; sessionId?: string; entityType?: string; entityId?: string; properties?: Record<string, unknown>; occurredAt?: string }[] };
    if (!Array.isArray(payload.events) || payload.events.length === 0 || payload.events.length > 50) return Response.json({ error: "1–50 events required" }, { status: 400 });
    const db = getD1(); await ensureRuntimeSchema(db); const statements: D1PreparedStatement[] = [];
    for (const event of payload.events) {
      if (!event.name || !allowedEvents.has(event.name)) return Response.json({ error: `Unsupported event: ${event.name ?? "missing"}` }, { status: 400 });
      const occurredAt = event.occurredAt && !Number.isNaN(Date.parse(event.occurredAt)) ? event.occurredAt : new Date().toISOString();
      statements.push(db.prepare("INSERT OR IGNORE INTO events (event_id, event_name, anonymous_id, session_id, user_key, entity_type, entity_id, properties_json, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(event.eventId || crypto.randomUUID(), event.name, event.anonymousId || null, event.sessionId || null, identity.customerKey, event.entityType || null, event.entityId || null, JSON.stringify(event.properties || {}).slice(0, 10000), occurredAt));
    }
    await db.batch(statements); return Response.json({ accepted: statements.length }, { status: 202 });
  } catch { return Response.json({ error: "Event batch rejected" }, { status: 400 }); }
}
