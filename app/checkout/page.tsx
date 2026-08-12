import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { CheckoutClient } from "../components/CheckoutClient";

export const metadata: Metadata = { title: "Secure checkout" };
export default function CheckoutPage() { return <AppShell footer={false}><CheckoutClient /></AppShell>; }
