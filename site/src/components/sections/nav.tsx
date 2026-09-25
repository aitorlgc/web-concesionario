"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#asesor", label: "Tu asesor" },
  { href: "#stock", label: "Stock" },
  { href: "#como-trabajamos", label: "Cómo trabajamos" },
  { href: "#contacto", label: "Contacto" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-wide text-lg font-extrabold tracking-tight", className)}>
      HIGH<span className="text-primary">·</span>CARS
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ease-out",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#inicio" aria-label="High Cars, volver al inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-foreground/75 transition-colors duration-200 ease-out hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contacto">Hablar con un asesor</a>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-surface-deep p-6 duration-300 ease-(--ease-drawer) data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
                <div className="flex items-center justify-between">
                  <Logo />
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" aria-label="Cerrar menú">
                      <X className="size-5" />
                    </Button>
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">Menú</Dialog.Title>
                <Dialog.Description className="sr-only">Secciones de la página</Dialog.Description>
                <ul className="mt-12 flex flex-col gap-2">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="font-wide block py-3 text-2xl font-bold"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-auto">
                  <a href="#contacto" onClick={() => setOpen(false)}>
                    Hablar con un asesor
                  </a>
                </Button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
