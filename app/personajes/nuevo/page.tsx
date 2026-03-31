"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CLASSES = ["Guerrero", "Mago", "Ladrón", "Clérigo", "Explorador", "Bardo"];

export default function NuevoPersonajePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [classType, setClassType] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
      <div className="max-w-md mx-auto card-parchment p-8">
        <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-6 text-center">
          Nuevo personaje (ranura gratis)
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
            />
          </div>
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-dnd-ink mb-1">
              Clase
            </label>
            <select
              id="class"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
            >
              <option value="">Elegir...</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-dnd-red text-sm">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 btn-gold py-2">
              Crear personaje
            </button>
            <Link
              href="/personajes"
              className="px-4 py-2 border-2 border-dnd-ink/30 rounded hover:bg-dnd-ink/10"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
