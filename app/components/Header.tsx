"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "./CartProvider";

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
  const router = useRouter();
  const pathname = usePathname();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
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
          <Link className="icon-button" href="/account" aria-label="Customer account"><UserRound size={19} /></Link>
          <Link className="cart-link" href="/cart" aria-label={`Cart with ${count} items`}>
            <ShoppingBag size={19} /><span>কার্ট</span>{count > 0 && <b>{count}</b>}
          </Link>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <div className={`mobile-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        <Link href="/admin" onClick={() => setMenuOpen(false)}>ব্যবসা কন্ট্রোল রুম</Link>
      </div>
      <div className={`search-overlay ${searchOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Search DESHIJAAT">
        <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></button>
        <form onSubmit={submitSearch}>
          <span>আপনি কী খুঁজছেন?</span>
          <div><Search size={28} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="চাল, মসলা, অঞ্চল বা ব্যাচ কোড…" /></div>
          <p>জনপ্রিয়: কালিজিরা চাল · সরিষার তেল · পাটালি গুড়</p>
        </form>
      </div>
    </>
  );
}
