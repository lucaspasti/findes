"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Map,
  Anchor,
  Plane,
  Kanban,
  Train,
  Wrench,
  Factory,
  PlusCircle,
  PencilLine,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type Item = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: Item[] = [
  { label: "Mapa Geral", href: "/mapa", icon: Map },
  { label: "Portos", href: "/portos", icon: Anchor },
  { label: "Aeroportos", href: "/aeroportos", icon: Plane },
  { label: "Rodovias", href: "/rodovias", icon: Kanban },
  { label: "Ferrovias", href: "/ferrovias", icon: Train },
  { label: "Dutovias", href: "/dutovias", icon: Wrench },
  { label: "Apoio Econômico", href: "/apoio-economico", icon: Factory },
  { label: "Ativos", href: "/ativos/tabela", icon: PlusCircle },
  { label: "Projetos", href: "/projetos/tabela", icon: PencilLine },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* topo mobile: botão hamburguer */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-3 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Aside pathname={pathname} />
          </SheetContent>
        </Sheet>

        <span className="text-sm font-semibold">Painel</span>
      </div>

      {/* desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
        <Aside pathname={pathname} />
      </aside>
    </>
  );
}

function Aside({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-6 bg-blue-600 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_22-11.png"
          alt="Logo"
          className="h-10 w-auto object-contain"
        />

        <span className="text-sm font-medium text-white/80">by</span>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-8 rounded-md bg-white p-1 shadow-sm"
        />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "justify-start gap-3 rounded-xl px-3 py-2 text-base",
                  active
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Infra Monitor
        </p>
      </div>
    </div>
  );
}
