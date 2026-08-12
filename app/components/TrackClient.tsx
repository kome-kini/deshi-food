"use client";

import Link from "./SafeLink";
import { useEffect, useState } from "react";
import { Check, MapPin, Package, Search, Truck } from "lucide-react";
import { formatBDT } from "@/lib/data";

type TrackResult = { trackingCode: string; status: string; total: number; placedAt: string; destination: string; eta: string; items: { name: string; quantity: number }[]; timeline: { label: string; detail: string; complete: boolean }[] };

export function TrackClient({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const search = async (value = code) => {
    const normalized = value.trim().toUpperCase(); if (!normalized) return;
    setLoading(true); setError("");
    const response = await fetch(`/api/orders/${encodeURIComponent(normalized)}`, { cache: "no-store" }).catch(() => null);
    if (!response) { setError("Tracking service unavailable"); setLoading(false); return; }
    const payload = await response.json() as { order?: TrackResult; error?: string };
    if (!response.ok || !payload.order) { setError(payload.error || "Record not found"); setResult(null); }
    else setResult(payload.order);
    setLoading(false);
  };
  useEffect(() => {
    if (!initialCode) return;
    const frame = window.requestAnimationFrame(() => { void search(initialCode); });
    return () => window.cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <main className="track-page">
      <section className="track-hero"><span className="eyebrow light">FROM US TO YOU</span><h1>আপনার অর্ডার,<br /><em>প্রতিটি ধাপে দৃশ্যমান।</em></h1><form onSubmit={(event) => { event.preventDefault(); void search(); }}><Search /><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="যেমন DJ-2026-1048" aria-label="Tracking code" /><button disabled={loading}>{loading ? "খোঁজা হচ্ছে…" : "ট্র্যাক করুন"}</button></form><p>Try demo code <button onClick={() => { setCode("DJ-2026-1048"); void search("DJ-2026-1048"); }}>DJ-2026-1048</button></p></section>
      <section className="section-shell track-result-wrap">
        {error && <div className="track-error"><Package /><h2>Record not found</h2><p>Public tracking code যাচাই করুন। Internal order বা batch ID অনুমান করা হবে না।</p></div>}
        {result && <div className="track-card">
          <div className="track-card-head"><div><small>ORDER</small><h2>{result.trackingCode}</h2><span>{result.placedAt}</span></div><div><span>{result.status}</span><strong>{formatBDT(result.total)}</strong></div></div>
          <div className="track-summary"><span><MapPin /><small>গন্তব্য</small><strong>{result.destination}</strong></span><span><Truck /><small>Estimated arrival</small><strong>{result.eta}</strong></span><span><Package /><small>পণ্য</small><strong>{result.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</strong></span></div>
          <div className="order-timeline">{result.timeline.map((event, index) => <div key={event.label} className={event.complete ? "complete" : ""}><span>{event.complete ? <Check /> : index + 1}</span><div><strong>{event.label}</strong><p>{event.detail}</p></div></div>)}</div>
          <div className="track-actions"><Link href="/account#orders">আমার অর্ডার</Link><Link href="/account#returns">সাপোর্ট প্রয়োজন?</Link></div>
        </div>}
        {!result && !error && <div className="track-placeholder"><span><Truck /></span><h2>Tracking code লিখুন</h2><p>Order status, delivery timeline ও destination summary এখানে দেখা যাবে।</p></div>}
      </section>
    </main>
  );
}
