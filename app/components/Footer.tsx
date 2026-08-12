"use client";

import Link from "./SafeLink";

export function Footer() {
  return (
    <footer className="amz-footer">
      <button className="amz-back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button>
      <div className="amz-footer-cols">
        <div><h3>আপনার জানা দরকার</h3><Link href="/track">অর্ডার ট্র্যাক</Link><Link href="/account#returns">রিটার্ন ও অভিযোগ</Link><Link href="/account">অ্যাকাউন্ট</Link><Link href="/cart">কার্ট</Link></div>
        <div><h3>কেনাকাটা</h3><Link href="/catalog">সব পণ্য</Link><Link href="/catalog?sort=featured">আজকের ডিল</Link><Link href="/catalog?trace=1">Trace-ready পণ্য</Link><Link href="/account#buy-again">আবার কিনুন</Link></div>
        <div><h3>আস্থা</h3><Link href="/#story">উৎস ও ট্রেস</Link><Link href="/catalog">Pending verification</Link><Link href="/account#returns">সাপোর্ট</Link></div>
        <div><h3>ব্যবসা</h3><Link href="/admin">কন্ট্রোল রুম</Link><Link href="/admin#methodology">Metric definitions</Link><Link href="/admin#recommendations">Recommendations</Link></div>
      </div>
      <div className="amz-footer-bottom">
        <span className="amz-logo">DESHIJAAT<span>.bd</span></span>
        <p>© ২০২৬ DESHIJAAT • দেশের স্বাদ, উৎসের পরিচয় • Staging experience • Food imagery &amp; video: Pexels</p>
      </div>
    </footer>
  );
}
