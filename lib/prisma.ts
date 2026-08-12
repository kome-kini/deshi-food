import { assertProductionModeConfig, isDemoMode } from "./runtime-mode";

export type SqlRow = Record<string, unknown>;

export type PrismaLike = {
  $queryRawUnsafe<T extends SqlRow = SqlRow>(query: string, ...values: unknown[]): Promise<T[]>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
  $transaction<T>(callback: (tx: PrismaLike) => Promise<T>): Promise<T>;
  $disconnect(): Promise<void>;
};

let clientPromise: Promise<PrismaLike> | null = null;

/**
 * Prisma is loaded lazily so the Cloudflare Sites demo does not bundle the
 * native Node engine. DEMO_MODE=true never imports Prisma or reads Postgres.
 */
export async function getPrisma(): Promise<PrismaLike> {
  if (isDemoMode()) throw new Error("Postgres access is disabled while DEMO_MODE=true");
  assertProductionModeConfig();
  if (!clientPromise) {
    clientPromise = (async () => {
      const load = new Function("modulePath", "return import(modulePath)") as (modulePath: string) => Promise<{
        PrismaClient: new (options?: Record<string, unknown>) => PrismaLike;
      }>;
      const prismaModule = await load("@prisma/client");
      const client = new prismaModule.PrismaClient({ log: ["error"] });
      const marker = await client.$queryRawUnsafe<SqlRow>(`SELECT 1 FROM data_quality_issues WHERE rule_key = 'synthetic_seed_marker' AND status IN ('OPEN','ACKNOWLEDGED') LIMIT 1`);
      if (marker.length) {
        await client.$disconnect();
        throw new Error("Synthetic seed marker is present; production startup is blocked");
      }
      return client;
    })().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

export async function withPrisma<T>(callback: (db: PrismaLike) => Promise<T>): Promise<T> {
  const db = await getPrisma();
  return callback(db);
}
