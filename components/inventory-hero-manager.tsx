"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Save, Shield, Sword, User2, Sparkles, ScrollText } from "lucide-react";

type Hero = {
  id: string;
  name: string;
  classType: string | null;
  level: number;
};

type InventoryItemView = {
  id: string;
  itemId: string;
  quantity: number;
  productName: string;
  characterId: string | null;
};

type Props = {
  heroes: Hero[];
  items: InventoryItemView[];
};

export function InventoryHeroManager({ heroes, items }: Props) {
  const router = useRouter();
  const [filterHeroId, setFilterHeroId] = useState<string>("all");
  const [assignments, setAssignments] = useState<Record<string, string>>(
    Object.fromEntries(items.map((item) => [item.id, item.characterId ?? ""]))
  );
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visibleItems = useMemo(() => {
    if (filterHeroId === "all") return items;
    if (filterHeroId === "unassigned") return items.filter((item) => !item.characterId);
    return items.filter((item) => item.characterId === filterHeroId);
  }, [filterHeroId, items]);

  const summary = useMemo(() => {
    const assigned = items.filter((item) => item.characterId).length;
    return {
      total: items.length,
      assigned,
      unassigned: items.length - assigned,
    };
  }, [items]);

  async function saveAssignment(itemId: string) {
    setError("");
    setSavingItemId(itemId);

    const selectedHeroId = assignments[itemId] || null;
    const res = await fetch(`/api/inventario/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: selectedHeroId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar la asignacion.");
      setSavingItemId(null);
      return;
    }

    setSavingItemId(null);
    router.refresh();
  }

  if (!items.length) {
    return (
      <div className="overflow-hidden rounded-md border border-dnd-ink/25 bg-black/25 shadow-[0_8px_28px_rgba(0,0,0,0.3)]">
        <div className="border-b border-dnd-gold/15 bg-gradient-to-br from-[#080808] via-[#140808] to-[#0a0a0a] px-6 py-6">
          <p className="text-xs uppercase tracking-[0.28em] text-dnd-gold/75">Arsenal del Aventurero</p>
          <h2 className="mt-2 font-medieval text-2xl text-dnd-ink sm:text-3xl">Cámara de Inventario</h2>
          <p className="mt-2 max-w-2xl text-sm text-dnd-ink/75">
            Cuando compres equipo o recibas recompensas de misión, aparecerán aquí para asignarlos a tus héroes.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-8 sm:grid-cols-3">
          <div className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Objetos</p>
            <p className="mt-1 font-medieval text-2xl text-dnd-ink">0</p>
          </div>
          <div className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Héroes Activos</p>
            <p className="mt-1 font-medieval text-2xl text-dnd-ink">{heroes.length}</p>
          </div>
          <div className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Estado</p>
            <p className="mt-1 font-medieval text-2xl text-dnd-ink">Vacío</p>
          </div>
        </div>

        <div className="border-t border-dnd-ink/15 bg-black/20 px-6 py-10 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-dnd-gold/65" />
          <p className="font-medieval text-2xl text-dnd-ink">Tu inventario está vacío</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dnd-ink/70">
            Visita la tienda para adquirir armas, reliquias y consumibles. Luego podrás asignarlos de forma táctica a
            cada héroe.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/tiendas"
              className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
            >
              <Sparkles className="h-4 w-4" />
              Ir a tiendas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md border border-dnd-ink/25 bg-black/25 shadow-[0_8px_28px_rgba(0,0,0,0.3)]">
        <div className="border-b border-dnd-gold/15 bg-gradient-to-br from-[#080808] via-[#140808] to-[#0a0a0a] px-6 py-6">
          <p className="text-xs uppercase tracking-[0.28em] text-dnd-gold/75">Gestión Táctica</p>
          <h2 className="mt-2 font-medieval text-2xl text-dnd-ink sm:text-3xl">Arsenal e Integración de Héroes</h2>
          <p className="mt-2 max-w-3xl text-sm text-dnd-ink/75">
            Asigna equipo por héroe para mantener una progresión ordenada. Cada cambio se guarda por ítem y respeta
            tu cuenta.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Objetos Totales</p>
            <p className="mt-2 inline-flex items-center gap-2 font-medieval text-2xl text-dnd-ink">
              <Package className="h-5 w-5 text-dnd-gold/80" />
              {summary.total}
            </p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Asignados</p>
            <p className="mt-2 inline-flex items-center gap-2 font-medieval text-2xl text-dnd-ink">
              <Shield className="h-5 w-5 text-emerald-300/90" />
              {summary.assigned}
            </p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Sin Asignar</p>
            <p className="mt-2 inline-flex items-center gap-2 font-medieval text-2xl text-dnd-ink">
              <ScrollText className="h-5 w-5 text-amber-300/90" />
              {summary.unassigned}
            </p>
          </article>
        </div>
      </section>

      <div className="card-parchment p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="hero-filter" className="text-xs uppercase tracking-wider text-dnd-ink/70">
            Filtrar por héroe
          </label>
          <select
            id="hero-filter"
            value={filterHeroId}
            onChange={(e) => setFilterHeroId(e.target.value)}
            className="min-w-[260px] rounded border border-dnd-ink/25 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500"
          >
            <option value="all">Todos los objetos</option>
            <option value="unassigned">Sin asignar</option>
            {heroes.map((hero) => (
              <option key={hero.id} value={hero.id}>
                {hero.name} (Nivel {hero.level})
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-sm text-dnd-ink/65">
          Selecciona el dueño del equipo y pulsa guardar. Esto te permite organizar builds por héroe.
        </p>
      </div>

      {error && <p className="text-sm text-dnd-red">{error}</p>}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => {
          const assignedHero = heroes.find((hero) => hero.id === item.characterId);
          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-md border border-dnd-ink/20 bg-black/25 shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
            >
              <div className="border-b border-dnd-ink/15 bg-black/25 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medieval text-xl text-dnd-ink">{item.productName}</p>
                  <span
                    className={
                      assignedHero
                        ? "rounded border border-emerald-300/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-200"
                        : "rounded border border-amber-300/50 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200"
                    }
                  >
                    {assignedHero ? "Asignado" : "Sin asignar"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-dnd-ink/65">
                  ID: {item.itemId} · Cantidad: x{item.quantity}
                </p>
              </div>

              <div className="space-y-3 px-4 py-4">
                <div className="rounded border border-dnd-ink/15 bg-black/20 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wider text-dnd-ink/60">Portador actual</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-dnd-ink/85">
                    <User2 className="h-3.5 w-3.5 text-dnd-gold/80" />
                    {assignedHero
                      ? `${assignedHero.name} · ${assignedHero.classType ?? "Sin clase"} · Nivel ${assignedHero.level}`
                      : "Sin asignar"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor={`assign-${item.id}`} className="text-xs uppercase tracking-wider text-dnd-ink/60">
                    Asignar a héroe
                  </label>
                  <select
                    id={`assign-${item.id}`}
                    value={assignments[item.id] ?? ""}
                    onChange={(e) =>
                      setAssignments((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-dnd-ink/25 bg-white px-2.5 py-2 text-sm text-black placeholder:text-neutral-500"
                  >
                    <option value="">Sin asignar</option>
                    {heroes.map((hero) => (
                      <option key={hero.id} value={hero.id}>
                        {hero.name} · {hero.classType ?? "Sin clase"} · Nivel {hero.level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1 text-xs text-dnd-ink/65">
                    <Sword className="h-3.5 w-3.5 text-amber-300/85" />
                    Gestión por ítem
                  </p>
                  <button
                    type="button"
                    onClick={() => saveAssignment(item.id)}
                    disabled={savingItemId === item.id}
                    className="rounded border border-dnd-gold/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-dnd-gold hover:bg-dnd-gold/10 disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Save className="h-3.5 w-3.5" />
                      {savingItemId === item.id ? "Guardando..." : "Guardar"}
                    </span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
