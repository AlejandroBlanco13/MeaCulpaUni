"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { CharacterClassPicker } from "@/components/character-class-picker";
import { CharacterHeroPreview } from "@/components/character-hero-preview";

type Props = {
  triggerLabel: string;
  className?: string;
};

export function CreateCharacterModal({ triggerLabel, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [classType, setClassType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre del personaje es obligatorio.");
      return;
    }
    if (!classType) {
      setError("Elige la clase tocando el retrato del heroe.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/personajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, classType: classType || null }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al crear personaje.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    setName("");
    setClassType("");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "btn-gold inline-flex items-center gap-2"}
      >
        <Plus className="w-4 h-4" />
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => !loading && setOpen(false)}
          aria-hidden
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Crear personaje"
            className="w-full max-w-5xl card-parchment p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="font-medieval text-2xl font-bold text-dnd-ink">
                Nuevo personaje (ranura gratis)
              </h2>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                aria-label="Cerrar modal"
                className="rounded border border-dnd-ink/25 p-1.5 text-dnd-ink/70 hover:bg-dnd-ink/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <p className="text-sm text-dnd-ink/70">
                A la izquierda ves la <strong>vista previa</strong> como quedará en el registro. A la derecha, nombre y
                galería de retratos.
              </p>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                <aside className="mx-auto w-full max-w-[280px] shrink-0 lg:sticky lg:top-4 lg:mx-0">
                  <CharacterHeroPreview classValue={classType} heroName={name} />
                </aside>

                <div className="min-w-0 flex-1 space-y-4">
              <div>
                <label htmlFor="hero-name" className="mb-1 block text-sm font-medium text-dnd-ink">
                  Nombre del personaje
                </label>
                <input
                  id="hero-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                  className="w-full rounded border-2 border-dnd-ink/20 bg-white px-3 py-2 text-[#1a120f] placeholder:text-[#6b6259] focus:border-dnd-gold focus:outline-none"
                />
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-dnd-ink">Clase y retrato</p>
                <p className="mb-3 text-xs text-dnd-ink/65">
                  Toca un retrato para asignar la clase; la misma imagen se usa en las tarjetas del listado.
                </p>
                <CharacterClassPicker
                  id="hero-class"
                  value={classType}
                  onChange={setClassType}
                  disabled={loading}
                  showPreview={false}
                />
              </div>
                </div>
              </div>

              {error && <p className="text-sm text-dnd-red">{error}</p>}

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={loading} className="btn-gold flex-1 py-2 disabled:opacity-60">
                  {loading ? "Creando..." : "Crear personaje"}
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setOpen(false)}
                  className="rounded border-2 border-dnd-ink/30 px-4 py-2 hover:bg-dnd-ink/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
