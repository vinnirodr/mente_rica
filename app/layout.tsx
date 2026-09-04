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

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  // Apenas a origem: o Next já prefixa o basePath nas URLs que ele gera.
  // Incluí-lo aqui duplicaria o prefixo no og:image.
  metadataBase: new URL("https://vinnirodr.github.io"),
  title: { default: TITLE, template: "%s · MindRich" },
  description: DESCRIPTION,
  applicationName: "MindRich",
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
      <head>
        {/*
          Emitido à mão: a metadata API do Next normaliza o href do manifest e
          descarta o basePath, o que fazia o arquivo dar 404 no GitHub Pages e
          impedia a instalação do PWA.
        */}
        <link rel="manifest" href={`${BASE_PATH}/manifest.webmanifest`} />
      </head>
      <body className="font-sans">
        {children}
        <ToastViewport />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
