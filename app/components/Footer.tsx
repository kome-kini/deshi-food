import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="brand-mark">দ</span>
          <div><strong>DESHIJAAT</strong><p>বাংলাদেশের আঞ্চলিক খাবারকে উৎসের পরিচয়, দায়িত্বশীল দাবি ও সুন্দর কেনাকাটার সঙ্গে যুক্ত করার একটি প্রিমিয়াম প্ল্যাটফর্ম ডেমো।</p></div>
        </div>
        <div>
          <h3>কেনাকাটা</h3>
          <Link href="/catalog">সব পণ্য</Link><Link href="/cart">কার্ট</Link><Link href="/track">অর্ডার ট্র্যাক</Link>
        </div>
        <div>
          <h3>আস্থা</h3>
          <Link href="/#story">উৎস ও ট্রেস</Link><Link href="/catalog">Pending verification</Link><Link href="/account">সাপোর্ট</Link>
        </div>
        <div>
          <h3>ব্যবসা</h3>
          <Link href="/admin">কন্ট্রোল রুম</Link><Link href="/admin#methodology">Metric definitions</Link><Link href="/admin#recommendations">Recommendations</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© ২০২৬ DESHIJAAT • Staging experience</span>
        <span>Food imagery &amp; video: <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a></span>
      </div>
    </footer>
  );
}
