import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import { AppShell } from "../components/AppShell";
import { CatalogClient } from "../components/CatalogClient";
import { listCatalogProducts, type CatalogFilters } from "@/lib/catalog-repository";
import { toUiProduct } from "@/lib/catalog-ui";
import { isDemoMode } from "@/lib/runtime-mode";

export const metadata: Metadata = { title: "দেশি বাজার", description: "Bangla-first catalog with regional discovery and evidence-aware traceability." };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const text = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  if (isDemoMode()) {
    const demo = await import("@/lib/data");
    return <AppShell><CatalogClient products={demo.products} categories={demo.categories} divisions={demo.divisions} synthetic initialQuery={text("q")} initialCategory={text("category")} initialRegion={text("region")} initialTrace={text("trace") === "1"} /></AppShell>;
  }
  const filters: CatalogFilters = { q: text("q") || undefined, category: text("category") || undefined, region: text("region") || undefined, sort: (text("sort") as CatalogFilters["sort"]) || "featured", limit: 100 };
  const result = await listCatalogProducts(filters);
  const products = result.items.map(toUiProduct);
  const categories = [...new Map(result.items.map((item) => [item.category.slug, { name: item.category.nameBn, en: item.category.nameEn }])).values()];
  const divisions = [...new Set(result.items.map((item) => item.region).filter((value): value is string => Boolean(value)))];
  return <AppShell><CatalogClient products={products} categories={categories} divisions={divisions} initialQuery={text("q")} initialCategory={text("category")} initialRegion={text("region")} initialTrace={text("trace") === "1"} /></AppShell>;
}
