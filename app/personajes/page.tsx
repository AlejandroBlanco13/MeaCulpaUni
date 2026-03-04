import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FREE_CHARACTER_SLOTS } from "@/lib/utils";
import Link from "next/link";
import { Users, Lock, Plus } from "lucide-react";

export default async function PersonajesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/personajes");
  }

  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true });

  const list = characters ?? [];
  const freeUsed = list.filter((c) => c.is_free_slot).length;
  const canCreateFree = freeUsed < FREE_CHARACTER_SLOTS;
  const paidCount = list.filter((c) => !c.is_free_slot).length;

  return (
    <div className="space-y-6">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <Users className="w-8 h-8" />
        Personajes
      </h1>
      <p className="text-dnd-ink/70">
        Tienes <strong>{FREE_CHARACTER_SLOTS} personajes gratis</strong>. El resto son de pago.
        Actualmente usas {freeUsed} ranuras gratis y {paidCount} personajes de pago.
      </p>
      {list.length === 0 ? (
        <div className="card-parchment p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-dnd-ink/40 mb-4" />
          <p className="text-dnd-ink/70">Aún no tienes personajes.</p>
          {canCreateFree && (
            <Link
              href="/personajes/nuevo"
              className="btn-gold inline-flex items-center gap-2 mt-4"
            >
              <Plus className="w-4 h-4" />
              Crear personaje (gratis)
            </Link>
          )}
        </div>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.id} className="card-parchment p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medieval text-xl font-semibold text-dnd-ink">
                      {c.name}
                    </h2>
                    <p className="text-sm text-dnd-ink/70">
                      {c.class_type ?? "Sin clase"} · Nivel {c.level}
                    </p>
                    <span
                      className={
                        c.is_free_slot
                          ? "text-dnd-forest text-sm"
                          : "text-dnd-gold text-sm flex items-center gap-1"
                      }
                    >
                      {c.is_free_slot ? (
                        "Gratis"
                      ) : (
                        <>
                          <Lock className="w-3 h-3" /> De pago
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {canCreateFree && (
            <Link
              href="/personajes/nuevo"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear otro personaje (gratis)
            </Link>
          )}
          {!canCreateFree && (
            <div className="card-parchment p-4 border-dnd-gold/50">
              <p className="text-dnd-ink/80">
                Has usado tus 2 personajes gratis. Para más personajes, desbloquea la suscripción de pago.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
