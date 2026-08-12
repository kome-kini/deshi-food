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

