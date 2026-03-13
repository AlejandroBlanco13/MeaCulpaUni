import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { HomeHero } from "@/components/home-hero";
import { ScrollSection } from "@/components/scroll-section";
import {
  Package,
  Newspaper,
  Users,
  Store,
  Coins,
  Swords,
  Shield,
  BookOpen,
  Trophy,
} from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  const sections = [
    {
      href: "/inventario",
      label: "Inventario",
      icon: Package,
      desc: "Gestiona tus objetos y equipo",
    },
    {
      href: "/noticias",
      label: "Noticias",
      icon: Newspaper,
      desc: "Apartado de noticias y novedades",
    },
    {
      href: "/personajes",
      label: "Personajes",
      icon: Users,
      desc: "2 personajes gratis, más por suscripción",
    },
    {
      href: "/tiendas",
      label: "Tiendas",
      icon: Store,
      desc: "Varias tiendas del reino",
    },
    {
      href: "/gremios",
      label: "Gremios",
      icon: Users,
      desc: "Grupos, chat e inventario compartido",
    },
    {
      href: "/economia",
      label: "Economía",
      icon: Coins,
      desc: "Tu cartera y transacciones",
    },
    {
      href: "/nivel",
      label: "Nivel",
      icon: Swords,
      desc: "Principiante y experimentado",
    },
  ];

  const highlights = [
    {
      icon: BookOpen,
      title: "Todo en un campamento",
      text: "Inventario, gremios, tiendas y economía en un solo lugar para tu partida.",
    },
    {
      icon: Shield,
      title: "Seguro y sencillo",
      text: "Gestiona personajes, objetos y monedas sin perder el hilo de la aventura.",
    },
    {
      icon: Trophy,
      title: "Para maestros y jugadores",
      text: "Herramientas pensadas tanto para DMs como para jugadores de mesa.",
    },
  ];

  return (
    <div className="space-y-0">
      {/* Sección 1: Hero interactivo a pantalla completa */}
      <HomeHero loggedIn={!!session} />

      {/* Sección 2: Destacados con scroll storytelling */}
      <ScrollSection
        id="destacados"
        animation="fade-up"
        sticky
        background={
          <Image
            src="/IMG/Homepage/dragons-fantasy-artificial-intelligence-image.jpg"
            alt="Dragón entre rocas"
            fill
            className="object-cover"
          />
        }
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Lado izquierdo: texto épico / storytelling */}
          <div className="space-y-4 text-left">
            <p className="text-gold text-sm uppercase tracking-[0.3em]">
              El campamento del dragón
            </p>
            <h2 className="font-medieval text-3xl md:text-4xl text-gold">
              Todo lo que tu mesa necesita
            </h2>
            <p className="text-foreground/80 max-w-md">
              Inventario, gremios, economía y noticias de la campaña reunidos
              en un solo lugar. Mientras el dragón ruge al fondo, tus
              aventureros mantienen el control.
            </p>
          </div>

          {/* Lado derecho: tarjetas con ligera animación de scale (solo CSS) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="card-parchment p-5 text-center flex flex-col items-center gap-3 hover:scale-105 hover:shadow-2xl transition-transform duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-dnd-gold/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-dnd-gold" />
                </div>
                <h3 className="font-medieval text-lg font-semibold text-dnd-ink">
                  {title}
                </h3>
                <p className="text-dnd-ink/75 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Sección 3: Accesos rápidos con animación de slide */}
      <ScrollSection
        id="explora"
        animation="slide-left"
        minHeightClass="min-h-[80vh]"
      >
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="font-medieval text-2xl md:text-3xl font-bold text-dnd-ink">
              Explora el reino
            </h2>
            <p className="text-dnd-ink/75 mt-2 max-w-xl mx-auto">
              Accede a inventario, noticias, personajes, tiendas, gremios y más.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sections.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group card-parchment p-6 flex flex-col items-start gap-3 hover:border-dnd-gold/50 hover:shadow-xl transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-lg bg-dnd-gold/15 flex items-center justify-center group-hover:bg-dnd-gold/25 transition-colors">
                  <Icon className="w-6 h-6 text-dnd-gold" />
                </div>
                <h3 className="font-medieval text-lg font-semibold text-dnd-ink group-hover:text-dnd-ink">
                  {label}
                </h3>
                <p className="text-dnd-ink/70 text-sm leading-snug">{desc}</p>
                <span className="text-dnd-gold text-sm font-medium mt-auto">
                  Entrar →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Sección 4: CTA final */}
      {!session && (
        <ScrollSection id="cta" animation="scale" minHeightClass="min-h-[70vh]">
          <div className="card-parchment p-8 md:p-10 text-center max-w-xl mx-auto">
            <h2 className="font-medieval text-xl md:text-2xl font-bold text-dnd-ink mb-2">
              ¿Listo para organizar tu partida?
            </h2>
            <p className="text-dnd-ink/75 mb-6 max-w-md mx-auto">
              Crea tu cuenta gratis y empieza a usar inventario, personajes y
              gremios desde el primer día.
            </p>
            <Link
              href="/registro"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3"
            >
              Registrarse gratis
            </Link>
          </div>
        </ScrollSection>
      )}
    </div>
  );
}
