import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FREE_CHARACTER_SLOTS } from "@/lib/utils";
import Link from "next/link";
import { Users, Lock, Shield, Trophy, Sparkles, ArrowLeft } from "lucide-react";
import { CreateCharacterModal } from "@/components/create-character-modal";
import { CharacterActions } from "@/components/character-actions";
import Image from "next/image";
import { getPortraitForClass, normalizeClassLabelForStats } from "@/lib/character-classes";
import personajesBg from "@/app/IMG/Personajes/Personajes.png";

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
  const { data: inventoryItems } = await supabase
    .from("inventory_items")
    .select("id, item_id, quantity")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  const list = characters ?? [];
  const inventory = inventoryItems ?? [];
  const freeUsed = list.filter((c) => c.is_free_slot).length;
  const canCreateFree = freeUsed < FREE_CHARACTER_SLOTS;
  const paidCount = list.filter((c) => !c.is_free_slot).length;
  const classCount = list.reduce<Record<string, number>>((acc, c) => {
    const k = normalizeClassLabelForStats(c.class_type);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const tierBuckets = TIERS.map((tier) => ({
    tier,
    items: list.filter((c) => getTier(c.level).key === tier.key),
  }));

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[1] h-dvh min-h-dvh w-full max-w-none min-w-full overflow-hidden"
        aria-hidden
      >
        <div className="relative h-full min-h-dvh w-full min-w-full">
          <Image
            src={personajesBg}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 min-h-dvh w-full bg-gradient-to-b from-black/80 via-black/72 to-black/85" />
        <div className="absolute inset-0 min-h-dvh w-full bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,transparent_0%,rgba(0,0,0,0.45)_75%)]" />
      </div>

      <div className="relative z-[2] min-h-dvh w-full min-w-0">
        <div className="mx-auto w-full max-w-7xl space-y-7 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
          <div className="rounded-md border border-dnd-gold/45 bg-black/50 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.55)] ring-1 ring-dnd-gold/25 backdrop-blur-md sm:bg-black/45 sm:p-6">
            <div className="flex justify-start">
              <Link
                href="/"
                className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Link>
            </div>

            <header className="mt-4 rounded-md border border-dnd-gold/20 bg-black/40 px-5 py-5 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-7">
              <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-3 sm:text-4xl">
                <Users className="w-8 h-8 shrink-0 text-dnd-gold" />
                Registro de heroes
              </h1>
              <p className="mt-2 text-sm text-dnd-ink/70 sm:text-base">
                Tienes <strong>{FREE_CHARACTER_SLOTS} heroes gratis</strong>. El resto son de pago.
                Actualmente usas {freeUsed} ranuras gratis y {paidCount} heroes de pago.
              </p>
              <p className="mt-2 text-sm text-dnd-ink/65 sm:text-base">
                Organizacion RPG: cada heroe se clasifica por <strong>asignacion (clase)</strong> y por{" "}
                <strong>ELO/Rango</strong> segun su nivel.
              </p>
            </header>

            <div className="mt-8 space-y-7 rounded-xl border border-neutral-800/80 bg-[#121212]/88 p-5 shadow-inner backdrop-blur-sm sm:p-7">
              {list.length > 0 && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-md border border-dnd-gold/15 bg-black/35 p-5 sm:p-6">
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
                  <div className="rounded-md border border-dnd-gold/15 bg-black/35 p-5 sm:p-6">
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
                <div className="rounded-md border border-dnd-gold/20 bg-black/30 p-10 text-center sm:p-14">
                  <Users className="mx-auto mb-4 h-16 w-16 text-dnd-gold/55" />
                  <p className="text-base text-dnd-ink/80 sm:text-lg">Aun no tienes heroes asignados.</p>
                  {canCreateFree && (
                    <div className="mt-4 flex justify-center">
                      <CreateCharacterModal triggerLabel="Crear personaje (gratis)" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-7">
                  {tierBuckets.map(({ tier, items }) =>
                    items.length ? (
                      <section key={tier.key} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-dnd-gold/20 pb-2">
                          <p className={`font-medieval text-xl sm:text-2xl ${tier.color}`}>{tier.label}</p>
                          <p className="text-xs uppercase tracking-widest text-dnd-ink/50">{tier.range}</p>
                        </div>
                        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {items.map((c) => (
                            <li key={c.id} className="card-parchment overflow-hidden rounded-md">
                              <div className="flex flex-col sm:flex-row sm:items-stretch">
                                <div className="relative aspect-[4/5] w-full shrink-0 sm:aspect-auto sm:min-h-[180px] sm:w-40">
                                  <Image
                                    src={getPortraitForClass(c.class_type)}
                                    alt=""
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 640px) 100vw, 160px"
                                  />
                                </div>
                                <div className="min-w-0 flex-1 p-5 sm:p-6">
                                  <h2 className="truncate font-medieval text-xl font-semibold text-dnd-ink sm:text-2xl">
                                    {c.name}
                                  </h2>
                                  <p className="mt-1 text-sm text-dnd-ink/70 sm:text-base">
                                    {normalizeClassLabelForStats(c.class_type)} · Nivel {c.level}
                                  </p>
                                  <p className={`mt-2 text-xs sm:text-sm ${getTier(c.level).color}`}>
                                    ELO: {getTier(c.level).label}
                                  </p>
                                  <span
                                    className={
                                      c.is_free_slot
                                        ? "mt-2 inline-flex items-center gap-1 text-sm text-dnd-forest sm:text-base"
                                        : "mt-2 inline-flex items-center gap-1 text-sm text-dnd-gold sm:text-base"
                                    }
                                  >
                                    {c.is_free_slot ? (
                                      <>
                                        <Sparkles className="h-3 w-3" /> Gratis
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="h-3 w-3" /> De pago
                                      </>
                                    )}
                                  </span>
                                  <CharacterActions
                                    character={{
                                      id: c.id,
                                      name: c.name,
                                      class_type: c.class_type ?? null,
                                      level: c.level,
                                    }}
                                    inventoryItems={inventory}
                                  />
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null
                  )}
                  {canCreateFree && (
                    <div className="flex justify-center">
                      <CreateCharacterModal triggerLabel="Crear otro personaje (gratis)" />
                    </div>
                  )}
                  {!canCreateFree && (
                    <div className="rounded-md border border-dnd-gold/40 bg-black/35 p-4 sm:p-5">
                      <p className="text-sm text-dnd-ink/85 sm:text-base">
                        Has usado tus 2 personajes gratis. Para más personajes, desbloquea la suscripción de pago.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
