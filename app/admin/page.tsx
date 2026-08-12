import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { AdminDashboard } from "../components/AdminDashboard";
import { isAdminActor } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Business Control Room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await getChatGPTUser();
  if (!user && (process.env.NODE_ENV === "production" || process.env.DESHIJAAT_ADMIN_USER_IDS)) redirect(chatGPTSignInPath("/admin"));
  if (user && !isAdminActor(user.userId)) redirect("/");
  return <AdminDashboard user={user ? { name: user.fullName ?? user.displayName, email: user.email } : null} />;
}
