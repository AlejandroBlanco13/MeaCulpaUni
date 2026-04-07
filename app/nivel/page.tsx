import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  Shield,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Users,
  Target,
  ChevronRight,
} from "lucide-react";
import nivelBg from "@/app/IMG/Nivel/Nivel.png";

/** XP de cuenta necesaria para pasar de principiante a experimentado (perfil). */
const XP_CUENTA_PARA_EXPERIMENTADO = 100;

export default async function NivelPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/nivel");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("level, experience")
    .eq("id", session.user.id)
    .single();

  const level = profile?.level ?? "principiante";
  const experience = profile?.experience ?? 0;
  const isPrincipiante = level === "principiante";
  const xpToNext = XP_CUENTA_PARA_EXPERIMENTADO;
  const progress = Math.min(100, (experience / xpToNext) * 100);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[1] h-dvh min-h-dvh w-full max-w-none min-w-full overflow-hidden"
        aria-hidden
      >
        <div className="relative h-full min-h-dvh w-full min-w-full">
          <Image
            src={nivelBg}
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
                <Shield className="w-8 h-8 shrink-0 text-dnd-gold" />
                Progreso de cuenta
              </h1>
              <p className="mt-2 text-sm text-dnd-ink/70 sm:text-base">
                Aquí ves tu <strong>rango de jugador</strong> (Principiante o Experimentado) y la{" "}
                <strong>experiencia de cuenta</strong> que ganas en la campaña. Es independiente del{" "}
                <strong>nivel numérico de cada héroe</strong>, que define combate y ELO en el registro de héroes.
              </p>
            </header>

            <div className="mt-8 space-y-8 rounded-xl border border-neutral-800/80 bg-[#121212]/88 p-5 shadow-inner backdrop-blur-sm sm:p-7">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-md border border-dnd-gold/15 bg-black/35 p-5 sm:p-6">
                  <h2 className="font-medieval text-xl font-semibold text-dnd-ink flex items-center gap-2">
                    {isPrincipiante ? (
                      <Shield className="w-6 h-6 shrink-0 text-dnd-forest" />
                    ) : (
                      <Sparkles className="w-6 h-6 shrink-0 text-dnd-gold" />
                    )}
                    Tu rango actual
                  </h2>
                  <p className="mt-3 text-lg font-semibold text-dnd-ink">
                    {isPrincipiante ? "Principiante" : "Experimentado"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dnd-ink/75">
                    {isPrincipiante
                      ? "Estás empezando el camino. Completa misiones y actividades para sumar XP de cuenta; al alcanzar el umbral pasas a Experimentado y desbloqueas ventajas en la mesa."
                      : "Has consolidado tu experiencia como jugador. Sigue participando en la campaña para mantener tu progreso y disfrutar del contenido reservado a cuentas experimentadas."}
                  </p>
                </div>

                <div className="rounded-md border border-dnd-gold/15 bg-black/35 p-5 sm:p-6">
                  <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-1 flex items-center gap-2">
                    <Target className="w-5 h-5 shrink-0 text-dnd-gold" />
                    Experiencia de cuenta
                  </h2>
                  <p className="text-sm text-dnd-ink/65">
                    XP acumulada en tu perfil (no es la XP de subir nivel de un personaje concreto).
                  </p>
                  <p className="mt-4 text-dnd-ink/80">
                    <strong className="font-medieval text-2xl text-dnd-gold">{experience}</strong>{" "}
                    <span className="text-dnd-ink/70">XP</span>
                    {isPrincipiante && (
                      <span className="text-sm text-dnd-ink/55">
                        {" "}
                        / {xpToNext} para alcanzar Experimentado
                      </span>
                    )}
                  </p>
                  {isPrincipiante && (
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs uppercase tracking-wider text-dnd-ink/50">
                        <span>Camino a Experimentado</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-dnd-ink/10 ring-1 ring-dnd-gold/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-dnd-forest/90 to-dnd-gold transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {!isPrincipiante && (
                    <p className="mt-4 rounded-md border border-dnd-gold/25 bg-black/20 px-3 py-2 text-sm text-dnd-ink/75">
                      No necesitas más XP de cuenta para el rango: ya eres{" "}
                      <strong className="text-dnd-gold">Experimentado</strong>.
                    </p>
                  )}
                </div>
              </div>

              <section className="rounded-md border border-dnd-gold/20 bg-black/30 px-5 py-6 backdrop-blur-sm sm:px-7">
                <h2 className="font-medieval text-xl font-semibold text-dnd-ink flex items-center gap-2 sm:text-2xl">
                  <BookOpen className="w-6 h-6 shrink-0 text-dnd-gold" />
                  Cómo se usan los &ldquo;niveles&rdquo; en la mesa
                </h2>
                <p className="mt-2 text-sm text-dnd-ink/70 sm:text-base">
                  Hay <strong>dos ideas distintas</strong>: no las mezcles al leer reglas o recompensas.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-md border border-dnd-ink/15 bg-dnd-parchment/40 p-4 sm:p-5">
                    <p className="font-medieval text-lg text-dnd-ink flex items-center gap-2">
                      <Shield className="w-5 h-5 text-dnd-forest" />
                      1. Cuenta (esta página)
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-dnd-ink/78">
                      <li>
                        Rangos <span className="text-dnd-forest font-medium">Principiante</span> y{" "}
                        <span className="text-dnd-gold font-medium">Experimentado</span>.
                      </li>
                      <li>
                        Ganas <strong>XP de cuenta</strong> jugando la campaña y completando misiones (según lo que marque el DM o el sistema).
                      </li>
                      <li>
                        Al llegar a <strong>{XP_CUENTA_PARA_EXPERIMENTADO} XP</strong> de cuenta, pasas a Experimentado si el juego lo aplica a tu perfil.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-md border border-dnd-ink/15 bg-dnd-parchment/40 p-4 sm:p-5">
                    <p className="font-medieval text-lg text-dnd-ink flex items-center gap-2">
                      <Users className="w-5 h-5 text-dnd-gold" />
                      2. Héroes (registro de personajes)
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-dnd-ink/78">
                      <li>
                        Cada héroe tiene un <strong>nivel numérico</strong> (1, 2, 3…) que sube con su propia XP en la ficha.
                      </li>
                      <li>
                        Ese nivel define <strong>estadísticas</strong> y el <strong>ELO / rango</strong> (Iniciado, Veterano, Elite, Legendario) que ves en Héroes.
                      </li>
                      <li>
                        La XP para el siguiente nivel del personaje usa la fórmula del panel del héroe:{" "}
                        <span className="whitespace-nowrap text-dnd-ink/85">
                          siguiente = nivel × 100 + (nivel − 1) × 25
                        </span>
                        .
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-dnd-ink/65">
                    Gestiona niveles y ELO de tus personajes en el registro de héroes.
                  </p>
                  <Link
                    href="/personajes"
                    className="realms-btn realms-btn-outline inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/95"
                  >
                    Ir a héroes
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
