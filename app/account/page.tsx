import type { Metadata } from "next";
import { getChatGPTUser } from "../chatgpt-auth";
import { AppShell } from "../components/AppShell";
import { AccountClient } from "../components/AccountClient";
import { loadUiCatalog } from "@/lib/catalog-ui-loader";

export const metadata: Metadata = { title: "আমার দেশিজাত" };
export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const user = await getChatGPTUser();
  const catalog = await loadUiCatalog();
  return <AppShell><AccountClient products={catalog.products} user={user ? { name: user.fullName, email: user.email } : null} /></AppShell>;
}
