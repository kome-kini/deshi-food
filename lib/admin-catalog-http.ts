import { etag, jsonData, jsonError, jsonCollection } from "./api-contract";
import { authorizeAdmin, isResponse } from "./rbac";
import { createAdminPrice, createAdminProduct, createAdminVariant, listAdminProducts, publishAdminProduct, updateAdminProduct } from "./catalog-repository";

async function body(request: Request): Promise<Record<string, unknown>> {
  const value: unknown = await request.json();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("JSON object required");
  return value as Record<string, unknown>;
}

function failure(request: Request, error: unknown): Response {
  if (!(error instanceof Error)) return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Catalog service is temporarily unavailable.");
  if (error.message === "PRODUCT_NOT_FOUND" || error.message === "VARIANT_NOT_FOUND") return jsonError(request, 404, "NOT_FOUND", "The requested catalog record was not found.");
  if (error.message === "ETAG_MISMATCH") return jsonError(request, 412, "PRECONDITION_FAILED", "The record changed; refresh it before updating.");
  if (error.message === "PUBLISH_GATE_FAILED") return jsonError(request, 409, "PUBLISH_GATE_FAILED", "The product does not satisfy the publication gate.", (error as Error & { details?: string[] }).details ? { failedChecks: (error as Error & { details?: string[] }).details } : undefined);
  if (error.message.startsWith("Missing ") || error.message.includes("Invalid ") || error.message.includes("No editable") || error.message.includes("JSON object")) return jsonError(request, 400, "VALIDATION_ERROR", error.message);
  if (error.message.includes("DATABASE_URL") || error.message.includes("Synthetic seed marker")) return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Catalog database is not configured or is blocked by a synthetic seed marker.");
  return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Catalog service is temporarily unavailable.");
}

export async function handleAdminList(request: Request): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.read");
  if (isResponse(actor)) return actor;
  try {
    const url = new URL(request.url);
    const result = await listAdminProducts({ q: url.searchParams.get("q") ?? undefined, status: url.searchParams.get("status") ?? undefined, after: url.searchParams.get("after") ?? undefined, limit: Number(url.searchParams.get("limit") ?? "24") });
    return jsonCollection(result.items, { nextCursor: result.nextCursor, hasMore: result.hasMore });
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleAdminCreate(request: Request): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.write");
  if (isResponse(actor)) return actor;
  try {
    const result = await createAdminProduct(await body(request), actor.subject, request);
    const response = jsonData(result, { status: 201 });
    response.headers.set("etag", etag(String(result.id)));
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleAdminUpdate(request: Request, id: string): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.write");
  if (isResponse(actor)) return actor;
  try {
    const result = await updateAdminProduct(id, await body(request), actor.subject, request, request.headers.get("if-match"));
    if (!result) return jsonError(request, 404, "NOT_FOUND", "Product not found.");
    const response = jsonData(result);
    if (result.etag) response.headers.set("etag", String(result.etag));
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleAdminVariant(request: Request, productId: string): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.write");
  if (isResponse(actor)) return actor;
  try {
    const result = await createAdminVariant(productId, await body(request), actor.subject, request);
    const response = jsonData(result, { status: 201 });
    response.headers.set("etag", etag(String(result.id)));
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleAdminPrice(request: Request, variantId: string): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.write");
  if (isResponse(actor)) return actor;
  try {
    const result = await createAdminPrice(variantId, await body(request), actor.subject, request);
    const response = jsonData(result, { status: 201 });
    response.headers.set("etag", etag(String(result.id)));
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

export async function handleAdminPublish(request: Request, id: string): Promise<Response> {
  const actor = await authorizeAdmin(request, "admin.catalog.publish");
  if (isResponse(actor)) return actor;
  try {
    const result = await publishAdminProduct(id, actor.subject, request);
    const response = jsonData(result);
    if (result.etag) response.headers.set("etag", String(result.etag));
    return response;
  } catch (error) {
    return failure(request, error);
  }
}

