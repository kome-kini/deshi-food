export function isAdminActor(actor: string | null) {
  if (!actor) return false;
  const configured = (process.env.DESHIJAAT_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!configured.length) return process.env.NODE_ENV !== "production";
  return configured.includes(actor);
}
