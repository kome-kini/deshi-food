"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { categories, products } from "@/lib/data";
import { useCart } from "./CartProvider";
import Link from "./SafeLink";

const nav = [
  ["/catalog", "বাজার"],
  ["/#regions", "অঞ্চল"],
  ["/#story", "উৎসের গল্প"],
  ["/track", "অর্ডার ট্র্যাক"],
];

export function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const pathname = usePathname();
  const suggestions = (query.trim() ? products.filter((product) => `${product.nameBn} ${product.nameEn} ${product.category} ${product.region} ${product.batchCode}`.toLocaleLowerCase("bn").includes(query.trim().toLocaleLowerCase("bn"))) : products).slice(0, 5);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    if (searchCategory) params.set("category", searchCategory);
    window.location.assign(`/catalog?${params.toString()}`);
  };

  return (
    <>
      <div className="demo-ribbon">
        <span>স্টেজিং ডেমো</span>
        সকল পণ্য, উৎস, মূল্য, স্টক ও বিশ্লেষণ সিন্থেটিক
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="DESHIJAAT home">
          <span className="brand-mark" aria-hidden="true">দ</span>
          <span><strong>DESHIJAAT</strong><small>দেশের স্বাদ, উৎসের পরিচয়</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setSearchOpen(true)} aria-label="Search products"><Search size={19} /></button>
          <Link className="icon-button account-link" href="/account" aria-label="Customer account"><UserRound size={19} /></Link>
          <Link className="cart-link" href="/cart" aria-label={`Cart with ${count} items`}>
            <ShoppingBag size={19} /><span>কার্ট</span>{count > 0 && <b>{count}</b>}
          </Link>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <nav className="commerce-subnav" aria-label="Shopping shortcuts"><div><Link href="/catalog">সব পণ্য</Link><Link href="/catalog?sort=featured">আজকের নির্বাচন</Link><Link href="/catalog?trace=1">Trace-ready products</Link><Link href="/catalog?category=মসলা">মসলা</Link><Link href="/catalog?category=চাল%20ও%20শস্য">চাল ও শস্য</Link><Link href="/catalog?category=মধু%20ও%20মিষ্টি">মধু ও মিষ্টি</Link><Link href="/track">ডেলিভারি ট্র্যাক</Link><Link className="subnav-special" href="/account#buy-again">আবার কিনুন</Link></div></nav>
      <div className={`mobile-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        <Link href="/admin" onClick={() => setMenuOpen(false)}>ব্যবসা কন্ট্রোল রুম</Link>
      </div>
      <div className={`search-overlay ${searchOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Search DESHIJAAT">
        <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></button>
        <form onSubmit={submitSearch}>
          <span>আপনি কী খুঁজছেন?</span>
          <div className="search-input-row"><Search size={28} /><select aria-label="Search category" value={searchCategory} onChange={(event) => setSearchCategory(event.target.value)}><option value="">সব বিভাগ</option>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="চাল, মসলা, অঞ্চল বা ব্যাচ কোড…" /></div>
          <div className="search-suggestions">{suggestions.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} onClick={() => setSearchOpen(false)}><span><strong>{product.nameBn}</strong><small>{product.category} · {product.region}</small></span><b>{product.price}৳</b></Link>)}</div>
          <p>জনপ্রিয়: কালিজিরা চাল · সরিষার তেল · পাটালি গুড়</p>
        </form>
      </div>
    </>
  );
}
