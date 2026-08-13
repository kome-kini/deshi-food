import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter, Noto_Serif_Bengali } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

// Catalog and account data are request-time data. Keep Vercel from attempting
// to prerender pages without the production database connection.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const hind = Hind_Siliguri({
  variable: "--font-bangla-sans",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_Bengali({
  variable: "--font-bangla-serif",
  subsets: ["bengali"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const candidateHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "deshijaat.example";
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(candidateHost) ? candidateHost : "deshijaat.example";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "http" || host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: { default: "DESHIJAAT — দেশের স্বাদ, উৎসের পরিচয়", template: "%s | DESHIJAAT" },
    description: "A cinematic Bangladesh-first food marketplace and business intelligence platform. Authentic Bangladeshi Food. Traceable to Its Source.",
    keywords: ["Bangladeshi food", "traceable food", "দেশি খাবার", "দেশিজাত"],
    openGraph: { title: "DESHIJAAT — দেশের স্বাদ, উৎসের পরিচয়", description: "Authentic Bangladeshi Food. Traceable to Its Source.", type: "website", locale: "bn_BD", images: [{ url: `${origin}/og.png`, width: 1734, height: 908, alt: "DESHIJAAT — দেশের স্বাদ, উৎসের পরিচয়।" }] },
    twitter: { card: "summary_large_image", title: "DESHIJAAT", description: "দেশের স্বাদ, উৎসের পরিচয়।", images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = { themeColor: "#15372a", colorScheme: "light" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${hind.variable} ${inter.variable} ${notoSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
