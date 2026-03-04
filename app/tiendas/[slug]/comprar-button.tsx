"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ComprarButton({
  productId,
  stock,
  price,
}: {
  productId: string;
  stock: number;
  price: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function comprar() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/tiendas/comprar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError(data.error ?? "Error al comprar");
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={comprar}
        disabled={stock <= 0 || loading}
        className="text-sm btn-gold py-1 px-3"
      >
        {stock <= 0 ? "Sin stock" : loading ? "Comprando..." : "Comprar"}
      </button>
      {error && <p className="text-dnd-red text-xs mt-1">{error}</p>}
    </div>
  );
}
