"use client";

import { useState } from "react";

type VaultItem = { id: string; itemId: string; quantity: number };

export function VaultSection({
  guildId,
  items,
}: {
  guildId: string;
  items: VaultItem[];
}) {
  const [list, setList] = useState(items);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId.trim()) return;
    const res = await fetch(`/api/gremios/${guildId}/boveda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: itemId.trim(), quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      setList((prev) => [...prev, data.item]);
      setItemId("");
      setQuantity(1);
    }
  }

  async function removeItem(id: string) {
    const res = await fetch(`/api/gremios/${guildId}/boveda?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setList((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="card-parchment p-4">
      <ul className="space-y-2 mb-4">
        {list.length === 0 ? (
          <li className="text-dnd-ink/60 text-sm">La bóveda está vacía.</li>
        ) : (
          list.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between py-2 border-b border-dnd-ink/10 last:border-0"
            >
              <span>
                Ítem {i.itemId} x{i.quantity}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i.id)}
                className="text-dnd-red text-sm hover:underline"
              >
                Quitar
              </button>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={addItem} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-dnd-ink/70 mb-1">ID ítem</label>
          <input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="item-1"
            className="w-32 px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-dnd-ink/70 mb-1">Cantidad</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-20 px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
        <button type="submit" className="btn-gold py-1 px-3 text-sm">
          Añadir a bóveda
        </button>
      </form>
    </div>
  );
}
