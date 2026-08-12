export type Product = {
  id: string;
  slug: string;
  sku: string;
  nameBn: string;
  nameEn: string;
  category: string;
  region: string;
  district: string;
  price: number;
  compareAt?: number;
  pack: string;
  stock: number;
  rating: number;
  reviews: number;
  image: string;
  accent: string;
  provenance: "verified-demo" | "pending";
  badge?: string;
  description: string;
  story: string;
  ingredients: string;
  storage: string;
  shelfLife: string;
  batchCode: string;
  trace: { label: string; value: string; detail: string }[];
};

export const products: Product[] = [
  {
    id: "prod-rice-01",
    slug: "kalijira-fragrant-rice",
    sku: "DJ-RCE-KJ-1KG",
    nameBn: "কালিজিরা সুগন্ধি চাল",
    nameEn: "Kalijira Fragrant Rice",
    category: "চাল ও শস্য",
    region: "ময়মনসিংহ",
    district: "নেত্রকোণা",
    price: 590,
    compareAt: 640,
    pack: "১ কেজি",
    stock: 92,
    rating: 4.8,
    reviews: 128,
    image: "/media/rice.jpg",
    accent: "#c79a52",
    provenance: "verified-demo",
    badge: "সর্বাধিক বিক্রিত",
    description: "ছোট দানার সুগন্ধি চাল—পোলাও, পায়েস ও উৎসবের রান্নার জন্য সাজানো একটি ডেমো পণ্য।",
    story: "এই স্টেজিং গল্পটি দেখায় কীভাবে কৃষক, সংগ্রহ, মিলিং ও প্যাকিংয়ের অনুমোদিত তথ্য এক জায়গায় দেখা যাবে।",
    ingredients: "কালিজিরা চাল (ডেমো ক্যাটালগ)",
    storage: "শুষ্ক ও ঠান্ডা স্থানে, বায়ুরোধী পাত্রে রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ১২ মাস",
    batchCode: "DJ-BATCH-241",
    trace: [
      { label: "সংগ্রহ", value: "নেত্রকোণা", detail: "ডেমো উৎস রেকর্ড • ০৩ জুলাই ২০২৬" },
      { label: "প্রসেসিং", value: "ছাঁটাই ও মিলিং", detail: "ডেমো প্রসেসিং রেকর্ড • ০৬ জুলাই" },
      { label: "প্যাকিং", value: "গাজীপুর হাব", detail: "ডেমো ব্যাচ সিল • ০৮ জুলাই" },
    ],
  },
  {
    id: "prod-oil-01",
    slug: "ghani-mustard-oil",
    sku: "DJ-OIL-MST-500",
    nameBn: "ঘানি ভাঙা সরিষার তেল",
    nameEn: "Ghani Mustard Oil",
    category: "তেল ও ঘি",
    region: "রাজশাহী",
    district: "নওগাঁ",
    price: 260,
    pack: "৫০০ মি.লি.",
    stock: 18,
    rating: 4.7,
    reviews: 94,
    image: "/media/seasonings.jpg",
    accent: "#d4a62e",
    provenance: "verified-demo",
    badge: "দ্রুত বিক্রি হচ্ছে",
    description: "বাংলার রান্নাঘরের পরিচিত ঘ্রাণকে কেন্দ্র করে সাজানো সরিষার তেলের ডেমো তালিকা।",
    story: "বীজের লট থেকে প্রসেসিং পদ্ধতি পর্যন্ত প্রতিটি দাবি প্রকাশের আগে প্রমাণ-পর্যালোচনার নমুনা ফ্লো।",
    ingredients: "সরিষার তেল (ডেমো ক্যাটালগ)",
    storage: "আলো থেকে দূরে, ঢাকনা বন্ধ করে রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ৯ মাস",
    batchCode: "DJ-BATCH-318",
    trace: [
      { label: "বীজের লট", value: "নওগাঁ", detail: "ডেমো সরবরাহ রেকর্ড • ১২ জুলাই ২০২৬" },
      { label: "প্রসেসিং", value: "ঘানি", detail: "পদ্ধতির ডেমো প্রমাণ সংযুক্ত" },
      { label: "মান পরীক্ষা", value: "রিভিউ সম্পন্ন", detail: "ডেমো লেবেল ও ব্যাচ পর্যালোচনা" },
    ],
  },
  {
    id: "prod-ghee-01",
    slug: "bogura-ghee",
    sku: "DJ-GHE-BGR-500",
    nameBn: "বগুড়ার ঘি",
    nameEn: "Bogura Ghee",
    category: "তেল ও ঘি",
    region: "রাজশাহী",
    district: "বগুড়া",
    price: 880,
    pack: "৫০০ গ্রাম",
    stock: 11,
    rating: 4.6,
    reviews: 76,
    image: "/media/honey.jpg",
    accent: "#d58d2d",
    provenance: "pending",
    badge: "সীমিত স্টক",
    description: "মিষ্টি, খিচুড়ি ও উৎসবের রান্নার জন্য একটি প্রিমিয়াম ডেমো পণ্য তালিকা।",
    story: "এই পণ্যের উৎস-প্রমাণ এখনও সম্পূর্ণ নয়—তাই প্রকাশ্য ট্রেস প্রোফাইলে অনুমান না করে Pending verification দেখানো হয়েছে।",
    ingredients: "দুধের চর্বি (ডেমো লেবেল; চূড়ান্ত যাচাই বাকি)",
    storage: "শুষ্ক স্থানে রাখুন; ভেজা চামচ ব্যবহার করবেন না।",
    shelfLife: "চূড়ান্ত প্যাক লেবেল অনুমোদন সাপেক্ষে",
    batchCode: "DJ-BATCH-404",
    trace: [
      { label: "উৎস", value: "Pending verification", detail: "অনুমোদিত উৎস প্রমাণ এখনও অসম্পূর্ণ" },
      { label: "লেবেল", value: "রিভিউ চলছে", detail: "প্রকাশের আগে বাধ্যতামূলক অনুমোদন" },
      { label: "স্টক", value: "কোয়ালিটি রিভিউ", detail: "ডেমো রিটার্ন-রেট সতর্কতা যুক্ত" },
    ],
  },
  {
    id: "prod-gur-01",
    slug: "date-palm-patali-gur",
    sku: "DJ-GUR-JSR-500",
    nameBn: "খেজুরের পাটালি গুড়",
    nameEn: "Date Palm Patali Gur",
    category: "মধু ও মিষ্টি",
    region: "খুলনা",
    district: "যশোর",
    price: 420,
    pack: "৫০০ গ্রাম",
    stock: 64,
    rating: 4.9,
    reviews: 142,
    image: "/media/honey.jpg",
    accent: "#a96534",
    provenance: "verified-demo",
    badge: "ঋতুর পছন্দ",
    description: "শীতের পিঠা, পায়েস ও নাশতার জন্য সাজানো খেজুরের পাটালি গুড়ের ডেমো তালিকা।",
    story: "সংগ্রহের তারিখ, প্রসেসিং স্থান ও ব্যাচ প্যাকিং—সব তথ্য অনুমোদিত হলে তবেই ক্রেতার সামনে আসে।",
    ingredients: "খেজুরের রস থেকে প্রস্তুত গুড় (সিন্থেটিক ডেমো)",
    storage: "ফ্রিজে বায়ুরোধী পাত্রে রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ৬ মাস",
    batchCode: "DJ-BATCH-229",
    trace: [
      { label: "সংগ্রহ", value: "যশোর", detail: "ডেমো মৌসুমি সংগ্রহ • জানুয়ারি ২০২৬" },
      { label: "প্রসেসিং", value: "ছোট ব্যাচ", detail: "ডেমো প্রসেস রেকর্ড পর্যালোচিত" },
      { label: "প্যাকিং", value: "খুলনা হাব", detail: "ডেমো ট্রেস টোকেন সক্রিয়" },
    ],
  },
  {
    id: "prod-spice-01",
    slug: "chui-jhal-spice",
    sku: "DJ-SPC-CHU-100",
    nameBn: "চুই ঝাল মসলা",
    nameEn: "Chui Jhal Spice",
    category: "মসলা",
    region: "খুলনা",
    district: "বাগেরহাট",
    price: 320,
    pack: "১০০ গ্রাম",
    stock: 140,
    rating: 4.7,
    reviews: 61,
    image: "/media/spices.jpg",
    accent: "#a83f2e",
    provenance: "verified-demo",
    badge: "হেরিটেজ পিক",
    description: "খুলনার রান্নার স্বাদকে ঘিরে তৈরি একটি ছোট-ব্যাচ মসলার ডেমো পণ্য।",
    story: "অঞ্চলভিত্তিক খাবারের গল্পকে বিক্রির দাবির সঙ্গে না মিশিয়ে আলাদা provenance record হিসেবে দেখানো হয়েছে।",
    ingredients: "চুই ঝাল ও অনুমোদিত মসলা মিশ্রণ (ডেমো)",
    storage: "রোদ ও আর্দ্রতা থেকে দূরে রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ৮ মাস",
    batchCode: "DJ-BATCH-156",
    trace: [
      { label: "উপাদান", value: "বাগেরহাট", detail: "ডেমো সরবরাহ লট সংযুক্ত" },
      { label: "প্রসেসিং", value: "কাটিং ও ব্লেন্ড", detail: "ডেমো পদ্ধতি রেকর্ড" },
      { label: "রিলিজ", value: "অনুমোদিত", detail: "ডেমো দাবি ও লেবেল রিভিউ" },
    ],
  },
  {
    id: "prod-honey-01",
    slug: "sundarban-honey",
    sku: "DJ-HNY-SBN-500",
    nameBn: "সুন্দরবনের মধু",
    nameEn: "Sundarban Honey",
    category: "মধু ও মিষ্টি",
    region: "খুলনা",
    district: "সাতক্ষীরা",
    price: 650,
    pack: "৫০০ গ্রাম",
    stock: 37,
    rating: 4.8,
    reviews: 83,
    image: "/media/honey.jpg",
    accent: "#d0921e",
    provenance: "pending",
    description: "মধুর সম্ভাব্য উৎস, সংগ্রাহক ও ব্যাচ পরীক্ষাকে আলাদা করে দেখানোর ডেমো পণ্য।",
    story: "ভৌগোলিক উৎস ও গুণমানের প্রমাণ সম্পূর্ণ না হওয়ায় কোনো ‘বিশুদ্ধ’ বা স্বাস্থ্য-উপকারের দাবি প্রকাশ করা হয়নি।",
    ingredients: "মধু (উৎস যাচাই বাকি; সিন্থেটিক ডেমো)",
    storage: "শুষ্ক স্থানে ঢাকনা বন্ধ করে রাখুন।",
    shelfLife: "চূড়ান্ত লেবেল অনুমোদন সাপেক্ষে",
    batchCode: "DJ-BATCH-512",
    trace: [
      { label: "সংগ্রহ এলাকা", value: "Pending verification", detail: "জিও-এভিডেন্স পর্যালোচনা চলছে" },
      { label: "ল্যাব", value: "Pending verification", detail: "কোনো ফলাফল অনুমান করা হয়নি" },
      { label: "প্রকাশ", value: "শর্তসাপেক্ষ", detail: "শুধু claim-safe copy দৃশ্যমান" },
    ],
  },
  {
    id: "prod-pitha-01",
    slug: "nakshi-pitha-mix",
    sku: "DJ-PTH-JSR-400",
    nameBn: "নকশি পিঠা মিক্স",
    nameEn: "Nakshi Pitha Mix",
    category: "পিঠা ও নাশতা",
    region: "ঢাকা",
    district: "নরসিংদী",
    price: 380,
    pack: "৪০০ গ্রাম",
    stock: 48,
    rating: 4.5,
    reviews: 39,
    image: "/media/spices.jpg",
    accent: "#b34b35",
    provenance: "verified-demo",
    badge: "নতুন",
    description: "ঘরে পিঠা তৈরির জন্য মাপা শুকনা উপাদান ও গল্পসমৃদ্ধ ডেমো কিট।",
    story: "ঐতিহ্যকে শুধু সাজসজ্জা নয়—উপাদান, ব্যাচ ও প্রস্তুত প্রণালির তথ্য দিয়ে কার্যকরভাবে উপস্থাপন করা হয়েছে।",
    ingredients: "চালের গুঁড়া, ডাল ও মসলা (ডেমো রেসিপি মিশ্রণ)",
    storage: "শুষ্ক স্থানে বায়ুরোধী পাত্রে রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ৬ মাস",
    batchCode: "DJ-BATCH-278",
    trace: [
      { label: "রেসিপি", value: "নরসিংদী", detail: "ডেমো ঐতিহ্য নোট সংযুক্ত" },
      { label: "উপাদান", value: "ব্যাচ-ম্যাপড", detail: "ডেমো SKU ও lot mapping" },
      { label: "প্যাকিং", value: "অনুমোদিত", detail: "ডেমো allergen copy রিভিউ" },
    ],
  },
  {
    id: "prod-dal-01",
    slug: "deshi-masoor-dal",
    sku: "DJ-DAL-RJS-1KG",
    nameBn: "দেশি মসুর ডাল",
    nameEn: "Deshi Masoor Dal",
    category: "ডাল ও শস্য",
    region: "রাজশাহী",
    district: "নাটোর",
    price: 230,
    pack: "১ কেজি",
    stock: 86,
    rating: 4.6,
    reviews: 57,
    image: "/media/rice.jpg",
    accent: "#d06b45",
    provenance: "verified-demo",
    description: "প্রতিদিনের রান্নার জন্য ব্যাচ-সচেতন inventory সহ মসুর ডালের ডেমো পণ্য।",
    story: "‘দেশি’ শব্দটি এখানে একা দাবি নয়; অনুমোদিত supplier, source location এবং batch record-এর সঙ্গে যুক্ত।",
    ingredients: "মসুর ডাল (ডেমো ক্যাটালগ)",
    storage: "শুষ্ক স্থানে, পোকামাকড় থেকে সুরক্ষিত রাখুন।",
    shelfLife: "প্যাকিংয়ের তারিখ থেকে ১২ মাস",
    batchCode: "DJ-BATCH-365",
    trace: [
      { label: "সরবরাহ", value: "নাটোর", detail: "ডেমো supplier record অনুমোদিত" },
      { label: "পরিষ্কার", value: "গ্রেডিং", detail: "ডেমো প্রসেসিং event" },
      { label: "ব্যাচ", value: "Active", detail: "ডেমো recall mapping প্রস্তুত" },
    ],
  },
];

