import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";

export default async function TiendasPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase
    .from("stores")
    .select("*, store_products(id)")
    .eq("is_active", true)
    .order("name");

  const list = stores ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <StoreIcon className="w-8 h-8" />
        Tiendas
      </h1>
      <p className="text-dnd-ink/70">
        Varias tiendas del reino. Los administradores pueden modificar precios, fotos y descripciones.
      </p>
      {list.length === 0 ? (
        <div className="card-parchment p-12 text-center">
          <StoreIcon className="w-16 h-16 mx-auto text-dnd-ink/40 mb-4" />
          <p className="text-dnd-ink/70">Aún no hay tiendas.</p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((store) => (
            <li key={store.id}>
              <Link
                href={`/tiendas/${store.slug}`}
                className="card-parchment p-6 block hover:border-dnd-gold/50 transition-colors"
              >
                {store.image_url && (
                  <img
                    src={store.image_url}
                    alt={store.name}
                    className="w-full h-40 object-cover rounded border border-dnd-ink/20 mb-4"
                  />
                )}
                <h2 className="font-medieval text-xl font-semibold text-dnd-ink">
                  {store.name}
                </h2>
                <p className="text-dnd-ink/70 text-sm mt-1 line-clamp-2">
                  {store.description ?? "Sin descripción."}
                </p>
                <p className="text-dnd-gold text-sm mt-2">
                  {(store.store_products as unknown[]).length} producto(s)
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
