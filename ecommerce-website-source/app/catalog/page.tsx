import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { CatalogClient } from "../components/CatalogClient";

export const metadata: Metadata = { title: "দেশি বাজার", description: "Bangla-first catalog with regional discovery and evidence-aware traceability." };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const text = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  return <AppShell><CatalogClient initialQuery={text("q")} initialCategory={text("category")} initialRegion={text("region")} initialTrace={text("trace") === "1"} /></AppShell>;
}
