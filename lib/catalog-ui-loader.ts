import { listCatalogProducts } from "./catalog-repository";
import { toUiProduct } from "./catalog-ui";
import { isDemoMode } from "./runtime-mode";
import type { Product } from "./product-types";

export type UiCategory = { name: string; en: string; icon?: string; count?: number };

export async function loadUiCatalog(): Promise<{ products: Product[]; categories: UiCategory[]; divisions: string[]; synthetic: boolean }> {
  if (isDemoMode()) {
    const demo = await import("./data");
    return { products: demo.products, categories: demo.categories, divisions: demo.divisions, synthetic: true };
  }
  const result = await listCatalogProducts({ limit: 100, sort: "featured" });
  const products = result.items.map(toUiProduct);
  const categories = [...new Map(result.items.map((item) => [item.category.slug, { name: item.category.nameBn, en: item.category.nameEn }])).values()];
  const divisions = [...new Set(result.items.map((item) => item.region).filter((value): value is string => Boolean(value)))];
  return { products, categories, divisions, synthetic: false };
}

