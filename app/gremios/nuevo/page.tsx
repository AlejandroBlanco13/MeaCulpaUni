"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoGremioPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/gremios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, maxMembers }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al crear gremio.");
      return;
    }
    router.push(`/gremios/${data.guild.id}`);
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md card-parchment p-8 shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
        <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-6 text-center">
          Crear gremio
        </h1>
        <p className="text-sm text-dnd-ink/70 mb-4">
          Los gremios pueden tener hasta 10 miembros por defecto (expandible).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dnd-ink mb-1">
              Nombre del gremio
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
            <label htmlFor="description" className="block text-sm font-medium text-dnd-ink mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="min-h-[7.5rem] w-full resize-y px-3 py-2.5 border-2 border-dnd-ink/20 rounded bg-white text-black placeholder:text-neutral-500"
            />
          </div>
          <div>
            <label htmlFor="maxMembers" className="block text-sm font-medium text-dnd-ink mb-1">
              Máximo de miembros (expandible)
            </label>
            <input
              id="maxMembers"
              type="number"
              min={2}
              max={50}
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value) || 10)}
              className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-black placeholder:text-neutral-500"
            />
          </div>
          {error && <p className="text-dnd-red text-sm">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 btn-gold py-2">
              Crear gremio
            </button>
            <Link
              href="/gremios"
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
