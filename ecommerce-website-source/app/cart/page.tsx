import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { CartClient } from "../components/CartClient";

export const metadata: Metadata = { title: "আপনার কার্ট" };
export default function CartPage() { return <AppShell><CartClient /></AppShell>; }
