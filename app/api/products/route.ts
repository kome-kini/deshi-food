import { products } from "@/lib/data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLocaleLowerCase("bn");
  const category = url.searchParams.get("category") ?? "";
  const region = url.searchParams.get("region") ?? "";
  const filtered = products.filter((product) => {
    const searchable = `${product.nameBn} ${product.nameEn} ${product.sku} ${product.category} ${product.region} ${product.district}`.toLocaleLowerCase("bn");
    return (!q || searchable.includes(q)) && (!category || product.category === category) && (!region || product.region === region);
  });
  return Response.json({ products: filtered, synthetic: true }, { headers: { "cache-control": "public, max-age=60" } });
}
