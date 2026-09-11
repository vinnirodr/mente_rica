import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastViewport } from "@/components/ui/Toast";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const TITLE = "MindRich — Mude sua mentalidade, mude seus resultados";
const DESCRIPTION =
  "Seu sistema pessoal de transformação financeira e mental, com coach por IA e lembretes inteligentes. Guiado pelos 13 princípios — para qualquer pessoa, tenha lido o livro ou não.";

// A Vercel injeta a URL de produção no build, então o Open Graph aponta certo no
// .vercel.app e continua certo com domínio próprio — basta definir
// NEXT_PUBLIC_SITE_URL, sem tocar no código.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · MindRich" },
  description: DESCRIPTION,
  applicationName: "MindRich",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MindRich",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MindRich",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
  // Evita o zoom automático do iOS ao focar inputs, sem impedir o zoom manual.
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {children}
        <ToastViewport />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
