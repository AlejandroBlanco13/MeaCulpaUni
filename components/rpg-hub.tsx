import Link from "next/link";
import Image from "next/image";
import type { SessionUser } from "@/lib/auth";
import {
  Users,
  Package,
  Shield,
  Coins,
  UsersRound,
  Store,
  Newspaper,
  ScrollText,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RpgHubHeader } from "@/components/rpg-hub-header";
import heroBg from "@/app/IMG/Homepage/fantasy-style-character-fire.jpg";

export type LatestNewsItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

const MESA_CAPITULOS: {
  num: string;
  href: string;
  title: string;
  subtitle: string;
  Icon: typeof Users;
}[] = [
  {
    num: "I",
    href: "/personajes",
    title: "Los heroes",
    subtitle: "Crea y gestiona tus personajes: clase, nombre y hoja de aventurero.",
    Icon: Users,
  },
  {
    num: "II",
    href: "/inventario",
    title: "Equipo e items",
    subtitle: "Armas, objetos y tesoros que portas en la campana.",
    Icon: Package,
  },
  {
    num: "III",
    href: "/nivel",
    title: "Progreso",
    subtitle: "Nivel, experiencia y el camino que recorre tu personaje.",
    Icon: Shield,
  },
  {
    num: "IV",
    href: "/economia",
    title: "Tesoreria",
    subtitle: "Monedas del reino: tu bolsa y la economia de la partida.",
    Icon: Coins,
  },
  {
    num: "V",
    href: "/gremios",
    title: "La compania",
    subtitle: "Gremios y aliados: el grupo que acompana tu gesta.",
    Icon: UsersRound,
  },
  {
    num: "VI",
    href: "/tiendas",
    title: "Mercaderes",
    subtitle: "Tiendas y mercados donde gastar tu oro.",
    Icon: Store,
  },
  {
    num: "VII",
    href: "/noticias",
    title: "Rumores y tablon",
    subtitle: "Noticias del mundo: ganchos de aventura y avisos del DM.",
    Icon: Newspaper,
  },
  {
    num: "VIII",
    href: "/leyenda",
    title: "Cronicas",
    subtitle: "La leyenda del reino: lore y ambientacion de la campana.",
    Icon: ScrollText,
  },
];

const PLACEHOLDER_EVENTS = [
  "El tablon de rumores aguarda al DM",
  "Nuevas gestas se publicaran aqui",
  "Explora el reino en las noticias",
];

