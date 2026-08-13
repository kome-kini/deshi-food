"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("DESHIJAAT page render failed", error);
  }, [error]);

  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f7f1e5" }}>
      <section style={{ maxWidth: 560, padding: "2rem", border: "1px solid #d9cfbb", background: "#fff", textAlign: "center" }}>
        <p style={{ color: "#a45132", fontWeight: 700 }}>DESHIJAAT</p>
        <h1>পাতাটি লোড করা যায়নি</h1>
        <p>একটি সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>
        <button type="button" onClick={reset} style={{ border: 0, borderRadius: 999, padding: "0.75rem 1.25rem", background: "#17372b", color: "#fff", fontWeight: 700 }}>
          আবার চেষ্টা করুন
        </button>
        {error.digest ? <p style={{ marginTop: "1rem", color: "#6d716d", fontSize: 12 }}>Reference: {error.digest}</p> : null}
      </section>
    </main>
  );
}
