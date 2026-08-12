import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/AppShell";
import { ProductDetailClient } from "@/app/components/ProductDetailClient";
import { getPublicProduct } from "@/lib/catalog-repository";
import { toUiProduct } from "@/lib/catalog-ui";
import { isDemoMode } from "@/lib/runtime-mode";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (isDemoMode()) {
    const demo = await import("@/lib/data");
    const product = demo.getProduct(slug);
    return product ? { title: product.nameBn, description: product.description } : { title: "Product not found" };
  }
  const result = await getPublicProduct(slug);
  return result.data ? { title: result.data.nameBn, description: result.data.descriptionBn ?? result.data.descriptionEn ?? undefined } : { title: "Product not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isDemoMode()) {
    const demo = await import("@/lib/data");
    const product = demo.getProduct(slug);
    if (!product) notFound();
    return <AppShell><ProductDetailClient product={product} relatedProducts={demo.products.filter((candidate) => candidate.slug !== slug).slice(0, 3)} /></AppShell>;
  }
  const result = await getPublicProduct(slug);
  if (!result.data) notFound();
  return <AppShell><ProductDetailClient product={toUiProduct(result.data)} relatedProducts={result.data.related.map(toUiProduct)} /></AppShell>;
}
