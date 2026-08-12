import { assertAdmin, ensureRuntimeSchema, getD1 } from "@/db/runtime";
import { isDemoMode } from "@/lib/runtime-mode";

export async function GET(request: Request) {
  if (!isDemoMode()) return Response.json({ error: { code: "DEPENDENCY_UNAVAILABLE", message: "Live analytics tables are not enabled in Phase 1." } }, { status: 503, headers: { "cache-control": "private, no-store" } });
  try {
    const { analyticsSeed } = await import("@/lib/data");
    assertAdmin(request); const db = getD1(); await ensureRuntimeSchema(db);
    const row = await db.prepare("SELECT payload_json FROM analytics_snapshots WHERE snapshot_type = ? ORDER BY period_end DESC LIMIT 1").bind("overview_30d").first<{ payload_json: string }>();
    return Response.json({ analytics: row ? JSON.parse(row.payload_json) : analyticsSeed, source: row ? "d1" : "seed-preview" }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) { if (error instanceof Response) return error; return Response.json({ error: { code: "DEPENDENCY_UNAVAILABLE", message: "Analytics unavailable" } }, { status: 503, headers: { "cache-control": "private, no-store" } }); }
}
