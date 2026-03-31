import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Coins, Shield, Package, ArrowLeft, AlertTriangle } from "lucide-react";
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
  const { data: profile } = session?.user?.id
    ? await supabase.from("profiles").select("wallet_balance").eq("id", session.user.id).single()
    : { data: null };
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-12 pt-20 sm:px-6 lg:px-8">
      <Link
        href="/tiendas"
        className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Tiendas
      </Link>

      <section className="overflow-hidden rounded-md border border-dnd-gold/25 bg-black/30 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
        <div className="relative">
          {store.image_url ? (
            <img src={store.image_url} alt={store.name} className="h-52 w-full object-cover sm:h-64" />
          ) : (
            <div className="flex h-52 w-full items-center justify-center bg-black/35 sm:h-64">
              <Package className="h-12 w-12 text-dnd-gold/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
            <h1 className="font-medieval text-3xl font-bold text-dnd-ink sm:text-4xl">{store.name}</h1>
            {store.description && <p className="mt-2 max-w-3xl text-sm text-dnd-ink/80">{store.description}</p>}
          </div>
        </div>

        <div className="grid gap-4 border-t border-dnd-gold/20 px-6 py-5 sm:grid-cols-3">
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Saldo</p>
            <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
              <Coins className="h-5 w-5 text-dnd-gold/85" />
              {typeof profile?.wallet_balance === "number" ? profile.wallet_balance : "Inicia sesión"}
            </p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Productos</p>
            <p className="mt-2 font-medieval text-2xl text-dnd-ink">{products.length}</p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Stock total</p>
            <p className="mt-2 font-medieval text-2xl text-dnd-ink">{totalStock}</p>
          </article>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medieval text-2xl font-semibold text-dnd-ink">Catálogo de productos</h2>
        {isAdmin && (
          <Link
            href={`/admin/tiendas/${store.id}`}
            className="inline-flex items-center gap-2 rounded border border-dnd-ink/25 bg-black/25 px-3 py-2 text-sm text-dnd-ink hover:bg-dnd-ink/10"
          >
            <Shield className="h-4 w-4" />
            Editar tienda
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="card-parchment p-10 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-dnd-ink/50" />
          <p className="text-dnd-ink/70">No hay productos en esta tienda todavía.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-md border border-dnd-ink/20 bg-black/25">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-black/35">
                  <Package className="h-10 w-10 text-dnd-gold/60" />
                </div>
              )}

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medieval text-xl text-dnd-ink">{p.name}</h3>
                  <span
                    className={
                      p.stock > 0
                        ? "rounded border border-emerald-300/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-200"
                        : "rounded border border-red-300/50 bg-red-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-red-200"
                    }
                  >
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-dnd-ink/70">{p.description ?? "Sin descripción."}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-dnd-gold">
                  <Coins className="h-4 w-4" />
                  {p.price} monedas
                </p>

                {session ? (
                  <ComprarButton
                    productId={p.id}
                    stock={p.stock}
                    price={p.price}
                    canAfford={typeof profile?.wallet_balance === "number" ? profile.wallet_balance >= p.price : false}
                  />
                ) : (
                  <p className="inline-flex items-center gap-1 text-xs text-amber-200/80">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Inicia sesión para comprar.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
