import { handleProductDetail } from "@/lib/catalog-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return handleProductDetail(request, slug);
}
