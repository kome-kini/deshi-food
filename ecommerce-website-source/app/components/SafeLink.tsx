import type { ComponentProps, ReactNode } from "react";

type SafeLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  children: ReactNode;
};

/**
 * Sites currently serves vinext's client router with a production-only
 * navigation regression. A normal anchor keeps every route progressively
 * enhanced and guarantees that product, cart, checkout, account and admin
 * pages remain reachable even when client-side routing is unavailable.
 */
export default function SafeLink({ href, children, ...props }: SafeLinkProps) {
  return <a href={href} {...props}>{children}</a>;
}
