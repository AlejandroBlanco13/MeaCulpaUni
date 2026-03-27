"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Menu, X, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/noticias", label: "Rumores" },
  { href: "/personajes", label: "Héroes" },
  { href: "/inventario", label: "Equipo" },
  { href: "/nivel", label: "Progreso" },
  { href: "/tiendas", label: "Mercaderes" },
  { href: "/gremios", label: "Compañía" },
  { href: "/economia", label: "Tesorería" },
  { href: "/cronicas", label: "Crónicas" },
] as const;

export function RpgHubHeader({
  displayName,
  walletBalance,
}: {
  displayName: string;
  walletBalance: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 group" onClick={() => setOpen(false)}>
          <span className="font-medieval text-lg sm:text-xl font-bold tracking-wide text-white drop-shadow-sm">
            MEA CULPA
          </span>
          <div className="mt-0.5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-400/95">
            <span className="text-amber-500/80" aria-hidden>
              ◆
            </span>
            <span className="hidden sm:inline">Dungeons &amp; Dragons</span>
            <span className="sm:hidden">D&amp;D</span>
            <span className="text-amber-500/80" aria-hidden>
              ◆
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-amber-400",
                    pathname === href && "text-amber-400"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 rounded border border-amber-500/35 bg-black/40 px-2.5 py-1 text-xs text-amber-200/90"
            title="Bolsa del reino"
          >
            <Coins className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            <span className="font-medieval tabular-nums">{walletBalance}</span>
          </div>
          <span className="hidden md:inline max-w-[140px] truncate text-xs text-white/60" title={displayName}>
            {displayName}
          </span>
          <a
            href="#mesa-capitulos"
            className="realms-play-btn hidden sm:inline-flex items-center justify-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400"
            onClick={() => setOpen(false)}
          >
            A la mesa
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="hidden sm:inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1.5 text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Salir</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black/92 px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2.5 text-sm font-semibold uppercase tracking-wider text-white/90",
                    pathname === href && "text-amber-400"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="#mesa-capitulos"
                className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-amber-400"
                onClick={() => setOpen(false)}
              >
                A la mesa
              </a>
            </li>
            <li className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 py-2.5 text-sm text-red-300/90"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
