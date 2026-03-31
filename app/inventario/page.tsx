import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { InventoryHeroManager } from "@/components/inventory-hero-manager";
import { parseInventoryMetadata } from "@/lib/inventory";

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
  const { data: heroes } = await supabase
    .from("characters")
    .select("id, name, class_type, level")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true });

  const inventoryItems = items ?? [];
  const productIds = Array.from(new Set(inventoryItems.map((item) => item.item_id)));
  const { data: products } = productIds.length
    ? await supabase.from("store_products").select("id, name").in("id", productIds)
    : { data: [] as { id: string; name: string }[] };

  const productMap = new Map((products ?? []).map((p) => [p.id, p.name]));

  const managerItems = inventoryItems.map((item) => {
    const metadata = parseInventoryMetadata(item.metadata);
    return {
      id: item.id as string,
      itemId: item.item_id as string,
      quantity: item.quantity as number,
      productName: productMap.get(item.item_id as string) ?? `Ítem #${item.item_id}`,
      characterId: metadata.characterId,
    };
  });

  const managerHeroes = (heroes ?? []).map((hero) => ({
    id: hero.id as string,
    name: hero.name as string,
    classType: (hero.class_type as string | null) ?? null,
    level: (hero.level as number) ?? 1,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-12 pt-20 sm:px-6 lg:px-8">
      <div className="rounded-md border border-dnd-gold/45 bg-gradient-to-br from-[#030303] via-[#120808] to-[#050505] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.55)] ring-1 ring-dnd-gold/25 sm:p-6">
        <div className="flex justify-start">
          <Link
            href="/"
            className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
        <div className="mt-4 flex justify-center">
          <h1 className="inline-flex items-center gap-2 text-center font-medieval text-3xl font-bold text-dnd-ink sm:text-4xl">
            <Package className="w-8 h-8" />
            Inventario
          </h1>
        </div>
        <p className="mt-2 text-center text-dnd-ink/70">
          Administra objetos y asígnalos a tus héroes de forma clara y ordenada.
        </p>
        <div className="mt-6">
          <InventoryHeroManager heroes={managerHeroes} items={managerItems} />
        </div>
      </div>
    </div>
  );
}
