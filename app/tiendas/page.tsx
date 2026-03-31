import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Store as StoreIcon, Coins, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default async function TiendasPage() {
  const session = await getSession();
  const supabase = await createClient();
  const { data: stores } = await supabase
    .from("stores")
    .select("*, store_products(id)")
    .eq("is_active", true)
    .order("name");
  const { data: profile } = session?.user?.id
    ? await supabase.from("profiles").select("wallet_balance").eq("id", session.user.id).single()
    : { data: null };

  const list = stores ?? [];
  const totalProducts = list.reduce((acc, store) => acc + ((store.store_products as unknown[])?.length ?? 0), 0);
  const totalStores = list.length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-12 pt-20 sm:px-6 lg:px-8">
      <div className="flex justify-start">
        <Link
          href="/"
          className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <section className="overflow-hidden rounded-md border border-dnd-gold/25 bg-black/30 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
        <div className="border-b border-dnd-gold/20 bg-gradient-to-r from-[#1a120f]/80 via-[#2a1b16]/80 to-[#171518]/80 px-6 py-7">
          <p className="text-xs uppercase tracking-[0.28em] text-dnd-gold/75">Mercado de Mea Culpa</p>
          <h1 className="mt-2 inline-flex items-center gap-3 font-medieval text-3xl font-bold text-dnd-ink sm:text-4xl">
            <StoreIcon className="h-8 w-8 text-dnd-gold/80" />
            Tiendas del Reino
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-dnd-ink/75">
            Explora comerciantes oficiales, compara precios y equipa a tus héroes con una economía viva conectada al
            inventario.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Tiendas activas</p>
            <p className="mt-2 font-medieval text-2xl text-dnd-ink">{totalStores}</p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Productos listados</p>
            <p className="mt-2 font-medieval text-2xl text-dnd-ink">{totalProducts}</p>
          </article>
          <article className="rounded-md border border-dnd-ink/20 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Saldo disponible</p>
            <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
              <Coins className="h-5 w-5 text-dnd-gold/85" />
              {typeof profile?.wallet_balance === "number" ? profile.wallet_balance : "Inicia sesión"}
            </p>
          </article>
        </div>
      </section>

      {list.length === 0 ? (
        <div className="card-parchment p-12 text-center">
          <StoreIcon className="mx-auto mb-4 h-16 w-16 text-dnd-ink/40" />
          <p className="font-medieval text-2xl text-dnd-ink">Aún no hay tiendas activas.</p>
          <p className="mt-2 text-sm text-dnd-ink/65">Cuando un administrador publique comercios, aparecerán aquí.</p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((store) => (
            <li key={store.id}>
              <Link
                href={`/tiendas/${store.slug}`}
                className="group block overflow-hidden rounded-md border border-dnd-ink/20 bg-black/25 p-0 transition-colors hover:border-dnd-gold/50"
              >
                <div className="relative">
                  {store.image_url ? (
                    <img src={store.image_url} alt={store.name} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-black/35">
                      <StoreIcon className="h-10 w-10 text-dnd-gold/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <p className="absolute bottom-3 right-3 rounded border border-dnd-gold/40 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-wider text-dnd-gold/90">
                    Comercio oficial
                  </p>
                </div>

                <div className="space-y-2 px-5 py-4">
                  <h2 className="font-medieval text-2xl font-semibold text-dnd-ink group-hover:text-dnd-gold/90">
                    {store.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-dnd-ink/70">{store.description ?? "Sin descripción."}</p>
                  <div className="flex items-center justify-between pt-1 text-xs text-dnd-ink/70">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-300/90" />
                      Mercado validado
                    </span>
                    <span className="inline-flex items-center gap-1 text-dnd-gold/90">
                      <Sparkles className="h-3.5 w-3.5" />
                      {(store.store_products as unknown[]).length} producto(s)
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
