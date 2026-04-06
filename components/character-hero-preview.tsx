"use client";

import Image from "next/image";
import { CHARACTER_CLASSES, getPortraitForClass } from "@/lib/character-classes";
import { cn } from "@/lib/utils";

type Props = {
  /** Valor de clase actual del selector (cadena vacía si aún no hay) */
  classValue: string;
  /** Nombre tecleado; si está vacío se muestra un placeholder */
  heroName: string;
  className?: string;
};

/**
 * Vista previa grande del héroe: mismo concepto que la tarjeta del registro (retrato + nombre + clase).
 */
export function CharacterHeroPreview({ classValue, heroName, className }: Props) {
  const portrait = getPortraitForClass(classValue || null);
  const classRow = CHARACTER_CLASSES.find((c) => c.value === classValue);
  const nameDisplay = heroName.trim() || "Nombre del héroe";
  const classDisplay = classRow?.label ?? "Toca un retrato abajo";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-2 border-dnd-gold/45 bg-gradient-to-b from-black/35 to-black/55 shadow-[0_12px_36px_rgba(0,0,0,0.45)] ring-1 ring-dnd-gold/20",
        className
      )}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={portrait}
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 280px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120f]/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 pt-12 text-center">
          <p className="font-medieval truncate text-xl font-bold text-[#f4e8dc] drop-shadow-md sm:text-2xl">
            {nameDisplay}
          </p>
          <p className="mt-1 text-sm font-medium text-amber-200/90 drop-shadow">{classDisplay}</p>
        </div>
      </div>
      <p className="border-t border-dnd-gold/25 bg-black/30 px-3 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-dnd-ink/60">
        Vista previa · Registro de héroes
      </p>
    </div>
  );
}
