import type { PublicCatalogProduct, PublicProductDetail } from "./catalog-repository";
import type { Product } from "./product-types";

function money(minor: string | null | undefined): number {
  const value = Number(minor ?? 0);
  return Number.isFinite(value) ? value / 100 : 0;
}

export function toUiProduct(product: PublicCatalogProduct | PublicProductDetail): Product {
  const detail = "variants" in product ? product : null;
  const variant = detail?.variants.find((candidate) => candidate.price) ?? detail?.variants[0];
  const image = product.media[0]?.url || "/media/rice.jpg";
  return {
    id: product.id,
    slug: product.slug,
    sku: variant?.sku ?? product.productCode,
    nameBn: product.nameBn,
    nameEn: product.nameEn,
    category: product.category.nameBn,
    region: product.region ?? "Pending verification",
    district: product.district ?? "Pending verification",
    price: money(variant?.price?.amountMinor ?? product.fromPrice?.amountMinor),
    compareAt: variant?.price?.compareAtAmountMinor ? money(variant.price.compareAtAmountMinor) : undefined,
    pack: variant?.label ?? "Pack size pending",
    stock: Math.max(0, Math.floor(Number(variant?.availableQuantity ?? product.availableQuantity))),
    rating: product.rating ?? 0,
    reviews: product.reviewCount,
    image,
    accent: "#c79a52",
    provenance: product.verification.origin === "VERIFIED" ? "verified-demo" : "pending",
    badge: product.featured ? "Featured" : undefined,
    description: detail?.descriptionBn ?? product.shortDescriptionBn ?? product.shortDescriptionEn ?? "",
    story: detail?.provenance[0]?.location ?? "Pending verification",
    ingredients: detail?.ingredients.map((item) => item.name).join(", ") ?? "",
    storage: detail?.storageInstructions ?? "Storage instructions pending",
    shelfLife: detail?.shelfLifeDays ? `${detail.shelfLifeDays} days` : "Shelf life pending",
    batchCode: "Public trace token pending",
    trace: detail?.provenance.map((source) => ({ label: "Source", value: source.location, detail: source.status })) ?? [],
  };
}