function EventsStrip({ items }: { items: LatestNewsItem[] }) {
  const slots: { key: string; title: string; date: string; href: string; isPlaceholder?: boolean }[] = [];

  for (let i = 0; i < 3; i++) {
    const n = items[i];
    if (n) {
      slots.push({
        key: n.id,
        title: n.title,
        date: new Date(n.created_at).toLocaleDateString("es", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        href: `/noticias/${n.slug}`,
      });
    } else {
      slots.push({
        key: `placeholder-${i}`,
        title: PLACEHOLDER_EVENTS[i] ?? "Consulta el tablon de rumores",
        date: "-",
        href: "/noticias",
        isPlaceholder: true,
      });
    }
  }

  return (
    <div className="realms-events-strip border-t border-amber-600/30 bg-black/70 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-amber-600/25 sm:py-5">
        {slots.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className={cn(
              "group flex flex-col gap-1 px-2 text-center sm:px-4 transition-colors hover:bg-white/5",
              s.isPlaceholder && "opacity-80"
            )}
          >
            <span className="inline-flex items-center justify-center self-center rounded-full border border-amber-500/40 bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200/90">
              Aviso
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">{s.date}</span>
            <span className="text-sm text-white/75 group-hover:text-amber-200/95 line-clamp-2">{s.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RpgHub({
  user,
  latestNews = [],
}: {
  user: SessionUser;
  latestNews?: LatestNewsItem[];
}) {
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Aventurero";
  const editionDate = "4/3/2026";

  return (
    <div className="min-h-screen bg-[#0a0806] text-dnd-ink">
      <RpgHubHeader displayName={displayName} walletBalance={user.walletBalance} />

      <section className="relative min-h-[100svh] flex flex-col">
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt="Heroe en armadura ante un paisaje de fantasia oscura"
            fill
            priority
            className="object-cover object-[center_20%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/90" aria-hidden />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-48 pt-28 text-center sm:px-6 sm:pb-56 md:pt-32">
          <p className="mb-3 font-medieval text-xs uppercase tracking-[0.45em] text-amber-400/90 drop-shadow-md">
            Tu campamento para Dungeons &amp; Dragons
          </p>
          <h1 className="realms-hero-title font-medieval text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            MEA CULPA
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-white/90">
            <span className="text-amber-500/90" aria-hidden>
              ◆
            </span>
            <span className="font-medieval italic tracking-wide">Fantasy Realms</span>
            <span className="text-amber-500/90" aria-hidden>
              ◆
            </span>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base md:max-w-xl">
            Bienvenidos al campamento. Aqui podreis gestionar inventario, uniros a gremios y visitar las tiendas.
            Cada seccion del reino sigue el orden de una campana RPG para que la aventura se sienta viva.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="#mesa-capitulos"
              className="realms-btn realms-btn-primary inline-flex min-w-[200px] items-center justify-center px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-100"
            >
              A la mesa
            </a>
            <Link
              href="/cronicas"
              className="realms-btn realms-btn-outline inline-flex min-w-[200px] items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/95"
            >
              <Video className="h-4 w-4 opacity-90" aria-hidden />
              Ver cronicas
            </Link>
          </div>

          <div className="mt-9 inline-flex flex-col items-center gap-2 rounded-sm border border-amber-500/35 bg-black/40 px-5 py-3 text-center shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
            <p className="font-medieval text-[11px] uppercase tracking-[0.32em] text-amber-300/90">
              Bienvenidos a Mea Culpa
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/65">
              Edicion {editionDate}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <EventsStrip items={latestNews} />
        </div>
      </section>

      <section
        id="mesa-capitulos"
        className="relative border-t border-amber-900/40 bg-gradient-to-b from-[#0f0c0a] to-[#050403] px-4 py-16 sm:px-6"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="font-medieval text-xs uppercase tracking-[0.35em] text-amber-500/80">Orden de campana</p>
            <h2 className="mt-2 font-medieval text-2xl font-bold text-dnd-ink sm:text-3xl">
              Elige tu proximo paso, {displayName}
            </h2>
            <p className="mt-2 text-sm text-dnd-ink/65">
              Personaje, equipo, progreso, tesoreria, compania, mercaderes, rumores y cronicas - en el orden de la mesa.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {MESA_CAPITULOS.map(({ num, href, title, subtitle, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group card-parchment card-destacado block h-full border border-black/50 p-5",
                    "hover:border-dnd-gold/35 transition-colors"
                  )}
                >
                  <div className="flex gap-4">
                    <span className="font-medieval text-2xl text-dnd-gold/50 w-10 shrink-0 tabular-nums" aria-hidden>
                      {num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start gap-2">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-dnd-gold" aria-hidden />
                        <h3 className="font-medieval text-lg text-dnd-ink transition-colors group-hover:text-dnd-gold">
                          {title}
                        </h3>
                      </div>
                      <p className="pl-7 text-sm leading-snug text-dnd-ink/65">{subtitle}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          <footer className="mt-12 rounded-sm border border-dnd-gold/20 bg-black/20 px-4 py-4">
            <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <p className="font-medieval text-xs uppercase tracking-[0.25em] text-dnd-ink/55">
                Bienvenidos a Mea Culpa
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-dnd-ink/45">
                Campamento RPG · {editionDate}
              </p>
              <p className="font-medieval text-xs uppercase tracking-[0.25em] text-dnd-gold/70">
                Que los dados te sean favorables
              </p>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
