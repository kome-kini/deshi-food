"use client";

import Image from "next/image";
import Link from "./SafeLink";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Heart, MapPin, Plus, ScanLine, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { formatBDT } from "@/lib/data";
import { useCart } from "./CartProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const reduceMotion = useReducedMotion();
  const [saved, setSaved] = useState(() => typeof window !== "undefined" && (JSON.parse(window.localStorage.getItem("deshijaat-wishlist") || "[]") as string[]).includes(product.slug));
  const [compared, setCompared] = useState(false);
  const toggleSaved = () => {
    const current = JSON.parse(window.localStorage.getItem("deshijaat-wishlist") || "[]") as string[];
    const next = saved ? current.filter((slug) => slug !== product.slug) : [...new Set([...current, product.slug])];
    window.localStorage.setItem("deshijaat-wishlist", JSON.stringify(next));
    setSaved(!saved);
  };
  const toggleCompared = () => {
    const current = JSON.parse(window.localStorage.getItem("deshijaat-compare") || "[]") as string[];
    const next = compared ? current.filter((slug) => slug !== product.slug) : [...new Set([...current, product.slug])].slice(-3);
    window.localStorage.setItem("deshijaat-compare", JSON.stringify(next));
    setCompared(!compared);
  };
  return (
    <motion.article
      className="product-card"
      whileHover={reduceMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="product-image-wrap" aria-label={`${product.nameBn} details`}>
        <Image src={product.image} alt={product.nameEn} fill sizes="(max-width: 720px) 82vw, (max-width: 1200px) 42vw, 310px" priority={priority} />
        <span className="product-wash" style={{ background: `linear-gradient(180deg, transparent 45%, ${product.accent}bb)` }} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className={`trace-badge ${product.provenance === "pending" ? "pending" : ""}`}>
          <ScanLine size={13} />{product.provenance === "pending" ? "Pending verification" : "Demo trace ready"}
        </span>
        <span className="view-product">দেখুন <ArrowUpRight size={15} /></span>
        <div className="card-tools"><button className={`card-tool ${saved ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleSaved(); }} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}><Heart size={15} fill={saved ? "currentColor" : "none"} /></button><button className={`card-tool ${compared ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleCompared(); }} aria-label={compared ? "Remove from compare" : "Compare product"}>{compared ? <Check size={15} /> : <span>⇄</span>}</button></div>
      </Link>
      <div className="product-content">
        <div className="product-location"><MapPin size={13} />{product.district} · {product.region}</div>
        <Link href={`/products/${product.slug}`}><h3>{product.nameBn}</h3><p className="product-en">{product.nameEn}</p></Link>
        <div className="product-meta"><span>★ {product.rating.toFixed(1)} <small>({product.reviews})</small></span><span>{product.pack}</span></div>
        <div className="product-buy-row">
          <div><strong>{formatBDT(product.price)}</strong>{product.compareAt && <del>{formatBDT(product.compareAt)}</del>}</div>
          <div className="card-actions"><button className="card-add" onClick={() => void add(product)} aria-label={`Add ${product.nameEn} to cart`}><Plus size={16} /> যোগ করুন</button><button className="card-buy" onClick={async () => { await add(product); window.location.assign("/checkout"); }}><ShoppingBag size={15} /> এখনই কিনুন</button></div>
        </div>
      </div>
    </motion.article>
  );
}
