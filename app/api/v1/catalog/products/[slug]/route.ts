import { handleProductDetail } from "@/lib/catalog-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  return handleProductDetail(request, slug);
}

