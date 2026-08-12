"use client";

import Link from "./SafeLink";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Landmark, PackageCheck, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { formatBDT } from "@/lib/format";
import { useCart } from "./CartProvider";

const steps = ["যোগাযোগ", "ঠিকানা", "ডেলিভারি", "পেমেন্ট", "রিভিউ"];
const initialForm = { name: "", mobile: "", email: "", division: "ঢাকা", district: "", upazila: "", area: "", address: "", landmark: "", delivery: "standard", payment: "cod" };

export function CheckoutClient({ divisions, initialCoupon = "" }: { divisions: string[]; initialCoupon?: string }) {
  const { lines, subtotal, refresh, loading } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [coupon, setCoupon] = useState(initialCoupon);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ trackingCode: string; total: number } | null>(null);
  const delivery = subtotal >= 1499 ? 0 : form.delivery === "express" ? 140 : 80;
  const discount = coupon.trim().toUpperCase() === "DESHI10" ? Math.min(Math.round(subtotal * 0.1), 300) : 0;
  const total = subtotal + delivery - discount;
  const canContinue = useMemo(() => {
    if (step === 0) return form.name.trim().length > 1 && /^01\d{9}$/.test(form.mobile.replace(/\s/g, "")) && (!form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));
    if (step === 1) return Boolean(form.district.trim() && form.upazila.trim() && form.address.trim().length > 5);
    return true;
  }, [step, form]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const placeOrder = async () => {
    setPlacing(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contact: { name: form.name, mobile: form.mobile, email: form.email }, address: { division: form.division, district: form.district, upazila: form.upazila, area: form.area, address: form.address, landmark: form.landmark }, delivery: form.delivery, payment: form.payment, coupon }) });
      const payload = await response.json() as { order?: { trackingCode: string; total: number }; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error || "Order could not be created");
      setOrder(payload.order); await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Order could not be created"); }
    finally { setPlacing(false); }
  };

  if (order) return <main className="checkout-page"><div className="order-success"><span><PackageCheck /></span><small>ডেমো অর্ডার নিশ্চিত</small><h1>ধন্যবাদ, {form.name}!</h1><p>আপনার staging order securely recorded হয়েছে। কোনো payment capture করা হয়নি।</p><div><small>Tracking code</small><strong>{order.trackingCode}</strong><span>{formatBDT(order.total)}</span></div><Link className="button button-dark" href={`/track?code=${order.trackingCode}`}>অর্ডার ট্র্যাক করুন <ArrowRight /></Link><Link href="/catalog">বাজারে ফিরুন</Link></div></main>;
  if (loading) return <main className="checkout-page"><div className="cart-loading">Checkout প্রস্তুত হচ্ছে…</div></main>;
  if (!lines.length) return <main className="checkout-page"><div className="empty-cart"><h1>Checkout-এর জন্য কার্ট খালি</h1><Link className="button button-dark" href="/catalog">পণ্য বেছে নিন</Link></div></main>;
  return (
    <main className="checkout-page">
      <div className="checkout-shell">
        <section className="checkout-flow">
          <Link href="/cart" className="back-link"><ArrowLeft /> কার্টে ফিরুন</Link>
          <div className="checkout-head"><span className="eyebrow">SECURE STAGING CHECKOUT</span><h1>অর্ডার সম্পন্ন করুন</h1><p>Production-এ payment intent, webhook ও inventory reservation server-side হবে।</p></div>
          <div className="checkout-steps">{steps.map((label, index) => <button key={label} onClick={() => index < step && setStep(index)} className={index === step ? "active" : index < step ? "done" : ""}><span>{index < step ? <Check /> : index + 1}</span>{label}</button>)}</div>
          <div className="checkout-panel">
            {step === 0 && <div className="form-section"><h2>যোগাযোগের তথ্য</h2><div className="form-grid"><label className="full">নাম<input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="আপনার পূর্ণ নাম" /></label><label>মোবাইল<input inputMode="tel" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="01XXXXXXXXX" /></label><label>ইমেইল <small>(ঐচ্ছিক)</small><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@example.com" /></label></div><p className="field-help">Order update-এর জন্য। PIN, OTP বা card secret কখনো চাওয়া হবে না।</p></div>}
            {step === 1 && <div className="form-section"><h2>ডেলিভারি ঠিকানা</h2><div className="form-grid"><label>বিভাগ<select value={form.division} onChange={(e) => update("division", e.target.value)}>{divisions.map((division) => <option key={division}>{division}</option>)}</select></label><label>জেলা<input value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="যেমন: ঢাকা" /></label><label>থানা / উপজেলা<input value={form.upazila} onChange={(e) => update("upazila", e.target.value)} /></label><label>এলাকা<input value={form.area} onChange={(e) => update("area", e.target.value)} /></label><label className="full">বিস্তারিত ঠিকানা<textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={3} /></label><label className="full">Landmark <small>(ঐচ্ছিক)</small><input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} /></label></div></div>}
            {step === 2 && <div className="choice-section"><h2>ডেলিভারি পদ্ধতি</h2><label className={form.delivery === "standard" ? "selected" : ""}><input type="radio" name="delivery" checked={form.delivery === "standard"} onChange={() => update("delivery", "standard")} /><Truck /><span><strong>Standard delivery</strong><small>ঢাকা ১–২ দিন • courier-confirmed staging estimate</small></span><b>{subtotal >= 1499 ? "Free" : "৳৮০"}</b></label><label className={form.delivery === "express" ? "selected" : ""}><input type="radio" name="delivery" checked={form.delivery === "express"} onChange={() => update("delivery", "express")} /><PackageCheck /><span><strong>Express delivery</strong><small>Same/next day • serviceability check required</small></span><b>{subtotal >= 1499 ? "Free" : "৳১৪০"}</b></label></div>}
            {step === 3 && <div className="choice-section payment-section"><h2>পেমেন্ট পদ্ধতি</h2><p className="staging-payment-note">Staging only—কোনো gateway live নয় এবং কোনো অর্থ নেওয়া হবে না।</p>{[["cod", "Cash on delivery", Truck], ["bkash", "bKash", Smartphone], ["nagad", "Nagad", Smartphone], ["rocket", "Rocket", Smartphone], ["card", "Card / bank (Stripe-ready adapter)", CreditCard]].map(([value, label, Icon]) => <label key={value as string} className={form.payment === value ? "selected" : ""}><input type="radio" name="payment" checked={form.payment === value} onChange={() => update("payment", value as string)} /><Icon /><span><strong>{label as string}</strong><small>{value === "cod" ? "Recognize revenue on delivered/collected" : "Verified webhook required in production"}</small></span></label>)}</div>}
            {step === 4 && <div className="review-section"><h2>অর্ডার রিভিউ</h2><div className="review-block"><span><b>যোগাযোগ</b><button onClick={() => setStep(0)}>Edit</button></span><p>{form.name} · {form.mobile}{form.email ? ` · ${form.email}` : ""}</p></div><div className="review-block"><span><b>ঠিকানা</b><button onClick={() => setStep(1)}>Edit</button></span><p>{form.address}, {form.area}, {form.upazila}, {form.district}, {form.division}</p></div><div className="review-block"><span><b>Delivery & payment</b><button onClick={() => setStep(2)}>Edit</button></span><p>{form.delivery} · {form.payment.toUpperCase()}</p></div><div className="review-items">{lines.map(({ product, quantity }) => <div key={product.slug}><span>{quantity} × {product.nameBn}</span><strong>{formatBDT(product.price * quantity)}</strong></div>)}</div><label className="coupon-review">Coupon<div><input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="DESHI10" /><span>{discount > 0 ? `−${formatBDT(discount)}` : "Server validated"}</span></div></label>{error && <p className="checkout-error">{error}</p>}</div>}
          </div>
          <div className="checkout-nav">{step > 0 && <button onClick={() => setStep((value) => value - 1)}><ArrowLeft /> পেছনে</button>}{step < 4 ? <button disabled={!canContinue} className="continue-button" onClick={() => setStep((value) => value + 1)}>চালিয়ে যান <ArrowRight /></button> : <button className="place-order-button" disabled={placing} onClick={() => void placeOrder()}>{placing ? "নিরাপদে সংরক্ষণ হচ্ছে…" : "Demo order দিন"} <ShieldCheck /></button>}</div>
        </section>
        <aside className="checkout-summary"><h2>আপনার অর্ডার</h2>{lines.map(({ product, quantity }) => <div className="checkout-line" key={product.slug}><span>{quantity}</span><p>{product.nameBn}<small>{product.pack}</small></p><strong>{formatBDT(product.price * quantity)}</strong></div>)}<hr /><div><span>Subtotal</span><strong>{formatBDT(subtotal)}</strong></div><div><span>Delivery</span><strong>{delivery ? formatBDT(delivery) : "Free"}</strong></div><div><span>Discount</span><strong>−{formatBDT(discount)}</strong></div><div className="checkout-total"><span>মোট</span><strong>{formatBDT(total)}</strong></div><p><Landmark /> BDT • Asia/Dhaka</p></aside>
      </div>
    </main>
  );
}
