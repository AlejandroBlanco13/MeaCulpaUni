"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Store = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  slug: string;
  products: { id: string; name: string; description: string | null; image_url: string | null; price: number; stock: number }[];
};

export function EditarTiendaForm({ store }: { store: Store }) {
  const router = useRouter();
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description ?? "");
  const [imageUrl, setImageUrl] = useState(store.image_url ?? "");
  const [saving, setSaving] = useState(false);

  async function saveStore(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/tiendas/${store.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, imageUrl }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveStore} className="card-parchment p-6 space-y-4">
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink">
          Datos de la tienda
        </h2>
        <div>
          <label className="block text-sm font-medium text-dnd-ink mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dnd-ink mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dnd-ink mb-1">URL imagen</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-gold py-2 px-4">
          {saving ? "Guardando..." : "Guardar tienda"}
        </button>
      </form>

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">
          Productos
        </h2>
        <ul className="space-y-4">
          {store.products.map((p) => (
            <li key={p.id}>
              <EditarProductoForm product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function EditarProductoForm({
  product,
}: {
  product: { id: string; name: string; description: string | null; image_url: string | null; price: number; stock: number };
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [imageUrl, setImageUrl] = useState(product.image_url ?? "");
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/productos/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, imageUrl, price, stock }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="card-parchment p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-dnd-ink/80">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dnd-ink/80">Precio (monedas)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-dnd-ink/80">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-dnd-ink/80">URL imagen</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-48 px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-dnd-ink/80">Stock</label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-dnd-ink/20 rounded bg-white text-dnd-ink text-sm"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-gold py-1 px-3 text-sm">
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
