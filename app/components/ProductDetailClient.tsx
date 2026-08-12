"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, ChevronDown, Heart, Minus, Plus, ScanLine, Share2, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import type { Product } from "@/lib/product-types";
import { formatBDT } from "@/lib/format";
import { useCart } from "./CartProvider";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import Link from "./SafeLink";

const tabs = ["পণ্যের তথ্য", "উৎস ও Producer", "Batch trace", "Reviews & Q&A"];

export function ProductDetailClient({ product, relatedProducts = [] }: { product: Product; relatedProducts?: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const [pack, setPack] = useState(product.pack);
  const [selectedImage, setSelectedImage] = useState({ src: product.image, label: "Product view" });
  const [saved, setSaved] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [traceNotice, setTraceNotice] = useState("");
  const { add } = useCart();
  const related = relatedProducts.filter((candidate) => candidate.slug !== product.slug).slice(0, 3);

  const buyNow = async () => {
    await add(product, quantity);
    window.location.assign("/checkout");
  };

  return (
    <main className="pdp-page">
      <div className="pdp-breadcrumb section-shell"><Link href="/">হোম</Link><span>/</span><Link href={`/catalog?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>/</span><b>{product.nameBn}</b></div>
      <section className="pdp-main section-shell">
        <Reveal className="pdp-gallery">
          <div className="pdp-hero-image"><Image src={selectedImage.src} fill priority sizes="(max-width: 900px) 95vw, 50vw" alt={product.nameEn} /><span className="image-label">Synthetic product styling</span></div>
          <div className="pdp-thumbnails">{[[product.image, "Product view"], ["/media/spices.jpg", "Ingredient styling"], ["/media/rice.jpg", "Source styling"]].map(([src, label]) => <button key={label} className={selectedImage.label === label ? "active" : ""} onClick={() => setSelectedImage({ src, label })}><Image src={src} fill sizes="90px" alt={label} /></button>)}</div>
        </Reveal>
        <Reveal className="pdp-summary" delay={0.08}>
          <div className="pdp-kicker"><span>{product.category}</span><span>SKU {product.sku}</span></div>
          <h1>{product.nameBn}</h1><p className="pdp-en">{product.nameEn}</p>
          <div className="pdp-rating"><span>{product.rating ? <><Star fill="currentColor" size={16} /> {product.rating}</> : "Rating pending"}</span><button onClick={() => { setTab(3); document.querySelector(".pdp-detail")?.scrollIntoView({ behavior: "smooth" }); }}>{product.reviews ? `${product.reviews}টি verified-demo review` : "Reviews pending"}</button></div>
          <p className="pdp-description">{product.description}</p>
          <div className={`pdp-trace-callout ${product.provenance === "pending" ? "pending" : ""}`}><ScanLine /><div><strong>{product.provenance === "pending" ? "Pending verification" : "Demo provenance profile ready"}</strong><p>{product.provenance === "pending" ? "অসম্পূর্ণ প্রমাণের জায়গায় কোনো উৎস বা গুণমানের দাবি অনুমান করা হয়নি।" : `${product.batchCode} দিয়ে approved public fields দেখুন।`}</p></div></div>
          <div className="pdp-price"><strong>{product.price ? formatBDT(product.price) : "Price pending"}</strong>{product.compareAt && <del>{formatBDT(product.compareAt)}</del>}<small>{product.price ? "VAT/শিপিং checkout quote-এ" : "Pricing and pack size require supplier confirmation"}</small></div>
          <div className="pack-picker"><span>প্যাক সাইজ</span><div><button className="active" onClick={() => setPack(product.pack)}>{product.pack}</button></div></div>
          <div className="stock-line"><span className={product.stock < 20 ? "low" : ""}><i />{product.stock < 20 ? `কম স্টক • ${product.stock} demo units` : "ডেমো স্টকে আছে"}</span><span><Truck /> Dhaka delivery estimate: ১–২ দিন</span></div>
          <div className="pdp-purchase">
            <div className="qty-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} aria-label="Increase quantity"><Plus /></button></div>
            <button className="button add-cart-button" disabled={!product.price || !product.stock} onClick={() => void add(product, quantity)}><ShoppingBag /> {product.price && product.stock ? "কার্টে যোগ করুন" : "তথ্য যাচাই চলছে"}</button>
            <button className="button buy-now-button" disabled={!product.price || !product.stock} onClick={() => void buyNow()}>{product.price && product.stock ? "এখনই কিনুন" : "শীঘ্রই পাওয়া যাবে"}</button>
          </div>
          <div className="pdp-utility"><button onClick={() => setSaved((value) => !value)}><Heart fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save for later"}</button><button onClick={async () => { const url = window.location.href; if (navigator.share) await navigator.share({ title: product.nameBn, url }).catch(() => undefined); else await navigator.clipboard?.writeText(url).catch(() => undefined); }}><Share2 /> শেয়ার</button></div>
          <div className="pdp-assurance"><span><ShieldCheck /><b>Responsible claims</b><small>Evidence-gated copy</small></span><span><Check /><b>Batch aware</b><small>Complaint & recall ready</small></span></div>
        </Reveal>
      </section>

      <section className="pdp-detail section-shell">
        <div className="pdp-tabs" role="tablist">{tabs.map((label, index) => <button key={label} className={tab === index ? "active" : ""} onClick={() => setTab(index)} role="tab" aria-selected={tab === index}>{label}</button>)}</div>
        <div className="pdp-tab-content">
          {tab === 0 && <div className="info-grid"><div><span>উপাদান</span><strong>{product.ingredients}</strong></div><div><span>প্যাক</span><strong>{pack} • {product.sku}</strong></div><div><span>সংরক্ষণ</span><strong>{product.storage}</strong></div><div><span>Shelf life</span><strong>{product.shelfLife}</strong></div></div>}
          {tab === 1 && <div className="producer-story"><div><span className="story-avatar">উ</span><div><small>DEMO PRODUCER PROFILE</small><h3>{product.district} আঞ্চলিক নেটওয়ার্ক</h3><p>{product.story}</p></div></div><aside><strong>Publication gate</strong><span><Check />Supplier verification</span><span><Check />Label review</span><span className={product.provenance === "pending" ? "muted" : ""}><Check />Origin evidence</span></aside></div>}
          {tab === 2 && <div className="trace-panel"><div className="trace-panel-head"><div><ScanLine /><span><small>PUBLIC DEMO TOKEN</small><strong>{product.batchCode}</strong></span></div><button onClick={() => setTraceNotice((value) => value ? "" : `Trace token: ${product.batchCode}`)}>QR দেখুন</button></div>{traceNotice && <p role="status">{traceNotice} • production QR এই approved public record খুলবে।</p>}<div className="trace-timeline">{product.trace.map((event, index) => <div key={event.label}><span>{index + 1}</span><div><small>{event.label}</small><strong>{event.value}</strong><p>{event.detail}</p></div></div>)}</div><p className="trace-privacy">Public trace page কেবল অনুমোদিত fields দেখায়; internal supplier records বা inferred batch ID নয়।</p></div>}
          {tab === 3 && <div className="review-panel"><div className="review-score"><strong>{product.rating}</strong><span>★★★★★</span><p>{product.reviews}টি synthetic verified-purchase review summary</p></div><div><h3>Review safeguards</h3><p>Production reviews fulfilled order item-এর সঙ্গে linked থাকবে। Unsupported therapeutic বা health claims moderation queue-তে যাবে।</p><button onClick={() => setQuestionOpen((value) => !value)}>একটি প্রশ্ন করুন <ChevronDown /></button>{questionOpen && <form onSubmit={(event) => { event.preventDefault(); setQuestionOpen(false); }}><label className="sr-only" htmlFor="product-question">Product question</label><input id="product-question" required placeholder="পণ্য বা উৎস সম্পর্কে প্রশ্ন লিখুন" /><button type="submit">Staging question সংরক্ষণ</button></form>}</div></div>}
        </div>
      </section>

      <section className="related-products section-shell"><Reveal className="section-heading"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>একসঙ্গে <em>ভালো যায়</em></h2></div></Reveal><div className="catalog-grid">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></section>
    </main>
  );
}
