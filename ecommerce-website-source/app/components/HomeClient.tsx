"use client";

import Image from "next/image";
import Link from "./SafeLink";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, MapPin, Play, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { categories, divisions, products } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function HomeClient() {
  const reduceMotion = useReducedMotion();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, reduceMotion ? 0 : 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.23], [1, 0.4]);

  return (
    <main className="home-page">
      <section className="cinema-hero" aria-labelledby="hero-title">
        <motion.div className="hero-media" style={{ y: heroY, opacity: heroOpacity }} aria-hidden="true">
          <video autoPlay muted loop playsInline poster="/media/spices.jpg" preload="metadata">
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-content">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-kicker"><Sparkles size={15} /> বাংলাদেশ থেকে, প্রমাণের সঙ্গে</span>
            <h1 id="hero-title"><span>দেশের স্বাদ,</span><em>উৎসের পরিচয়।</em></h1>
            <p className="hero-subtitle">Authentic Bangladeshi Food. Traceable to Its Source.</p>
            <p className="hero-copy">ঐতিহ্যবাহী pantry essentials, আঞ্চলিক গল্প এবং evidence-aware traceability—একটি সুন্দর, সহজ কেনাকাটায়।</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/catalog">বাজারে প্রবেশ করুন <ArrowRight size={17} /></Link>
              <Link className="button button-ghost" href="#story"><Play size={15} fill="currentColor" /> আমাদের গল্প</Link>
            </div>
          </motion.div>
        </div>
        <motion.div className="hero-float-card hero-float-one" animate={reduceMotion ? undefined : { y: [0, -11, 0], rotate: [-2, 0, -2] }} transition={{ duration: 5.5, repeat: Infinity }}>
          <Image src="/media/honey.jpg" width={116} height={116} alt="" />
          <span><small>ঋতুর পছন্দ</small><strong>পাটালি গুড়</strong><b>৳৪২০</b></span>
        </motion.div>
        <motion.div className="hero-float-card hero-float-two" animate={reduceMotion ? undefined : { y: [0, 9, 0], rotate: [2, 0, 2] }} transition={{ duration: 6, repeat: Infinity }}>
          <span className="float-icon"><ScanLine /></span><span><small>ব্যাচ থেকে ঘর</small><strong>Trace ready</strong></span>
        </motion.div>
        <a className="scroll-cue" href="#discover"><span>আরও দেখুন</span><ArrowDown size={17} /></a>
      </section>

      <section className="trust-marquee" aria-label="DESHIJAAT trust commitments">
        <div>
          {["Traceable Source", "Verified Before Publish", "Bangladesh First", "Food-Safety Ready", "Responsible Claims", "Pending means pending"].map((item) => (
            <span key={item}><i />{item}</span>
          ))}
        </div>
      </section>

      <section className="section-shell category-section" id="discover">
        <Reveal className="section-heading split-heading">
          <div><span className="eyebrow">বাংলার pantry</span><h2>এক জায়গায়, <em>অসংখ্য গল্প।</em></h2></div>
          <p>প্রতিদিনের বাজার থেকে উৎসবের বিশেষ স্বাদ—category, অঞ্চল কিংবা producer story ধরে খুঁজুন।</p>
        </Reveal>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 0.06}>
              <Link className="category-card" href={`/catalog?category=${encodeURIComponent(category.name)}`}>
                <span className="category-number">০{index + 1}</span>
                <span className="category-icon">{category.icon}</span>
                <div><h3>{category.name}</h3><p>{category.en} · {category.count} demo items</p></div>
                <ChevronRight size={18} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-shell">
          <Reveal className="section-heading products-heading">
            <div><span className="eyebrow light">CURATED FOR YOU</span><h2>এই সপ্তাহের <em>দেশি নির্বাচন</em></h2></div>
            <Link href="/catalog">সব পণ্য <ArrowRight size={17} /></Link>
          </Reveal>
          <div className="product-rail">
            {products.slice(0, 5).map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.06}><ProductCard product={product} priority={index < 2} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section section-shell" id="story">
        <div className="story-media-stack">
          <Reveal className="story-main-image"><Image src="/media/spices.jpg" fill sizes="(max-width: 900px) 90vw, 48vw" alt="Traditional spices arranged in bowls" /></Reveal>
          <motion.div className="story-small-image" whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.03 }}><Image src="/media/rice.jpg" fill sizes="280px" alt="Rice grains in a market setting" /></motion.div>
          <div className="story-seal"><span>৮</span><small>বিভাগের স্বাদ</small></div>
        </div>
        <Reveal className="story-copy" delay={0.1}>
          <span className="eyebrow">MORE THAN “DESHI”</span>
          <h2>একটি দাবি নয়।<br /><em>একটি প্রমাণের পথ।</em></h2>
          <p>DESHIJAAT-এ “দেশি” শুধু marketing label নয়। Producer, source location, processing, batch এবং claim evidence—প্রতিটি আলাদা record, প্রতিটি প্রকাশের আগে review করা যায়।</p>
          <div className="story-checks">
            <span><ShieldCheck />Evidence না থাকলে “Pending verification”</span>
            <span><Check />Public trace-এ শুধু অনুমোদিত তথ্য</span>
            <span><Check />Order item থেকে actual batch mapping</span>
          </div>
          <Link className="text-link" href="/products/kalijira-fragrant-rice">একটি trace journey দেখুন <ArrowRight /></Link>
        </Reveal>
      </section>

      <section className="region-section" id="regions">
        <div className="region-backdrop" />
        <div className="section-shell region-inner">
          <Reveal>
            <span className="eyebrow light">SHOP BY REGION</span>
            <h2>অঞ্চল থেকে <em>স্বাদ খুঁজুন</em></h2>
            <p>আট বিভাগের regional discovery layer—প্রতিটি product claim evidence status-এর সঙ্গে।</p>
          </Reveal>
          <div className="region-list">
            {divisions.map((division, index) => (
              <Reveal key={division} delay={index * 0.04}>
                <Link href={`/catalog?region=${encodeURIComponent(division)}`}><span>{String(index + 1).padStart(2, "0")}</span><MapPin size={16} />{division}<ArrowRight size={16} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell business-teaser">
        <Reveal className="business-teaser-inner">
          <div>
            <span className="eyebrow">BEHIND THE MARKETPLACE</span>
            <h2>স্বাদের পেছনে<br /><em>পরিষ্কার সিদ্ধান্ত।</em></h2>
            <p>Revenue, margin, stock cover, CLV, RFM, cohort, campaign ROI, experiments এবং explainable restock/promotion recommendations—এক control room-এ।</p>
            <Link className="button button-dark" href="/admin">কন্ট্রোল রুম দেখুন <ArrowRight size={17} /></Link>
          </div>
          <div className="teaser-metrics">
            <div><span>নিট রাজস্ব</span><strong>৳৫.৫৩L</strong><small>+১৪.৮% demo</small></div>
            <div><span>গ্রস মার্জিন</span><strong>৩৯.০%</strong><small>+১.৮ pp</small></div>
            <div><span>CLV : CAC</span><strong>৭.২×</strong><small>12m contribution</small></div>
            <div><span>Action ready</span><strong>৪</strong><small>explainable recs</small></div>
          </div>
        </Reveal>
      </section>

      <section className="newsletter-section">
        <Reveal className="newsletter-inner">
          <span>দেশের স্বাদের চিঠি</span><h2>ঋতুর গল্প, নতুন পণ্য<br />আর উৎসের খবর।</h2>
          <form onSubmit={(event) => { event.preventDefault(); setNewsletterStatus(newsletterEmail.includes("@") ? "ধন্যবাদ—staging subscription preference recorded in this session." : "সঠিক ইমেইল লিখুন।"); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="আপনার ইমেইল" /><button type="submit">যোগ দিন <ArrowRight /></button></form>
          <small role="status">{newsletterStatus || "ডেমো ফর্ম • Production-এ consent ও unsubscribe audit করা হবে"}</small>
        </Reveal>
      </section>
    </main>
  );
}
