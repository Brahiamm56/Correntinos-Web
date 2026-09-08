import type { Metadata } from "next";
import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "./public.css";
import PublicShell from "@/components/PublicShell";
import AuthProvider from "@/components/AuthProvider";
import { getPublicConfiguration } from "@/lib/configuracion";

const headingFont = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Fundación Correntinos Contra el Cambio Climático | Acción Ambiental",
    template:
      "%s | Fundación Correntinos Contra el Cambio Climático",
  },
  description:
    "Somos una fundación socioambiental comprometida con la acción climática en la provincia de Corrientes, Argentina. Trabajamos por un futuro sustentable.",
  keywords: [
    "cambio climático",
    "Corrientes",
    "medio ambiente",
    "fundación",
    "sustentabilidad",
    "acción climática",
    "Argentina",
  ],
  authors: [{ name: "Fundación Correntinos Contra el Cambio Climático" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Fundación Correntinos Contra el Cambio Climático",
    title: "Fundación Correntinos Contra el Cambio Climático",
    description: "Acción climática desde Corrientes para un futuro sustentable.",
    images: [
      {
        url: "/hero-section/imagen-hero1.jpg",
        width: 1200,
        height: 630,
        alt: "Esteros del Iberá — Fundación Correntinos Contra el Cambio Climático",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/hero-section/imagen-hero1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://correntinosclim.org"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configuration = await getPublicConfiguration();

  return (
    <html
      lang="es"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="noise-overlay min-h-full flex flex-col">
        <AuthProvider>
          <PublicShell email={configuration.email} whatsapp={configuration.whatsapp} location={configuration.location}>
            {children}
          </PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
