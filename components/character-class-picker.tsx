"use client";

import Image from "next/image";
import { CHARACTER_CLASSES, getPortraitForClass } from "@/lib/character-classes";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  /** Si es false, no se muestra la mini vista previa encima de la cuadrícula (útil junto a `CharacterHeroPreview`). */
  showPreview?: boolean;
  /** Nombre del héroe para la mini vista previa (solo si showPreview). */
  heroName?: string;
};

export function CharacterClassPicker({
  value,
  onChange,
  disabled,
  id,
  showPreview = true,
  heroName = "",
}: Props) {
  const selected = CHARACTER_CLASSES.find((c) => c.value === value);

  return (
    <div id={id} className="space-y-4">
      {showPreview && (
        <div
          className="flex gap-3 rounded-lg border border-dnd-ink/20 bg-black/15 p-3 sm:gap-4"
          aria-hidden
        >
          <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md border border-dnd-gold/35 sm:h-32 sm:w-24">
            <Image
              src={selected?.image ?? getPortraitForClass(null)}
              alt=""
              fill
              className="object-cover object-top opacity-90"
              sizes="96px"
            />
            {!selected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] uppercase tracking-wide text-white/80">
                ?
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-1 flex-col justify-center text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dnd-ink/55">
              Vista previa rápida
            </p>
            <p className="truncate font-medieval text-lg text-dnd-ink sm:text-xl">
              {heroName.trim() || "Sin nombre"}
            </p>
            <p className="truncate text-sm text-dnd-ink/75">{selected?.label ?? "Elige un retrato"}</p>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
        role="group"
        aria-label="Elegir clase"
      >
      {CHARACTER_CLASSES.map((c) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(c.value)}
            className={cn(
              "group relative overflow-hidden rounded-lg border-2 bg-black/20 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dnd-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4e6c8]",
              selected
                ? "border-dnd-gold shadow-[0_0_0_1px_rgba(212,175,55,0.5)]"
                : "border-dnd-ink/20 hover:border-dnd-gold/60"
            )}
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 160px"
                className="object-cover object-top transition opacity-95 group-hover:opacity-100"
              />
              {selected && (
                <div className="absolute inset-0 bg-gradient-to-t from-dnd-gold/35 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
            <p
              className={cn(
                "px-1.5 py-2 text-center text-[11px] font-semibold uppercase tracking-wide sm:text-xs",
                selected ? "text-dnd-ink" : "text-dnd-ink/85"
              )}
            >
              {c.label}
            </p>
          </button>
        );
      })}
      </div>
    </div>
  );
}
