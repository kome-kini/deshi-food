import { handleTrace } from "@/lib/catalog-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ publicToken: string }> }) {
  const { publicToken } = await context.params;
  return handleTrace(request, publicToken);
}

