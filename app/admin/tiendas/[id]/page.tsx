import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EditarTiendaForm } from "./editar-tienda-form";

export default async function AdminTiendaPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("*, store_products(*)")
    .eq("id", params.id)
    .single();
  if (!store) notFound();

  const storeForForm = {
    id: store.id,
    name: store.name,
    description: store.description ?? null,
    image_url: store.image_url ?? null,
    slug: store.slug,
    products: (store.store_products ?? []) as { id: string; name: string; description: string | null; image_url: string | null; price: number; stock: number }[],
  };

  return (
    <div className="space-y-8">
      <Link href="/tiendas" className="text-dnd-gold hover:underline text-sm">
        ← Volver a Tiendas
      </Link>
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink">
        Editar tienda: {store.name}
      </h1>
      <p className="text-dnd-ink/70">
        Como administrador puedes modificar precios, fotos y descripción de la tienda y sus productos.
      </p>
      <EditarTiendaForm store={storeForForm} />
    </div>
  );
}
