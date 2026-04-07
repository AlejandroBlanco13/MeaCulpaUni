"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CharacterClassPicker } from "@/components/character-class-picker";
import { CharacterHeroPreview } from "@/components/character-hero-preview";

export default function NuevoPersonajePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [classType, setClassType] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!classType) {
      setError("Elige la clase de tu heroe.");
      return;
    }
    const res = await fetch("/api/personajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, classType: classType || null }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al crear personaje.");
      return;
    }
    router.push("/personajes");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-start">
        <Link
          href="/personajes"
          className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </div>
      <div className="mx-auto max-w-5xl card-parchment p-6 sm:p-8">
        <h1 className="mb-2 text-center font-medieval text-2xl font-bold text-dnd-ink sm:text-3xl">
          Nuevo personaje (ranura gratis)
        </h1>
        <p className="mb-6 text-center text-sm text-dnd-ink/70">
          Vista previa a la izquierda (o arriba en móvil); nombre y retratos a la derecha.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <aside className="mx-auto w-full max-w-[280px] shrink-0 lg:sticky lg:top-24 lg:mx-0">
              <CharacterHeroPreview classValue={classType} heroName={name} />
            </aside>
            <div className="min-w-0 flex-1 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dnd-ink mb-1">
              Nombre del personaje
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-black placeholder:text-neutral-500"
            />
          </div>
          <div>
            <p className="mb-2 block text-sm font-medium text-dnd-ink">Clase y retrato</p>
            <CharacterClassPicker value={classType} onChange={setClassType} showPreview={false} />
          </div>
            </div>
          </div>
          {error && <p className="text-dnd-red text-sm">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="flex-1 btn-gold py-2 min-w-[140px]">
              Crear personaje
            </button>
            <Link
              href="/personajes"
              className="inline-flex items-center justify-center px-4 py-2 border-2 border-dnd-ink/30 rounded hover:bg-dnd-ink/10"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
