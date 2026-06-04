import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastViewport } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindRich — Mude sua mentalidade, mude seus resultados",
  description:
    "Seu sistema pessoal de transformação financeira e mental, com coach por IA e lembretes inteligentes. Guiado pelos 13 princípios — para qualquer pessoa, tenha lido o livro ou não.",
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
