import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Package, Newspaper, Users, Store, Coins, Swords } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  const sections = [
    { href: "/inventario", label: "Inventario", icon: Package, desc: "Gestiona tus objetos y equipo" },
    { href: "/noticias", label: "Noticias", icon: Newspaper, desc: "Apartado de noticias y novedades" },
    { href: "/personajes", label: "Personajes", icon: Users, desc: "2 personajes gratis, más por suscripción" },
    { href: "/tiendas", label: "Tiendas", icon: Store, desc: "Varias tiendas del reino" },
    { href: "/gremios", label: "Gremios", icon: Users, desc: "Grupos, chat e inventario compartido" },
    { href: "/economia", label: "Economía", icon: Coins, desc: "Tu cartera y transacciones" },
    { href: "/nivel", label: "Nivel", icon: Swords, desc: "Principiante y experimentado" },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="font-medieval text-4xl md:text-5xl font-bold text-dnd-ink mb-2">
          Mea Culpa
        </h1>
        <p className="text-xl text-dnd-ink/80 max-w-2xl mx-auto">
          Tu campamento para Dungeons & Dragons: inventario, gremios, tiendas y economía.
        </p>
        {!session && (
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/registro" className="btn-gold inline-flex items-center gap-2">
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="border-2 border-dnd-ink/30 px-4 py-2 rounded font-medium hover:bg-dnd-ink/10"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="card-parchment p-6 flex flex-col items-start gap-2 hover:border-dnd-gold/50 transition-colors"
          >
            <Icon className="w-10 h-10 text-dnd-gold" />
            <h2 className="font-medieval text-lg font-semibold text-dnd-ink">{label}</h2>
            <p className="text-dnd-ink/70 text-sm">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
