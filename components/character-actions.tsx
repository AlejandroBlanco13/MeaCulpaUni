"use client";

import { useMemo, useState } from "react";
import { Eye, Sword, Shield, Sparkles, Heart, ArrowUp, X } from "lucide-react";
import { useRouter } from "next/navigation";

type CharacterActionsProps = {
  character: {
    id: string;
    name: string;
    class_type: string | null;
    level: number;
  };
  inventoryItems: {
    id: string;
    item_id: string;
    quantity: number;
  }[];
};

type ClassStats = {
  hp: number;
  mana: number;
  atk: number;
  def: number;
  spd: number;
};

const CLASS_BASE: Record<string, ClassStats> = {
  Guerrero: { hp: 120, mana: 30, atk: 16, def: 14, spd: 8 },
  Mago: { hp: 75, mana: 120, atk: 19, def: 7, spd: 10 },
  Ladron: { hp: 90, mana: 45, atk: 14, def: 9, spd: 16 },
  Clerigo: { hp: 100, mana: 90, atk: 12, def: 12, spd: 9 },
  Explorador: { hp: 95, mana: 55, atk: 15, def: 10, spd: 13 },
  Bardo: { hp: 88, mana: 80, atk: 11, def: 9, spd: 14 },
  "Sin clase": { hp: 85, mana: 50, atk: 12, def: 10, spd: 10 },
};

function getStats(classType: string | null, level: number) {
  const normalizedClass = classType?.trim() || "Sin clase";
  const base = CLASS_BASE[normalizedClass] ?? CLASS_BASE["Sin clase"];
  return {
    hp: base.hp + level * 12,
    mana: base.mana + level * 8,
    atk: base.atk + level * 2,
    def: base.def + Math.floor(level * 1.5),
    spd: base.spd + Math.floor(level * 1.2),
  };
}

function getXpForNextLevel(level: number) {
  return level * 100 + (level - 1) * 25;
}

export function CharacterActions({ character, inventoryItems }: CharacterActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(character.level);
  const [loadingLevel, setLoadingLevel] = useState(false);
  const [error, setError] = useState("");

  const classType = character.class_type?.trim() || "Sin clase";
  const stats = useMemo(() => getStats(classType, level), [classType, level]);
  const xpNext = useMemo(() => getXpForNextLevel(level), [level]);

  async function handleLevelUp() {
    setError("");
    setLoadingLevel(true);
    const res = await fetch(`/api/personajes/${character.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "level_up" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No se pudo subir el nivel.");
      setLoadingLevel(false);
      return;
    }
    setLevel(data.level ?? level + 1);
    setLoadingLevel(false);
    router.refresh();
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded border border-dnd-ink/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-dnd-ink/80 hover:bg-dnd-ink/10"
        >
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            Ver heroe
          </span>
        </button>
        <button
          type="button"
          onClick={handleLevelUp}
          disabled={loadingLevel}
          className="rounded border border-dnd-gold/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-dnd-gold hover:bg-dnd-gold/10 disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5" />
            {loadingLevel ? "Subiendo..." : "Subir nivel"}
          </span>
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-dnd-red">{error}</p>}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de ${character.name}`}
            className="w-full max-w-2xl card-parchment p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dnd-ink/60">Ficha del heroe</p>
                <h3 className="font-medieval text-2xl text-dnd-ink">{character.name}</h3>
                <p className="text-sm text-dnd-ink/70">
                  Clase: {classType} · Nivel actual: {level}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-dnd-ink/25 p-1.5 text-dnd-ink/70 hover:bg-dnd-ink/10"
                aria-label="Cerrar detalle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-dnd-ink/15 bg-black/20 p-3">
                <p className="mb-2 text-xs uppercase tracking-wider text-dnd-ink/60">Estadisticas</p>
                <ul className="space-y-1.5 text-sm text-dnd-ink/85">
                  <li className="inline-flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-red-300" /> Vida: {stats.hp}
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> Mana: {stats.mana}
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <Sword className="h-3.5 w-3.5 text-amber-300" /> Ataque: {stats.atk}
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-emerald-300" /> Defensa: {stats.def}
                  </li>
                  <li>Velocidad: {stats.spd}</li>
                </ul>
              </div>

              <div className="rounded border border-dnd-ink/15 bg-black/20 p-3">
                <p className="mb-2 text-xs uppercase tracking-wider text-dnd-ink/60">Progreso de nivel</p>
                <p className="text-sm text-dnd-ink/85">XP para siguiente nivel: {xpNext}</p>
                <p className="mt-2 text-xs text-dnd-ink/65">
                  Formula: XP siguiente = (nivel x 100) + ((nivel - 1) x 25)
                </p>
                <button
                  type="button"
                  onClick={handleLevelUp}
                  disabled={loadingLevel}
                  className="mt-3 rounded border border-dnd-gold/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-dnd-gold hover:bg-dnd-gold/10 disabled:opacity-60"
                >
                  {loadingLevel ? "Subiendo..." : "Subir nivel ahora"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded border border-dnd-ink/15 bg-black/20 p-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-dnd-ink/60">Inventario disponible</p>
              {!inventoryItems.length ? (
                <p className="text-sm text-dnd-ink/70">No hay objetos en el inventario.</p>
              ) : (
                <ul className="grid gap-2 text-sm text-dnd-ink/85 sm:grid-cols-2">
                  {inventoryItems.slice(0, 12).map((item) => (
                    <li key={item.id} className="rounded border border-dnd-ink/10 px-2 py-1">
                      Item #{item.item_id} x{item.quantity}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-dnd-ink/60">
                Nota: el inventario actual del sistema es por usuario y se muestra para consulta del heroe.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
