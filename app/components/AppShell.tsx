import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { loadUiCatalog } from "@/lib/catalog-ui-loader";

export async function AppShell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  const catalog = await loadUiCatalog();
  return (
    <CartProvider>
      <Header categories={catalog.categories} />
      {children}
      {footer && <Footer />}
    </CartProvider>
  );
}
