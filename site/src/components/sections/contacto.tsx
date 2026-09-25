"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STOCK, nombre } from "@/lib/stock";
import { INTERES_EVENT } from "@/lib/interes";

// TODO: datos reales del concesionario.
const EMAIL = "hola@highcars.es";
const TELEFONO = "+34 600 000 000";
const WHATSAPP = "34600000000";

const field =
  "mt-2 w-full rounded-md border border-input bg-background/40 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-[border-color] duration-200 ease-out focus-visible:border-primary";

export function Contacto() {
  const [coche, setCoche] = useState("");
  const [enviado, setEnviado] = useState(false);
  const cocheRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const on = (e: Event) => {
      setCoche((e as CustomEvent<string>).detail);
      setEnviado(false);
    };
    window.addEventListener(INTERES_EVENT, on);
    return () => window.removeEventListener(INTERES_EVENT, on);
  }, []);

  const elegido = STOCK.find((c) => c.id === coche);

  // Sin backend: abre el correo con todo rellenado.
  // TODO: cambiar por Formspree (action="https://formspree.io/f/<id>") cuando haya cuenta.
  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const asunto = elegido ? `Quiero ver el ${nombre(elegido)}` : "Quiero hablar con un asesor";
    const cuerpo = [
      `Nombre: ${d.get("nombre")}`,
      `Teléfono: ${d.get("telefono")}`,
      `Email: ${d.get("email")}`,
      `Coche: ${elegido ? `${nombre(elegido)} (${elegido.estado})` : "Aún no lo sé"}`,
      "",
      String(d.get("mensaje") || ""),
    ].join("\n");
    window.location.assign(`mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`);
    setEnviado(true);
  };

  const waText = encodeURIComponent(
    elegido ? `Hola, me interesa el ${nombre(elegido)} que tenéis en stock.` : "Hola, quiero que me asesoréis con un coche."
  );

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="scroll-mt-16 bg-surface py-section">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 md:grid-cols-12 md:px-8">
        <div className="min-w-0 md:col-span-5">
          <p className="eyebrow text-accent">Contacto</p>
          <h2 id="contacto-title" className="font-wide mt-4 text-fluid-section leading-[0.95] font-extrabold uppercase">
            Ven a verlo. O te lo acercamos.
          </h2>
          <p className="mt-6 max-w-sm text-foreground/80">
            Déjanos tus datos y te llamamos hoy mismo. Si lo prefieres, escríbenos por WhatsApp: contesta una
            persona, no un bot.
          </p>

          <ul className="mt-10 space-y-4 text-foreground/90">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-200 ease-out hover:text-accent"
              >
                <MessageCircle className="size-5 text-accent" aria-hidden="true" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${TELEFONO.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 transition-colors duration-200 ease-out hover:text-accent">
                <Phone className="size-5 text-accent" aria-hidden="true" /> {TELEFONO}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 transition-colors duration-200 ease-out hover:text-accent">
                <Mail className="size-5 text-accent" aria-hidden="true" /> {EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-10 text-sm text-foreground/60">Visitas con cita previa · Lunes a sábado, de 10:00 a 20:00</p>
        </div>

        <form onSubmit={enviar} className="rounded-lg bg-background/50 p-6 md:col-span-6 md:col-start-7 md:p-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
              <input id="nombre" name="nombre" required autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
              <input id="telefono" name="telefono" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">Correo</label>
              <input id="email" name="email" type="email" required autoComplete="email" spellCheck={false} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="coche" className="text-sm font-medium">Coche que te interesa</label>
              <select
                ref={cocheRef}
                id="coche"
                name="coche"
                value={coche}
                onChange={(e) => setCoche(e.target.value)}
                className={`${field} cursor-pointer appearance-none`}
              >
                <option value="">Aún no lo sé, asesoradme</option>
                {STOCK.map((c) => (
                  <option key={c.id} value={c.id}>
                    {nombre(c)} · {c.estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="mensaje" className="text-sm font-medium">Mensaje <span className="text-muted-foreground">(opcional)</span></label>
              <textarea id="mensaje" name="mensaje" rows={4} className={field} placeholder="Cuándo te viene bien, si tienes coche para entregar…" />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
            {elegido ? `Pedir cita para ver el ${elegido.model}` : "Quiero que me llaméis"}
          </Button>
          <p className="mt-4 text-sm text-foreground/60" aria-live="polite">
            {enviado ? "Se ha abierto tu correo con el mensaje listo. Solo falta darle a enviar." : "Tus datos solo se usan para contactarte sobre este coche."}
          </p>
        </form>
      </div>
    </section>
  );
}