export const categories = [
  { name: "চাল ও শস্য", en: "Rice & grains", icon: "ধান", count: 18 },
  { name: "মসলা", en: "Spices", icon: "ঝাঁজ", count: 26 },
  { name: "তেল ও ঘি", en: "Oil & ghee", icon: "ঘ্রাণ", count: 12 },
  { name: "মধু ও মিষ্টি", en: "Honey & sweets", icon: "মধু", count: 14 },
  { name: "পিঠা ও নাশতা", en: "Pitha & snacks", icon: "পিঠা", count: 21 },
  { name: "ডাল ও শস্য", en: "Lentils", icon: "ডাল", count: 11 },
];

export const divisions = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

export const analyticsSeed = {
  meta: {
    range: "১৪ জুলাই – ১২ আগস্ট ২০২৬",
    currency: "BDT",
    timezone: "Asia/Dhaka",
    freshness: "১২ আগস্ট ২০২৬ • ১৮:১০",
    synthetic: true,
  },
  kpis: [
    { label: "নিট রাজস্ব", value: "৳৫,৫২,৬০০", change: "+১৪.৮%", trend: "up" },
    { label: "সফল অর্ডার", value: "৩২৬", change: "+১১.৩%", trend: "up" },
    { label: "গড় অর্ডার মূল্য", value: "৳১,৬৯৫", change: "+৩.১%", trend: "up" },
    { label: "গ্রস মার্জিন", value: "৩৯.০%", change: "+১.৮ pp", trend: "up" },
    { label: "কনভার্সন", value: "৩.৮০%", change: "+০.৪০ pp", trend: "up" },
    { label: "রিফান্ড রেট", value: "২.৩%", change: "−০.৩ pp", trend: "down-good" },
  ],
  revenue: [
    { day: "১৪ জুল", revenue: 15400, profit: 5900 }, { day: "১৮ জুল", revenue: 23800, profit: 9200 },
    { day: "২২ জুল", revenue: 19700, profit: 7400 }, { day: "২৬ জুল", revenue: 28400, profit: 11000 },
    { day: "৩০ জুল", revenue: 24900, profit: 9800 }, { day: "৩ আগ", revenue: 31200, profit: 12100 },
    { day: "৭ আগ", revenue: 27600, profit: 10400 }, { day: "১২ আগ", revenue: 35400, profit: 13900 },
  ],
  funnel: [
    { name: "সেশন", value: 8579, rate: "১০০%" }, { name: "পণ্য দেখা", value: 5947, rate: "৬৯.৩%" },
    { name: "কার্ট", value: 1142, rate: "১৩.৩%" }, { name: "চেকআউট", value: 612, rate: "৭.১%" },
    { name: "ক্রয়", value: 326, rate: "৩.৮%" },
  ],
  productPerformance: [
    { name: "কালিজিরা চাল", units: 268, revenue: 121400, margin: 34.8, stock: 92, cover: 10.3, returns: 1.1 },
    { name: "সরিষার তেল", units: 231, revenue: 107900, margin: 41.6, stock: 18, cover: 2.4, returns: 0.9 },
    { name: "বগুড়ার ঘি", units: 162, revenue: 97200, margin: 37.2, stock: 11, cover: 2.0, returns: 2.5 },
    { name: "পাটালি গুড়", units: 194, revenue: 79500, margin: 46.3, stock: 64, cover: 9.9, returns: 1.0 },
    { name: "চুই ঝাল", units: 154, revenue: 63100, margin: 52.1, stock: 140, cover: 27.3, returns: 1.9 },
  ],
  channels: [
    { name: "Facebook + Instagram", spend: 24000, revenue: 96000, roi: 29 },
    { name: "Google Search", spend: 15500, revenue: 71300, roi: 56 },
    { name: "SMS", spend: 6500, revenue: 37700, roi: 91 },
    { name: "Email", spend: 2000, revenue: 18600, roi: 225 },
    { name: "TikTok", spend: 8000, revenue: 23200, roi: -4 },
    { name: "Influencer", spend: 8500, revenue: 28100, roi: 11 },
  ],
  payments: [
    { name: "COD", value: 140, fill: "#244d3c" }, { name: "bKash", value: 111, fill: "#d55c73" },
    { name: "Nagad", value: 36, fill: "#e88b32" }, { name: "কার্ড/ব্যাংক", value: 26, fill: "#cb9b47" },
    { name: "Rocket", value: 13, fill: "#755aa5" },
  ],
  rfm: [
    { segment: "Champions", count: 184, share: 10.0, color: "#2b6b4c" },
    { segment: "Loyal", count: 276, share: 15.0, color: "#4d8a63" },
    { segment: "Potential loyalists", count: 331, share: 18.0, color: "#c59845" },
    { segment: "New", count: 258, share: 14.0, color: "#6f91a7" },
    { segment: "At risk", count: 313, share: 17.0, color: "#cc7048" },
    { segment: "Hibernating", count: 387, share: 21.0, color: "#8b7f75" },
    { segment: "Can’t lose", count: 93, share: 5.0, color: "#a84438" },
  ],
  cohorts: [
    { cohort: "এপ্রিল", size: 214, m0: 100, m1: 31, m2: 22, m3: 17 },
    { cohort: "মে", size: 248, m0: 100, m1: 29, m2: 21, m3: 15 },
    { cohort: "জুন", size: 281, m0: 100, m1: 33, m2: 24, m3: null },
    { cohort: "জুলাই", size: 304, m0: 100, m1: 30, m2: null, m3: null },
  ],
  recommendations: [
    { id: "rec-restock-oil", type: "Restock", priority: "জরুরি", title: "সরিষার তেল ৮৪ প্যাক পুনরায় মজুত করুন", reason: "২.৪ দিনের স্টক কভার; গত ১৪ দিনে চাহিদা ১৮% বেড়েছে।", impact: "আনুমানিক ৳৩৯K stockout revenue রক্ষা", confidence: 92 },
    { id: "rec-quality-ghee", type: "Inventory + quality", priority: "জরুরি", title: "ঘি ৯৬ প্যাক পরিকল্পনা করুন—আগে রিটার্ন কারণ দেখুন", reason: "২.০ দিনের কভার এবং ২.৫% রিটার্ন; category median-এর চেয়ে বেশি।", impact: "স্টক সুরক্ষা + quality risk কমানো", confidence: 88 },
    { id: "rec-promo-chui", type: "Promotion", priority: "সুযোগ", title: "চুই ঝাল দিয়ে ৮% bundle test চালান", reason: "৫২.১% মার্জিন ও ২৭.৩ দিনের কভার; low-stock SKU বাদ থাকবে।", impact: "AOV +৳১৮০–৳২৬০ সম্ভাবনা", confidence: 76 },
    { id: "rec-recovery", type: "Recovery", priority: "সুযোগ", title: "সম্মতিপ্রাপ্ত ২১৬ কার্ট পুনঃটার্গেট করুন", reason: "৪৮২ abandoned cart-এর মধ্যে email/SMS consent valid; ক্রয়কারীদের suppress করা হয়েছে।", impact: "৩১টি অর্ডারের demo benchmark", confidence: 81 },
  ],
};

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatBDT(value: number) {
  return new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value);
}
