import { assertAdmin, ensureRuntimeSchema, getD1 } from "@/db/runtime";

export async function POST(request: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  try {
    const actor = assertAdmin(request); const { id, action } = await params;
    if (!['accept', 'dismiss'].includes(action)) return Response.json({ error: "Invalid action" }, { status: 400 });
    const db = getD1(); await ensureRuntimeSchema(db); const recommendation = await db.prepare("SELECT id FROM recommendations WHERE id = ?").bind(id).first<{ id: string }>();
    if (!recommendation) return Response.json({ error: "Recommendation not found" }, { status: 404 });
    await db.batch([db.prepare("INSERT INTO recommendation_actions (id, recommendation_id, actor_key, action) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), id, actor, action), db.prepare("UPDATE recommendations SET status = ? WHERE id = ?").bind(action === "accept" ? "review_queued" : "dismissed", id), db.prepare("INSERT INTO audit_logs (id, actor_key, action, entity_type, entity_id, metadata_json) VALUES (?, ?, ?, 'recommendation', ?, ?)").bind(crypto.randomUUID(), actor, `recommendation.${action}`, id, JSON.stringify({ source: "admin-control-room", synthetic: true }))]);
    return Response.json({ id, action, status: action === "accept" ? "review_queued" : "dismissed" });
  } catch (error) { return error instanceof Response ? error : Response.json({ error: "Action failed" }, { status: 500 }); }
}
