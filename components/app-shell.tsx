"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SessionUser } from "@/lib/auth";
import {
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  Package,
  Newspaper,
  Users,
  Store,
  Coins,
  Swords,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Inicio", icon: Swords },
  { href: "/inventario", label: "Inventario", icon: Package },
  { href: "/noticias", label: "Noticias", icon: Newspaper },
  { href: "/personajes", label: "Personajes", icon: Users },
  { href: "/tiendas", label: "Tiendas", icon: Store },
  { href: "/gremios", label: "Gremios", icon: Users },
  { href: "/economia", label: "Economía", icon: Coins },
  { href: "/nivel", label: "Nivel", icon: Shield },
];

export function AppShell({
  session,
  children,
}: {
  session: { user: SessionUser } | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar: botón hamburguesa arriba a la derecha con Entrar / Registrarse dentro */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/75 via-black/40 to-transparent">
        <div className="mx-auto flex h-14 items-center justify-end pr-3 sm:pr-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-dnd-ink/40 bg-black/60 text-dnd-ink hover:bg-black"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute right-0 top-14 z-50 w-full max-w-xs pr-2">
            <div className="medieval-border parchment-texture rounded-lg p-4 bg-dnd-parchment/95 space-y-4">
              <nav className="flex flex-col gap-1">
                {nav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors",
                      pathname === href
                        ? "bg-dnd-gold/30 text-dnd-ink"
                        : "text-dnd-ink/80 hover:bg-dnd-ink/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-dnd-ink/30 pt-3 flex flex-col gap-2">
                {session ? (
                  <>
                    <span className="text-xs text-dnd-ink/80 break-all">
                      {session.user?.email}
                    </span>
                    {session.user?.walletBalance != null && (
                      <span className="text-sm text-dnd-forest font-medium">
                        {session.user.walletBalance} monedas
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        void handleSignOut();
                      }}
                      className="mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-dnd-ink/10 text-dnd-red"
                    >
                      <LogOut className="w-4 h-4" />
                      Salir
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-dnd-ink/10 text-dnd-ink"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setMenuOpen(false)}
                      className="btn-gold flex items-center justify-center gap-2 px-3 py-2 rounded-md"
                    >
                      <UserPlus className="w-4 h-4" />
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 px-0 snap-y snap-mandatory">{children}</main>
    </div>
  );
}
