import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { CheckoutClient } from "../components/CheckoutClient";
import { loadUiCatalog } from "@/lib/catalog-ui-loader";

export const metadata: Metadata = { title: "Secure checkout" };
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ coupon?: string | string[] }> }) {
  const params = await searchParams;
  const coupon = Array.isArray(params.coupon) ? params.coupon[0] ?? "" : params.coupon ?? "";
  const catalog = await loadUiCatalog();
  return <AppShell footer={false}><CheckoutClient divisions={catalog.divisions} initialCoupon={coupon} /></AppShell>;
}
