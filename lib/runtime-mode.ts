/** Runtime switches are deliberately server-only. Never expose DEMO_MODE to the browser. */
export function isDemoMode(): boolean {
  // Local development remains safe and runnable without a secret file. Any
  // production runtime must set DEMO_MODE explicitly; an omitted value there
  // is treated as production, never as a demo fallback.
  return process.env.DEMO_MODE === "true" || (process.env.DEMO_MODE === undefined && process.env.NODE_ENV !== "production");
}

export function assertProductionModeConfig(): void {
  if (isDemoMode()) return;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when DEMO_MODE=false");
  }
  if (process.env.SYNTHETIC_SEED_MARKER === "true") {
    throw new Error("Synthetic seed marker is enabled; production startup is blocked");
  }
}

export function requireDatabaseConfig(): void {
  assertProductionModeConfig();
  if (isDemoMode()) return;
  if (!process.env.TOKEN_HASH_SECRET) {
    throw new Error("TOKEN_HASH_SECRET is required for public trace lookups");
  }
}
