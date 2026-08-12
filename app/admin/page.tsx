import type { Metadata } from "next";
import { getChatGPTUser } from "../chatgpt-auth";
import { AdminDashboard } from "../components/AdminDashboard";

export const metadata: Metadata = { title: "Business Control Room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await getChatGPTUser();
  return <AdminDashboard user={user ? { name: user.fullName ?? user.displayName, email: user.email } : null} />;
}
