import type { Metadata } from "next";
import { getChatGPTUser } from "../chatgpt-auth";
import { AppShell } from "../components/AppShell";
import { AccountClient } from "../components/AccountClient";

export const metadata: Metadata = { title: "আমার দেশিজাত" };
export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const user = await getChatGPTUser();
  return <AppShell><AccountClient user={user ? { name: user.fullName, email: user.email } : null} /></AppShell>;
}
