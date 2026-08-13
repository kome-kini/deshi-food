"use client";

import Image from "next/image";
import Link from "./SafeLink";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ScanLine } from "lucide-react";
import type { Product } from "@/lib/product-types";
import { ProductCard } from "./ProductCard";

const slides = [
  { image: "/media/hero-banner.jpg", kicker: "Authentic Bangladeshi Food • Traceable to Its Source", title: "দেশের স্বাদ, এখন আপনার দরজায়", cta: "আজকের ডিল দেখুন", href: "/catalog?sort=featured" },
  { image: "/media/categories/rice-grains.jpg", kicker: "চাল ও শস্য • নেত্রকোণা", title: "কালিজিরা সুগন্ধি চাল, ব্যাচ-ট্রেস সহ", cta: "চাল ঘুরে দেখুন", href: "/catalog?category=চাল%20ও%20শস্য" },
  { image: "/media/categories/spices.jpg", kicker: "মসলা • বাগেরহাট থেকে যশোর", title: "অঞ্চলের আসল স্বাদ, দায়িত্বশীল দাবিসহ", cta: "মসলা দেখুন", href: "/catalog?category=মসলা" },
];

type HomeCategory = { name: string; en: string; icon?: string; count?: number };

const categoryImage = (category: HomeCategory) => {
  const name = category.en.toLowerCase();
  if (name.includes("spice")) return "/media/categories/spices.jpg";
  if (name.includes("oil") || name.includes("ghee")) return "/media/categories/oil-ghee.avif";
  if (name.includes("honey")) return "/media/categories/honey.jpg";
  if (name.includes("seed") || name.includes("powder")) return "/media/categories/seeds-powders.jpg";
  if (name.includes("flour") || name.includes("sattu")) return "/media/categories/flour-sattu.avif";
  if (name.includes("combo")) return "/media/categories/combo-packs.jpg";
  return "/media/categories/rice-grains.jpg";
};

export function HomeClient({ products, categories }: { products: Product[]; categories: HomeCategory[] }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);
  const deals = products.filter((product) => product.compareAt).sort((a, b) => b.reviews - a.reviews);
  const bestSellers = products.filter((product) => product.price).sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  return (
    <main className="amz-home">
      <section className="amz-hero" aria-label="Featured promotions">
        {slides.map((item, index) => <div key={item.title} className={`amz-hero-slide ${index === slide ? "on" : ""}`}><Image src={item.image} alt="" fill priority={index === 0} sizes="100vw" /><div className="amz-hero-shade" /><div className="amz-hero-copy"><span>{item.kicker}</span><h1>{item.title}</h1><Link className="amz-cta" href={item.href}>{item.cta}</Link></div></div>)}
        <button className="amz-hero-arrow left" onClick={() => setSlide((current) => (current - 1 + slides.length) % slides.length)} aria-label="Previous banner"><ChevronLeft size={26} /></button>
        <button className="amz-hero-arrow right" onClick={() => setSlide((current) => (current + 1) % slides.length)} aria-label="Next banner"><ChevronRight size={26} /></button>
      </section>

      <section className="amz-quad section-shell" aria-label="Quick shopping shortcuts">
        <div className="amz-quad-card"><h2>আজকের ডিল</h2><div className="amz-quad-img"><Image src="/media/categories/combo-packs.jpg" alt="Today's deals" fill sizes="280px" /></div><Link href="/catalog?sort=featured">ডিল দেখুন</Link></div>
        <div className="amz-quad-card"><h2>বেস্ট সেলার</h2><div className="amz-quad-img"><Image src="/media/categories/rice-grains.jpg" alt="Best sellers" fill sizes="280px" /></div><Link href="/catalog">সব দেখুন</Link></div>
        <div className="amz-quad-card"><h2>Trace-ready প্যান্ট্রি</h2><div className="amz-quad-img"><Image src="/media/categories/spices.jpg" alt="Trace ready products" fill sizes="280px" /></div><Link href="/catalog?trace=1">উৎস দেখুন</Link></div>
        <div className="amz-quad-card"><h2>মধু ও মিষ্টি</h2><div className="amz-quad-img"><Image src="/media/categories/honey.jpg" alt="Honey and sweets" fill sizes="280px" /></div><Link href="/catalog?category=মধু%20ও%20মিষ্টি">ঘুরে দেখুন</Link></div>
      </section>

      <section className="amz-strip"><header><h2>ক্যাটাগরি অনুযায়ী কিনুন</h2><Link href="/catalog">সব ক্যাটাগরি</Link></header><div className="amz-cat-row">{categories.slice(0, 8).map((category) => <Link key={category.name} href={`/catalog?category=${encodeURIComponent(category.name)}`} className="amz-cat-tile"><span className="amz-cat-img"><Image src={categoryImage(category)} alt={category.en} fill sizes="170px" /></span><span>{category.name}</span></Link>)}</div></section>
      <section className="amz-strip"><header><h2>Today&apos;s Deals</h2><Link href="/catalog?sort=featured">সব ডিল দেখুন</Link></header><div className="amz-rail">{deals.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
      <section className="amz-strip"><header><h2>Best Sellers</h2><Link href="/catalog">সব পণ্য</Link></header><div className="amz-grid">{bestSellers.map((product) => <ProductCard key={product.slug} product={product} compact />)}</div></section>
      <section className="amz-trace-banner section-shell"><ScanLine size={30} /><div><strong>উৎসের পরিচয়, দায়িত্বশীল দাবি</strong><p>যে পণ্যের প্রমাণ এখনো সম্পূর্ণ নয়, সেখানে আমরা অনুমান না করে &quot;Pending verification&quot; দেখাই — Trace-ready পণ্যে অনুমোদিত ব্যাচ রেকর্ড আছে।</p></div><Link href="/catalog?trace=1">Trace-ready পণ্য</Link></section>
    </main>
  );
}
