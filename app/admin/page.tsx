import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { isAdminActor } from "@/lib/admin-auth";
import { isDemoMode } from "@/lib/runtime-mode";

export const metadata: Metadata = { title: "Business Control Room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await getChatGPTUser();
  if (!user && (process.env.NODE_ENV === "production" || process.env.DESHIJAAT_ADMIN_USER_IDS)) redirect(chatGPTSignInPath("/admin"));
  if (user && !isAdminActor(user.userId)) redirect("/");
  if (isDemoMode()) {
    const { AdminDashboard } = await import("../components/AdminDashboard");
    return <AdminDashboard user={user ? { name: user.fullName ?? user.displayName, email: user.email } : null} />;
  }
  return <main style={{ minHeight: "60vh", padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}><p>DESHIJAAT Control Room</p><h1>Production analytics is being connected to curated metric tables.</h1><p>Catalog operations are available through the RBAC-protected admin API. Synthetic dashboard snapshots are disabled when DEMO_MODE=false.</p></main>;
}
