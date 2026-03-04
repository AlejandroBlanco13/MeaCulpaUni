"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SessionUser } from "@/lib/auth";
import {
  Package,
  Newspaper,
  Users,
  Store,
  Coins,
  Swords,
  LogIn,
  LogOut,
  UserPlus,
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
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b-2 border-dnd-ink/20 bg-dnd-parchment sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/" className="font-medieval text-xl font-bold text-dnd-ink">
            Mea Culpa
          </Link>
          <nav className="hidden md:flex gap-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors",
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
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <span className="text-sm text-dnd-ink/80 hidden sm:inline">
                  {session.user?.email}
                </span>
                {session.user?.walletBalance != null && (
                  <span className="text-sm text-dnd-forest font-medium">
                    {session.user.walletBalance} monedas
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-dnd-ink/10 text-dnd-red"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-dnd-ink/10"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  className="flex items-center gap-2 px-3 py-2 rounded btn-gold"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
