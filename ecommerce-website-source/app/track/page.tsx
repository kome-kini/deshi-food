import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { TrackClient } from "../components/TrackClient";

export const metadata: Metadata = { title: "অর্ডার ট্র্যাক" };
export default async function TrackPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams; const code = typeof params.code === "string" ? params.code : "";
  return <AppShell><TrackClient initialCode={code} /></AppShell>;
}
