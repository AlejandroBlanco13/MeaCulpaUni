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
    <div className="max-w-md mx-auto card-parchment p-8">
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
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
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
            rows={3}
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
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
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
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
  );
}
