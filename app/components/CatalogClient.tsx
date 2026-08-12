"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, divisions, products } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function CatalogClient({ initialQuery = "", initialCategory = "", initialRegion = "" }: {
  initialQuery?: string;
  initialCategory?: string;
  initialRegion?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [sort, setSort] = useState("featured");
  const [traceOnly, setTraceOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("bn");
    const result = products.filter((product) => {
      const text = `${product.nameBn} ${product.nameEn} ${product.sku} ${product.category} ${product.region} ${product.district} ${product.batchCode}`.toLocaleLowerCase("bn");
      return (!normalized || text.includes(normalized)) && (!category || product.category === category) && (!region || product.region === region) && (!traceOnly || product.provenance === "verified-demo");
    });
    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return Number(Boolean(b.badge === "নতুন")) - Number(Boolean(a.badge === "নতুন"));
      return b.reviews - a.reviews;
    });
  }, [query, category, region, sort, traceOnly]);

  const clear = () => { setQuery(""); setCategory(""); setRegion(""); setTraceOnly(false); };
  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div><span className="eyebrow light">THE DESHI MARKET</span><h1>বাংলার pantry,<br /><em>আপনার দরজায়।</em></h1><p>নাম, SKU, অঞ্চল, producer অথবা public batch code দিয়ে খুঁজুন।</p></div>
        <form className="catalog-search" onSubmit={(event) => event.preventDefault()}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="কী খুঁজছেন?" aria-label="Search catalog" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}</form>
      </section>
      <div className="catalog-layout section-shell">
        <aside className={`filter-panel ${filtersOpen ? "open" : ""}`}>
          <div className="filter-title"><span><Filter size={17} /> ফিল্টার</span><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <label>ক্যাটাগরি<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">সব ক্যাটাগরি</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
          <label>অঞ্চল<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="">সব বিভাগ</option>{divisions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <fieldset><legend>Trust status</legend><label className="checkbox-label"><input type="checkbox" checked={traceOnly} onChange={(event) => setTraceOnly(event.target.checked)} /><span>Demo trace ready</span></label></fieldset>
          <div className="filter-note"><strong>Responsible filters</strong><p>Certification, origin বা processing badge শুধু evidence record থাকলে ব্যবহার করা হয়।</p></div>
          <button className="clear-filter" onClick={clear}>সব মুছুন</button>
        </aside>
        <section className="catalog-results">
          <div className="catalog-toolbar">
            <div><button className="mobile-filter" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16} /> ফিল্টার</button><span>{filtered.length}টি demo পণ্য</span></div>
            <label>সাজান<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">দাম: কম থেকে বেশি</option><option value="price-high">দাম: বেশি থেকে কম</option><option value="rating">Rating</option><option value="newest">নতুন</option></select></label>
          </div>
          {(query || category || region || traceOnly) && <div className="active-filters"><span>Active:</span>{query && <button onClick={() => setQuery("")}>{query} <X /></button>}{category && <button onClick={() => setCategory("")}>{category} <X /></button>}{region && <button onClick={() => setRegion("")}>{region} <X /></button>}{traceOnly && <button onClick={() => setTraceOnly(false)}>Trace ready <X /></button>}</div>}
          {filtered.length ? <div className="catalog-grid">{filtered.map((product, index) => <Reveal key={product.slug} delay={Math.min(index * 0.04, 0.2)}><ProductCard product={product} /></Reveal>)}</div> : <div className="empty-state"><Search /><h2>কোনো পণ্য মেলেনি</h2><p>বানান, category অথবা region filter বদলে দেখুন।</p><button onClick={clear}>সব পণ্য দেখুন</button></div>}
        </section>
      </div>
    </main>
  );
}
