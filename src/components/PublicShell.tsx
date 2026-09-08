"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicShell({ children, email, whatsapp, location }: {
  children: React.ReactNode;
  email: string;
  whatsapp: string;
  location: string;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return <div className="public-site flex min-h-screen flex-col">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <Header whatsapp={whatsapp} email={email} />
    <main id="contenido" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
    <Footer email={email} whatsapp={whatsapp} location={location} />
  </div>;
}
