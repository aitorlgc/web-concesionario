import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = "High Cars · Alta gama alemana en km 0 y ocasión";
const description =
  "BMW M, Mercedes-AMG, Porsche y Audi Sport en km 0 y de ocasión, revisados uno a uno. Te decimos qué coche comprar y por qué.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["concesionario alta gama", "BMW M km 0", "Mercedes-AMG ocasión", "Porsche 911 ocasión", "Audi RS6 ocasión", "coches deportivos"],
  openGraph: { title, description, type: "website", locale: "es_ES", siteName: "High Cars" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0e0e10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${instrumentSans.variable} ${instrumentSerif.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <body className="grain min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
