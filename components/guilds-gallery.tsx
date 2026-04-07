"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Sword,
  Wand2,
  Skull,
  Hammer,
  Sun,
  Compass,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FACTION_LABEL,
  FACTION_ORDER,
  type GuildFaction,
  getFactionForGuild,
  getGuildDisplayLevel,
  getGuildRarity,
  getGuildTags,
} from "@/lib/guild-card-meta";

export type GuildRow = {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  memberCount: number;
  isMember: boolean;
  role: string | null;
};

const FACTION_ICONS: Record<GuildFaction, LucideIcon> = {
  guerreros: Sword,
  hechiceros: Wand2,
  asesinos: Skull,
  artesanos: Hammer,
  clerigos: Sun,
  exploradores: Compass,
};

/** Colores alineados al mock: acento por facción */
const FACTION_STYLE: Record<
  GuildFaction,
  {
    borderTop: string;
    iconWrap: string;
    icon: string;
    tagBorder: string;
    tagText: string;
    subtitle: string;
  }
> = {
  guerreros: {
    borderTop: "border-t-amber-500",
    iconWrap: "bg-amber-500/15",
    icon: "text-amber-400",
    tagBorder: "border-amber-500/45",
    tagText: "text-amber-200/90",
    subtitle: "text-amber-400/95",
  },
  hechiceros: {
    borderTop: "border-t-violet-500",
    iconWrap: "bg-violet-500/15",
    icon: "text-violet-300",
    tagBorder: "border-violet-400/45",
    tagText: "text-violet-200/90",
    subtitle: "text-violet-300/95",
  },
  asesinos: {
    borderTop: "border-t-fuchsia-500",
    iconWrap: "bg-fuchsia-500/15",
    icon: "text-fuchsia-300",
    tagBorder: "border-fuchsia-400/45",
    tagText: "text-fuchsia-200/90",
    subtitle: "text-fuchsia-300/95",
  },
  artesanos: {
    borderTop: "border-t-teal-400",
    iconWrap: "bg-teal-500/15",
    icon: "text-teal-300",
    tagBorder: "border-teal-400/45",
    tagText: "text-teal-100/90",
    subtitle: "text-teal-300/95",
  },
  clerigos: {
    borderTop: "border-t-lime-400",
    iconWrap: "bg-lime-500/15",
    icon: "text-lime-300",
    tagBorder: "border-lime-400/45",
    tagText: "text-lime-100/90",
    subtitle: "text-lime-300/95",
  },
  exploradores: {
    borderTop: "border-t-sky-500",
    iconWrap: "bg-sky-500/15",
    icon: "text-sky-300",
    tagBorder: "border-sky-400/45",
    tagText: "text-sky-100/90",
    subtitle: "text-sky-300/95",
  },
};

const RARITY_STYLE: Record<
  string,
  { label: string; wrap: string; text: string }
> = {
  legendario: {
    label: "Legendario",
    wrap: "border-amber-400/60 bg-amber-950/40",
    text: "text-amber-300",
  },
  epico: {
    label: "Épico",
    wrap: "border-violet-400/55 bg-violet-950/35",
    text: "text-violet-200",
  },
  raro: {
    label: "Raro",
    wrap: "border-sky-400/50 bg-sky-950/30",
    text: "text-sky-200",
  },
};

function enrich(g: GuildRow) {
  const faction = getFactionForGuild(g.id);
  const level = getGuildDisplayLevel(g.id, g.name);
  const rarity = getGuildRarity(g.id, g.name);
  const tags = getGuildTags(faction, g.id);
  return { ...g, faction, level, rarity, tags };
}

type Enriched = ReturnType<typeof enrich>;

export function GuildsGallery({ guilds }: { guilds: GuildRow[] }) {
  const [filter, setFilter] = useState<"todos" | GuildFaction>("todos");

  const list = useMemo(() => guilds.map(enrich), [guilds]);

  const filtered = useMemo(() => {
    if (filter === "todos") return list;
    return list.filter((g) => g.faction === filter);
  }, [list, filter]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm text-neutral-300/90 sm:text-base">
          Facciones conocidas del reino · Haz clic en un gremio para ver su registro completo
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => setFilter("todos")}
          className={cn(
            "rounded-lg px-3.5 py-2 text-xs font-medium text-neutral-100 transition sm:text-sm",
            "bg-neutral-800/90 hover:bg-neutral-700/90",
            filter === "todos" ? "ring-2 ring-white/90 ring-offset-2 ring-offset-[#121212]" : "ring-0"
          )}
        >
          Todos los gremios
        </button>
        {FACTION_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-xs font-medium text-neutral-100 transition sm:text-sm",
              "bg-neutral-800/90 hover:bg-neutral-700/90",
              filter === key ? "ring-2 ring-white/90 ring-offset-2 ring-offset-[#121212]" : "ring-0"
            )}
          >
            {FACTION_LABEL[key]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-neutral-400">
          No hay gremios en esta categoría.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GuildCard key={g.id} g={g} />
          ))}
        </ul>
      )}

      <div className="flex justify-center pt-2">
        <Link
          href="/gremios/nuevo"
          className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/95"
        >
          <Plus className="w-4 h-4" />
          Crear gremio
        </Link>
      </div>
    </div>
  );
}

function GuildCard({ g }: { g: Enriched }) {
  const st = FACTION_STYLE[g.faction];
  const rr = RARITY_STYLE[g.rarity] ?? RARITY_STYLE.raro;
  const Icon = FACTION_ICONS[g.faction];
  const href = g.isMember ? `/gremios/${g.id}` : `/gremios/${g.id}/unirse`;
  const blurb =
    g.description?.trim() ||
    "Una facción aún sin testimonio detallado en los archivos del reino. Haz clic para abrir su registro.";

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-900/80",
          "shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition hover:border-neutral-500/60 hover:bg-neutral-800/85",
          "border-t-[3px]",
          st.borderTop
        )}
      >
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                st.iconWrap
              )}
            >
              <Icon className={cn("h-5 w-5", st.icon)} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medieval text-lg font-bold leading-tight text-neutral-50 sm:text-xl">
                {g.name}
              </h3>
              <p
                className={cn(
                  "mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px]",
                  st.subtitle
                )}
              >
                {FACTION_LABEL[g.faction]} · NV. {g.level}
              </p>
            </div>
          </div>

          <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-neutral-200/95">
            {blurb}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {g.tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  st.tagBorder,
                  st.tagText
                )}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-neutral-700/40 pt-4">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Users className="h-3.5 w-3.5 shrink-0 opacity-80" />
              {g.memberCount} miembros
            </span>
            <span
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                rr.wrap,
                rr.text
              )}
            >
              {rr.label}
            </span>
          </div>

          {g.isMember && (
            <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-wider text-dnd-forest">
              En tu compañía
              {g.role ? ` · ${g.role}` : ""}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
