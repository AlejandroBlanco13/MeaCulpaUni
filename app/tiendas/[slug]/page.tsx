import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Coins, Shield } from "lucide-react";
import { ComprarButton } from "./comprar-button";

export default async function TiendaSlugPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("*, store_products(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();
  if (!store) notFound();

  const products = (store.store_products ?? []) as { id: string; name: string; description: string | null; image_url: string | null; price: number; stock: number }[];
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="space-y-6">
      <Link href="/tiendas" className="text-dnd-gold hover:underline text-sm">
        ← Volver a Tiendas
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-dnd-ink">{store.name}</h1>
          {store.description && (
            <p className="text-dnd-ink/70 mt-2">{store.description}</p>
          )}
        </div>
        {isAdmin && (
          <Link
            href={`/admin/tiendas/${store.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded bg-dnd-ink/10 text-dnd-ink"
          >
            <Shield className="w-4 h-4" />
            Editar tienda
          </Link>
        )}
      </div>
      {store.image_url && (
        <img
          src={store.image_url}
          alt={store.name}
          className="w-full max-h-64 object-cover rounded-lg border-2 border-dnd-ink/20"
        />
      )}
      <h2 className="font-medieval text-xl font-semibold text-dnd-ink">Productos</h2>
      {products.length === 0 ? (
        <p className="text-dnd-ink/70">No hay productos en esta tienda.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="card-parchment p-4">
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded border border-dnd-ink/20 mb-3"
                />
              )}
              <h3 className="font-medium text-dnd-ink">{p.name}</h3>
              <p className="text-sm text-dnd-ink/70 line-clamp-2">{p.description}</p>
              <p className="text-dnd-gold font-medium mt-2 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {p.price} monedas
              </p>
              {session && (
                <ComprarButton productId={p.id} stock={p.stock} price={p.price} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
