"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { formatBDT } from "@/lib/data";
import { useCart } from "./CartProvider";

export function CartClient() {
  const { lines, subtotal, loading, setQuantity, remove } = useCart();
  const deliveryThreshold = 1499;
  const remaining = Math.max(0, deliveryThreshold - subtotal);
  const progress = Math.min(100, (subtotal / deliveryThreshold) * 100);
  if (loading) return <main className="simple-page"><div className="cart-loading">কার্ট প্রস্তুত হচ্ছে…</div></main>;
  if (!lines.length) return (
    <main className="simple-page"><div className="empty-cart"><span><ShoppingBag /></span><h1>আপনার কার্ট এখনো খালি</h1><p>বাংলার pantry থেকে পছন্দের পণ্য যোগ করুন।</p><Link className="button button-dark" href="/catalog">বাজার ঘুরে দেখুন <ArrowRight /></Link></div></main>
  );
  return (
    <main className="cart-page section-shell">
      <div className="page-title"><span className="eyebrow">YOUR BASKET</span><h1>আপনার কার্ট <em>({lines.reduce((sum, line) => sum + line.quantity, 0)})</em></h1></div>
      <div className="cart-layout">
        <section className="cart-lines">
          <div className="delivery-progress"><div><Truck /><span>{remaining > 0 ? <><strong>{formatBDT(remaining)}</strong> আর যোগ করলে demo delivery free</> : <><strong>অভিনন্দন!</strong> Free demo delivery unlocked</>}</span></div><div><i style={{ width: `${progress}%` }} /></div></div>
          {lines.map(({ product, quantity }) => (
            <article className="cart-line" key={product.slug}>
              <Link href={`/products/${product.slug}`} className="cart-line-image"><Image src={product.image} fill sizes="150px" alt={product.nameEn} /></Link>
              <div className="cart-line-info"><span>{product.category} · {product.sku}</span><Link href={`/products/${product.slug}`}><h2>{product.nameBn}</h2></Link><p>{product.pack} · {product.district}</p><div className="cart-line-actions"><div className="qty-control"><button onClick={() => void setQuantity(product.slug, quantity - 1)} aria-label="Decrease"><Minus /></button><span>{quantity}</span><button onClick={() => void setQuantity(product.slug, Math.min(product.stock, quantity + 1))} aria-label="Increase"><Plus /></button></div><button className="remove-line" onClick={() => void remove(product.slug)}><Trash2 /> সরান</button></div></div>
              <strong className="line-total">{formatBDT(product.price * quantity)}</strong>
            </article>
          ))}
          <Link className="continue-shopping" href="/catalog">← কেনাকাটা চালিয়ে যান</Link>
        </section>
        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>{formatBDT(subtotal)}</strong></div><div><span>Delivery</span><strong>{remaining === 0 ? "Free" : "Checkout-এ হিসাব"}</strong></div><div><span>Discount</span><strong>Quote-এ যাচাই</strong></div>
          <div className="summary-total"><span>আনুমানিক মোট</span><strong>{formatBDT(subtotal)}</strong></div>
          <div className="coupon-box"><label htmlFor="coupon">Coupon code</label><div><input id="coupon" placeholder="DESHI10" /><button>Apply</button></div><small>Server eligibility checkout-এ যাচাই হবে</small></div>
          <Link className="button checkout-button" href="/checkout">Secure checkout <ArrowRight /></Link>
          <p className="secure-note"><ShieldCheck /> Price, coupon, stock ও delivery server-side revalidated</p>
          <div className="payment-chips"><span>COD</span><span>bKash</span><span>Nagad</span><span>Rocket</span><span>Card-ready</span></div>
        </aside>
      </div>
    </main>
  );
}
