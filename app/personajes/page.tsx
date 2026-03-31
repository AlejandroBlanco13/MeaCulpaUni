import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FREE_CHARACTER_SLOTS } from "@/lib/utils";
import { Users, Lock, Shield, Trophy, Sparkles } from "lucide-react";
import { CreateCharacterModal } from "@/components/create-character-modal";

type HeroTier = {
  key: "iniciado" | "veterano" | "elite" | "legendario";
  label: string;
  range: string;
  color: string;
};

const TIERS: HeroTier[] = [
  { key: "iniciado", label: "Iniciado", range: "Nivel 1-3", color: "text-dnd-ink/70" },
  { key: "veterano", label: "Veterano", range: "Nivel 4-7", color: "text-dnd-forest" },
  { key: "elite", label: "Elite", range: "Nivel 8-11", color: "text-dnd-gold" },
  { key: "legendario", label: "Legendario", range: "Nivel 12+", color: "text-dnd-red" },
];

function getTier(level: number): HeroTier {
  if (level >= 12) return TIERS[3];
  if (level >= 8) return TIERS[2];
  if (level >= 4) return TIERS[1];
  return TIERS[0];
}

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
  const classCount = list.reduce<Record<string, number>>((acc, c) => {
    const k = c.class_type?.trim() || "Sin clase";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const tierBuckets = TIERS.map((tier) => ({
    tier,
    items: list.filter((c) => getTier(c.level).key === tier.key),
  }));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
      <header className="rounded-md border border-dnd-gold/20 bg-black/25 px-5 py-5 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-7">
        <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-3 sm:text-4xl">
          <Users className="w-8 h-8 text-dnd-gold" />
          Registro de heroes
        </h1>
        <p className="mt-2 text-sm text-dnd-ink/70 sm:text-base">
          Tienes <strong>{FREE_CHARACTER_SLOTS} heroes gratis</strong>. El resto son de pago.
          Actualmente usas {freeUsed} ranuras gratis y {paidCount} heroes de pago.
        </p>
        <p className="mt-2 text-sm text-dnd-ink/65 sm:text-base">
          Organizacion RPG: cada heroe se clasifica por <strong>asignacion (clase)</strong> y por <strong>ELO/Rango</strong>{" "}
          segun su nivel.
        </p>
      </header>

      {list.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card-parchment rounded-md p-5 sm:p-6">
            <p className="font-medieval text-xl text-dnd-ink flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Elo por nivel
            </p>
            <ul className="mt-4 space-y-2 text-sm sm:text-base">
              {TIERS.map((tier) => {
                const count = tierBuckets.find((t) => t.tier.key === tier.key)?.items.length ?? 0;
                return (
                  <li key={tier.key} className="flex items-center justify-between border-b border-dnd-ink/10 pb-1.5">
                    <span className={`${tier.color} font-medium`}>
                      {tier.label} <span className="text-dnd-ink/50">({tier.range})</span>
                    </span>
                    <span className="text-dnd-ink/70">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card-parchment rounded-md p-5 sm:p-6">
            <p className="font-medieval text-xl text-dnd-ink flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Asignacion por clase
            </p>
            <ul className="mt-4 space-y-2 text-sm sm:text-base">
              {Object.entries(classCount)
                .sort((a, b) => b[1] - a[1])
                .map(([cls, count]) => (
                  <li key={cls} className="flex items-center justify-between border-b border-dnd-ink/10 pb-1.5">
                    <span className="text-dnd-ink/80">{cls}</span>
                    <span className="text-dnd-ink/70">{count}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="card-parchment rounded-md p-10 text-center sm:p-14">
          <Users className="w-16 h-16 mx-auto text-dnd-gold/55 mb-4" />
          <p className="text-dnd-ink/80 text-base sm:text-lg">Aun no tienes heroes asignados.</p>
          {canCreateFree && (
            <div className="mt-4 flex justify-center">
              <CreateCharacterModal triggerLabel="Crear personaje (gratis)" />
            </div>
          )}
        </div>
      ) : (
        <>
          {tierBuckets.map(({ tier, items }) =>
            items.length ? (
              <section key={tier.key} className="space-y-4">
                <div className="flex items-center justify-between border-b border-dnd-gold/20 pb-2">
                  <p className={`font-medieval text-xl sm:text-2xl ${tier.color}`}>{tier.label}</p>
                  <p className="text-xs uppercase tracking-widest text-dnd-ink/50">{tier.range}</p>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((c) => (
                    <li key={c.id} className="card-parchment rounded-md p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="font-medieval text-xl sm:text-2xl font-semibold text-dnd-ink truncate">{c.name}</h2>
                          <p className="text-sm sm:text-base text-dnd-ink/70 mt-1">
                            {c.class_type ?? "Sin clase"} · Nivel {c.level}
                          </p>
                          <p className={`text-xs sm:text-sm mt-2 ${getTier(c.level).color}`}>
                            ELO: {getTier(c.level).label}
                          </p>
                          <span
                            className={
                              c.is_free_slot
                                ? "text-dnd-forest text-sm sm:text-base inline-flex items-center gap-1 mt-2"
                                : "text-dnd-gold text-sm sm:text-base inline-flex items-center gap-1 mt-2"
                            }
                          >
                            {c.is_free_slot ? (
                              <>
                                <Sparkles className="w-3 h-3" /> Gratis
                              </>
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
              </section>
            ) : null
          )}
          {canCreateFree && (
            <CreateCharacterModal triggerLabel="Crear otro personaje (gratis)" />
          )}
          {!canCreateFree && (
            <div className="card-parchment rounded-md border border-dnd-gold/40 p-4 sm:p-5">
              <p className="text-dnd-ink/85 text-sm sm:text-base">
                Has usado tus 2 personajes gratis. Para más personajes, desbloquea la suscripción de pago.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
