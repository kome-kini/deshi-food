import { handleAdminUpdate } from "@/lib/admin-catalog-http";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return handleAdminUpdate(request, id);
}

