import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function InventarioPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/inventario");
  }

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
          <Package className="w-8 h-8" />
          Inventario
        </h1>
      </div>
      <p className="text-dnd-ink/70">
        Objetos y equipo de tu personaje. Aquí aparecen los ítems que posees.
      </p>
      {!items?.length ? (
        <div className="card-parchment p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-dnd-ink/40 mb-4" />
          <p className="text-dnd-ink/70">Tu inventario está vacío.</p>
          <p className="text-sm text-dnd-ink/60 mt-2">
            Compra objetos en las <Link href="/tiendas" className="text-dnd-gold hover:underline">tiendas</Link> o recibe ítems en misiones.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="card-parchment p-4 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-dnd-ink">Ítem #{item.item_id}</span>
                <span className="ml-2 text-dnd-ink/70">x{item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
