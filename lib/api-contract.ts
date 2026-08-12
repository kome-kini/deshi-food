export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "DEPENDENCY_UNAVAILABLE"
  | "PUBLISH_GATE_FAILED";

export function requestId(request: Request): string {
  return request.headers.get("x-request-id")?.slice(0, 80) || `req_${crypto.randomUUID()}`;
}

export function jsonError(
  request: Request,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return Response.json(
    { error: { code, message, requestId: requestId(request), ...(details ? { details } : {}) } },
    { status, headers: { "cache-control": "no-store" } },
  );
}

export function jsonData(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify({ data }), { ...init, headers });
}

export function jsonCollection(
  data: unknown[],
  page: { nextCursor: string | null; hasMore: boolean },
  init: ResponseInit = {},
): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "public, max-age=30, stale-while-revalidate=60");
  return new Response(JSON.stringify({ data, page }), { ...init, headers });
}

export function etag(value: string): string {
  return `"${value.replace(/[^a-zA-Z0-9._:-]/g, "_")}"`;
}

