import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppShell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <CartProvider>
      <Header />
      {children}
      {footer && <Footer />}
    </CartProvider>
  );
}
