import { jsonCollection, jsonData, jsonError } from "./api-contract";
import { getPublicProduct, getSearchSuggestions, getTraceRecord, listCatalogProducts, type CatalogFilters } from "./catalog-repository";

function booleanParam(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return undefined;
}

export function catalogFilters(url: URL): CatalogFilters {
  const sort = url.searchParams.get("sort");
  const acceptedSort = ["featured", "popular", "newest", "price_asc", "price_desc"].includes(sort ?? "")
    ? sort as CatalogFilters["sort"]
    : undefined;
  const limitValue = Number(url.searchParams.get("limit") ?? "24");
  return {
    q: url.searchParams.get("q")?.trim() || undefined,
    category: url.searchParams.get("category") || undefined,
    region: url.searchParams.get("region") || undefined,
    district: url.searchParams.get("district") || undefined,
    producer: url.searchParams.get("producer") || undefined,
    processing: url.searchParams.get("processing") || undefined,
    packSize: url.searchParams.get("packSize") || undefined,
    minPriceMinor: url.searchParams.get("minPriceMinor") || undefined,
    maxPriceMinor: url.searchParams.get("maxPriceMinor") || undefined,
    originStatus: url.searchParams.get("originStatus") || undefined,
    inStock: booleanParam(url.searchParams.get("inStock")),
    codAvailable: booleanParam(url.searchParams.get("codAvailable")),
    rating: url.searchParams.get("rating") || undefined,
    sort: acceptedSort,
    limit: Number.isFinite(limitValue) ? limitValue : 24,
    after: url.searchParams.get("after") || undefined,
  };
}

function failure(request: Request, error: unknown): Response {
  if (error instanceof Error && error.message === "Invalid catalog cursor") return jsonError(request, 400, "VALIDATION_ERROR", "The catalog cursor is invalid.");
  if (error instanceof Error && error.message.includes("required when DEMO_MODE")) return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Catalog database is not configured.");
  if (error instanceof Error && error.message.includes("Synthetic seed marker")) return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Production startup is blocked by the synthetic seed marker.");
  return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Catalog service is temporarily unavailable.");
}

export async function handleCatalogList(request: Request): Promise<Response> {
  try {
    const result = await listCatalogProducts(catalogFilters(new URL(request.url)));
    const response = jsonCollection(result.items, { nextCursor: result.nextCursor, hasMore: result.hasMore });
    if (result.synthetic) response.headers.set("x-data-source", "demo");
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleProductDetail(request: Request, slug: string): Promise<Response> {
  try {
    const result = await getPublicProduct(slug);
    if (!result.data) return jsonError(request, 404, "NOT_FOUND", "Product not found.");
    const response = jsonData(result.data);
    if (result.synthetic) response.headers.set("x-data-source", "demo");
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleSuggestions(request: Request): Promise<Response> {
  try {
    const result = await getSearchSuggestions(new URL(request.url).searchParams.get("q") ?? "");
    return jsonData(result);
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleTrace(request: Request, publicToken: string): Promise<Response> {
  try {
    const result = await getTraceRecord(publicToken);
    if (!result) return jsonError(request, 404, "NOT_FOUND", "Trace record not found.");
    return jsonData(result);
  } catch (error) {
    return failure(request, error);
  }
}

