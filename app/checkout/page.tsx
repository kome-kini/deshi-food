import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { CheckoutClient } from "../components/CheckoutClient";

export const metadata: Metadata = { title: "Secure checkout" };
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ coupon?: string | string[] }> }) {
  const params = await searchParams;
  const coupon = Array.isArray(params.coupon) ? params.coupon[0] ?? "" : params.coupon ?? "";
  return <AppShell footer={false}><CheckoutClient initialCoupon={coupon} /></AppShell>;
}
