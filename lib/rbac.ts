import { jsonError } from "./api-contract";
import { isDemoMode } from "./runtime-mode";
import { withPrisma } from "./prisma";

export type AdminActor = { subject: string; userId: string | null; permission: string };

function subjectFromRequest(request: Request): string | null {
  // Phase 1 accepts only the server-injected identity used by the existing
  // Sites deployment. Supabase JWT/session verification is Phase 2 and will
  // be added without changing the permission contract.
  return request.headers.get("oai-authenticated-user-id")?.trim() || null;
}

function allowlisted(subject: string): boolean {
  const ids = (process.env.DESHIJAAT_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return ids.includes(subject);
}

export async function authorizeAdmin(request: Request, permission: string): Promise<AdminActor | Response> {
  const subject = subjectFromRequest(request);
  if (!subject) return jsonError(request, 401, "UNAUTHORIZED", "A verified staff session is required.");

  if (allowlisted(subject)) return { subject, userId: null, permission };
  if (isDemoMode()) return jsonError(request, 403, "FORBIDDEN", "The current account is not allowlisted for admin access.");

  try {
    return await withPrisma(async (db) => {
      const rows = await db.$queryRawUnsafe<Record<string, unknown>>(`
        SELECT u.id AS user_id, p.key AS permission_key
        FROM users u
        JOIN user_identities ui ON ui.user_id = u.id
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        JOIN role_permissions rp ON rp.role_id = r.id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ui.provider_subject = $1 AND u.status = 'ACTIVE'
          AND (ur.expires_at IS NULL OR ur.expires_at > now()) AND p.key = $2
        LIMIT 1
      `, subject, permission);
      const row = rows[0];
      if (!row) return jsonError(request, 403, "FORBIDDEN", "The current account lacks the required permission.");
      return { subject, userId: row.user_id ? String(row.user_id) : null, permission };
    });
  } catch {
    return jsonError(request, 503, "DEPENDENCY_UNAVAILABLE", "Authorization service is unavailable.");
  }
}

export function isResponse(value: AdminActor | Response): value is Response {
  return value instanceof Response;
}
