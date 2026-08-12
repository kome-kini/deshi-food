import { AppShell } from "./components/AppShell";
import { HomeClient } from "./components/HomeClient";
import { loadUiCatalog } from "@/lib/catalog-ui-loader";

export const dynamic = "force-dynamic";

export default async function Home() {
  const catalog = await loadUiCatalog();
  return <AppShell><HomeClient products={catalog.products} categories={catalog.categories} /></AppShell>;
}
