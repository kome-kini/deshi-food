"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Menu, Search, ShoppingCart } from "lucide-react";
import { categories } from "@/lib/data";
import { useCart } from "./CartProvider";
import Link from "./SafeLink";

export function Header() {
  const { count } = useCart();
  const [scope, setScope] = useState("");
  const [query, setQuery] = useState("");
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (scope) params.set("category", scope);
    window.location.assign(`/catalog?${params.toString()}`);
  };
  return (
    <>
      <div className="demo-ribbon"><span>স্টেজিং ডেমো</span> সকল পণ্য, উৎস, মূল্য, স্টক ও বিশ্লেষণ সিন্থেটিক</div>
      <header className="amz-header">
        <div className="amz-top">
          <Link href="/" className="amz-logo" aria-label="DESHIJAAT home">DESHIJAAT<span>.bd</span></Link>
          <button className="amz-deliver" type="button"><MapPin size={16} /><span><small>ডেলিভারি</small><strong>ঢাকা ১২০০</strong></span></button>
          <form className="amz-search" onSubmit={submitSearch} role="search">
            <select aria-label="Search category" value={scope} onChange={(event) => setScope(event.target.value)}>
              <option value="">সব বিভাগ</option>
              {categories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="পণ্য, অঞ্চল বা ব্যাচ কোড খুঁজুন" aria-label="Search DESHIJAAT" />
            <button type="submit" aria-label="Search"><Search size={19} /></button>
          </form>
          <Link className="amz-account" href="/account"><small>হ্যালো, সাইন ইন</small><strong>অ্যাকাউন্ট ও লিস্ট <ChevronDown size={12} /></strong></Link>
          <Link className="amz-account" href="/account#orders"><small>রিটার্ন</small><strong>ও অর্ডার</strong></Link>
          <Link className="amz-cart" href="/cart" aria-label={`Cart with ${count} items`}><ShoppingCart size={26} /><b>{count}</b><span>কার্ট</span></Link>
        </div>
        <nav className="amz-sub" aria-label="Secondary navigation">
          <Link href="/catalog"><Menu size={16} /> সব</Link>
          <Link href="/catalog?sort=featured">আজকের ডিল</Link>
          <Link href="/catalog?trace=1">Trace-ready পণ্য</Link>
          <Link href="/track">অর্ডার ট্র্যাক</Link>
          <Link href="/catalog?category=চাল%20ও%20শস্য">চাল ও শস্য</Link>
          <Link href="/catalog?category=মসলা">মসলা</Link>
          <Link href="/catalog?category=তেল%20ও%20ঘি">তেল ও ঘি</Link>
          <Link href="/catalog?category=মধু%20ও%20মিষ্টি">মধু ও মিষ্টি</Link>
          <Link href="/admin">কন্ট্রোল রুম</Link>
        </nav>
      </header>
    </>
  );
}
