import { handleAdminCreate, handleAdminList } from "@/lib/admin-catalog-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) { return handleAdminList(request); }
export async function POST(request: Request) { return handleAdminCreate(request); }

