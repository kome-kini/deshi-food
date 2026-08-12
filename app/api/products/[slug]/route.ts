import { getProduct } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? Response.json({ product, synthetic: true }) : Response.json({ error: "Product not found" }, { status: 404 });
}
