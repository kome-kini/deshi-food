import type { Product } from "./data";

type DraftInput = { bn: string; en: string; category: string; image: string; risk?: boolean };

const draft = (item: DraftInput, index: number): Product => {
  const sku = `SOA-DRAFT-${String(index).padStart(3, "0")}`;
  const slug = `${item.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index}`;
  return {
    id: `supplier-draft-${index}`, slug, sku, nameBn: item.bn, nameEn: item.en,
    category: item.category, region: "বাংলাদেশ", district: "Pending verification", price: 0,
    pack: "Pack size pending", stock: 0, rating: 0, reviews: 0, image: item.image, accent: "#8b9a84",
    provenance: "pending", badge: "নতুন ক্যাটালগ",
    description: item.risk ? "Supplier catalogue draft. Composition, pack, price, and claim review are pending verification." : "Supplier catalogue draft. Pack, price, source, and evidence are pending verification.",
    story: "Imported from the attached supplier input workbook. This item remains a draft until supplier, label, pricing, and evidence records are approved.",
    ingredients: "Composition pending verification", storage: "Follow the approved label once available", shelfLife: "Pending label approval", batchCode: `TRACE-PENDING-${String(index).padStart(3, "0")}`,
    trace: [{ label: "Publication status", value: "Pending verification", detail: "Supplier, pack, price, label, and evidence records are not yet approved." }],
  };
};

const rows: [string, string, string, string, boolean?][] = [
  ["ঢেঁকি ছাঁটা লাল চাল (গাঞ্জিয়া)", "Dheki-Pounded Red Rice (Ganjiya)", "চাল ও শস্য", "/media/products/dheki-red-rice-ganjiya.jpg"],
  ["ঢেঁকি ছাঁটা লাল চাল (আউস-ব্রি)", "Dheki-Pounded Red Rice (Aus-BRI)", "চাল ও শস্য", "/media/products/dheki-red-rice-aus-bri.jpg"],
  ["ঢেঁকি ছাঁটা ব্রাউন চাল (কাটারী/২৮)", "Dheki-Pounded Brown Rice (Katari/BR28)", "চাল ও শস্য", "/media/products/dheki-brown-rice-katari-br28.webp"],
  ["ঢেঁকি ছাঁটা চালের গুড়া", "Dheki-Pounded Rice Flour", "চাল ও শস্য", "/media/products/dheki-rice-flour.jpg"],
  ["ঢেঁকি ছাঁটা যবের ছাতু", "Dheki-Pounded Barley Sattu", "ময়দা ও ছাতু", "/media/products/dheki-barley-sattu.jpg"],
  ["সোয়ালিক্স (মিক্সড ছাতু)", "Soyaliks Mixed Sattu", "ময়দা ও ছাতু", "/media/products/soyaliks-mixed-sattu.jpg"],
  ["ব্ল্যাক রাইস", "Black Rice", "চাল ও শস্য", "/media/products/black-rice.png"],
  ["কাউনের চাল", "Kaun Rice (Foxtail Millet)", "চাল ও শস্য", "/media/products/kaun-rice.jpg"],
  ["কাঠের ঘানির সরিষার তেল", "Wooden-Ghani Mustard Oil", "তেল ও ঘি", "/media/products/wooden-ghani-mustard-oil.jpg"],
  ["লাল আটা", "Red Whole-Wheat Flour", "ময়দা ও ছাতু", "/media/products/red-whole-wheat-flour.webp"],
  ["যবের আটা", "Barley Flour", "ময়দা ও ছাতু", "/media/products/barley-flour.jpg"],
  ["লাল চিনি", "Red Sugar", "ময়দা ও ছাতু", "/media/products/red-sugar.jpg"],
  ["লাল চিড়া", "Red Flattened Rice (Chira)", "চাল ও শস্য", "/media/products/red-flattened-rice.jpg"],
  ["হাতে ভাজা মুড়ি (লাল/সাদা)", "Hand-Roasted Puffed Rice (Red/White)", "চাল ও শস্য", "/media/products/hand-roasted-puffed-rice.jpg"],
  ["হিমালয়ান পিংক সল্ট", "Himalayan Pink Salt", "মসলা", "/media/products/himalayan-pink-salt.jpg"],
  ["ঘি", "Ghee", "তেল ও ঘি", "/media/products/ghee.jpg"],
  ["মধু (সরিষা)", "Mustard Flower Honey", "মধু ও মিষ্টি", "/media/products/mustard-flower-honey.jpg"],
  ["মধু (লিচু)", "Litchi Flower Honey", "মধু ও মিষ্টি", "/media/products/litchi-flower-honey.jpg"],
  ["মধু (কালোজিরা)", "Black-Seed Flower Honey", "মধু ও মিষ্টি", "/media/products/black-seed-flower-honey.jpg"],
  ["মধু (সুন্দরবন)", "Sundarban Honey", "মধু ও মিষ্টি", "/media/products/sundarban-honey.avif"],
  ["তিসি", "Flaxseed", "বীজ ও গুঁড়া", "/media/products/flaxseed.jpg"],
  ["তিল", "Sesame", "বীজ ও গুঁড়া", "/media/products/sesame.jpg"],
  ["কালোজিরা", "Black Seed (Nigella)", "বীজ ও গুঁড়া", "/media/products/black-seed.jpg"],
  ["চিয়া সীড", "Chia Seed", "বীজ ও গুঁড়া", "/media/products/chia-seed.jpg"],
  ["মরিঙ্গা পাউডার", "Moringa Powder", "বীজ ও গুঁড়া", "/media/products/moringa-powder.jpg"],
  ["কম্বোপ্যাক: তালবিনা", "Combo Pack: Talbina", "কম্বো প্যাক", "/media/products/combo-pack-talbina.jpg", true],
  ["মাসকালাইয়ের গুড়া", "Mashkalai (Black Gram) Powder", "ময়দা ও ছাতু", "/media/products/mashkalai-powder.jpg"],
  ["ঢেঁকি ছাঁটা মসলা গুড়া", "Dheki-Pounded Mixed Spice Powder", "মসলা", "/media/products/dheki-mixed-spice-powder.jpg"],
  ["হলুদের গুড়া", "Turmeric Powder", "মসলা", "/media/products/turmeric-powder.jpg"],
  ["মরিচের গুড়া", "Chili Powder", "মসলা", "/media/products/chili-powder.jpg"],
];

export const supplierCatalogProducts: Product[] = rows.map((row, index) => draft({ bn: row[0], en: row[1], category: row[2], image: row[3], risk: row[4] }, index + 1));
