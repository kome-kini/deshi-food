"use client";

import Image from "next/image";
import Link from "./SafeLink";
import { useEffect, useState } from "react";
import { Bell, ChevronRight, CircleUserRound, Heart, LockKeyhole, MapPin, Package, RotateCcw, Settings, ShoppingBag, Star, TicketCheck } from "lucide-react";
import { formatBDT, products } from "@/lib/data";
import { useCart } from "./CartProvider";

const menu = [
  ["overview", "ওভারভিউ", CircleUserRound], ["orders", "আমার অর্ডার", Package], ["buy-again", "আবার কিনুন", RotateCcw],
  ["wishlist", "Wishlist", Heart], ["addresses", "ঠিকানা", MapPin], ["reviews", "Reviews & Q&A", Star],
  ["returns", "Returns / complaints", TicketCheck], ["notifications", "Notifications", Bell], ["security", "Security", LockKeyhole],
] as const;

export function AccountClient({ user }: { user: { name?: string | null; email?: string | null } | null }) {
  const [active, setActive] = useState<(typeof menu)[number][0]>("overview");
  const [orders, setOrders] = useState<{ trackingCode: string; status: string; total: number; placedAt: string }[]>([]);
  const [addressEditing, setAddressEditing] = useState(false);
  const [address, setAddress] = useState("Road 11, Dhanmondi, Dhaka — synthetic preview");
  const [complaintOpen, setComplaintOpen] = useState(false);
  const { add } = useCart();
  const name = user?.name || "আরিফা রহমান";
  const email = user?.email || "synthetic.customer@example.com";
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const requested = window.location.hash.slice(1);
      if (menu.some(([key]) => key === requested)) setActive(requested as (typeof menu)[number][0]);
    });
    fetch("/api/orders", { cache: "no-store" }).then(async (response) => response.ok ? await response.json() as { orders?: typeof orders } : null).then((payload) => { if (payload?.orders) setOrders(payload.orders); }).catch(() => undefined);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const showOrders = orders.length ? orders : [{ trackingCode: "DJ-2026-1048", status: "In transit", total: 1750, placedAt: "৯ আগস্ট ২০২৬" }];
  return (
    <main className="account-page">
      <div className="account-shell section-shell">
        <aside className="account-sidebar"><div className="account-person"><span>{name.slice(0, 1)}</span><div><small>স্বাগতম</small><strong>{name}</strong><p>{user ? email : "Synthetic customer preview"}</p></div></div><nav>{menu.map(([key, label, Icon]) => <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}><Icon />{label}<ChevronRight /></button>)}</nav><Link href="/admin"><Settings /> ব্যবসা কন্ট্রোল রুম</Link></aside>
        <section className="account-content">
          {!user && <div className="account-auth-note"><LockKeyhole /><p><strong>Customer account staging preview</strong>Published private Site identity-aware; public production rollout-এ external auth, server sessions ও RBAC required.</p><a href="/signin-with-chatgpt?return_to=%2Faccount">Sign in with ChatGPT</a></div>}
          {active === "overview" && <><div className="account-heading"><div><span className="eyebrow">MY DESHIJAAT</span><h1>আমার দেশিজাত</h1></div><Link href="/catalog">বাজার করুন</Link></div><div className="account-metrics"><div><Package /><span><strong>{showOrders.length.toLocaleString("bn-BD")}</strong>চলতি অর্ডার</span></div><div><Heart /><span><strong>৫</strong>Saved items</span></div><div><Star /><span><strong>২</strong>Review pending</span></div><div><TicketCheck /><span><strong>৳১২০</strong>Demo credits</span></div></div><div className="account-section-head"><h2>সাম্প্রতিক অর্ডার</h2><button onClick={() => setActive("orders")}>সব দেখুন</button></div><OrderCard {...showOrders[0]} /><div className="account-section-head"><h2>আবার কিনুন</h2><button onClick={() => setActive("buy-again")}>সব দেখুন</button></div><div className="buy-again-grid">{products.slice(0, 3).map((product) => <div key={product.slug}><Image src={product.image} width={82} height={82} alt={product.nameEn} /><span><strong>{product.nameBn}</strong><small>{product.pack} · {formatBDT(product.price)}</small></span><button onClick={() => void add(product)}><ShoppingBag /> যোগ করুন</button></div>)}</div></>}
          {active === "orders" && <><div className="account-heading"><div><span className="eyebrow">ORDER HISTORY</span><h1>আমার অর্ডার</h1></div></div>{showOrders.map((order) => <OrderCard key={order.trackingCode} {...order} />)}</>}
          {active === "buy-again" && <><div className="account-heading"><div><span className="eyebrow">REPEAT WITH EASE</span><h1>আবার কিনুন</h1></div></div><div className="buy-again-grid large">{products.slice(0, 6).map((product) => <div key={product.slug}><Image src={product.image} width={96} height={96} alt={product.nameEn} /><span><strong>{product.nameBn}</strong><small>{product.pack} · {formatBDT(product.price)}</small></span><button onClick={() => void add(product)}><ShoppingBag /> যোগ করুন</button></div>)}</div></>}
          {active === "addresses" && <><div className="account-heading"><div><span className="eyebrow">DELIVERY</span><h1>সংরক্ষিত ঠিকানা</h1></div><button onClick={() => setAddressEditing(true)}>নতুন ঠিকানা</button></div><div className="address-card"><span><MapPin /></span><div><strong>বাসা</strong><p>{address}</p><small>01XXXXXXXXX</small></div><button onClick={() => setAddressEditing(true)}>Edit</button></div>{addressEditing && <form className="account-info-card" onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get("address"); if (typeof value === "string" && value.trim()) setAddress(value.trim()); setAddressEditing(false); }}><MapPin /><div><h2>Staging address</h2><label>ঠিকানা<input name="address" defaultValue={address} required /></label><button type="submit">সংরক্ষণ</button><button type="button" onClick={() => setAddressEditing(false)}>বাতিল</button></div></form>}</>}
          {active === "returns" && <><div className="account-heading"><div><span className="eyebrow">FOOD-SAFE SUPPORT</span><h1>Returns / complaints</h1></div><button onClick={() => setComplaintOpen(true)}>নতুন অভিযোগ</button></div><div className="account-info-card"><TicketCheck /><div><h2>Order → item → batch linkage</h2><p>Complaint actual fulfilled batch-এর সঙ্গে যুক্ত হবে, যাতে quality hold ও recall exposure নিরাপদে পর্যালোচনা করা যায়।</p></div></div>{complaintOpen && <form className="account-info-card" onSubmit={(event) => { event.preventDefault(); setComplaintOpen(false); }}><TicketCheck /><div><h2>Staging complaint</h2><label>Order code<input required placeholder="DJ-2026-1048" /></label><label>বিবরণ<textarea required rows={3} /></label><button type="submit">Review queue-তে দিন</button><button type="button" onClick={() => setComplaintOpen(false)}>বাতিল</button></div></form>}</>}
          {["wishlist", "reviews", "notifications", "security"].includes(active) && <GenericAccountPanel active={active} />}
        </section>
      </div>
    </main>
  );
}

