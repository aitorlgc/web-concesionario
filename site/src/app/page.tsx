import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Asesor } from "@/components/sections/asesor";
import { Stock } from "@/components/sections/stock";
import { Metodo } from "@/components/sections/metodo";
import { Opiniones } from "@/components/sections/opiniones";
import { Contacto } from "@/components/sections/contacto";
import { Footer } from "@/components/sections/footer";
import { STOCK } from "@/lib/stock";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "High Cars",
  description: "Concesionario de coches alemanes de alta gama en km 0 y de ocasión.",
  email: "hola@highcars.es",
  telephone: "+34600000000",
  makesOffer: STOCK.map((c) => ({
    "@type": "Offer",
    price: c.price,
    priceCurrency: "EUR",
    itemOffered: { "@type": "Car", name: `${c.brand} ${c.model}`, vehicleModelDate: String(c.year), mileageFromOdometer: { "@type": "QuantitativeValue", value: c.km, unitCode: "KMT" } },
  })),
};

export default function Home() {
  return (
    <>
      <a
        href="#asesor"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <Hero />
        <Asesor />
        <Stock />
        <Metodo />
        <Opiniones />
        <Contacto />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
