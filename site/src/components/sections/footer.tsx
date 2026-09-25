// TODO: enlazar los perfiles reales de redes sociales.
const REDES = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <nav aria-label="Secciones" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-foreground/75">
            <a href="#asesor" className="hover:text-foreground">Tu asesor</a>
            <a href="#stock" className="hover:text-foreground">Stock</a>
            <a href="#como-trabajamos" className="hover:text-foreground">Cómo trabajamos</a>
            <a href="#contacto" className="hover:text-foreground">Contacto</a>
          </nav>
          <ul className="flex gap-6 text-sm">
            {REDES.map((r) => (
              <li key={r.label}>
                <a href={r.href} className="text-foreground/75 hover:text-accent">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden="true"
          className="font-wide mt-16 text-[min(12.4vw,11.5rem)] leading-[0.8] font-extrabold tracking-[-0.04em] whitespace-nowrap text-foreground/[0.07] select-none"
        >
          HIGH CARS
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} High Cars. Concesionario independiente. BMW, Mercedes-AMG, Porsche y Audi son marcas de sus respectivos titulares.</p>
          <p>Precios con IVA. Cuotas orientativas: 20 % de entrada, 48 meses, TIN 6,99 %.</p>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Hecha con Claude Web Builder de{" "}
          <a href="https://tododeia.com" className="underline underline-offset-4 hover:text-foreground">
            Tododeia
          </a>
        </p>
      </div>
    </footer>
  );
}
