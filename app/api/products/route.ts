import { handleCatalogList } from "@/lib/catalog-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleCatalogList(request);
}
