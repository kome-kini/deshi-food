import { analyticsSeed } from "@/lib/data";
import { assertAdmin, ensureRuntimeSchema, getD1 } from "@/db/runtime";

export async function GET(request: Request) {
  try {
    assertAdmin(request); const db = getD1(); await ensureRuntimeSchema(db);
    const row = await db.prepare("SELECT payload_json FROM analytics_snapshots WHERE snapshot_type = ? ORDER BY period_end DESC LIMIT 1").bind("overview_30d").first<{ payload_json: string }>();
    return Response.json({ analytics: row ? JSON.parse(row.payload_json) : analyticsSeed, source: row ? "d1" : "seed-preview" }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) { if (error instanceof Response) return error; return Response.json({ analytics: analyticsSeed, source: "seed-preview" }); }
}
