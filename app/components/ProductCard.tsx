"use client";

import Image from "next/image";
import Link from "./SafeLink";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/product-types";
import { formatBDT } from "@/lib/format";
import { useCart } from "./CartProvider";

export function ProductCard({ product, priority = false, compact = false }: { product: Product; priority?: boolean; compact?: boolean }) {
  const { add } = useCart();
  const [saved, setSaved] = useState(() => typeof window !== "undefined" && (JSON.parse(window.localStorage.getItem("deshijaat-wishlist") || "[]") as string[]).includes(product.slug));
  const toggleSaved = () => {
    const current = JSON.parse(window.localStorage.getItem("deshijaat-wishlist") || "[]") as string[];
    const next = saved ? current.filter((slug) => slug !== product.slug) : [...new Set([...current, product.slug])];
    window.localStorage.setItem("deshijaat-wishlist", JSON.stringify(next));
    setSaved(!saved);
  };
  const discount = product.compareAt && product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
  return (
    <article className={`amz-card ${compact ? "compact" : ""}`}>
      <Link href={`/products/${product.slug}`} className="amz-card-image" aria-label={`${product.nameBn} details`}>
        <Image src={product.image} alt={product.nameEn} fill sizes="(max-width: 720px) 45vw, (max-width: 1200px) 30vw, 240px" priority={priority} />
      </Link>
      <div className="amz-card-body">
        <Link href={`/products/${product.slug}`} className="amz-title"><h3>{product.nameBn}</h3></Link>
        <p className="amz-en">{product.nameEn} · {product.pack}</p>
        <div className="amz-stars" aria-label={product.rating ? `Rated ${product.rating} out of 5` : "Rating pending"}>
          {[1, 2, 3, 4, 5].map((step) => <Star key={step} size={13} strokeWidth={0} className={step <= Math.round(product.rating) ? "on" : ""} fill="currentColor" />)}
          <span>{product.reviews ? `${product.reviews} reviews` : "Reviews pending"}</span>
        </div>
        <div className="amz-price">
          {product.price ? <strong>{formatBDT(product.price)}</strong> : <strong className="muted">Price pending</strong>}
          {product.compareAt ? <del>{formatBDT(product.compareAt)}</del> : null}
        </div>
        <div className="amz-badges">
          {discount > 0 && <span className="deal">-{discount}% ডিল</span>}
          {product.badge && <span className="flag">{product.badge}</span>}
          <span className={`trace ${product.provenance === "pending" ? "pending" : ""}`}>{product.provenance === "pending" ? "Pending verification" : "Trace ready"}</span>
        </div>
        <p className="amz-meta">{product.district} · {product.region}</p>
        <div className="amz-card-actions">
          <button className="amz-add" disabled={!product.price || !product.stock} onClick={() => void add(product)} aria-label={`Add ${product.nameEn} to cart`}>{product.price && product.stock ? "কার্টে যোগ করুন" : "শীঘ্রই আসছে"}</button>
          <button className={`amz-save ${saved ? "active" : ""}`} onClick={toggleSaved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}><Heart size={15} fill={saved ? "currentColor" : "none"} /></button>
        </div>
      </div>
    </article>
  );
}
