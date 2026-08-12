import { assertAdmin, ensureRuntimeSchema, getD1 } from "@/db/runtime";
import { isDemoMode } from "@/lib/runtime-mode";

export async function GET(request: Request, { params }: { params: Promise<{ module: string }> }) {
  if (!isDemoMode()) return Response.json({ error: { code: "DEPENDENCY_UNAVAILABLE", message: "Live analytics tables are not enabled in Phase 1." } }, { status: 503, headers: { "cache-control": "private, no-store" } });
  try {
    const { analyticsSeed } = await import("@/lib/data");
    assertAdmin(request); const { module } = await params; const db = getD1(); await ensureRuntimeSchema(db);
    const allowed: Record<string, unknown> = {
      "products-performance": analyticsSeed.productPerformance, "inventory-alerts": analyticsSeed.productPerformance.filter((item) => item.cover < 7),
      "sales-timeseries": analyticsSeed.revenue, "customers-rfm": analyticsSeed.rfm, "customers-cohorts": analyticsSeed.cohorts,
      "marketing-channels": analyticsSeed.channels, "marketing-funnel": analyticsSeed.funnel, experiments: { running: 2, exposures: 8160 },
      recommendations: analyticsSeed.recommendations, "data-quality": { freshness: analyticsSeed.meta.freshness, reconciliation: "healthy", eventCoverage: 97.8 },
    };
    if (!(module in allowed)) return Response.json({ error: "Analytics module not found" }, { status: 404 });
    return Response.json({ module, data: allowed[module], source: "d1-snapshot", synthetic: true });
  } catch (error) { return error instanceof Response ? error : Response.json({ error: "Analytics unavailable" }, { status: 500 }); }
}
