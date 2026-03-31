"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

const CLASSES = ["Guerrero", "Mago", "Ladron", "Clerigo", "Explorador", "Bardo"];

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
            className="w-full max-w-lg card-parchment p-7 sm:p-8 shadow-2xl"
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
                <label htmlFor="hero-class" className="mb-1 block text-sm font-medium text-dnd-ink">
                  Clase
                </label>
                <select
                  id="hero-class"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  disabled={loading}
                  className="w-full rounded border-2 border-dnd-ink/20 bg-white px-3 py-2 text-[#1a120f] focus:border-dnd-gold focus:outline-none"
                >
                  <option value="">Elegir...</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