function OrderCard({ trackingCode = "DJ-2026-1048", status = "In transit", total = 1750, placedAt = "৯ আগস্ট ২০২৬" }: { trackingCode?: string; status?: string; total?: number; placedAt?: string }) {
  return <div className="account-order"><div><span><small>ORDER</small><strong>{trackingCode}</strong></span><span><small>Placed</small><strong>{placedAt}</strong></span><span><small>Total</small><strong>{formatBDT(total)}</strong></span><b>{status}</b></div><section><div className="order-images"><Image src="/media/rice.jpg" width={64} height={64} alt="Rice" /><Image src="/media/spices.jpg" width={64} height={64} alt="Spices" /></div><p>DESHIJAAT staging order</p><Link href={`/track?code=${trackingCode}`}>Track order <ChevronRight /></Link></section></div>;
}

function GenericAccountPanel({ active }: { active: string }) {
  const content: Record<string, [string, string]> = {
    wishlist: ["আপনার Wishlist", "Saved products production-এ authenticated profile এবং durable database record-এ থাকবে।"],
    reviews: ["Reviews & Q&A", "Verified Purchase reviews fulfilled order item-এর সঙ্গে linked এবং unsupported claims moderated হবে।"],
    notifications: ["Notifications", "Delivery, restock, recall ও product-update preferences consent history-সহ পরিচালিত হবে।"],
    security: ["Security & sessions", "Passwordless/external identity, session revocation, device history এবং sensitive action audit production auth provider-এর সঙ্গে যুক্ত হবে।"],
  };
  const [title, description] = content[active] || ["Account", ""];
  return <><div className="account-heading"><div><span className="eyebrow">ACCOUNT</span><h1>{title}</h1></div></div><div className="account-info-card"><LockKeyhole /><div><h2>Secure, server-side account state</h2><p>{description}</p></div></div></>;
}
